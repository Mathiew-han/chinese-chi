import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales, normalizeLocale } from "./i18n/request";
import { createServerClient } from "@supabase/ssr";

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
});

function getEnv(name: string): string | undefined {
  const value = process.env[name];
  if (typeof value !== "string" || value.length === 0) return undefined;
  return value;
}

export default async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !anonKey) {
    return response;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  let normalizedPathname = pathname;
  let currentLocale = "en";
  const pathSegments = pathname.split("/");
  const localeFromPath = pathSegments[1] ?? "";
  const normalizedFromPath = localeFromPath ? normalizeLocale(localeFromPath) : null;
  if (normalizedFromPath) {
    currentLocale = normalizedFromPath;
    const rest = pathSegments.slice(2).join("/");
    normalizedPathname = `/${rest}`.replace(/\/+$/, "") || "/";
  }

  if (normalizedPathname.startsWith("/dashboard") || normalizedPathname.startsWith("/admin")) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = `/${currentLocale}/auth`;
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (normalizedPathname.startsWith("/admin")) {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user?.id ?? "")
      .maybeSingle();

    if (error || !data || data.role !== "admin") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = `/${currentLocale}/dashboard`;
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
