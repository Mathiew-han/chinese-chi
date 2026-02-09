"use client";

import { useState } from "react";

export default function BillingPage() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function startCheckout(kind: string) {
    setBusy(true);
    setMessage(null);

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind }),
    });

    const body = (await res.json().catch(() => null)) as
      | { url?: string; error?: string }
      | null;

    if (!res.ok || !body?.url) {
      setMessage(body?.error ?? "Failed to start checkout");
      setBusy(false);
      return;
    }

    window.location.href = body.url;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-sm text-neutral-600">
          Stripe Checkout requires STRIPE_SECRET_KEY and webhook configuration.
        </p>
      </div>

      <div className="rounded-lg border p-4 space-y-3">
        <div className="font-medium">Submission fee</div>
        <div className="text-sm text-neutral-600">Demo amount: 100.00 USD</div>
        <button
          disabled={busy}
          onClick={() => startCheckout("submission_fee")}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Pay with Stripe
        </button>
        {message ? <div className="text-sm text-red-700">{message}</div> : null}
      </div>
    </div>
  );
}

