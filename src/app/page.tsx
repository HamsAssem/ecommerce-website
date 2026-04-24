"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import Newsletter from "@/components/Newsletter";
import { useLang } from "@/context/LanguageContext";
import {
  getCategories,
  getFeaturedProducts,
  getNewProducts,
} from "@/lib/api";

export default function Home() {
  const { t, dir, lang } = useLang();
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newProducts, setNewProducts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [cats, feat, nw] = await Promise.all([
        getCategories(),
        getFeaturedProducts(),
        getNewProducts(),
      ]);
      setCategories(cats);
      setFeaturedProducts(feat);
      setNewProducts(nw);
    })();
  }, []);

  return (
    <div className="font-almarai" dir={dir}>
      <HeroBanner />

      {/* Features Bar */}
      <div className="bg-black text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
            <div className="flex flex-col items-center gap-2">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              <span className="font-bold">{t("free_shipping")}</span>
              <span className="text-gray-400 text-xs">{t("on_all_orders")}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <span className="font-bold">{t("secure_payment")}</span>
              <span className="text-gray-400 text-xs">{t("all_payment_methods")}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              <span className="font-bold">{t("free_return")}</span>
              <span className="text-gray-400 text-xs">{t("within_14_days")}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              <span className="font-bold">{t("support_247")}</span>
              <span className="text-gray-400 text-xs">{t("we_are_here")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black">{t("shop_by_category")}</h2>
            <p className="text-gray-500 text-sm mt-1">{t("discover_wide_range")}</p>
          </div>
          <Link href="/products" className="text-sm font-bold underline underline-offset-4 hover:text-gray-600 transition-colors">{t("view_all")}</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-square bg-gray-100 hover:shadow-lg transition-shadow duration-300">
              {cat.image_url && (
                <Image src={cat.image_url} alt={lang === "en" ? (cat.name_en || cat.name_ar) : cat.name_ar}
                  fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-3 text-white">
                <p className="font-bold text-sm sm:text-base">{lang === "en" ? (cat.name_en || cat.name_ar) : cat.name_ar}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black">{t("featured_products")}</h2>
              <p className="text-gray-500 text-sm mt-1">{t("bestsellers")}</p>
            </div>
            <Link href="/products" className="text-sm font-bold underline underline-offset-4 hover:text-gray-600">{t("view_all")}</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (<ProductCard key={product.id} product={product} />))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black">{t("new_arrivals")}</h2>
            <p className="text-gray-500 text-sm mt-1">{t("latest_products")}</p>
          </div>
          <Link href="/products" className="text-sm font-bold underline underline-offset-4 hover:text-gray-600">{t("view_all")}</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {newProducts.map((product) => (<ProductCard key={product.id} product={product} />))}
        </div>
      </section>

      <Newsletter />
    </div>
  );
}