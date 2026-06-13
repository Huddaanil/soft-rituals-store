import type { MetadataRoute } from "next";
import { getProducts, getCategories } from "@/lib/catalog";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ssoftrituals.com";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const statics = ["", "/shop", "/about", "/delivery", "/contact"].map(
    (path) => ({
      url: `${BASE}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })
  );
  const cats = categories.map((c) => ({
    url: `${BASE}/shop?category=${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
  const prods = products.map((p) => ({
    url: `${BASE}/products/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  return [...statics, ...cats, ...prods];
}
