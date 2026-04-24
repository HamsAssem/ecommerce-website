/**
 * Supabase API helpers — reads live data from the "collections" + "products"
 * tables (the same ones your admin dashboard writes to).
 */
import { supabase } from "./supabase";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const BUCKET = "product-images";

// Convert image_path (stored in Supabase Storage) to a public URL.
function imgUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

function mapCategory(c: any) {
  return {
    id: c.id,
    name_ar: c.name_ar || c.name,
    name_en: c.name,
    slug: c.slug || "",
    image_url: c.image_url || "",
    created_at: c.created_at,
  };
}

function mapProduct(p: any) {
  return {
    id: p.id,
    name_ar: p.name_ar || p.name,
    name_en: p.name,
    slug: p.slug || String(p.id),
    description_ar: p.description_ar || p.description || "",
    description_en: p.description || "",
    price: Number(p.price) || 0,
    original_price: p.original_price ? Number(p.original_price) : null,
    image_url: imgUrl(p.image_path),
    images: p.images || [],
    category_id: p.collection_id,
    stock: p.quantity ?? 0,
    is_featured: !!p.is_featured,
    is_new: !!p.is_new,
    is_active: !!p.is_active,
    badge: p.badge || null,
    created_at: p.created_at,
    updated_at: p.updated_at || p.created_at,
    category: p.collections ? mapCategory(p.collections) : undefined,
  };
}

// ─── Categories (reads from "collections") ──────────────────────────────
export async function getCategories(): Promise<any[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  if (error) { console.error("getCategories:", error); return []; }
  return (data || []).map(mapCategory);
}

// ─── Products ───────────────────────────────────────────────────────────
export async function getAllProducts(): Promise<any[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, collections(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) { console.error("getAllProducts:", error); return []; }
  return (data || []).map(mapProduct);
}

export async function getFeaturedProducts(): Promise<any[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, collections(*)")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(8);
  if (error) { console.error("getFeaturedProducts:", error); return []; }
  return (data || []).map(mapProduct);
}

export async function getNewProducts(): Promise<any[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, collections(*)")
    .eq("is_active", true)
    .eq("is_new", true)
    .order("created_at", { ascending: false })
    .limit(8);
  if (error) { console.error("getNewProducts:", error); return []; }
  return (data || []).map(mapProduct);
}

export async function getProductsByCategory(slug: string): Promise<any[]> {
  const { data: col } = await supabase
    .from("collections")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (!col) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*, collections(*)")
    .eq("collection_id", (col as any).id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) { console.error("getProductsByCategory:", error); return []; }
  return (data || []).map(mapProduct);
}

export async function getProductById(id: string | number): Promise<any | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, collections(*)")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return mapProduct(data);
}

// ─── Orders ─────────────────────────────────────────────────────────────
interface PlaceOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  customerCity: string;
  customerArea?: string;
  customerNotes?: string;
  paymentMethod: string;
  items: Array<{ productId: string; quantity: number; price: number; name: string; image?: string }>;
  total: number;
  shippingFee?: number;
}

export async function placeOrder(input: PlaceOrderInput) {
  const { data: order, error } = await (supabase as any)
    .from("orders")
    .insert({
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      customer_email: input.customerEmail || null,
      customer_address: input.customerAddress,
      customer_city: input.customerCity,
      customer_area: input.customerArea || null,
      customer_notes: input.customerNotes || null,
      payment_method: input.paymentMethod,
      subtotal: input.total - (input.shippingFee || 0),
      shipping_fee: input.shippingFee || 0,
      total_amount: input.total,
      currency: "EGP",
      status: "pending",
      payment_status: input.paymentMethod === "cod" ? "unpaid" : "pending",
    })
    .select("id, order_number")
    .single();
  if (error || !order) { console.error("placeOrder:", error); return null; }

  await (supabase as any).from("order_items").insert(
    input.items.map((it) => ({
      order_id: order.id,
      product_id: it.productId,
      product_name: it.name,
      product_image: it.image || null,
      quantity: it.quantity,
      unit_price: it.price,
    }))
  );
  return order;
}