-- ==========================================================
-- YALLA STORE — UNIFIED SUPABASE SCHEMA
-- Works with BOTH the admin dashboard (hams-admin) AND the
-- Next.js storefront. Paste this entire file into:
--   Supabase Dashboard  →  SQL Editor  →  New Query  →  Run
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================================
-- 1. COLLECTIONS  (product categories)
-- ==========================================================
CREATE TABLE IF NOT EXISTS collections (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  name_ar      TEXT,
  slug         TEXT UNIQUE,
  description  TEXT,
  image_url    TEXT,
  sort_order   INTEGER DEFAULT 0,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 2. PRODUCTS
-- ==========================================================
CREATE TABLE IF NOT EXISTS products (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  name_ar        TEXT,
  slug           TEXT UNIQUE,
  description    TEXT,
  description_ar TEXT,
  price          NUMERIC(10,3) NOT NULL,
  original_price NUMERIC(10,3),
  quantity       INTEGER DEFAULT 0,
  badge          TEXT,
  image_path     TEXT,                       -- path in product-images bucket
  images         TEXT[] DEFAULT '{}',        -- extra images
  is_active      BOOLEAN DEFAULT TRUE,
  is_featured    BOOLEAN DEFAULT FALSE,
  is_new         BOOLEAN DEFAULT FALSE,
  collection_id  UUID REFERENCES collections(id) ON DELETE SET NULL,
  views          INTEGER DEFAULT 0,
  rating         NUMERIC(3,2) DEFAULT 0,
  reviews_count  INTEGER DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 3. PRODUCT VARIANTS  (size / color / etc.)
-- ==========================================================
CREATE TABLE IF NOT EXISTS product_variants (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID REFERENCES products(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,       -- e.g. "Color"
  value        TEXT NOT NULL,       -- e.g. "Black"
  price_delta  NUMERIC(10,3) DEFAULT 0,
  stock        INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 4. CUSTOMERS  (linked to auth.users)
-- ==========================================================
CREATE TABLE IF NOT EXISTS customers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name           TEXT,
  email          TEXT UNIQUE,
  phone          TEXT,
  is_admin       BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- auto-create customer row when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.customers (auth_user_id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  ON CONFLICT (email) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- helper: is current logged-in user an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.customers
    WHERE auth_user_id = auth.uid() AND is_admin = TRUE
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ==========================================================
-- 5. ADDRESSES
-- ==========================================================
CREATE TABLE IF NOT EXISTS addresses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  label       TEXT,
  full_name   TEXT NOT NULL,
  phone       TEXT NOT NULL,
  country     TEXT NOT NULL DEFAULT 'Egypt',
  city        TEXT NOT NULL,
  area        TEXT,
  street      TEXT NOT NULL,
  building    TEXT,
  apartment   TEXT,
  notes       TEXT,
  is_default  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 6. COUPONS
-- ==========================================================
CREATE TABLE IF NOT EXISTS coupons (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code           TEXT UNIQUE NOT NULL,
  discount_type  TEXT NOT NULL CHECK (discount_type IN ('percent','fixed')),
  discount_value NUMERIC(10,3) NOT NULL,
  min_total      NUMERIC(10,3) DEFAULT 0,
  max_uses       INTEGER,
  used_count     INTEGER DEFAULT 0,
  expires_at     TIMESTAMPTZ,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 7. ORDERS
-- ==========================================================
CREATE TABLE IF NOT EXISTS orders (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number          TEXT UNIQUE NOT NULL DEFAULT ('YS-' || to_char(NOW(),'YYYYMMDD') || '-' || substr(md5(random()::text),1,6)),
  customer_id           UUID REFERENCES customers(id) ON DELETE SET NULL,

  -- snapshot of customer info at time of order (works for guest checkout too)
  customer_name         TEXT NOT NULL,
  customer_phone        TEXT NOT NULL,
  customer_email        TEXT,
  customer_address      TEXT NOT NULL,
  customer_city         TEXT NOT NULL,
  customer_area         TEXT,
  customer_notes        TEXT,

  -- totals
  subtotal              NUMERIC(10,3) NOT NULL DEFAULT 0,
  shipping_fee          NUMERIC(10,3) NOT NULL DEFAULT 0,
  discount              NUMERIC(10,3) NOT NULL DEFAULT 0,
  coupon_code           TEXT,
  total_amount          NUMERIC(10,3) NOT NULL,
  currency              TEXT NOT NULL DEFAULT 'EGP',

  -- statuses
  status                TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
  payment_method        TEXT NOT NULL DEFAULT 'cod'
    CHECK (payment_method IN ('cod','paymob_card','paymob_wallet')),
  payment_status        TEXT NOT NULL DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid','pending','paid','failed','refunded')),

  -- Paymob
  paymob_order_id       TEXT,
  paymob_transaction_id TEXT,

  tracking_number       TEXT,
  admin_notes           TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 8. ORDER ITEMS
-- ==========================================================
CREATE TABLE IF NOT EXISTS order_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id    UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name  TEXT NOT NULL,
  product_image TEXT,
  quantity      INTEGER NOT NULL DEFAULT 1,
  unit_price    NUMERIC(10,3) NOT NULL
);

-- ==========================================================
-- 9. WISHLISTS
-- ==========================================================
CREATE TABLE IF NOT EXISTS wishlists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (customer_id, product_id)
);

-- ==========================================================
-- 10. REVIEWS
-- ==========================================================
CREATE TABLE IF NOT EXISTS reviews (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id  UUID REFERENCES customers(id) ON DELETE SET NULL,
  author_name  TEXT,
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title        TEXT,
  body         TEXT,
  is_approved  BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 11. PAYMENTS LOG
-- ==========================================================
CREATE TABLE IF NOT EXISTS payments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          UUID REFERENCES orders(id) ON DELETE CASCADE,
  provider          TEXT NOT NULL DEFAULT 'paymob',
  method            TEXT,
  amount            NUMERIC(10,3) NOT NULL,
  currency          TEXT NOT NULL DEFAULT 'EGP',
  status            TEXT NOT NULL,
  provider_order_id TEXT,
  provider_txn_id   TEXT,
  raw_payload       JSONB,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 12. BANNERS (hero slides)
-- ==========================================================
CREATE TABLE IF NOT EXISTS banners (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT,
  title_ar    TEXT,
  subtitle    TEXT,
  subtitle_ar TEXT,
  image_url   TEXT NOT NULL,
  link_url    TEXT,
  position    INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 13. SETTINGS
-- ==========================================================
CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO settings (key, value) VALUES
  ('store',    '{"name":"Yalla Store","name_ar":"يلا ستور","phone":"","email":"","currency":"EGP","address":""}'),
  ('shipping', '{"flat_rate": 50, "free_over": 1000}'),
  ('payment',  '{"cod_enabled": true, "paymob_enabled": true}')
ON CONFLICT (key) DO NOTHING;

-- ==========================================================
-- INDEXES
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_active     ON products(is_active)   WHERE is_active   = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_featured   ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_new        ON products(is_new)      WHERE is_new      = TRUE;
CREATE INDEX IF NOT EXISTS idx_order_items_order   ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer     ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status       ON orders(status);
CREATE INDEX IF NOT EXISTS idx_addresses_customer  ON addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_customer  ON wishlists(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product     ON reviews(product_id);

-- ==========================================================
-- ROW LEVEL SECURITY
-- ==========================================================
ALTER TABLE collections      ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons          ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders           ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews          ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners          ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings         ENABLE ROW LEVEL SECURITY;

-- Public read of storefront content
CREATE POLICY "public_read_collections"      ON collections      FOR SELECT USING (is_active OR public.is_admin());
CREATE POLICY "public_read_products"         ON products         FOR SELECT USING (is_active OR public.is_admin());
CREATE POLICY "public_read_variants"         ON product_variants FOR SELECT USING (TRUE);
CREATE POLICY "public_read_banners"          ON banners          FOR SELECT USING (is_active OR public.is_admin());
CREATE POLICY "public_read_settings"         ON settings         FOR SELECT USING (TRUE);
CREATE POLICY "public_read_coupons"          ON coupons          FOR SELECT USING (is_active);
CREATE POLICY "public_read_approved_reviews" ON reviews          FOR SELECT USING (is_approved OR public.is_admin());

-- Admin full write
CREATE POLICY "admin_all_collections" ON collections      FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_all_products"    ON products         FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_all_variants"    ON product_variants FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_all_banners"     ON banners          FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_all_settings"    ON settings         FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_all_coupons"     ON coupons          FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Customers
CREATE POLICY "customers_self_read"   ON customers FOR SELECT USING (auth_user_id = auth.uid() OR public.is_admin());
CREATE POLICY "customers_self_update" ON customers FOR UPDATE USING (auth_user_id = auth.uid() OR public.is_admin());
CREATE POLICY "customers_admin_all"   ON customers FOR ALL    USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Orders: anyone can place; users see their own; admin sees all
CREATE POLICY "anyone_place_order"  ON orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "read_own_order"      ON orders FOR SELECT USING (
  customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  OR public.is_admin()
);
CREATE POLICY "admin_manage_orders" ON orders FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_delete_orders" ON orders FOR DELETE USING (public.is_admin());

-- Order items
CREATE POLICY "anyone_add_order_items"   ON order_items FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "read_own_order_items"     ON order_items FOR SELECT USING (
  public.is_admin() OR EXISTS (
    SELECT 1 FROM orders o
    WHERE o.id = order_id
      AND o.customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  )
);
CREATE POLICY "admin_manage_order_items" ON order_items FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Addresses
CREATE POLICY "addresses_own" ON addresses FOR ALL
  USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()) OR public.is_admin())
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()) OR public.is_admin());

-- Wishlists
CREATE POLICY "wishlists_own" ON wishlists FOR ALL
  USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()) OR public.is_admin())
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()) OR public.is_admin());

