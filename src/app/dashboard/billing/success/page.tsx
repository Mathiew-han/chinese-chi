import Link from "next/link";

import { SupabaseNotConfigured } from "@/components/SupabaseNotConfigured";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <SupabaseNotConfigured feature="Billing (Stripe 状态回写)" />;
  }

  const { data: order } = session_id
    ? await supabase
        .from("orders")
        .select("id,kind,status,amount,currency,created_at")
        .eq("stripe_session_id", session_id)
        .maybeSingle()
    : { data: null };

  const { data: entitlement } = order
    ? await supabase
        .from("entitlements")
        .select("id,kind,active,created_at")
        .eq("kind", order.kind)
        .eq("active", true)
        .maybeSingle()
    : { data: null };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Payment submitted</h1>
      {order ? (
        <div className="rounded-lg border p-4 text-sm">
          <div className="font-medium">Order</div>
          <div className="mt-1 text-neutral-700">{order.id}</div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-neutral-600">
            <div>Kind: {order.kind}</div>
            <div>Status: {order.status}</div>
            <div>
              Amount: {(order.amount / 100).toFixed(2)} {order.currency}
            </div>
            <div>Created: {new Date(order.created_at).toLocaleString()}</div>
          </div>
          {entitlement ? (
            <div className="mt-3 rounded-md border bg-neutral-50 px-3 py-2 text-xs text-neutral-700">
              Entitlement active for {entitlement.kind}
            </div>
          ) : (
            <div className="mt-3 text-xs text-neutral-500">
              If status is still pending, wait a moment for webhook processing.
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-neutral-600">
          If you just paid, webhook may take a moment to mark the order as paid.
        </p>
      )}
      <Link href="/dashboard" className="rounded-md border px-4 py-2 text-sm font-medium">
        Back to dashboard
      </Link>
    </div>
  );
}
