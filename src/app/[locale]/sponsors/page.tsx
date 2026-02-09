import Link from "next/link";
import { Markdown } from "@/components/Markdown";
import { readSiteMarkdown } from "@/lib/site-content";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SponsorRow = {
  id: string;
  name: string;
  level: string;
  logo_url: string | null;
  website_url: string | null;
};

export default async function SponsorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = await readSiteMarkdown("sponsors", locale);

  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase
        .from("sponsors")
        .select("id,name,level,logo_url,website_url")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true })
    : { data: null };

  const sponsors = (data ?? []) as SponsorRow[];

  return (
    <div className="space-y-10">
      <Markdown content={content} />
      {sponsors.length > 0 ? (
        <section className="space-y-6">
          <div className="text-lg font-semibold tracking-wide text-black/85 dark:text-white/85">
            Sponsors
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {sponsors.map((s) => (
              <div key={s.id} className="glass-panel px-6 py-6">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 dark:text-white/50">
                  {s.level}
                </div>
                <div className="mt-2 text-xl font-semibold text-black/85 dark:text-white/85">
                  {s.name}
                </div>
                {s.website_url ? (
                  <div className="mt-2 text-sm">
                    <a className="underline underline-offset-4" href={s.website_url}>
                      {s.website_url}
                    </a>
                  </div>
                ) : null}
                {s.logo_url ? (
                  <div className="mt-3 text-xs text-neutral-500 break-all">{s.logo_url}</div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <section className="space-y-6">
        <div className="text-lg font-semibold tracking-wide text-black/85 dark:text-white/85">
          赞助级别（参考）
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { tier: "Bronze", fee: "￥X,XXX", perks: "展位 + Logo 露出" },
            { tier: "Silver", fee: "￥X,XXX", perks: "议程露出 + 展位" },
            { tier: "Gold", fee: "￥X,XXX", perks: "主会场露出 + 赞助致辞" },
            { tier: "Platinum", fee: "￥X,XXX", perks: "冠名曝光 + 深度合作" },
          ].map((item) => (
            <div key={item.tier} className="glass-panel px-6 py-6">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 dark:text-white/50">
                {item.tier}
              </div>
              <div className="mt-2 text-xl font-semibold text-black/85 dark:text-white/85">
                {item.fee}
              </div>
              <div className="mt-2 text-sm text-black/70 dark:text-white/70">{item.perks}</div>
            </div>
          ))}
        </div>
        <div className="glass-panel px-6 py-6">
          <div className="text-sm font-semibold text-black/60 dark:text-white/60">Sponsorship Link</div>
          <div className="mt-3 text-sm">
            <Link href="#" className="underline underline-offset-4">
              获取赞助方案与联系方式
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
