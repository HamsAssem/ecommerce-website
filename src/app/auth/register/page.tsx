"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } },
    });
    setLoading(false);
    if (error) setError(error.message);
    else router.push("/account");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 font-almarai" dir="rtl">
      <h1 className="text-3xl font-black mb-6 text-center">إنشاء حساب جديد</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input required placeholder="الاسم الكامل" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border rounded-xl px-4 py-3" />
        <input required type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-xl px-4 py-3" />
        <input required placeholder="رقم الهاتف" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded-xl px-4 py-3" />
        <input required type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-xl px-4 py-3" />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-black text-white py-3 rounded-full font-bold hover:bg-gray-800 disabled:opacity-50">
          {loading ? "جاري..." : "إنشاء الحساب"}
        </button>
      </form>
      <p className="text-center text-sm mt-6 text-gray-600">
        لديك حساب؟{" "}
        <Link href="/auth/login" className="font-bold underline">
          سجل الدخول
        </Link>
      </p>
    </div>
  );
}
