import { createClient } from "@supabase/supabase-js";
import { Product } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hvnmswzolmxyvjfvjfdw.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

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

    if (!data || data.length === 0) return null;

    return data.map((item: any) => ({
      id: item.id,
      part_number: item.part_number,
      slug: item.slug,
      title: item.title,
      category_id: item.category_id,
      category_name: item.category_id === "air-filter-foam" ? "Air Filter Foam" : "Air Filter Paper",
      material_quality: item.material_quality,
      oe_reference: item.oe_reference,
      mrp: Number(item.mrp),
      min_order_qty: Number(item.min_order_qty),
      pack_multiple_qty: Number(item.pack_multiple_qty),
      stock_status: item.stock_status,
      is_featured: Boolean(item.is_featured),
      is_active: Boolean(item.is_active),
      image_url: item.image_url || undefined,
      specs: item.specs || {},
    }));
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
    const { error } = await supabase.from("products").upsert({
      id: product.id,
      part_number: product.part_number,
      slug: product.slug,
      title: product.title,
      category_id: product.category_id,
      material_quality: product.material_quality,
      oe_reference: product.oe_reference,
      mrp: product.mrp,
      min_order_qty: product.min_order_qty,
      pack_multiple_qty: product.pack_multiple_qty,
      stock_status: product.stock_status,
      is_featured: product.is_featured,
      is_active: product.is_active,
      image_url: product.image_url,
      specs: product.specs,
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
 * Delete a product from Supabase by part_number or id
 */
export async function deleteProductFromSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .or(`id.eq.${id},part_number.eq.${id}`);

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
