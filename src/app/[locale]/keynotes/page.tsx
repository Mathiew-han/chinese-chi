import { Markdown } from "@/components/Markdown";
import { readSiteMarkdown } from "@/lib/site-content";

export default async function KeynotesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = await readSiteMarkdown("keynotes", locale);
  return (
    <div className="space-y-10">
      <Markdown content={content} />
      <section className="space-y-6">
        <div className="text-lg font-semibold tracking-wide text-black/85 dark:text-white/85">
          开幕与闭幕演讲（占位）
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass-panel px-6 py-6">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 dark:text-white/50">
              Opening Keynote
            </div>
            <div className="mt-2 text-lg font-semibold text-black/85 dark:text-white/85">
              演讲主题占位
            </div>
            <div className="mt-3 text-sm text-black/70 dark:text-white/70">
              Speaker Name · Institution / College
            </div>
            <div className="mt-3 text-sm text-black/70 dark:text-white/70">
              议题简介占位，强调大会主题与关键挑战。
            </div>
          </div>
          <div className="glass-panel px-6 py-6">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 dark:text-white/50">
              Closing Keynote
            </div>
            <div className="mt-2 text-lg font-semibold text-black/85 dark:text-white/85">
              演讲主题占位
            </div>
            <div className="mt-3 text-sm text-black/70 dark:text-white/70">
              Speaker Name · Institution / College
            </div>
            <div className="mt-3 text-sm text-black/70 dark:text-white/70">
              议题简介占位，回顾成果并提出未来方向。
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
