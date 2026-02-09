import { SupabaseNotConfigured } from "@/components/SupabaseNotConfigured";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type AdminOrderRow = {
  id: string;
  kind: string;
  status: string;
  amount: number;
  currency: string;
  created_at: string;
  user_id: string;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
};

export default async function AdminOrdersPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <SupabaseNotConfigured feature="Admin · Orders" />;
  }

  const { data } = await supabase
    .from("orders")
    .select(
      "id,kind,status,amount,currency,created_at,user_id,stripe_session_id,stripe_payment_intent_id",
    )
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as AdminOrderRow[];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Admin · Orders</h1>
        <p className="text-sm text-neutral-600">Inspect Stripe session backfill.</p>
      </div>

      <div className="rounded-lg border">
        <div className="grid grid-cols-12 border-b px-4 py-2 text-xs font-medium text-neutral-600">
          <div className="col-span-4">Order</div>
          <div className="col-span-2">Kind</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2">Created</div>
        </div>
        <div className="divide-y">
          {orders.map((o) => (
            <div key={o.id} className="grid grid-cols-12 px-4 py-3 text-sm">
              <div className="col-span-4">
                <div className="font-medium">{o.id}</div>
                <div className="text-xs text-neutral-600">{o.user_id}</div>
              </div>
              <div className="col-span-2 text-neutral-700">{o.kind}</div>
              <div className="col-span-2">
                <span className="rounded-md border px-2 py-1 text-xs">{o.status}</span>
                <div className="mt-1 text-[10px] text-neutral-500">
                  {o.stripe_payment_intent_id ?? ""}
                </div>
              </div>
              <div className="col-span-2 text-neutral-700">
                {(o.amount / 100).toFixed(2)} {o.currency}
              </div>
              <div className="col-span-2 text-xs text-neutral-600">
                {new Date(o.created_at).toLocaleString()}
              </div>
              <div className="col-span-12 mt-2 text-[10px] text-neutral-500">
                {o.stripe_session_id ?? ""}
              </div>
            </div>
          ))}
          {data?.length === 0 ? (
            <div className="px-4 py-6 text-sm text-neutral-600">No orders.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
