"use client";
import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { salesService } from '@/app/services/salesService';
import { Sale } from '@/app/types/sales-types';
import DigitalReceipt from '@/app/components/dashboard/sales/DigitalReceipt';

export default function RecentSalesTable() {
  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
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

  const totalRevenue = salesHistory.reduce((acc, sale) => acc + Number(sale.final_settled_price), 0);
  const totalSales = salesHistory.length;

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading sales...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Total Sales</p>
          <p className="text-xl font-black text-gray-900">{totalSales}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
          <p className="text-xs font-bold text-green-600 uppercase">Total Revenue</p>
          <p className="text-xl font-black text-green-700">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Recent Sales</h3>
          <button onClick={loadSales} className="text-blue-600 text-xs font-bold hover:underline">Refresh</button>
        </div>
        
        <div className="divide-y divide-gray-50">
          {salesHistory.map((sale) => (
            <div key={sale.id} className="p-4 hover:bg-gray-50 transition group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-900">{sale.customer_name || 'Walk-in Customer'}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>IMEI: {sale.imei}</span>
                    <span>•</span>
                    <span>{new Date(sale.created_at).toLocaleString()}</span>
                  </div>
                  {sale.notes && <p className="text-xs text-gray-400 mt-1">{sale.notes}</p>}
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="font-bold text-gray-900">${Number(sale.final_settled_price).toFixed(2)}</p>
                  {sale.items && sale.items.length > 0 && (
                    <p className="text-[10px] font-bold text-blue-600">{sale.items.length} item(s)</p>
                  )}
                  <button
                    onClick={() => {
                      setReceiptSale(sale);
                      setShowReceipt(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-xs mt-1 flex items-center gap-1"
                  >
                    <Eye size={12} /> View Receipt
                  </button>
                </div>
              </div>
              
              {sale.items && sale.items.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  Items: {sale.items.map(item => item.product_name).join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>

        {salesHistory.length === 0 && (
          <div className="p-10 text-center text-gray-400 text-sm">
            No sales recorded yet.
          </div>
        )}
      </div>

      {/* receipt modal */}
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