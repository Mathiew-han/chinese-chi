"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const affiliation = String(formData.get("affiliation") ?? "").trim();
  const countryRegion = String(formData.get("country_region") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim();

  if (fullName.length > 120) {
    redirect("/dashboard/profile?error=Full%20name%20is%20too%20long");
  }
  if (affiliation.length > 200) {
    redirect("/dashboard/profile?error=Affiliation%20is%20too%20long");
  }
  if (countryRegion.length > 80) {
    redirect("/dashboard/profile?error=Country%20%2F%20region%20is%20too%20long");
  }
  if (contact.length > 200) {
    redirect("/dashboard/profile?error=Contact%20is%20too%20long");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect(
      "/dashboard/profile?error=Missing%20NEXT_PUBLIC_SUPABASE_URL%20%2F%20NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName || null,
      affiliation: affiliation || null,
      country_region: countryRegion || null,
      contact: contact || null,
    })
    .eq("id", user.id);

  if (error) {
    redirect(`/dashboard/profile?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/profile");
  redirect("/dashboard/profile?saved=1");
}

