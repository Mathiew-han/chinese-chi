import { createImportantDate, deleteImportantDate, updateImportantDate } from "./actions";
import { SupabaseNotConfigured } from "@/components/SupabaseNotConfigured";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ImportantDateRow = {
  id: string;
  title_zh: string;
  title_en: string;
  date: string;
  timezone: string;
  sort_order: number;
};

export default async function AdminImportantDatesPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <SupabaseNotConfigured feature="Admin · Important dates" />;
  }

  const { data } = await supabase
    .from("important_dates")
    .select("id,title_zh,title_en,date,timezone,sort_order")
    .order("sort_order", { ascending: true })
    .order("date", { ascending: true });

  const rows = (data ?? []) as ImportantDateRow[];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Admin · Important dates</h1>
        <p className="text-sm text-neutral-600">Public page reads from important_dates.</p>
      </div>

      <form action={createImportantDate} className="rounded-lg border p-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-5">
          <input
            name="title_zh"
            placeholder="标题（中文）"
            className="rounded-md border px-3 py-2 text-sm md:col-span-2"
          />
          <input
            name="title_en"
            placeholder="Title (EN)"
            className="rounded-md border px-3 py-2 text-sm md:col-span-2"
          />
          <input
            name="sort_order"
            type="number"
            defaultValue={0}
            className="rounded-md border px-3 py-2 text-sm"
          />
          <input
            name="date"
            type="datetime-local"
            className="rounded-md border px-3 py-2 text-sm md:col-span-2"
          />
          <input
            name="timezone"
            defaultValue="AOE"
            className="rounded-md border px-3 py-2 text-sm"
          />
          <button className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white">
            Add
          </button>
        </div>
      </form>

      <div className="rounded-lg border">
        <div className="grid grid-cols-12 border-b px-4 py-2 text-xs font-medium text-neutral-600">
          <div className="col-span-5">Title</div>
          <div className="col-span-3">Date</div>
          <div className="col-span-2">TZ</div>
          <div className="col-span-2">Actions</div>
        </div>
        <div className="divide-y">
          {rows.map((r) => (
            <div key={r.id} className="px-4 py-3">
              <form action={updateImportantDate} className="grid grid-cols-12 gap-2 items-start">
                <input type="hidden" name="id" value={r.id} />
                <div className="col-span-12 md:col-span-5 grid gap-2">
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
                </div>
                <div className="col-span-12 md:col-span-3 grid gap-2">
                  <input
                    name="date"
                    type="datetime-local"
                    defaultValue={new Date(r.date).toISOString().slice(0, 16)}
                    className="rounded-md border px-3 py-2 text-sm"
                  />
                  <input
                    name="sort_order"
                    type="number"
                    defaultValue={r.sort_order}
                    className="rounded-md border px-3 py-2 text-sm"
                  />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <input
                    name="timezone"
                    defaultValue={r.timezone}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
                <div className="col-span-12 md:col-span-2 flex gap-2">
                  <button className="rounded-md bg-black px-3 py-2 text-xs font-medium text-white">
                    Save
                  </button>
                  <button
                    formAction={deleteImportantDate}
                    name="id"
                    value={r.id}
                    className="rounded-md border px-3 py-2 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </form>
            </div>
          ))}
          {rows.length === 0 ? (
            <div className="px-4 py-6 text-sm text-neutral-600">No important dates.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

