import type { Category, Product } from "@/lib/database.types";

export const mockCategories: Category[] = [
  {
    id: 1,
    name_ar: "الإلكترونيات",
    name_en: "Electronics",
    slug: "electronics",
    image_url:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name_ar: "الملابس",
    name_en: "Clothing",
    slug: "clothing",
    image_url:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name_ar: "العطور والجمال",
    name_en: "Beauty & Fragrances",
    slug: "beauty",
    image_url:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop",
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name_ar: "المنزل والمطبخ",
    name_en: "Home & Kitchen",
    slug: "home-kitchen",
    image_url:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    name_ar: "الرياضة",
    name_en: "Sports",
    slug: "sports",
    image_url:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop",
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    name_ar: "الأطفال",
    name_en: "Kids",
    slug: "kids",
    image_url:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop",
    created_at: new Date().toISOString(),
  },
  {
    id: 7,
    name_ar: "الساعات والمجوهرات",
    name_en: "Watches & Jewelry",
    slug: "watches",
    image_url:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    created_at: new Date().toISOString(),
  },
  {
    id: 8,
    name_ar: "الكتب",
    name_en: "Books",
    slug: "books",
    image_url:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
    created_at: new Date().toISOString(),
  },
];

export const mockProducts: Product[] = [
  // Electronics
  {
    id: 1,
    name_ar: "آيفون 15 برو ماكس",
    name_en: "iPhone 15 Pro Max",
    slug: "iphone-15-pro-max",
    description_ar:
      "أحدث هاتف ذكي من آبل بمعالج A17 Pro وكاميرا احترافية بدقة 48 ميجابكسل وشاشة Super Retina XDR بحجم 6.7 بوصة. يتميز بإطار تيتانيوم فاخر وبطارية تدوم طوال اليوم.",
    description_en:
      "Apple's latest smartphone with A17 Pro chip, 48MP professional camera, and 6.7-inch Super Retina XDR display. Features a premium titanium frame and all-day battery life.",
    price: 179,
    original_price: 219,
    image_url:
      "https://images.unsplash.com/photo-1696446702028-17b96ec4e5e3?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1696446702028-17b96ec4e5e3?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop",
    ],
    category_id: 1,
    stock: 25,
    is_featured: true,
    is_new: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name_ar: "سامسونج جالكسي S24 الترا",
    name_en: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    description_ar:
      "هاتف سامسونج الرائد مع قلم S Pen وكاميرا 200 ميجابكسل ومعالج Snapdragon 8 Gen 3. شاشة Dynamic AMOLED 2X بحجم 6.8 بوصة.",
    description_en:
      "Samsung's flagship phone with S Pen, 200MP camera, and Snapdragon 8 Gen 3 processor. Dynamic AMOLED 2X display at 6.8 inches.",
    price: 155,
    original_price: 189,
    image_url:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop",
    ],
    category_id: 1,
    stock: 18,
    is_featured: true,
    is_new: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name_ar: "لابتوب ماك بوك برو 14",
    name_en: "MacBook Pro 14",
    slug: "macbook-pro-14",
    description_ar:
      "لابتوب آبل الاحترافي بمعالج M3 Pro وشاشة Liquid Retina XDR بدقة 120Hz. ذاكرة 18GB وتخزين 512GB SSD.",
    description_en:
      "Apple's professional laptop with M3 Pro chip and 120Hz Liquid Retina XDR display. 18GB RAM and 512GB SSD storage.",
    price: 320,
    original_price: null,
    image_url:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop",
    ],
    category_id: 1,
    stock: 10,
    is_featured: true,
    is_new: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name_ar: "سماعات سوني WH-1000XM5",
    name_en: "Sony WH-1000XM5 Headphones",
    slug: "sony-wh-1000xm5",
    description_ar:
      "سماعات لاسلكية احترافية مع خاصية إلغاء الضوضاء الرائدة في الصناعة وجودة صوت Hi-Res Audio. بطارية تدوم 30 ساعة.",
    description_en:
      "Premium wireless headphones with industry-leading noise cancellation and Hi-Res Audio quality. 30-hour battery life.",
    price: 28,
    original_price: 38,
    image_url:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop",
    ],
    category_id: 1,
    stock: 40,
    is_featured: false,
    is_new: false,
    created_at: new Date().toISOString(),
  },
  // Clothing
  {
    id: 5,
    name_ar: "عباية سوداء فاخرة",
    name_en: "Luxury Black Abaya",
    slug: "luxury-black-abaya",
    description_ar:
      "عباية أنيقة من القماش الكريب الفاخر مع تطريز ذهبي يدوي على الأكمام. مثالية للمناسبات الرسمية والسهرات.",
    description_en:
      "Elegant abaya in premium crepe fabric with handcrafted gold embroidery on the sleeves. Perfect for formal occasions and evenings.",
    price: 22,
    original_price: 35,
    image_url:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
    ],
    category_id: 2,
    stock: 30,
    is_featured: true,
    is_new: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    name_ar: "بشت رجالي كلاسيكي",
    name_en: "Classic Men's Bisht",
    slug: "mens-classic-bisht",
    description_ar:
      "بشت رجالي فاخر من الصوف الأصيل مع خيوط ذهبية. قطعة تراثية راقية للمناسبات الرسمية والأعراس.",
    description_en:
      "Luxury men's bisht in authentic wool with golden threads. A refined heritage piece for formal occasions and weddings.",
    price: 45,
    original_price: null,
    image_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
    ],
    category_id: 2,
    stock: 15,
    is_featured: false,
    is_new: false,
    created_at: new Date().toISOString(),
  },
  // Beauty
  {
    id: 7,
    name_ar: "عطر عود الملكي",
    name_en: "Royal Oud Perfume",
    slug: "royal-oud-perfume",
    description_ar:
      "عطر شرقي فاخر بقلب من العود العربي الأصيل مع مسك أبيض وصندل هندي. رائحة تدوم طوال اليوم.",
    description_en:
      "Luxury oriental fragrance with genuine Arabian oud, white musk, and Indian sandalwood at its heart. Long-lasting scent that lasts all day.",
    price: 18,
    original_price: 25,
    image_url:
      "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&h=600&fit=crop",
    ],
    category_id: 3,
    stock: 60,
    is_featured: true,
    is_new: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 8,
    name_ar: "كريم مرطب فاخر روز",
    name_en: "Luxury Rose Moisturizer",
    slug: "luxury-rose-moisturizer",
    description_ar:
      "كريم مرطب فاخر بزيت الورد البلغاري وزيت الأرغان. يمنح البشرة نضارة وإشراقاً فورياً. مناسب لجميع أنواع البشرة.",
    description_en:
      "Premium moisturizing cream with Bulgarian rose oil and argan oil. Provides instant freshness and radiance. Suitable for all skin types.",
    price: 9.5,
    original_price: 14,
    image_url:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
    ],
    category_id: 3,
    stock: 80,
    is_featured: false,
    is_new: true,
    created_at: new Date().toISOString(),
  },
  // Home & Kitchen
  {
    id: 9,
    name_ar: "طقم أواني طبخ غرانيت",
    name_en: "Granite Cookware Set",
    slug: "granite-cookware-set",
    description_ar:
      "طقم أواني طبخ من 7 قطع بطلاء جرانيت عالي الجودة. مناسب لجميع أنواع المواقد وسهل التنظيف.",
    description_en:
      "7-piece high-quality granite-coated cookware set. Compatible with all stove types and easy to clean.",
    price: 35,
    original_price: 52,
    image_url:
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=600&fit=crop",
    ],
    category_id: 4,
    stock: 20,
    is_featured: true,
    is_new: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 10,
    name_ar: "مكنسة روبوت ذكية",
    name_en: "Smart Robot Vacuum",
    slug: "smart-robot-vacuum",
    description_ar:
      "مكنسة روبوت ذكية مع خاصية الرسم ثلاثي الأبعاد وتنظيف تلقائي. يمكن التحكم بها عبر التطبيق الذكي.",
    description_en:
      "Smart robot vacuum with 3D mapping and automatic cleaning. Controllable via the smart app.",
    price: 65,
    original_price: 89,
    image_url:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=600&fit=crop",
    ],
    category_id: 4,
    stock: 12,
    is_featured: true,
    is_new: true,
    created_at: new Date().toISOString(),
  },
  // Sports
  {
    id: 11,
    name_ar: "حذاء رياضي نايك إير ماكس",
    name_en: "Nike Air Max Sports Shoe",
    slug: "nike-air-max-sport",
    description_ar:
      "حذاء رياضي احترافي من نايك بتقنية Air Max للتوسيد الفائق. مثالي للجري والتدريب اليومي.",
    description_en:
      "Professional Nike sports shoe with Air Max cushioning technology. Ideal for running and daily training.",
    price: 29,
    original_price: 42,
    image_url:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
    ],
    category_id: 5,
    stock: 45,
    is_featured: true,
    is_new: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 12,
    name_ar: "دراجة هوائية جبلية",
    name_en: "Mountain Bike",
    slug: "mountain-bike",
    description_ar:
      "دراجة هوائية جبلية بإطار ألومنيوم خفيف الوزن و21 سرعة. مثالية للمسارات الوعرة والاستخدام اليومي.",
    description_en:
      "Mountain bike with lightweight aluminum frame and 21 speeds. Ideal for rough terrain and daily use.",
    price: 89,
    original_price: 120,
    image_url:
      "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600&h=600&fit=crop",
    ],
    category_id: 5,
    stock: 8,
    is_featured: false,
    is_new: false,
    created_at: new Date().toISOString(),
  },
  // Kids
  {
    id: 13,
    name_ar: "مجموعة ليغو الإبداعية",
    name_en: "LEGO Creative Set",
    slug: "lego-creative-set",
    description_ar:
      "مجموعة ليغو الإبداعية تحتوي على 1200 قطعة ملونة لبناء مشاريع لا نهاية لها. مناسبة للأطفال من 6 سنوات فأكثر.",
    description_en:
      "Creative LEGO set with 1200 colorful pieces for building endless projects. Suitable for children aged 6 and above.",
    price: 15,
    original_price: 22,
    image_url:
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop",
    ],
    category_id: 6,
    stock: 55,
    is_featured: false,
    is_new: true,
    created_at: new Date().toISOString(),
  },
  // Watches
  {
    id: 14,
    name_ar: "ساعة رجالية كلاسيكية",
    name_en: "Classic Men's Watch",
    slug: "classic-mens-watch",
    description_ar:
      "ساعة رجالية فاخرة بإطار من الفولاذ المقاوم للصدأ وزجاج ياقوت مقاوم للخدش. ميكانيكا أوتوماتيكية سويسرية.",
    description_en:
      "Luxury men's watch with stainless steel case and scratch-resistant sapphire glass. Swiss automatic movement.",
    price: 85,
    original_price: 120,
    image_url:
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&fit=crop",
    ],
    category_id: 7,
    stock: 22,
    is_featured: true,
    is_new: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 15,
    name_ar: "ساعة ذكية Apple Watch Ultra",
    name_en: "Apple Watch Ultra",
    slug: "apple-watch-ultra",
    description_ar:
      "ساعة آبل الترا بإطار تيتانيوم ضخم ومقاومة للماء حتى 100 متر. مثالية للرياضيين والمغامرين.",
    description_en:
      "Apple Watch Ultra with a large titanium case and water resistance up to 100 meters. Ideal for athletes and adventurers.",
    price: 65,
    original_price: 80,
    image_url:
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop",
    ],
    category_id: 7,
    stock: 30,
    is_featured: true,
    is_new: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 16,
    name_ar: "تابلت سامسونج جالكسي تاب S9",
    name_en: "Samsung Galaxy Tab S9",
    slug: "samsung-galaxy-tab-s9",
    description_ar:
      "تابلت احترافي بشاشة AMOLED 11 بوصة ومعالج Snapdragon 8 Gen 2. مثالي للعمل والترفيه.",
    description_en:
      "Professional tablet with an 11-inch AMOLED display and Snapdragon 8 Gen 2 processor. Perfect for work and entertainment.",
    price: 89,
    original_price: 110,
    image_url:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop",
    ],
    category_id: 1,
    stock: 20,
    is_featured: false,
    is_new: false,
    created_at: new Date().toISOString(),
  },
];

export function getProductsByCategory(categorySlug: string): Product[] {
  const category = mockCategories.find((c) => c.slug === categorySlug);
  if (!category) return [];
  return mockProducts.filter((p) => p.category_id === category.id);
}

export function getProductById(id: number): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return mockProducts.filter((p) => p.is_featured);
}

export function getNewProducts(): Product[] {
  return mockProducts.filter((p) => p.is_new);
}
