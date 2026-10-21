-- ============================================================================
-- HRK FILTERS — DATABASE SCHEMA MIGRATION 001
-- Initial schema for products, categories, vehicle models, and customer carts.
-- Strict Brand Rule: HRK Filters only. Zero 3rd party agency branding.
-- ============================================================================

-- 1. Custom Types
CREATE TYPE business_type_enum AS ENUM (
  'Retailer',
  'Wholesaler',
  'Workshop',
  'Fleet Owner',
  'Other'
);

CREATE TYPE stock_status_enum AS ENUM (
  'in_stock',
  'low_stock',
  'made_to_order'
);

CREATE TYPE vehicle_type_enum AS ENUM (
  'Motorcycle',
  'Scooter',
  'Moped',
  'Commercial 3-Wheeler'
);

-- 2. Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Vehicle Manufacturers (OEMs)
CREATE TABLE manufacturers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Vehicle Models
CREATE TABLE vehicle_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manufacturer_id UUID NOT NULL REFERENCES manufacturers(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  vehicle_type vehicle_type_enum NOT NULL DEFAULT 'Motorcycle',
  engine_displacement VARCHAR(50),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicle_models_mfg ON vehicle_models(manufacturer_id);

-- 5. Products (SKUs)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_number VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(150) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  material_quality VARCHAR(100) NOT NULL,
  oe_reference VARCHAR(100),
  mrp NUMERIC(10, 2) NOT NULL CHECK (mrp >= 0),
  min_order_qty INT NOT NULL DEFAULT 10 CHECK (min_order_qty > 0),
  pack_multiple_qty INT NOT NULL DEFAULT 10 CHECK (pack_multiple_qty > 0),
  enforce_pack_multiple BOOLEAN NOT NULL DEFAULT FALSE,
  stock_status stock_status_enum NOT NULL DEFAULT 'in_stock',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  specs JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_part_number ON products(part_number);
CREATE INDEX idx_products_active_featured ON products(is_active, is_featured);

-- 6. Product Vehicle Compatibility (Many-to-Many)
CREATE TABLE product_vehicle_compatibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  vehicle_model_id UUID NOT NULL REFERENCES vehicle_models(id) ON DELETE CASCADE,
  notes VARCHAR(150),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_product_vehicle UNIQUE (product_id, vehicle_model_id)
);

CREATE INDEX idx_compat_product ON product_vehicle_compatibility(product_id);
CREATE INDEX idx_compat_vehicle ON product_vehicle_compatibility(vehicle_model_id);

-- 7. Product Images
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  storage_path VARCHAR(255) NOT NULL,
  alt_text VARCHAR(200),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_images_product ON product_images(product_id);

-- 8. Customer Profiles (Linked to Supabase auth.users)
CREATE TABLE customer_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(120) NOT NULL,
  company_name VARCHAR(150),
  business_type business_type_enum NOT NULL DEFAULT 'Retailer',
  phone_number VARCHAR(25),
  city VARCHAR(80),
  state VARCHAR(80),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Customer Saved Cart (Single active cart per authenticated customer)
CREATE TABLE customer_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL UNIQUE REFERENCES customer_profiles(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Admin Users (Privately provisioned administrator accounts)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
