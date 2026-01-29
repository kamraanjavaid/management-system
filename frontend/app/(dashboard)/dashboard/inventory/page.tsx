'use client';
import { useState } from 'react';
import InventoryTable from '@/app/components/dashboard/inventory/InventoryTable';
import AddProductModal from '@/app/components/dashboard/inventory/AddProductModal';
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';

export default function InventoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Total Items</p>
          <p className="text-2xl font-bold">1,240</p>
        </div>
        <div className="p-4 bg-white border rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Low Stock Alerts</p>
          <p className="text-2xl font-bold text-red-500">12</p>
        </div>
        <div className="p-4 bg-white border rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Inventory Value</p>
          <p className="text-2xl font-bold text-green-600">$45,200</p>
        </div>
      </div>

      <InventoryTable />
      
      {isModalOpen && <AddProductModal onClose={() => setIsModalOpen(false)} />}
    </div>
    </ProtectedRoute>
    
  );
}