"use client";

import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

export default function NotFound() {
  const { t, dir } = useLang();

  return (
    <div className="font-almarai min-h-screen flex items-center justify-center px-4" dir={dir}>
      <div className="text-center">
        <h1 className="text-8xl font-black text-gray-200 mb-4">404</h1>
        <h2 className="text-2xl font-black mb-2">{t("page_not_found")}</h2>
        <p className="text-gray-500 mb-8">{t("page_not_found_desc")}</p>
        <Link
          href="/"
          className="inline-block bg-black text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors"
        >
          {t("back_to_home")}
        </Link>
      </div>
    </div>
  );
}
