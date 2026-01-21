import { TrendingUp } from "lucide-react";

const products = [
  { name: "iPhone 15 Pro Max", price: "$53,955.00", sold: "45 sold", progress: 75, color: "bg-emerald-400" },
  { name: "Samsung Galaxy S24 Ultra", price: "$49,362.00", sold: "38 sold", progress: 60, color: "bg-cyan-500" },
  { name: "AirPods Pro 2", price: "$15,438.00", sold: "62 sold", progress: 85, color: "bg-blue-500" },
  { name: "Google Pixel 8 Pro", price: "$27,972.00", sold: "28 sold", progress: 40, color: "bg-emerald-400" },
  { name: "USB-C Fast Charger", price: "$4,165.00", sold: "85 sold", progress: 95, color: "bg-blue-500" },
];

export default function TopSellingProducts() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-slate-800">Top Selling</h3>
          <p className="text-xs text-slate-400">Best performing products</p>
        </div>
        <span className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
          <TrendingUp size={14} /> This month
        </span>
      </div>

      <div className="space-y-6">
        {products.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-medium text-slate-700">{item.name}</p>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{item.price}</p>
                <p className="text-[10px] text-slate-400">{item.sold}</p>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${item.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}