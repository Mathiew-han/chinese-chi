import { createBrowserClient } from "@supabase/ssr";

import { getEnv } from "@/lib/env";

export function createSupabaseBrowserClient() {
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !anonKey) return null;
  return createBrowserClient(url, anonKey);
}
