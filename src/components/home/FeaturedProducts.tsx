"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Category, Product } from "@/types";
import { siteConfig } from "@/lib/config";
import { useCart } from "@/context/CartContext";
import { DataStore } from "@/lib/store";
import {
  Search,
  ShoppingCart,
  MessageSquare,
  Check,
  Layers,
  ArrowUpRight,
  X,
} from "lucide-react";

export default function FeaturedProducts() {
  const router = useRouter();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; label: string }[]>([
    { id: "all", label: "All Products" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [addedItem, setAddedItem] = useState<string | null>(null);

  // Load products and dynamic categories from DataStore
  const loadData = () => {
    setProducts(DataStore.getProducts());
    const dbCats = DataStore.getCategories().filter((c) => c.is_active);
    const catPills = [
      { id: "all", label: "All Products" },
      ...dbCats.map((c) => ({ id: c.id, label: c.name })),
    ];
    setCategories(catPills);
  };

  useEffect(() => {
    loadData();
    DataStore.syncWithSupabase();

    // Dynamically listen for admin additions/edits
    const handleUpdate = () => loadData();
    window.addEventListener("hrk_store_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("hrk_store_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const filteredProducts = products.filter((p) => {
    if (!p.is_active) return false;
    const matchesCategory =
      selectedCategory === "all" || p.category_id === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      p.part_number.toLowerCase().includes(query) ||
      p.title.toLowerCase().includes(query) ||
      p.compatible_models?.some((m) => m.toLowerCase().includes(query)) ||
      p.material_quality.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Don't trigger card navigation
    addItem(product, product.min_order_qty || 10);
    setAddedItem(product.part_number);
    setTimeout(() => setAddedItem(null), 1800);
  };

  const handleCardClick = (slug: string) => {
    router.push(`/products/${slug}`);
  };

  return (
    <section className="w-full bg-white py-16 lg:py-20 border-b border-slate-200" id="product-catalog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Controls (Simplified as requested: FEATURED PRODUCTS, no B2B jargon) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs uppercase font-bold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Direct From Factory
            </div>
            <h2 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              FEATURED PRODUCTS
            </h2>
            <p className="text-sm text-slate-600">
              High-performance replacement filters with published MRPs and standard box pack quantities.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search part #, bike model, or filter type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 border border-slate-200 rounded-full text-xs text-slate-800 focus:outline-none focus:border-red-600 transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all flex-shrink-0 cursor-pointer ${
                selectedCategory === c.id
                  ? "bg-red-600 text-white font-bold shadow-xs"
                  : "bg-slate-100 border border-slate-200 text-slate-700 hover:border-red-400 hover:text-red-700 font-medium"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200 p-8">
            <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-500 mx-auto flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-headline font-bold text-slate-800 text-base">
              No Products Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No SKUs match the selected category or search query. You can add new products in the Admin Console.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-full bg-red-600 text-white font-headline text-xs font-bold hover:bg-red-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const isJustAdded = addedItem === p.part_number;
              const singleItemWhatsAppUrl = siteConfig.whatsappNumber
                ? `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                    `Hi HRK Filters, I would like to inquire about ${p.part_number} (${p.title}) - MRP ₹${p.mrp.toFixed(2)}, Min Box Pack: ${p.min_order_qty} Pcs.`
                  )}`
                : undefined;

              return (
                /* Entire card is clickable to view product details right away */
                <div
                  key={p.part_number}
                  onClick={() => handleCardClick(p.slug)}
                  className="clean-card-interactive rounded-2xl p-4 flex flex-col justify-between cursor-pointer group hover:border-red-400 hover:shadow-md transition-all"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleCardClick(p.slug);
                    }
                  }}
                >
                  <div className="space-y-3">
                    {/* Card Badge Header */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-bold">
                        SKU: {p.part_number}
                      </span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        IN STOCK
                      </span>
                    </div>

                    {/* Thumbnail Container */}
                    <div className="w-full h-44 bg-slate-50 rounded-xl flex flex-col items-center justify-center p-3 relative overflow-hidden group border border-slate-200 group-hover:bg-slate-100/70 transition-colors">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.title}
                          className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mb-2 group-hover:scale-110 transition-transform">
                            <Layers className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-800 uppercase text-center px-2">
                            {p.material_quality}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                            {p.category_name}
                          </span>
                        </>
                      )}
                      <span className="absolute top-2 right-2 bg-white/95 border border-slate-200 text-slate-800 text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold shadow-2xs">
                        OE Spec
                      </span>
                    </div>

                    {/* Title & Compatibility */}
                    <div>
                      <div className="font-headline font-bold text-base text-slate-900 leading-snug group-hover:text-red-600 transition-colors flex items-center justify-between">
                        <span className="line-clamp-1">{p.title}</span>
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-red-600" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        Fits: {p.compatible_models?.join(", ")}
                      </p>
                    </div>

                    {/* Specs Box (User-friendly Box Packing) */}
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs space-y-1 font-mono">
                      {p.oe_reference && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">OEM Part #:</span>
                          <span className="font-medium text-slate-900">{p.oe_reference}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-500">Box Packing:</span>
                        <span className="font-semibold text-slate-900">{p.min_order_qty} Pcs / Box</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-500 block">
                          Published MRP
                        </span>
                        <span className="font-mono text-xl font-bold text-slate-900">
                          ₹{p.mrp.toFixed(2)}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                        Standard Box: {p.pack_multiple_qty} Pcs
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, p)}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-headline font-bold transition-all shadow-xs ${
                          isJustAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-red-600 text-white hover:bg-red-700 active:scale-95"
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>+ Add {p.min_order_qty}</span>
                          </>
                        )}
                      </button>

                      {singleItemWhatsAppUrl ? (
                        <a
                          href={singleItemWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()} // Stop navigation
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-headline font-semibold transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Enquire</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(e, p)}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 text-xs font-headline font-semibold hover:bg-slate-100 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Enquire</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
