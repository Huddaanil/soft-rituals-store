import type { MetadataRoute } from "next";
import { getProducts, getCategories } from "@/lib/catalog";
import { LOCALES } from "@/lib/i18n/config";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ssoftrituals.com";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Slugs are locale-independent; read once.
  const [products, categories] = await Promise.all([
    getProducts("pt"),
    getCategories("pt"),
  ]);

  const paths = [
    "",
    "/shop",
    "/about",
    "/delivery",
    "/contact",
    "/privacy",
    ...categories.map((c) => `/shop?category=${c.slug}`),
    ...products.map((p) => `/products/${p.slug}`),
  ];

  const entries: MetadataRoute.Sitemap = [];
  for (const path of paths) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}${path}`,
        changeFrequency: "weekly",
        priority: path === "" ? 1 : path.startsWith("/products") ? 0.8 : 0.6,
        alternates: {
          languages: {
            pt: `${BASE}/pt${path}`,
            en: `${BASE}/en${path}`,
          },
        },
      });
    }
  }
  return entries;
}
