"use client";
import React, { useState } from "react";
import { ShoppingCart, Send, Printer, Check } from "lucide-react";

export default function SalesInterface() {
  const [step, setStep] = useState(1);
  const [saleData, setSaleData] = useState({
    productName: "",
    category: "",
    price: "",
    imei: "",
    customerName: "",
    customerPhone: "",
  });

  const generateWhatsAppLink = () => {
    const message = `Hello ${saleData.customerName}, thank you for shopping at MobiLedger! %0A%0AReceipt for: ${saleData.productName}%0AIMEI: ${saleData.imei}%0APrice: $${saleData.price}%0A%0AVisit us again!`;
    window.open(`https://wa.me/${saleData.customerPhone}?text=${message}`, "_blank");
  };

  const StepChip = ({
    n,
    label,
    active,
    done,
  }: {
    n: number;
    label: string;
    active: boolean;
    done: boolean;
  }) => (
    <div className="flex items-center gap-2">
      <div
        className={[
          "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ring-1",
          done
            ? "bg-emerald-500 text-white ring-emerald-400"
            : active
            ? "bg-blue-600 text-white ring-blue-500"
            : "bg-white/10 text-gray-300 ring-white/15",
        ].join(" ")}
      >
        {done ? <Check size={14} /> : n}
      </div>
      <span className={active ? "text-white font-semibold" : "text-gray-300"}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-gray-300">POINT OF SALE</p>
            <h2 className="text-lg font-extrabold tracking-tight text-white">
              New Sale
            </h2>
          </div>

          <div className="flex items-center gap-5">
            <StepChip n={1} label="Select Item" active={step === 1} done={step > 1} />
            <div className="h-px w-6 bg-white/15" />
            <StepChip n={2} label="Sale Details" active={step === 2} done={step > 2} />
            <div className="h-px w-6 bg-white/15" />
            <StepChip n={3} label="Receipt" active={step === 3} done={false} />
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-bold text-gray-900">Search Inventory</label>
              <p className="mt-1 text-xs text-gray-500">
                Type to search or pick a quick item below.
              </p>
            </div>

            <input
              type="text"
              placeholder="Start typing iPhone, Samsung, Charger..."
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              onChange={(e) => setSaleData({ ...saleData, productName: e.target.value })}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                onClick={() => {
                  setSaleData({
                    ...saleData,
                    productName: "iPhone 15",
                    price: "950",
                    category: "Mobile",
                  });
                  setStep(2);
                }}
                className="group rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-500 hover:ring-4 hover:ring-blue-500/10 active:scale-[0.99]"
              >
                <p className="text-sm font-extrabold text-gray-900">iPhone 15</p>
                <p className="mt-1 text-xs text-gray-500">$950 • In stock</p>
                <div className="mt-3 h-[1px] w-full bg-gradient-to-r from-gray-200 to-transparent" />
                <p className="mt-2 text-xs font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100">
                  Select item →
                </p>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-4">
              <p className="text-xs font-semibold text-gray-500">SELECTED ITEM</p>
              <p className="mt-1 text-sm font-extrabold text-gray-900">
                {saleData.productName || "—"}
                <span className="ml-2 text-xs font-semibold text-gray-500">
                  ${saleData.price || "0"}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold tracking-wide text-gray-600">
                  CUSTOMER PHONE (WHATSAPP)
                </label>
                <input
                  type="text"
                  placeholder="923001234567"
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  onChange={(e) => setSaleData({ ...saleData, customerPhone: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-wide text-gray-600">
                  CUSTOMER NAME
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  onChange={(e) => setSaleData({ ...saleData, customerName: e.target.value })}
                />
              </div>

              {saleData.category === "Mobile" && (
                <div>
                  <label className="text-[11px] font-bold tracking-wide text-blue-700">
                    SCAN / ENTER IMEI
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 15-digit IMEI"
                    className="mt-1 w-full rounded-2xl border border-blue-200 bg-blue-50/40 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    onChange={(e) => setSaleData({ ...saleData, imei: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setStep(1)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-bold text-gray-800 shadow-sm hover:bg-gray-50 active:scale-[0.99]"
              >
                Back
              </button>

              <button
                onClick={() => setStep(3)}
                className="w-full rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                Complete Sale &amp; Save Record
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Tip: Add validation later (phone format, IMEI length, required fields).
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 py-10 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
              <ShoppingCart size={40} />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                Sale Successful
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Record saved for{" "}
                <span className="font-semibold text-gray-800">
                  {saleData.productName || "—"}
                </span>
              </p>
            </div>

            <div className="mx-auto flex max-w-sm flex-col gap-3">
              <button
                onClick={generateWhatsAppLink}
                className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-sm hover:bg-emerald-700 active:scale-[0.99]"
              >
                <Send size={18} /> Share Receipt via WhatsApp
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-bold text-gray-800 shadow-sm hover:bg-gray-50 active:scale-[0.99]"
              >
                <Printer size={18} /> Print Thermal Receipt
              </button>

              <button
                onClick={() => setStep(1)}
                className="mx-auto mt-2 text-sm font-semibold text-blue-700 hover:underline"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
