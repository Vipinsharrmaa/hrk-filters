"use client";

import { Category, CustomerProfile, Manufacturer, Product, VehicleModel } from "@/types";
import {
  saveProductToSupabase,
  deleteProductFromSupabase,
  fetchProductsFromSupabase,
  fetchCategoriesFromSupabase,
  saveCategoryToSupabase,
  deleteCategoryFromSupabase,
  fetchVehicleModelsFromSupabase,
  saveVehicleModelToSupabase,
  deleteVehicleModelFromSupabase,
} from "./supabase";

export const initialCategories: Category[] = [
  {
    id: "air-filter-paper",
    name: "Air Filter Paper",
    slug: "air-filter-paper",
    description: "Heavy-duty pleated paper elements with plastic moulded or stamped metal caps.",
    display_order: 1,
    is_active: true,
  },
  {
    id: "air-filter-foam",
    name: "Air Filter Foam",
    slug: "air-filter-foam",
    description: "High-density polyurethane flame-laminated dual-stage foam filters.",
    display_order: 2,
    is_active: true,
  },
  {
    id: "oil-filters",
    name: "Oil Filters",
    slug: "oil-filters",
    description: "Micron-rated resin-cured paper and metal end-cap engine oil filters.",
    display_order: 3,
    is_active: true,
  },
  {
    id: "petrol-filters",
    name: "Petrol / Fuel Filters",
    slug: "petrol-filters",
    description: "Inline high-flow sediment and water-trap fuel filtration units.",
    display_order: 4,
    is_active: true,
  },
];

export const initialManufacturers: Manufacturer[] = [
  { id: "mfg-hero", name: "Hero MotoCorp", slug: "hero-motocorp", display_order: 1, is_active: true },
  { id: "mfg-honda", name: "Honda Motorcycles & Scooters", slug: "honda", display_order: 2, is_active: true },
  { id: "mfg-bajaj", name: "Bajaj Auto", slug: "bajaj", display_order: 3, is_active: true },
  { id: "mfg-tvs", name: "TVS Motor Company", slug: "tvs", display_order: 4, is_active: true },
  { id: "mfg-yamaha", name: "Yamaha India", slug: "yamaha", display_order: 5, is_active: true },
  { id: "mfg-suzuki", name: "Suzuki Two-Wheelers", slug: "suzuki", display_order: 6, is_active: true },
  { id: "mfg-re", name: "Royal Enfield", slug: "royal-enfield", display_order: 7, is_active: true },
];

export const initialVehicleModels: VehicleModel[] = [
  { id: "vm-hero-super-splendor", manufacturer_id: "mfg-hero", manufacturer_name: "Hero MotoCorp", name: "Super Splendor", vehicle_type: "Motorcycle", engine_displacement: "125cc", is_active: true },
  { id: "vm-hero-passion-pro", manufacturer_id: "mfg-hero", manufacturer_name: "Hero MotoCorp", name: "Passion Pro", vehicle_type: "Motorcycle", engine_displacement: "110cc", is_active: true },
  { id: "vm-hero-splendor-bs6", manufacturer_id: "mfg-hero", manufacturer_name: "Hero MotoCorp", name: "Splendor BS6", vehicle_type: "Motorcycle", engine_displacement: "97.2cc", is_active: true },
  { id: "vm-hero-glamour-bs6", manufacturer_id: "mfg-hero", manufacturer_name: "Hero MotoCorp", name: "Glamour BS6", vehicle_type: "Motorcycle", engine_displacement: "125cc", is_active: true },
  { id: "vm-hero-maestro", manufacturer_id: "mfg-hero", manufacturer_name: "Hero MotoCorp", name: "Maestro Edge", vehicle_type: "Scooter", engine_displacement: "110cc", is_active: true },
  { id: "vm-honda-activa-3g", manufacturer_id: "mfg-honda", manufacturer_name: "Honda", name: "Activa 3G / 4G / 5G", vehicle_type: "Scooter", engine_displacement: "110cc", is_active: true },
  { id: "vm-honda-activa-new", manufacturer_id: "mfg-honda", manufacturer_name: "Honda", name: "Activa New / 6G", vehicle_type: "Scooter", engine_displacement: "110cc", is_active: true },
  { id: "vm-bajaj-pulsar-rs200", manufacturer_id: "mfg-bajaj", manufacturer_name: "Bajaj Auto", name: "Pulsar RS200", vehicle_type: "Motorcycle", engine_displacement: "200cc", is_active: true },
  { id: "vm-bajaj-dominar-400", manufacturer_id: "mfg-bajaj", manufacturer_name: "Bajaj Auto", name: "Dominar 400", vehicle_type: "Motorcycle", engine_displacement: "373cc", is_active: true },
  { id: "vm-tvs-jupiter", manufacturer_id: "mfg-tvs", manufacturer_name: "TVS Motor Company", name: "Jupiter 110", vehicle_type: "Scooter", engine_displacement: "110cc", is_active: true },
  { id: "vm-yamaha-rx100", manufacturer_id: "mfg-yamaha", manufacturer_name: "Yamaha India", name: "RX-100", vehicle_type: "Motorcycle", engine_displacement: "98cc", is_active: true },
];

