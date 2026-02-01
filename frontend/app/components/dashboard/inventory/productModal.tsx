"use client";
import { useState, useEffect } from 'react';
import { inventoryService, CreateProductDto, Product } from '@/app/services/inventoryService';

interface ProductModalProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData: Product | null; 
  onProductAdded: () => void;
}

export default function ProductModal({ onClose, onSuccess, onProductAdded, initialData }: ProductModalProps) {
  const [formData, setFormData] = useState<CreateProductDto>({
    name: '',
    brand: '',
    category: 'Mobile',
    stock: 0,
    cost_price: 0,
    sale_price: 0,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!initialData;

  // Sync form data when initialData changes (e.g., clicking a different edit button)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        brand: initialData.brand,
        category: initialData.category,
        stock: initialData.stock,
        cost_price: initialData.cost_price,
        sale_price: initialData.sale_price,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode && initialData) {
        await inventoryService.updateProduct(initialData.id, formData);
      } else {
        await inventoryService.createProduct(formData);
        onProductAdded();
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} product`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['stock', 'cost_price', 'sale_price'].includes(name) 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
            >
              <option value="Mobile">Mobile Device</option>
              <option value="Accessory">Accessory</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. S24 Ultra"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Samsung"
              />
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock</label>
                <input
                  type="text"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sale Price</label>
                <input
                  type="text"
                  name="sale_price"
                  value={formData.sale_price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-green-600 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cost Price</label>
              <input
                type="text"
                name="cost_price"
                value={formData.cost_price}
                onChange={handleChange}
                required
                step="0.01"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-bold"
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}