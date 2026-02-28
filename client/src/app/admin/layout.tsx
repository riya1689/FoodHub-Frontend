"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, ClipboardList, LogOut, ShieldCheck, Tags } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    router.push("/");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5 mr-3" /> },
    { name: "Users", href: "/admin/users", icon: <Users className="w-5 h-5 mr-3" /> },
    { name: "All Orders", href: "/admin/orders", icon: <ClipboardList className="w-5 h-5 mr-3" /> },
    { name: "Categories", href: "/admin/categories", icon: <Tags className="w-5 h-5 mr-3" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 pt-20"> 
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex h-full fixed text-white">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3 text-orange-500 font-extrabold text-xl">
          <ShieldCheck className="w-6 h-6" /> Admin Panel
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
                    ? "bg-orange-600 text-white shadow-md" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.icon} {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition font-medium"
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
  );
}