"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/auth/login");
        return;
      }
      setUser(data.user);
      const { data: o } = await supabase
        .from("orders")
        .select("id, order_number, total, status, payment_status, created_at")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false });
      setOrders(o || []);
      setLoading(false);
    })();
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return <div className="p-16 text-center font-almarai">جاري التحميل...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 font-almarai" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black">حسابي</h1>
        <button onClick={logout} className="text-sm font-bold underline">تسجيل الخروج</button>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 mb-8">
        <p className="text-gray-600 text-sm">مرحباً بك،</p>
        <p className="font-bold text-lg">{user?.email}</p>
      </div>

      <h2 className="text-2xl font-bold mb-4">طلباتي</h2>
      {orders.length === 0 ? (
        <div className="text-gray-600 border rounded-2xl p-6 text-center">
          لا توجد طلبات بعد.{" "}
          <Link href="/products" className="font-bold underline">ابدأ التسوق</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="border rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="font-bold">#{o.order_number}</p>
                <p className="text-xs text-gray-500">{new Date(o.created_at).toLocaleString("ar")}</p>
              </div>
              <div className="text-left">
                <p className="font-bold">{Number(o.total).toFixed(2)} EGP</p>
                <p className="text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-gray-100">{o.status}</span>{" "}
                  <span className="px-2 py-0.5 rounded-full bg-gray-100">{o.payment_status}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
