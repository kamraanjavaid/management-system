// components/inventory/AddProductModal.tsx
export default function AddProductModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Product</h2>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select className="w-full mt-1 p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500">
              <option>Mobile Device</option>
              <option>Accessory</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input type="text" className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. S24 Ultra" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand</label>
              <input type="text" className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. Samsung" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input type="number" className="w-full mt-1 p-2 border rounded-lg" defaultValue="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cost ($)</label>
              <input type="number" className="w-full mt-1 p-2 border rounded-lg" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input type="number" className="w-full mt-1 p-2 border rounded-lg" placeholder="0.00" />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}