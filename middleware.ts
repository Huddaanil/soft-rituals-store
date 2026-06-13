import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, computeToken } from "@/lib/admin-token";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The login page must stay reachable while signed out.
  if (pathname === "/admin/login") return NextResponse.next();

  const pw = process.env.ADMIN_PASSWORD;
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  const okToken = pw ? await computeToken(pw) : null;

  if (pw && cookie && cookie === okToken) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
