import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;

/**
 * The publishable ("anon public") key — safe to ship in the browser bundle,
 * because everything it can do is bounded by the row level security policies
 * in supabase/schema.sql.
 *
 * Never put a `sb_secret_...` / service-role key here: this bundle is served
 * to every visitor, and a secret key bypasses row level security.
 */
const publishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * The app stays usable before Supabase is wired up — the gallery and the admin
 * show a setup notice instead of crashing on a missing client.
 */
export const isSupabaseConfigured = Boolean(url && publishableKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, publishableKey)
  : null;

export const PRINT_IMAGES_BUCKET = "print-images";

export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Copy .env.example to .env and fill in " +
        "VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
    );
  }
  return supabase;
}
