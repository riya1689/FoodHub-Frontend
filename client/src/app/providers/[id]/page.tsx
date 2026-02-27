"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchProviderById } from "@/src/utils/api";
import { Provider, Meal } from "@/src/types";
import MealCard from "@/src/components/MealCard";
import { Star, MapPin, Clock, Info } from "lucide-react";

export default function ProviderDetailsPage() {
  const params = useParams();
  const [provider, setProvider] = useState<Provider & { meals: Meal[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProvider() {
      if (!params.id) return;
      try {
        const data = await fetchProviderById(params.id as string);
        setProvider(data);
      } catch (error) {
        console.error("Failed to load provider", error);
      } finally {
        setLoading(false);
      }
    }
    loadProvider();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center items-center text-xl text-gray-500 font-medium">
        Restaurant not found.
      </div>
    );
  }

  const displayName = provider.restaurantName || provider.user?.name || "Restaurant";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* 1. HERO BANNER */}
      <div className="relative h-64 md:h-80 w-full bg-gray-900">
        <img 
          src={provider.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80"} 
          alt={displayName} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        
        {/* Banner Content */}
        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex flex-col md:flex-row gap-6 items-end">
             
             {/* Profile Avatar (Optional, re-using main image if avatar doesn't exist) */}
             <div className="w-24 h-24 rounded-2xl border-4 border-white bg-white overflow-hidden shadow-lg hidden md:block">
               <img src={provider.imageUrl || "https://placehold.co/200x200?text=Rest"} alt={displayName} className="w-full h-full object-cover" />
             </div>

             <div className="text-white flex-1">
               <div className="flex flex-wrap gap-2 mb-2">
                 {provider.cuisines?.map(c => (
                   <span key={c} className="bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                     {c}
                   </span>
                 ))}
               </div>
               <h1 className="text-4xl font-extrabold mb-2">{displayName}</h1>
               
               <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-200">
                 <span className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" /> {provider.rating} (500+ Ratings)</span>
                 <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-gray-300" /> {provider.address}</span>
                 <span className="flex items-center"><Clock className="w-4 h-4 mr-1 text-gray-300" /> Delivery: 30-45 min</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row gap-8">
        
        {/* 2. MAIN CONTENT (MENU) */}
        <div className="flex-1">
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
             <h2 className="text-xl font-bold text-gray-900">Full Menu</h2>
             <div className="text-sm text-gray-500 font-medium">{provider.meals?.length || 0} items available</div>
           </div>

           {provider.meals && provider.meals.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
               {/* We inject the provider object into the meal so the MealCard shows the restaurant info correctly */}
               {provider.meals.map(meal => (
                 <MealCard key={meal.id} meal={{...meal, provider: provider}} />
               ))}
             </div>
           ) : (
             <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
               <div className="text-5xl mb-4">🍽️</div>
               <p className="text-xl font-medium text-gray-800">No meals available yet.</p>
               <p className="text-gray-500 mt-2">This restaurant hasn't added any items to their menu.</p>
             </div>
           )}
        </div>

        {/* 3. SIDEBAR (INFO) */}
        <div className="w-full lg:w-80">
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-orange-600" /> About Restaurant
              </h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-gray-500 font-medium mb-1">Address</div>
                  <div className="text-gray-800 font-medium">{provider.address}</div>
                </div>
                <hr className="border-gray-50" />
                <div>
                  <div className="text-gray-500 font-medium mb-1">Minimum Order</div>
                  <div className="text-gray-800 font-medium">৳ 150</div>
                </div>
                <hr className="border-gray-50" />
                <div>
                  <div className="text-gray-500 font-medium mb-1">Delivery Fee</div>
                  <div className="text-gray-800 font-medium text-green-600">Free</div>
                </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}