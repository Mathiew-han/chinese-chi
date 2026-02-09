import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
        <p className="text-sm text-neutral-600">Requires profile role = admin.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/admin/submissions" className="rounded-lg border p-4">
          <div className="font-medium">Submissions</div>
          <div className="text-sm text-neutral-600">Review and update status</div>
        </Link>
        <Link href="/admin/orders" className="rounded-lg border p-4">
          <div className="font-medium">Orders</div>
          <div className="text-sm text-neutral-600">Inspect payments and issues</div>
        </Link>
        <Link href="/admin/important-dates" className="rounded-lg border p-4">
          <div className="font-medium">Important dates</div>
          <div className="text-sm text-neutral-600">Maintain key deadlines</div>
        </Link>
        <Link href="/admin/news" className="rounded-lg border p-4">
          <div className="font-medium">News</div>
          <div className="text-sm text-neutral-600">Publish updates</div>
        </Link>
        <Link href="/admin/sponsors" className="rounded-lg border p-4">
          <div className="font-medium">Sponsors</div>
          <div className="text-sm text-neutral-600">Maintain sponsor list</div>
        </Link>
      </div>
    </div>
  );
}
