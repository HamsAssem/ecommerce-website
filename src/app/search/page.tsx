"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { useLang } from "@/context/LanguageContext";
import { getAllProducts } from "@/lib/api";

function SearchResults() {
  const searchParams = useSearchParams();
  const { t, dir, lang } = useLang();
  const q = searchParams.get("q") || "";

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const all = await getAllProducts();
      setProducts(all);
      setLoading(false);
    })();
  }, []);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const query = q.trim().toLowerCase();
    return products.filter(
      (p) =>
        (p.name_ar || "").toLowerCase().includes(query) ||
        (p.name_en || "").toLowerCase().includes(query) ||
        (p.description_ar || "").toLowerCase().includes(query) ||
        (p.description_en || "").toLowerCase().includes(query)
    );
  }, [q, products]);

  return (
    <div className="font-almarai" dir={dir}>
      <div className="bg-gray-50 border-b border-gray-200 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-black">{t("home")}</Link>
          <span>/</span>
          <span className="text-black font-medium">{t("search_results")}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-xl font-black mb-2">
          {q
            ? (lang === "en" ? `Search results for: "${q}"` : `نتائج البحث عن: "${q}"`)
            : t("search_results")}
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          {lang === "en" ? `${results.length} results` : `${results.length} نتيجة`}
        </p>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-500 font-medium">{t("no_search_results")}</p>
            <Link href="/products" className="mt-4 inline-block bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors">
              {t("browse_all_products")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-almarai">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
