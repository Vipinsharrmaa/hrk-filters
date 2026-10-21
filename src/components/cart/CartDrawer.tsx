"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  X,
  Plus,
  Minus,
  Trash2,
  MessageSquare,
  ArrowRight,
  ShoppingCart,
  AlertCircle,
  Package,
} from "lucide-react";

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    clearCart,
    openWhatsAppModal,
    totalItems,
    totalQuantity,
    estimatedMrpTotal,
  } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-slideLeft">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-headline font-bold text-base text-slate-900">
                  Enquiry Cart
                </h2>
                <p className="text-[11px] font-mono text-slate-500">
                  {totalItems} SKU{totalItems !== 1 ? "s" : ""} • {totalQuantity} Total Units
                </p>
              </div>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body / Items list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="font-headline font-bold text-slate-800 text-sm">
                  Your Enquiry Cart is Empty
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse the HRK Filters catalogue and add replacement filters with trade pack quantities.
                </p>
                <div className="pt-2">
                  <Link
                    href="/catalog"
                    onClick={closeDrawer}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-600 text-white text-xs font-bold font-headline hover:bg-red-700 transition-colors shadow-sm"
                  >
                    <span>Browse Products</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              items.map((item) => {
                const p = item.product;
                const minQty = p.min_order_qty || 10;
                const step = p.pack_multiple_qty || minQty;
                const lineTotal = p.mrp * item.quantity;
                const isAtMin = item.quantity <= minQty;

                return (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-2xs space-y-2.5"
                  >
                    {/* Item header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                            {p.part_number}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {p.material_quality}
                          </span>
                        </div>
                        <h4 className="font-headline font-bold text-xs text-slate-900 mt-1 line-clamp-1">
                          {p.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => removeItem(p.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Stepper & Line Total */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      {/* Stepper */}
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5">
                          <button
                            onClick={() =>
                              updateQuantity(p.id, Math.max(minQty, item.quantity - step))
                            }
                            disabled={isAtMin}
                            className={`p-1 rounded text-slate-600 hover:bg-white hover:shadow-xs transition-all ${
                              isAtMin ? "opacity-30 cursor-not-allowed" : ""
                            }`}
                            title={isAtMin ? `Minimum order is ${minQty} Pcs` : `Decrease by ${step}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-12 text-center text-xs font-mono font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(p.id, item.quantity + step)}
                            className="p-1 rounded text-slate-600 hover:bg-white hover:shadow-xs transition-all"
                            title={`Increase by ${step}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          Pcs
                        </span>
                      </div>

                      {/* Line MRP total */}
                      <div className="text-right font-mono">
                        <div className="text-xs font-bold text-slate-900">
                          ₹{lineTotal.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          @ ₹{p.mrp.toFixed(2)}/pc
                        </div>
                      </div>
                    </div>

                    {/* MOQ Notice */}
                    {isAtMin && (
                      <div className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>Box Packing: Minimum {minQty} Pcs per box</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3.5">
              {/* Commercial Summary */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Total Order Volume:</span>
                  <span className="font-bold text-slate-800">{totalQuantity} Units</span>
                </div>
                <div className="flex justify-between text-slate-900 text-sm font-bold pt-1 border-t border-slate-200">
                  <span>Published MRP Value:</span>
                  <span className="text-red-600">
                    ₹{estimatedMrpTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 leading-normal">
                *Published MRPs shown. Factory wholesale discounts, GST, and logistics will be applied on the final commercial quote.
              </p>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    closeDrawer();
                    openWhatsAppModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-headline text-xs font-bold tracking-wide shadow-md shadow-emerald-600/20 active:scale-98 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Request WhatsApp Quote</span>
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="font-headline font-semibold text-slate-700 hover:text-red-600 transition-colors flex items-center gap-1"
                  >
                    <span>Review Full Cart</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-slate-400 hover:text-red-600 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
