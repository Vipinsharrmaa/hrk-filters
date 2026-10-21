-- ============================================================================
-- HRK FILTERS — DATABASE SCHEMA MIGRATION 002
-- Row Level Security (RLS) policies and admin verification function.
-- ============================================================================

-- Helper: Check if current authenticated user is an administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  );
$$;

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_vehicle_compatibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 1. Categories
CREATE POLICY "Public can view active categories"
  ON categories FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 2. Manufacturers
CREATE POLICY "Public can view active manufacturers"
  ON manufacturers FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage manufacturers"
  ON manufacturers FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3. Vehicle Models
CREATE POLICY "Public can view active vehicle models"
  ON vehicle_models FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage vehicle models"
  ON vehicle_models FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. Products
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. Product Vehicle Compatibility
CREATE POLICY "Public can view product compatibility"
  ON product_vehicle_compatibility FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage product compatibility"
  ON product_vehicle_compatibility FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6. Product Images
CREATE POLICY "Public can view product images"
  ON product_images FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage product images"
  ON product_images FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 7. Customer Profiles
CREATE POLICY "Customers can view their own profile"
  ON customer_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Customers can update their own profile"
  ON customer_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Customers can insert their own profile"
  ON customer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 8. Customer Saved Cart
CREATE POLICY "Customers can view their own cart"
  ON customer_carts FOR SELECT
  TO authenticated
  USING (auth.uid() = customer_id OR public.is_admin());

CREATE POLICY "Customers can upsert their own cart"
  ON customer_carts FOR ALL
  TO authenticated
  USING (auth.uid() = customer_id)
  WITH CHECK (auth.uid() = customer_id);

-- 9. Admin Users
CREATE POLICY "Admins can view admin_users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (public.is_admin());
