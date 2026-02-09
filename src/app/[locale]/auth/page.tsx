"use client";

import { useEffect, useMemo, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function detectLocaleFromPathname(pathname: string): string {
  const first = pathname.split("/")[1] ?? "";
  if (first === "en" || first === "zh-CN" || first === "zh-TW" || first === "pt") {
    return first;
  }
  return "en";
}

function safeNextPath(value: string | null, fallback: string): string {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  return value;
}

export default function AuthPage() {
  const supabase = useMemo(() => {
    try {
      return createSupabaseBrowserClient();
    } catch {
      return null;
    }
  }, []);

  const [mode, setMode] = useState<"magic_link" | "code">("magic_link");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [codeExpiresInSeconds, setCodeExpiresInSeconds] = useState(0);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const t = window.setInterval(() => {
      setCooldownSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [cooldownSeconds]);

  useEffect(() => {
    if (codeExpiresInSeconds <= 0) return;
    const t = window.setInterval(() => {
      setCodeExpiresInSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [codeExpiresInSeconds]);

  async function signInWithEmail() {
    if (!supabase) {
      setMessage(
        "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY",
      );
      return;
    }
    if (cooldownSeconds > 0) return;

    setBusy(true);
    setMessage(null);

    const origin = window.location.origin;

    const locale = detectLocaleFromPathname(window.location.pathname);
    const search = new URLSearchParams(window.location.search);
    const next = safeNextPath(search.get("next"), `/${locale}/dashboard`);
    const callbackUrl = new URL(`/${locale}/auth/callback`, origin);
    callbackUrl.searchParams.set("next", next);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callbackUrl.toString(),
        shouldCreateUser: true,
      },
    });

    if (error) {
      const msg = error.message;
      setMessage(msg);
      if (/rate limit/i.test(msg)) {
        setCooldownSeconds(300);
      } else {
        setCooldownSeconds(60);
      }
    } else {
      setMessage("Check your email for the sign-in link.");
      setCooldownSeconds(60);
    }

    setBusy(false);
  }

  async function sendCode() {
    if (!supabase) {
      setMessage(
        "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY",
      );
      return;
    }
    if (cooldownSeconds > 0) return;

    setBusy(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      const msg = error.message;
      setMessage(msg);
      if (/rate limit/i.test(msg)) {
        setCooldownSeconds(300);
      } else {
        setCooldownSeconds(60);
      }
      setBusy(false);
      return;
    }

    setMessage("验证码已发送（6位数字），有效期 2 分钟。");
    setCooldownSeconds(60);
    setCodeExpiresInSeconds(120);
    setBusy(false);
  }

  async function verifyCode() {
    if (!supabase) {
      setMessage(
        "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY",
      );
      return;
    }

    const token = code.trim();
    if (!/^\d{6}$/.test(token)) {
      setMessage("请输入 6 位数字验证码。");
      return;
    }
    if (codeExpiresInSeconds <= 0) {
      setMessage("验证码已过期，请重新发送。");
      return;
    }

    setBusy(true);
    setMessage(null);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      setMessage(error.message);
      setBusy(false);
      return;
    }

    const locale = detectLocaleFromPathname(window.location.pathname);
    const search = new URLSearchParams(window.location.search);
    const next = safeNextPath(search.get("next"), `/${locale}/dashboard`);
    window.location.href = next;
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
          This MVP uses Supabase email sign-in. If you hit email rate limits, wait
          for cooldown or configure custom SMTP in Supabase.
        </p>
      </div>

      <div className="max-w-md space-y-3 rounded-lg border p-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setMode("magic_link");
              setMessage(null);
              setCode("");
            }}
            className={
              mode === "magic_link"
                ? "rounded-md border bg-neutral-50 px-3 py-1.5 text-sm font-medium"
                : "rounded-md border px-3 py-1.5 text-sm"
            }
          >
            Magic link
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("code");
              setMessage(null);
              setCode("");
            }}
            className={
              mode === "code"
                ? "rounded-md border bg-neutral-50 px-3 py-1.5 text-sm font-medium"
                : "rounded-md border px-3 py-1.5 text-sm"
            }
          >
            验证码
          </button>
        </div>

        <label className="block text-sm font-medium">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="you@example.com"
          autoComplete="email"
        />

        {mode === "magic_link" ? (
          <button
            disabled={busy || email.length === 0 || cooldownSeconds > 0}
            onClick={signInWithEmail}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {cooldownSeconds > 0
              ? `Send magic link (${cooldownSeconds}s)`
              : "Send magic link"}
          </button>
        ) : (
          <div className="space-y-2">
            <button
              disabled={busy || email.length === 0 || cooldownSeconds > 0}
              onClick={sendCode}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {cooldownSeconds > 0
                ? `发送验证码（${cooldownSeconds}s）`
                : "发送验证码"}
            </button>
            <div className="grid grid-cols-1 gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
                pattern="\\d*"
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="6 位验证码"
              />
              <button
                disabled={
                  busy ||
                  email.length === 0 ||
                  code.trim().length === 0 ||
                  codeExpiresInSeconds <= 0
                }
                onClick={verifyCode}
                className="rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50"
              >
                {codeExpiresInSeconds > 0
                  ? `验证并登录（${codeExpiresInSeconds}s）`
                  : "验证码已过期"}
              </button>
            </div>
            <div className="text-xs text-neutral-600">
              验证码有效期 2 分钟。
            </div>
          </div>
        )}

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
