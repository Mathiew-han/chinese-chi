import Link from "next/link";

import { SupabaseNotConfigured } from "@/components/SupabaseNotConfigured";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <SupabaseNotConfigured feature="Portal / Dashboard" />;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-neutral-600">
          Signed in as {user?.email ?? "unknown"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/dashboard/submissions" className="rounded-lg border p-4">
          <div className="font-medium">Submissions</div>
          <div className="text-sm text-neutral-600">Create and manage your submissions</div>
        </Link>
        <Link href="/dashboard/billing" className="rounded-lg border p-4">
          <div className="font-medium">Billing</div>
          <div className="text-sm text-neutral-600">Pay fees via Stripe Checkout</div>
        </Link>
      </div>
    </div>
  );
}