export const fullCatalogSeed: Product[] = [
  {
    id: "hrk-1792603531814",
    part_number: "HRK-150",
    slug: "hrk-150-honda-activa-5g",
    title: "Honda Activa 5G",
    category_id: "air-filter-paper",
    category_name: "Air Filter Paper",
    material_quality: "Plastic Moulded",
    oe_reference: "278329928282",
    mrp: 120.0,
    min_order_qty: 10,
    pack_multiple_qty: 10,
    stock_status: "in_stock",
    is_featured: true,
    is_active: true,
    image_url: "https://hvnmswzolmxyvjfvjfdw.supabase.co/storage/v1/object/public/products/product-images/1792603470367-1.webp",
    compatible_models: ["Honda Activa 5G"],
    specs: {
      "Material": "Plastic Moulded",
      "Box Packing": "10 Units / Box",
    },
  },
];

const STORAGE_KEYS = {
  PRODUCTS: "hrk_store_products_v1",
  CATEGORIES: "hrk_store_categories_v1",
  MODELS: "hrk_store_models_v1",
  PROFILE: "hrk_store_customer_profile_v1",
  SAVED_CART: "hrk_store_saved_cart_v1",
};

function notifyStoreUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("hrk_store_updated"));
  }
}

export const DataStore = {
  getProducts(): Product[] {
    if (typeof window === "undefined") return fullCatalogSeed;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored !== null) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(fullCatalogSeed));
      return fullCatalogSeed;
    } catch {
      return fullCatalogSeed;
    }
  },

  getProductBySlug(slug: string): Product | undefined {
    const products = this.getProducts();
    const clean = slug.toLowerCase();
    return products.find(
      (p) => p.slug.toLowerCase() === clean || p.part_number.toLowerCase() === clean
    );
  },

  getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.id === id || p.part_number.toLowerCase() === id.toLowerCase());
  },

  saveProduct(productData: Partial<Product> & { part_number: string; title: string }): Product {
    const products = this.getProducts();
    const cleanPartNumber = productData.part_number.toUpperCase().trim();
    const existingIndex = products.findIndex(
      (p) => p.id === productData.id || p.part_number.toUpperCase() === cleanPartNumber
    );

    const now = new Date().toISOString();
    const baseSlug =
      productData.slug ||
      `${cleanPartNumber.toLowerCase()}-${productData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}`;

    let result: Product;

    if (existingIndex >= 0) {
      const updated: Product = {
        ...products[existingIndex],
        ...productData,
        part_number: cleanPartNumber,
        slug: baseSlug,
        image_url: productData.image_url !== undefined ? productData.image_url : products[existingIndex].image_url,
        updated_at: now,
      };
      products[existingIndex] = updated;
      result = updated;
    } else {
      const newProduct: Product = {
        id: productData.id || `hrk-${Date.now()}`,
        part_number: cleanPartNumber,
        slug: baseSlug,
        title: productData.title.trim(),
        category_id: productData.category_id || "air-filter-paper",
        category_name: productData.category_name || "Air Filter Paper",
        material_quality: productData.material_quality || "Plastic Moulded",
        oe_reference: productData.oe_reference || "",
        mrp: Number(productData.mrp) || 0,
        min_order_qty: Math.max(1, Number(productData.min_order_qty) || 10),
        pack_multiple_qty: Math.max(1, Number(productData.pack_multiple_qty) || 10),
        stock_status: productData.stock_status || "in_stock",
        is_featured: !!productData.is_featured,
        is_active: productData.is_active !== undefined ? productData.is_active : true,
        image_url: productData.image_url || "",
        compatible_models: productData.compatible_models || [],
        specs: productData.specs || { "Box Packing": "10 Units / Box" },
        created_at: now,
        updated_at: now,
      };
      products.unshift(newProduct);
      result = newProduct;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      notifyStoreUpdate();
      // Background sync to Supabase Cloud
      saveProductToSupabase(result).catch((err) => {
        console.warn("Background Supabase save skipped:", err);
      });
    }
    return result;
  },

  deleteProduct(idOrPartNumber: string): void {
    const current = this.getProducts();
    const clean = idOrPartNumber.trim();
    const cleanLower = clean.toLowerCase();
    const filtered = current.filter(
      (p) => p.id.toLowerCase() !== cleanLower && p.part_number.toLowerCase() !== cleanLower
    );

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
      notifyStoreUpdate();
      // Background delete from Supabase Cloud
      deleteProductFromSupabase(clean).catch((err) => {
        console.warn("Background Supabase delete skipped:", err);
      });
    }
  },

  async syncWithSupabase(): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      // 1. Sync Products
      const remoteProducts = await fetchProductsFromSupabase();
      if (remoteProducts !== null) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(remoteProducts));
      }

      // 2. Sync Categories
      const remoteCategories = await fetchCategoriesFromSupabase();
      if (remoteCategories !== null && remoteCategories.length > 0) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(remoteCategories));
      }

      // 3. Sync Vehicle Models
      const remoteModels = await fetchVehicleModelsFromSupabase();
      if (remoteModels !== null && remoteModels.length > 0) {
        localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(remoteModels));
      }

      notifyStoreUpdate();
    } catch (err) {
      console.warn("Supabase background sync skipped:", err);
    }
  },

  getCategories(): Category[] {
    if (typeof window === "undefined") return initialCategories;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored !== null) return JSON.parse(stored);
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
      return initialCategories;
    } catch {
      return initialCategories;
    }
  },

  saveCategory(categoryData: Partial<Category> & { name: string }): Category {
    const categories = this.getCategories();
    const slug =
      categoryData.slug ||
      categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const existingIndex = categories.findIndex(
      (c) => c.id === categoryData.id || c.slug === slug
    );

    let result: Category;

    if (existingIndex >= 0) {
      const updated: Category = {
        ...categories[existingIndex],
        ...categoryData,
        slug,
      };
      categories[existingIndex] = updated;
      result = updated;
    } else {
      const newCategory: Category = {
        id: categoryData.id || `cat-${Date.now()}`,
        name: categoryData.name,
        slug,
        description: categoryData.description || "",
        display_order: categoryData.display_order || categories.length + 1,
        is_active: categoryData.is_active !== undefined ? categoryData.is_active : true,
      };
      categories.push(newCategory);
      result = newCategory;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      notifyStoreUpdate();
      // Background sync to Supabase Cloud
      saveCategoryToSupabase(result).catch((err) => {
        console.warn("Background Supabase category save skipped:", err);
      });
    }
    return result;
  },

  deleteCategory(idOrSlug: string): void {
    const clean = idOrSlug.trim();
    const cleanLower = clean.toLowerCase();
    const categories = this.getCategories().filter(
      (c) => c.id.toLowerCase() !== cleanLower && c.slug.toLowerCase() !== cleanLower
    );
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      notifyStoreUpdate();
      // Background delete from Supabase Cloud
      deleteCategoryFromSupabase(clean).catch((err) => {
        console.warn("Background Supabase category delete skipped:", err);
      });
    }
  },

  getVehicleModels(): VehicleModel[] {
    if (typeof window === "undefined") return initialVehicleModels;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MODELS);
      if (stored !== null) return JSON.parse(stored);
      localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(initialVehicleModels));
      return initialVehicleModels;
    } catch {
      return initialVehicleModels;
    }
  },

  saveVehicleModel(
    modelData: Partial<VehicleModel> & { name: string; manufacturer_id: string }
  ): VehicleModel {
    const models = this.getVehicleModels();
    const existingIndex = models.findIndex((m) => m.id === modelData.id);

    const mfg = initialManufacturers.find((m) => m.id === modelData.manufacturer_id);
    const mfgName = mfg ? mfg.name : modelData.manufacturer_name || "";

    let result: VehicleModel;

    if (existingIndex >= 0) {
      const updated: VehicleModel = {
        ...models[existingIndex],
        ...modelData,
        manufacturer_name: mfgName,
      };
      models[existingIndex] = updated;
      result = updated;
    } else {
      const newModel: VehicleModel = {
        id: modelData.id || `vm-${Date.now()}`,
        name: modelData.name,
        manufacturer_id: modelData.manufacturer_id,
        manufacturer_name: mfgName,
        vehicle_type: modelData.vehicle_type || "Motorcycle",
        engine_displacement: modelData.engine_displacement || "",
        is_active: modelData.is_active !== undefined ? modelData.is_active : true,
      };
      models.push(newModel);
      result = newModel;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(models));
      notifyStoreUpdate();
      // Background sync to Supabase Cloud
      saveVehicleModelToSupabase(result).catch((err) => {
        console.warn("Background Supabase vehicle model save skipped:", err);
      });
    }
    return result;
  },

  deleteVehicleModel(id: string): void {
    const models = this.getVehicleModels().filter((m) => m.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(models));
      notifyStoreUpdate();
      // Background delete from Supabase Cloud
      deleteVehicleModelFromSupabase(id).catch((err) => {
        console.warn("Background Supabase vehicle model delete skipped:", err);
      });
    }
  },

  getCustomerProfile(): CustomerProfile | null {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setCustomerProfile(profile: CustomerProfile | null): void {
    if (typeof window !== "undefined") {
      if (profile) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      } else {
        localStorage.removeItem(STORAGE_KEYS.PROFILE);
      }
      notifyStoreUpdate();
    }
  },
};
