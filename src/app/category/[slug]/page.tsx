"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useLang } from "@/context/LanguageContext";
import { getCategories, getProductsByCategory } from "@/lib/api";
import { useSearchParams } from "next/navigation";

interface Props { params: { slug: string }; }

function CategoryContent({ params }: Props) {
  const { t, dir, lang } = useLang();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "default";

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [cats, prods] = await Promise.all([
        getCategories(),
        getProductsByCategory(params.slug),
      ]);
      setCategories(cats);
      setProducts(prods);
      setLoading(false);
    })();
  }, [params.slug]);

  const category = categories.find((c) => c.slug === params.slug);

  let sortedProducts = [...products];
  if (sort === "price-asc") sortedProducts.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") sortedProducts.sort((a, b) => b.price - a.price);
  else if (sort === "newest") sortedProducts.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));

  const categoryName = category
    ? (lang === "en" ? (category.name_en || category.name_ar) : category.name_ar)
    : params.slug;

  const sortOptions = [
    { label: t("sort_default"), value: "default" },
    { label: t("sort_cheapest"), value: "price-asc" },
    { label: t("sort_most_expensive"), value: "price-desc" },
    { label: t("sort_newest"), value: "newest" },
  ];

  return (
    <div className="font-almarai" dir={dir}>
      <div className="bg-gray-50 border-b border-gray-200 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-black transition-colors">{t("home")}</Link>
          <span>/</span>
          <span className="text-black font-medium">{categoryName}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black">{categoryName}</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {lang === "en" ? `${sortedProducts.length} products` : `${sortedProducts.length} منتج`}
          </p>
        </div>

        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="text-sm text-gray-600">
            {lang === "en" ? `Showing ${sortedProducts.length} results` : `عرض ${sortedProducts.length} نتيجة`}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{t("sort_label")}</span>
            <div className="flex gap-1 flex-wrap">
              {sortOptions.map((s) => (
                <Link key={s.value} href={`/category/${params.slug}?sort=${s.value}`}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${sort === s.value ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-300 hover:border-black"}`}>
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="font-medium text-lg">{t("no_products_in_category")}</p>
            <Link href="/products" className="mt-4 inline-block text-black underline hover:text-gray-600">{t("browse_all_products")}</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedProducts.map((product) => (<ProductCard key={product.id} product={product} />))}
          </div>
        )}

        <div className="mt-16">
          <h2 className="text-xl font-bold mb-5">{t("other_categories")}</h2>
          <div className="flex flex-wrap gap-2">
            {categories.filter((c) => c.slug !== params.slug).map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`}
                className="px-4 py-2 rounded-full border border-gray-300 text-sm hover:bg-black hover:text-white hover:border-black transition-colors">
                {lang === "en" ? (cat.name_en || cat.name_ar) : cat.name_ar}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-almarai">Loading...</div>}>
      <CategoryContent params={params} />
    </Suspense>
  );
}