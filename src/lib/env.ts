export function getEnv(name: string): string | undefined {
  if (name === "NEXT_PUBLIC_SUPABASE_URL") {
    const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (typeof value !== "string" || value.length === 0) return undefined;
    return value;
  }
  if (name === "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
    const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (typeof value !== "string" || value.length === 0) return undefined;
    return value;
  }

  const value = process.env[name];
  if (typeof value !== "string" || value.length === 0) return undefined;
  return value;
}

export function requireEnv(name: string): string {
  const value = getEnv(name);
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}
