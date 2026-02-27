"use client";

import { Meal } from "@/src/types";
import { Plus, Eye } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "../store/cartStore";

interface MealCardProps {
  meal: Meal;
  isDeal?: boolean; 
}

export default function MealCard({ meal, isDeal }: MealCardProps) {
  const price = typeof meal.price === 'string' ? parseFloat(meal.price) : meal.price;
  const addItem = useCartStore((state) => state.addItem);
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    addItem(meal, 1);
    alert(`Added ${meal.name} to cart!`);
  };

  return (
    <Link href={`/meals/${meal.id}`} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden flex flex-col h-full block">
      
      {/* 1. Image Section */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {meal.imageUrl ? (
          <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🍔</div>
        )}
        
        {/* Deal Badge */}
        {isDeal && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
            30% OFF
          </div>
        )}
      </div>

      {/* 2. Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* Badges: Category & Dietary Preference */}
        <div className="flex flex-wrap gap-2 mb-2">
           {meal.category && (
             <span className="bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
               {meal.category.name}
             </span>
           )}
           {meal.dietaryPref && (
             <span className="bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
               {meal.dietaryPref}
             </span>
           )}
        </div>

        {/* Meal Name */}
        <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-1 group-hover:text-orange-600 transition">
          {meal.name}
        </h3>

        {/* Provider Info (Small Avatar + Name) */}
        <div className="flex items-center gap-2 mb-4 mt-auto border-t border-gray-50 pt-3">
          <img 
            src={meal.provider?.imageUrl || "https://placehold.co/100x100?text=Rest"} 
            alt="Provider" 
            className="w-6 h-6 rounded-full object-cover border border-gray-200"
          />
          <span className="text-xs font-medium text-gray-500 line-clamp-1">
            {meal.provider?.restaurantName || meal.provider?.user.name || "Local Restaurant"}
          </span>
        </div>

        {/* Footer: Price | View Details | Add to Cart */}
        <div className="flex items-center justify-between bg-gray-50 -mx-4 -mb-4 px-4 py-3 border-t border-gray-100">
          
          {/* Left: Price */}
          <div className="font-extrabold text-gray-900 text-lg">
             ৳ {price.toFixed(0)}
          </div>
          
          {/* Middle: View Details */}
          <div className="flex items-center text-xs font-bold text-gray-400 group-hover:text-orange-500 transition">
             <Eye className="w-4 h-4 mr-1" /> Details
          </div>

          {/* Right: Add to Cart Button */}
          <button 
            onClick={addToCart}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 hover:text-white transition-all shadow-sm active:scale-90"
            title="Add to Cart"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  );
}
// "use client";

// import { Meal } from "@/src/types";
// import { Plus, ShoppingCart ,Eye} from "lucide-react";
// import Link from "next/link";

// interface MealCardProps {
//   meal: Meal;
//   isDeal?: boolean; 
// }

// export default function MealCard({ meal, isDeal }: MealCardProps) {
//   const price = parseFloat(meal.price);
  
//   const originalPrice = isDeal ? (price * 1.3).toFixed(2) : null;

//   const addToCart = () => {
    
//     alert(`Added ${meal.name} to cart!`);
//   };

//   return (
//     <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden flex flex-col h-full">
//       {/* Image Section */}
//       <div className="relative h-48 bg-gray-200 overflow-hidden">
//         {meal.imageUrl ? (
//           <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-400">
//             <span className="text-4xl">🍔</span>
//           </div>
//         )}
        
//         {/* Discount Badge */}
//         {isDeal && (
//           <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
//             30% OFF
//           </div>
//         )}
//       </div>

//       {/* Content Section */}
//       <div className="p-4 flex flex-col flex-grow">
//         <div className="flex justify-between items-start mb-1">
//            <h3 className="font-bold text-gray-900 line-clamp-1 text-lg group-hover:text-orange-600 transition">
//              {meal.name}
//            </h3>
//            <div className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
//              4.5 ★
//            </div>
//         </div>
        
//         <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-grow">
//           {meal.description || "Delicious meal prepared with fresh ingredients."}
//         </p>

//         {/* Footer - Price & Add Button */}
//         <div className="mt-auto flex items-center justify-between">
//           <div>
//              {isDeal && (
//                <span className="text-xs text-gray-400 line-through mr-1">${originalPrice}</span>
//              )}
//              <span className="text-xl font-bold text-gray-900">${price.toFixed(2)}</span>
//           </div>
          
//           <button 
//             onClick={addToCart}
//             className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all shadow-sm hover:shadow-md active:scale-90"
//             title="Add to Cart"
//           >
//             <Plus className="w-5 h-5" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }