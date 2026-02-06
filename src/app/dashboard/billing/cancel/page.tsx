import Link from "next/link";

export default function BillingCancelPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Payment canceled</h1>
      <p className="text-sm text-neutral-600">You can retry checkout anytime.</p>
      <Link href="/dashboard/billing" className="rounded-md border px-4 py-2 text-sm font-medium">
        Back to billing
      </Link>
    </div>
  );
}

