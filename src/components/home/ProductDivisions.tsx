"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Category } from "@/types";
import { DataStore } from "@/lib/store";
import { Wind, Filter, Droplet, Zap, ArrowRight, Layers } from "lucide-react";

const CATEGORY_ICONS: Record<string, any> = {
  "air-filter-paper": Filter,
  "air-filter-foam": Wind,
  "oil-filters": Droplet,
  "petrol-filters": Zap,
};

export default function ProductDivisions() {
  const [categories, setCategories] = useState<Category[]>([]);

  const loadCategories = () => {
    const all = DataStore.getCategories().filter((c) => c.is_active);
    setCategories(all);
  };

  useEffect(() => {
    loadCategories();

    // Listen for admin changes dynamically
    const handleUpdate = () => loadCategories();
    window.addEventListener("hrk_store_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("hrk_store_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <section className="w-full bg-[#f8fafc] py-16 lg:py-20 border-b border-slate-200" id="product-divisions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Simplified, No corporate jargon) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-50 border border-red-200 text-red-700 font-mono text-xs uppercase font-bold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              Filtration Range
            </div>
            <h2 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              PRODUCT CATEGORIES
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mt-1">
              Precision-manufactured replacement filters designed for motorcycles and scooters across Indian riding conditions.
            </p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 font-headline text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 transition-colors flex-shrink-0"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Dynamic Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, index) => {
            const IconComponent = CATEGORY_ICONS[cat.slug] || Layers;
            return (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.id}`}
                className="clean-card-interactive rounded-2xl p-5 flex flex-col justify-between group hover:border-red-300 transition-all cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                      Category {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all shadow-2xs">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-headline font-bold text-lg text-slate-900 group-hover:text-red-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {cat.description || "High-performance replacement filter element engineered to OE dimensions."}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-5">
                  <span className="text-xs font-headline font-bold text-slate-800 group-hover:text-red-600 transition-colors">
                    Explore SKUs
                  </span>
                  <ArrowRight className="w-4 h-4 text-red-600 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
