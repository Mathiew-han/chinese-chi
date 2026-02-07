"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/SiteHeader";

export function SiteShell({
  children,
  hasSupabase,
}: {
  children: ReactNode;
  hasSupabase: boolean;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const topSegment = pathname.split("/")[1] || "";
  const titleMap: Record<string, string> = {
    about: "About ICHEC 2026",
    "important-dates": "Important Dates",
    cfp: "For Authors",
    keynotes: "Keynotes",
    program: "Program",
    registration: "Attend",
    venue: "Venue",
    committees: "Committee",
    sponsors: "Sponsorship",
    news: "News",
    dashboard: "Dashboard",
    admin: "Admin",
    auth: "Sign in",
  };
  const heroTitle = titleMap[topSegment] ?? "ICHEC 2026";

  return (
    <div className="relative min-h-dvh flex flex-col">
      <div
        className={`site-poster${isHome ? "" : " site-poster-compact"}`}
        aria-hidden="true"
      >
        <span className="ripple-overlay" />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col">
        <SiteHeader hasSupabase={hasSupabase} />

        <main className="flex-1 pt-8 sm:pt-12">
          {isHome ? (
            children
          ) : (
          <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6">
              <section className="flex min-h-[calc(40vh-96px)] min-h-[calc(40dvh-96px)] flex-col items-center justify-center text-center">
                <div className="text-sm font-semibold tracking-wide text-black/70 dark:text-white/70">
                  ICHEC 2026
                </div>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-black/85 dark:text-white/85 sm:text-4xl">
                  {heroTitle}
                </h1>
                <div className="mt-4 h-px w-[min(420px,82vw)] bg-black/20 dark:bg-white/20" />
                <div className="mt-4 text-sm font-medium text-black/70 dark:text-white/70">
                  November 23–26, 2026 · Wynn Palace · Macau SAR, China
                </div>
              </section>
            <div className="w-full mt-10 sm:mt-14">{children}</div>
            </div>
          )}
        </main>

        <footer className="pb-10">
          <div className="mx-auto max-w-6xl px-4">
          <div className="glass-panel px-6 py-6 text-center text-sm">
              <p className="opacity-80">&copy; 2026 Chinese CHI. All rights reserved.</p>
              <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2">
                <Link href="#" className="site-nav-link">
                  Privacy Policy
                </Link>
                <Link href="#" className="site-nav-link">
                  Terms of Service
                </Link>
                <Link href="#" className="site-nav-link">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
