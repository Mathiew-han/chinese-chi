"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import logo from "../../images/icachi-logo-dark.svg";

const PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/cfp", label: "For Authors" },
  { href: "/registration", label: "Attend" },
  { href: "/program", label: "Program" },
  { href: "/committees", label: "Committee" },
  { href: "/sponsors", label: "Sponsorship" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ hasSupabase }: { hasSupabase: boolean }) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const idleTimer = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      const goingDown = current > lastScrollY.current;
      const nearTop = current <= 12;

      if (nearTop) {
        setHidden(false);
      } else if (goingDown) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScrollY.current = current;

      if (idleTimer.current) {
        window.clearTimeout(idleTimer.current);
      }

      idleTimer.current = window.setTimeout(() => {
        if (window.scrollY > 12) {
          setHidden(true);
        }
      }, 3000);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (idleTimer.current) {
        window.clearTimeout(idleTimer.current);
      }
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-20 transition-all duration-300 ease-out ${
        hidden ? "-translate-y-8 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 text-black/85 drop-shadow-sm dark:text-white/85"
          >
            <Image
              src={logo}
              alt="ICACHI"
              width={132}
              height={34}
              priority
              className="h-6 w-auto dark:invert"
            />
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-x-3 gap-y-2 text-sm">
            {PRIMARY_LINKS.map((it) => {
              const active = isActivePath(pathname, it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={
                    active
                      ? "px-2 py-1 font-semibold text-black/90 transition-transform duration-300 ease-out will-change-transform dark:text-white/90 sm:scale-110"
                      : "px-2 py-1 text-black/70 transition-all duration-300 ease-out hover:text-black/90 dark:text-white/70 dark:hover:text-white/90"
                  }
                >
                  {it.label}
                </Link>
              );
            })}

            <span className="mx-1 hidden h-4 w-px bg-black/10 dark:bg-white/15 sm:inline" />

            {hasSupabase ? (
              <>
                <Link
                  href="/dashboard"
                  className={
                    isActivePath(pathname, "/dashboard")
                      ? "px-2 py-1 font-semibold text-black/90 transition-transform duration-300 ease-out will-change-transform dark:text-white/90 sm:scale-110"
                      : "px-2 py-1 text-black/70 transition-all duration-300 ease-out hover:text-black/90 dark:text-white/70 dark:hover:text-white/90"
                  }
                >
                  Portal
                </Link>
                <Link
                  href="/auth"
                  className={
                    isActivePath(pathname, "/auth")
                      ? "px-2 py-1 font-semibold text-black/90 transition-transform duration-300 ease-out will-change-transform dark:text-white/90 sm:scale-110"
                      : "px-2 py-1 text-black/70 transition-all duration-300 ease-out hover:text-black/90 dark:text-white/70 dark:hover:text-white/90"
                  }
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                <span className="select-none px-2 py-1 text-black/40 dark:text-white/35" title="Missing Supabase env">
                  Portal
                </span>
                <span className="select-none px-2 py-1 text-black/40 dark:text-white/35" title="Missing Supabase env">
                  Sign in
                </span>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
