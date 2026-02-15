"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLoggedIn = false; 
  const cartItemCount = 2;

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

          {/* Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-orange-600 px-3 py-2 font-medium transition">
              Home
            </Link>
            <Link href="/meals" className="text-gray-600 hover:text-orange-600 px-3 py-2 font-medium transition">
              Menu
            </Link>
            <Link href="/providers" className="text-gray-600 hover:text-orange-600 px-3 py-2 font-medium transition">
              Restaurants
            </Link>
          </div>

          {/* Cart, Auth*/}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Icon*/}
            <Link href="/cart" className="relative group p-2 text-gray-600 hover:text-orange-600 transition">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              // If Logged In: Show Profile Icon
              <Link href="/profile" className="p-2 text-gray-600 hover:text-orange-600 transition">
                <User className="w-6 h-6" />
              </Link>
            ) : (
              // If Logged Out: Show Login/Register
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
              <Link href="/login" className="block text-gray-700 hover:bg-orange-50 hover:text-orange-600 px-3 py-2 rounded-md font-medium">
                Log in
              </Link>
              <Link href="/register" className="block text-orange-600 font-bold px-3 py-2 rounded-md">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}