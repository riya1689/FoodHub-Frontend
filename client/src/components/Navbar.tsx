"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check login status 
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    checkUser();
    
    // Listen for storage events
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("storage")); 
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50 top-0 left-0 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-orange-600 tracking-wide">
              FoodHub
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-orange-600 px-3 py-2 font-medium transition">Home</Link>
            <Link href="/meals" className="text-gray-600 hover:text-orange-600 px-3 py-2 font-medium transition">Menu</Link>
            <Link href="/providers" className="text-gray-600 hover:text-orange-600 px-3 py-2 font-medium transition">Restaurants</Link>
          </div>

          {/* Desktop Right Side (Cart & Auth) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative group p-2 text-gray-600 hover:text-orange-600 transition">
              <ShoppingCart className="w-6 h-6" />
            </Link>

            {user ? (
              // Logged In View
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700">Hi, {user.name}</span>
                {user.role === 'PROVIDER' && (
                  <Link href="/provider/dashboard" className="text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-medium">
                    Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-600 transition" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              // Guest View
              <div className="flex items-center space-x-3">
                <Link href="/login" className="text-gray-700 hover:text-orange-600 font-medium px-3 py-2 transition">
                  Log in
                </Link>
                <Link href="/register" className="bg-orange-600 text-white px-4 py-2 rounded-full font-medium hover:bg-orange-700 transition shadow-sm hover:shadow-md">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-orange-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1 flex flex-col">
            <Link href="/" className="block text-gray-700 hover:bg-orange-50 hover:text-orange-600 px-3 py-2 rounded-md font-medium">
              Home
            </Link>
            <Link href="/meals" className="block text-gray-700 hover:bg-orange-50 hover:text-orange-600 px-3 py-2 rounded-md font-medium">
              Menu
            </Link>
            <Link href="/providers" className="block text-gray-700 hover:bg-orange-50 hover:text-orange-600 px-3 py-2 rounded-md font-medium">
              Restaurants
            </Link>
            
            <div className="border-t border-gray-100 my-2 pt-2">
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm font-semibold text-gray-500">
                    Signed in as {user.name}
                  </div>
                  {user.role === 'PROVIDER' && (
                    <Link href="/provider/dashboard" className="block text-gray-700 hover:bg-orange-50 hover:text-orange-600 px-3 py-2 rounded-md font-medium">
                      Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left block text-red-600 hover:bg-red-50 px-3 py-2 rounded-md font-medium"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block text-gray-700 hover:bg-orange-50 hover:text-orange-600 px-3 py-2 rounded-md font-medium">
                    Log in
                  </Link>
                  <Link href="/register" className="block text-orange-600 font-bold px-3 py-2 rounded-md">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

