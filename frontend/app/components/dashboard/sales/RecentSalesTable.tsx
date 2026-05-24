"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { Eye, RefreshCw, ShoppingBag, DollarSign, Calendar, Hash, Search, X } from 'lucide-react';
import { salesService } from '@/app/services/salesService';
import { Sale } from '@/app/types/sales-types';
import DigitalReceipt from '@/app/components/dashboard/sales/DigitalReceipt';

export default function RecentSalesTable() {
  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDate, setSearchDate] = useState(''); // Format: YYYY-MM-DD
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptSale, setReceiptSale] = useState<Sale | null>(null);

  const loadSales = async () => {
    try {
      setLoading(true);
      const data = await salesService.getAllSales();
      setSalesHistory(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load sales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  // Filter logic: Handles text search AND date matching simultaneously
  const filteredSales = useMemo(() => {
    return salesHistory.filter((sale) => {
      // 1. Text Search Filter (Name or IMEI)
      const searchStr = searchQuery.toLowerCase();
      const customerName = (sale.customer_name || 'Walk-in Customer').toLowerCase();
      const imei = (sale.imei || '').toLowerCase();
      const matchesText = customerName.includes(searchStr) || imei.includes(searchStr);

      // 2. Date Filter
      let matchesDate = true;
      if (searchDate) {
        const saleDateObj = new Date(sale.created_at);
        
        // Format sale date to YYYY-MM-DD in local time to accurately match input type="date"
        const year = saleDateObj.getFullYear();
        const month = String(saleDateObj.getMonth() + 1).padStart(2, '0');
        const day = String(saleDateObj.getDate()).padStart(2, '0');
        const localSaleDateStr = `${year}-${month}-${day}`;

        matchesDate = localSaleDateStr === searchDate;
      }

      return matchesText && matchesDate;
    });
  }, [salesHistory, searchQuery, searchDate]);

  const totalRevenue = filteredSales.reduce((acc, sale) => acc + Number(sale.final_settled_price), 0);

  const clearFilters = () => {
    setSearchQuery('');
    setSearchDate('');
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-gray-500 font-medium">Fetching latest transactions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <ShoppingBag className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Sales</p>
            <p className="text-2xl font-bold text-gray-900">{filteredSales.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <DollarSign className="text-emerald-600" size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Filtered Revenue</p>
            <p className="text-2xl font-bold text-emerald-600">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Toolbar */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 bg-gray-50/50">
          <h3 className="font-bold text-gray-800 self-center xl:self-auto">
            Recent Transactions
          </h3>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
            {/* Text Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text"
                placeholder="Search name or IMEI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Date Picker Input */}
            <div className="relative w-full sm:w-48 flex items-center">
              <input 
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
              />
              {searchDate && (
                <button 
                  onClick={() => setSearchDate('')}
                  className="absolute right-8 text-gray-400 hover:text-gray-600"
                  title="Clear date"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            <button 
              onClick={loadSales} 
              className="p-2.5 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-gray-200 group bg-white self-end sm:self-auto"
              title="Refresh Data"
            >
              <RefreshCw size={18} className="text-gray-500 group-hover:text-blue-600" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-gray-400 bg-white">
                <th className="px-6 py-4 font-semibold">Customer & Date</th>
                <th className="px-6 py-4 font-semibold">Device Info</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 group-hover:text-blue-700">
                        {sale.customer_name || 'Walk-in Customer'}
                      </span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
                        <Calendar size={10} /> {new Date(sale.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-700 flex items-center gap-1">
                        <Hash size={12} className="text-gray-400" /> {sale.imei}
                      </span>
                      {sale.items && (
                        <span className="text-[10px] text-blue-600 font-medium uppercase mt-1">
                          {sale.items.length} Item{sale.items.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-gray-900">
                      ${Number(sale.final_settled_price).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => {
                        setReceiptSale(sale);
                        setShowReceipt(true);
                      }}
                      className="inline-flex hover:cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white transition-all text-xs font-semibold"
                    >
                      <Eye size={14} /> Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSales.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400">
            <Search size={48} className="mb-4 opacity-20" />
            <p className="text-sm">No transactions match your search filters.</p>
            <button 
              onClick={clearFilters}
              className="mt-2 text-blue-600 text-xs font-bold hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Modal remains unchanged */}
      {showReceipt && receiptSale && (
        <DigitalReceipt
          saleData={{
            customerName: receiptSale.customer_name || "",
            customerPhone: receiptSale.customer_phone || "",
            imei: receiptSale.imei,
            finalPrice: receiptSale.final_settled_price.toString(),
            notes: receiptSale.notes || "",
            date: new Date(receiptSale.created_at).toLocaleDateString(),
            receiptNo: receiptSale.id,
          }}
          items={(receiptSale.items || []).map(i => ({
            id: i.id,
            name: i.product_name,
            sale_price: i.unit_sale_price,
            qty: 1,
          }))}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
}