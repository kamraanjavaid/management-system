"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import SalesInterface from "@/app/components/dashboard/sales/SalesInterface";
import RecentSalesTable from "@/app/components/dashboard/sales/RecentSalesTable";

export default function SalesPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition shadow"
        >
          <Plus size={18} />
          Add New Sale
        </button>
      </div>

      <RecentSalesTable />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10 p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition"
            >
              <X size={18} className="text-gray-600" />
            </button>
            <SalesInterface />
          </div>
        </div>
      )}
    </div>
  );
}
