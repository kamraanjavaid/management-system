// components/inventory/InventoryTable.tsx
export default function InventoryTable() {
  // Logic: Fetch these from your NestJS API
  const products = [
    { id: 1, name: 'iPhone 16', brand: 'Apple', type: 'Mobile', stock: 18, price: 999 },
    { id: 2, name: 'USB-C Cable', brand: 'Generic', type: 'Accessory', stock: 45, price: 15 },
  ];

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 font-semibold text-gray-600">Product Name</th>
            <th className="p-4 font-semibold text-gray-600">Category</th>
            <th className="p-4 font-semibold text-gray-600 text-center">Stock</th>
            <th className="p-4 font-semibold text-gray-600 text-right">Price</th>
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
                  item.type === 'Mobile' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {item.type}
                </span>
              </td>
              <td className="p-4 text-center font-mono">{item.stock}</td>
              <td className="p-4 text-right font-semibold">${item.price}</td>
              <td className="p-4 text-right">
                <button className="text-blue-600 hover:underline mr-3">Edit</button>
                <button className="text-gray-400 hover:text-red-500 transition">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}