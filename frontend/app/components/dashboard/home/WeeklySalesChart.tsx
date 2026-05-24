"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { salesService } from "@/app/services/salesService";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeeklySalesChart() {
  const [data, setData] = useState(DAYS.map((day) => ({ day, sales: 0 })));

  useEffect(() => {
    salesService.getAllSales().then((sales) => {
      const totals = Array(7).fill(0);

      // Get the start of the current week (Sunday)
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      for (const sale of sales) {
        const saleDate = new Date(sale.created_at);
        if (saleDate >= startOfWeek) {
          totals[saleDate.getDay()] += Number(sale.final_settled_price);
        }
      }

      setData(DAYS.map((day, i) => ({ day, sales: totals[i] })));
    }).catch(console.error);
  }, []);

  const maxDay = data.reduce((max, d) => (d.sales > max.sales ? d : max), data[0]);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Weekly Sales</h3>
          <p className="text-sm text-slate-400">Revenue overview for this week</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blue-600"></span>
          <span className="text-xs font-medium text-slate-600">Sales</span>
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} tickFormatter={(v) => `${v >= 1000 ? `${v / 1000}k` : v}`} />
            <Tooltip
              cursor={{ fill: "#F8FAFC" }}
              contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              formatter={(value) => [`$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, "Sales"]}
            />
            <Bar dataKey="sales" radius={[6, 6, 0, 0]} barSize={45}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.day === maxDay.day && maxDay.sales > 0 ? "#1D4ED8" : "#3B82F6"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
