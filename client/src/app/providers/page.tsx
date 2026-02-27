"use client";

import { useState, useEffect } from "react";
import { fetchProviders } from "@/src/utils/api";
import { Provider } from "@/src/types";
import ProviderCard from "@/src/components/ProviderCard";
import { Search, MapPin, Store } from "lucide-react";

export default function ProvidersCatalogPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchProviders();
        setProviders(data);
      } catch (error) {
        console.error("Failed to load providers", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter providers by name or cuisine array
  const filteredProviders = providers.filter(provider => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatches = (provider.restaurantName || provider.user?.name || "").toLowerCase().includes(searchLower);
    const cuisineMatches = provider.cuisines?.some(c => c.toLowerCase().includes(searchLower));
    
    return nameMatches || cuisineMatches;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Store className="w-8 h-8 text-orange-600" />
            Top Restaurants
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Discover the best food makers in your area.</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center text-gray-600 bg-gray-50 px-4 py-3 rounded-xl text-sm min-w-[160px] cursor-pointer hover:bg-gray-100 transition w-full md:w-auto">
              <MapPin className="w-5 h-5 mr-2 text-orange-600" />
              <span className="font-medium truncate">Dhaka, BD</span>
            </div>
            
            <div className="flex-1 relative w-full">
              <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search for restaurants or cuisines (e.g., Burger, Italian)..." 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
        </div>

        {/* Provider Grid */}
        {loading ? (
           <div className="py-20 flex justify-center items-center">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
           </div>
        ) : (
          <div>
            <h2 className="text-lg font-bold text-gray-600 mb-6">
              {filteredProviders.length} Restaurants Found
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProviders.map(provider => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>

            {/* Empty State */}
            {filteredProviders.length === 0 && (
              <div className="text-center py-20 text-gray-500 bg-white rounded-3xl border border-gray-100 shadow-sm mt-6">
                <div className="text-6xl mb-4">🏪</div>
                <p className="text-xl font-medium text-gray-800">No restaurants found.</p>
                <p className="text-sm mt-2">Try searching for a different cuisine or name.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}