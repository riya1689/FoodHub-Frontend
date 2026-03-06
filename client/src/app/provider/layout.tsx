"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, ClipboardList, LogOut, Store } from "lucide-react";
import ProtectedRoute from "@/src/components/ProtectedRoute";

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    router.push("/");
  };

  const navItems = [
    { name: "Dashboard", href: "/provider/dashboard", icon: <LayoutDashboard className="w-5 h-5 mr-3" /> },
    { name: "Menu Management", href: "/provider/menu", icon: <UtensilsCrossed className="w-5 h-5 mr-3" /> },
    { name: "Orders", href: "/provider/orders", icon: <ClipboardList className="w-5 h-5 mr-3" /> },
  ];

  return (
    <ProtectedRoute allowedRoles={["PROVIDER"]}>
    <div className="flex h-screen bg-gray-50 pt-20">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden md:flex h-full fixed">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3 text-orange-600 font-extrabold text-xl">
          <Store className="w-6 h-6" /> Provider Panel
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-orange-50 text-orange-600 shadow-sm border border-orange-100" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.icon} {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition font-medium"
          >
            <LogOut className="w-5 h-5 mr-3" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>

    </div>
    </ProtectedRoute>
  );
}