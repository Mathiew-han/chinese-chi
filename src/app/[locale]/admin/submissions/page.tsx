import { adminUpdateSubmissionStatus } from "./actions";
import { SupabaseNotConfigured } from "@/components/SupabaseNotConfigured";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const STATUSES = [
  "submitted",
  "under_review",
  "accepted",
  "rejected",
  "camera_ready",
];

type AdminSubmissionRow = {
  id: string;
  title: string;
  status: string;
  created_at: string;
  user_id: string;
};

export default async function AdminSubmissionsPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <SupabaseNotConfigured feature="Admin · Submissions" />;
  }

  const { data } = await supabase
    .from("submissions")
    .select("id,title,status,created_at,user_id")
    .order("created_at", { ascending: false });

  const submissions = (data ?? []) as AdminSubmissionRow[];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Admin · Submissions</h1>
        <p className="text-sm text-neutral-600">Update status (admin only).</p>
      </div>

      <div className="rounded-lg border">
        <div className="grid grid-cols-12 border-b px-4 py-2 text-xs font-medium text-neutral-600">
          <div className="col-span-5">Title</div>
          <div className="col-span-3">User</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Action</div>
        </div>
        <div className="divide-y">
          {submissions.map((s) => (
            <div key={s.id} className="grid grid-cols-12 items-center px-4 py-3 text-sm">
              <div className="col-span-5 font-medium">{s.title}</div>
              <div className="col-span-3 text-xs text-neutral-600">{s.user_id}</div>
              <div className="col-span-2">
                <span className="rounded-md border px-2 py-1 text-xs">{s.status}</span>
              </div>
              <div className="col-span-2">
                <form action={adminUpdateSubmissionStatus} className="flex gap-2">
                  <input type="hidden" name="id" value={s.id} />
                  <label htmlFor={`status-${s.id}`} className="sr-only">
                    Submission status
                  </label>
                  <select
                    id={`status-${s.id}`}
                    name="status"
                    defaultValue={s.status}
                    className="rounded-md border px-2 py-1 text-xs"
                    title="Submission status"
                  >
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-md bg-black px-2 py-1 text-xs font-medium text-white"
                  >
                    Save
                  </button>
                </form>
              </div>
            </div>
          ))}
          {data?.length === 0 ? (
            <div className="px-4 py-6 text-sm text-neutral-600">No submissions.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
