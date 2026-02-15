import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/Navbar"; // Import Navbar
import Footer from "@/src/components/footer"; // Import Footer

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FoodHub - Order Meals Online",
  description: "Delicious meals delivered to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navbar is fixed at top */}
        <Navbar />
        
        {/* Main Content: Add padding top so navbar doesn't cover content */}
        <div className="pt-16 min-h-screen flex flex-col">
          <main className="flex-grow">
            {children}
          </main>
          
          {/* Footer at bottom */}
          <Footer />
        </div>
      </body>
    </html>
  );
}