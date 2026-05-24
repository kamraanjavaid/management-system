"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { salesService } from "@/app/services/salesService";

const COLORS = ["bg-emerald-400", "bg-cyan-500", "bg-blue-500", "bg-violet-500", "bg-amber-400"];

interface ProductStat {
  name: string;
  revenue: number;
  sold: number;
}

export default function TopSellingProducts() {
  const [products, setProducts] = useState<ProductStat[]>([]);

  useEffect(() => {
    salesService.getAllSales().then((sales) => {
      const map = new Map<string, ProductStat>();

      for (const sale of sales) {
        for (const item of sale.items ?? []) {
          const existing = map.get(item.product_name);
          if (existing) {
            existing.revenue += Number(item.unit_sale_price);
            existing.sold += 1;
          } else {
            map.set(item.product_name, { name: item.product_name, revenue: Number(item.unit_sale_price), sold: 1 });
          }
        }
      }

      const sorted = Array.from(map.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setProducts(sorted);
    }).catch(console.error);
  }, []);

  const maxRevenue = products[0]?.revenue || 1;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-slate-800">Top Selling</h3>
          <p className="text-xs text-slate-400">Best performing products</p>
        </div>
        <span className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
          <TrendingUp size={14} /> All time
        </span>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-10">No sales data yet.</p>
      ) : (
        <div className="space-y-6">
          {products.map((item, i) => (
            <div key={item.name}>
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-slate-700">{item.name}</p>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">
                    {item.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] text-slate-400">{item.sold} sold</p>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`${COLORS[i]} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${Math.round((item.revenue / maxRevenue) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
