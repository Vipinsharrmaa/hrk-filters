-- ============================================================================
-- HRK FILTERS — MASTER SUPABASE DATABASE & STORAGE SETUP SCRIPT
-- Brand: HRK Filters (Automotive Two-Wheeler Filtration)
-- Run this script in the Supabase SQL Editor (1-Click Execution)
-- ============================================================================

-- 1. EXTENSIONS & CUSTOM ENUM TYPES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE business_type_enum AS ENUM ('Retailer', 'Wholesaler', 'Workshop', 'Fleet Owner', 'Other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE stock_status_enum AS ENUM ('in_stock', 'low_stock', 'made_to_order');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE vehicle_type_enum AS ENUM ('Motorcycle', 'Scooter', 'Moped', 'Commercial 3-Wheeler');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(80) PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. MANUFACTURERS TABLE
CREATE TABLE IF NOT EXISTS manufacturers (
  id VARCHAR(80) PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. VEHICLE MODELS TABLE
CREATE TABLE IF NOT EXISTS vehicle_models (
  id VARCHAR(80) PRIMARY KEY,
  manufacturer_id VARCHAR(80) NOT NULL REFERENCES manufacturers(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  vehicle_type vehicle_type_enum NOT NULL DEFAULT 'Motorcycle',
  engine_displacement VARCHAR(50),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(80) PRIMARY KEY,
  part_number VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(150) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  category_id VARCHAR(80) NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  material_quality VARCHAR(100) NOT NULL,
  oe_reference VARCHAR(100),
  mrp NUMERIC(10, 2) NOT NULL CHECK (mrp >= 0),
  min_order_qty INT NOT NULL DEFAULT 10 CHECK (min_order_qty > 0),
  pack_multiple_qty INT NOT NULL DEFAULT 10 CHECK (pack_multiple_qty > 0),
  enforce_pack_multiple BOOLEAN NOT NULL DEFAULT FALSE,
  stock_status stock_status_enum NOT NULL DEFAULT 'in_stock',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  image_url TEXT,
  specs JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PRODUCT VEHICLE COMPATIBILITY TABLE
CREATE TABLE IF NOT EXISTS product_vehicle_compatibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id VARCHAR(80) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  vehicle_model_id VARCHAR(80) NOT NULL REFERENCES vehicle_models(id) ON DELETE CASCADE,
  notes VARCHAR(150),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_product_vehicle UNIQUE (product_id, vehicle_model_id)
);

-- 7. ENABLE ROW LEVEL SECURITY & OPEN PERMISSIVE ACCESS FOR APP
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_vehicle_compatibility ENABLE ROW LEVEL SECURITY;

-- Allow Public Reading
DROP POLICY IF EXISTS "Public can view active categories" ON categories;
CREATE POLICY "Public can view active categories" ON categories FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public can view active manufacturers" ON manufacturers;
CREATE POLICY "Public can view active manufacturers" ON manufacturers FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public can view active vehicle models" ON vehicle_models;
CREATE POLICY "Public can view active vehicle models" ON vehicle_models FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public can view products" ON products;
CREATE POLICY "Public can view products" ON products FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public can view compatibility" ON product_vehicle_compatibility;
CREATE POLICY "Public can view compatibility" ON product_vehicle_compatibility FOR SELECT USING (TRUE);

-- Allow Application Admin Operations (Insert, Update, Delete)
DROP POLICY IF EXISTS "App can manage categories" ON categories;
CREATE POLICY "App can manage categories" ON categories FOR ALL USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "App can manage manufacturers" ON manufacturers;
CREATE POLICY "App can manage manufacturers" ON manufacturers FOR ALL USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "App can manage vehicle models" ON vehicle_models;
CREATE POLICY "App can manage vehicle models" ON vehicle_models FOR ALL USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "App can manage products" ON products;
CREATE POLICY "App can manage products" ON products FOR ALL USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "App can manage compatibility" ON product_vehicle_compatibility;
CREATE POLICY "App can manage compatibility" ON product_vehicle_compatibility FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- 8. STORAGE BUCKET FOR PRODUCT PHOTOS
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', TRUE)
ON CONFLICT (id) DO UPDATE SET public = TRUE;

-- Storage Policies
DROP POLICY IF EXISTS "Public Access to Product Images" ON storage.objects;
CREATE POLICY "Public Access to Product Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Allow Upload to Product Images" ON storage.objects;
CREATE POLICY "Allow Upload to Product Images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products');

DROP POLICY IF EXISTS "Allow Delete from Product Images" ON storage.objects;
CREATE POLICY "Allow Delete from Product Images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'products');

-- 9. INITIAL SEED DATA

-- Categories
INSERT INTO categories (id, slug, name, description, display_order, is_active)
VALUES
  ('air-filter-paper', 'air-filter-paper', 'Air Filter Paper', 'Heavy-duty pleated paper elements with plastic moulded or stamped metal caps.', 1, TRUE),
  ('air-filter-foam', 'air-filter-foam', 'Air Filter Foam', 'High-density polyurethane flame-laminated dual-stage foam filters.', 2, TRUE),
  ('oil-filters', 'oil-filters', 'Oil Filters', 'Micron-rated resin-cured paper and metal end-cap engine oil filters.', 3, TRUE),
  ('petrol-filters', 'petrol-filters', 'Petrol / Fuel Filters', 'Inline high-flow sediment and water-trap fuel filtration units.', 4, TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Manufacturers
INSERT INTO manufacturers (id, slug, name, display_order, is_active)
VALUES
  ('mfg-hero', 'hero-motocorp', 'Hero MotoCorp', 1, TRUE),
  ('mfg-honda', 'honda', 'Honda Motorcycles & Scooters', 2, TRUE),
  ('mfg-bajaj', 'bajaj', 'Bajaj Auto', 3, TRUE),
  ('mfg-tvs', 'tvs', 'TVS Motor Company', 4, TRUE),
  ('mfg-yamaha', 'yamaha', 'Yamaha India', 5, TRUE),
  ('mfg-suzuki', 'suzuki', 'Suzuki Two-Wheelers', 6, TRUE),
  ('mfg-re', 'royal-enfield', 'Royal Enfield', 7, TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Vehicle Models
INSERT INTO vehicle_models (id, manufacturer_id, name, vehicle_type, engine_displacement, is_active)
VALUES
  ('vm-hero-super-splendor', 'mfg-hero', 'Super Splendor', 'Motorcycle', '125cc', TRUE),
  ('vm-hero-passion-pro', 'mfg-hero', 'Passion Pro', 'Motorcycle', '110cc', TRUE),
  ('vm-hero-splendor-bs6', 'mfg-hero', 'Splendor BS6', 'Motorcycle', '97.2cc', TRUE),
  ('vm-hero-glamour-bs6', 'mfg-hero', 'Glamour BS6', 'Motorcycle', '125cc', TRUE),
  ('vm-hero-maestro', 'mfg-hero', 'Maestro Edge', 'Scooter', '110cc', TRUE),
  ('vm-honda-activa-3g', 'mfg-honda', 'Activa 3G / 4G / 5G', 'Scooter', '110cc', TRUE),
  ('vm-honda-activa-new', 'mfg-honda', 'Activa New / 6G', 'Scooter', '110cc', TRUE),
  ('vm-bajaj-pulsar-rs200', 'mfg-bajaj', 'Pulsar RS200', 'Motorcycle', '200cc', TRUE),
  ('vm-bajaj-dominar-400', 'mfg-bajaj', 'Dominar 400', 'Motorcycle', '373cc', TRUE),
  ('vm-tvs-jupiter', 'mfg-tvs', 'Jupiter 110', 'Scooter', '110cc', TRUE),
  ('vm-yamaha-rx100', 'mfg-yamaha', 'RX-100', 'Motorcycle', '98cc', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Verified Products
INSERT INTO products (
  id, part_number, slug, title, category_id, material_quality, oe_reference,
  mrp, min_order_qty, pack_multiple_qty, enforce_pack_multiple, stock_status,
  is_featured, is_active, specs
)
VALUES
  (
    'sample-hrk-042',
    'HRK-042',
    'hrk-042-super-splendor-passion-pro',
    'Super Splendor / Passion Pro Air Filter',
    'air-filter-paper',
    'Metal Cap',
    '17211-KCC-900',
    90.00,
    10,
    10,
    FALSE,
    'in_stock',
    TRUE,
    TRUE,
    '{"Filter Media": "Micro-Pleated Cellulose", "End Cap": "Heavy Duty Stamped Metal Cap", "Box Packing": "10 Units / Box"}'::jsonb
  ),
  (
    'sample-hrk-066',
    'HRK-066',
    'hrk-066-activa-3g-4g-5g',
    'Activa 3G / 4G / 5G Air Filter',
    'air-filter-paper',
    'Plastic Moulded',
    '17210-KPL-900',
    165.00,
    10,
    10,
    FALSE,
    'in_stock',
    TRUE,
    TRUE,
    '{"Filter Media": "Resin Impregnated Viscous Paper", "Frame": "Heat-Cured Polyurethane / Plastic Moulded", "Box Packing": "10 Units / Box"}'::jsonb
  ),
  (
    'sample-hrk-088',
    'HRK-088',
    'hrk-088-pulsar-rs200-dominar-400',
    'Pulsar RS200 / Dominar 400 Air Filter',
    'air-filter-paper',
    'Plastic Moulded',
    'DT-5810-18',
    230.00,
    10,
    10,
    FALSE,
    'in_stock',
    TRUE,
    TRUE,
    '{"Filter Media": "High Dust-Holding Synthetic Blend", "Frame": "Injection Moulded Precision Bezel", "Box Packing": "10 Units / Box"}'::jsonb
  ),
  (
    'sample-hrk-044',
    'HRK-044',
    'hrk-044-maestro-activa-new',
    'Maestro / Activa New Air Filter',
    'air-filter-paper',
    'Metal Cap',
    '17210-KWP-D00',
    135.00,
    10,
    10,
    FALSE,
    'in_stock',
    FALSE,
    TRUE,
    '{"Filter Media": "Deep-Pleated Cellulose", "End Cap": "Heavy Stamped Metal Edge", "Box Packing": "10 Units / Box"}'::jsonb
  ),
  (
    'sample-hrk-018',
    'HRK-018',
    'hrk-018-yamaha-rx-100-foam',
    'Yamaha RX-100 Air Filter Foam',
    'air-filter-foam',
    'Open-Cell Foam',
    'RX-100-AF',
    30.00,
    10,
    10,
    FALSE,
    'in_stock',
    FALSE,
    TRUE,
    '{"Filter Media": "Dual Density Flame-Laminated Foam", "Box Packing": "10 Units / Pack"}'::jsonb
  ),
  (
    'sample-hrk-102',
    'HRK-102',
    'hrk-102-tvs-jupiter-wego',
    'TVS Jupiter / Wego Air Filter',
    'air-filter-paper',
    'Plastic Moulded',
    'K6040180',
    145.00,
    10,
    10,
    FALSE,
    'in_stock',
    FALSE,
    TRUE,
    '{"Filter Media": "Resin Impregnated Pleated Cellulose", "Housing": "Precision Polyurethane Seal", "Box Packing": "10 Units / Box"}'::jsonb
  )
ON CONFLICT (part_number) DO UPDATE SET
  title = EXCLUDED.title,
  mrp = EXCLUDED.mrp,
  specs = EXCLUDED.specs;
