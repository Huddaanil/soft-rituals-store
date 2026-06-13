import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { notifyTelegram } from "@/lib/notify";

export type HandoffLine = { slug: string; name: string; price: number; qty: number };

const mt = (n: number) => `${n.toLocaleString("en-US").replace(/,/g, " ")} MT`;
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// After a web order is saved, (1) mirror it into the `records` table so the
// Business App can read it under its members row-level security (carrying the
// cost_ref link so each line maps to an app product), and (2) send a Telegram
// alert. Both are best-effort: a failure here never affects the customer,
// whose order is already stored in store_orders.
export async function handoffWebOrder(order: {
  orderNumber: string;
  name: string;
  phone: string;
  deliveryArea: string;
  note: string;
  lines: HandoffLine[];
  total: number;
  paymentMethod: string;
}): Promise<void> {
  try {
    const admin = supabaseAdmin();

    // The single business that owns the data.
    const { data: biz } = await admin.from("businesses").select("id").limit(1).maybeSingle();
    const businessId = (biz as { id?: string } | null)?.id ?? null;

    // Map each ordered shop product to its linked Business-App product (cost_ref).
    const slugs = order.lines.map((l) => l.slug);
    const refMap = new Map<string, string | null>();
    try {
      const { data: rows } = await admin
        .from("store_products")
        .select("slug,cost_ref")
        .in("slug", slugs);
      (rows as Array<{ slug: string; cost_ref: string | null }> | null)?.forEach((r) =>
        refMap.set(r.slug, r.cost_ref ?? null)
      );
    } catch {
      // cost_ref column may not exist yet — links just stay null.
    }

    const items = order.lines.map((l) => ({
      slug: l.slug,
      name: l.name,
      qty: l.qty,
      price: l.price,
      costRef: refMap.get(l.slug) ?? null,
    }));

    if (businessId) {
      await admin.from("records").upsert(
        {
          business_id: businessId,
          collection: "weborder",
          id: order.orderNumber,
          data: {
            order_number: order.orderNumber,
            source: "web",
            status: "new",
            customer: order.name,
            phone: order.phone,
            delivery_area: order.deliveryArea,
            note: order.note || "",
            items,
            total_mzn: order.total,
            payment_method: order.paymentMethod,
            created_at: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "business_id,collection,id" }
      );
    }

    const lineText = order.lines
      .map((l) => `• ${l.qty}× ${esc(l.name)}`)
      .join("\n");
    await notifyTelegram(
      `🕯️ <b>New website order</b> ${esc(order.orderNumber)}\n` +
        `${lineText}\n` +
        `<b>Total: ${mt(order.total)}</b>\n` +
        `${esc(order.name)} · ${esc(order.phone)}\n` +
        `Delivery: ${esc(order.deliveryArea)}` +
        (order.note ? `\nNote: ${esc(order.note)}` : "")
    );
  } catch (e) {
    console.error("Order handoff (mirror/notify) failed; order is still saved:", e);
  }
}
