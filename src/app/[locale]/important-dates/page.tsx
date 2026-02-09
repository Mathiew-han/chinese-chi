import { Markdown } from "@/components/Markdown";
import { readSiteMarkdown } from "@/lib/site-content";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ImportantDateRow = {
  id: string;
  title_zh: string;
  title_en: string;
  date: string;
  timezone: string;
};

export default async function ImportantDatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = await readSiteMarkdown("important-dates", locale);

  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase
        .from("important_dates")
        .select("id,title_zh,title_en,date,timezone")
        .order("sort_order", { ascending: true })
        .order("date", { ascending: true })
    : { data: null };

  const dates = (data ?? []) as ImportantDateRow[];

  return (
    <div className="space-y-10">
      <Markdown content={content} />
      {dates.length > 0 ? (
        <section className="space-y-4">
          <div className="text-lg font-semibold tracking-wide text-black/85 dark:text-white/85">
            Deadlines
          </div>
          <div className="overflow-x-auto border border-black/5 dark:border-white/5">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-black/5 dark:bg-white/5">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">TZ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {dates.map((d) => (
                  <tr key={d.id}>
                    <td className="p-3 whitespace-nowrap">
                      {new Date(d.date).toLocaleString()}
                    </td>
                    <td className="p-3">
                      {locale.startsWith("zh") ? d.title_zh : d.title_en}
                    </td>
                    <td className="p-3 whitespace-nowrap">{d.timezone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
      <section className="space-y-6">
        <div className="text-lg font-semibold tracking-wide text-black/85 dark:text-white/85">
          Timeline（参考 2025 版）
        </div>
        <div className="overflow-x-auto border border-black/5 dark:border-white/5">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-black/5 dark:bg-white/5">
              <tr>
                <th className="p-3">Important Dates</th>
                <th className="p-3">Technical Issues</th>
                <th className="p-3">Organization Issues</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              <tr>
                <td className="p-3">January</td>
                <td className="p-3">Conference Committee Confirmation</td>
                <td className="p-3"></td>
              </tr>
              <tr>
                <td className="p-3">February</td>
                <td className="p-3">Reviewer Organization · EasyChair Setup · Keynote Invitation</td>
                <td className="p-3">Official Website Setup · Sponsorship Package Planning</td>
              </tr>
              <tr>
                <td className="p-3">March</td>
                <td className="p-3">Announcement · Keynote Invitation</td>
                <td className="p-3">Registration Rate Setup · Sponsorship Promotion</td>
              </tr>
              <tr>
                <td className="p-3">April</td>
                <td className="p-3"></td>
                <td className="p-3">Warm-up Promotion · Sponsorship Promotion</td>
              </tr>
              <tr className="timeline-warn">
                <td className="p-3">Early May</td>
                <td className="p-3">1st Round Call for Papers</td>
                <td className="p-3">Conference Promotion</td>
              </tr>
              <tr className="timeline-warn">
                <td className="p-3">Late June</td>
                <td className="p-3">2nd Round Call for Papers</td>
                <td className="p-3">Sponsorship Promotion & Negotiation</td>
              </tr>
              <tr className="timeline-warn">
                <td className="p-3">Late August</td>
                <td className="p-3">Paper Submission Due</td>
                <td className="p-3">Registration Opens</td>
              </tr>
              <tr className="timeline-warn">
                <td className="p-3">Late September</td>
                <td className="p-3">Paper Notification</td>
                <td className="p-3">Participation Guide Release</td>
              </tr>
              <tr className="timeline-accent">
                <td className="p-3">October</td>
                <td className="p-3">Detailed Program Planning · Art Gallery Arrangements</td>
                <td className="p-3">Early Bird Registration Due (AoE)</td>
              </tr>
              <tr className="timeline-accent">
                <td className="p-3">November</td>
                <td className="p-3">Session Chairs Invitation</td>
                <td className="p-3">Normal Registration Due (AoE)</td>
              </tr>
              <tr className="timeline-accent">
                <td className="p-3">Nov 23–26</td>
                <td className="p-3">Conference Dates</td>
                <td className="p-3">Late Registration Rate</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
