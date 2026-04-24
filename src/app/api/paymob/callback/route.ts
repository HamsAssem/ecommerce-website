import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyHmac } from "@/lib/paymob";

/**
 * Paymob server-to-server callback.
 * Configure this URL in Paymob dashboard:
 *   https://<your-domain>/api/paymob/callback
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const hmac = url.searchParams.get("hmac") || "";
  const payload = await req.json();

  const ok = verifyHmac(payload, hmac);
  const obj = payload?.obj ?? payload;
  const paymobOrderId = String(obj?.order?.id ?? obj?.order_id ?? "");
  const merchantOrderId = String(obj?.order?.merchant_order_id ?? "");
  const success = Boolean(obj?.success);

  const supabase = getSupabaseAdmin();

  await supabase.from("payments").insert({
    order_id: null,
    provider: "paymob",
    method: obj?.source_data?.type || "card",
    amount: Number(obj?.amount_cents || 0) / 100,
    currency: obj?.currency || "EGP",
    status: success ? "paid" : "failed",
    provider_order_id: paymobOrderId,
    provider_txn_id: String(obj?.id || ""),
    raw_payload: payload,
  } as any);

  if (ok && merchantOrderId) {
    await supabase
      .from("orders")
      .update({
        payment_status: success ? "paid" : "failed",
        status: success ? "confirmed" : "pending",
        paymob_transaction_id: String(obj?.id || ""),
      } as any)
      .eq("order_number", merchantOrderId);
  }

  return NextResponse.json({ received: true, verified: ok });
}

// Paymob also calls GET for the "response" redirect
export async function GET(req: Request) {
  const url = new URL(req.url);
  const success = url.searchParams.get("success") === "true";
  const orderNumber = url.searchParams.get("merchant_order_id") || "";
  const redirect = success ? `/checkout/success?order=${orderNumber}` : `/checkout/failed?order=${orderNumber}`;
  return NextResponse.redirect(new URL(redirect, url.origin));
}
