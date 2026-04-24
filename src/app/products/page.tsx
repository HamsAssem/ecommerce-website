"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useLang } from "@/context/LanguageContext";
import { getAllProducts, getCategories } from "@/lib/api";

export default function ProductsPage() {
  const { t, dir, lang } = useLang();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [prods, cats] = await Promise.all([getAllProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCategory) list = list.filter((p) => p.category_id === selectedCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          (p.name_ar || "").toLowerCase().includes(q) ||
          (p.name_en || "").toLowerCase().includes(q) ||
          (p.description_ar || "").toLowerCase().includes(q) ||
          (p.description_en || "").toLowerCase().includes(q)
      );
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "newest") list.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
    return list;
  }, [products, selectedCategory, sort, search]);

  return (
    <div className="font-almarai" dir={dir}>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-black">{t("home")}</Link>
          <span>/</span>
          <span className="text-black font-medium">{t("all_products")}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl sm:text-3xl font-black mb-6">{t("all_products")}</h1>

        {/* Filters */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search_in_products")}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors bg-white pr-10"
              dir={dir}
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  !selectedCategory ? "bg-black text-white border-black" : "bg-white border-gray-300 hover:border-black"
                }`}
              >
                {t("all_filter")}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selectedCategory === cat.id ? "bg-black text-white border-black" : "bg-white border-gray-300 hover:border-black"
                  }`}
                >
                  {lang === "en" ? (cat.name_en || cat.name_ar) : (cat.name_ar || cat.name_en)}
                </button>
              ))}
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-xs border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-black bg-white"
              dir={dir}
            >
              <option value="default">{t("default_sort")}</option>
              <option value="price-asc">{t("price_asc")}</option>
              <option value="price-desc">{t("price_desc")}</option>
              <option value="newest">{t("newest_first")}</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          {lang === "en" ? `${filtered.length} products` : `${filtered.length} منتج`}
        </p>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">{t("no_results_found")}</p>
            <button
              onClick={() => { setSearch(""); setSelectedCategory(null); }}
              className="mt-4 text-black underline text-sm"
            >
              {t("reset_filters")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
