import { PRODUCTS, type Product } from "@/lib/products";
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
// shows an empty shelf.
export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase()
      .from("store_products")
      .select(
        "slug,name,category,price,image,alt,short,story,notes,featured,seo_title,seo_description"
      )
      .eq("active", true);
    if (error || !data || data.length === 0) return PRODUCTS;
    const order = new Map(PRODUCTS.map((p, i) => [p.slug, i]));
    return (data as ProductRow[])
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
  const all = await getProducts();
  return all.find((p) => p.slug === slug);
}
