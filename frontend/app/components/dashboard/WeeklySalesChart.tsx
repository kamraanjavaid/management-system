"use client"; // Required for Recharts interactivity

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";

const data = [
  { day: "Mon", sales: 4200 },
  { day: "Tue", sales: 3800 },
  { day: "Wed", sales: 5100 },
  { day: "Thu", sales: 4600 },
  { day: "Fri", sales: 6200 },
  { day: "Sat", sales: 7800 },
  { day: "Sun", sales: 5400 },
];

export default function WeeklySalesChart() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Weekly Sales</h3>
          <p className="text-sm text-slate-400">Revenue overview for this week</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blue-600"></span>
          <span className="text-xs font-medium text-slate-600">Sales</span>
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              tickFormatter={(value) => `$${value/1000}k`}
            />
            <Tooltip 
              cursor={{ fill: '#F8FAFC' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar 
              dataKey="sales" 
              fill="#2563eb" 
              radius={[6, 6, 0, 0]} 
              barSize={45}
            >
              {data.map((entry, index) => (
                // Adding a slight highlight to the highest day (Saturday)
                <Cell key={`cell-${index}`} fill={entry.day === 'Sat' ? '#1D4ED8' : '#3B82F6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}