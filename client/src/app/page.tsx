"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { fetchMeals, fetchProviders, fetchCategories } from "@/src/utils/api";
import MealCard from "@/src/components/MealCard";
import { ArrowRight, Utensils, MapPin, Truck, Star, Clock, ChefHat, ChevronLeft, ChevronRight } from "lucide-react";

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
    title: "Delicious Food,",
    highlight: "Delivered to You.",
    subtitle: "Explore top-rated restaurants near you and satisfy your cravings.",
  },
  {
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1920&q=80",
    title: "Craving Something",
    highlight: "Spicy & Hot?",
    subtitle: "Check out our daily deals on local favorites and save big.",
  },
  {
    image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1920&q=80",
    title: "Healthy & Fresh",
    highlight: "Dietary Options.",
    subtitle: "Discover fresh, organic, and dietary-friendly meals.",
  }
];

export default function HomePage() {
  const [meals, setMeals] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 300; 
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth' 
      });
    }
  };
  
  const getCategoryImage = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('burger')) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&q=80';
    if (lowerName.includes('pizza')) return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=150&q=80';
    if (lowerName.includes('asian')) return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=150&q=80';
    if (lowerName.includes('dessert')) return 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=150&q=80';
    
    // Default fallback image for any other category
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'; 
  };


  useEffect(() => {
    async function loadData() {
      try {
        const [mealsData, providersData, categoriesData] = await Promise.all([
          fetchMeals(),
          fetchProviders(),
          fetchCategories().catch(() => []) 
        ]);
        setMeals(mealsData);
        setProviders(providersData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to load homepage data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-0">
      
      {/* HERO SECTION (Using Swiper) */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden mt-20 md:mt-0">
        <div className="absolute inset-0 z-0">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            speed={1200} 
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="w-full h-full"
          >
            {heroSlides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <img src={slide.image} alt={`Hero slide ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60"></div>
                  
                  {/* Slide Content */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
                      {slide.title} <br />
                      <span className="text-orange-500">{slide.highlight}</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-md">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto">
                      <Link href="/meals" className="flex items-center justify-center px-8 py-4 bg-orange-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-orange-700 hover:scale-105 transition transform">
                        Order Now <ArrowRight className="ml-2 w-5 h-5"/>
                      </Link>
                      <Link href="/providers" className="flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-lg shadow-sm hover:bg-white/20 transition">
                        View Restaurants
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Floating Delivery Badge */}
        <div className="hidden md:flex absolute bottom-8 right-8 z-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Truck className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Delivery</p>
            <p className="font-extrabold text-gray-900 text-lg">30 Mins</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* PROMOTIONAL BANNERS */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/meals" className="relative h-64 rounded-3xl overflow-hidden group shadow-md block">
            <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070" alt="Daily Deals" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-transparent flex flex-col justify-center p-8 md:p-10">
              <span className="bg-orange-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full w-max mb-3 tracking-wider">
                Daily Deals
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Buy 1 Get 1 Free</h3>
              <p className="text-gray-300 mb-6 font-medium">On selected pizzas & burgers today.</p>
              <div className="flex items-center text-orange-400 font-bold group-hover:text-white transition">
                Order Now <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition" />
              </div>
            </div>
          </Link>
          
          <Link href="/meals" className="relative h-64 rounded-3xl overflow-hidden group shadow-md block">
            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080" alt="Flat Discount" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-transparent flex flex-col justify-center p-8 md:p-10">
              <span className="bg-emerald-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full w-max mb-3 tracking-wider">
                Flat Discount
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">20% Off Everything</h3>
              <p className="text-gray-300 mb-6 font-medium">Ramadan Picks. Only For Today.</p>
              <div className="flex items-center text-emerald-400 font-bold group-hover:text-white transition">
                Order Now <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition" />
              </div>
            </div>
          </Link>
        </div>

        {/* EXPLORE CATEGORIES (Dynamic with Slider & Images) */}
        {categories && categories.length > 0 && (
          <div className="pb-16 pt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900">Explore Categories</h2>
              
              <div className="hidden sm:flex gap-2">
                <button 
                  onClick={() => scrollCategories('left')}
                  className="p-2 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition shadow-sm"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => scrollCategories('right')}
                  className="p-2 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition shadow-sm"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
              
            {/* --- NEW: Embedded CSS to forcefully hide the gray scrollbar --- */}
            <style>{`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            <div 
              ref={categoryScrollRef} 
              // Added style properties to hide scrollbar in Firefox/Edge as well
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar scroll-smooth"
            >
              {categories.map((category: any) => (
                <Link 
                  key={category.id} 
                  href={`/meals?category=${category.name}`} 
                  className="shrink-0 bg-gray-50 border border-gray-100 pl-2 pr-6 py-2 rounded-full font-bold text-gray-700 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition shadow-sm hover:shadow-md flex items-center gap-3 group"
                >
                  <img 
                    src={getCategoryImage(category.name)} 
                    alt={category.name} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-orange-200 transition"
                  />
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}
        {/* 6. RECOMMENDED FOR YOU */}
        <div className="py-8">
          <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Recommended For You</h2>
              <p className="text-gray-500">Based on top ratings and local popularity.</p>
            </div>
            <Link href="/meals" className="hidden sm:flex items-center text-orange-600 font-bold hover:text-orange-700 transition group">
              View All <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {meals.slice(0, 8).map(meal => (
               <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
          
          <Link href="/meals" className="sm:hidden mt-8 w-full bg-gray-100 text-gray-900 py-3 rounded-xl font-bold flex justify-center items-center hover:bg-gray-200 transition">
            View All Meals
          </Link>
        </div>

        {/* 7. TOP PROVIDERS */}
        <div className="py-20">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Top Restaurants</h2>
              <p className="text-gray-500">Discover the best food makers in your area.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {providers.slice(0, 3).map((provider: any) => (
              <Link 
                key={provider.id} 
                href={`/providers/${provider.id}`}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  <img 
                    src={provider.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1920"} 
                    alt={provider.restaurantName || provider.user?.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                    <Star className="w-3.5 h-3.5 mr-1 text-yellow-400 fill-yellow-400" /> {provider.rating || 4.5}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition">
                    {provider.restaurantName || provider.user?.name}
                  </h3>
                  <div className="flex flex-col gap-2 mt-3">
                    <div className="flex items-center text-sm text-gray-500 font-medium">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                      <span className="truncate">{provider.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 font-medium">
                      <Clock className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                      Delivery: 30-45 min
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-10 text-center">
             <Link href="/providers" className="inline-flex items-center text-gray-600 font-bold hover:text-orange-600 transition group border border-gray-200 hover:border-orange-200 bg-white px-8 py-4 rounded-full shadow-sm">
               View All Restaurants <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition" />
             </Link>
          </div>
        </div>
      </div>

      {/* BECOME A PROVIDER (Your original CTA!) */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Are you a Restaurant Owner?</h2>
            <p className="text-gray-400 text-lg mb-6">
              Join FoodHub today and reach more customers. Manage your menu and orders easily with our dedicated provider dashboard.
            </p>
            <Link 
              href="/register?role=provider" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-gray-900 bg-orange-500 hover:bg-orange-400 transition"
            >
              <ChefHat className="w-5 h-5 mr-2" />
              Join as Partner
            </Link>
          </div>
          <div className="md:w-1/3 flex justify-center">
             <div className="w-64 h-64 bg-gray-800 rounded-full flex items-center justify-center border-4 border-orange-500/20">
                <ChefHat className="w-32 h-32 text-orange-500" />
             </div>
          </div>
        </div>
      </section>

    </div>
  );
}

