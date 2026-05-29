"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import RepairsTable from "@/app/components/dashboard/repairs/RepairsTable";
import NewRepairModal from "@/app/components/dashboard/repairs/NewRepairModal";

export default function RepairsPage() {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Repairs</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track device repair jobs and status</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition shadow"
        >
          <Plus size={18} />
          New Repair Job
        </button>
      </div>

      <RepairsTable refresh={refresh} />

      {showModal && (
        <NewRepairModal
          onClose={() => setShowModal(false)}
          onCreated={() => setRefresh(r => r + 1)}
        />
      )}
    </div>
  );
}
