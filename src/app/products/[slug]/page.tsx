"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Product } from "@/types";
import { DataStore } from "@/lib/store";
import { siteConfig } from "@/lib/config";
import { useCart } from "@/context/CartContext";
import { validateQuantity } from "@/lib/cart-rules";
import {
  ShoppingCart,
  MessageSquare,
  Layers,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Plus,
  Minus,
  Truck,
  Check,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { addItem, openDrawer } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(10);
  const [qtyError, setQtyError] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const findProduct = () => {
      const found = DataStore.getProductBySlug(slug);
      if (found) {
        setProduct(found);
        setQuantity(found.min_order_qty || 10);
        setLoading(false);
        return true;
      }
      return false;
    };

    if (findProduct()) return;

    // If not in local cache yet, fetch from Supabase Cloud
    DataStore.syncWithSupabase().then(() => {
      if (!findProduct()) {
        setLoading(false);
      }
    });

    const handleUpdate = () => findProduct();
    window.addEventListener("hrk_store_updated", handleUpdate);
    return () => window.removeEventListener("hrk_store_updated", handleUpdate);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-headline font-bold text-2xl text-slate-900">
          Product Not Found
        </h1>
        <p className="text-sm text-slate-600">
          The requested SKU does not exist or has been discontinued.
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 text-white font-headline text-xs font-bold hover:bg-red-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Products</span>
        </Link>
      </div>
    );
  }

  const minQty = product.min_order_qty || 10;
  const packMultiple = product.pack_multiple_qty || minQty;

  const handleDecrease = () => {
    const newQty = Math.max(minQty, quantity - packMultiple);
    setQuantity(newQty);
    setQtyError(null);
  };

  const handleIncrease = () => {
    const newQty = quantity + packMultiple;
    setQuantity(newQty);
    setQtyError(null);
  };

  const handleQuantityChange = (valStr: string) => {
    const parsed = parseInt(valStr, 10);
    if (isNaN(parsed)) {
      setQuantity(minQty);
      return;
    }
    const val = validateQuantity(parsed, product);
    setQuantity(parsed);
    if (!val.valid && val.message) {
      setQtyError(val.message);
    } else {
      setQtyError(null);
    }
  };

  const handleAddToCart = () => {
    const val = validateQuantity(quantity, product);
    if (!val.valid && val.message) {
      setQtyError(val.message);
      setQuantity(val.normalizedQty);
      return;
    }
    addItem(product, val.normalizedQty);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const singleItemWhatsAppUrl = siteConfig.whatsappNumber
    ? `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
        `Hi HRK Filters,\nI would like to enquire about:\n• SKU: ${product.part_number}\n• Title: ${product.title}\n• Material: ${product.material_quality}\n• Requested Qty: ${quantity} Pcs\n• Published MRP: ₹${product.mrp.toFixed(2)}/pc\nPlease share wholesale pricing and availability.`
      )}`
    : undefined;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Link href="/" className="hover:text-red-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-red-600 transition-colors">
            Products
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">{product.part_number}</span>
        </div>

        {/* Main Product Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Visual Showcase */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="w-full h-80 sm:h-96 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center p-6 relative overflow-hidden group">
                {product.image_url ? (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="max-h-64 max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                    />
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mb-4 shadow-inner">
                      <Layers className="w-12 h-12" />
                    </div>
                    <span className="font-headline font-bold text-xl text-slate-900 text-center tracking-tight">
                      {product.material_quality}
                    </span>
                    <span className="text-xs font-mono text-slate-500 mt-1 uppercase tracking-widest">
                      {product.category_name}
                    </span>
                  </>
                )}

                <div className="absolute top-4 left-4 bg-red-600 text-white font-mono text-xs font-bold px-2.5 py-1 rounded shadow-sm">
                  {product.part_number}
                </div>
                <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[11px] font-bold px-2.5 py-1 rounded">
                  OE Grade Replacement
                </div>
              </div>

              {/* Manufacturing Assurance Badges */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono text-slate-600">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Quality Tested</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>Direct Factory Dispatch</span>
                </div>
              </div>
            </div>

            {/* Right Column: Information, Pricing & Order Controls */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 font-mono text-xs font-bold">
                    SKU: {product.part_number}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-xs font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    IN STOCK
                  </span>
                </div>

                <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 leading-tight">
                  {product.title}
                </h1>

                {product.oe_reference && (
                  <p className="font-mono text-xs text-slate-500">
                    OEM Part Number:{" "}
                    <span className="text-slate-800 font-semibold">
                      {product.oe_reference}
                    </span>
                  </p>
                )}

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
                      Published MRP
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-mono text-3xl font-extrabold text-slate-900">
                        ₹{product.mrp.toFixed(2)}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        / Per Piece
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-slate-800 block">
                      Box Packing: {product.min_order_qty} Pcs / Box
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Standard Box: {product.pack_multiple_qty} Pcs
                    </span>
                  </div>
                </div>

                {/* Quantity Stepper & Add to Cart */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold text-slate-700 font-mono uppercase">
                    Order Quantity (Box Packing: Minimum {minQty} Pcs):
                  </label>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="inline-flex items-center border-2 border-slate-200 rounded-xl bg-white p-1">
                      <button
                        type="button"
                        onClick={handleDecrease}
                        disabled={quantity <= minQty}
                        className={`p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors ${
                          quantity <= minQty ? "opacity-30 cursor-not-allowed" : ""
                        }`}
                        title={`Decrease by ${packMultiple}`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min={minQty}
                        step={packMultiple}
                        value={quantity}
                        onChange={(e) => handleQuantityChange(e.target.value)}
                        className="w-20 text-center font-mono font-bold text-base text-slate-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleIncrease}
                        className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                        title={`Increase by ${packMultiple}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-headline text-sm font-bold tracking-wide shadow-md transition-all active:scale-95 ${
                        isAdded
                          ? "bg-emerald-600 text-white shadow-emerald-600/20"
                          : "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add {quantity} Pcs to Enquiry Cart</span>
                        </>
                      )}
                    </button>
                  </div>

                  {qtyError && (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 font-mono">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{qtyError}</span>
                    </div>
                  )}

                  {singleItemWhatsAppUrl && (
                    <a
                      href={singleItemWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl border-2 border-emerald-500 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-headline text-xs font-bold transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span>WhatsApp Order Enquiry for this SKU</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Technical Specifications Table */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <h3 className="font-headline font-bold text-sm text-slate-900 uppercase tracking-wide">
                  Product Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                    <span className="text-slate-500">Material Spec:</span>
                    <span className="font-bold text-slate-900">
                      {product.material_quality}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                    <span className="text-slate-500">Category:</span>
                    <span className="font-bold text-slate-900">
                      {product.category_name}
                    </span>
                  </div>
                  {product.oe_reference && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                      <span className="text-slate-500">OEM Part Number:</span>
                      <span className="font-bold text-slate-900">
                        {product.oe_reference}
                      </span>
                    </div>
                  )}
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                    <span className="text-slate-500">Box Packing:</span>
                    <span className="font-bold text-slate-900">
                      {product.specs?.["Box Packing"] || product.specs?.["Carton Pack"] || "10 Units / Box"}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                    <span className="text-slate-500">Origin:</span>
                    <span className="font-bold text-slate-900">Made in India</span>
                  </div>
                </div>

                {/* Compatibility */}
                {product.compatible_models && product.compatible_models.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block mb-2">
                      Compatible Two-Wheelers:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.compatible_models.map((model) => (
                        <span
                          key={model}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono font-medium"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{model}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
