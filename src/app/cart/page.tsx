"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const { t, dir, lang } = useLang();

  const shipping = 0;
  const total = totalPrice + shipping;

  return (
    <div className="font-almarai" dir={dir}>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-black">{t("home")}</Link>
          <span>/</span>
          <span className="text-black font-medium">{t("cart_title")}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl sm:text-3xl font-black mb-8">{t("cart_title")}</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-20 h-20 mx-auto mb-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-xl font-bold text-gray-400 mb-2">{t("cart_empty_title")}</p>
            <p className="text-gray-400 text-sm mb-8">{t("cart_empty_desc")}</p>
            <Link
              href="/products"
              className="inline-block bg-black text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors"
            >
              {t("browse_products")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">
                  {lang === "en" ? `${items.length} item(s) in cart` : `${items.length} منتج في السلة`}
                </p>
                <button
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors font-medium"
                >
                  {t("clear_cart")}
                </button>
              </div>

              {items.map((item) => {
                const name = lang === "en" ? (item.product.name_en || item.product.name_ar) : item.product.name_ar;
                return (
                  <div key={item.product.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors">
                    <Link href={`/product/${item.product.id}`} className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
                      <Image
                        src={item.product.image_url}
                        alt={name}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.product.id}`}>
                        <h3 className="font-bold text-sm hover:text-gray-600 transition-colors line-clamp-2">
                          {name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-base">{item.product.price.toFixed(3)} KWD</span>
                        {item.product.original_price && (
                          <span className="text-xs text-gray-400 line-through">
                            {item.product.original_price.toFixed(3)} KWD
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold"
                          >
                            +
                          </button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold"
                          >
                            −
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-700">
                            {(item.product.price * item.quantity).toFixed(3)} KWD
                          </span>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <Link href="/products" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors mt-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t("continue_shopping")}
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-24 space-y-4">
                <h2 className="font-black text-lg">{t("order_summary")}</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("subtotal")}</span>
                    <span className="font-medium">{totalPrice.toFixed(3)} KWD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("shipping_label")}</span>
                    <span className="font-medium text-green-600">{t("free_label")}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3 flex justify-between font-black text-base">
                    <span>{t("total")}</span>
                    <span>{total.toFixed(3)} KWD</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-black text-white text-center py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                >
                  {t("checkout")}
                </Link>

                {/* Trust Badges */}
                <div className="pt-3 border-t border-gray-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 1l2.928 5.998 6.572.955-4.75 4.636 1.12 6.544L10 16.148l-5.87 3.085 1.12-6.544L.5 8.953l6.572-.955L10 1z" clipRule="evenodd" />
                    </svg>
                    {t("payment_secured")}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 1l2.928 5.998 6.572.955-4.75 4.636 1.12 6.544L10 16.148l-5.87 3.085 1.12-6.544L.5 8.953l6.572-.955L10 1z" clipRule="evenodd" />
                    </svg>
                    {t("free_shipping_all")}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 1l2.928 5.998 6.572.955-4.75 4.636 1.12 6.544L10 16.148l-5.87 3.085 1.12-6.544L.5 8.953l6.572-.955L10 1z" clipRule="evenodd" />
                    </svg>
                    {t("free_return_14")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