-- Reviews
CREATE POLICY "reviews_insert_auth" ON reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "reviews_admin_all"   ON reviews FOR ALL    USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Payments
CREATE POLICY "payments_admin_all"  ON payments FOR ALL    USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "payments_insert_any" ON payments FOR INSERT WITH CHECK (TRUE);

-- ==========================================================
-- STORAGE BUCKET for product images
-- ==========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', TRUE)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_product_images"  ON storage.objects;
DROP POLICY IF EXISTS "auth_upload_product_images"  ON storage.objects;
DROP POLICY IF EXISTS "auth_update_product_images"  ON storage.objects;
DROP POLICY IF EXISTS "auth_delete_product_images"  ON storage.objects;

CREATE POLICY "public_read_product_images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "auth_upload_product_images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "auth_update_product_images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images');
CREATE POLICY "auth_delete_product_images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images');

-- ==========================================================
-- OPTIONAL — a few sample collections to get you started.
-- Delete the INSERT below if you want to add collections yourself.
-- ==========================================================
INSERT INTO collections (name, name_ar, slug, image_url, sort_order) VALUES
  ('Electronics',   'الإلكترونيات',      'electronics',   'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', 1),
  ('Clothing',      'الملابس',            'clothing',      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', 2),
  ('Beauty',        'العطور والجمال',    'beauty',        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400', 3),
  ('Home & Kitchen','المنزل والمطبخ',    'home-kitchen',  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', 4)
ON CONFLICT (slug) DO NOTHING;

-- ==========================================================
-- HOW TO MAKE YOURSELF ADMIN
-- 1) Sign up on the storefront (creates an auth.users + customers row)
-- 2) Run this once, replacing the email:
--      UPDATE customers SET is_admin = TRUE WHERE email = 'you@example.com';
-- ==========================================================
