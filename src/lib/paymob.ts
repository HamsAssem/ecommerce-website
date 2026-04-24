/**
 * Paymob (Egypt) helper — server-side only.
 * Docs: https://developers.paymob.com/egypt/
 *
 * Required env vars:
 *  - PAYMOB_API_KEY            (from Paymob dashboard)
 *  - PAYMOB_INTEGRATION_CARD   (integration ID for card payments)
 *  - PAYMOB_INTEGRATION_WALLET (integration ID for mobile wallet)
 *  - PAYMOB_IFRAME_ID          (iframe id for card checkout)
 *  - PAYMOB_HMAC_SECRET        (HMAC secret to verify callbacks)
 *
 * Flow:
 *  1. authenticate() -> auth token
 *  2. createOrder(amountCents, items) -> paymob order id
 *  3. getPaymentKey(token, orderId, integrationId, billing) -> payment key
 *  4. redirect to: https://accept.paymob.com/api/acceptance/iframes/{IFRAME_ID}?payment_token={payment_key}
 *  5. Paymob POSTs a callback to /api/paymob/callback -> verify HMAC -> update order
 */

const BASE = "https://accept.paymob.com/api";

export type PaymobBilling = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  street: string;
  city: string;
  country: string;
  state?: string;
  apartment?: string;
  floor?: string;
  building?: string;
  postal_code?: string;
};

export async function authenticate(): Promise<string> {
  const r = await fetch(`${BASE}/auth/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
    cache: "no-store",
  });
  if (!r.ok) throw new Error("Paymob auth failed");
  const j = await r.json();
  return j.token as string;
}

export async function createOrder(
  authToken: string,
  amountCents: number,
  items: Array<{ name: string; amount_cents: number; quantity: number; description?: string }>,
  merchantOrderId?: string,
) {
  const r = await fetch(`${BASE}/ecommerce/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: authToken,
      delivery_needed: "false",
      amount_cents: amountCents,
      currency: "EGP",
      items,
      merchant_order_id: merchantOrderId,
    }),
    cache: "no-store",
  });
  if (!r.ok) throw new Error("Paymob create order failed");
  return r.json();
}

export async function getPaymentKey(
  authToken: string,
  amountCents: number,
  orderId: number | string,
  integrationId: number | string,
  billing: PaymobBilling,
) {
  const r = await fetch(`${BASE}/acceptance/payment_keys`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: authToken,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: orderId,
      billing_data: billing,
      currency: "EGP",
      integration_id: integrationId,
    }),
    cache: "no-store",
  });
  if (!r.ok) throw new Error("Paymob payment key failed");
  const j = await r.json();
  return j.token as string;
}

/**
 * Verify HMAC signature of Paymob callback.
 * https://developers.paymob.com/egypt/online-integration/accept-callback
 */
export function verifyHmac(payload: any, receivedHmac: string): boolean {
  const crypto = require("crypto");
  const secret = process.env.PAYMOB_HMAC_SECRET || "";
  const o = payload?.obj ?? payload;
  const concatenated =
    String(o.amount_cents) +
    String(o.created_at) +
    String(o.currency) +
    String(o.error_occured) +
    String(o.has_parent_transaction) +
    String(o.id) +
    String(o.integration_id) +
    String(o.is_3d_secure) +
    String(o.is_auth) +
    String(o.is_capture) +
    String(o.is_refunded) +
    String(o.is_standalone_payment) +
    String(o.is_voided) +
    String(o.order?.id ?? o.order_id ?? "") +
    String(o.owner) +
    String(o.pending) +
    String(o.source_data?.pan ?? "") +
    String(o.source_data?.sub_type ?? "") +
    String(o.source_data?.type ?? "") +
    String(o.success);
  const computed = crypto.createHmac("sha512", secret).update(concatenated).digest("hex");
  return computed === receivedHmac;
}

export function iframeUrl(paymentKey: string) {
  const iframeId = process.env.PAYMOB_IFRAME_ID;
  return `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`;
}
