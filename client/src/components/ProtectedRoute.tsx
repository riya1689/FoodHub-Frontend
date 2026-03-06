"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles: string[];
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Grab user from localStorage
    const userStr = localStorage.getItem("user");
    
    // If they are not logged in at all - no access
    if (!userStr) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      
      // If they are logged in but have the wrong role, redirect them safely
      if (!allowedRoles.includes(user.role)) {
        if (user.role === "PROVIDER") router.push("/provider/dashboard");
        else if (user.role === "ADMIN") router.push("/admin");
        else router.push("/meals"); // Customers go to the menu
        return;
      }

      // If they pass all security checks, show the page!
      setIsAuthorized(true);
    } catch (error) {
      console.error("Failed to parse user data", error);
      router.push("/login");
    }
  }, [router, allowedRoles]);

  // Show a loading spinner while checking their credentials to prevent screen flickering
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="animate-spin h-12 w-12 text-orange-600" />
      </div>
    );
  }

  return <>{children}</>;
}