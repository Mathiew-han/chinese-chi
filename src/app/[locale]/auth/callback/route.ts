import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeLocale } from "@/i18n/request";

function safeNextPath(value: string | null, fallback: string): string {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  return value;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const pathSegments = pathname.split("/");
  const localeFromPath = normalizeLocale(pathSegments[1] ?? null) ?? "en";

  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const typeRaw = url.searchParams.get("type");
  const type: "magiclink" | "recovery" | "invite" | "signup" | "email_change" =
    typeRaw === "magiclink" ||
    typeRaw === "recovery" ||
    typeRaw === "invite" ||
    typeRaw === "signup" ||
    typeRaw === "email_change"
      ? typeRaw
      : "magiclink";
  const next = safeNextPath(url.searchParams.get("next"), `/${localeFromPath}/dashboard`);

  const authUrl = new URL(`/${localeFromPath}/auth`, url.origin);

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.redirect(authUrl);
  }

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash
      ? await supabase.auth.verifyOtp({
          type,
          token_hash: tokenHash,
        })
      : { error: new Error("Missing code or token_hash") };

  if (!error) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
      });
    }

    return NextResponse.redirect(new URL(next, url.origin));
  }

  return NextResponse.redirect(authUrl);
}
