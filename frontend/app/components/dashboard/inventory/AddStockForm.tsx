"use client";
import React, { useState } from 'react';
import { PlusCircle, Box, Smartphone } from 'lucide-react';

export default function AddStockForm() {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Mobile',
    costPrice: '',
    salePrice: '',
    totalStock: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Bulk Stock Added:", formData);
    alert(`Successfully added ${formData.totalStock} units of ${formData.name}`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <PlusCircle className="text-green-600" size={24} />
        <h2 className="text-xl font-bold text-gray-800">New Stock Entry</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-sm font-semibold text-gray-600">Product Name / Model</label>
            <input
              type="text"
              placeholder="e.g. iPhone 15 or Samsung Charger"
              className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-semibold text-gray-600">Category</label>
            <select 
              className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none"
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Mobile">Smartphone</option>
              <option value="Accessory">Accessory</option>
              <option value="Tablet">Tablet / iPad</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">Purchase (Cost)</label>
            <input
              type="number"
              placeholder="0.00"
              className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none"
              required
              onChange={(e) => setFormData({...formData, costPrice: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">Selling Price</label>
            <input
              type="number"
              placeholder="0.00"
              className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none"
              required
              onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-semibold text-gray-600">Total Units to Add</label>
            <input
              type="number"
              placeholder="How many items are you adding?"
              className="w-full mt-1 p-2.5 bg-blue-50 border border-blue-200 rounded-lg font-bold text-blue-800 outline-none"
              required
              onChange={(e) => setFormData({...formData, totalStock: e.target.value})}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-black transition shadow-lg mt-2"
        >
          Add to Shop Inventory
        </button>
      </form>
    </div>
  );
}