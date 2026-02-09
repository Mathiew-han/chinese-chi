import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export const locales = ["en", "zh-CN", "zh-TW", "pt"] as const;
export type Locale = (typeof locales)[number];

export function normalizeLocale(value: string | null | undefined): Locale | null {
  if (!value) return null;
  if ((locales as readonly string[]).includes(value)) return value as Locale;
  const lower = value.toLowerCase();
  const match = locales.find((it) => it.toLowerCase() === lower);
  return match ?? null;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const normalizedLocale = normalizeLocale(locale);
  if (!normalizedLocale) notFound();

  return {
    locale: normalizedLocale,
    messages: (await import(`../../messages/${normalizedLocale}.json`)).default,
  };
});
