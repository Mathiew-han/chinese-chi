"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/navigation";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";

import logo from "../../images/icachi-logo-dark.svg";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ hasSupabase }: { hasSupabase: boolean }) {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const idleTimer = useRef<number | null>(null);

  const PRIMARY_LINKS = [
    { href: "/", label: t("home") },
    { href: "/cfp", label: t("authors") },
    { href: "/registration", label: t("attend") },
    { href: "/program", label: t("program") },
    { href: "/committees", label: t("committee") },
    { href: "/sponsors", label: t("sponsorship") },
  ];

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      const goingDown = current > lastScrollY.current;
      const nearTop = current <= 12;

      if (nearTop) {
        setHidden(false);
      } else if (goingDown) {
        setHidden(true);
        setMobileMenuOpen(false);
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
      <div className="mx-auto max-w-6xl px-4 pt-3">
        <div className="flex items-center justify-between gap-4 px-2 py-2">
          <Link
            href="/"
            className="flex items-center gap-3 text-black/85 drop-shadow-sm dark:text-white/85"
          >
            <Image
              src={logo}
              alt="ICACHI"
              width={184}
              height={48}
              priority
              className="h-8 w-auto dark:invert"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-x-1 lg:flex">
            {PRIMARY_LINKS.map((it) => {
              const active = isActivePath(pathname, it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={
                    active
                      ? "px-2 py-1 text-sm font-semibold text-black/90 dark:text-white/90"
                      : "px-2 py-1 text-sm text-black/65 hover:text-black/90 dark:text-white/65 dark:hover:text-white/90"
                  }
                >
                  {it.label}
                </Link>
              );
            })}

            <div className="mx-2 h-4 w-px bg-black/10 dark:bg-white/15" />

            {hasSupabase ? (
              <div className="flex items-center gap-1">
                <Link
                  href="/dashboard"
                  className={
                    isActivePath(pathname, "/dashboard")
                      ? "px-2 py-1 text-sm font-semibold text-black/90 dark:text-white/90"
                      : "px-2 py-1 text-sm text-black/65 hover:text-black/90 dark:text-white/65 dark:hover:text-white/90"
                  }
                >
                  {t("portal")}
                </Link>
                <Link
                  href="/auth"
                  className={
                    isActivePath(pathname, "/auth")
                      ? "px-2 py-1 text-sm font-semibold text-black/90 dark:text-white/90"
                      : "px-2 py-1 text-sm text-black/65 hover:text-black/90 dark:text-white/65 dark:hover:text-white/90"
                  }
                >
                  {t("signin")}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-1 opacity-40">
                <span className="px-3 py-1.5 text-sm font-medium">{t("portal")}</span>
                <span className="px-3 py-1.5 text-sm font-medium">{t("signin")}</span>
              </div>
            )}

            <div className="mx-2 h-4 w-px bg-black/10 dark:bg-white/15" />
            <LanguageSwitcher />
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-md p-1 text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/5"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="mt-2 border-t border-black/10 bg-transparent dark:border-white/10 lg:hidden">
            <nav className="flex flex-col px-2 py-3">
              {PRIMARY_LINKS.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-2 py-2 text-base font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${
                    isActivePath(pathname, it.href)
                      ? "font-bold text-black dark:text-white"
                      : "text-black/70 dark:text-white/70"
                  }`}
                >
                  {it.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-black/10 dark:bg-white/10" />
              {hasSupabase ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-2 py-2 text-base font-medium text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/5"
                  >
                    {t("portal")}
                  </Link>
                  <Link
                    href="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-2 py-2 text-base font-medium text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/5"
                  >
                    {t("signin")}
                  </Link>
                </>
              ) : (
                <>
                  <span className="px-2 py-2 text-base font-medium text-black/30 dark:text-white/30">{t("portal")}</span>
                  <span className="px-2 py-2 text-base font-medium text-black/30 dark:text-white/30">{t("signin")}</span>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
