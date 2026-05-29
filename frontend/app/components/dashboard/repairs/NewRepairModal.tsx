"use client";
import React, { useState, ChangeEvent } from "react";
import { X, Wrench } from "lucide-react";
import { repairsService } from "@/app/services/repairsService";
import { CreateRepairDto } from "@/app/types/repair-types";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const EMPTY: CreateRepairDto = {
  customerName: "",
  customerPhone: "",
  deviceModel: "",
  imei: "",
  issueDescription: "",
  estimatedCost: 0,
  notes: "",
};

export default function NewRepairModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState<CreateRepairDto>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "estimatedCost" ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      await repairsService.createRepair({
        ...form,
        imei: form.imei || undefined,
        notes: form.notes || undefined,
      });
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create repair job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <Wrench size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">New Repair Job</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-200 transition">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer Name *</label>
              <input name="customerName" value={form.customerName} onChange={handleChange} required placeholder="John Doe" className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone *</label>
              <input name="customerPhone" value={form.customerPhone} onChange={handleChange} required placeholder="+1234567890" className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Device Model *</label>
              <input name="deviceModel" value={form.deviceModel} onChange={handleChange} required placeholder="iPhone 14 Pro" className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">IMEI</label>
              <input name="imei" value={form.imei} onChange={handleChange} placeholder="Optional" className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Issue Description *</label>
            <textarea name="issueDescription" value={form.issueDescription} onChange={handleChange} required rows={3} placeholder="e.g. Cracked screen, battery drains fast..." className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 resize-none" />
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <label className="text-xs font-bold text-blue-600 uppercase tracking-widest">Estimated Cost *</label>
            <input type="number" name="estimatedCost" value={form.estimatedCost || ""} onChange={handleChange} required min={0} placeholder="0.00" className="mt-1.5 w-full bg-transparent text-2xl font-black text-blue-700 outline-none" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Any additional notes..." className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 resize-none" />
          </div>

          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-3 font-bold text-gray-500 hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-[2] rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 transition disabled:opacity-50">
              {submitting ? "Saving..." : "Log Repair Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
