"use client";
import React, { useState } from 'react';
import { ShoppingCart, User, Smartphone, Send, Printer } from 'lucide-react';

export default function SalesInterface() {
  const [step, setStep] = useState(1); // 1: Select Item, 2: Customer/IMEI, 3: Success
  const [saleData, setSaleData] = useState({
    productName: '',
    category: '',
    price: '',
    imei: '',
    customerName: '',
    customerPhone: '',
  });

  const generateWhatsAppLink = () => {
    const message = `Hello ${saleData.customerName}, thank you for shopping at MobiLedger! %0A%0AReceipt for: ${saleData.productName}%0AIMEI: ${saleData.imei}%0APrice: $${saleData.price}%0A%0AVisit us again!`;
    window.open(`https://wa.me/${saleData.customerPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Progress Header */}
      <div className="flex bg-gray-900 p-4 text-white">
        <div className={`flex-1 text-center ${step === 1 ? 'font-bold text-blue-400' : 'text-gray-400'}`}>1. Select Item</div>
        <div className={`flex-1 text-center ${step === 2 ? 'font-bold text-blue-400' : 'text-gray-400'}`}>2. Sale Details</div>
        <div className={`flex-1 text-center ${step === 3 ? 'font-bold text-blue-400' : 'text-gray-400'}`}>3. Receipt</div>
      </div>

      <div className="p-8">
        {step === 1 && (
          <div className="space-y-4">
            <label className="block font-semibold">Search Inventory</label>
            {/* In real app, this would be a search dropdown from your Inventory Table */}
            <input 
              type="text" 
              placeholder="Start typing iPhone, Samsung, Charger..."
              className="w-full p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl"
              onChange={(e) => setSaleData({...saleData, productName: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
               {/* Example Quick Selections */}
               <button onClick={() => {setSaleData({...saleData, productName: 'iPhone 15', price: '950', category: 'Mobile'}); setStep(2)}} className="p-4 border rounded-xl hover:border-blue-500 hover:bg-blue-50 text-left">
                  <p className="font-bold">iPhone 15</p>
                  <p className="text-sm text-gray-500">$950 in stock</p>
               </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-bold text-gray-600 uppercase">Customer Phone (WhatsApp)</label>
                <input 
                  type="text" placeholder="923001234567" 
                  className="w-full mt-1 p-3 border rounded-lg"
                  onChange={(e) => setSaleData({...saleData, customerPhone: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-600 uppercase">Customer Name</label>
                <input 
                  type="text" placeholder="John Doe" 
                  className="w-full mt-1 p-3 border rounded-lg"
                  onChange={(e) => setSaleData({...saleData, customerName: e.target.value})}
                />
              </div>
              {saleData.category === 'Mobile' && (
                <div>
                  <label className="text-sm font-bold text-blue-600 uppercase">Scan/Enter IMEI</label>
                  <input 
                    type="text" placeholder="Enter 15-digit IMEI" 
                    className="w-full mt-1 p-3 border-2 border-blue-200 rounded-lg"
                    onChange={(e) => setSaleData({...saleData, imei: e.target.value})}
                  />
                </div>
              )}
            </div>
            <button 
              onClick={() => setStep(3)}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700"
            >
              Complete Sale & Save Record
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-6 py-10">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <ShoppingCart size={40} />
            </div>
            <h2 className="text-2xl font-bold">Sale Successful!</h2>
            <p className="text-gray-500">Record saved for {saleData.productName}</p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={generateWhatsAppLink}
                className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600"
              >
                <Send size={18} /> Share Receipt via WhatsApp
              </button>
              <button 
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200"
              >
                <Printer size={18} /> Print Thermal Receipt
              </button>
              <button 
                onClick={() => setStep(1)}
                className="text-blue-600 font-medium underline mt-4"
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