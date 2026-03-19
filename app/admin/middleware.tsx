"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setIsAuthenticated(true);
      return;
    }

    // Check authentication only on client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        router.push("/admin/login");
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router, pathname]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return null;
  }

  // Don't render children if not authenticated (except on login page)
  if (pathname !== "/admin/login" && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
