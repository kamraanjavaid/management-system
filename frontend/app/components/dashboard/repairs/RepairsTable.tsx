"use client";
import React, { useEffect, useState } from "react";
import { Wrench, Phone, Trash2, ChevronDown } from "lucide-react";
import { repairsService } from "@/app/services/repairsService";
import { Repair, RepairStatus, UpdateRepairDto } from "@/app/types/repair-types";

const STATUS_STYLES: Record<RepairStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  "In-Repair": "bg-blue-100 text-blue-700",
  Ready: "bg-green-100 text-green-700",
  Delivered: "bg-gray-100 text-gray-500",
};

const STATUS_OPTIONS: RepairStatus[] = ["Pending", "In-Repair", "Ready", "Delivered"];

interface Props {
  refresh: number;
}

export default function RepairsTable({ refresh }: Props) {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await repairsService.getAllRepairs();
      setRepairs(data);
    } catch (err: any) {
      setError(err.message || "Failed to load repairs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [refresh]);

  const handleStatusChange = async (id: string, status: RepairStatus) => {
    try {
      setUpdatingId(id);
      const updated = await repairsService.updateRepair(id, { status } as UpdateRepairDto);
      setRepairs(prev => prev.map(r => r.id === id ? updated : r));
    } catch {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this repair job?")) return;
    try {
      await repairsService.deleteRepair(id);
      setRepairs(prev => prev.filter(r => r.id !== id));
    } catch {
      alert("Failed to delete repair job");
    }
  };

  const stats = {
    pending: repairs.filter(r => r.status === "Pending").length,
    inRepair: repairs.filter(r => r.status === "In-Repair").length,
    ready: repairs.filter(r => r.status === "Ready").length,
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Loading repairs...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
          <p className="text-xs font-bold text-yellow-600 uppercase">Pending</p>
          <p className="text-2xl font-black text-yellow-700">{stats.pending}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <p className="text-xs font-bold text-blue-600 uppercase">In-Repair</p>
          <p className="text-2xl font-black text-blue-700">{stats.inRepair}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <p className="text-xs font-bold text-green-600 uppercase">Ready</p>
          <p className="text-2xl font-black text-green-700">{stats.ready}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="font-bold text-gray-800">All Repair Jobs</h3>
        </div>

        {repairs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Wrench size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No repair jobs logged yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {repairs.map(repair => (
              <div key={repair.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-900">{repair.device_model}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[repair.status]}`}>
                        {repair.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{repair.issue_description}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 flex-wrap">
                      <span className="font-medium text-gray-600">{repair.customer_name}</span>
                      <span className="flex items-center gap-1">
                        <Phone size={10} />
                        <a href={`tel:${repair.customer_phone}`} className="hover:text-blue-600">{repair.customer_phone}</a>
                      </span>
                      {repair.imei && <span>IMEI: {repair.imei}</span>}
                      <span>{new Date(repair.created_at).toLocaleDateString()}</span>
                    </div>
                    {repair.notes && <p className="text-xs text-gray-400 mt-1 italic">{repair.notes}</p>}
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Estimated</p>
                      <p className="font-bold text-gray-900">{Number(repair.estimated_cost).toFixed(2)}</p>
                      {repair.final_cost && (
                        <p className="text-xs font-bold text-green-600">Final: {Number(repair.final_cost).toFixed(2)}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <select
                          value={repair.status}
                          disabled={updatingId === repair.id}
                          onChange={e => handleStatusChange(repair.id, e.target.value as RepairStatus)}
                          className="appearance-none text-xs font-bold bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 pr-7 outline-none cursor-pointer hover:bg-gray-200 transition disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                      </div>
                      <button
                        onClick={() => handleDelete(repair.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
