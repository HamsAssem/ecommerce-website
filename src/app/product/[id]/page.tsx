"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { getProductById, getProductsByCategory } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

interface Props {
  params: { id: string };
}

export default function ProductPage({ params }: Props) {
  const { addItem, toggleCart } = useCart();
  const { t, dir, lang } = useLang();

  const [product, setProduct] = useState<any | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const p = await getProductById(params.id);
      setProduct(p);
      if (p?.category?.slug) {
        const related = await getProductsByCategory(p.category.slug);
        setRelatedProducts(related.filter((r: any) => r.id !== p.id).slice(0, 4));
      }
      setLoading(false);
    })();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center font-almarai" dir={dir}>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center font-almarai gap-4" dir={dir}>
        <h1 className="text-2xl font-black">{t("page_not_found")}</h1>
        <Link href="/products" className="text-black underline">
          {t("browse_all_products")}
        </Link>
      </div>
    );
  }

  const category = product.category;
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    toggleCart();
  };

  const images: string[] = (product.images && product.images.length ? product.images : [product.image_url]).filter(Boolean);
  const name = lang === "en" ? (product.name_en || product.name_ar) : (product.name_ar || product.name_en);
  const description = lang === "en" ? (product.description_en || product.description_ar) : (product.description_ar || product.description_en);
  const categoryName = category
    ? (lang === "en" ? (category.name_en || category.name_ar) : (category.name_ar || category.name_en))
    : "";

  return (
    <div className="font-almarai" dir={dir}>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-black">{t("home")}</Link>
          <span>/</span>
          {category && (
            <>
              <Link href={`/category/${category.slug}`} className="hover:text-black">{categoryName}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-black font-medium line-clamp-1">{name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-200">
              {images[selectedImage] && (
                <Image
                  src={images[selectedImage]}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                />
              )}
              {product.is_new && (
                <span className="absolute top-3 right-3 bg-black text-white text-xs px-3 py-1 rounded-full">{t("new_badge")}</span>
              )}
              {discount && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full">-{discount}%</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-colors ${
                      selectedImage === i ? "border-black" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {category && (
              <Link
                href={`/category/${category.slug}`}
                className="inline-block text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                {categoryName}
              </Link>
            )}

            <h1 className="text-2xl sm:text-3xl font-black leading-snug">{name}</h1>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black">{Number(product.price).toFixed(3)} KWD</span>
              {product.original_price && (
                <span className="text-gray-400 text-lg line-through mb-0.5">
                  {Number(product.original_price).toFixed(3)} KWD
                </span>
              )}
              {discount && (
                <span className="bg-red-50 text-red-600 text-sm font-bold px-2 py-0.5 rounded-full mb-0.5">
                  {lang === "en" ? `Save ${discount}%` : `وفر ${discount}%`}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-green-700 font-medium">{t("in_stock")}</span>
                  {product.stock <= 10 && (
                    <span className="text-xs text-orange-500">
                      ({product.stock} {lang === "en" ? "left" : "قطعة متبقية"})
                    </span>
                  )}
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm text-red-600 font-medium">{t("out_of_stock")}</span>
                </>
              )}
            </div>

            {/* Description */}
            {description && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <h3 className="font-bold mb-2 text-sm text-gray-500">{t("product_description")}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-bold">{t("quantity")}</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-black transition-colors font-bold text-lg"
                >
                  −
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(Math.max(product.stock, 1), quantity + 1))}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-black transition-colors font-bold text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${
                  addedToCart
                    ? "bg-green-600 text-white"
                    : "bg-white border-2 border-black text-black hover:bg-gray-50"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {addedToCart ? t("added_to_cart_success") : t("add_to_cart")}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 py-3.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("buy_now")}
              </button>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
              <div className="text-center space-y-1">
                <svg className="w-5 h-5 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <p className="text-xs text-gray-500">{t("free_shipping")}</p>
              </div>
              <div className="text-center space-y-1">
                <svg className="w-5 h-5 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <p className="text-xs text-gray-500">{t("free_return")}</p>
              </div>
              <div className="text-center space-y-1">
                <svg className="w-5 h-5 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-xs text-gray-500">{t("secure_payment")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-black mb-6">{t("related_products")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
