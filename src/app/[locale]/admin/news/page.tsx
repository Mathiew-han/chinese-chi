import { createNews, deleteNews, updateNews } from "./actions";
import { SupabaseNotConfigured } from "@/components/SupabaseNotConfigured";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type NewsRow = {
  id: string;
  title_zh: string;
  title_en: string;
  body_zh: string;
  body_en: string;
  published_at: string | null;
  pinned: boolean;
  created_at: string;
};

export default async function AdminNewsPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <SupabaseNotConfigured feature="Admin · News" />;
  }

  const { data } = await supabase
    .from("news")
    .select("id,title_zh,title_en,body_zh,body_en,published_at,pinned,created_at")
    .order("pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as NewsRow[];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Admin · News</h1>
        <p className="text-sm text-neutral-600">Public page reads published_at ≤ now().</p>
      </div>

      <form action={createNews} className="rounded-lg border p-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <input
            name="title_zh"
            placeholder="标题（中文）"
            className="rounded-md border px-3 py-2 text-sm"
          />
          <input
            name="title_en"
            placeholder="Title (EN)"
            className="rounded-md border px-3 py-2 text-sm"
          />
          <textarea
            name="body_zh"
            placeholder="正文（中文，支持 Markdown）"
            className="rounded-md border px-3 py-2 text-sm md:col-span-2"
            rows={6}
          />
          <textarea
            name="body_en"
            placeholder="Body (EN, Markdown)"
            className="rounded-md border px-3 py-2 text-sm md:col-span-2"
            rows={6}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input name="published_at" type="datetime-local" className="rounded-md border px-3 py-2 text-sm" />
          <label className="flex items-center gap-2 text-sm">
            <input name="pinned" type="checkbox" className="h-4 w-4" />
            Pinned
          </label>
          <button className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white">Add</button>
        </div>
      </form>

      <div className="space-y-4">
        {rows.map((r) => (
          <div key={r.id} className="rounded-lg border p-4">
            <form action={updateNews} className="space-y-3">
              <input type="hidden" name="id" value={r.id} />
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  name="title_zh"
                  defaultValue={r.title_zh}
                  className="rounded-md border px-3 py-2 text-sm"
                />
                <input
                  name="title_en"
                  defaultValue={r.title_en}
                  className="rounded-md border px-3 py-2 text-sm"
                />
                <textarea
                  name="body_zh"
                  defaultValue={r.body_zh}
                  className="rounded-md border px-3 py-2 text-sm md:col-span-2"
                  rows={6}
                />
                <textarea
                  name="body_en"
                  defaultValue={r.body_en}
                  className="rounded-md border px-3 py-2 text-sm md:col-span-2"
                  rows={6}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  name="published_at"
                  type="datetime-local"
                  defaultValue={r.published_at ? new Date(r.published_at).toISOString().slice(0, 16) : ""}
                  className="rounded-md border px-3 py-2 text-sm"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    name="pinned"
                    type="checkbox"
                    defaultChecked={r.pinned}
                    className="h-4 w-4"
                  />
                  Pinned
                </label>
                <button className="rounded-md bg-black px-3 py-2 text-xs font-medium text-white">
                  Save
                </button>
                <button
                  formAction={deleteNews}
                  name="id"
                  value={r.id}
                  className="rounded-md border px-3 py-2 text-xs"
                >
                  Delete
                </button>
                <div className="text-xs text-neutral-500">{r.id}</div>
              </div>
            </form>
          </div>
        ))}
        {rows.length === 0 ? <div className="text-sm text-neutral-600">No news.</div> : null}
      </div>
    </div>
  );
}
