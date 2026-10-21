"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { DataStore } from "@/lib/store";
import { siteConfig } from "@/lib/config";
import {
  ArrowRight,
  MessageSquare,
  CheckCircle,
  Settings,
  ShieldCheck,
  Truck,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Package,
} from "lucide-react";

export default function Hero() {
  const [activeProducts, setActiveProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const loadHeroProducts = () => {
    const list = DataStore.getProducts().filter((p) => p.is_active);
    setActiveProducts(list);
    setCurrentIndex(0);
  };

  useEffect(() => {
    loadHeroProducts();

    // Dynamically listen for admin deletions/additions
    const handleUpdate = () => loadHeroProducts();
    window.addEventListener("hrk_store_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("hrk_store_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Automated carouseling every 3.5 seconds across ACTIVE products
  useEffect(() => {
    if (isPaused || activeProducts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeProducts.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, activeProducts.length]);

  const currentProduct = activeProducts[currentIndex] || activeProducts[0];

  const whatsappUrl = siteConfig.whatsappNumber
    ? `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
        "Hi HRK Filters, I would like to inquire about wholesale replacement filter pricing."
      )}`
    : "#product-catalog";

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activeProducts.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + activeProducts.length) % activeProducts.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activeProducts.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % activeProducts.length);
  };

  return (
    <section className="relative w-full bg-white text-slate-900 overflow-hidden pt-8 pb-16 lg:py-20 border-b border-slate-200">
      {/* Soft ambient glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-50/60 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Copy, Metrics & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span className="font-headline text-[11px] font-bold text-red-700 tracking-wider uppercase">
                Premium Automotive Replacement Filters
              </span>
            </div>

            {/* Main Hero Title */}
            <h1 className="font-headline font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[48px] text-slate-900 tracking-tight leading-[1.15] max-w-2xl">
              100% PREMIUM QUALITY FILTERS FOR{" "}
              <span className="text-red-600 drop-shadow-xs">PROLONGED ENGINE LIFE</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
              Precision filtration manufacturing for two-wheelers across India. Engineered for high dust-holding capacity, optimal airflow, and reliable engine protection.
            </p>

            {/* 3 Signature Crimson Gradient Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 pt-2">
              <div className="crimson-metric-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between group hover:shadow-lg hover:shadow-red-900/30 transition-all hover:-translate-y-1 text-white">
                <div>
                  <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white mb-3">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div className="font-headline font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                    130+
                  </div>
                  <div className="font-headline text-[11px] font-bold text-red-100 uppercase tracking-wider mt-1">
                    TWO-WHEELER SPECS
                  </div>
                </div>
                <div className="w-8 h-1 bg-white/70 rounded-full mt-4 group-hover:w-14 transition-all" />
              </div>

              <div className="crimson-metric-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between group hover:shadow-lg hover:shadow-red-900/30 transition-all hover:-translate-y-1 text-white">
                <div>
                  <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white mb-3">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="font-headline font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                    100%
                  </div>
                  <div className="font-headline text-[11px] font-bold text-red-100 uppercase tracking-wider mt-1">
                    PRECISION OE FITMENT
                  </div>
                </div>
                <div className="w-8 h-1 bg-white/70 rounded-full mt-4 group-hover:w-14 transition-all" />
              </div>

              <div className="crimson-metric-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between group hover:shadow-lg hover:shadow-red-900/30 transition-all hover:-translate-y-1 text-white">
                <div>
                  <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white mb-3">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="font-headline font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                    PAN-INDIA
                  </div>
                  <div className="font-headline text-[11px] font-bold text-red-100 uppercase tracking-wider mt-1">
                    FACTORY DISPATCH
                  </div>
                </div>
                <div className="w-8 h-1 bg-white/70 rounded-full mt-4 group-hover:w-14 transition-all" />
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-headline text-sm font-bold shadow-md shadow-red-600/30 transition-all active:scale-95"
              >
                <span>BROWSE PRODUCTS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-slate-300 text-slate-800 font-headline text-sm font-semibold hover:border-emerald-600 hover:text-emerald-700 transition-all active:scale-95 shadow-xs hover:shadow"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WHATSAPP ENQUIRY</span>
              </a>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 pl-1">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Direct Factory Pricing</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Dynamic Carouseling Product Showcase */}
          <div className="lg:col-span-5 relative">
            <div
              className="relative rounded-3xl p-5 clean-card-interactive shadow-xl overflow-hidden border border-slate-200 transition-all duration-300"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

              {/* Card Header with Auto-changing indicator */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs font-headline">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-slate-800 font-bold uppercase tracking-wide">
                    FEATURED SPECIFICATION
                  </span>
                </div>
                {currentProduct && (
                  <div className="flex items-center gap-2">
                    <span className="text-red-700 font-mono font-bold px-2 py-0.5 rounded bg-red-50 border border-red-200">
                      SKU: {currentProduct.part_number}
                    </span>
                  </div>
                )}
              </div>

              {!currentProduct ? (
                <div className="h-72 flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <Package className="w-8 h-8 text-slate-400" />
                  <p className="text-xs text-slate-500">No active products in catalogue.</p>
                  <Link
                    href="/admin/products/new"
                    className="text-xs text-red-600 font-bold hover:underline"
                  >
                    + Add New Product in Admin
                  </Link>
                </div>
              ) : (
                <>
                  {/* Dynamic Product Showcase Card */}
                  <Link
                    href={`/products/${currentProduct.slug}`}
                    className="block group relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden mt-3 bg-gradient-to-b from-slate-50 to-slate-100/80 border border-slate-200 p-6 flex flex-col justify-between hover:border-red-300 transition-colors"
                  >
                    {/* Top Badges */}
                    <div className="flex items-center justify-between">
                      <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800 font-mono text-xs font-bold tracking-wide">
                        {currentProduct.compatible_models?.[0] || currentProduct.category_name}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <Sparkles className="w-3 h-3" />
                        {currentProduct.material_quality}
                      </span>
                    </div>

                    {/* Center Image / Visual Area */}
                    <div className="text-center space-y-2 my-auto">
                      {currentProduct.image_url ? (
                        <div className="w-24 h-24 mx-auto rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-2 group-hover:scale-105 transition-transform overflow-hidden">
                          <img
                            src={currentProduct.image_url}
                            alt={currentProduct.title}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                          <Layers className="w-10 h-10" />
                        </div>
                      )}
                      <h3 className="font-headline font-bold text-xl sm:text-2xl text-slate-900 group-hover:text-red-600 transition-colors">
                        {currentProduct.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">
                        {currentProduct.material_quality}
                      </p>
                      {currentProduct.oe_reference && (
                        <p className="text-[11px] text-slate-400 font-mono">
                          OEM Part #: {currentProduct.oe_reference}
                        </p>
                      )}
                    </div>

                    {/* Bottom Pricing & Box Packing Ribbon */}
                    <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-400 block">
                          Published MRP
                        </span>
                        <span className="font-mono text-base font-extrabold text-slate-900">
                          ₹{currentProduct.mrp.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-mono text-slate-400 block">
                          Box Packing
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-700">
                          Min. {currentProduct.min_order_qty} Pcs / Box
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Carousel Controls & Dot Steppers */}
                  {activeProducts.length > 1 && (
                    <div className="mt-4 flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        {activeProducts.slice(0, 6).map((s, idx) => (
                          <button
                            key={s.id}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-2 rounded-full transition-all ${
                              idx === currentIndex
                                ? "w-7 bg-red-600"
                                : "w-2 bg-slate-300 hover:bg-slate-400"
                            }`}
                            aria-label={`Show ${s.part_number}`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handlePrev}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Previous product"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleNext}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Next product"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/products/${currentProduct.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-headline font-bold text-red-600 hover:text-red-700 ml-2"
                        >
                          <span>View SKU</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
