import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">FoodHub</h2>
            <p className="text-gray-400 text-sm">
              Delivering happiness to your doorstep. The best local restaurants, all in one place.
            </p>
          </div>

          {/*Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Discover</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/meals" className="hover:text-white transition">Browse Menu</Link></li>
              <li><Link href="/providers" className="hover:text-white transition">Our Restaurants</Link></li>
              <li><Link href="/offers" className="hover:text-white transition">Special Offers</Link></li>
            </ul>
          </div>

          {/*For Providers */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Partners</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/register?role=provider" className="hover:text-white transition">Become a Partner</Link></li>
              <li><Link href="/provider/login" className="hover:text-white transition">Provider Login</Link></li>
              <li><Link href="/admin" className="hover:text-white transition">Admin Access</Link></li>
            </ul>
          </div>

          {/*Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>help@foodhub.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Food Street, Tech City</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} FoodHub Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}