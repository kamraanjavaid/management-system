import { LayoutDashboard, Box, ShoppingCart, Settings, TrendingUp, Bell } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Box className="text-white h-6 w-6" />
        </div>
        <div>
          <h1 className="text-white font-bold leading-none">MobileHub</h1>
          <span className="text-xs text-slate-500">Shop Manager</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-8">
        <div>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Main</p>
          <ul className="space-y-2">
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
            <NavItem icon={<Box size={20} />} label="Inventory" />
            <NavItem icon={<ShoppingCart size={20} />} label="Sales & Orders" />
          </ul>
        </div>
        
        <div>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">System</p>
          <ul className="space-y-2">
            <NavItem icon={<Settings size={20} />} label="Settings" />
          </ul>
        </div>
      </nav>

      {/* Bottom Profile Section */}
      <div className="p-4 mt-auto border-t border-slate-800">
        <div className="bg-blue-900/30 p-4 rounded-xl mb-6">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
                <TrendingUp size={16} />
                <span className="text-xs font-medium">Today's Sales</span>
            </div>
            <p className="text-white text-xl font-bold">$4,285</p>
            <p className="text-green-400 text-[10px]">+12.5% from yesterday</p>
        </div>
        
        <div className="flex items-center gap-3 px-2">
          <div className="h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">JD</div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">John Doe</p>
            <p className="text-xs text-slate-500">Store Manager</p>
          </div>
          <Bell size={18} className="text-slate-500 hover:text-white cursor-pointer" />
        </div>
      </div>
    </aside>
  );
};

// Helper Sub-component
const NavItem = ({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <li className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${active ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </li>
);

export default Sidebar;