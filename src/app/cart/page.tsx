"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Package,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

export default function CartReviewPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    openWhatsAppModal,
    totalItems,
    totalQuantity,
    estimatedMrpTotal,
  } = useCart();

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb & Heading */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-2">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Enquiry Cart</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                B2B ENQUIRY CART
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                Review your requested replacement filters and quantities before launching the WhatsApp RFQ.
              </p>
            </div>

            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-headline font-semibold text-slate-500 hover:text-red-600 transition-colors self-start sm:self-auto"
              >
                Clear All Items
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4 my-10 shadow-xs">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="font-headline font-bold text-xl text-slate-900">
              Your Enquiry Cart is Empty
            </h2>
            <p className="text-sm text-slate-600">
              No products have been added yet. Explore the factory catalogue to add filters with wholesale pack sizes.
            </p>
            <div className="pt-2">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-headline text-xs font-bold tracking-wide shadow-md shadow-red-600/20 transition-all"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items Table */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="font-headline font-bold text-xs uppercase text-slate-700 tracking-wider">
                  Requested Items ({totalItems} SKUs)
                </span>
                <span className="font-mono text-xs text-slate-500 font-semibold">
                  Total Units: {totalQuantity} Pcs
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {items.map((item) => {
                  const p = item.product;
                  const minQty = p.min_order_qty || 10;
                  const step = p.pack_multiple_qty || minQty;
                  const lineTotal = p.mrp * item.quantity;
                  const isAtMin = item.quantity <= minQty;

                  return (
                    <div
                      key={p.id}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Product Details */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                            {p.part_number}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            {p.material_quality}
                          </span>
                        </div>
                        <Link
                          href={`/products/${p.slug}`}
                          className="font-headline font-bold text-base text-slate-900 hover:text-red-600 transition-colors block"
                        >
                          {p.title}
                        </Link>
                        {p.compatible_models && p.compatible_models.length > 0 && (
                          <p className="text-xs text-slate-500 line-clamp-1">
                            Fits: {p.compatible_models.join(", ")}
                          </p>
                        )}
                        {p.oe_reference && (
                          <p className="text-[11px] font-mono text-slate-400">
                            OE Ref: {p.oe_reference}
                          </p>
                        )}
                      </div>

                      {/* Quantity Stepper & Price */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {/* Stepper */}
                        <div className="flex flex-col items-center">
                          <div className="inline-flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                            <button
                              onClick={() =>
                                updateQuantity(p.id, Math.max(minQty, item.quantity - step))
                              }
                              disabled={isAtMin}
                              className={`p-1.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-xs transition-all ${
                                isAtMin ? "opacity-30 cursor-not-allowed" : ""
                              }`}
                              title={isAtMin ? `Minimum is ${minQty} Pcs` : `Decrease by ${step}`}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-14 text-center text-xs font-mono font-bold text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(p.id, item.quantity + step)}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-xs transition-all"
                              title={`Increase by ${step}`}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 mt-1">
                            Box Pack: {minQty} Pcs
                          </span>
                        </div>

                        {/* Line MRP total */}
                        <div className="text-right font-mono min-w-[90px]">
                          <div className="text-sm font-bold text-slate-900">
                            ₹{lineTotal.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            @ ₹{p.mrp.toFixed(2)}/pc
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => removeItem(p.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove SKU from cart"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Table Bottom Navigation */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-1.5 text-xs font-headline font-semibold text-slate-700 hover:text-red-600 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continue Browsing Catalogue</span>
                </Link>
              </div>
            </div>

            {/* Sidebar Summary Card */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
              <h2 className="font-headline font-bold text-base text-slate-900 uppercase tracking-tight pb-3 border-b border-slate-100">
                Commercial Summary
              </h2>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Selected Filter SKUs:</span>
                  <span className="font-bold text-slate-900">{totalItems}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Wholesale Volume:</span>
                  <span className="font-bold text-slate-900">{totalQuantity} Units</span>
                </div>
                <div className="flex justify-between text-slate-900 text-base font-bold pt-3 border-t border-slate-200">
                  <span>Published MRP Value:</span>
                  <span className="text-red-600">
                    ₹{estimatedMrpTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Commercial Terms Notice */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Factory Direct Pricing Notice</span>
                </div>
                <p>
                  Prices listed above reflect published standard trade MRPs. Trade discounts, GST, and delivery logistics will be calculated and finalized directly on your official factory quotation.
                </p>
              </div>

              {/* Launch WhatsApp RFQ */}
              <button
                type="button"
                onClick={openWhatsAppModal}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-headline text-xs font-bold tracking-wide shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Request WhatsApp Quotation</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
