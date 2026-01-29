"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase, API_URL } from "@/app/lib/supabase";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("auth_token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          // Verify token with backend
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              setUser(data.data);
            } else {
              // Token invalid, clear storage
              localStorage.removeItem("auth_token");
              localStorage.removeItem("user");
            }
          } else {
            // Token invalid, clear storage
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (!data.session?.access_token) {
        return { success: false, message: "No session token received" };
      }

      // Exchange Supabase token for session token with backend
      const response = await fetch(`${API_URL}/auth/token-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: data.session.access_token,
        }),
      });

      if (!response.ok) {
        return { success: false, message: "Failed to authenticate with server" };
      }

      const responseData = await response.json();

      if (!responseData.success) {
        return { success: false, message: responseData.message };
      }

      // Store auth data
      localStorage.setItem("auth_token", responseData.data.token);
      localStorage.setItem("user", JSON.stringify(responseData.data.user));
      setUser(responseData.data.user);

      // Redirect based on role
      if (responseData.data.user.role === "staff") {
        router.push("/dashboard/sales");
      } else {
        router.push("/dashboard/home");
      }

      return { success: true, message: "Login successful" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "An unexpected error occurred" };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      setUser(null);
      router.push("/");
    }
  };

  const isAdmin = user !== null;
  const isStaff = false;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
