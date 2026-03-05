"use client";

import { useState, useEffect } from "react";
import { fetchMeals } from "@/src/utils/api";
import { Meal } from "@/src/types";
import MealCard from "@/src/components/MealCard";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";

export default function MealsCatalogPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchMeals();
        setMeals(data);
      } catch (error) {
        console.error("Failed to load meals", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (meal.provider?.restaurantName?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || meal.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center text-gray-600 bg-gray-50 px-4 py-3 rounded-xl text-sm min-w-[160px] cursor-pointer hover:bg-gray-100 transition w-full md:w-auto">
              <MapPin className="w-5 h-5 mr-2 text-orange-600" />
              <span className="font-medium truncate">Dhaka, BD</span>
            </div>
            
            <div className="flex-1 relative w-full flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search for meals or restaurants..." 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-xl transition flex items-center justify-center">
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
        </div>

        {/* Categories Rail */}
        <div>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {['All', 'Burger', 'Pizza', 'Asian', 'Healthy', 'Dessert', 'Snack', 'Biriyani'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                  selectedCategory === cat 
                  ? 'bg-orange-600 text-white shadow-orange-500/30' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
           <div className="py-20 flex justify-center items-center">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
           </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {filteredMeals.length} Meals Found
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredMeals.map(meal => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
            {filteredMeals.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                <div className="text-6xl mb-4">🍽️</div>
                <p className="text-xl font-medium">No meals found for this criteria.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

