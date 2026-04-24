"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else router.push("/account");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 font-almarai" dir="rtl">
      <h1 className="text-3xl font-black mb-6 text-center">تسجيل الدخول</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          required
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-xl px-4 py-3"
        />
        <input
          required
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-xl px-4 py-3"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-black text-white py-3 rounded-full font-bold hover:bg-gray-800 disabled:opacity-50">
          {loading ? "جاري..." : "تسجيل الدخول"}
        </button>
      </form>
      <p className="text-center text-sm mt-6 text-gray-600">
        ليس لديك حساب؟{" "}
        <Link href="/auth/register" className="font-bold underline">
          أنشئ حساب
        </Link>
      </p>
    </div>
  );
}
