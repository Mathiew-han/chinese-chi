import { Link } from "@/navigation";

import { createSubmission } from "../actions";

export default function NewSubmissionPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">New submission</h1>
        <p className="text-sm text-neutral-600">Creates a submission row.</p>
      </div>

      <form action={createSubmission} className="max-w-2xl space-y-4">
        <div className="space-y-1">
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            className="w-full rounded-md border px-3 py-2 text-sm"
            required
            placeholder="Paper title"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="abstract" className="block text-sm font-medium">
            Abstract
          </label>
          <textarea
            id="abstract"
            name="abstract"
            className="min-h-32 w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Optional abstract"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Create
          </button>
          <Link href="/dashboard/submissions" className="rounded-md border px-4 py-2 text-sm font-medium">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
