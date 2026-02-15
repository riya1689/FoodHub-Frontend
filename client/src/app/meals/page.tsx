"use client";

import { useState, useEffect } from "react";
import { fetchMeals, fetchProviders } from "@/src/utils/api";
import { Meal, Provider } from "@/src/types";
import MealCard from "@/src/components/MealCard";
import { Search, MapPin, Filter, ChevronRight, Clock, Star } from "lucide-react";
import Link from "next/link";

export default function MealBrowsingPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch Data on Load
  useEffect(() => {
    async function loadData() {
      try {
        const [mealsData, providersData] = await Promise.all([
          fetchMeals(),
          fetchProviders()
        ]);
        setMeals(mealsData);
        setProviders(providersData);
      } catch (error) {
        console.error("Failed to load meals", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter Logic
  const filteredMeals = meals.filter(meal => 
    meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (meal.provider?.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Derived Sections (Mocking the "Funnel" logic with real data)
  // First 2 items as "Deals"
  const dailyDeals = filteredMeals.slice(0, 2); 
  // Next 2 as "Combos"
  const specialCombos = filteredMeals.slice(2, 4); 
  // Top 8 for main grid
  const superDelicious = filteredMeals.slice(0, 8); 

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center items-center">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-20">
      
      {/* HERO SECTION*/}
      <div className="bg-white sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
             {/* Location */}
             <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-2 rounded-lg text-sm min-w-[140px] cursor-pointer hover:bg-gray-200 transition">
                <MapPin className="w-4 h-4 mr-2 text-orange-600" />
                <span className="truncate">New York, USA</span>
             </div>

             {/* Search Bar */}
             <div className="flex-1 relative w-full">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search for food (e.g., Pizza, Burger)..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 mt-8">

        {/* CATEGORIES*/}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Eat what makes you happy</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {['All', 'Pizza', 'Burger', 'Sushi', 'Dessert', 'Healthy', 'Drinks'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex flex-col items-center min-w-[80px] group transition ${selectedCategory === cat ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2 transition shadow-sm ${selectedCategory === cat ? 'bg-orange-600 text-white shadow-md scale-110' : 'bg-white text-gray-600 group-hover:bg-orange-50'}`}>
                   {cat === 'All' && '🍽️'}
                   {cat === 'Pizza' && '🍕'}
                   {cat === 'Burger' && '🍔'}
                   {cat === 'Sushi' && '🍣'}
                   {cat === 'Dessert' && '🍰'}
                   {cat === 'Healthy' && '🥗'}
                   {cat === 'Drinks' && '🥤'}
                </div>
                <span className={`text-sm font-medium ${selectedCategory === cat ? 'text-orange-600' : 'text-gray-600'}`}>{cat}</span>
              </button>
            ))}
          </div>
        </section>

        {/*YOUR DAILY DEAL*/}
        {dailyDeals.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
               <h2 className="text-2xl font-bold text-gray-900">🔥 Daily Deals</h2>
               <div className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold flex items-center">
                 <Clock className="w-3 h-3 mr-1" /> Ends in 02:45:10
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {dailyDeals.map(meal => (
                 <MealCard key={meal.id} meal={meal} isDeal={true} />
               ))}
            </div>
          </section>
        )}

        {/* FLAT DISCOUNT BANNER */}
        <section className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 md:p-10 text-white flex justify-between items-center shadow-lg relative overflow-hidden">
           <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-2">Flat 50% OFF</h3>
              <p className="text-orange-100 mb-6">On your first order. Use Code: WELCOME50</p>
              <button className="bg-white text-orange-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition shadow-md">
                Claim Now
              </button>
           </div>
           <div className="absolute right-0 top-0 h-full w-1/2 bg-white opacity-10 skew-x-12 transform translate-x-10"></div>
           <div className="hidden md:block text-9xl absolute right-10 -bottom-10 opacity-20 rotate-12">🍕</div>
        </section>

        {/* SUPER DELICIOUS */}
        <section>
           <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recommended for you</h2>
              <button className="text-orange-600 font-medium hover:underline flex items-center text-sm">
                View All <ChevronRight className="w-4 h-4" />
              </button>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {superDelicious.map(meal => (
                <MealCard key={meal.id} meal={meal} />
              ))}
           </div>
        </section>

        {/* TOP RESTAURANTS */}
        <section>
           <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Providers</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {providers.slice(0, 3).map(provider => (
                <Link href={`/providers/${provider.id}`} key={provider.id} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-lg transition flex items-center gap-4">
                   <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-2xl">
                     👨‍🍳
                   </div>
                   <div>
                      <h3 className="font-bold text-gray-900">{provider.user.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Star className="w-4 h-4 text-yellow-400 mr-1 fill-yellow-400" />
                        <span>4.8 (500+ ratings)</span>
                      </div>
                   </div>
                </Link>
              ))}
           </div>
        </section>

      </div>
    </div>
  );
}