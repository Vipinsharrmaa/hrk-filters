export type BusinessType =
  | "Retailer"
  | "Wholesaler"
  | "Workshop"
  | "Fleet Owner"
  | "Other";

export type StockStatus = "in_stock" | "low_stock" | "made_to_order";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

export interface Manufacturer {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
}

export interface VehicleModel {
  id: string;
  manufacturer_id: string;
  manufacturer_name?: string;
  name: string;
  vehicle_type: "Motorcycle" | "Scooter" | "Moped" | "Commercial 3-Wheeler";
  engine_displacement?: string;
  is_active: boolean;
}

export interface Product {
  id: string;
  part_number: string;
  slug: string;
  title: string;
  category_id: string;
  category_name?: string;
  material_quality: string;
  oe_reference?: string;
  mrp: number;
  min_order_qty: number;
  pack_multiple_qty: number;
  enforce_pack_multiple?: boolean;
  stock_status: StockStatus;
  is_featured: boolean;
  is_active: boolean;
  image_url?: string;
  compatible_model_ids?: string[];
  compatible_models?: string[];
  specs?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  added_at?: number;
}

export interface CustomerProfile {
  id: string;
  email: string;
  full_name: string;
  company_name?: string;
  business_type: BusinessType;
  phone_number?: string;
  city?: string;
  state?: string;
  is_admin?: boolean;
}

export interface WhatsAppBuyerDetails {
  name: string;
  companyName?: string;
  businessType: BusinessType;
  city: string;
  phoneNumber?: string;
}
