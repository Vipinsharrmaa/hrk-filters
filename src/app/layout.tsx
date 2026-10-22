import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementTicker from "@/components/layout/AnnouncementTicker";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import WhatsAppModal from "@/components/cart/WhatsAppModal";
import StoreSync from "@/components/common/StoreSync";

export const metadata: Metadata = {
  title: "HRK FILTERS | High Performance Automotive Filtration",
  description:
    "Manufacturer and wholesale supplier of two-wheeler automotive air, oil, and petrol filters.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white font-sans text-slate-800 antialiased selection:bg-red-600 selection:text-white overflow-x-hidden min-h-screen flex flex-col">
        <CartProvider>
          <StoreSync />
          <AnnouncementTicker />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppModal />
        </CartProvider>
      </body>
    </html>
  );
}
