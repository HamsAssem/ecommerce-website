-- =============================================
-- YALLA STORE - Supabase Database Schema (Full)
-- Run this in the Supabase SQL Editor
-- Includes: products, orders, auth profiles, admin RLS,
--          wishlist, addresses, coupons, reviews, payments, settings
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- PROFILES (linked to auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-insert profile on new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name',''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- helper: is the current user an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.is_admin = TRUE
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- =============================================
-- CATEGORIES
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PRODUCTS
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  slug TEXT NOT NULL UNIQUE,
  description_ar TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  price DECIMAL(10, 3) NOT NULL,
  original_price DECIMAL(10, 3),
  cost_price DECIMAL(10, 3),
  sku TEXT UNIQUE,
  image_url TEXT NOT NULL DEFAULT '',
  images TEXT[] DEFAULT '{}',
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  tags TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ADDRESSES (for logged-in users)
-- =============================================
CREATE TABLE IF NOT EXISTS addresses (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Egypt',
  city TEXT NOT NULL,
  area TEXT,
  street TEXT NOT NULL,
  building TEXT,
  apartment TEXT,
  notes TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- COUPONS
-- =============================================
CREATE TABLE IF NOT EXISTS coupons (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent','fixed')),
  discount_value DECIMAL(10,3) NOT NULL,
  min_total DECIMAL(10,3) DEFAULT 0,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ORDERS
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL DEFAULT ('YS-' || to_char(NOW(),'YYYYMMDD') || '-' || substr(md5(random()::text),1,6)),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_area TEXT,
  customer_notes TEXT,
  subtotal DECIMAL(10, 3) NOT NULL DEFAULT 0,
  shipping_fee DECIMAL(10, 3) NOT NULL DEFAULT 0,
  discount DECIMAL(10, 3) NOT NULL DEFAULT 0,
  coupon_code TEXT,
  total DECIMAL(10, 3) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EGP',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
  payment_method TEXT NOT NULL DEFAULT 'cod'
    CHECK (payment_method IN ('cod','paymob_card','paymob_wallet','paymob_installments','paymob_valu','paymob_kiosk')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid','pending','paid','failed','refunded')),
  paymob_order_id TEXT,
  paymob_transaction_id TEXT,
  tracking_number TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ORDER ITEMS
-- =============================================
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 3) NOT NULL
);

-- =============================================
-- WISHLIST
-- =============================================
CREATE TABLE IF NOT EXISTS wishlists (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- =============================================
-- REVIEWS
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PAYMENTS (payment attempts log)
-- =============================================
CREATE TABLE IF NOT EXISTS payments (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'paymob',
  method TEXT,
  amount DECIMAL(10, 3) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EGP',
  status TEXT NOT NULL,
  provider_order_id TEXT,
  provider_txn_id TEXT,
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BANNERS / HERO SLIDES (admin manageable)
-- =============================================
CREATE TABLE IF NOT EXISTS banners (
  id BIGSERIAL PRIMARY KEY,
  title_ar TEXT,
  title_en TEXT,
  subtitle_ar TEXT,
  subtitle_en TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SETTINGS (store config)
-- =============================================
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO settings (key, value) VALUES
  ('store', '{"name_ar":"يلا ستور","name_en":"Yalla Store","phone":"+20 100 000 0000","email":"info@yallastore.com","currency":"EGP","address_ar":"القاهرة، مصر"}'),
  ('shipping', '{"flat_rate": 50, "free_over": 1000}'),
  ('payment', '{"cod_enabled": true, "paymob_enabled": true}')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_new ON products(is_new) WHERE is_new = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses      ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists      ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews        ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons        ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners        ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings       ENABLE ROW LEVEL SECURITY;

-- Profiles: user can read/update their own; admin can do anything
CREATE POLICY "profiles_self_read"  ON profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "profiles_self_update" ON profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "profiles_admin_all"   ON profiles FOR ALL    USING (public.is_admin());

-- Public read for storefront content
CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (is_active OR public.is_admin());
CREATE POLICY "public_read_products"   ON products   FOR SELECT USING (is_active OR public.is_admin());
CREATE POLICY "public_read_banners"    ON banners    FOR SELECT USING (is_active OR public.is_admin());
CREATE POLICY "public_read_settings"   ON settings   FOR SELECT USING (TRUE);
CREATE POLICY "public_read_approved_reviews" ON reviews FOR SELECT USING (is_approved OR public.is_admin() OR user_id = auth.uid());

-- Admin write for storefront content
CREATE POLICY "admin_write_categories" ON categories FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_write_products"   ON products   FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_write_banners"    ON banners    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_write_settings"   ON settings   FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_write_coupons"    ON coupons    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "public_read_coupons"    ON coupons    FOR SELECT USING (is_active);

-- Orders: customers can place orders (anonymous or authed); users see their own; admins see all
CREATE POLICY "anyone_place_order"   ON orders       FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "user_read_own_order"  ON orders       FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "admin_manage_orders"  ON orders       FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_delete_orders"  ON orders       FOR DELETE USING (public.is_admin());

CREATE POLICY "anyone_add_order_items"  ON order_items FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "user_read_own_items"     ON order_items FOR SELECT USING (
  public.is_admin() OR EXISTS (SELECT 1 FROM orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);
CREATE POLICY "admin_manage_order_items" ON order_items FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Addresses: user owns their addresses
CREATE POLICY "addresses_own" ON addresses FOR ALL
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- Wishlists: user owns their wishlist
CREATE POLICY "wishlist_own" ON wishlists FOR ALL
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- Reviews: authed users can add; admin approves
CREATE POLICY "reviews_insert_auth" ON reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "reviews_admin_all"   ON reviews FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Payments: insert allowed from service; read by admin or owner via order
CREATE POLICY "payments_admin_all"  ON payments FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "payments_insert_any" ON payments FOR INSERT WITH CHECK (TRUE);

-- =============================================
-- SEED CATEGORIES
-- =============================================
INSERT INTO categories (name_ar, name_en, slug, image_url, sort_order) VALUES
  ('الإلكترونيات', 'Electronics', 'electronics', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop', 1),
  ('الملابس', 'Clothing', 'clothing', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop', 2),
  ('العطور والجمال', 'Beauty & Perfumes', 'beauty', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop', 3),
  ('المنزل والمطبخ', 'Home & Kitchen', 'home-kitchen', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', 4),
  ('الرياضة', 'Sports', 'sports', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop', 5),
  ('الأطفال', 'Kids', 'kids', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop', 6),
  ('الساعات والمجوهرات', 'Watches & Jewelry', 'watches', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', 7),
  ('الكتب', 'Books', 'books', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 8)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- SEED SAMPLE PRODUCTS
-- =============================================
INSERT INTO products (name_ar, name_en, slug, description_ar, description_en, price, original_price, image_url, images, category_id, stock, is_featured, is_new)
SELECT p.name_ar, p.name_en, p.slug, p.description_ar, p.description_en, p.price, p.original_price, p.image_url, p.images,
       c.id, p.stock, p.is_featured, p.is_new
FROM (VALUES
  ('آيفون 15 برو ماكس','iPhone 15 Pro Max','iphone-15-pro-max','هاتف آبل الأحدث بمعالج A17 Pro.','Latest Apple phone with A17 Pro.',65000.000,72000.000,'https://images.unsplash.com/photo-1696446702028-17b96ec4e5e3?w=600&h=600&fit=crop',ARRAY['https://images.unsplash.com/photo-1696446702028-17b96ec4e5e3?w=600&h=600&fit=crop'],'electronics',25,TRUE,TRUE),
  ('سامسونج جالكسي S24 الترا','Samsung Galaxy S24 Ultra','samsung-galaxy-s24-ultra','هاتف سامسونج الرائد.','Samsung flagship phone.',55000.000,62000.000,'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop',ARRAY['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop'],'electronics',18,TRUE,FALSE),
  ('ماك بوك برو 14','MacBook Pro 14','macbook-pro-14','لابتوب آبل الاحترافي M3 Pro.','Apple pro laptop M3 Pro.',95000.000,NULL,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop'],'electronics',10,TRUE,FALSE),
  ('سماعات سوني WH-1000XM5','Sony WH-1000XM5','sony-wh-1000xm5','سماعات لاسلكية مع إلغاء الضوضاء.','Wireless noise-cancelling.',9500.000,12000.000,'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop',ARRAY['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop'],'electronics',40,FALSE,FALSE),
  ('عباية سوداء فاخرة','Luxury Black Abaya','luxury-black-abaya','عباية كريب فاخرة بتطريز.','Luxury embroidered abaya.',1800.000,2500.000,'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop'],'clothing',30,TRUE,TRUE),
  ('عطر عود الملكي','Royal Oud Perfume','royal-oud-perfume','عطر شرقي بالعود الأصيل.','Oriental oud perfume.',2200.000,2800.000,'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&h=600&fit=crop',ARRAY['https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&h=600&fit=crop'],'beauty',60,TRUE,FALSE),
  ('كريم مرطب روز','Rose Moisturizer','luxury-rose-moisturizer','كريم مرطب بزيت الورد.','Rose oil moisturizer.',650.000,900.000,'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop',ARRAY['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop'],'beauty',80,FALSE,TRUE),
  ('طقم أواني جرانيت','Granite Cookware Set','granite-cookware-set','طقم 7 قطع طلاء جرانيت.','7-piece granite set.',3500.000,5200.000,'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=600&fit=crop',ARRAY['https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=600&fit=crop'],'home-kitchen',20,TRUE,FALSE),
  ('مكنسة روبوت ذكية','Smart Robot Vacuum','smart-robot-vacuum','مكنسة روبوت ذكية.','Smart robot vacuum.',8900.000,11000.000,'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=600&fit=crop',ARRAY['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=600&fit=crop'],'home-kitchen',12,TRUE,TRUE),
  ('حذاء نايك إير ماكس','Nike Air Max','nike-air-max-sport','حذاء رياضي احترافي.','Pro sport shoes.',3200.000,4200.000,'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop'],'sports',45,TRUE,FALSE),
  ('ساعة Apple Watch Ultra','Apple Watch Ultra','apple-watch-ultra','ساعة آبل إطار تيتانيوم.','Titanium Apple Watch.',28000.000,32000.000,'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop',ARRAY['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop'],'watches',30,TRUE,TRUE),
  ('تابلت جالكسي تاب S9','Galaxy Tab S9','samsung-galaxy-tab-s9','تابلت سامسونج AMOLED.','Samsung AMOLED tablet.',18000.000,22000.000,'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',ARRAY['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop'],'electronics',20,FALSE,FALSE)
) AS p(name_ar, name_en, slug, description_ar, description_en, price, original_price, image_url, images, cat_slug, stock, is_featured, is_new)
JOIN categories c ON c.slug = p.cat_slug
ON CONFLICT (slug) DO NOTHING;

-- Seed banners
INSERT INTO banners (title_ar, title_en, subtitle_ar, subtitle_en, image_url, link_url, position, is_active) VALUES
  ('أحدث الإلكترونيات','Latest Electronics','خصومات تصل إلى 40%','Up to 40% off','https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1400&h=600&fit=crop','/category/electronics',1,TRUE),
  ('موضة الموسم','Season Fashion','تشكيلة جديدة','New collection','https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&h=600&fit=crop','/category/clothing',2,TRUE),
  ('العطور الفاخرة','Luxury Perfumes','أفضل العطور','Best perfumes','https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1400&h=600&fit=crop','/category/beauty',3,TRUE)
ON CONFLICT DO NOTHING;

-- =============================================
-- HOW TO MAKE YOURSELF ADMIN
-- 1) Sign up in the app (creates auth.users row + profile)
-- 2) Run: UPDATE profiles SET is_admin = TRUE WHERE email = 'you@example.com';
-- =============================================
