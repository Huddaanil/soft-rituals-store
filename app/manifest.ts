import type { MetadataRoute } from "next";

// Web app manifest — makes the shop installable (Add to Home screen) and is
// the base for the Android (Play Store) wrapper app.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Soft Rituals",
    short_name: "Soft Rituals",
    description:
      "Velas e sabonetes artesanais de Maputo, Moçambique. Pequenos rituais, grande calma.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FBF7F0",
    theme_color: "#B8690E",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
