"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function ProtectedRoute({ 
  children, 
  requireAuth = true,
}: { 
  children: React.ReactNode; 
  requireAuth?: boolean;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthResolved, setIsAuthResolved] = useState(false);

  useEffect(() => {
    // Only proceed once loading is complete
    if (!loading) {
      if (requireAuth && !user) {
        // Not authenticated, redirect to login
        router.push("/");
      } else {
        // Auth check is done
        setIsAuthResolved(true);
      }
    }
  }, [user, loading, router, requireAuth]);

  // Show loading state while auth is being checked
  if (loading || !isAuthResolved) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  return <>{children}</>;
}
