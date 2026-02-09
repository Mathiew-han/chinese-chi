import { createSponsor, deleteSponsor, updateSponsor } from "./actions";
import { SupabaseNotConfigured } from "@/components/SupabaseNotConfigured";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SponsorRow = {
  id: string;
  name: string;
  level: string;
  logo_url: string | null;
  website_url: string | null;
  sort_order: number;
};

export default async function AdminSponsorsPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <SupabaseNotConfigured feature="Admin · Sponsors" />;
  }

  const { data } = await supabase
    .from("sponsors")
    .select("id,name,level,logo_url,website_url,sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  const rows = (data ?? []) as SponsorRow[];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Admin · Sponsors</h1>
        <p className="text-sm text-neutral-600">Public page reads from sponsors.</p>
      </div>

      <form action={createSponsor} className="rounded-lg border p-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-6">
          <input
            name="name"
            placeholder="Name"
            className="rounded-md border px-3 py-2 text-sm md:col-span-2"
          />
          <input
            name="level"
            defaultValue="partner"
            className="rounded-md border px-3 py-2 text-sm"
          />
          <input
            name="sort_order"
            type="number"
            defaultValue={0}
            className="rounded-md border px-3 py-2 text-sm"
          />
          <input
            name="logo_url"
            placeholder="Logo URL"
            className="rounded-md border px-3 py-2 text-sm md:col-span-2"
          />
          <input
            name="website_url"
            placeholder="Website URL"
            className="rounded-md border px-3 py-2 text-sm md:col-span-2"
          />
          <button className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white">Add</button>
        </div>
      </form>

      <div className="rounded-lg border">
        <div className="grid grid-cols-12 border-b px-4 py-2 text-xs font-medium text-neutral-600">
          <div className="col-span-5">Sponsor</div>
          <div className="col-span-3">Links</div>
          <div className="col-span-2">Sort</div>
          <div className="col-span-2">Actions</div>
        </div>
        <div className="divide-y">
          {rows.map((r) => (
            <div key={r.id} className="px-4 py-3">
              <form action={updateSponsor} className="grid grid-cols-12 gap-2 items-start">
                <input type="hidden" name="id" value={r.id} />
                <div className="col-span-12 md:col-span-5 grid gap-2">
                  <input
                    name="name"
                    defaultValue={r.name}
                    className="rounded-md border px-3 py-2 text-sm"
                  />
                  <input
                    name="level"
                    defaultValue={r.level}
                    className="rounded-md border px-3 py-2 text-sm"
                  />
                </div>
                <div className="col-span-12 md:col-span-3 grid gap-2">
                  <input
                    name="logo_url"
                    defaultValue={r.logo_url ?? ""}
                    className="rounded-md border px-3 py-2 text-sm"
                  />
                  <input
                    name="website_url"
                    defaultValue={r.website_url ?? ""}
                    className="rounded-md border px-3 py-2 text-sm"
                  />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <input
                    name="sort_order"
                    type="number"
                    defaultValue={r.sort_order}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
                <div className="col-span-12 md:col-span-2 flex gap-2">
                  <button className="rounded-md bg-black px-3 py-2 text-xs font-medium text-white">
                    Save
                  </button>
                  <button
                    formAction={deleteSponsor}
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
            <div className="px-4 py-6 text-sm text-neutral-600">No sponsors.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

