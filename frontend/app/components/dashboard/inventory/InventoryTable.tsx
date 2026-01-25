"use client";
import { Smartphone, Package, AlertTriangle } from 'lucide-react';

const mockData = [
  { id: 1, name: "iPhone 15", cat: "Mobile", cost: 800, sale: 950, stock: 12 },
  { id: 2, name: "Type-C Cable", cat: "Accessory", cost: 2, sale: 10, stock: 45 },
  { id: 3, name: "Airpods Pro", cat: "Accessory", cost: 180, sale: 240, stock: 2 },
];

export default function InventoryTable() {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-800 text-white text-xs uppercase">
          <tr>
            <th className="px-6 py-4">Item</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Purchase</th>
            <th className="px-6 py-4">Retail</th>
            <th className="px-6 py-4">Stock</th>
            <th className="px-6 py-4">Potential Profit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {mockData.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 font-bold text-gray-800">{item.name}</td>
              <td className="px-6 py-4">
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  {item.cat === 'Mobile' ? <Smartphone size={14}/> : <Package size={14}/>}
                  {item.cat}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-600">${item.cost}</td>
              <td className="px-6 py-4 font-semibold text-blue-600">${item.sale}</td>
              <td className="px-6 py-4">
                <span className={`font-bold ${item.stock < 5 ? 'text-red-500 flex items-center gap-1' : 'text-gray-800'}`}>
                  {item.stock} {item.stock < 5 && <AlertTriangle size={14}/>}
                </span>
              </td>
              <td className="px-6 py-4 text-green-600 font-bold">
                ${(item.sale - item.cost) * item.stock}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}