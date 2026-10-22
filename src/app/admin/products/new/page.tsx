"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Category, VehicleModel } from "@/types";
import { DataStore } from "@/lib/store";
import { reduceImage, ReducedImageResult } from "@/lib/image-reducer";
import { uploadImageToSupabase } from "@/lib/supabase";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Image as ImageIcon,
  UploadCloud,
  X,
  Layers,
  Sparkles,
} from "lucide-react";

export default function AdminNewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([]);

  const [partNumber, setPartNumber] = useState("");
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("air-filter-paper");
  const [materialQuality, setMaterialQuality] = useState("Plastic Moulded");
  const [oeReference, setOeReference] = useState("");
  const [mrp, setMrp] = useState("120.00");
  const [minOrderQty, setMinOrderQty] = useState("10");
  const [packMultipleQty, setPackMultipleQty] = useState("10");
  const [stockStatus, setStockStatus] = useState<"in_stock" | "low_stock" | "made_to_order">("in_stock");
  const [compatibleModelsStr, setCompatibleModelsStr] = useState("");
  const [cartonPack, setCartonPack] = useState("10 Units / Box");
  const [imageUrl, setImageUrl] = useState("");
  const [imageStats, setImageStats] = useState<ReducedImageResult | null>(null);
  const [isReducing, setIsReducing] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDropdowns = () => {
      setCategories(DataStore.getCategories());
      setVehicleModels(DataStore.getVehicleModels());
    };
    loadDropdowns();
    DataStore.syncWithSupabase();

    const handleUpdate = () => loadDropdowns();
    window.addEventListener("hrk_store_updated", handleUpdate);
    return () => window.removeEventListener("hrk_store_updated", handleUpdate);
  }, []);

  // Handle local file upload with automated image reducer
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    try {
      setIsReducing(true);
      setError(null);
      // Automatically reduces heavy camera images down to web-optimized dimensions (~60-90KB)
      const result = await reduceImage(file, 900, 900, 0.82);
      setImageStats(result);

      // Attempt upload to Supabase Storage Bucket 'products'
      const cloudUrl = await uploadImageToSupabase(file, file.name);
      if (cloudUrl) {
        setImageUrl(cloudUrl);
      } else {
        setImageUrl(result.dataUrl);
      }
    } catch (err) {
      console.error("Image reduction failed:", err);
      setError("Could not process image. Please try a different photo.");
    } finally {
      setIsReducing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!partNumber.trim()) {
      setError("Part Number (e.g. HRK-150) is required.");
      return;
    }
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    const numMrp = parseFloat(mrp);
    if (isNaN(numMrp) || numMrp <= 0) {
      setError("Please enter a valid MRP greater than 0.");
      return;
    }

    const selectedCat = categories.find((c) => c.id === categoryId);
    const categoryName = selectedCat ? selectedCat.name : "Air Filter Paper";

    const compatibleModels = compatibleModelsStr
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    DataStore.saveProduct({
      part_number: partNumber.toUpperCase().trim(),
      title: title.trim(),
      category_id: categoryId,
      category_name: categoryName,
      material_quality: materialQuality.trim(),
      oe_reference: oeReference.trim(),
      mrp: numMrp,
      min_order_qty: parseInt(minOrderQty, 10) || 10,
      pack_multiple_qty: parseInt(packMultipleQty, 10) || 10,
      stock_status: stockStatus,
      image_url: imageUrl.trim(),
      is_active: isActive,
      is_featured: isFeatured,
      compatible_models: compatibleModels,
      specs: {
        "Box Packing": cartonPack.trim() || "10 Units / Box",
        "Material": materialQuality.trim(),
      },
    });

    router.push("/admin/products");
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-headline font-bold text-2xl text-slate-900 tracking-tight">
            ADD NEW PRODUCT SKU
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Directly register replacement product with photography to catalogue.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6"
      >
        {/* --- Product Image Section --- */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-red-600" />
            <h3 className="font-headline font-bold text-xs uppercase text-slate-900 tracking-wider">
              Product Photography &amp; Visual Asset
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
            {/* Live Preview Box */}
            <div className="sm:col-span-4 flex flex-col items-center justify-center">
              <div className="w-full h-44 rounded-xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center p-2 relative overflow-hidden group shadow-2xs">
                {isReducing ? (
                  <div className="text-center p-3 text-slate-500 space-y-1">
                    <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <span className="text-[11px] font-mono block">Optimizing photo...</span>
                  </div>
                ) : imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt="Product Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl("");
                        setImageStats(null);
                      }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-red-600 text-white shadow-sm hover:bg-red-700 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-3 text-slate-400">
                    <UploadCloud className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                    <span className="text-[11px] font-mono block">No image selected</span>
                    <span className="text-[10px] text-slate-400">Upload file or enter URL below</span>
                  </div>
                )}
              </div>

              {/* Image Reducer Optimization Stats Badge */}
              {imageStats && (
                <div className="mt-2 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[10px] font-bold">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>
                      Optimized: {imageStats.originalSizeFormatted} → {imageStats.reducedSizeFormatted} ({imageStats.compressionRatio})
                    </span>
                  </span>
                </div>
              )}
            </div>

            {/* Inputs: Upload & URL */}
            <div className="sm:col-span-8 space-y-3">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                  Upload Photo from Computer
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:font-headline file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                  Or Paste Image URL (Web link)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/images/hrk-filter.jpg"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-red-600 font-mono"
                />
              </div>

              {/* Sample Quick Preset Images */}
              <div className="pt-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                  Quick Sample Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setImageUrl(
                        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80"
                      )
                    }
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    Metal Cap Air Filter
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setImageUrl(
                        "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80"
                      )
                    }
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    Moulded Plastic Filter
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setImageUrl(
                        "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80"
                      )
                    }
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    BS6 Engine Oil Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Product General Details --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Part Number */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
              Part Number (SKU) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              placeholder="e.g. HRK-150"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-red-600 font-mono uppercase font-bold"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Honda Shine 125 Air Filter"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-red-600 bg-white"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Material Quality */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
              Material / Construction Spec
            </label>
            <input
              type="text"
              value={materialQuality}
              onChange={(e) => setMaterialQuality(e.target.value)}
              placeholder="e.g. Plastic Moulded, Metal Cap, Foam"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-red-600"
            />
          </div>

          {/* OE Reference */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
              OEM Part Number Cross-Reference
            </label>
            <input
              type="text"
              value={oeReference}
              onChange={(e) => setOeReference(e.target.value)}
              placeholder="e.g. 17211-KTE-910"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-red-600 font-mono"
            />
          </div>

          {/* MRP */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
              Published Trade MRP (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              placeholder="120.00"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-red-600 font-mono font-bold"
            />
          </div>

          {/* Box Packing */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
              Box Packing Minimum (Pcs) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              required
              value={minOrderQty}
              onChange={(e) => setMinOrderQty(e.target.value)}
              placeholder="10"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-red-600 font-mono"
            />
          </div>

          {/* Pack Multiple */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
              Standard Box Multiple (Pcs)
            </label>
            <input
              type="number"
              min="1"
              value={packMultipleQty}
              onChange={(e) => setPackMultipleQty(e.target.value)}
              placeholder="10"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-red-600 font-mono"
            />
          </div>

          {/* Stock Status */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
              Stock Status
            </label>
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value as any)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-red-600 bg-white"
            >
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="made_to_order">Made to Order</option>
            </select>
          </div>

          {/* Box Packing Description */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
              Box Packaging Specification
            </label>
            <input
              type="text"
              value={cartonPack}
              onChange={(e) => setCartonPack(e.target.value)}
              placeholder="e.g. 10 Units / Box"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        {/* Compatible Models */}
        <div>
          <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
            Compatible Two-Wheeler Models (comma separated)
          </label>
          <input
            type="text"
            value={compatibleModelsStr}
            onChange={(e) => setCompatibleModelsStr(e.target.value)}
            placeholder="e.g. Honda Shine 125, Honda CBF Stunner 125"
            className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-red-600"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[11px] font-mono text-slate-400">Quick add:</span>
            {vehicleModels.slice(0, 6).map((vm) => (
              <button
                key={vm.id}
                type="button"
                onClick={() => {
                  const current = compatibleModelsStr ? compatibleModelsStr.split(",").map((s) => s.trim()) : [];
                  if (!current.includes(vm.name)) {
                    current.push(vm.name);
                    setCompatibleModelsStr(current.join(", "));
                  }
                }}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              >
                +{vm.name}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
            />
            <span>Active in Public Catalogue</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
            />
            <span>Feature on Homepage</span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-headline text-xs font-bold tracking-wide shadow-sm active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save &amp; Publish SKU</span>
          </button>
        </div>
      </form>
    </div>
  );
}
