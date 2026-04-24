"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, totalPrice } =
    useCart();
  const { t, dir, lang } = useLang();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={toggleCart}
        />
      )}

      {/* Drawer — slides from left in Arabic, right in English */}
      <div
        className={`fixed top-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 font-almarai ${
          lang === "en"
            ? `right-0 ${isOpen ? "translate-x-0" : "translate-x-full"}`
            : `left-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`
        }`}
        dir={dir}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">{t("shopping_cart")}</h2>
          <button
            onClick={toggleCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: "calc(100vh - 200px)" }}>
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="font-medium">{t("cart_is_empty")}</p>
              <p className="text-sm mt-1">{t("add_products_to_start")}</p>
            </div>
          ) : (
            items.map((item) => {
              const name = lang === "en"
                ? (item.product.name_en || item.product.name_ar)
                : item.product.name_ar;
              return (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                    <Image
                      src={item.product.image_url}
                      alt={name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium line-clamp-2 ${lang === "en" ? "text-left" : "text-right"}`}>
                      {name}
                    </p>
                    <p className="text-sm font-bold text-black mt-1">
                      {item.product.price.toFixed(3)} KWD
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors text-sm font-bold"
                      >
                        +
                      </button>
                      <span className="text-sm w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors text-sm font-bold"
                      >
                        −
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ms-auto text-red-500 hover:text-red-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-200 space-y-3">
            <div className="flex justify-between items-center font-medium text-sm">
              <span className="text-gray-600">{t("total")}</span>
              <span className="text-lg font-bold">{totalPrice.toFixed(3)} KWD</span>
            </div>
            <Link
              href="/checkout"
              onClick={toggleCart}
              className="block w-full bg-black text-white text-center py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors"
            >
              {t("checkout")}
            </Link>
            <Link
              href="/cart"
              onClick={toggleCart}
              className="block w-full border border-black text-black text-center py-3 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              {t("view_cart")}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
