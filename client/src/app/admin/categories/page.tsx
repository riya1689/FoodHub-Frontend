"use client";

import { useEffect, useState } from "react";
import { fetchCategories, addAdminCategory, deleteAdminCategory } from "@/src/utils/api";
import { Tags, Plus, Trash2, LayoutGrid } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add Category State
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    setIsAdding(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await addAdminCategory(newCategoryName, token);
      setCategories([...categories, response.category]);
      setNewCategoryName(""); 
    } catch (error: any) {
      alert(error.message || "Failed to add category.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure? If meals are using this category, it will fail.")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await deleteAdminCategory(id, token);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error: any) {
      alert(error.message || "Failed to delete category.");
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <Tags className="w-8 h-8 text-orange-600" /> Category Management
        </h1>
        <p className="text-gray-500 mt-2">Add or remove food categories used across the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left: Add New Category Form */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Plus className="w-5 h-5 mr-2 text-orange-600" /> Create Category
            </h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category Name</label>
                <input 
                  type="text" 
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Seafood" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition"
                />
              </div>
              <button 
                type="submit" 
                disabled={isAdding || !newCategoryName.trim()}
                className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-orange-700 disabled:bg-orange-300 transition"
              >
                {isAdding ? "Adding..." : "Add Category"}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Existing Categories Grid */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <LayoutGrid className="w-5 h-5 mr-2 text-orange-600" /> Active Categories ({categories.length})
            </h2>

            {categories.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
                No categories found. Create one to get started!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-200 group hover:border-orange-300 hover:bg-orange-50/50 transition">
                    <span className="font-bold text-gray-800">{category.name}</span>
                    <button 
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}