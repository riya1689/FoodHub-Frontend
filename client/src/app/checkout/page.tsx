"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/src/store/cartStore";
import { createOrder } from "@/src/utils/api";
import { MapPin, CheckCircle, ArrowLeft, Truck } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const { items, getTotalPrice, clearCart } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
    // Redirect if cart is empty
    if (useCartStore.getState().items.length === 0) {
      router.push("/cart");
    }
  }, [router]);

  if (!isMounted) return null;

  const subtotal = getTotalPrice();
  const deliveryFee = 50;
  const totalAmount = subtotal + deliveryFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to place an order.");
        router.push("/login?redirect=/checkout");
        return;
      }

      // Format items for the backend Prisma schema
      const orderItems = items.map(item => ({
        mealId: item.meal.id,
        quantity: item.quantity,
        price: typeof item.meal.price === 'string' ? parseFloat(item.meal.price) : item.meal.price
      }));

      await createOrder({
        address,
        totalAmount,
        items: orderItems
      }, token);

      // Order Success!
      clearCart();
      setSuccess(true);
      
    } catch (err: any) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 flex flex-col items-center justify-center px-4">
        <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">Order Placed!</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md text-lg">
          Your food is being prepared. You can track your order status in your dashboard.
        </p>
        <Link 
          href="/orders" 
          className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-orange-700 hover:scale-105 transition transform"
        >
          View My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => router.back()} className="flex items-center text-gray-500 hover:text-orange-600 transition font-medium mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Cart
        </button>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium border border-red-100">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left: Form */}
          <div className="p-6 md:p-10 w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-orange-600" /> Delivery Details
            </h2>
            
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Delivery Address</label>
                <textarea 
                  required
                  rows={4}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition"
                  placeholder="e.g., House 12, Road 5, Dhanmondi, Dhaka"
                ></textarea>
              </div>

              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
                <Truck className="w-5 h-5 mt-0.5 shrink-0" />
                <div className="text-sm font-medium">
                  Payment Method: <span className="font-bold">Cash on Delivery</span>
                  <p className="text-blue-600 mt-1 opacity-80">You will pay when the food arrives.</p>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || !address}
                className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-md hover:bg-orange-700 disabled:bg-orange-300 disabled:cursor-not-allowed transition transform active:scale-[0.98]"
              >
                {loading ? "Processing..." : `Place Order - ৳ ${totalAmount.toFixed(0)}`}
              </button>
            </form>
          </div>

          {/* Right: Summary */}
          <div className="p-6 md:p-10 w-full md:w-1/2 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.meal.id} className="flex justify-between text-sm font-medium text-gray-600">
                  <span className="flex-1 truncate pr-4">{item.quantity}x {item.meal.name}</span>
                  <span className="text-gray-900 shrink-0">৳ {(parseFloat(item.meal.price as string) * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <hr className="border-gray-200 mb-6" />

            <div className="space-y-3 text-sm font-medium text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-900">৳ {subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-gray-900">৳ {deliveryFee.toFixed(0)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-extrabold text-orange-600">৳ {totalAmount.toFixed(0)}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}