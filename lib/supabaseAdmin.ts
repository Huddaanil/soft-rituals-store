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
};

export type AdminCategoryRow = {
  slug: string;
  name: string;
  blurb: string;
  sort: number;
  active: boolean;
};

export async function adminListProducts(): Promise<AdminProductRow[]> {
  const { data, error } = await supabaseAdmin()
    .from("store_products")
    .select(
      "slug,name,category,price,image,alt,short,story,notes,featured,active,seo_title,seo_description,created_at"
    )
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminProductRow[];
}

export async function adminGetProduct(
  slug: string
): Promise<AdminProductRow | null> {
  const { data, error } = await supabaseAdmin()
    .from("store_products")
    .select(
      "slug,name,category,price,image,alt,short,story,notes,featured,active,seo_title,seo_description"
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as AdminProductRow) ?? null;
}

export async function adminListCategories(): Promise<AdminCategoryRow[]> {
  const { data, error } = await supabaseAdmin()
    .from("store_categories")
    .select("slug,name,blurb,sort,active")
    .order("sort", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminCategoryRow[];
}
