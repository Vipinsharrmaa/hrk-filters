"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product, Category, VehicleModel } from "@/types";
import { DataStore } from "@/lib/store";
import {
  Package,
  PlusCircle,
  FolderTree,
  Bike,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit,
  ArrowRight,
} from "lucide-react";

export default function AdminOverviewPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);

  useEffect(() => {
    setProducts(DataStore.getProducts());
    setCategories(DataStore.getCategories());
    setModels(DataStore.getVehicleModels());
  }, []);

  const activeProducts = products.filter((p) => p.is_active);
  const inStockCount = products.filter((p) => p.stock_status === "in_stock").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            OPERATIONS DESK OVERVIEW
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-mono mt-1">
            Dynamic catalogue, pricing, and vehicle compatibility control.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-headline text-xs font-bold tracking-wide shadow-sm active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New SKU</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-headline text-xs font-bold uppercase tracking-wider">
              Total SKUs
            </span>
            <Package className="w-4 h-4 text-red-600" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-slate-900">
            {products.length}
          </div>
          <div className="text-[11px] text-emerald-700 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{activeProducts.length} active in public catalogue</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-headline text-xs font-bold uppercase tracking-wider">
              Categories
            </span>
            <FolderTree className="w-4 h-4 text-slate-700" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-slate-900">
            {categories.length}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Air Paper, Foam, Oil, Petrol
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-headline text-xs font-bold uppercase tracking-wider">
              Vehicle Models
            </span>
            <Bike className="w-4 h-4 text-slate-700" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-slate-900">
            {models.length}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Across 7 2-wheeler OEMs
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-headline text-xs font-bold uppercase tracking-wider">
              Inventory State
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-slate-900">
            {inStockCount}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            SKUs ready for immediate dispatch
          </div>
        </div>
      </div>

      {/* Operational Protocol Notice */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-bold uppercase">
              Phase 1 Direct RFQ Flow
            </span>
            <h3 className="font-headline font-bold text-sm text-slate-900">
              WhatsApp Wholesale Enquiry Integration
            </h3>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl">
            Customer enquiries are directly routed into pre-formatted WhatsApp quotation messages to the factory desk (+91 98100 00000). No database enquiry logging or payment gateway is active in Phase 1.
          </p>
        </div>
        <Link
          href="/catalog"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-headline text-xs font-bold transition-colors flex-shrink-0"
        >
          <span>View Public Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Recent SKUs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="font-headline font-bold text-sm text-slate-900 uppercase tracking-wide">
            Authoritative Product Catalogue
          </h2>
          <Link
            href="/admin/products"
            className="text-xs font-headline font-semibold text-red-600 hover:underline flex items-center gap-1"
          >
            <span>Manage All SKUs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-200 font-mono text-[11px] text-slate-500 uppercase">
              <tr>
                <th className="py-3 px-4">Photo</th>
                <th className="py-3 px-4">SKU / Part #</th>
                <th className="py-3 px-4">Title &amp; Construction</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">OE Reference</th>
                <th className="py-3 px-4">MRP (₹)</th>
                <th className="py-3 px-4">Box Pack</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {products.slice(0, 7).map((p) => (
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
                    <div className="font-sans font-bold text-slate-900 line-clamp-1">
                      {p.title}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {p.material_quality}
                    </div>
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
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.is_active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          p.is_active ? "bg-emerald-600" : "bg-slate-400"
                        }`}
                      />
                      {p.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
