"use client";

import React from "react";
import { X, CheckCircle2, Printer, Phone, Barcode, Calendar, User } from "lucide-react";

export interface ReceiptItem {
  id?: string;
  name: string;
  sale_price: number | string;
  qty?: number;
}

export interface SaleState {
  customerName: string;
  customerPhone: string;
  imei: string;
  finalPrice: string;
  notes: string;
  date: string;
  receiptNo?: string;
}

interface DigitalReceiptProps {
  saleData: SaleState;
  items: ReceiptItem[];
  onClose: () => void;
}

export default function DigitalReceipt({ saleData, items, onClose }: DigitalReceiptProps) {
  return (
    /* 
      We use 'print:fixed print:inset-0 print:bg-white print:z-50' 
      to tell the browser to force this modal layout to fill the entire printed page surface area,
      instantly pulling it over the dashboard elements without needing global CSS hacks.
    */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm print:absolute print:inset-0 print:bg-white print:p-0 print:block">
      
      {/* Receipt Box Wrapper Container */}
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden mx-auto print:shadow-none print:border-none print:w-full print:max-w-none print:p-4">
        
        <div className="p-6 sm:p-8">
          {/* Header Actions */}
          <div className="flex items-start justify-between mb-6 print:hidden">
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                <CheckCircle2 size={12} className="text-emerald-600" />
                Payment Complete
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              title="Close receipt"
            >
              <X size={18} />
            </button>
          </div>

          {/* Store Logo Branding */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              SKJ Mobiles Center
            </h2>
          </div>

          {/* Meta Info Layout Grid */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 bg-slate-50/70 rounded-xl p-4 mb-6 border border-slate-100 text-xs print:bg-slate-50">
            <div className="flex items-center gap-2 text-slate-500">
              <User size={14} className="text-slate-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Customer</p>
                <p className="font-bold text-slate-800 truncate">{saleData.customerName || "Walk-in"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-500">
              <Calendar size={14} className="text-slate-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Date</p>
                <p className="font-bold text-slate-800 truncate">{saleData.date}</p>
              </div>
            </div>

            {saleData.customerPhone && (
              <div className="flex items-center gap-2 text-slate-500">
                <Phone size={14} className="text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Phone</p>
                  <p className="font-medium text-slate-700 truncate">{saleData.customerPhone}</p>
                </div>
              </div>
            )}

            {saleData.imei && (
              <div className="flex items-center gap-2 text-slate-500">
                <Barcode size={14} className="text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Device IMEI</p>
                  <p className="font-mono text-slate-700 truncate">{saleData.imei}</p>
                </div>
              </div>
            )}
          </div>

          {/* Items Section Header */}
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
            Items Summary
          </div>

          {/* Items List */}
          <div className="space-y-3 mb-6 border-t border-b border-slate-100 py-4 px-1">
            {items.map((item) => {
              const basePrice = Number(item.sale_price) || 0;
              const quantity = item.qty || 1;
              const itemTotal = basePrice * quantity;

              return (
                <div key={item.id || item.name} className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">
                      {quantity} × {basePrice.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-800 pt-0.5">
                    {itemTotal.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Custom Notes Section */}
          {saleData.notes && (
            <div className="mb-6 bg-amber-50/50 border border-amber-100/70 rounded-xl p-3.5 text-xs text-slate-600 print:bg-amber-50">
              <span className="block font-bold text-amber-800 uppercase text-[10px] tracking-wider mb-1">Notes:</span>
              <p className="italic leading-relaxed">{saleData.notes}</p>
            </div>
          )}

          {/* Pricing Total block */}
          <div className="bg-slate-900 rounded-xl p-4 flex justify-between items-center text-white shadow-md shadow-slate-900/10 mb-6 print:bg-black">
            <div>
              <p className="text-[10px] tracking-widest text-slate-400 uppercase font-bold">
                Total Paid Amount
              </p>
              <p className="text-xs text-emerald-400 font-medium mt-0.5 hidden print:block">
                Paid in Full
              </p>
            </div>
            <span className="text-2xl font-black font-mono tracking-tight text-white">
              {Number(saleData.finalPrice).toFixed(2)}
            </span>
          </div>

          {/* Bottom Action Controls */}
          <div className="space-y-3 print:hidden">
            <button
              onClick={() => window.print()}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl py-3 flex items-center justify-center gap-2 text-sm transition-all border border-slate-200/50 active:scale-[0.98]"
            >
              <Printer size={16} className="text-slate-500" />
              Print Paper Copy
            </button>
            <p className="text-center text-[11px] text-slate-400">
              Thank you for business!
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}