"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { mockCategories } from "@/data/mockData";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const { totalItems, toggleCart } = useCart();
  const { lang, setLang, t, dir } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-black text-white text-center py-2 text-sm font-almarai">
        {t("announcement")}
      </div>

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Hamburger Menu (Mobile) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label={t("open_menu")}
            >
              <div className="w-6 h-0.5 bg-black mb-1.5"></div>
              <div className="w-6 h-0.5 bg-black mb-1.5"></div>
              <div className="w-6 h-0.5 bg-black"></div>
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 font-almarai font-bold text-2xl text-black tracking-wider"
            >
              {lang === "en" ? "Yalla Store" : "يلا ستور"}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 font-almarai" dir={dir}>
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium hover:text-gray-600 transition-colors py-4">
                  {t("categories")}
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
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute top-full right-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {mockCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="block px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-black transition-colors border-b border-gray-100 last:border-0"
                    >
                      {lang === "en" ? (cat.name_en || cat.name_ar) : cat.name_ar}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                href="/products"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                {t("all_products")}
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                {t("about_us")}
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                {t("contact_us")}
              </Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <button
                onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                className="hidden sm:flex items-center gap-1 text-xs font-bold border border-gray-300 rounded-full px-3 py-1.5 hover:border-black hover:bg-gray-50 transition-colors font-almarai"
                aria-label="Switch language"
              >
                {lang === "ar" ? "EN" : "AR"}
              </button>

              {/* Search */}
              <div className="relative">
                {searchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center">
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t("search_placeholder")}
                      className="font-almarai border border-gray-300 rounded-full px-4 py-1.5 text-sm w-48 focus:outline-none focus:border-black transition-all"
                      dir={dir}
                    />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="mr-2 text-gray-500 hover:text-black"
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
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label={t("search")}
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label={t("shopping_cart")}
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -left-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-almarai">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white font-almarai" dir={dir}>
            <div className="px-4 py-3 space-y-1">
              {/* Language toggle in mobile */}
              <button
                onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                className="w-full text-center text-xs font-bold border border-gray-300 rounded-full px-3 py-2 mb-3 hover:border-black hover:bg-gray-50 transition-colors"
              >
                {lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
              </button>
              <p className="text-xs text-gray-400 font-medium mb-2">{t("categories")}</p>
              {mockCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="block py-2 text-sm border-b border-gray-100 hover:text-black"
                  onClick={() => setMenuOpen(false)}
                >
                  {lang === "en" ? (cat.name_en || cat.name_ar) : cat.name_ar}
                </Link>
              ))}
              <Link
                href="/products"
                className="block py-2 text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {t("all_products")}
              </Link>
              <Link
                href="/about"
                className="block py-2 text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {t("about_us")}
              </Link>
              <Link
                href="/contact"
                className="block py-2 text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {t("contact_us")}
              </Link>
            </div>
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  );
}
