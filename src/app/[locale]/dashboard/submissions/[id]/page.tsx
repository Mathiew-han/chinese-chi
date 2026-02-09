import { Link } from "@/navigation";

import { uploadSubmissionFile } from "../actions";
import { SupabaseNotConfigured } from "@/components/SupabaseNotConfigured";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SubmissionFileRow = {
  id: string;
  kind: string;
  path: string;
  created_at: string;
};

export default async function SubmissionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error: errorMessage } = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <SupabaseNotConfigured feature="Submission Detail / File Upload" />;
  }

  const { data: submission } = await supabase
    .from("submissions")
    .select("id,title,abstract,status,created_at")
    .eq("id", id)
    .maybeSingle();

  const { data: files } = await supabase
    .from("submission_files")
    .select("id,kind,path,created_at")
    .eq("submission_id", id)
    .order("created_at", { ascending: false });
  const typedFiles = (files ?? []) as SubmissionFileRow[];

  if (!submission) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-neutral-600">Submission not found.</div>
        <Link href="/dashboard/submissions" className="rounded-md border px-4 py-2 text-sm font-medium">
          Back
        </Link>
      </div>
    );
  }

  const upload = uploadSubmissionFile.bind(null, id);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{submission.title}</h1>
          <p className="text-sm text-neutral-600">Status: {submission.status}</p>
        </div>
        <Link
          href="/dashboard/submissions"
          className="rounded-md border px-4 py-2 text-sm font-medium"
        >
          Back
        </Link>
      </div>

      {submission.abstract ? (
        <div className="rounded-lg border p-4 text-sm text-neutral-700">
          {submission.abstract}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </div>
      ) : null}

      <div className="rounded-lg border p-4">
        <div className="mb-3 font-medium">Upload file</div>
        <form action={upload} className="flex flex-wrap items-center gap-3">
          <label htmlFor="fileKind" className="sr-only">
            File kind
          </label>
          <select
            id="fileKind"
            name="kind"
            className="rounded-md border px-3 py-2 text-sm"
            title="File kind"
          >
            <option value="paper">paper</option>
            <option value="supplement">supplement</option>
          </select>
          <label htmlFor="fileInput" className="sr-only">
            Upload file
          </label>
          <input
            id="fileInput"
            name="file"
            type="file"
            className="text-sm"
            required
            title="Select a file to upload"
          />
          <button
            type="submit"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Upload
          </button>
        </form>
        <div className="mt-3 text-xs text-neutral-500">
          Requires a Supabase Storage bucket named submissions.
        </div>
      </div>

      <div className="rounded-lg border">
        <div className="border-b px-4 py-2 text-xs font-medium text-neutral-600">
          Files
        </div>
        <div className="divide-y">
          {typedFiles.map((f) => (
            <div key={f.id} className="px-4 py-3 text-sm">
              <div className="font-medium">{f.kind}</div>
              <div className="text-xs text-neutral-600">{f.path}</div>
            </div>
          ))}
          {files?.length === 0 ? (
            <div className="px-4 py-6 text-sm text-neutral-600">No files yet.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
