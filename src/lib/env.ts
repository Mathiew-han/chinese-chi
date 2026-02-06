export function getEnv(name: string): string | undefined {
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

