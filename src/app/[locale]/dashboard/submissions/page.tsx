import Link from "next/link";

import { SupabaseNotConfigured } from "@/components/SupabaseNotConfigured";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: errorMessage } = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <SupabaseNotConfigured feature="Submissions" />;
  }

  const { data } = await supabase
    .from("submissions")
    .select("id,title,status,created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Submissions</h1>
          <p className="text-sm text-neutral-600">
            Your submissions. RLS restricts access to your own rows.
          </p>
        </div>
        <Link
          href="/dashboard/submissions/new"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          New
        </Link>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </div>
      ) : null}

      <div className="rounded-lg border">
        <div className="grid grid-cols-12 border-b px-4 py-2 text-xs font-medium text-neutral-600">
          <div className="col-span-6">Title</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-3">Created</div>
        </div>
        <div className="divide-y">
          {(data ?? []).map((s) => (
            <Link
              key={s.id}
              href={`/dashboard/submissions/${s.id}`}
              className="grid grid-cols-12 px-4 py-3 text-sm hover:bg-neutral-50"
            >
              <div className="col-span-6 font-medium">{s.title}</div>
              <div className="col-span-3 text-neutral-600">{s.status}</div>
              <div className="col-span-3 text-neutral-600">
                {new Date(s.created_at).toLocaleString()}
              </div>
            </Link>
          ))}
          {data?.length === 0 ? (
            <div className="px-4 py-6 text-sm text-neutral-600">
              No submissions yet.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
