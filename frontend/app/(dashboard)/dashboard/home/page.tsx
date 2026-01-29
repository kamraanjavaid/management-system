"use client";

import StatCards from "@/app/components/dashboard/home/StatCards";
import WeeklySalesChart from "@/app/components/dashboard/home/WeeklySalesChart";
import TopSellingProducts from "@/app/components/dashboard/home/TopSellingProducts";
import { useAuth } from "@/app/context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user?.full_name || 'User'}! 👋
        </h1>
        <p className="text-slate-500 mt-1">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Top Row: Quick Stats */}
      <StatCards />

      {/* Bottom Row: Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklySalesChart />
        </div>
        <div className="lg:col-span-1">
          <TopSellingProducts />
        </div>
      </div>
    </div>
  );
}
