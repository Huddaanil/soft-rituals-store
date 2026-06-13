// Pure helper shared by middleware (edge) and server actions (node).
// No framework imports so it runs in both runtimes.
// The session cookie holds a hash of the admin password, never the
// password itself, so the cookie can't be turned back into the secret.
export async function computeToken(secret: string): Promise<string> {
  const data = new TextEncoder().encode(`${secret}::soft-rituals-admin-v1`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const ADMIN_COOKIE = "sr_admin";
