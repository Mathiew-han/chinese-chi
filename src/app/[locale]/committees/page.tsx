import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import { Markdown } from "@/components/Markdown";
import { readSiteMarkdown } from "@/lib/site-content";

export default async function CommitteesPage({ params }: { params: Promise<{ locale: string }> }) {
  const t = await getTranslations("Common");
  const { locale } = await params;
  const content = await readSiteMarkdown("committees", locale);
  return (
    <div className="space-y-10">
      <Markdown content={content} />
      <section className="space-y-6">
        <div className="text-lg font-semibold tracking-wide text-black/85 dark:text-white/85">
          {t("organization")}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["General Chair", "Program Chair", "Workshops Chair", "Art & Demo Chair", "Local Chair", "Sponsorship Chair"].map((role) => (
            <div key={role} className="glass-panel px-6 py-6">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 dark:text-white/50">
                {role}
              </div>
              <div className="mt-3 text-base font-semibold text-black/80 dark:text-white/80">
                Name Placeholder
              </div>
              <div className="mt-1 text-sm text-black/65 dark:text-white/65">University / Lab</div>
              <div className="mt-3 text-sm">
                <Link href="#" className="underline underline-offset-4">
                  {t("homepage")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
