"use client";

import React from "react";
import { X, CheckCircle, Printer } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-sm bg-amber-50 shadow-2xl">
        <div className="px-7 pt-7 pb-6">

          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2
                className="text-2xl font-black tracking-tight text-stone-900"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Meridian
              </h2>
              <p className="text-xs tracking-widest text-stone-400 uppercase mt-0.5 font-medium">
                Retail Co.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-stone-300 hover:text-stone-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Top solid divider */}
          <div className="border-t-2 border-stone-300 mb-4" />

          {/* Meta info */}
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold tracking-widest text-stone-400 uppercase">Date</span>
              <span className="text-xs font-mono text-stone-600">{saleData.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold tracking-widest text-stone-400 uppercase">Customer</span>
              <span className="text-xs font-mono text-stone-600">
                {saleData.customerName || "Walk-in"}
              </span>
            </div>
          </div>

          {/* Dashed divider */}
          <div className="border-t border-dashed border-stone-300 mb-4" />

          {/* Items */}
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id || item.name} className="flex justify-between items-baseline gap-3">
                <div className="flex items-baseline gap-2 min-w-0">
                  {item.qty != null && (
                    <span className="text-xs font-mono text-stone-300 shrink-0">
                      {item.qty}×
                    </span>
                  )}
                  <span className="text-sm font-medium text-stone-800 truncate">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-mono font-medium text-stone-800 shrink-0">
                  ${item.sale_price}
                </span>
              </div>
            ))}
          </div>

          {/* Dashed divider */}
          <div className="border-t border-dashed border-stone-300 mb-4" />

          {/* Total block */}
          <div className="bg-stone-900 rounded-sm px-5 py-4 flex justify-between items-center">
            <p className="text-xs tracking-widest text-stone-500 uppercase font-semibold">
              Total Paid
            </p>
            <span
              className="text-2xl font-black text-amber-50 tracking-tight"
              style={{ fontFamily: "Georgia, serif" }}
            >
              ${saleData.finalPrice}
            </span>
          </div>

          {/* Paid badge */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <CheckCircle size={12} className="text-emerald-500" />
            <span className="text-xs tracking-widest uppercase font-semibold text-emerald-500">
              Payment complete
            </span>
          </div>

          {/* Print button */}
          <button
            onClick={() => window.print()}
            className="mt-5 w-full border border-stone-300 rounded-sm py-3 flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase text-stone-500 hover:bg-stone-900 hover:text-amber-50 hover:border-stone-900 transition-all"
          >
            <Printer size={13} />
            Print Receipt
          </button>

          {/* Receipt number */}
          <p className="text-center font-mono text-xs text-stone-300 mt-4 tracking-wide">
            {saleData.receiptNo}
          </p>
        </div>
      </div>
    </div>
  );
}
