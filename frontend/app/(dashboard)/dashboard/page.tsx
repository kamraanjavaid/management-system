import StatCards from "@/app/components/dashboard/StatCards";
import WeeklySalesChart from "@/app/components/dashboard/WeeklySalesChart";
import TopSellingProducts from "@/app/components/dashboard/TopSellingProducts";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
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