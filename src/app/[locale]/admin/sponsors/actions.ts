"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";

function requireString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createSponsor(formData: FormData) {
  const name = requireString(formData, "name");
  const level = requireString(formData, "level") || "partner";
  const logoUrl = requireString(formData, "logo_url");
  const websiteUrl = requireString(formData, "website_url");
  const sortOrder = Number(formData.get("sort_order") ?? 0);

  if (!name) return;
  if (!Number.isFinite(sortOrder)) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("sponsors")
    .insert({
    name,
    level,
    logo_url: logoUrl || null,
    website_url: websiteUrl || null,
    sort_order: sortOrder,
    })
    .select("id")
    .single();

  if (data?.id) {
    await supabase.from("audit_logs").insert({
      actor_id: user?.id ?? null,
      action: "sponsors.create",
      entity_type: "sponsor",
      entity_id: data.id,
      meta: { level },
    });
  }

  revalidatePath("/admin/sponsors");
  revalidatePath("/sponsors");
}

export async function updateSponsor(formData: FormData) {
  const id = requireString(formData, "id");
  const name = requireString(formData, "name");
  const level = requireString(formData, "level") || "partner";
  const logoUrl = requireString(formData, "logo_url");
  const websiteUrl = requireString(formData, "website_url");
  const sortOrder = Number(formData.get("sort_order") ?? 0);

  if (!id || !name) return;
  if (!Number.isFinite(sortOrder)) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase
    .from("sponsors")
    .update({
      name,
      level,
      logo_url: logoUrl || null,
      website_url: websiteUrl || null,
      sort_order: sortOrder,
    })
    .eq("id", id);

  await supabase.from("audit_logs").insert({
    actor_id: user?.id ?? null,
    action: "sponsors.update",
    entity_type: "sponsor",
    entity_id: id,
    meta: { level },
  });

  revalidatePath("/admin/sponsors");
  revalidatePath("/sponsors");
}

export async function deleteSponsor(formData: FormData) {
  const id = requireString(formData, "id");
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("sponsors").delete().eq("id", id);

  await supabase.from("audit_logs").insert({
    actor_id: user?.id ?? null,
    action: "sponsors.delete",
    entity_type: "sponsor",
    entity_id: id,
  });

  revalidatePath("/admin/sponsors");
  revalidatePath("/sponsors");
}
