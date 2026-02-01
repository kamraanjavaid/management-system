"use client";
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { inventoryService, Product } from '@/app/services/inventoryService';
import { Pencil, Trash2 } from 'lucide-react';
import DeleteModal from '@/app/components/models/deleteModal';
import ProductModal from './productModal'; // Rename your add modal to this

interface InventoryTableRef {
  loadProducts: () => void;
}

const InventoryTable = forwardRef<InventoryTableRef>((props, ref) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteModalConfig, setDeleteModalConfig] = useState<{
    isOpen: boolean;
    productId: string | null;
    productName: string | null;
  }>({ isOpen: false, productId: null, productName: null });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({ loadProducts }));

  useEffect(() => { loadProducts(); }, []);

  const handleDeletedSuccess = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Loading...</div>;

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 font-semibold text-gray-600">Product Name</th>
            <th className="p-4 font-semibold text-gray-600">Category</th>
            <th className="p-4 font-semibold text-gray-600 text-center">Stock</th>
            <th className="p-4 font-semibold text-gray-600 text-right">Cost Price</th>
            <th className="p-4 font-semibold text-gray-600 text-right">Sale Price</th>
            <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50 transition">
              <td className="p-4">
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-gray-400">{item.brand}</p>
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.category === 'Mobile' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {item.category}
                </span>
              </td>
              <td className="p-4 text-center">
                <span className={`font-mono ${item.stock < 10 ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                  {item.stock}
                </span>
              </td>
              <td className="p-4 text-right font-semibold">${item.cost_price}</td>
              <td className="p-4 text-right font-semibold text-blue-600">${item.sale_price}</td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => setEditingProduct(item)} // Open edit modal
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={() => setDeleteModalConfig({ 
                      isOpen: true, 
                      productId: item.id, 
                      productName: item.name 
                    })}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Modal */}
      <DeleteModal 
        isOpen={deleteModalConfig.isOpen}
        productId={deleteModalConfig.productId}
        productName={deleteModalConfig.productName}
        onClose={() => setDeleteModalConfig({ ...deleteModalConfig, isOpen: false })}
        onDeleted={handleDeletedSuccess}
      />

      {/* Unified Add/Edit Modal */}
      {editingProduct && (
        <ProductModal 
          initialData={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={loadProducts}
          onProductAdded={loadProducts}
        />
      )}
    </div>
  );
});

InventoryTable.displayName = 'InventoryTable';
export default InventoryTable;