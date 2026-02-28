"use client";

import { useEffect, useState } from "react";
import { fetchAllOrders } from "@/src/utils/api";
import { ClipboardList, Search, Clock, CheckCircle, ChefHat, Truck, XCircle, Store, User } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const data = await fetchAllOrders(token);
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
      case 'PENDING': return { icon: <Clock className="w-3.5 h-3.5 mr-1"/>, color: "text-amber-700 bg-amber-50 border-amber-200" };
      case 'PREPARING': return { icon: <ChefHat className="w-3.5 h-3.5 mr-1"/>, color: "text-blue-700 bg-blue-50 border-blue-200" };
      case 'OUT_FOR_DELIVERY': return { icon: <Truck className="w-3.5 h-3.5 mr-1"/>, color: "text-purple-700 bg-purple-50 border-purple-200" };
      case 'DELIVERED': return { icon: <CheckCircle className="w-3.5 h-3.5 mr-1"/>, color: "text-green-700 bg-green-50 border-green-200" };
      case 'CANCELLED': return { icon: <XCircle className="w-3.5 h-3.5 mr-1"/>, color: "text-red-700 bg-red-50 border-red-200" };
      default: return { icon: <Clock className="w-3.5 h-3.5 mr-1"/>, color: "text-gray-700 bg-gray-50 border-gray-200" };
    }
  };

  // Filter by Order ID, Customer Name, or Restaurant Name
  const filteredOrders = orders.filter(order => {
    const searchLower = searchQuery.toLowerCase();
    const matchesId = order.id.toString().includes(searchLower);
    const matchesCustomer = order.customer?.name?.toLowerCase().includes(searchLower);
    
    // Check if any item in the order comes from a matching restaurant
    const matchesRestaurant = order.items.some((item: any) => 
      item.meal.provider?.restaurantName?.toLowerCase().includes(searchLower)
    );

    return matchesId || matchesCustomer || matchesRestaurant;
  });

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center pt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-orange-600" /> Platform Orders
          </h1>
          <p className="text-gray-500 mt-2">Monitor all transactions and delivery statuses globally.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Order ID, Customer, or Restaurant..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-bold">Order ID</th>
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold">Restaurant</th>
                <th className="p-4 font-bold">Amount</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusUI = getStatusUI(order.status);
                  
                  // Extract the restaurant name
                  const restaurantName = order.items[0]?.meal?.provider?.restaurantName || "Unknown";

                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition group">
                      
                      {/* Order ID */}
                      <td className="p-4">
                        <span className="font-extrabold text-gray-900">#{order.id}</span>
                        <div className="text-xs text-gray-400 mt-1 truncate max-w-[120px]">
                          {order.items.length} items
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{order.customer?.name}</span>
                            <span className="text-xs text-gray-500">{order.customer?.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Restaurant Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-orange-500" />
                          <span className="font-bold text-gray-700">{restaurantName}</span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="p-4">
                        <span className="font-extrabold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                          ৳ {Number(order.totalAmount).toFixed(0)}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${statusUI.color}`}>
                          {statusUI.icon} {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-sm text-gray-500 font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                        <div className="text-xs text-gray-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}