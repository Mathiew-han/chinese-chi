import { updateProfile } from "./actions";
import { SupabaseNotConfigured } from "@/components/SupabaseNotConfigured";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  affiliation: string | null;
  country_region: string | null;
  contact: string | null;
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <SupabaseNotConfigured feature="Profile" />;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data } = await supabase
    .from("profiles")
    .select("id,email,full_name,affiliation,country_region,contact")
    .eq("id", user.id)
    .maybeSingle();

  const profile = (data ?? null) as ProfileRow | null;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-neutral-600">
          Signed in as {profile?.email ?? user?.email ?? "unknown"}
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}
      {saved ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Saved
        </div>
      ) : null}

      <form action={updateProfile} className="max-w-xl space-y-4 rounded-lg border p-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium">Full name</label>
          <input
            name="full_name"
            defaultValue={profile?.full_name ?? ""}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Your name"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Affiliation</label>
          <input
            name="affiliation"
            defaultValue={profile?.affiliation ?? ""}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="University / Company"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Country / region</label>
          <input
            name="country_region"
            defaultValue={profile?.country_region ?? ""}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Country or region"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Contact</label>
          <input
            name="contact"
            defaultValue={profile?.contact ?? ""}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Phone / WeChat / other"
          />
        </div>

        <button className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white">
          Save
        </button>
      </form>
    </div>
  );
}
