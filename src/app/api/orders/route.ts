import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/orders
 * Creates/updates a customer record, then inserts the order and its items.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customer,
      items,
      shipping_fee = 0,
      discount = 0,
      coupon_code,
      payment_method,
    } = body || {};

    if (!customer?.name || !customer?.phone || !customer?.address || !customer?.city) {
      return NextResponse.json({ error: "missing_customer_fields" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "empty_cart" }, { status: 400 });
    }

    const subtotal = items.reduce(
      (s: number, it: any) => s + Number(it.price) * Number(it.quantity),
      0,
    );
    const total = Math.max(0, subtotal + Number(shipping_fee) - Number(discount));

    const supabase = getSupabaseAdmin();

    // ── 1. Find or create the customer (match by email first, then phone) ──
    let customerId: string | null = null;

    const matchKey = customer.email ? { col: "email", val: customer.email }
                                    : { col: "phone", val: customer.phone };

    const { data: existing } = await (supabase as any)
      .from("customers")
      .select("id")
      .eq(matchKey.col, matchKey.val)
      .maybeSingle();

    if (existing?.id) {
      customerId = existing.id;
      // Keep their details fresh
      await (supabase as any)
        .from("customers")
        .update({
          name: customer.name,
          phone: customer.phone,
          email: customer.email || null,
        })
        .eq("id", customerId);
    } else {
      const { data: newCust, error: cerr } = await (supabase as any)
        .from("customers")
        .insert({
          name: customer.name,
          phone: customer.phone,
          email: customer.email || null,
        })
        .select("id")
        .single();
      if (!cerr && newCust) customerId = newCust.id;
    }

    // ── 2. Insert the order ──
    const { data: order, error: oerr } = await (supabase as any)
      .from("orders")
      .insert({
        customer_id: customerId,
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_email: customer.email || null,
        customer_address: customer.address,
        customer_city: customer.city,
        customer_area: customer.area || null,
        customer_notes: customer.notes || null,
        subtotal,
        shipping_fee,
        discount,
        coupon_code: coupon_code || null,
        total_amount: total,
        currency: "EGP",
        payment_method,
        payment_status: payment_method === "cod" ? "unpaid" : "pending",
        status: "pending",
      })
      .select("id, order_number, total_amount")
      .single();

    if (oerr || !order) {
      return NextResponse.json(
        { error: "order_create_failed", detail: oerr?.message },
        { status: 500 },
      );
    }

    // ── 3. Insert order items ──
    const itemRows = items.map((it: any) => ({
      order_id: order.id,
      product_id: it.product_id,
      product_name: it.name,
      product_image: it.image || null,
      quantity: it.quantity,
      unit_price: it.price,
    }));
    await (supabase as any).from("order_items").insert(itemRows);

    // ── 4. Cash on delivery → done ──
    if (payment_method === "cod") {
      return NextResponse.json({
        ok: true,
        order_id: order.id,
        order_number: order.order_number,
        total: order.total_amount,
      });
    }

    // ── 5. Paymob flow ──
    const { authenticate, createOrder, getPaymentKey, iframeUrl } = await import("@/lib/paymob");
    const integrationId =
      payment_method === "paymob_wallet"
        ? process.env.PAYMOB_INTEGRATION_WALLET
        : process.env.PAYMOB_INTEGRATION_CARD;

    if (!process.env.PAYMOB_API_KEY || !integrationId) {
      return NextResponse.json({
        ok: true,
        order_id: order.id,
        order_number: order.order_number,
        total: order.total_amount,
        warning: "paymob_not_configured",
      });
    }

    const amountCents = Math.round(Number(total) * 100);
    const token = await authenticate();
    const pOrder = await createOrder(
      token,
      amountCents,
      items.map((it: any) => ({
        name: String(it.name).slice(0, 40),
        amount_cents: Math.round(Number(it.price) * 100),
        quantity: Number(it.quantity),
        description: "",
      })),
      String(order.order_number),
    );

    const [first, ...rest] = String(customer.name).split(" ");
    const billing = {
      first_name: first || "Customer",
      last_name: rest.join(" ") || ".",
      email: customer.email || "noreply@yallastore.com",
      phone_number: customer.phone,
      street: customer.address,
      city: customer.city,
      country: "EG",
      state: customer.area || "NA",
      apartment: "NA",
      floor: "NA",
      building: "NA",
      postal_code: "NA",
    };

    const paymentKey = await getPaymentKey(token, amountCents, pOrder.id, integrationId!, billing);

    await (supabase as any)
      .from("orders")
      .update({ paymob_order_id: String(pOrder.id) })
      .eq("id", order.id);

    return NextResponse.json({
      ok: true,
      order_id: order.id,
      order_number: order.order_number,
      total: order.total_amount,
      iframe_url: iframeUrl(paymentKey),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "unhandled", detail: String(err?.message || err) },
      { status: 500 },
    );
  }
}