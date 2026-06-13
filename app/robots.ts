import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ssoftrituals.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/pt/checkout", "/en/checkout", "/pt/order/", "/en/order/"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
