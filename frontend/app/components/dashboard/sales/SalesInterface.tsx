"use client";

import React, { useState, ChangeEvent } from "react";
import { Send, Check, Eye, X, Smartphone, DollarSign, Plus, MessageSquare } from "lucide-react";

// 1. Define strict types
interface Product {
  id: number;
  name: string;
  price: number;
}

interface SaleState {
  customerName: string;
  customerPhone: string;
  imei: string;
  finalPrice: string; // Kept as string for easier input handling
  notes: string;
  date: string;
}

export default function SalesInterface() {
  const [step, setStep] = useState<number>(1);
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);
  
  const [saleData, setSaleData] = useState<SaleState>({
    customerName: "",
    customerPhone: "",
    imei: "",
    finalPrice: "",
    notes: "",
    date: new Date().toLocaleDateString(),
  });

  const products: Product[] = [
    { id: 1, name: "iPhone 15", price: 950 },
    { id: 2, name: "Samsung S23", price: 800 },
    { id: 3, name: "Airpods Pro", price: 250 },
    { id: 4, name: "Fast Charger", price: 30 }
  ];

  const subtotal = selectedItems.reduce((acc, item) => acc + item.price, 0);

  const toggleProduct = (product: Product): void => {
    setSelectedItems(prev => {
      const exists = prev.find(p => p.id === product.id);
      const newItems = exists ? prev.filter(p => p.id !== product.id) : [...prev, product];
      
      // Auto-update final price to subtotal when items change to save time
      const newSubtotal = newItems.reduce((acc, item) => acc + item.price, 0);
      setSaleData(s => ({ ...s, finalPrice: newSubtotal.toString() }));
      
      return newItems;
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSaleData(prev => ({ ...prev, [name]: value }));
  };

  const generateWhatsAppLink = (): void => {
    const itemsList = selectedItems.map(i => `- ${i.name}`).join('%0A');
    const noteSection = saleData.notes ? `%0A*Note:* ${saleData.notes}` : "";
    const message = `*MobiLedger Receipt*%0A--------------------------%0A*Customer:* ${saleData.customerName}%0A*Items:*%0A${itemsList}%0A--------------------------%0A*Total Amount:* $${saleData.finalPrice}${noteSection}%0A--------------------------%0AThank you!`;
    window.open(`https://wa.me/${saleData.customerPhone}?text=${message}`, "_blank");
  };

  const DigitalReceipt = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex justify-between">
          <h3 className="text-lg font-bold text-gray-900">Digital Receipt</h3>
          <button onClick={() => setShowReceipt(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="space-y-3 border-y border-dashed border-gray-200 py-4 font-mono text-sm">
          <div className="flex justify-between text-gray-600"><span>Date:</span> <span>{saleData.date}</span></div>
          <div className="flex justify-between text-gray-600"><span>Customer:</span> <span>{saleData.customerName || "Walk-in"}</span></div>
          <hr className="border-dashed border-gray-200" />
          {selectedItems.map((item) => (
            <div key={item.id} className="flex justify-between text-gray-900">
              <span>{item.name}</span>
              <span>${item.price}</span>
            </div>
          ))}
          <hr className="border-dashed border-gray-200" />
          <div className="flex justify-between text-lg font-bold text-blue-600">
            <span>TOTAL PAID</span>
            <span>${saleData.finalPrice}</span>
          </div>
          {saleData.notes && (
            <div className="mt-2 text-[11px] text-gray-500 bg-gray-50 p-2 rounded border">
              <strong>Note:</strong> {saleData.notes}
            </div>
          )}
        </div>
        <button onClick={() => window.print()} className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
          Print Receipt
        </button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
      {showReceipt && <DigitalReceipt />}
      
      <div className="border-b border-gray-100 px-6 py-6 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">New Sale</h2>
            <p className="text-sm text-gray-500">Step {step} of 3</p>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${step >= i ? "bg-blue-600" : "bg-gray-200"}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700">Select Products ({selectedItems.length})</label>
                <span className="text-gray-400 text-xs">MSRP Total: ${subtotal}</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {products.map((item) => {
                const isSelected = selectedItems.some(p => p.id === item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleProduct(item)}
                    className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                        isSelected ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2 shadow-sm ${isSelected ? "bg-blue-600 text-white" : "bg-white border border-gray-100 text-gray-600"}`}>
                        <Smartphone size={18} />
                      </div>
                      <span className={`font-bold ${isSelected ? "text-blue-900" : "text-gray-800"}`}>{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-600">${item.price}</span>
                        {isSelected ? <Check size={18} className="text-blue-600" /> : <Plus size={18} className="text-gray-300" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <button 
                disabled={selectedItems.length === 0}
                onClick={() => setStep(2)}
                className="w-full mt-4 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg disabled:opacity-50 disabled:bg-gray-300 transition-all"
            >
                Checkout ${subtotal}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  placeholder="e.g. John Doe"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 outline-none"
                  onChange={handleInputChange}
                />
              </div>

              <div className="sm:col-span-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <label className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
                    <DollarSign size={14} /> Final Settled Price
                </label>
                <div className="relative mt-2">
                    <input
                        type="number"
                        name="finalPrice"
                        value={saleData.finalPrice}
                        className="w-full rounded-lg border border-blue-200 px-4 py-3 text-2xl font-black text-blue-700 outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={handleInputChange}
                    />
                </div>
                <p className="mt-1.5 text-[10px] text-blue-400 uppercase font-medium">Sum of Selected Items: ${subtotal}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">WhatsApp Number</label>
                <input type="text" name="customerPhone" placeholder="92300..." className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500" onChange={handleInputChange} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Device IMEI</label>
                <input type="text" name="imei" placeholder="15-digit code" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500" onChange={handleInputChange} />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                   <MessageSquare size={14} /> Extra Comments (Optional)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Warranty info, physical condition, etc."
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 outline-none resize-none"
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-50">
              <button onClick={() => setStep(1)} className="flex-1 rounded-xl border border-gray-200 py-3 font-semibold text-gray-500 hover:bg-gray-50 transition">Back</button>
              <button onClick={() => setStep(3)} className="flex-[2] rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 shadow-md">Complete Sale</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-10 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500 ring-8 ring-green-50/50">
              <Check size={40} strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Sale Confirmed!</h2>
            <p className="text-gray-500">Collected <span className="font-bold text-blue-600">${saleData.finalPrice}</span></p>

            <div className="mt-8 grid grid-cols-2 gap-3 px-4">
              <button onClick={generateWhatsAppLink} className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white hover:bg-green-700 transition">
                <Send size={18} /> Send WhatsApp
              </button>
              <button onClick={() => setShowReceipt(true)} className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition">
                <Eye size={18} /> View Receipt
              </button>
              <button onClick={() => { setSelectedItems([]); setSaleData(s => ({...s, notes: "", finalPrice: ""})); setStep(1); }} className="col-span-2 rounded-xl bg-gray-900 py-3 text-sm font-bold text-white hover:bg-black transition">
                New Sale
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}