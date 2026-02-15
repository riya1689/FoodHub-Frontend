import Link from "next/link";
import { Search, Utensils, Truck, Star, ArrowRight, ChefHat } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative bg-orange-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
          
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Delicious Food, <br />
              <span className="text-orange-600">Delivered to You.</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Order meals from your favorite local restaurants. Fresh, fast, and tasty.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                href="/meals" 
                className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-orange-600 hover:bg-orange-700 md:py-4 md:text-lg shadow-lg transition"
              >
                Order Now <ArrowRight className="ml-2 w-5 h-5"/>
              </Link>
              <Link 
                href="/register?role=provider" 
                className="flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg shadow-sm transition"
              >
                List Your Restaurant
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center relative">
            <div className="w-80 h-80 bg-orange-200 rounded-full blur-3xl absolute -z-10 opacity-50"></div>
            <div className="relative bg-white p-6 rounded-2xl shadow-xl rotate-3 hover:rotate-0 transition duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80" 
                  alt="Delicious Bowl" 
                  className="rounded-xl w-80 h-64 object-cover"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Truck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Delivery</p>
                    <p className="font-bold text-gray-800">30 Mins</p>
                  </div>
                </div>
            </div>
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
    </div>
  );
}