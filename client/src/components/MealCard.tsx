"use client";

import { Meal } from "@/src/types";
import { Plus, ShoppingCart } from "lucide-react";

interface MealCardProps {
  meal: Meal;
  isDeal?: boolean; 
}

export default function MealCard({ meal, isDeal }: MealCardProps) {
  const price = parseFloat(meal.price);
  
  const originalPrice = isDeal ? (price * 1.3).toFixed(2) : null;

  const addToCart = () => {
    
    alert(`Added ${meal.name} to cart!`);
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {meal.imageUrl ? (
          <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-400">
            <span className="text-4xl">🍔</span>
          </div>
        )}
        
        {/* Discount Badge */}
        {isDeal && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
            30% OFF
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
           <h3 className="font-bold text-gray-900 line-clamp-1 text-lg group-hover:text-orange-600 transition">
             {meal.name}
           </h3>
           <div className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
             4.5 ★
           </div>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-grow">
          {meal.description || "Delicious meal prepared with fresh ingredients."}
        </p>

        {/* Footer - Price & Add Button */}
        <div className="mt-auto flex items-center justify-between">
          <div>
             {isDeal && (
               <span className="text-xs text-gray-400 line-through mr-1">${originalPrice}</span>
             )}
             <span className="text-xl font-bold text-gray-900">${price.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={addToCart}
            className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all shadow-sm hover:shadow-md active:scale-90"
            title="Add to Cart"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}