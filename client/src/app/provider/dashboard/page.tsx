"use client";

import { useEffect, useState } from "react";
import { fetchProviderStats } from "@/src/utils/api";
import { Banknote, ShoppingBag, UtensilsCrossed, TrendingUp } from "lucide-react";

export default function ProviderDashboardPage() {
  const [stats, setStats] = useState({ totalOrders: 0, activeMeals: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const data = await fetchProviderStats(token);
        setStats(data);
      } catch (error) {
        console.error("Failed to load provider stats", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const statCards = [
    { title: "Total Revenue", value: `৳ ${stats.revenue.toFixed(0)}`, icon: <Banknote className="w-6 h-6 text-green-600" />, bg: "bg-green-50" },
    { title: "Total Orders", value: stats.totalOrders, icon: <ShoppingBag className="w-6 h-6 text-blue-600" />, bg: "bg-blue-50" },
    { title: "Active Meals", value: stats.activeMeals, icon: <UtensilsCrossed className="w-6 h-6 text-orange-600" />, bg: "bg-orange-50" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here is what's happening with your restaurant today.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{stat.title}</p>
              <h3 className="text-3xl font-extrabold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-10 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
        <div className="relative z-10 max-w-lg mb-6 md:mb-0">
          <div className="inline-flex items-center bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-orange-400 mb-4 border border-white/10 backdrop-blur-sm">
            <TrendingUp className="w-3 h-3 mr-1.5" /> Growth Track
          </div>
          <h2 className="text-3xl font-bold mb-3">Ready to grow your business?</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Keep your menu updated with fresh images and clear descriptions to attract more customers. Monitor your incoming orders to maintain a high rating!
          </p>
        </div>
        <div className="relative z-10 text-9xl"></div>
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}