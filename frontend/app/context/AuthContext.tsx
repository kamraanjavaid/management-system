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

        console.log("Auth init - Token exists:", !!storedToken);
        console.log("Auth init - User exists:", !!storedUser);

        if (storedToken && storedUser) {
          try {
            // Verify token with backend using the verify endpoint
            const response = await fetch(`${API_URL}/auth/verify`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${storedToken}`,
                "Content-Type": "application/json",
              },
              credentials: "include", // Include cookies if any
            });

            console.log("Auth verification response status:", response.status);

            if (response.ok) {
              const data = await response.json();
              console.log("Auth verification data:", data);
              
              if (data.valid && data.user) {
                setUser(data.user);
                console.log("User authenticated successfully");
              } else {
                console.log("Token invalid, clearing storage");
                localStorage.removeItem("auth_token");
                localStorage.removeItem("user");
                setUser(null);
              }
            } else {
              console.log("Token verification failed with status:", response.status);
              if (response.status === 401 || response.status === 403) {
                // Unauthorized or forbidden - clear token
                localStorage.removeItem("auth_token");
                localStorage.removeItem("user");
                setUser(null);
              } else {
                // Network error or server error - use cached user for now
                try {
                  const storedUserData = JSON.parse(storedUser);
                  setUser(storedUserData);
                  console.log("Using cached user data due to verification error");
                } catch {
                  setUser(null);
                }
              }
            }
          } catch (fetchError) {
            console.error("Auth verification fetch error:", fetchError);
            // Network error - use cached user data
            try {
              const storedUserData = JSON.parse(storedUser);
              setUser(storedUserData);
              console.log("Using cached user data after fetch error");
            } catch {
              setUser(null);
            }
          }
        } else {
          console.log("No stored auth data found");
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Direct login with backend
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
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
      // Clear local storage and state
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
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
