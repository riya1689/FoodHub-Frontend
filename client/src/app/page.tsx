"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Utensils, Truck, ArrowRight, ChefHat } from "lucide-react";

// slider
const heroImages = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80", // Food Spread
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80", // Pizza
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80", // Sandwich
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/*HERO SECTION (Full Screen Slider) */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        
        {/* Background Image Slider */}
        <div className="absolute inset-0 z-0">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            speed={1200} 
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            className="w-full h-full"
          >
            {heroImages.map((src, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <img 
                    src={src} 
                    alt={`Hero slide ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  {/* Dark Overlay so white text is readable */}
                  <div className="absolute inset-0 bg-black/60"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Foreground Centered Text*/}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
            Delicious Food, <br />
            <span className="text-orange-500">Delivered to You.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-md">
            Order meals from your favorite local restaurants. Fresh ingredients, lightning-fast delivery, and satisfaction guaranteed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto">
            <Link 
              href="/meals" 
              className="flex items-center justify-center px-8 py-4 bg-orange-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-orange-700 hover:scale-105 transition transform"
            >
              Order Now <ArrowRight className="ml-2 w-5 h-5"/>
            </Link>
            
            {/* Glassmorphism button effect*/}
            <Link 
              href="/register?role=provider" 
              className="flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-lg shadow-sm hover:bg-white/20 transition"
            >
              List Your Restaurant
            </Link>
          </div>
        </div>

        {/* Floating Delivery Badge*/}
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

      {/* HOW IT WORKS Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-2 text-gray-600">Get your favorite food in 3 simple steps</p>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Browse Menu */}
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-md transition">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Browse Menu</h3>
              <p className="text-gray-500">Explore hundreds of meals from the best local providers.</p>
            </div>

            {/*Place Order*/}
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-md transition">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Place Order</h3>
              <p className="text-gray-500">Select your items and place order with Cash on Delivery.</p>
            </div>

            {/* Fast Delivery */}
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-md transition">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Fast Delivery</h3>
              <p className="text-gray-500">Relax while our providers prepare and deliver your food.</p>
            </div>
          </div>
        </div>
      </section>
      {/* CATEGORIES section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
               <h2 className="text-3xl font-bold text-gray-900">Explore Categories</h2>
               <p className="mt-1 text-gray-600">Find exactly what you are craving</p>
            </div>
            <Link href="/meals" className="text-orange-600 font-semibold hover:text-orange-700 flex items-center">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Burger', 'Pizza', 'Asian', 'Dessert'].map((category) => (
              <Link href={`/meals?category=${category}`} key={category} className="group block overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition">
                 <div className="h-32 bg-gray-200 flex items-center justify-center text-4xl group-hover:scale-105 transition duration-500">
                    {category === 'Burger' && '🍔'}
                    {category === 'Pizza' && '🍕'}
                    {category === 'Asian' && '🍜'}
                    {category === 'Dessert' && '🍰'}
                 </div>
                 <div className="p-4 text-center">
                    <h3 className="font-bold text-gray-800">{category}</h3>
                 </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* 4. BECOME A PROVIDER Section  */}
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