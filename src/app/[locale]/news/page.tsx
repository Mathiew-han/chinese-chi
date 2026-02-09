import Link from "next/link";
import { Markdown } from "@/components/Markdown";
import { readSiteMarkdown } from "@/lib/site-content";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type NewsRow = {
  id: string;
  title_zh: string;
  title_en: string;
  published_at: string | null;
  pinned: boolean;
};

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = await readSiteMarkdown("news", locale);

  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase
        .from("news")
        .select("id,title_zh,title_en,published_at,pinned")
        .order("pinned", { ascending: false })
        .order("published_at", { ascending: false })
    : { data: null };

  const rows = (data ?? []) as NewsRow[];

  return (
    <div className="space-y-10">
      <Markdown content={content} />
      {rows.length > 0 ? (
        <section className="space-y-4">
          <div className="text-lg font-semibold tracking-wide text-black/85 dark:text-white/85">
            Updates
          </div>
          <div className="rounded-lg border">
            <div className="divide-y">
              {rows.map((r) => (
                <div key={r.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="font-medium">
                      {locale.startsWith("zh") ? r.title_zh : r.title_en}
                    </div>
                    <div className="text-xs text-neutral-600 whitespace-nowrap">
                      {r.published_at ? new Date(r.published_at).toLocaleDateString() : ""}
                    </div>
                  </div>
                  {r.pinned ? (
                    <div className="mt-1 text-[10px] text-neutral-500">Pinned</div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <section className="space-y-6">
        <div className="text-lg font-semibold tracking-wide text-black/85 dark:text-white/85">
          AMA 午餐（示意）
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="glass-panel px-6 py-6 lg:col-span-2">
            <div className="text-sm font-semibold text-black/60 dark:text-white/60">
              Ask Me Anything Student Lunch
            </div>
            <div className="mt-2 text-sm text-black/75 dark:text-white/75">
              面向学生与青年研究者的对话午餐项目，涵盖申请要求、选拔规则与咨询方式。
            </div>
          </div>
          <div className="glass-panel px-6 py-6">
            <div className="text-sm font-semibold text-black/60 dark:text-white/60">Apply</div>
            <div className="mt-4">
              <Link href="#" className="glass px-5 py-2 text-sm font-semibold">
                立即申请
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
