"use client";

import { useEffect, useState } from "react";
import { fetchProviderOrders, updateOrderStatus } from "@/src/utils/api";
import { ClipboardList, MapPin, User, CheckCircle2, AlertCircle } from "lucide-react";

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const data = await fetchProviderOrders(token);
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      await updateOrderStatus(orderId, newStatus, token);
      
      // Update the order in the local state so the UI reflects the change
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
    } catch (error) {
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center pt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <ClipboardList className="w-8 h-8 text-orange-600" /> Order Management
        </h1>
        <p className="text-gray-500 mt-2">Manage incoming orders and update their delivery status.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mt-6">
          <div className="text-6xl mb-4">💤</div>
          <p className="text-xl font-bold text-gray-800">No active orders</p>
          <p className="text-gray-500 mt-2">When customers order your food, they will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => {
             // Calculate revenue specifically for THIS provider in case it's a mixed order
             const orderTotal = order.items.reduce((sum: number, item: any) => sum + (Number(item.price) * item.quantity), 0);

             return (
              <div key={order.id} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-6 lg:gap-10 transition hover:shadow-md">
                
                {/* Left: Order Info & Customer */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-extrabold text-xl text-gray-900">Order #{order.id}</span>
                    <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 space-y-3">
                    <div className="flex items-center text-gray-700 text-sm font-medium">
                      <User className="w-4 h-4 mr-2 text-orange-500 shrink-0" />
                      {order.customer?.name || "Customer"} 
                      <span className="text-gray-400 font-normal ml-2">({order.customer?.email})</span>
                    </div>
                    <div className="flex items-start text-gray-700 text-sm font-medium">
                      <MapPin className="w-4 h-4 mr-2 text-orange-500 mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{order.address}</span>
                    </div>
                  </div>
                </div>

                {/* Middle: Order Items */}
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Items Ordered</h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <span className="font-bold text-gray-800 text-sm">
                          <span className="text-orange-600 mr-2">{item.quantity}x</span> {item.meal.name}
                        </span>
                        <span className="text-gray-900 font-bold text-sm">
                          ৳ {(Number(item.price) * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-500">Order Revenue</span>
                    <span className="text-xl font-extrabold text-green-600">৳ {orderTotal.toFixed(0)}</span>
                  </div>
                </div>

                {/* Right: Status Updater */}
                <div className="w-full lg:w-64 bg-gray-50 p-5 rounded-2xl border border-gray-200 flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-gray-800 mb-3">Update Order Status</h4>
                  
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                    className={`w-full p-3 rounded-xl border-2 font-bold outline-none transition cursor-pointer appearance-none ${
                      order.status === 'PENDING' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                      order.status === 'PREPARING' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                      order.status === 'OUT_FOR_DELIVERY' ? 'bg-purple-50 border-purple-200 text-purple-700' :
                      order.status === 'DELIVERED' ? 'bg-green-50 border-green-200 text-green-700' :
                      'bg-gray-100 border-gray-200 text-gray-500'
                    }`}
                  >
                    <option value="PENDING"> Pending</option>
                    <option value="PREPARING"> Preparing</option>
                    <option value="OUT_FOR_DELIVERY"> Out for Delivery</option>
                    <option value="DELIVERED"> Delivered</option>
                    <option value="CANCELLED"> Cancelled</option>
                  </select>

                  {updatingId === order.id && (
                    <p className="text-xs text-orange-600 font-bold mt-3 text-center animate-pulse">
                      Updating...
                    </p>
                  )}
                  
                  {order.status === 'DELIVERED' && (
                    <div className="mt-4 flex items-center justify-center text-xs font-bold text-green-600 bg-green-100 py-2 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 mr-1" /> Order Completed
                    </div>
                  )}
                </div>

              </div>
             );
          })}
        </div>
      )}
    </div>
  );
}