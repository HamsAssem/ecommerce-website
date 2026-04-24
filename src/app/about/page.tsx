"use client";

import { useLang } from "@/context/LanguageContext";

export default function AboutPage() {
  const { t, dir } = useLang();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 font-almarai" dir={dir}>
      <h1 className="text-4xl font-black mb-6">{t("about_title")}</h1>
      <p className="text-gray-700 leading-8 mb-4">{t("about_para1")}</p>
      <p className="text-gray-700 leading-8 mb-4">{t("about_para2")}</p>

      <h2 className="text-2xl font-bold mt-10 mb-3">{t("our_vision")}</h2>
      <p className="text-gray-700 leading-8">{t("our_vision_text")}</p>

      <h2 className="text-2xl font-bold mt-10 mb-3">{t("our_values")}</h2>
      <ul className="list-disc ps-6 text-gray-700 leading-8">
        <li>{t("value_quality")}</li>
        <li>{t("value_service")}</li>
        <li>{t("value_price")}</li>
        <li>{t("value_shipping")}</li>
      </ul>
    </div>
  );
}
