import SalesInterface from "@/app/components/dashboard/sales/SalesInterface";
import RecentSalesTable from "@/app/components/dashboard/sales/RecentSalesTable";

export default function SalesPage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">New Sale / Counter</h1>
        <div className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
          Counter Active: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: The Sale Entry Form */}
        <div className="xl:col-span-2">
          <SalesInterface />
        </div>

        {/* Right: History of sales for today */}
        <div className="xl:col-span-1">
          <RecentSalesTable />
        </div>
      </div>
    </div>
  );
}