"use client";

import { useMemo, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AuthPage() {
  const supabase = useMemo(() => {
    try {
      return createSupabaseBrowserClient();
    } catch {
      return null;
    }
  }, []);

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function signInWithEmail() {
    if (!supabase) {
      setMessage(
        "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY",
      );
      return;
    }

    setBusy(true);
    setMessage(null);

    const origin = window.location.origin;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the sign-in link.");
    }

    setBusy(false);
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-neutral-600">
          This MVP uses Supabase magic link.
        </p>
      </div>

      <div className="max-w-md space-y-3 rounded-lg border p-4">
        <label className="block text-sm font-medium">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="you@example.com"
          autoComplete="email"
        />
        <button
          disabled={busy || email.length === 0}
          onClick={signInWithEmail}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Send magic link
        </button>
        <button
          onClick={signOut}
          className="ml-2 rounded-md border px-4 py-2 text-sm font-medium"
        >
          Sign out
        </button>
        {message ? <div className="text-sm text-neutral-700">{message}</div> : null}
      </div>
    </div>
  );
}

