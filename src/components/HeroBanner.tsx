"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

const slides = [
  {
    id: 1,
    title: { ar: "أحدث الإلكترونيات", en: "Latest Electronics" },
    subtitle: { ar: "آيفون 15 برو ماكس", en: "iPhone 15 Pro Max" },
    description: { ar: "اكتشف تجربة لا مثيل لها مع أحدث هواتف آبل", en: "Discover an unmatched experience with Apple's latest phones" },
    cta: { ar: "تسوق الآن", en: "Shop Now" },
    href: "/category/electronics",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1400&h=600&fit=crop",
    badge: { ar: "وصل حديثاً", en: "New Arrival" },
    price: { ar: "يبدأ من 179 KWD", en: "From 179 KWD" },
  },
  {
    id: 2,
    title: { ar: "موضة الموسم", en: "Season's Fashion" },
    subtitle: { ar: "تشكيلة الملابس الجديدة", en: "New Clothing Collection" },
    description: { ar: "أناقة لا تنتهي مع أحدث تشكيلاتنا من الملابس الفاخرة", en: "Endless elegance with our latest luxury clothing collections" },
    cta: { ar: "استكشف المجموعة", en: "Explore Collection" },
    href: "/category/clothing",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&h=600&fit=crop",
    badge: { ar: "مجموعة جديدة", en: "New Collection" },
    price: { ar: "خصم حتى 40%", en: "Up to 40% Off" },
  },
  {
    id: 3,
    title: { ar: "العطور الفاخرة", en: "Luxury Fragrances" },
    subtitle: { ar: "عطر عود الملكي", en: "Royal Oud Perfume" },
    description: { ar: "رحلة عطرية أصيلة من قلب الشرق إلى عالمك", en: "An authentic aromatic journey from the heart of the Orient" },
    cta: { ar: "اكتشف العطور", en: "Discover Fragrances" },
    href: "/category/beauty",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1400&h=600&fit=crop",
    badge: { ar: "أفضل مبيعاً", en: "Best Seller" },
    price: { ar: "من 18 KWD", en: "From 18 KWD" },
  },
];

export default function HeroBanner() {
  const { lang, dir } = useLang();
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const goTo = (index: number) => {
    setCurrent(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  return (
    <div className="relative w-full overflow-hidden bg-gray-900" style={{ height: "clamp(300px, 60vw, 600px)" }}>
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src={slide.image}
            alt={lang === "en" ? slide.title.en : slide.title.ar}
            fill
            className="object-cover"
            priority={i === 0}
          />
          {/* Gradient overlay */}
          <div className={`absolute inset-0 ${lang === "en" ? "bg-gradient-to-r from-black/80 via-black/40 to-transparent" : "bg-gradient-to-l from-black/80 via-black/40 to-transparent"}`} />

          {/* Content */}
          <div className="absolute inset-0 flex items-center font-almarai" dir={dir}>
            <div className="max-w-7xl mx-auto px-6 w-full">
              <div className="max-w-lg">
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full mb-3 border border-white/30">
                  {lang === "en" ? slide.badge.en : slide.badge.ar}
                </span>
                <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-2">
                  {lang === "en" ? slide.title.en : slide.title.ar}
                </h1>
                <h2 className="text-white/90 text-lg sm:text-xl font-bold mb-3">
                  {lang === "en" ? slide.subtitle.en : slide.subtitle.ar}
                </h2>
                <p className="text-white/75 text-sm sm:text-base mb-2">
                  {lang === "en" ? slide.description.en : slide.description.ar}
                </p>
                <p className="text-yellow-300 font-bold text-base mb-6">
                  {lang === "en" ? slide.price.en : slide.price.ar}
                </p>
                <Link
                  href={slide.href}
                  className="inline-block bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm"
                >
                  {lang === "en" ? slide.cta.en : slide.cta.ar}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "bg-white w-6" : "bg-white/50 w-2"
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-colors text-white"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-colors text-white"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  );
}
