"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X, LogOut, MapPin, Search, User, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "../store/cartStore";

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const totalItems = useCartStore((state) => state.getTotalItems());

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

  // Smart routing: Send users to their correct dashboard based on role
  const getProfileLink = () => {
    if (user?.role === 'ADMIN') return '/admin';
    if (user?.role === 'PROVIDER') return '/provider/dashboard';
    return '/profile';
  };

  // Only show public links to Customers or Guests
  const showPublicLinks = !user || user.role === 'CUSTOMER';

  return (
    <nav className="bg-white shadow-md fixed w-full z-50 top-0 left-0 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center gap-4">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-orange-600 tracking-wide">
              FoodHub
            </Link>
          </div>
            
            {/* CENTER: Search Bar */}
          {showPublicLinks && (
            <div className="hidden md:flex flex-1 max-w-lg mx-4 relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Search className="h-5 w-5 text-gray-400" />
               </div>
               <input 
                 type="text" 
                 onClick={() => router.push('/meals')} 
                 className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:text-sm transition duration-150 ease-in-out cursor-pointer"
                 placeholder="Search for food, coffee, etc..."
               />
            </div>
          )}

          {/* Desktop Right Side (Location, Cart & Auth) */}
          <div className="hidden md:flex items-center space-x-6">

            {/* CHANGED: Moved Menu/Restaurants links here for better flow */}
            {showPublicLinks && (
              <div className="flex items-center space-x-4">
                 <Link href="/" className="text-gray-600 hover:text-orange-600 font-medium transition">Home</Link>
                 <Link href="/meals" className="text-gray-600 hover:text-orange-600 font-medium transition">Meals</Link>
                 <Link href="/providers" className="text-gray-600 hover:text-orange-600 font-medium transition">Restaurant</Link>
                 <Link href="/meals" className="text-gray-600 hover:text-orange-600 font-medium transition">About Us</Link>
                 
                 {/* Global Cart Icon (Only show if Customer or not logged in) */}
                 <Link href="/cart" className="relative group p-2 text-gray-600 hover:text-orange-600 transition">
                   <ShoppingCart className="w-6 h-6" />
                   {totalItems > 0 && (
                     <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm animate-fade-in-up">
                       {totalItems}
                     </span>
                   )}
                 </Link>
              </div>
            )}

            {user ? (
              // Logged In View
              <div className="flex items-center gap-4">
                <Link 
                  href={getProfileLink()} 
                  className="flex items-center gap-2 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 px-4 py-2 rounded-full transition text-gray-700 hover:text-orange-700 font-medium"
                >
                  {user.role === 'CUSTOMER' ? <User className="w-4 h-4" /> : <LayoutDashboard className="w-4 h-4" />}
                  <span className="text-sm font-semibold">Hi, {user.name.split(" ")[0]}</span>
                </Link>
                
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
          <div className="md:hidden flex items-center gap-4">
             {/* Show cart on mobile too if applicable */}
             {(!user || user.role === 'CUSTOMER') && (
               <Link href="/cart" className="relative p-2 text-gray-600">
                 <ShoppingCart className="w-6 h-6" />
                 {totalItems > 0 && (
                   <span className="absolute 0 right-0 bg-orange-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                     {totalItems}
                   </span>
                 )}
               </Link>
             )}
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
            
            {/* HIDDEN FOR ADMIN/PROVIDER ON MOBILE */}
            {showPublicLinks && (
              <>
                <Link href="/" className="block text-gray-700 hover:bg-orange-50 hover:text-orange-600 px-3 py-2 rounded-md font-medium">
                  Home
                </Link>
                <Link href="/meals" className="block text-gray-700 hover:bg-orange-50 hover:text-orange-600 px-3 py-2 rounded-md font-medium">
                  Menu
                </Link>
                <Link href="/providers" className="block text-gray-700 hover:bg-orange-50 hover:text-orange-600 px-3 py-2 rounded-md font-medium">
                  Restaurants
                </Link>
              </>
            )}
            
            <div className={`border-gray-100 my-2 pt-2 ${showPublicLinks ? 'border-t' : ''}`}>
              {user ? (
                <>
                  <Link href={getProfileLink()} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 block text-gray-700 hover:bg-orange-50 hover:text-orange-600 px-3 py-2 rounded-md font-medium">
                    {user.role === 'CUSTOMER' ? <User className="w-5 h-5" /> : <LayoutDashboard className="w-5 h-5" />}
                    My {user.role === 'CUSTOMER' ? 'Profile' : 'Dashboard'}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-left block text-red-600 hover:bg-red-50 px-3 py-2 rounded-md font-medium"
                  >
                    <LogOut className="w-5 h-5" /> Log Out
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