import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; 
import { GoogleOAuthProvider } from '@react-oauth/google';
import ClientLayout from "@/src/components/ClientLayout"; // <-- Imported new wrapper

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FoodHub",
  description: "Order food online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          
          {/* Wrapped everything in the new ClientLayout */}
          <ClientLayout>
            {children}
          </ClientLayout>

        </GoogleOAuthProvider>
      </body>
    </html>
  );
}