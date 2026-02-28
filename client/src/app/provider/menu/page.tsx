"use client";

import { useEffect, useState } from "react";
import { fetchProviderMeals, fetchCategories, addMeal, deleteMeal } from "@/src/utils/api";
import { UtensilsCrossed, Plus, Trash2, Image as ImageIcon } from "lucide-react";

export default function MenuManagementPage() {
  const [meals, setMeals] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [addingState, setAddingState] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", imageUrl: "", dietaryPref: "", categoryId: ""
  });

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const [mealsData, catsData] = await Promise.all([
          fetchProviderMeals(token),
          fetchCategories()
        ]);
        
        setMeals(mealsData);
        setCategories(catsData);
      } catch (error) {
        console.error("Failed to load menu data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingState(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const newMeal = await addMeal({
        ...formData,
        price: parseFloat(formData.price)
      }, token);

      // Refresh meals list locally
      setMeals([...meals, { ...newMeal.meal, category: categories.find(c => c.id === Number(formData.categoryId)) }]);
      setIsAdding(false);
      setFormData({ name: "", description: "", price: "", imageUrl: "", dietaryPref: "", categoryId: "" });
    } catch (error) {
      alert("Failed to add meal. Please try again.");
    } finally {
      setAddingState(false);
    }
  };

  const handleDeleteMeal = async (id: number) => {
    if (!confirm("Are you sure you want to delete this meal?")) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      await deleteMeal(id, token);
      setMeals(meals.filter(meal => meal.id !== id));
    } catch (error) {
      alert("Failed to delete meal. It might be linked to an existing order.");
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <UtensilsCrossed className="w-8 h-8 text-orange-600" /> Menu Management
          </h1>
          <p className="text-gray-500 mt-2">Add, view, and remove meals from your restaurant's menu.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-gray-900 text-white px-5 py-3 rounded-xl font-bold flex items-center shadow-md hover:bg-gray-800 transition"
        >
          {isAdding ? "Cancel" : <><Plus className="w-5 h-5 mr-2" /> Add New Meal</>}
        </button>
      </div>

      {/* Add New Meal Form */}
      {isAdding && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-lg mb-8 animate-fade-in-up">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Meal</h2>
          <form onSubmit={handleAddMeal} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Meal Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g., Spicy Chicken Burger" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Price (৳) *</label>
                <input required type="number" min="1" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g., 350" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Category *</label>
                  <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="">Select...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Dietary Pref</label>
                  <select value={formData.dietaryPref} onChange={e => setFormData({...formData, dietaryPref: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="">None</option>
                    <option value="Halal">Halal</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Veg">Non-Veg</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4 flex flex-col">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full h-[124px] bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 resize-none" placeholder="Describe the ingredients and taste..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500" placeholder="https://example.com/image.jpg" />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 mt-2">
              <button type="submit" disabled={addingState} className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-md hover:bg-orange-700 disabled:bg-orange-400 transition">
                {addingState ? "Adding Meal..." : "Save Meal"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Meals Grid */}
      <h2 className="text-xl font-bold text-gray-900 mb-6">Your Current Menu ({meals.length})</h2>
      
      {meals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="text-5xl mb-4">🍽️</div>
          <p className="text-xl font-bold text-gray-800">Your menu is empty</p>
          <p className="text-gray-500 mt-2">Click the button above to start adding delicious meals.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {meals.map(meal => {
            const price = typeof meal.price === 'string' ? parseFloat(meal.price) : meal.price;
            
            return (
              <div key={meal.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition flex flex-col">
                <div className="relative h-48 bg-gray-100">
                  <img src={meal.imageUrl || "https://placehold.co/400x300?text=Food"} alt={meal.name} className="w-full h-full object-cover" />
                  {meal.category && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm">
                      {meal.category.name}
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-1 flex-1 pr-2">{meal.name}</h3>
                    <span className="font-extrabold text-orange-600 shrink-0">৳ {price.toFixed(0)}</span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                    {meal.description || "No description provided."}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase">{meal.dietaryPref || "Standard"}</span>
                    <button 
                      onClick={() => handleDeleteMeal(meal.id)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                      title="Delete Meal"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}