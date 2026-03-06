"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if the user is on the admin or provider routes
  const isDashboard = pathname?.startsWith("/admin") || pathname?.startsWith("/provider");

  return (
    <>
      <Navbar />
      
      {/* Conditionally remove the gap if it's a dashboard */}
      <div className={`${isDashboard ? "" : "pt-16"} min-h-screen flex flex-col`}>
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Conditionally hide the Footer if it's a dashboard */}
        {!isDashboard && <Footer />}
      </div>
    </>
  );
}