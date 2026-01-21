import { DollarSign, ShoppingCart, Package, AlertTriangle, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Revenue", value: "$4,359.20", trend: "+12.5%", icon: <DollarSign className="text-emerald-600" />, bgColor: "bg-emerald-50" },
  { label: "Total Orders", value: "6", trend: "+8.2%", icon: <ShoppingCart className="text-blue-600" />, bgColor: "bg-blue-50" },
  { label: "Products", value: "10", icon: <Package className="text-cyan-600" />, bgColor: "bg-cyan-50" },
  { label: "Low Stock", value: "2", icon: <AlertTriangle className="text-amber-600" />, bgColor: "bg-amber-50" },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-start">
          <div>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            {stat.trend && (
              <p className="text-xs font-medium text-emerald-500 mt-2 flex items-center gap-1">
                <TrendingUp size={14} /> {stat.trend} <span className="text-slate-400 font-normal">vs last week</span>
              </p>
            )}
          </div>
          <div className={`${stat.bgColor} p-3 rounded-xl`}>
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}