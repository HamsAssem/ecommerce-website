"use client";

import React, { useState } from "react";
import { useLang } from "@/context/LanguageContext";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const { t, dir } = useLang();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 font-almarai" dir={dir}>
      <h1 className="text-4xl font-black mb-2">{t("contact_title")}</h1>
      <p className="text-gray-600 mb-8">{t("contact_subtitle")}</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {sent ? (
            <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-green-800">
              {t("contact_success")}
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-4"
            >
              <input required placeholder={t("contact_name")} className="w-full border rounded-xl px-4 py-3" dir={dir} />
              <input required type="email" placeholder={t("contact_email")} className="w-full border rounded-xl px-4 py-3" dir="ltr" />
              <input required placeholder={t("contact_phone")} className="w-full border rounded-xl px-4 py-3" dir="ltr" />
              <textarea required rows={5} placeholder={t("contact_message")} className="w-full border rounded-xl px-4 py-3" dir={dir} />
              <button className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800">
                {t("contact_send")}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-5 text-gray-700">
          <div>
            <h3 className="font-bold text-lg mb-1">{t("contact_address_label")}</h3>
            <p>{t("kuwait_city")}</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">{t("contact_phone_label")}</h3>
            <p dir="ltr">+965 2222 3333</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">{t("contact_email_label")}</h3>
            <p>info@yallastore.kw</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">{t("contact_hours_label")}</h3>
            <p>{t("contact_hours")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
