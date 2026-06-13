import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only client using the SERVICE ROLE key. This bypasses row-level
// security, so it must NEVER be imported into client components and the
// key must only ever live in a server env var (never NEXT_PUBLIC_*).
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://famgmcdoximypahdbqzn.supabase.co";

let client: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to the Vercel project's Environment Variables."
    );
  }
  if (!client) {
    client = createClient(SUPABASE_URL, key, {
      auth: { persistSession: false },
    });
  }
  return client;
}

export const IMAGE_BUCKET = "product-images";

export function publicImageUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${path}`;
}

export type AdminProductRow = {
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
  alt: string;
  short: string;
  story: string[];
  notes: string[];
  featured: boolean;
  active: boolean;
  seo_title: string;
  seo_description: string;
  name_pt?: string | null;
  short_pt?: string | null;
  story_pt?: string[] | null;
  notes_pt?: string[] | null;
  alt_pt?: string | null;
  seo_title_pt?: string | null;
  seo_description_pt?: string | null;
  cost_ref?: string | null;
};

// A product from the Business App's costing data (records/state/main).
export type CostingProduct = {
  id: string;
  name: string;
  type?: string;
  price: number;
};

export type AdminCategoryRow = {
  slug: string;
  name: string;
  blurb: string;
  sort: number;
  active: boolean;
  name_pt?: string | null;
  blurb_pt?: string | null;
};

const PRODUCT_PT =
  "name_pt,short_pt,story_pt,notes_pt,alt_pt,seo_title_pt,seo_description_pt,cost_ref";

const PRODUCT_BASE =
  "slug,name,category,price,image,alt,short,story,notes,featured,active,seo_title,seo_description";

// Passing the column list as a plain string (not a literal) keeps the two
// fallback queries the same TS type, so we can try-then-fallback cleanly.
export async function adminListProducts(): Promise<AdminProductRow[]> {
  const q = (cols: string) =>
    supabaseAdmin()
      .from("store_products")
      .select(cols)
      .order("created_at", { ascending: true });
  let res = await q(`${PRODUCT_BASE},created_at,${PRODUCT_PT}`);
  if (res.error) res = await q(`${PRODUCT_BASE},created_at`);
  if (res.error) throw new Error(res.error.message);
  return (res.data ?? []) as unknown as AdminProductRow[];
}

export async function adminGetProduct(
  slug: string
): Promise<AdminProductRow | null> {
  const q = (cols: string) =>
    supabaseAdmin().from("store_products").select(cols).eq("slug", slug).maybeSingle();
  let res = await q(`${PRODUCT_BASE},${PRODUCT_PT}`);
  if (res.error) res = await q(PRODUCT_BASE);
  if (res.error) throw new Error(res.error.message);
  return (res.data as unknown as AdminProductRow) ?? null;
}

export async function adminListCategories(): Promise<AdminCategoryRow[]> {
  const q = (cols: string) =>
    supabaseAdmin().from("store_categories").select(cols).order("sort", { ascending: true });
  let res = await q("slug,name,blurb,sort,active,name_pt,blurb_pt");
  if (res.error) res = await q("slug,name,blurb,sort,active");
  if (res.error) throw new Error(res.error.message);
  return (res.data ?? []) as unknown as AdminCategoryRow[];
}

// Reads the Business App's products (and their calculated "Selling price each")
// out of its single cloud state record. Returns [] if the app has no data yet.
// Service-role only, so it can read the app's records past row-level security.
export async function adminGetCostingProducts(): Promise<CostingProduct[]> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("records")
      .select("data")
      .eq("collection", "state")
      .eq("id", "main")
      .limit(1)
      .maybeSingle();
    if (error || !data) return [];
    const payload = (data as { data?: { makeProducts?: unknown } }).data;
    const list = Array.isArray(payload?.makeProducts) ? payload!.makeProducts : [];
    return (list as Array<Record<string, unknown>>)
      .filter((p) => p && typeof p.id === "string" && typeof p.name === "string")
      .map((p) => ({
        id: String(p.id),
        name: String(p.name),
        type: typeof p.type === "string" ? p.type : undefined,
        price: Number(p.price) || 0,
      }));
  } catch {
    return [];
  }
}
