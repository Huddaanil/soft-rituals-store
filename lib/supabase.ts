import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// The URL and publishable key are public by design (they already ship
// in the Soft Rituals team app's HTML). All protection comes from
// row-level security: products are read-only, orders are write-only.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://famgmcdoximypahdbqzn.supabase.co";
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_nH3UIomo6dHa4dligNiukQ_OjuOCMN_";

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
    });
  }
  return client;
}
