"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

type PaymentMethod = "cod" | "paymob_card" | "paymob_wallet";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { t, dir, lang } = useLang();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    area: "",
    notes: "",
    paymentMethod: "cod" as PaymentMethod,
  });

  const shippingFee = totalPrice >= 1000 ? 0 : 50;
  const grandTotal = totalPrice + shippingFee;

  const change = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (items.length === 0) {
      setError(lang === "en" ? "Cart is empty" : "سلة التسوق فارغة");
      return;
    }
    setSubmitting(true);
    try {
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: form.name,
            phone: form.phone,
            email: form.email,
            address: form.address,
            city: form.city,
            area: form.area,
            notes: form.notes,
          },
          items: items.map((it) => ({
            product_id: it.product.id,
            name: lang === "en" ? (it.product.name_en || it.product.name_ar) : it.product.name_ar,
            image: it.product.image_url,
            price: it.product.price,
            quantity: it.quantity,
          })),
          shipping_fee: shippingFee,
          payment_method: form.paymentMethod,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.detail || j?.error || "order_failed");

      if (j.iframe_url) {
        clearCart();
        window.location.href = j.iframe_url;
        return;
      }
      clearCart();
      router.push(`/checkout/success?order=${j.order_number}`);
    } catch (err: any) {
      setError(err?.message || (lang === "en" ? "An error occurred" : "حدث خطأ"));
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center font-almarai" dir={dir}>
        <h1 className="text-2xl font-black mb-3">{t("cart_is_empty")}</h1>
        <Link href="/products" className="inline-block bg-black text-white font-bold px-8 py-3 rounded-full">
          {t("empty_cart_shop")}
        </Link>
      </div>
    );
  }

  const paymentOptions = [
    { id: "cod" as const, label: t("cod_label"), desc: t("cod_desc") },
    { id: "paymob_card" as const, label: t("card_label"), desc: t("card_desc") },
    { id: "paymob_wallet" as const, label: t("wallet_label"), desc: t("wallet_desc") },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 font-almarai" dir={dir}>
      <h1 className="text-3xl font-black mb-8">{t("checkout")}</h1>

      <form onSubmit={submit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="border rounded-2xl p-5">
            <h2 className="text-lg font-bold mb-4">{t("delivery_info")}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input required placeholder={t("full_name")} className="border rounded-xl px-4 py-3" value={form.name} onChange={(e) => change("name", e.target.value)} dir={dir} />
              <input required placeholder={t("phone")} className="border rounded-xl px-4 py-3" value={form.phone} onChange={(e) => change("phone", e.target.value)} dir="ltr" />
              <input type="email" placeholder={lang === "en" ? "Email (optional)" : "البريد الإلكتروني (اختياري)"} className="border rounded-xl px-4 py-3 sm:col-span-2" value={form.email} onChange={(e) => change("email", e.target.value)} dir="ltr" />
              <input required placeholder={t("city")} className="border rounded-xl px-4 py-3" value={form.city} onChange={(e) => change("city", e.target.value)} dir={dir} />
              <input placeholder={t("area")} className="border rounded-xl px-4 py-3" value={form.area} onChange={(e) => change("area", e.target.value)} dir={dir} />
              <input required placeholder={t("address")} className="border rounded-xl px-4 py-3 sm:col-span-2" value={form.address} onChange={(e) => change("address", e.target.value)} dir={dir} />
              <textarea placeholder={lang === "en" ? "Notes (optional)" : "ملاحظات (اختياري)"} rows={3} className="border rounded-xl px-4 py-3 sm:col-span-2" value={form.notes} onChange={(e) => change("notes", e.target.value)} dir={dir} />
            </div>
          </section>

          <section className="border rounded-2xl p-5">
            <h2 className="text-lg font-bold mb-4">{t("payment_method")}</h2>
            <div className="space-y-3">
              {paymentOptions.map((p) => (
                <label
                  key={p.id}
                  className={`flex items-start gap-3 border-2 rounded-xl p-4 cursor-pointer transition ${
                    form.paymentMethod === p.id ? "border-black bg-gray-50" : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="mt-1"
                    checked={form.paymentMethod === p.id}
                    onChange={() => change("paymentMethod", p.id)}
                  />
                  <div>
                    <p className="font-bold">{p.label}</p>
                    <p className="text-xs text-gray-500">{p.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="border rounded-2xl p-5 h-fit sticky top-24">
          <h2 className="text-lg font-bold mb-4">{t("order_summary")}</h2>
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {items.map((it) => {
              const name = lang === "en" ? (it.product.name_en || it.product.name_ar) : it.product.name_ar;
              return (
                <div key={it.product.id} className="flex gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image src={it.product.image_url} alt={name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-bold line-clamp-1">{name}</p>
                    <p className="text-gray-500 text-xs">{it.quantity} × {it.product.price.toFixed(3)} KWD</p>
                  </div>
                  <p className="text-sm font-bold">{(it.product.price * it.quantity).toFixed(3)}</p>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{t("subtotal")}</span>
              <span>{totalPrice.toFixed(3)} KWD</span>
            </div>
            <div className="flex justify-between">
              <span>{t("shipping_label")}</span>
              <span>{shippingFee === 0 ? t("free_shipping_on") : `${shippingFee.toFixed(3)} KWD`}</span>
            </div>
            <div className="flex justify-between font-black text-lg border-t pt-2">
              <span>{t("total")}</span>
              <span>{grandTotal.toFixed(3)} KWD</span>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

          <button
            disabled={submitting}
            className="w-full mt-5 bg-black text-white font-bold py-3 rounded-full hover:bg-gray-800 disabled:opacity-50"
          >
            {submitting ? t("confirming") : t("confirm_order")}
          </button>

          <p className="text-xs text-gray-500 mt-3 text-center">{t("terms_agreement")}</p>
        </aside>
      </form>
    </div>
  );
}
