"use client";

import { useEffect, useState } from "react";
import { fetchMyOrders } from "@/src/utils/api";
import Link from "next/link";
import { Package, ArrowRight, Clock, CheckCircle, XCircle, ChefHat, Truck } from "lucide-react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const data = await fetchMyOrders(token);
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const getStatusUI = (status: string) => {
    switch (status) {
      case 'PENDING': return { icon: <Clock className="w-4 h-4 mr-1.5"/>, color: "text-amber-600 bg-amber-50 border-amber-200" };
      case 'PREPARING': return { icon: <ChefHat className="w-4 h-4 mr-1.5"/>, color: "text-blue-600 bg-blue-50 border-blue-200" };
      case 'OUT_FOR_DELIVERY': return { icon: <Truck className="w-4 h-4 mr-1.5"/>, color: "text-purple-600 bg-purple-50 border-purple-200" };
      case 'DELIVERED': return { icon: <CheckCircle className="w-4 h-4 mr-1.5"/>, color: "text-green-600 bg-green-50 border-green-200" };
      case 'CANCELLED': return { icon: <XCircle className="w-4 h-4 mr-1.5"/>, color: "text-red-600 bg-red-50 border-red-200" };
      default: return { icon: <Clock className="w-4 h-4 mr-1.5"/>, color: "text-gray-600 bg-gray-50 border-gray-200" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <Package className="w-8 h-8 text-orange-600" /> My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
             <div className="text-6xl mb-4">🛒</div>
             <p className="text-xl font-bold text-gray-800">No orders yet</p>
             <p className="text-gray-500 mt-2 mb-6">Looks like you haven't placed an order.</p>
             <Link href="/meals" className="bg-orange-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-orange-700 transition">
               Start Ordering
             </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusUI = getStatusUI(order.status);
              return (
                <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-gray-900 text-lg">Order #{order.id}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center ${statusUI.color}`}>
                          {statusUI.icon} {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                      <p className="font-extrabold text-xl text-gray-900">৳ {Number(order.totalAmount).toFixed(0)}</p>
                    </div>
                  </div>

                  <hr className="border-gray-100 mb-4" />

                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-600 truncate pr-4">
                      {order.items.map((item: any) => `${item.quantity}x ${item.meal.name}`).join(', ')}
                    </p>
                    <Link href={`/orders/${order.id}`} className="shrink-0 flex items-center text-sm font-bold text-orange-600 hover:text-orange-700 transition bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl">
                      Track Order <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}