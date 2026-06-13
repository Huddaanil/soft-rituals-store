import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, computeToken } from "@/lib/admin-token";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

// Pass the request through, tagging it with the locale so the root
// layout can set <html lang> correctly.
function passWithLocale(req: NextRequest, locale: string) {
  const headers = new Headers(req.headers);
  headers.set("x-locale", locale);
  return NextResponse.next({ request: { headers } });
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Owner panel: not localized (English tool); keep the auth gate.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (pathname === "/admin/login") return passWithLocale(req, "en");
    const pw = process.env.ADMIN_PASSWORD;
    const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
    const okToken = pw ? await computeToken(pw) : null;
    if (pw && cookie && cookie === okToken) return passWithLocale(req, "en");
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Already under a locale?
  const seg = pathname.split("/")[1];
  if (seg === "pt" || seg === "en") return passWithLocale(req, seg);

  // Anything else → redirect to the default locale, keeping path + query.
  const url = req.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except Next internals, the SEO files, and static assets (paths with a dot).
  matcher: ["/((?!_next|api|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)"],
};
