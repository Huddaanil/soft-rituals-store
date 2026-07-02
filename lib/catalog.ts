import { cache } from "react";
import { PRODUCTS, CATEGORIES, type Product, type Category } from "@/lib/products";
import { supabase } from "@/lib/supabase";
import {
  adminGetCostingProducts,
  type CostingProduct,
} from "@/lib/supabaseAdmin";
import type { Locale } from "@/lib/i18n/config";

const BASE_COLS =
  "slug,name,category,price,image,alt,short,story,notes,featured,active,seo_title,seo_description,created_at";
const PT_COLS =
  "name_pt,short_pt,story_pt,notes_pt,alt_pt,seo_title_pt,seo_description_pt,cost_ref";

type ProductRow = {
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
  active?: boolean;
  seo_title: string;
  seo_description: string;
  // optional PT columns (may not exist before the migration runs)
  name_pt?: string | null;
  short_pt?: string | null;
  story_pt?: string[] | null;
  notes_pt?: string[] | null;
  alt_pt?: string | null;
  seo_title_pt?: string | null;
  seo_description_pt?: string | null;
  cost_ref?: string | null;
};

// Linked products (cost_ref) take their name and price LIVE from the
// Business App, so Samira edits them in one place and the shop follows.
// Cached per request; on any failure the shop falls back to its own columns.
const getCostingById = cache(
  async (): Promise<Map<string, CostingProduct>> => {
    const list = await adminGetCostingProducts();
    return new Map(list.map((c) => [c.id, c]));
  }
);

const pick = <T,>(pt: T | null | undefined, en: T): T =>
  pt === null || pt === undefined || (typeof pt === "string" && pt.trim() === "")
    ? en
    : pt;

function fromRow(
  r: ProductRow,
  locale: Locale,
  linked?: CostingProduct
): Product {
  const isPt = locale === "pt";
  return {
    slug: r.slug,
    name: linked?.name ?? (isPt ? pick(r.name_pt, r.name) : r.name),
    category: r.category,
    price: linked && linked.price > 0 ? linked.price : r.price,
    image: r.image,
    alt: isPt ? pick(r.alt_pt, r.alt) : r.alt,
    short: isPt ? pick(r.short_pt, r.short) : r.short,
    story: isPt ? pick(r.story_pt?.length ? r.story_pt : null, r.story) : r.story,
    notes: isPt ? pick(r.notes_pt?.length ? r.notes_pt : null, r.notes) : r.notes,
    featured: r.featured,
    seoTitle: isPt ? pick(r.seo_title_pt, r.seo_title) : r.seo_title,
    seoDescription: isPt
      ? pick(r.seo_description_pt, r.seo_description)
      : r.seo_description,
  };
}

// Try the PT-aware select; if the _pt columns don't exist yet (pre-migration),
// fall back to the base columns so the shop keeps working in English.
async function selectProducts(includeInactive: boolean): Promise<ProductRow[] | null> {
  const run = async (cols: string) => {
    let q = supabase().from("store_products").select(cols);
    if (!includeInactive) q = q.eq("active", true);
    return q;
  };
  let res = await run(`${BASE_COLS},${PT_COLS}`);
  if (res.error) res = await run(BASE_COLS);
  if (res.error || !res.data || res.data.length === 0) return null;
  return res.data as unknown as ProductRow[];
}

export async function getProducts(
  locale: Locale,
  { includeInactive = false }: { includeInactive?: boolean } = {}
): Promise<Product[]> {
  try {
    const rows = await selectProducts(includeInactive);
    if (!rows) return PRODUCTS;
    const anyLinked = rows.some((r) => r.cost_ref);
    const costing = anyLinked ? await getCostingById() : null;
    const order = new Map(PRODUCTS.map((p, i) => [p.slug, i]));
    return rows
      .map((r) =>
        fromRow(r, locale, r.cost_ref ? costing?.get(r.cost_ref) : undefined)
      )
      .sort((a, b) => (order.get(a.slug) ?? 999) - (order.get(b.slug) ?? 999));
  } catch {
    return PRODUCTS;
  }
}

export async function getProductBySlug(
  slug: string,
  locale: Locale
): Promise<Product | undefined> {
  const all = await getProducts(locale, { includeInactive: true });
  return all.find((p) => p.slug === slug);
}

type CategoryRow = {
  slug: string;
  name: string;
  blurb: string;
  sort: number;
  name_pt?: string | null;
  blurb_pt?: string | null;
};

export async function getCategories(locale: Locale): Promise<Category[]> {
  const isPt = locale === "pt";
  const run = (cols: string) =>
    supabase()
      .from("store_categories")
      .select(cols)
      .eq("active", true)
      .order("sort", { ascending: true });
  try {
    let res = await run("slug,name,blurb,sort,name_pt,blurb_pt");
    if (res.error) res = await run("slug,name,blurb,sort");
    if (res.error || !res.data || res.data.length === 0) return CATEGORIES;
    return (res.data as unknown as CategoryRow[]).map((c) => ({
      slug: c.slug,
      name: isPt ? pick(c.name_pt, c.name) : c.name,
      blurb: isPt ? pick(c.blurb_pt, c.blurb) : c.blurb,
    }));
  } catch {
    return CATEGORIES;
  }
}

export async function getCategoryBySlug(
  slug: string,
  locale: Locale
): Promise<Category | undefined> {
  const all = await getCategories(locale);
  return all.find((c) => c.slug === slug);
}
