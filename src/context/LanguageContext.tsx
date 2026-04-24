"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Lang = "ar" | "en";

type Dict = Record<string, { ar: string; en: string }>;

export const dict: Dict = {
  // Announcement / nav
  announcement: { ar: "شحن مجاني على جميع الطلبات", en: "Free Shipping on All Orders" },
  categories: { ar: "الأقسام", en: "Categories" },
  all_products: { ar: "جميع المنتجات", en: "All Products" },
  about_us: { ar: "من نحن", en: "About Us" },
  contact_us: { ar: "تواصل معنا", en: "Contact Us" },
  search_placeholder: { ar: "ابحث عن منتج...", en: "Search for a product..." },
  search_in_products: { ar: "ابحث في المنتجات...", en: "Search products..." },
  open_menu: { ar: "فتح القائمة", en: "Open menu" },
  search: { ar: "بحث", en: "Search" },

  // Features bar (home)
  free_shipping: { ar: "شحن مجاني", en: "Free Shipping" },
  on_all_orders: { ar: "على جميع الطلبات", en: "On all orders" },
  secure_payment: { ar: "دفع آمن 100%", en: "100% Secure Payment" },
  all_payment_methods: { ar: "جميع طرق الدفع متاحة", en: "All methods available" },
  free_return: { ar: "إرجاع مجاني", en: "Free Return" },
  within_14_days: { ar: "خلال 14 يوم", en: "Within 14 days" },
  support_247: { ar: "دعم 24/7", en: "24/7 Support" },
  we_are_here: { ar: "نحن هنا لمساعدتك", en: "We are here to help" },

  // Home sections
  shop_by_category: { ar: "تسوق حسب القسم", en: "Shop by Category" },
  discover_wide_range: { ar: "اكتشف مجموعتنا الواسعة من المنتجات", en: "Discover our wide range of products" },
  view_all: { ar: "عرض الكل", en: "View All" },
  featured_products: { ar: "المنتجات المميزة", en: "Featured Products" },
  bestsellers: { ar: "الأكثر مبيعاً وطلباً", en: "Bestsellers" },
  new_arrivals: { ar: "وصل حديثاً", en: "New Arrivals" },
  latest_products: { ar: "أحدث المنتجات في متجرنا", en: "Latest products in our store" },
  discover_new: { ar: "اكتشف الجديد", en: "Discover New" },
  exclusive_collection: { ar: "مجموعة حصرية", en: "Exclusive Collection" },
  promo_electronics_cta: { ar: "خصم حتى 30% ←", en: "Up to 30% Off →" },
  promo_beauty_cta: { ar: "تسوقي الآن ←", en: "Shop Now →" },

  // Product badges & card
  new_badge: { ar: "جديد", en: "New" },
  add_to_cart: { ar: "أضف للسلة", en: "Add to Cart" },

  // Cart drawer
  shopping_cart: { ar: "سلة التسوق", en: "Shopping Cart" },
  cart_is_empty: { ar: "السلة فارغة", en: "Cart is Empty" },
  add_products_to_start: { ar: "أضف منتجات لتبدأ التسوق", en: "Add products to start shopping" },
  view_cart: { ar: "عرض السلة", en: "View Cart" },
  checkout: { ar: "إتمام الشراء", en: "Checkout" },
  total: { ar: "الإجمالي", en: "Total" },

  // Cart page
  cart_title: { ar: "سلة التسوق", en: "Shopping Cart" },
  cart_empty_title: { ar: "سلتك فارغة", en: "Your cart is empty" },
  cart_empty_desc: { ar: "ابدأ التسوق وأضف منتجات إلى سلتك", en: "Start shopping and add products to your cart" },
  browse_products: { ar: "تصفح المنتجات", en: "Browse Products" },
  clear_cart: { ar: "إفراغ السلة", en: "Clear Cart" },
  continue_shopping: { ar: "متابعة التسوق", en: "Continue Shopping" },
  order_summary: { ar: "ملخص الطلب", en: "Order Summary" },
  subtotal: { ar: "المجموع الفرعي", en: "Subtotal" },
  shipping_label: { ar: "الشحن", en: "Shipping" },
  free_label: { ar: "مجاني", en: "Free" },
  payment_secured: { ar: "دفع آمن ومشفر 100%", en: "100% Secure Payment" },
  free_shipping_all: { ar: "شحن مجاني لجميع الطلبات", en: "Free shipping on all orders" },
  free_return_14: { ar: "إرجاع مجاني خلال 14 يوم", en: "Free return within 14 days" },

  // Products list page
  all_filter: { ar: "الكل", en: "All" },
  default_sort: { ar: "الترتيب الافتراضي", en: "Default" },
  price_asc: { ar: "الأرخص أولاً", en: "Price: Low to High" },
  price_desc: { ar: "الأغلى أولاً", en: "Price: High to Low" },
  newest_first: { ar: "الأحدث أولاً", en: "Newest First" },
  no_results_found: { ar: "لا توجد نتائج", en: "No results found" },
  reset_filters: { ar: "إعادة ضبط الفلاتر", en: "Reset Filters" },

  // Category page sort
  sort_label: { ar: "الترتيب:", en: "Sort:" },
  sort_default: { ar: "الافتراضي", en: "Default" },
  sort_cheapest: { ar: "الأرخص", en: "Cheapest" },
  sort_most_expensive: { ar: "الأغلى", en: "Most Expensive" },
  sort_newest: { ar: "الأحدث", en: "Newest" },
  no_products_in_category: { ar: "لا توجد منتجات في هذا القسم", en: "No products in this category" },
  browse_all_products: { ar: "تصفح جميع المنتجات", en: "Browse All Products" },
  other_categories: { ar: "تصفح أقسام أخرى", en: "Browse Other Categories" },
  show_results: { ar: "عرض", en: "Showing" },
  results_label: { ar: "نتيجة", en: "results" },

  // Product detail page
  home: { ar: "الرئيسية", en: "Home" },
  product_description: { ar: "وصف المنتج", en: "Product Description" },
  quantity: { ar: "الكمية", en: "Quantity" },
  added_to_cart_success: { ar: "✓ تمت الإضافة للسلة", en: "✓ Added to Cart" },
  buy_now: { ar: "اشترِ الآن", en: "Buy Now" },
  in_stock: { ar: "متوفر في المخزون", en: "In Stock" },
  out_of_stock: { ar: "نفذ المخزون", en: "Out of Stock" },
  related_products: { ar: "منتجات مشابهة", en: "Related Products" },

  // Search page
  search_results: { ar: "نتائج البحث", en: "Search Results" },
  no_search_results: { ar: "لم نجد نتائج لبحثك", en: "No results found for your search" },
  searching: { ar: "جاري البحث...", en: "Searching..." },

  // Form fields
  full_name: { ar: "الاسم الكامل", en: "Full Name" },
  phone: { ar: "رقم الهاتف", en: "Phone Number" },
  city: { ar: "المدينة", en: "City" },
  area: { ar: "المنطقة", en: "Area" },
  address: { ar: "العنوان بالتفصيل", en: "Address" },

  // Checkout page
  delivery_info: { ar: "بيانات التوصيل", en: "Delivery Information" },
  payment_method: { ar: "طريقة الدفع", en: "Payment Method" },
  confirming: { ar: "جاري...", en: "Processing..." },
  confirm_order: { ar: "تأكيد الطلب", en: "Place Order" },
  terms_agreement: {
    ar: "بالضغط على تأكيد الطلب فأنت توافق على شروط الاستخدام.",
    en: "By clicking Place Order, you agree to our Terms of Use.",
  },
  cod_label: { ar: "الدفع عند الاستلام (COD)", en: "Cash on Delivery (COD)" },
  cod_desc: { ar: "ادفع نقداً عند استلام الطلب", en: "Pay cash when your order arrives" },
  card_label: { ar: "بطاقة ائتمانية (Visa / MasterCard / Meeza)", en: "Credit Card (Visa / MasterCard)" },
  card_desc: { ar: "عبر بوابة Paymob الآمنة", en: "Via Paymob secure gateway" },
  wallet_label: { ar: "محفظة إلكترونية", en: "E-Wallet" },
  wallet_desc: { ar: "فودافون كاش / اتصالات كاش / أورنج كاش", en: "Vodafone Cash / Orange Cash" },
  empty_cart_shop: { ar: "ابدأ التسوق", en: "Start Shopping" },
  free_shipping_on: { ar: "مجاناً", en: "Free" },

  // Newsletter
  newsletter_title: { ar: "اشترك في نشرتنا البريدية", en: "Subscribe to our Newsletter" },
  newsletter_desc: {
    ar: "احصل على أحدث العروض والخصومات مباشرة في بريدك الإلكتروني",
    en: "Get the latest offers and discounts directly in your inbox",
  },
  subscribe: { ar: "اشترك", en: "Subscribe" },
  subscribed_success: { ar: "✓ شكراً! تم اشتراكك بنجاح", en: "✓ Thank you! You have subscribed successfully" },

  // Footer
  quick_links: { ar: "روابط سريعة", en: "Quick Links" },
  store_name: { ar: "يلا ستور", en: "Yalla Store" },
  store_tagline: {
    ar: "متجرك الإلكتروني الأول في الكويت. نقدم أفضل المنتجات بأسعار مناسبة مع شحن سريع وآمن.",
    en: "Your #1 online store in Kuwait. Best products at great prices with fast, safe shipping.",
  },
  privacy: { ar: "سياسة الخصوصية", en: "Privacy Policy" },
  terms: { ar: "شروط الاستخدام", en: "Terms of Use" },
  all_rights: { ar: "جميع الحقوق محفوظة", en: "All rights reserved" },
  kuwait_city: { ar: "الكويت، مدينة الكويت", en: "Kuwait City, Kuwait" },

  // 404
  page_not_found: { ar: "الصفحة غير موجودة", en: "Page Not Found" },
  page_not_found_desc: { ar: "عذراً، الصفحة التي تبحث عنها غير متاحة", en: "Sorry, the page you're looking for is not available" },
  back_to_home: { ar: "العودة للرئيسية", en: "Back to Home" },

  // About
  about_title: { ar: "من نحن", en: "About Us" },
  our_vision: { ar: "رؤيتنا", en: "Our Vision" },
  our_vision_text: {
    ar: "أن نكون الوجهة الأولى للتسوق الإلكتروني في المنطقة.",
    en: "To be the #1 online shopping destination in the region.",
  },
  our_values: { ar: "قيمنا", en: "Our Values" },
  value_quality: { ar: "الجودة أولاً", en: "Quality First" },
  value_service: { ar: "خدمة عملاء متميزة", en: "Exceptional Customer Service" },
  value_price: { ar: "أسعار منافسة", en: "Competitive Prices" },
  value_shipping: { ar: "شحن سريع وآمن", en: "Fast & Safe Shipping" },
  about_para1: {
    ar: "يلا ستور هو متجرك الإلكتروني الأول الذي يقدم لك تجربة تسوق فريدة بمنتجات عالية الجودة وأسعار مناسبة. نوفر لك كل ما تحتاجه من إلكترونيات وملابس وعطور ومستلزمات منزلية ورياضية.",
    en: "Yalla Store is your #1 online shopping destination, offering a unique shopping experience with high-quality products at great prices. We provide everything you need: electronics, clothing, fragrances, home essentials, and sports gear.",
  },
  about_para2: {
    ar: "مهمتنا هي إيصال أفضل المنتجات إلى باب منزلك بأسرع وقت ممكن، مع ضمان رضاك التام. نعمل بجد لنوفر لك تجربة تسوق آمنة وسهلة، ودعم فني على مدار الساعة.",
    en: "Our mission is to deliver the best products to your doorstep as quickly as possible, with your complete satisfaction guaranteed. We work hard to provide a safe, easy shopping experience with 24/7 technical support.",
  },

  // Contact
  contact_title: { ar: "تواصل معنا", en: "Contact Us" },
  contact_subtitle: {
    ar: "نسعد بخدمتك - أرسل لنا استفسارك وسنرد عليك قريباً.",
    en: "We're happy to help — send us your inquiry and we'll get back to you soon.",
  },
  contact_name: { ar: "الاسم", en: "Name" },
  contact_email: { ar: "البريد الإلكتروني", en: "Email" },
  contact_phone: { ar: "رقم الهاتف", en: "Phone Number" },
  contact_message: { ar: "رسالتك", en: "Your Message" },
  contact_send: { ar: "إرسال", en: "Send" },
  contact_success: {
    ar: "شكراً لتواصلك معنا! تم إرسال رسالتك بنجاح.",
    en: "Thank you for contacting us! Your message has been sent successfully.",
  },
  contact_address_label: { ar: "العنوان", en: "Address" },
  contact_phone_label: { ar: "الهاتف", en: "Phone" },
  contact_email_label: { ar: "البريد الإلكتروني", en: "Email" },
  contact_hours_label: { ar: "ساعات العمل", en: "Working Hours" },
  contact_hours: { ar: "السبت - الخميس: 9 صباحاً - 10 مساءً", en: "Saturday - Thursday: 9 AM - 10 PM" },
};

/** Helper — pick the right language for a bilingual { ar, en } object */
export function pick(obj: { ar: string; en?: string }, lang: Lang): string {
  return lang === "en" && obj.en ? obj.en : obj.ar;
}

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: keyof typeof dict) => string;
  dir: "rtl" | "ltr";
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  }, []);

  const t = useCallback(
    (k: keyof typeof dict) => (dict[k] ? dict[k][lang] : String(k)),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir: lang === "ar" ? "rtl" : "ltr" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
