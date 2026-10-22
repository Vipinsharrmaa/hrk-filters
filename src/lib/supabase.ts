import { createClient } from "@supabase/supabase-js";
import { Category, Product, VehicleModel } from "@/types";

const SUPABASE_FALLBACK_URL = "https://hvnmswzolmxyvjfvjfdw.supabase.co";
const SUPABASE_FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bm1zd3pvbG14eXZqZnZqZmR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1OTAwNzUsImV4cCI6MjEwODE2NjA3NX0.Iedso5IEV8G8Vx1kTpJMaQcV2Oz8TZEqM-TPDtYynck";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_FALLBACK_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_FALLBACK_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload an image file (or base64 converted blob) to Supabase Storage bucket 'products'
 * Returns the permanent public CDN URL of the uploaded image.
 */
export async function uploadImageToSupabase(
  file: File | Blob,
  fileName: string
): Promise<string | null> {
  if (!supabase) return null;

  try {
    const cleanFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = `product-images/${cleanFileName}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.warn("Supabase storage upload error:", error.message);
      return null;
    }

    const { data } = supabase.storage.from("products").getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.error("Failed to upload image to Supabase:", err);
    return null;
  }
}

/**
 * Fetch products from the Supabase 'products' table.
 */
export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        part_number,
        slug,
        title,
        category_id,
        material_quality,
        oe_reference,
        mrp,
        min_order_qty,
        pack_multiple_qty,
        stock_status,
        is_featured,
        is_active,
        image_url,
        specs
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetch products error:", error.message);
      return null;
    }

    if (!data) return [];

    return data.map((item: any) => {
      const specs = item.specs || {};
      const fallbackCatName =
        item.category_id === "air-filter-foam"
          ? "Air Filter Foam"
          : item.category_id === "oil-filters"
          ? "Oil Filters"
          : item.category_id === "petrol-filters"
          ? "Petrol / Fuel Filters"
          : "Air Filter Paper";

      return {
        id: item.id,
        part_number: item.part_number,
        slug: item.slug,
        title: item.title,
        category_id: item.category_id,
        category_name: specs.category_name || fallbackCatName,
        material_quality: item.material_quality || "",
        oe_reference: item.oe_reference || "",
        mrp: Number(item.mrp) || 0,
        min_order_qty: Number(item.min_order_qty) || 10,
        pack_multiple_qty: Number(item.pack_multiple_qty) || 10,
        stock_status: item.stock_status || "in_stock",
        is_featured: Boolean(item.is_featured),
        is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
        image_url: item.image_url || undefined,
        compatible_models: Array.isArray(specs.compatible_models) ? specs.compatible_models : [],
        specs: specs,
      };
    });
  } catch (err) {
    console.error("Error connecting to Supabase products table:", err);
    return null;
  }
}

/**
 * Save / Update a product directly in Supabase
 */
export async function saveProductToSupabase(product: Product): Promise<boolean> {
  if (!supabase) return false;

  try {
    const specsPayload = {
      ...(product.specs || {}),
      category_name: product.category_name,
      compatible_models: product.compatible_models || [],
    };

    const { error } = await supabase.from("products").upsert({
      id: product.id,
      part_number: product.part_number,
      slug: product.slug,
      title: product.title,
      category_id: product.category_id,
      material_quality: product.material_quality,
      oe_reference: product.oe_reference || "",
      mrp: product.mrp,
      min_order_qty: product.min_order_qty,
      pack_multiple_qty: product.pack_multiple_qty,
      stock_status: product.stock_status,
      is_featured: product.is_featured,
      is_active: product.is_active,
      image_url: product.image_url,
      specs: specsPayload,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn("Failed to upsert product in Supabase:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase upsert error:", err);
    return false;
  }
}

/**
 * Delete a product from Supabase by part_number, id, or slug
 */
export async function deleteProductFromSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    const upper = id.toUpperCase();
    const lower = id.toLowerCase();
    const { error } = await supabase
      .from("products")
      .delete()
      .or(`id.eq.${id},part_number.eq.${id},part_number.eq.${upper},slug.eq.${lower}`);

    if (error) {
      console.warn("Failed to delete product from Supabase:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase delete error:", err);
    return false;
  }
}

/**
 * Fetch categories from Supabase 'categories' table
 */
export async function fetchCategoriesFromSupabase(): Promise<Category[] | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, slug, name, description, display_order, is_active")
      .order("display_order", { ascending: true });

    if (error) {
      console.warn("Supabase fetch categories error:", error.message);
      return null;
    }

    if (!data) return [];

    return data.map((item: any) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      description: item.description || "",
      display_order: Number(item.display_order) || 1,
      is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
    }));
  } catch (err) {
    console.error("Error fetching categories from Supabase:", err);
    return null;
  }
}

/**
 * Save / Update category directly in Supabase
 */
export async function saveCategoryToSupabase(category: Category): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from("categories").upsert({
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description || "",
      display_order: category.display_order || 1,
      is_active: category.is_active !== undefined ? category.is_active : true,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn("Failed to upsert category in Supabase:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase category upsert error:", err);
    return false;
  }
}

/**
 * Delete category from Supabase by id or slug
 */
export async function deleteCategoryFromSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from("categories")
      .delete()
      .or(`id.eq.${id},slug.eq.${id}`);

    if (error) {
      console.warn("Failed to delete category from Supabase:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase category delete error:", err);
    return false;
  }
}

/**
 * Fetch vehicle models from Supabase 'vehicle_models' table
 */
export async function fetchVehicleModelsFromSupabase(): Promise<VehicleModel[] | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("vehicle_models")
      .select("id, manufacturer_id, name, vehicle_type, engine_displacement, is_active")
      .order("name", { ascending: true });

    if (error) {
      console.warn("Supabase fetch vehicle models error:", error.message);
      return null;
    }

    if (!data) return [];

    return data.map((item: any) => ({
      id: item.id,
      manufacturer_id: item.manufacturer_id,
      manufacturer_name: item.manufacturer_id?.replace("mfg-", "").toUpperCase() || "",
      name: item.name,
      vehicle_type: item.vehicle_type || "Motorcycle",
      engine_displacement: item.engine_displacement || "",
      is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
    }));
  } catch (err) {
    console.error("Error fetching vehicle models from Supabase:", err);
    return null;
  }
}

/**
 * Save / Update vehicle model directly in Supabase
 */
export async function saveVehicleModelToSupabase(model: VehicleModel): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from("vehicle_models").upsert({
      id: model.id,
      manufacturer_id: model.manufacturer_id,
      name: model.name,
      vehicle_type: model.vehicle_type,
      engine_displacement: model.engine_displacement || "",
      is_active: model.is_active !== undefined ? model.is_active : true,
    });

    if (error) {
      console.warn("Failed to upsert vehicle model in Supabase:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase vehicle model upsert error:", err);
    return false;
  }
}

/**
 * Delete vehicle model from Supabase by id
 */
export async function deleteVehicleModelFromSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from("vehicle_models").delete().eq("id", id);
    if (error) {
      console.warn("Failed to delete vehicle model from Supabase:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase vehicle model delete error:", err);
    return false;
  }
}
