import { PRODUCTS, CATEGORIES, type Product, type Category } from "@/lib/products";
import { supabase } from "@/lib/supabase";

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
};

function fromRow(r: ProductRow): Product {
  return {
    slug: r.slug,
    name: r.name,
    category: r.category,
    price: r.price,
    image: r.image,
    alt: r.alt,
    short: r.short,
    story: r.story ?? [],
    notes: r.notes ?? [],
    featured: r.featured,
    seoTitle: r.seo_title,
    seoDescription: r.seo_description,
  };
}

// Reads the catalog from Supabase; falls back to the bundled catalog
// if the table is missing or the network hiccups, so the shop never
// shows an empty shelf. Pass includeInactive for the owner panel.
export async function getProducts(
  { includeInactive = false }: { includeInactive?: boolean } = {}
): Promise<Product[]> {
  try {
    let query = supabase()
      .from("store_products")
      .select(
        "slug,name,category,price,image,alt,short,story,notes,featured,active,seo_title,seo_description,created_at"
      );
    if (!includeInactive) query = query.eq("active", true);
    const { data, error } = await query;
    if (error || !data || data.length === 0) return PRODUCTS;
    const order = new Map(PRODUCTS.map((p, i) => [p.slug, i]));
    return (data as (ProductRow & { created_at: string })[])
      .map(fromRow)
      .sort(
        (a, b) => (order.get(a.slug) ?? 999) - (order.get(b.slug) ?? 999)
      );
  } catch {
    return PRODUCTS;
  }
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const all = await getProducts({ includeInactive: true });
  return all.find((p) => p.slug === slug);
}

type CategoryRow = { slug: string; name: string; blurb: string; sort: number };

// Reads the shop's sections from Supabase, falling back to the bundled
// list so the shop never loses its navigation.
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase()
      .from("store_categories")
      .select("slug,name,blurb,sort")
      .eq("active", true)
      .order("sort", { ascending: true });
    if (error || !data || data.length === 0) return CATEGORIES;
    return (data as CategoryRow[]).map((c) => ({
      slug: c.slug,
      name: c.name,
      blurb: c.blurb,
    }));
  } catch {
    return CATEGORIES;
  }
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  const all = await getCategories();
  return all.find((c) => c.slug === slug);
}
