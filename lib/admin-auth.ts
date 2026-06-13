import "server-only";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, computeToken } from "@/lib/admin-token";

export async function isAdmin(): Promise<boolean> {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const cookie = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!cookie) return false;
  return cookie === (await computeToken(pw));
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    throw new Error("Not authorised. Please sign in again.");
  }
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}
