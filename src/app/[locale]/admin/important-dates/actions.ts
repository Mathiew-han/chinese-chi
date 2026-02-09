"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";

function requireString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createImportantDate(formData: FormData) {
  const titleZh = requireString(formData, "title_zh");
  const titleEn = requireString(formData, "title_en");
  const date = requireString(formData, "date");
  const timezone = requireString(formData, "timezone") || "AOE";
  const sortOrder = Number(formData.get("sort_order") ?? 0);

  if (!titleZh || !titleEn || !date) return;
  if (!Number.isFinite(sortOrder)) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("important_dates")
    .insert({
    title_zh: titleZh,
    title_en: titleEn,
    date: new Date(date).toISOString(),
    timezone,
    sort_order: sortOrder,
    })
    .select("id")
    .single();

  if (data?.id) {
    await supabase.from("audit_logs").insert({
      actor_id: user?.id ?? null,
      action: "important_dates.create",
      entity_type: "important_date",
      entity_id: data.id,
      meta: { timezone },
    });
  }

  revalidatePath("/admin/important-dates");
  revalidatePath("/important-dates");
}

export async function updateImportantDate(formData: FormData) {
  const id = requireString(formData, "id");
  const titleZh = requireString(formData, "title_zh");
  const titleEn = requireString(formData, "title_en");
  const date = requireString(formData, "date");
  const timezone = requireString(formData, "timezone") || "AOE";
  const sortOrder = Number(formData.get("sort_order") ?? 0);

  if (!id || !titleZh || !titleEn || !date) return;
  if (!Number.isFinite(sortOrder)) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase
    .from("important_dates")
    .update({
      title_zh: titleZh,
      title_en: titleEn,
      date: new Date(date).toISOString(),
      timezone,
      sort_order: sortOrder,
    })
    .eq("id", id);

  await supabase.from("audit_logs").insert({
    actor_id: user?.id ?? null,
    action: "important_dates.update",
    entity_type: "important_date",
    entity_id: id,
    meta: { timezone },
  });

  revalidatePath("/admin/important-dates");
  revalidatePath("/important-dates");
}

export async function deleteImportantDate(formData: FormData) {
  const id = requireString(formData, "id");
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("important_dates").delete().eq("id", id);

  await supabase.from("audit_logs").insert({
    actor_id: user?.id ?? null,
    action: "important_dates.delete",
    entity_type: "important_date",
    entity_id: id,
  });

  revalidatePath("/admin/important-dates");
  revalidatePath("/important-dates");
}
