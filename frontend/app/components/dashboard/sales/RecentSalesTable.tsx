"use client";
import React from 'react';
import { Eye, Download, TrendingUp, User } from 'lucide-react';

// Mock Data: In your app, this will update every time "Complete Sale" is clicked
const salesHistory = [
  {
    id: "INV-1001",
    item: "iPhone 15",
    customer: "Zahid Khan",
    price: 950,
    cost: 800,
    staff: "Ali (Staff)",
    date: "10:30 AM",
    method: "Cash"
  },
  {
    id: "INV-1002",
    item: "Samsung 25W Charger",
    customer: "Sana Ahmed",
    price: 35,
    cost: 12,
    staff: "Admin",
    date: "11:15 AM",
    method: "Bank Transfer"
  },
];

export default function RecentSalesTable() {
  // Calculate today's quick stats from the table
  const totalRevenue = salesHistory.reduce((acc, sale) => acc + sale.price, 0);
  const totalProfit = salesHistory.reduce((acc, sale) => acc + (sale.price - sale.cost), 0);

  return (
    <div className="space-y-4">
      {/* Mini Stats for the Sales Page */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Today's Sales</p>
          <p className="text-xl font-black text-gray-900">${totalRevenue}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
          <p className="text-xs font-bold text-green-600 uppercase">Net Profit</p>
          <p className="text-xl font-black text-green-700">${totalProfit}</p>
        </div>
      </div>

      {/* The Ledger List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Recent Sales</h3>
          <button className="text-blue-600 text-xs font-bold hover:underline">View All</button>
        </div>
        
        <div className="divide-y divide-gray-50">
          {salesHistory.map((sale) => (
            <div key={sale.id} className="p-4 hover:bg-gray-50 transition group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-900">{sale.item}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><User size={12}/> {sale.staff}</span>
                    <span>•</span>
                    <span>{sale.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${sale.price}</p>
                  <p className="text-[10px] font-bold text-green-600">+${sale.price - sale.cost} Profit</p>
                </div>
              </div>
              
              <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button className="text-[10px] bg-gray-100 px-2 py-1 rounded font-bold hover:bg-gray-200">
                  REPRINT
                </button>
                <button className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold hover:bg-blue-100">
                  DETAILS
                </button>
              </div>
            </div>
          ))}
        </div>

        {salesHistory.length === 0 && (
          <div className="p-10 text-center text-gray-400 text-sm">
            No sales recorded yet today.
          </div>
        )}
      </div>
    </div>
  );
}