"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/src/store/cartStore";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  // 1. Hydration Fix for Zustand Persist
  const [isMounted, setIsMounted] = useState(false);
  
  // 2. Zustand Store Actions & State
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  // 3. Calculations
  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 0 ? 50 : 0; // Flat ৳ 50 delivery fee
  const total = subtotal + deliveryFee;

  // 4. Empty State
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 flex flex-col items-center justify-center px-4">
        <div className="bg-orange-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <ShoppingBag className="w-12 h-12 text-orange-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Looks like you haven't added any delicious meals to your cart yet. Let's change that!
        </p>
        <Link 
          href="/meals" 
          className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-orange-700 hover:scale-105 transition transform flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Browse Meals
        </Link>
      </div>
    );
  }

  // 5. Active Cart UI
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Your Cart</h1>
          <button 
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center transition"
          >
            <Trash2 className="w-4 h-4 mr-1" /> Clear Cart
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left: Cart Items List */}
          <div className="w-full lg:w-2/3 space-y-4">
            {items.map((item) => {
              const price = typeof item.meal.price === 'string' ? parseFloat(item.meal.price) : item.meal.price;
              
              return (
                <div key={item.meal.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition hover:shadow-md">
                  
                  {/* Item Image */}
                  <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    <img 
                      src={item.meal.imageUrl || "https://placehold.co/150x150?text=Food"} 
                      alt={item.meal.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{item.meal.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {item.meal.provider?.restaurantName || "Restaurant"}
                    </p>
                    <div className="font-extrabold text-gray-900">
                      ৳ {price.toFixed(0)}
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <button 
                      onClick={() => removeItem(item.meal.id)}
                      className="text-gray-400 hover:text-red-500 transition p-1"
                      title="Remove Item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full p-1">
                      <button 
                        onClick={() => updateQuantity(item.meal.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.meal.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:p-8 sticky top-28">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-gray-600 mb-6">
                <div className="flex justify-between items-center">
                  <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                  <span className="font-medium text-gray-900">৳ {subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-gray-900">৳ {deliveryFee.toFixed(0)}</span>
                </div>
              </div>

              <hr className="border-gray-100 mb-6" />

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-3xl font-extrabold text-orange-600">৳ {total.toFixed(0)}</span>
              </div>

              <Link 
                href="/checkout"
                className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-orange-700 hover:shadow-xl transition transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link href="/meals" className="block text-center mt-4 text-orange-600 font-medium hover:underline text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}