"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Lock, Mail, ArrowRight, Info, AlertCircle, Eye, EyeOff } from "lucide-react"; // Add Eye and EyeOff icons
import { useAuth } from "@/app/context/AuthContext";

export default function SignIn() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard/home");
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-slate-100 font-sans flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600">
          <AlertCircle size={18} />
          <span className="text-sm">{error}</span>
        </div>
      )}

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
              type={passwordVisible ? "text" : "password"} // Toggle input type based on password visibility
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
            />
            {/* Eye Icon to toggle password visibility */}
            <div 
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility
            >
              {passwordVisible ? <EyeOff size={18} className="text-slate-400" /> : <Eye size={18} className="text-slate-400" />}
            </div>
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
    </div>
  );
}
