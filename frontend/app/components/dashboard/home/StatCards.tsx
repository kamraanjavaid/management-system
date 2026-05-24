"use client";

import { DollarSign, ShoppingCart, Package, AlertTriangle } from "lucide-react";
import { inventoryService } from "@/app/services/inventoryService";
import { salesService } from "@/app/services/salesService";
import { useState, useEffect } from "react";

export default function StatCards() {
  const [data, setData] = useState({
    totalItems: 0,
    lowStockAlerts: 0,
    inventoryValue: 0,
    totalSalesCount: 0,
    totalSalesValue: 0,
  });

  const loadStats = async () => {
    try {
      const [products, sales] = await Promise.all([
        inventoryService.getAllProducts(),
        salesService.getAllSales(),
      ]);
      const totalItems = products.reduce((sum, p) => sum + (p.stock || 0), 0);
      const lowStockAlerts = products.filter(p => p.stock < 10).length;
      const inventoryValue = products.reduce((sum, p) => sum + ((p.cost_price || 0) * (p.stock || 0)), 0);
      const totalSalesCount = sales.length;
      const totalSalesValue = sales.reduce((sum, s) => sum + Number(s.final_settled_price), 0);

      setData({ totalItems, lowStockAlerts, inventoryValue, totalSalesCount, totalSalesValue });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const statsConfig = [
    { 
      label: "Sales Value", 
      value: `$${data.totalSalesValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarSign className="text-emerald-600" />, 
      bgColor: "bg-emerald-50" 
    },
    { 
      label: "Total Sales", 
      value: data.totalSalesCount.toString(),
      icon: <ShoppingCart className="text-blue-600" />, 
      bgColor: "bg-blue-50" 
    },
    { 
      label: "Inventory Value", 
      value: `${data.inventoryValue.toLocaleString()} PKR`,
      icon: <Package className="text-cyan-600" />, 
      bgColor: "bg-cyan-50" 
    },
    { 
      label: "Low Stock", 
      value: data.lowStockAlerts.toString(),
      icon: <AlertTriangle className="text-amber-600" />, 
      bgColor: "bg-amber-50" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {statsConfig.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-start">
          <div>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
          <div className={`${stat.bgColor} p-3 rounded-xl`}>
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}