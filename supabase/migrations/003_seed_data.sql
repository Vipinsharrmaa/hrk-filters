-- ============================================================================
-- HRK FILTERS — DATABASE SCHEMA MIGRATION 003
-- Authoritative Seed Data verified against official PDF catalogue & price-list.
-- Brand: HRK Filters only.
-- ============================================================================

-- 1. Insert Categories
INSERT INTO categories (id, slug, name, description, display_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'air-filter-paper', 'Air Filter Paper', 'Pleated cellulose resin-cured paper filters with metal caps or plastic moulded frames.', 1, TRUE),
  ('c1000000-0000-0000-0000-000000000002', 'air-filter-foam', 'Air Filter Foam', 'High density dual-stage polyurethane open-cell foam filters.', 2, TRUE),
  ('c1000000-0000-0000-0000-000000000003', 'oil-filters', 'Oil Filters', 'Precision engine lubrication paper and metal cartridge filtration elements.', 3, TRUE),
  ('c1000000-0000-0000-0000-000000000004', 'petrol-filters', 'Petrol / Fuel Filters', 'Inline high-flow sediment separation fuel filters.', 4, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Manufacturers
INSERT INTO manufacturers (id, slug, name, display_order, is_active)
VALUES
  ('m1000000-0000-0000-0000-000000000001', 'hero-motocorp', 'Hero MotoCorp', 1, TRUE),
  ('m1000000-0000-0000-0000-000000000002', 'honda', 'Honda Motorcycles & Scooters', 2, TRUE),
  ('m1000000-0000-0000-0000-000000000003', 'bajaj', 'Bajaj Auto', 3, TRUE),
  ('m1000000-0000-0000-0000-000000000004', 'tvs', 'TVS Motor Company', 4, TRUE),
  ('m1000000-0000-0000-0000-000000000005', 'yamaha', 'Yamaha India', 5, TRUE),
  ('m1000000-0000-0000-0000-000000000006', 'suzuki', 'Suzuki Two-Wheelers', 6, TRUE),
  ('m1000000-0000-0000-0000-000000000007', 'royal-enfield', 'Royal Enfield', 7, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Vehicle Models
INSERT INTO vehicle_models (id, manufacturer_id, name, vehicle_type, engine_displacement, is_active)
VALUES
  ('v1000000-0000-0000-0000-000000000001', 'm1000000-0000-0000-0000-000000000001', 'Super Splendor', 'Motorcycle', '125cc', TRUE),
  ('v1000000-0000-0000-0000-000000000002', 'm1000000-0000-0000-0000-000000000001', 'Passion Pro', 'Motorcycle', '110cc', TRUE),
  ('v1000000-0000-0000-0000-000000000003', 'm1000000-0000-0000-0000-000000000001', 'Splendor BS6', 'Motorcycle', '97.2cc', TRUE),
  ('v1000000-0000-0000-0000-000000000004', 'm1000000-0000-0000-0000-000000000001', 'Glamour BS6', 'Motorcycle', '125cc', TRUE),
  ('v1000000-0000-0000-0000-000000000005', 'm1000000-0000-0000-0000-000000000001', 'Maestro Edge', 'Scooter', '110cc', TRUE),
  ('v1000000-0000-0000-0000-000000000006', 'm1000000-0000-0000-0000-000000000002', 'Activa 3G / 4G / 5G', 'Scooter', '110cc', TRUE),
  ('v1000000-0000-0000-0000-000000000007', 'm1000000-0000-0000-0000-000000000002', 'Activa New / 6G', 'Scooter', '110cc', TRUE),
  ('v1000000-0000-0000-0000-000000000008', 'm1000000-0000-0000-0000-000000000003', 'Pulsar RS200', 'Motorcycle', '200cc', TRUE),
  ('v1000000-0000-0000-0000-000000000009', 'm1000000-0000-0000-0000-000000000003', 'Dominar 400', 'Motorcycle', '373cc', TRUE),
  ('v1000000-0000-0000-0000-000000000010', 'm1000000-0000-0000-0000-000000000004', 'Jupiter 110', 'Scooter', '110cc', TRUE),
  ('v1000000-0000-0000-0000-000000000011', 'm1000000-0000-0000-0000-000000000005', 'RX-100', 'Motorcycle', '98cc', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Verified Products
INSERT INTO products (
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
  enforce_pack_multiple,
  stock_status,
  is_featured,
  is_active,
  specs
)
VALUES
  (
    'p1000000-0000-0000-0000-000000000042',
    'HRK-042',
    'hrk-042-super-splendor-passion-pro',
    'Super Splendor / Passion Pro Air Filter',
    'c1000000-0000-0000-0000-000000000001',
    'Metal Cap',
    '17211-KCC-900',
    90.00,
    10,
    10,
    FALSE,
    'in_stock',
    TRUE,
    TRUE,
    '{"Filter Media": "Micro-Pleated Cellulose", "End Cap": "Heavy Duty Stamped Metal Cap", "Carton Pack": "10 Units / Box"}'::jsonb
  ),
  (
    'p1000000-0000-0000-0000-000000000066',
    'HRK-066',
    'hrk-066-activa-3g-4g-5g',
    'Activa 3G / 4G / 5G Air Filter',
    'c1000000-0000-0000-0000-000000000001',
    'Plastic Moulded',
    '17210-KPL-900',
    165.00,
    10,
    10,
    FALSE,
    'in_stock',
    TRUE,
    TRUE,
    '{"Filter Media": "Resin Impregnated Viscous Paper", "Frame": "Heat-Cured Polyurethane / Plastic Moulded", "Carton Pack": "10 Units / Box"}'::jsonb
  ),
  (
    'p1000000-0000-0000-0000-000000000088',
    'HRK-088',
    'hrk-088-pulsar-rs200-dominar-400',
    'Pulsar RS200 / Dominar 400 Air Filter',
    'c1000000-0000-0000-0000-000000000001',
    'Plastic Moulded',
    'DH-1210-38',
    150.00,
    10,
    10,
    FALSE,
    'in_stock',
    TRUE,
    TRUE,
    '{"Filter Media": "High-Flow Pleated Cellulose", "Housing": "Precision Injection Moulded Frame", "Carton Pack": "10 Units / Box"}'::jsonb
  ),
  (
    'p1000000-0000-0000-0000-000000000134',
    'HRK-134',
    'hrk-134-hero-splendor-bs6-oil-filter',
    'Hero Splendor BS6 / Glamour BS6 Oil Filter',
    'c1000000-0000-0000-0000-000000000003',
    'Heated / Metal Cap',
    'Paper Element',
    30.00,
    10,
    10,
    FALSE,
    'in_stock',
    TRUE,
    TRUE,
    '{"Filter Media": "Synthetic Blend Paper", "Cap Construction": "Stamped Metal Cap with Spring", "Carton Pack": "10 Units / Box"}'::jsonb
  ),
  (
    'p1000000-0000-0000-0000-000000000044',
    'HRK-044',
    'hrk-044-maestro-activa-new',
    'Maestro / Activa New Air Filter',
    'c1000000-0000-0000-0000-000000000001',
    'Metal Cap',
    '17210-KWP-D00',
    135.00,
    10,
    10,
    FALSE,
    'in_stock',
    FALSE,
    TRUE,
    '{"Filter Media": "Deep-Pleated Cellulose", "End Cap": "Heavy Stamped Metal Edge", "Carton Pack": "10 Units / Box"}'::jsonb
  ),
  (
    'p1000000-0000-0000-0000-000000000018',
    'HRK-018',
    'hrk-018-yamaha-rx-100-foam',
    'Yamaha RX-100 Air Filter Foam',
    'c1000000-0000-0000-0000-000000000002',
    'Open-Cell Foam',
    'RX-100-AF',
    30.00,
    10,
    10,
    FALSE,
    'in_stock',
    FALSE,
    TRUE,
    '{"Filter Media": "Dual Density Flame-Laminated Foam", "Carton Pack": "10 Units / Pack"}'::jsonb
  ),
  (
    'p1000000-0000-0000-0000-000000000102',
    'HRK-102',
    'hrk-102-tvs-jupiter-wego',
    'TVS Jupiter / Wego Air Filter',
    'c1000000-0000-0000-0000-000000000001',
    'Plastic Moulded',
    'K6040180',
    145.00,
    10,
    10,
    FALSE,
    'in_stock',
    FALSE,
    TRUE,
    '{"Filter Media": "Resin Impregnated Pleated Cellulose", "Housing": "Precision Polyurethane Seal", "Carton Pack": "10 Units / Box"}'::jsonb
  )
ON CONFLICT (part_number) DO NOTHING;

-- 5. Insert Vehicle Compatibility
INSERT INTO product_vehicle_compatibility (product_id, vehicle_model_id)
VALUES
  ('p1000000-0000-0000-0000-000000000042', 'v1000000-0000-0000-0000-000000000001'), -- HRK-042 -> Super Splendor
  ('p1000000-0000-0000-0000-000000000042', 'v1000000-0000-0000-0000-000000000002'), -- HRK-042 -> Passion Pro
  ('p1000000-0000-0000-0000-000000000066', 'v1000000-0000-0000-0000-000000000006'), -- HRK-066 -> Activa 3G/4G/5G
  ('p1000000-0000-0000-0000-000000000088', 'v1000000-0000-0000-0000-000000000008'), -- HRK-088 -> Pulsar RS200
  ('p1000000-0000-0000-0000-000000000088', 'v1000000-0000-0000-0000-000000000009'), -- HRK-088 -> Dominar 400
  ('p1000000-0000-0000-0000-000000000134', 'v1000000-0000-0000-0000-000000000003'), -- HRK-134 -> Splendor BS6
  ('p1000000-0000-0000-0000-000000000134', 'v1000000-0000-0000-0000-000000000004'), -- HRK-134 -> Glamour BS6
  ('p1000000-0000-0000-0000-000000000044', 'v1000000-0000-0000-0000-000000000005'), -- HRK-044 -> Maestro Edge
  ('p1000000-0000-0000-0000-000000000044', 'v1000000-0000-0000-0000-000000000007'), -- HRK-044 -> Activa New
  ('p1000000-0000-0000-0000-000000000018', 'v1000000-0000-0000-0000-000000000011'), -- HRK-018 -> RX-100
  ('p1000000-0000-0000-0000-000000000102', 'v1000000-0000-0000-0000-000000000010')  -- HRK-102 -> Jupiter 110
ON CONFLICT DO NOTHING;
