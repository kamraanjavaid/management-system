import AddStockForm from "@/app/components/dashboard/inventory/AddStockForm"; 
import InventoryTable from "@/app/components/dashboard/inventory/InventoryTable"; 

export default function InventoryPage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500">Manage mobiles and accessories in one place.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Export Inventory (CSV)
        </button>
      </div>

      {/* Bottom Row: Action and List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input Form (1 part) */}
        <div className="lg:col-span-1">
          <AddStockForm /> 
        </div>

        {/* Right Column: Detailed Data Table (2 parts) */}
        <div className="lg:col-span-2">
          <InventoryTable />
        </div>
      </div>
    </div>
  );
}