"use client";

import React, { useState } from "react";
import { Search, Smartphone, Check, Plus } from "lucide-react";
import { Product } from "@/app/services/inventoryService";
import Loading from "@/app/loader";

interface ProductSelectorProps {
  products: Product[];
  selectedItems: Product[];
  toggleProduct: (product: Product) => void;
  loading: boolean;
  error: string | null;
  subtotal: number;
  onNext: () => void;
}

export default function ProductSelector({
  products,
  selectedItems,
  toggleProduct,
  loading,
  error,
  subtotal,
  onNext
}: ProductSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products based on search input (name or category)
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-gray-700">
            Select Products ({selectedItems.length})
          </label>
          <span className="text-gray-400 text-xs font-mono">MSRP: ${subtotal}</span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by model, brand, or category..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable Product List */}
      {loading ? (
        <div className="py-20 text-center"><Loading /></div>
      ) : error ? (
        <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => {
              const isSelected = selectedItems.some((p) => p.id === item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleProduct(item)}
                  className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                      : "border-gray-100 hover:border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className={`rounded-lg p-2 ${isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                      <Smartphone size={18} />
                    </div>
                    <div>
                      <span className={`block font-bold text-sm ${isSelected ? "text-blue-900" : "text-gray-800"}`}>
                        {item.name}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-tight">
                        {item.category} • Stock: {item.stock}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-gray-700">RS {item.sale_price}</span>
                    {isSelected ? <Check size={18} className="text-blue-600" /> : <Plus size={18} className="text-gray-300" />}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-10 text-center text-gray-400 text-sm">No products found matching "{searchTerm}"</div>
          )}
        </div>
      )}

      {/* Action Button */}
      <button
        disabled={selectedItems.length === 0 || loading}
        onClick={onNext}
        className="w-full mt-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 disabled:opacity-50 disabled:bg-gray-300 disabled:shadow-none transition-all active:scale-[0.98]"
      >
        Continue to Checkout — ${subtotal}
      </button>
    </div>
  );
}