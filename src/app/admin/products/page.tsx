"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { DataStore } from "@/lib/store";
import {
  Package,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  ExternalLink,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const refreshProducts = () => {
    setProducts(DataStore.getProducts());
  };

  useEffect(() => {
    refreshProducts();
    DataStore.syncWithSupabase();
  }, []);

  const handleToggleActive = (product: Product) => {
    DataStore.saveProduct({
      ...product,
      is_active: !product.is_active,
    });
    refreshProducts();
  };

  const handleDelete = (id: string, partNumber: string) => {
    if (confirm(`Are you sure you want to remove SKU ${partNumber}?`)) {
      DataStore.deleteProduct(id);
      refreshProducts();
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat =
      selectedCategory === "all" || p.category_id === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      p.part_number.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.material_quality.toLowerCase().includes(q) ||
      p.compatible_models?.some((m) => m.toLowerCase().includes(q));

    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            PRODUCT MANAGEMENT
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-mono mt-1">
            Maintain part numbers, wholesale MRPs, minimum order quantities, and OEM specs.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-headline text-xs font-bold tracking-wide shadow-sm active:scale-95 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New SKU</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search SKU, title, or vehicle model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-red-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {["all", "air-filter-paper", "air-filter-foam", "oil-filters", "petrol-filters"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white font-bold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat === "all" ? "All" : cat.replace(/-/g, " ")}
              </button>
            )
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[11px] text-slate-500 uppercase">
              <tr>
                <th className="py-3 px-4">Photo</th>
                <th className="py-3 px-4">Part #</th>
                <th className="py-3 px-4">Title &amp; Specification</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">OE Ref</th>
                <th className="py-3 px-4">MRP (₹)</th>
                <th className="py-3 px-4">Box Pack</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-sans text-xs">
                    No matching SKUs found. Try adjusting your search query.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.part_number}
                            className="w-full h-full object-contain p-0.5"
                          />
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">No Img</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-red-600">
                      {p.part_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-sans font-bold text-slate-900">
                        {p.title}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {p.material_quality}
                      </div>
                      {p.compatible_models && (
                        <div className="text-[10px] text-slate-400 line-clamp-1">
                          Fits: {p.compatible_models.join(", ")}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {p.category_name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {p.oe_reference || "—"}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₹{p.mrp.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {p.min_order_qty} Pcs
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                          p.is_active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                        }`}
                        title="Click to toggle catalogue visibility"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.is_active ? "bg-emerald-600" : "bg-slate-400"
                          }`}
                        />
                        {p.is_active ? "Active" : "Hidden"}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          title="View on public site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1 text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded transition-colors"
                          title="Edit product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.part_number)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete SKU"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
