"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Send, Check, Eye, DollarSign, MessageSquare } from "lucide-react";
import { inventoryService } from "@/app/services/inventoryService";
import { salesService } from "@/app/services/salesService";
import { Product } from "@/app/types/inventory-types";
import { CreateSaleDto } from "@/app/types/sales-types";
import ProductSelector from "./ProductSelector";
import DigitalReceipt from "@/app/components/dashboard/sales/DigitalReceipt";

interface SaleState {
  customerName: string;
  customerPhone: string;
  imei: string;
  finalPrice: string;
  notes: string;
  date: string;
  receiptNo?: string;
}

export default function SalesInterface() {
  const [step, setStep] = useState<number>(1);
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [saleData, setSaleData] = useState<SaleState>({
    customerName: "",
    customerPhone: "",
    imei: "",
    finalPrice: "",
    notes: "",
    date: new Date().toLocaleDateString(),
    receiptNo: undefined,
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const subtotal = selectedItems.reduce((acc, item) => acc + (Number(item.sale_price) || 0), 0);

  const toggleProduct = (product: Product): void => {
    setSelectedItems(prev => {
      const exists = prev.find(p => p.id === product.id);
      const newItems = exists ? prev.filter(p => p.id !== product.id) : [...prev, product];
      const newSubtotal = newItems.reduce((acc, item) => acc + (Number(item.sale_price) || 0), 0);
      setSaleData(s => ({ ...s, finalPrice: newSubtotal.toString() }));
      return newItems;
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSaleData(prev => ({ ...prev, [name]: value }));
  };

  const handleCompleteSale = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const salePayload: CreateSaleDto = {
        customerName: saleData.customerName || undefined,
        customerPhone: saleData.customerPhone || undefined,
        imei: saleData.imei,
        finalPrice: parseFloat(saleData.finalPrice),
        notes: saleData.notes || undefined,
        items: selectedItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: Number(item.sale_price)
        }))
      };

      const created = await salesService.createSale(salePayload);
      // store receipt number returned by backend
      setSaleData(s => ({
        ...s,
        receiptNo: created.id,
        date: created.created_at ? new Date(created.created_at).toLocaleDateString() : s.date,
      }));
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Failed to create sale");
      alert("Error creating sale: " + (err.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  const generateWhatsAppLink = (): void => {
    const itemsList = selectedItems.map(i => `- ${i.name}`).join('%0A');
    const noteSection = saleData.notes ? `%0A*Note:* ${saleData.notes}` : "";
    const message = `*MobiLedger Receipt*%0A--------------------------%0A*Customer:* ${saleData.customerName}%0A*Items:*%0A${itemsList}%0A--------------------------%0A*Total Amount:* $${saleData.finalPrice}${noteSection}%0A--------------------------%0AThank you!`;
    window.open(`https://wa.me/${saleData.customerPhone}?text=${message}`, "_blank");
  };

  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
      {showReceipt && (
        <DigitalReceipt
          saleData={saleData}
          items={selectedItems.map(i => ({ name: i.name, sale_price: i.sale_price, qty: (i as any).qty }))}
          onClose={() => setShowReceipt(false)}
        />
      )}

      {/* Header */}
      <div className="border-b border-gray-100 px-8 py-6 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">New Sale</h2>
            <p className="text-sm font-medium text-slate-500">Processing Step {step} of 3</p>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-2 w-8 rounded-full transition-all duration-500 ${step >= i ? "bg-blue-600 w-12" : "bg-gray-200"}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="p-8">
        {step === 1 && (
          <ProductSelector
            products={products}
            selectedItems={selectedItems}
            toggleProduct={toggleProduct}
            loading={loading}
            error={error}
            subtotal={subtotal}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer Name</label>
                <input type="text" name="customerName" value={saleData.customerName} placeholder="e.g. John Doe" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 outline-none" onChange={handleInputChange} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer Phone</label>
                <input type="tel" name="customerPhone" value={saleData.customerPhone} placeholder="+1234567890" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 outline-none" onChange={handleInputChange} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">IMEI *</label>
                <input type="text" name="imei" value={saleData.imei} placeholder="123456789012345" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 outline-none" onChange={handleInputChange} required />
              </div>
              <div className="sm:col-span-2 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <label className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1"><DollarSign size={14} /> Final Settled Price *</label>
                <input type="number" name="finalPrice" value={saleData.finalPrice} className="mt-2 w-full bg-transparent text-3xl font-black text-blue-700 outline-none" onChange={handleInputChange} required />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1"><MessageSquare size={12} /> Notes</label>
                <textarea name="notes" value={saleData.notes} placeholder="Additional notes..." rows={3} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 outline-none resize-none" onChange={handleInputChange} />
              </div>
            </div>
            {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
            <div className="flex gap-3 pt-6 border-t border-gray-100">
              <button onClick={() => setStep(1)} className="flex-1 rounded-xl border border-gray-200 py-4 font-bold text-gray-500 hover:bg-gray-50 transition" disabled={submitting}>Back</button>
              <button onClick={handleCompleteSale} className="flex-[2] rounded-xl bg-blue-600 py-4 font-bold text-white hover:bg-blue-700 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled={submitting || !saleData.imei || !saleData.finalPrice}>{submitting ? "Processing..." : "Complete Sale"}</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-10 text-center animate-in zoom-in-95 duration-300">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-green-500 ring-[12px] ring-green-50/50">
              <Check size={48} strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black text-gray-900">Sale Confirmed!</h2>
            <p className="mt-2 text-gray-500 font-medium">Successfully recorded payment of <span className="text-blue-600">${saleData.finalPrice}</span></p>

            <div className="mt-10 grid grid-cols-2 gap-4 px-4">
              <button onClick={generateWhatsAppLink} className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 rounded-2xl bg-green-600 py-4 text-sm font-bold text-white hover:bg-green-700 transition shadow-md shadow-green-100"> <Send size={18} /> Send WhatsApp </button>
              <button onClick={() => setShowReceipt(true)} className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 rounded-2xl border border-gray-200 py-4 text-sm font-bold text-gray-700 hover:bg-gray-50 transition"> <Eye size={18} /> View Receipt </button>
              <button onClick={() => { setSelectedItems([]); setSaleData(s => ({ ...s, notes: "", finalPrice: "" })); setStep(1); }} className="col-span-2 rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white hover:bg-black transition shadow-xl"> Start New Sale </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}