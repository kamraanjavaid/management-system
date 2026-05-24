"use client";

import { useEffect, useState, useMemo } from "react";
import { salesService } from "@/app/services/salesService";
import { Sale } from "@/app/types/sales-types";
import { Search, RefreshCw, User, Phone, ShoppingBag, DollarSign } from "lucide-react";

interface Customer {
  name: string;
  phone: string;
  totalItems: number;
  totalSpend: number;
  lastPurchase: string;
}

function buildCustomers(sales: Sale[]): Customer[] {
  const map = new Map<string, Customer>();

  for (const sale of sales) {
    const name = sale.customer_name?.trim() || "Walk-in Customer";
    const phone = sale.customer_phone?.trim() || "";
    const key = `${name}||${phone}`;

    const existing = map.get(key);
    const itemCount = sale.items?.length ?? 0;

    if (existing) {
      existing.totalItems += itemCount;
      existing.totalSpend += Number(sale.final_settled_price);
      if (new Date(sale.created_at) > new Date(existing.lastPurchase)) {
        existing.lastPurchase = sale.created_at;
      }
    } else {
      map.set(key, {
        name,
        phone,
        totalItems: itemCount,
        totalSpend: Number(sale.final_settled_price),
        lastPurchase: sale.created_at,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalSpend - a.totalSpend);
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const sales = await salesService.getAllSales();
      setCustomers(buildCustomers(sales));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q)
    );
  }, [customers, search]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
          {filtered.length} total
        </span>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-gray-500 font-medium">Loading customers...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-gray-400 bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Phone</th>
                  <th className="px-6 py-4 font-semibold text-center">Items Bought</th>
                  <th className="px-6 py-4 font-semibold text-right">Total Spend</th>
                  <th className="px-6 py-4 font-semibold">Last Purchase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c, i) => (
                  <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <User size={16} className="text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-900">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Phone size={13} className="text-gray-400" />
                        {c.phone || <span className="text-gray-400 italic">N/A</span>}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-700">
                        <ShoppingBag size={14} className="text-blue-400" />
                        {c.totalItems}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-emerald-600">
                        {c.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(c.lastPurchase).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-20 flex flex-col items-center text-gray-400">
              <Search size={40} className="mb-3 opacity-20" />
              <p className="text-sm">No customers found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
