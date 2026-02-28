"use client";

import { useEffect, useState } from "react";
import { fetchAdminStats } from "@/src/utils/api";
import { DollarSign, Users, ShoppingBag, Store, ShieldAlert, ClipboardList, Tags } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }
        const data = await fetchAdminStats(token);
        setStats(data);
      } catch (err: any) {
        console.error("Failed to load admin stats", err);
        setError("Access denied. You must be an Admin to view this page.");
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

  if (error || !stats) {
    return (
      <div className="h-full flex flex-col justify-center items-center pt-20">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Unauthorized Access</h2>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  const statCards = [
    { title: "Total Revenue", value: `৳ ${stats.totalRevenue.toFixed(0)}`, icon: <DollarSign className="w-6 h-6 text-green-600" />, bg: "bg-green-50" },
    { title: "Platform Orders", value: stats.totalOrders, icon: <ShoppingBag className="w-6 h-6 text-blue-600" />, bg: "bg-blue-50" },
    { title: "Total Users", value: stats.totalUsers, icon: <Users className="w-6 h-6 text-purple-600" />, bg: "bg-purple-50" },
    { title: "Active Restaurants", value: stats.totalProviders, icon: <Store className="w-6 h-6 text-orange-600" />, bg: "bg-orange-50" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Platform Overview</h1>
        <p className="text-gray-500 mt-1">Monitor the overall health and performance of FoodHub.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.title}</p>
              <h3 className="text-2xl font-extrabold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/users" className="block p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition group">
             <Users className="w-8 h-8 text-gray-400 group-hover:text-orange-600 mb-4 transition" />
             <h3 className="font-bold text-gray-900 mb-2">Manage Users</h3>
             <p className="text-sm text-gray-500">Suspend or activate customer and provider accounts.</p>
          </Link>
          <Link href="/admin/orders" className="block p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition group">
             <ClipboardList className="w-8 h-8 text-gray-400 group-hover:text-orange-600 mb-4 transition" />
             <h3 className="font-bold text-gray-900 mb-2">View All Orders</h3>
             <p className="text-sm text-gray-500">Monitor all transactions and delivery statuses globally.</p>
          </Link>
          <Link href="/admin/categories" className="block p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition group">
             <Tags className="w-8 h-8 text-gray-400 group-hover:text-orange-600 mb-4 transition" />
             <h3 className="font-bold text-gray-900 mb-2">Edit Categories</h3>
             <p className="text-sm text-gray-500">Add or remove food categories for the platform.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}