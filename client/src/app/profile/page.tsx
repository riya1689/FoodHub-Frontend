"use client";

import { useEffect, useState } from "react";
import { fetchMe, updateUserProfile } from "@/src/utils/api";
import { User, Mail, Lock, Shield, Calendar, Edit3, CheckCircle, Package } from "lucide-react";
import Link from "next/link";
export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }
        const data = await fetchMe(token);
        setUser(data);
        setFormData({ name: data.name, email: data.email, password: "" });
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await updateUserProfile(formData, token);
      
      setUser({ ...user, name: response.user.name, email: response.user.email });
      setFormData({ ...formData, password: "" }); // Clear password field after success
      setSuccessMsg("Profile updated successfully!");
      
      // Update localStorage so the Navbar reflects the new name instantly
      localStorage.setItem("user", JSON.stringify(response.user));
      window.dispatchEvent(new Event("storage"));
      
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <User className="w-8 h-8 text-orange-600" /> My Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left: Info Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-4 shadow-inner">
                <User className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h2>
              <p className="text-gray-500 text-sm mb-4">{user.email}</p>
              
              <div className="w-full space-y-3 mt-4">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-sm font-bold text-gray-500 flex items-center"><Shield className="w-4 h-4 mr-2" /> Role</span>
                  <span className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">{user.role}</span>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-sm font-bold text-gray-500 flex items-center"><Calendar className="w-4 h-4 mr-2" /> Joined</span>
                  <span className="text-sm font-bold text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                {/* My Orders Navigation */}
                <Link href="/orders" className="flex items-center justify-between bg-orange-600 text-white p-3 rounded-xl hover:bg-orange-700 transition w-full shadow-sm mt-4 group">
                  <span className="text-sm font-bold flex items-center">
                    <Package className="w-4 h-4 mr-2" /> My Orders
                  </span>
                  <span className="text-sm font-bold group-hover:translate-x-1 transition-transform">View &rarr;</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Edit Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Edit3 className="w-5 h-5 mr-2 text-orange-600" /> Edit Information
              </h3>

              {successMsg && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl font-medium flex items-center animate-fade-in-up">
                  <CheckCircle className="w-5 h-5 mr-2" /> {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl font-medium animate-fade-in-up">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">New Password (Optional)</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <input 
                      type="password" 
                      placeholder="Leave blank to keep current password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button 
                    type="submit" 
                    disabled={updating}
                    className="w-full md:w-auto bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-orange-700 disabled:bg-orange-300 transition"
                  >
                    {updating ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


