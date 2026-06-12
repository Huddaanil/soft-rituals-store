import type { MetadataRoute } from "next";
import { PRODUCTS, CATEGORIES } from "@/lib/products";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ssoftrituals.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const statics = ["", "/shop", "/about", "/delivery", "/contact"].map(
    (path) => ({
      url: `${BASE}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })
  );
  const categories = CATEGORIES.map((c) => ({
    url: `${BASE}/shop?category=${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
  const products = PRODUCTS.map((p) => ({
    url: `${BASE}/products/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  return [...statics, ...categories, ...products];
}
