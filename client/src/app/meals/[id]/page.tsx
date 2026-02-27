"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchMealById } from "@/src/utils/api";
import { Meal } from "@/src/types";
import { ArrowLeft, Minus, Plus, ShoppingBag, Star, Clock } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/src/store/cartStore";

export default function MealDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    async function loadMeal() {
      if (!params.id) return;
      try {
        const data = await fetchMealById(params.id as string);
        setMeal(data);
      } catch (error) {
        console.error("Failed to load meal", error);
      } finally {
        setLoading(false);
      }
    }
    loadMeal();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Meal not found 😢</h2>
        <button onClick={() => router.back()} className="text-orange-600 hover:underline">Go Back</button>
      </div>
    );
  }

  const price = typeof meal.price === 'string' ? parseFloat(meal.price) : meal.price;

  const handleAddToCart = () => {
    addItem(meal, quantity);
    alert(`Added ${quantity}x ${meal.name} to cart!`);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button onClick={() => router.back()} className="flex items-center text-gray-500 hover:text-orange-600 transition font-medium mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Menu
        </button>

        <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
          
          {/* Left: Huge Image */}
          <div className="w-full md:w-1/2 lg:w-[55%]">
            <div className="rounded-3xl overflow-hidden shadow-lg bg-gray-50 aspect-square md:aspect-auto md:h-[500px] relative">
              {meal.imageUrl ? (
                <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">🍔</div>
              )}
              {meal.dietaryPref && (
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md text-green-700 font-bold px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
                  🥬 {meal.dietaryPref}
                </div>
              )}
            </div>
          </div>

          {/* Right: Details & Cart Logic */}
          <div className="w-full md:w-1/2 lg:w-[45%] flex flex-col justify-center">
            
            {/* Badges & Title */}
            <div className="mb-6">
              <div className="flex gap-2 mb-3">
                {meal.category && (
                  <span className="bg-orange-100 text-orange-700 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-md">
                    {meal.category.name}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{meal.name}</h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {meal.description || "A delicious freshly prepared meal made with the finest ingredients."}
              </p>
            </div>

            {/* Provider Info */}
            {meal.provider && (
              <Link href={`/providers/${meal.provider.id}`} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition mb-8 group cursor-pointer">
                <img 
                  src={meal.provider.imageUrl || "https://placehold.co/100x100?text=Rest"} 
                  alt={meal.provider.restaurantName} 
                  className="w-12 h-12 rounded-full object-cover shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition">
                    {meal.provider.restaurantName || meal.provider.user?.name}
                  </h4>
                  <div className="flex items-center text-sm text-gray-500 mt-0.5">
                    <Star className="w-3.5 h-3.5 mr-1 text-yellow-400 fill-yellow-400" /> {meal.provider.rating || 4.5} 
                    <span className="mx-2">•</span>
                    <Clock className="w-3.5 h-3.5 mr-1" /> 30-45 min
                  </div>
                </div>
              </Link>
            )}

            <hr className="border-gray-100 mb-8" />

            {/* Price & Quantity */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Total Price</p>
                <div className="text-4xl font-extrabold text-gray-900">৳ {(price * quantity).toFixed(0)}</div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full p-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-orange-700 hover:shadow-xl transition transform active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <ShoppingBag className="w-6 h-6" />
              Add to Cart - ৳ {(price * quantity).toFixed(0)}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}