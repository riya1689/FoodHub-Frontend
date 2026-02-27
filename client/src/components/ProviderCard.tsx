"use client";

import { Provider } from "@/src/types";
import { Star, MapPin, ArrowRight, Eye } from "lucide-react";
import Link from "next/link";

interface ProviderCardProps {
  provider: Provider;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  // Use restaurantName if available, fallback to user.name
  const displayName = provider.restaurantName || provider.user?.name || "Local Restaurant";

  return (
    <Link 
      href={`/providers/${provider.id}`} 
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden flex flex-col h-full block"
    >
      {/* 1. Image Section */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {provider.imageUrl ? (
          <img 
            src={provider.imageUrl} 
            alt={displayName} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-orange-50">
            🏪
          </div>
        )}
      </div>

      {/* 2. Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Name & Rating Row */}
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="font-bold text-gray-900 text-xl line-clamp-1 group-hover:text-orange-600 transition">
            {displayName}
          </h3>
          <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-bold shrink-0">
            <Star className="w-3 h-3 mr-1 fill-green-700" /> 
            {provider.rating ? provider.rating.toFixed(1) : "4.5"}
          </div>
        </div>

        {/* Cuisines Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
           {provider.cuisines && provider.cuisines.length > 0 ? (
             provider.cuisines.map((cuisine, index) => (
               <span key={index} className="bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                 {cuisine}
               </span>
             ))
           ) : (
             <span className="bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
               Mixed Cuisine
             </span>
           )}
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-500 text-sm mb-4 mt-auto">
          <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
          <span className="line-clamp-1 font-medium">{provider.address || "Location unavailable"}</span>
        </div>

        {/* 3. Footer Section */}
        <div className="flex items-center justify-between bg-gray-50 -mx-5 -mb-5 px-5 py-4 border-t border-gray-100">
          
          {/* Left/Middle: View Details */}
          <div className="flex items-center text-sm font-bold text-gray-500 group-hover:text-orange-500 transition">
             <Eye className="w-4 h-4 mr-1.5" /> View Menu
          </div>

          {/* Right: Order Now Button */}
          <button className="bg-orange-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-orange-700 hover:shadow-md transition flex items-center active:scale-95">
             Order Now <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>
      </div>
    </Link>
  );
}