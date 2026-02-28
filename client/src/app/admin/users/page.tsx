"use client";

import { useEffect, useState } from "react";
import { fetchAllUsers, toggleUserStatus } from "@/src/utils/api";
import { Users, Ban, CheckCircle, Shield, Search } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const data = await fetchAllUsers(token);
        setUsers(data);
      } catch (error) {
        console.error("Failed to load users", error);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'suspend' : 'activate'} this user?`)) return;
    
    setUpdatingId(userId);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await toggleUserStatus(userId, !currentStatus, token);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive: !currentStatus } : user
      ));
    } catch (error: any) {
      alert(error.message || "Failed to update user status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center pt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-orange-600" /> User Management
          </h1>
          <p className="text-gray-500 mt-2">View all registered accounts and manage their access.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search name or email..." 
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
                <th className="p-4 font-bold">User</th>
                <th className="p-4 font-bold">Role</th>
                <th className="p-4 font-bold">Joined</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    
                    {/* User Info */}
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{user.name}</span>
                        <span className="text-sm text-gray-500">{user.email}</span>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'PROVIDER' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role === 'ADMIN' && <Shield className="w-3 h-3 mr-1" />}
                        {user.role}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="p-4 text-sm text-gray-600 font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      {user.isActive ? (
                        <span className="inline-flex items-center text-green-600 bg-green-50 px-2.5 py-1 rounded-lg text-xs font-bold border border-green-200">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-red-600 bg-red-50 px-2.5 py-1 rounded-lg text-xs font-bold border border-red-200">
                          <Ban className="w-3.5 h-3.5 mr-1" /> Suspended
                        </span>
                      )}
                    </td>

                    {/* Action Toggle */}
                    <td className="p-4 text-right">
                      {user.role === 'ADMIN' ? (
                        <span className="text-xs text-gray-400 font-bold uppercase">Protected</span>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(user.id, user.isActive)}
                          disabled={updatingId === user.id}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                            user.isActive 
                              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100' 
                              : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-100'
                          } disabled:opacity-50`}
                        >
                          {updatingId === user.id ? 'Updating...' : user.isActive ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}