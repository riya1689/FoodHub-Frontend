"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchOrderById } from "@/src/utils/api";
import { ArrowLeft, MapPin, Receipt, CheckCircle2 } from "lucide-react";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!params.id) return;
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const data = await fetchOrderById(params.id as string, token);
        setOrder(data);
      } catch (error) {
        console.error("Failed to load order", error);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!order) return <div className="text-center pt-32 text-gray-500">Order not found.</div>;

  // Progress Bar Logic
  const statuses = ['PENDING', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  let currentStepIndex = statuses.indexOf(order.status);
  if (currentStepIndex === -1) currentStepIndex = 0; // Fallback for cancelled

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => router.back()} className="flex items-center text-gray-500 hover:text-orange-600 transition font-medium mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Orders
        </button>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Order #{order.id}</h1>

        {/* 1. Status Progress Tracker */}
        {order.status !== 'CANCELLED' ? (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-6">
            <div className="relative flex justify-between items-center mb-2">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-gray-100 rounded-full"></div>
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${(currentStepIndex / (statuses.length - 1)) * 100}%` }}
              ></div>
              
              {statuses.map((status, index) => {
                const isCompleted = index <= currentStepIndex;
                const isActive = index === currentStepIndex;
                return (
                  <div key={status} className="relative z-10 flex flex-col items-center group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isCompleted ? 'bg-orange-600 border-white text-white shadow-md' : 'bg-gray-100 border-white text-gray-300'}`}>
                      {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span className={`absolute top-10 text-[10px] sm:text-xs font-bold whitespace-nowrap ${isActive ? 'text-orange-600' : 'text-gray-400'}`}>
                      {status.replace(/_/g, ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-12 text-center text-sm font-medium text-gray-500">
              {order.status === 'PENDING' && "Waiting for restaurant to accept your order."}
              {order.status === 'PREPARING' && "Your food is being freshly prepared!"}
              {order.status === 'OUT_FOR_DELIVERY' && "Your food is on the way!"}
              {order.status === 'DELIVERED' && "Delivered! Enjoy your meal."}
            </div>
          </div>
        ) : (
          <div className="bg-red-50 text-red-600 p-6 rounded-3xl shadow-sm border border-red-100 mb-6 text-center font-bold text-lg">
            This order was Cancelled.
          </div>
        )}

        {/* 2. Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Delivery Info */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-900 mb-4 flex items-center"><MapPin className="w-5 h-5 mr-2 text-orange-600" /> Delivery Details</h3>
             <p className="text-gray-600 text-sm leading-relaxed font-medium bg-gray-50 p-4 rounded-xl border border-gray-100">
               {order.address}
             </p>
             <div className="mt-4 pt-4 border-t border-gray-100">
               <p className="text-xs text-gray-500 font-bold uppercase mb-1">Payment Method</p>
               <p className="text-sm font-bold text-gray-800">Cash on Delivery</p>
             </div>
          </div>

          {/* Receipt */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-900 mb-4 flex items-center"><Receipt className="w-5 h-5 mr-2 text-orange-600" /> Order Receipt</h3>
             
             <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2">
               {order.items.map((item: any) => (
                 <div key={item.id} className="flex justify-between text-sm font-medium text-gray-600">
                   <span className="flex-1 pr-4">{item.quantity}x {item.meal.name}</span>
                   <span className="text-gray-900 shrink-0">৳ {(Number(item.price) * item.quantity).toFixed(0)}</span>
                 </div>
               ))}
             </div>

             <hr className="border-gray-100 mb-4" />
             
             <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
               <span>Subtotal</span>
               <span>৳ {(Number(order.totalAmount) - 50).toFixed(0)}</span>
             </div>
             <div className="flex justify-between text-sm font-medium text-gray-600 mb-4">
               <span>Delivery Fee</span>
               <span>৳ 50</span>
             </div>

             <div className="flex justify-between items-center pt-4 border-t border-gray-200">
               <span className="text-lg font-bold text-gray-900">Total</span>
               <span className="text-2xl font-extrabold text-orange-600">৳ {Number(order.totalAmount).toFixed(0)}</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}