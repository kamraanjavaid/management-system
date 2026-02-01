'use client';
import { useState, useEffect, useRef } from 'react';
import InventoryTable from '@/app/components/dashboard/inventory/InventoryTable';
import ProductModal from '@/app/components/dashboard/inventory/productModal';
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';
import { inventoryService, Product } from '@/app/services/inventoryService';

export default function InventoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockAlerts: 0,
    inventoryValue: 0,
  });
  const tableRef = useRef<{ loadProducts: () => void }>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const products = await inventoryService.getAllProducts();
      const totalItems = products.reduce((sum, p) => sum + p.stock, 0);
      const lowStockAlerts = products.filter(p => p.stock < 10).length;
      const inventoryValue = products.reduce((sum, p) => sum + (p.cost_price * p.stock), 0);
      
      setStats({
        totalItems,
        lowStockAlerts,
        inventoryValue,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleProductAdded = () => {
    loadStats();
    if (tableRef.current) {
      tableRef.current.loadProducts();
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
            <p className="text-sm text-gray-500">Manage your mobiles and accessories</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            + Add New Product
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white border rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Total Items</p>
            <p className="text-2xl font-bold">{stats.totalItems.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-white border rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Low Stock Alerts</p>
            <p className="text-2xl font-bold text-red-500">{stats.lowStockAlerts}</p>
          </div>
          <div className="p-4 bg-white border rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Inventory Value</p>
            <p className="text-2xl font-bold text-green-600">{stats.inventoryValue.toLocaleString()} PKR</p>
          </div>
        </div>

        <InventoryTable ref={tableRef} />
        
        {isModalOpen && (
          <ProductModal 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={handleProductAdded}
            onProductAdded={handleProductAdded}
            initialData={null}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}