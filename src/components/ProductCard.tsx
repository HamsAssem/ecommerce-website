"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import type { Product } from "@/lib/database.types";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const { lang, t } = useLang();
  const discount = product.original_price
    ? Math.round(
        ((product.original_price - product.price) / product.original_price) *
          100
      )
    : null;

  const name = lang === "en" ? (product.name_en || product.name_ar) : product.name_ar;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 font-almarai">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.image_url}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {product.is_new && (
              <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">
                {t("new_badge")}
              </span>
            )}
            {discount && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                -{discount}%
              </span>
            )}
          </div>
          {/* Quick Add Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem(product);
              }}
              className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition-colors transform translate-y-2 group-hover:translate-y-0 duration-300"
            >
              {t("add_to_cart")}
            </button>
          </div>
        </div>
      </Link>

      <div className="p-3" dir={lang === "en" ? "ltr" : "rtl"}>
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-black transition-colors mb-1 min-h-[2.5rem]">
            {name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className="font-bold text-sm">
              {product.price.toFixed(3)} KWD
            </span>
            {product.original_price && (
              <span className="text-xs text-gray-400 line-through">
                {product.original_price.toFixed(3)} KWD
              </span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
            aria-label={t("add_to_cart")}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
