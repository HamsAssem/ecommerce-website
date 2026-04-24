"use client";

import React, { useState } from "react";
import { useLang } from "@/context/LanguageContext";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { t, dir } = useLang();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <section className="py-16 bg-black text-white font-almarai" dir={dir}>
      <div className="max-w-xl mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-black mb-3">
          {t("newsletter_title")}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          {t("newsletter_desc")}
        </p>
        {subscribed ? (
          <div className="bg-white/10 rounded-xl p-4 text-green-400 font-bold">
            {t("subscribed_success")}
          </div>
        ) : (
          <form className="flex gap-2 max-w-sm mx-auto" onSubmit={handleSubmit} dir="ltr">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors text-sm"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm whitespace-nowrap"
            >
              {t("subscribe")}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
