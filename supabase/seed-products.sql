-- =================================================================
-- YALLA STORE - IMAGINARY COLLECTIONS AND PRODUCTS SEED (v2, clean)
-- Paste into Supabase SQL Editor and click Run.
-- Safe to re-run: uses ON CONFLICT (slug) DO NOTHING.
-- =================================================================

-- -----------------------------------------------------------------
-- 1) COLLECTIONS  (10 imaginary storefront categories)
-- -----------------------------------------------------------------
INSERT INTO collections (name, name_ar, slug, description, image_url, sort_order, is_active) VALUES
  ('Electronics and Gadgets', 'الإلكترونيات والأجهزة', 'electronics',
   'Latest smartphones, laptops, audio and wearables.',
   'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=800&fit=crop', 1, TRUE),

  ('Fashion and Apparel', 'الأزياء والملابس', 'fashion',
   'Curated seasonal fashion for men and women.',
   'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=800&fit=crop', 2, TRUE),

  ('Beauty and Fragrance', 'الجمال والعطور', 'beauty',
   'Luxury perfumes, skincare and cosmetics.',
   'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=800&fit=crop', 3, TRUE),

  ('Home and Living', 'المنزل والمعيشة', 'home-living',
   'Everything to style and equip your home.',
   'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop', 4, TRUE),

  ('Sports and Outdoor', 'الرياضة والهواء الطلق', 'sports',
   'Gear for training, outdoor adventures and wellness.',
   'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=800&fit=crop', 5, TRUE),

  ('Kids and Toys', 'الأطفال والألعاب', 'kids',
   'Toys, games and essentials for little ones.',
   'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=800&fit=crop', 6, TRUE),

  ('Watches and Jewelry', 'الساعات والمجوهرات', 'watches-jewelry',
   'Timepieces and fine jewelry for every occasion.',
   'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop', 7, TRUE),

  ('Smart Home', 'المنزل الذكي', 'smart-home',
   'Smart lighting, voice assistants and connected appliances.',
   'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=800&fit=crop', 8, TRUE),

  ('Books and Stationery', 'الكتب والقرطاسية', 'books',
   'Books, planners and premium writing tools.',
   'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=800&fit=crop', 9, TRUE),

  ('Luxury Gifts', 'الهدايا الفاخرة', 'luxury-gifts',
   'Gift-worthy picks hand-selected for special occasions.',
   'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&h=800&fit=crop', 10, TRUE)
ON CONFLICT (slug) DO NOTHING;


-- -----------------------------------------------------------------
-- 2) PRODUCTS via INSERT ... SELECT JOIN collections by slug.
--    No scalar subqueries. Safer against parser quirks.
-- -----------------------------------------------------------------
INSERT INTO products (
  name, name_ar, slug, description, description_ar,
  price, original_price, quantity, badge, image_path,
  is_active, is_featured, is_new, collection_id
)
SELECT
  v.name, v.name_ar, v.slug, v.description, v.description_ar,
  v.price, v.original_price, v.quantity, v.badge, v.image_path,
  v.is_active, v.is_featured, v.is_new, c.id
