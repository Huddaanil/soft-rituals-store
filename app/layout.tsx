import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ssoftrituals.com"
  ),
  title: {
    default: "Soft Rituals — Handcrafted candles and soaps, Maputo",
    template: "%s | Soft Rituals",
  },
  description:
    "Handcrafted candles and soaps from Maputo, Mozambique. Small rituals, big calm — for people who work too much.",
  openGraph: { siteName: "Soft Rituals", type: "website", images: ["/hero.jpg"] },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Middleware sets x-locale per request so the <html lang> matches the page.
  const lang = (await headers()).get("x-locale") || "pt";
  return (
    <html
      lang={lang}
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
