"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, computeToken } from "@/lib/admin-token";

export async function login(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return {
      error:
        "The owner panel isn't set up yet. The site owner needs to add an ADMIN_PASSWORD first.",
    };
  }
  if (!password || password !== expected) {
    return { error: "That password isn't right. Try again." };
  }

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, await computeToken(expected), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