FROM (VALUES
  -- ELECTRONICS -----------------------------------------------------
  ('Nova X1 Smartphone', 'هاتف نوفا X1 الذكي', 'nova-x1-smartphone',
   'Flagship smartphone with a 6.7 inch AMOLED display, 200MP camera, and titanium frame. 24 hour battery life.',
   'هاتف رائد بشاشة AMOLED مقاس 6.7 بوصة وكاميرا 200 ميجابكسل وإطار تيتانيوم. بطارية تدوم 24 ساعة.',
   249::numeric, 299::numeric, 40, 'new',
   'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop',
   TRUE, TRUE, TRUE, 'electronics'),

  ('AeroBook Pro 14', 'آيروبوك برو 14', 'aerobook-pro-14',
   'Ultra-light 14 inch laptop with M-series chip, 16GB RAM and all-day battery. Built for creators.',
   'لابتوب خفيف الوزن مقاس 14 بوصة بمعالج M-series وذاكرة 16GB وبطارية تدوم اليوم بأكمله. مصمم للمبدعين.',
   429::numeric, NULL::numeric, 18, NULL,
   'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop',
   TRUE, TRUE, FALSE, 'electronics'),

  ('Pulse Air Wireless Earbuds', 'سماعات بلس إير اللاسلكية', 'pulse-air-earbuds',
   'Active noise cancelling earbuds with 40 hour battery life and spatial audio.',
   'سماعات لاسلكية بخاصية إلغاء الضوضاء النشط وبطارية 40 ساعة ودعم الصوت المكاني.',
   35::numeric, 52::numeric, 120, 'sale',
   'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=800&fit=crop',
   TRUE, TRUE, FALSE, 'electronics'),

  ('Lumen 4K Action Camera', 'كاميرا لومن 4K للمغامرات', 'lumen-4k-action-camera',
   'Waterproof 4K action camera with stabilization, great for travel and sports.',
   'كاميرا مغامرات مقاومة للماء بدقة 4K مع تثبيت للصورة، مثالية للسفر والرياضة.',
   89::numeric, 119::numeric, 55, NULL,
   'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=800&h=800&fit=crop',
   TRUE, FALSE, TRUE, 'electronics'),

  ('Orbit Wireless Charging Dock', 'شاحن أوربت اللاسلكي', 'orbit-wireless-charging-dock',
   '3-in-1 wireless charging dock for phone, earbuds and watch. 15W fast charge.',
   'قاعدة شحن لاسلكية 3 في 1 للهاتف والسماعات والساعة. شحن سريع بقوة 15 واط.',
   22::numeric, 30::numeric, 90, NULL,
   'https://images.unsplash.com/photo-1618577608401-2ea8bcc2ef0f?w=800&h=800&fit=crop',
   TRUE, FALSE, FALSE, 'electronics'),

  -- FASHION ---------------------------------------------------------
  ('Midnight Velvet Abaya', 'عباية فيلفت منتصف الليل', 'midnight-velvet-abaya',
   'Elegant velvet abaya with subtle silver embroidery. Hand-finished for special occasions.',
   'عباية أنيقة من الفيلفت مع تطريز فضي خفيف، مصنوعة يدوياً للمناسبات الخاصة.',
   38::numeric, 55::numeric, 25, 'new',
   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
   TRUE, TRUE, TRUE, 'fashion'),

  ('Desert Linen Shirt', 'قميص ديزرت الكتان', 'desert-linen-shirt',
   'Breathable linen shirt in warm sand tone. Perfect for summer days.',
   'قميص كتان مريح بلون الصحراء الدافئ، مثالي لأيام الصيف.',
   24::numeric, 32::numeric, 60, NULL,
   'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=800&fit=crop',
   TRUE, TRUE, FALSE, 'fashion'),

  ('Royal Cashmere Scarf', 'شال الكشمير الملكي', 'royal-cashmere-scarf',
   'Premium pure cashmere scarf, soft and warm with a classic fringe.',
   'شال فاخر من الكشمير الصافي، ناعم ودافئ بحواف كلاسيكية.',
   42::numeric, NULL::numeric, 35, NULL,
   'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&h=800&fit=crop',
   TRUE, FALSE, TRUE, 'fashion'),

  ('Oasis Leather Loafers', 'حذاء أوايسس الجلدي', 'oasis-leather-loafers',
   'Handcrafted Italian leather loafers. Comfortable for all-day wear.',
   'حذاء لوفر إيطالي مصنوع يدوياً من الجلد الفاخر، مريح طوال اليوم.',
   65::numeric, 85::numeric, 28, 'sale',
   'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&h=800&fit=crop',
   TRUE, FALSE, FALSE, 'fashion'),

  -- BEAUTY ----------------------------------------------------------
  ('Velvet Bloom Eau de Parfum', 'عطر فيلفت بلوم', 'velvet-bloom-edp',
   'A floral-oriental fragrance with rose, oud and vanilla heart. 100ml.',
   'عطر زهري شرقي بقلب من الورد والعود والفانيليا. حجم 100 مل.',
   48::numeric, 65::numeric, 70, 'new',
   'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&h=800&fit=crop',
   TRUE, TRUE, TRUE, 'beauty'),

  ('Amber Nights Body Mist', 'عطر الجسم ليالي العنبر', 'amber-nights-body-mist',
   'Warm amber and musk body mist. A subtle all-day signature scent.',
   'رذاذ جسم بنفحات العنبر الدافئ والمسك، عطر خفيف يدوم طوال اليوم.',
   12::numeric, 18::numeric, 200, NULL,
   'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&h=800&fit=crop',
   TRUE, FALSE, TRUE, 'beauty'),

  ('Oasis Hydration Cream', 'كريم أوايسس للترطيب', 'oasis-hydration-cream',
   '72 hour deep moisture cream with hyaluronic acid and rose water.',
   'كريم ترطيب عميق لمدة 72 ساعة بحمض الهيالورونيك وماء الورد.',
   18::numeric, 26::numeric, 150, NULL,
   'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop',
   TRUE, TRUE, FALSE, 'beauty'),

  ('Golden Hour Lipstick Set', 'طقم أحمر شفاه الساعة الذهبية', 'golden-hour-lipstick-set',
   'Set of 5 matte lipsticks in warm nude tones. Long-lasting and lightweight.',
   'طقم من 5 أحمر شفاه مطفي بدرجات دافئة، يدوم طويلاً وخفيف على الشفاه.',
   25::numeric, 38::numeric, 80, 'sale',
   'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=800&fit=crop',
   TRUE, TRUE, FALSE, 'beauty'),

  -- HOME AND LIVING -------------------------------------------------
  ('Sahara Ceramic Dinner Set', 'طقم عشاء صحارى السيراميك', 'sahara-ceramic-dinner-set',
   '16 piece ceramic dinner set in warm desert tones. Dishwasher safe.',
   'طقم عشاء من السيراميك مكون من 16 قطعة بدرجات الصحراء الدافئة. آمن في غسالة الصحون.',
   58::numeric, 85::numeric, 22, NULL,
   'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop',
   TRUE, TRUE, FALSE, 'home-living'),

  ('Cozy Boucle Throw Blanket', 'بطانية بوكلي الدافئة', 'cozy-boucle-throw',
   'Ultra-soft boucle throw blanket. Adds instant warmth and texture.',
   'بطانية بوكلي فائقة النعومة، تمنح الغرفة دفئاً وملمساً فاخراً على الفور.',
   32::numeric, NULL::numeric, 48, 'new',
   'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&h=800&fit=crop',
   TRUE, FALSE, TRUE, 'home-living'),

  ('Aroma Diffuser Pro', 'جهاز أروما برو لنشر العطور', 'aroma-diffuser-pro',
   'Ultrasonic essential oil diffuser with ambient lighting and 8 hour runtime.',
   'جهاز موجات فوق صوتية لنشر الزيوت العطرية مع إضاءة جذابة وتشغيل لمدة 8 ساعات.',
   27::numeric, 36::numeric, 65, NULL,
   'https://images.unsplash.com/photo-1608181831718-c9ffd8728b51?w=800&h=800&fit=crop',
   TRUE, TRUE, FALSE, 'home-living'),

  -- SPORTS ----------------------------------------------------------
  ('Summit Trail Running Shoes', 'حذاء الجري سوميت تريل', 'summit-trail-runner',
   'Lightweight trail running shoes with grippy outsole and breathable mesh upper.',
   'حذاء جري خفيف للمسارات الوعرة بنعل غير منزلق ومقدمة شبكية قابلة للتنفس.',
   52::numeric, 72::numeric, 60, 'sale',
   'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
   TRUE, TRUE, TRUE, 'sports'),

  ('FlexGrip Yoga Mat', 'سجادة اليوغا فليكس غريب', 'flexgrip-yoga-mat',
   'Eco-friendly non-slip yoga mat with alignment guides. 6mm cushioning.',
   'سجادة يوغا صديقة للبيئة غير منزلقة مع أدلة الوضعيات، بسمك 6 مم.',
   18::numeric, 26::numeric, 110, NULL,
   'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop',
   TRUE, FALSE, FALSE, 'sports'),

  ('Hydro Pro Water Bottle', 'قارورة هيدرو برو', 'hydro-pro-bottle',
   'Insulated stainless steel bottle. Keeps drinks cold 24h or hot 12h. 750ml.',
   'قارورة ستانلس ستيل معزولة. تحافظ على البرودة 24 ساعة والحرارة 12 ساعة. 750 مل.',
   14::numeric, NULL::numeric, 180, NULL,
   'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop',
   TRUE, TRUE, FALSE, 'sports'),

  -- KIDS ------------------------------------------------------------
  ('Builder Block Mega Set', 'طقم المكعبات الكبير', 'builder-block-mega-set',
   '1500 piece colorful building block set with instruction book. Ages 6+.',
   'طقم مكعبات بناء ملونة يحتوي على 1500 قطعة مع كتاب تعليمات. من عمر 6 سنوات.',
   22::numeric, 32::numeric, 55, 'new',
   'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=800&fit=crop',
   TRUE, TRUE, TRUE, 'kids'),

  ('Starry Night Nightlight', 'مصباح سماء النجوم', 'starry-night-lamp',
   'Projection nightlight that turns any room into a galaxy.',
   'مصباح ليلي عارض يحول الغرفة إلى مجرة من النجوم.',
   19::numeric, 28::numeric, 75, NULL,
   'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=800&fit=crop',
   TRUE, FALSE, TRUE, 'kids'),

  ('Rainbow Plush Bear', 'دبدوب قوس قزح', 'rainbow-plush-bear',
   'Super-soft rainbow plush teddy bear. 40cm, hypoallergenic filling.',
   'دبدوب قوس قزح فائق النعومة، طول 40 سم بحشوة مضادة للحساسية.',
   11::numeric, NULL::numeric, 120, NULL,
   'https://images.unsplash.com/photo-1559454403-b8fb88521f99?w=800&h=800&fit=crop',
   TRUE, FALSE, FALSE, 'kids'),

  -- WATCHES AND JEWELRY --------------------------------------------
  ('Chronos Automatic Watch', 'ساعة كرونوس الأوتوماتيكية', 'chronos-automatic-watch',
   'Swiss-style automatic watch with sapphire glass and leather strap.',
   'ساعة أوتوماتيكية بطراز سويسري مع زجاج ياقوت وسوار جلدي.',
   145::numeric, 210::numeric, 22, 'sale',
   'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&h=800&fit=crop',
   TRUE, TRUE, FALSE, 'watches-jewelry'),

  ('Aurora Gold Chain Necklace', 'عقد أورورا الذهبي', 'aurora-gold-chain',
   '18k gold-plated chain necklace with minimalist design. 45cm length.',
   'عقد مطلي بالذهب عيار 18 بتصميم بسيط وأنيق، طول 45 سم.',
   68::numeric, 95::numeric, 38, 'new',
   'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
   TRUE, TRUE, TRUE, 'watches-jewelry'),

  ('Crescent Moon Earrings', 'حلق قمر هلالي', 'crescent-moon-earrings',
   'Delicate crescent moon earrings in sterling silver.',
   'حلق بتصميم القمر الهلالي من الفضة الاسترلينية الرقيقة.',
   29::numeric, NULL::numeric, 65, NULL,
   'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
   TRUE, FALSE, TRUE, 'watches-jewelry'),

  -- SMART HOME ------------------------------------------------------
  ('Aurora Smart Lamp', 'مصباح أورورا الذكي', 'aurora-smart-lamp',
   '16 million color smart lamp with voice control and app scheduling.',
   'مصباح ذكي بـ16 مليون لون مع تحكم صوتي وجدولة عبر التطبيق.',
   38::numeric, 55::numeric, 85, 'new',
   'https://images.unsplash.com/photo-1565636192335-cdc2f9076a83?w=800&h=800&fit=crop',
   TRUE, TRUE, TRUE, 'smart-home'),

  ('Echo Home Voice Hub', 'مركز التحكم الصوتي إيكو هوم', 'echo-home-voice-hub',
   'Smart home voice assistant with premium speakers and smart-home control.',
   'مساعد منزلي صوتي ذكي بسماعات فاخرة والتحكم في أجهزة المنزل الذكي.',
   62::numeric, 85::numeric, 40, NULL,
   'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&h=800&fit=crop',
   TRUE, TRUE, FALSE, 'smart-home'),

  ('Cleanly Robot Vacuum', 'مكنسة كلينلي الروبوتية', 'cleanly-robot-vacuum',
   'Self-navigating robot vacuum with mopping function. 3000Pa suction.',
   'مكنسة روبوتية ذاتية التنقل مع وظيفة المسح بقوة شفط 3000 باسكال.',
   119::numeric, 169::numeric, 25, 'sale',
   'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=800&fit=crop',
   TRUE, FALSE, FALSE, 'smart-home'),

  -- BOOKS -----------------------------------------------------------
  ('The Dune Reader Hardcover', 'رواية الكثبان غلاف مقوى', 'dune-reader-hardcover',
   'Hardcover collectors edition of the classic sci-fi saga. 680 pages.',
   'نسخة مجمعي الهواة بغلاف مقوى لملحمة الخيال العلمي الكلاسيكية، 680 صفحة.',
   16::numeric, 24::numeric, 90, NULL,
   'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop',
   TRUE, FALSE, FALSE, 'books'),

  ('Atlas Leather Journal', 'دفتر أطلس الجلدي', 'atlas-leather-journal',
   'Handmade leather-bound journal with 200 pages of premium writing paper.',
   'دفتر بغلاف جلدي مصنوع يدوياً يحتوي على 200 صفحة من الورق الفاخر للكتابة.',
   23::numeric, 32::numeric, 70, 'new',
   'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&h=800&fit=crop',
   TRUE, TRUE, TRUE, 'books'),

  -- LUXURY GIFTS ----------------------------------------------------
  ('Gold Dates Luxury Gift Box', 'صندوق التمور الذهبية الفاخرة', 'gold-dates-gift-box',
   'Curated gift box of premium Medjool dates with rose and saffron chocolates.',
   'صندوق هدايا فاخر يحتوي على تمور المجدول الفاخرة مع شوكولاتة الورد والزعفران.',
   42::numeric, 58::numeric, 45, 'new',
   'https://images.unsplash.com/photo-1548632651-e0b38b29eef6?w=800&h=800&fit=crop',
   TRUE, TRUE, TRUE, 'luxury-gifts'),

  ('Signature Oud Gift Set', 'طقم العود الفاخر للهدايا', 'signature-oud-gift-set',
   'Perfume set with bakhoor, oud oil and a hand-carved incense burner.',
   'طقم عطري يحتوي على البخور وزيت العود ومبخرة محفورة يدوياً.',
   78::numeric, 110::numeric, 30, 'sale',
   'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&h=800&fit=crop',
   TRUE, TRUE, FALSE, 'luxury-gifts'),

  ('Velvet Jewelry Organizer', 'منظم المجوهرات فيلفت', 'velvet-jewelry-organizer',
   'Premium velvet-lined jewelry box with multiple compartments and mirror.',
   'صندوق مجوهرات مبطن بالفيلفت الفاخر مع أقسام متعددة ومرآة.',
   36::numeric, 48::numeric, 50, NULL,
   'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
   TRUE, FALSE, TRUE, 'luxury-gifts')
) AS v(
  name, name_ar, slug, description, description_ar,
  price, original_price, quantity, badge, image_path,
  is_active, is_featured, is_new, collection_slug
)
JOIN collections c ON c.slug = v.collection_slug
ON CONFLICT (slug) DO NOTHING;


-- -----------------------------------------------------------------
-- 3) OPTIONAL: public read policies so anonymous visitors can see
--    active collections and products (skip if you already ran them).
-- -----------------------------------------------------------------
DO $policies$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'public read active products'
  ) THEN
    CREATE POLICY "public read active products" ON products
      FOR SELECT USING (is_active = TRUE);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'public read active collections'
  ) THEN
    CREATE POLICY "public read active collections" ON collections
      FOR SELECT USING (is_active = TRUE);
  END IF;
END
$policies$;


-- -----------------------------------------------------------------
-- Verify:
--   SELECT COUNT(*) FROM collections;
--   SELECT COUNT(*) FROM products WHERE is_active = TRUE;
--   SELECT name, is_featured, is_new FROM products
--     ORDER BY created_at DESC LIMIT 10;
-- -----------------------------------------------------------------
