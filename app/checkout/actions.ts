"use server";

import { cookies } from "next/headers";
import { getProducts } from "@/lib/catalog";
import { supabase } from "@/lib/supabase";

export type PlaceOrderInput = {
  name: string;
  phone: string;
  email?: string;
  deliveryArea: string;
  note?: string;
  items: { slug: string; qty: number }[];
  locale?: "pt" | "en";
};

export type PlaceOrderResult =
  | { ok: true; orderNumber: string; redirectUrl?: string }
  | { ok: false; error: string };

function makeOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `SR-${stamp}${rand}`;
}

export async function placeOrder(
  input: PlaceOrderInput
): Promise<PlaceOrderResult> {
  const name = (input.name ?? "").trim();
  const phone = (input.phone ?? "").trim();
  const email = (input.email ?? "").trim();
  const deliveryArea = (input.deliveryArea ?? "").trim();
  const note = (input.note ?? "").trim();

  if (name.length < 2) return { ok: false, error: "Please tell us your name." };
  if (!/^[+0-9 ()-]{7,20}$/.test(phone))
    return { ok: false, error: "Please enter a phone number we can reach you on." };
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return { ok: false, error: "That email doesn't look right — check it or leave it empty." };
  if (!deliveryArea)
    return { ok: false, error: "Please choose a delivery area." };
  if (!Array.isArray(input.items) || input.items.length === 0)
    return { ok: false, error: "Your cart is empty." };

  const locale = input.locale === "en" ? "en" : "pt";

  // Prices come from the catalog, never from the client.
  const catalog = await getProducts(locale);
  const lines: { slug: string; name: string; price: number; qty: number }[] = [];
  for (const item of input.items) {
    const product = catalog.find((p) => p.slug === item.slug);
    const qty = Math.floor(Number(item.qty));
    if (!product || !Number.isFinite(qty) || qty < 1 || qty > 99)
      return { ok: false, error: "Something in the cart is no longer available. Please refresh." };
    lines.push({ slug: product.slug, name: product.name, price: product.price, qty });
  }
  const total = lines.reduce((n, l) => n + l.price * l.qty, 0);

  const orderNumber = makeOrderNumber();
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const paymentMethod = stripeKey ? "card_pending" : "pay_on_delivery";

  const { error: dbError } = await supabase().from("store_orders").insert({
    order_number: orderNumber,
    customer_name: name,
    phone,
    email: email || null,
    delivery_area: deliveryArea,
    note: note || null,
    items: lines,
    total_mzn: total,
    payment_method: paymentMethod,
    status: "new",
  });

  if (dbError) {
    console.error("Order insert failed:", dbError.message);
    return {
      ok: false,
      error:
        "We couldn't record your order online just now. Please DM us on Instagram @ssoft.rituals and we'll take it personally.",
    };
  }

  const jar = await cookies();
  jar.set(
    "sr_last_order",
    JSON.stringify({
      number: orderNumber,
      name,
      total,
      payment: paymentMethod,
      items: lines.map((l) => ({ name: l.name, qty: l.qty, price: l.price })),
    }),
    { maxAge: 60 * 60, path: "/", sameSite: "lax" }
  );

  // Stripe test-mode path — activates automatically once
  // STRIPE_SECRET_KEY exists in the environment.
  if (stripeKey) {
    try {
      const { default: Stripe } = await import("stripe");
      const stripe = new Stripe(stripeKey);
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: lines.map((l) => ({
          quantity: l.qty,
          price_data: {
            currency: "mzn",
            unit_amount: l.price * 100,
            product_data: { name: l.name },
          },
        })),
        success_url: `${siteUrl}/${locale}/order/${orderNumber}?paid=1`,
        cancel_url: `${siteUrl}/${locale}/checkout`,
        metadata: { order_number: orderNumber },
      });
      if (session.url)
        return { ok: true, orderNumber, redirectUrl: session.url };
    } catch (e) {
      console.error("Stripe session failed; falling back to demo flow:", e);
    }
  }

  return { ok: true, orderNumber };
}
