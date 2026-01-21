"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Lock, Mail, ArrowRight, Info } from "lucide-react";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating a brief delay for realism
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-slate-100 font-sans">
      {/* Logo & Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-blue-600 p-3 rounded-2xl mb-4 shadow-lg shadow-blue-200">
          <Box className="text-white h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
        <p className="text-slate-500 text-sm mt-1 text-center">
          Sign in to manage your inventory and sales
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              required
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              required
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
            />
          </div>
        </div>

        {/* Action Button */}
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
        >
          {loading ? "Authenticating..." : "Sign In to Dashboard"}
          {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
        </button>
      </form>

      {/* Demo Credentials Box */}
      <div className="mt-8 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
        <div className="flex items-center gap-2 mb-2 text-blue-700">
          <Info size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Demo Credentials</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Email</p>
            <p className="text-sm font-medium text-slate-700">admin@mobilehub.com</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Password</p>
            <p className="text-sm font-medium text-slate-700">admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}