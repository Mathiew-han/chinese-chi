"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";

function requireString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createNews(formData: FormData) {
  const titleZh = requireString(formData, "title_zh");
  const titleEn = requireString(formData, "title_en");
  const bodyZh = requireString(formData, "body_zh");
  const bodyEn = requireString(formData, "body_en");
  const publishedAtRaw = requireString(formData, "published_at");
  const pinned = String(formData.get("pinned") ?? "") === "on";

  if (!titleZh || !titleEn) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("news")
    .insert({
    title_zh: titleZh,
    title_en: titleEn,
    body_zh: bodyZh,
    body_en: bodyEn,
    published_at: publishedAtRaw ? new Date(publishedAtRaw).toISOString() : null,
    pinned,
    })
    .select("id")
    .single();

  if (data?.id) {
    await supabase.from("audit_logs").insert({
      actor_id: user?.id ?? null,
      action: "news.create",
      entity_type: "news",
      entity_id: data.id,
      meta: { pinned },
    });
  }

  revalidatePath("/admin/news");
  revalidatePath("/news");
}

export async function updateNews(formData: FormData) {
  const id = requireString(formData, "id");
  const titleZh = requireString(formData, "title_zh");
  const titleEn = requireString(formData, "title_en");
  const bodyZh = requireString(formData, "body_zh");
  const bodyEn = requireString(formData, "body_en");
  const publishedAtRaw = requireString(formData, "published_at");
  const pinned = String(formData.get("pinned") ?? "") === "on";

  if (!id || !titleZh || !titleEn) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase
    .from("news")
    .update({
      title_zh: titleZh,
      title_en: titleEn,
      body_zh: bodyZh,
      body_en: bodyEn,
      published_at: publishedAtRaw ? new Date(publishedAtRaw).toISOString() : null,
      pinned,
    })
    .eq("id", id);

  await supabase.from("audit_logs").insert({
    actor_id: user?.id ?? null,
    action: "news.update",
    entity_type: "news",
    entity_id: id,
    meta: { pinned },
  });

  revalidatePath("/admin/news");
  revalidatePath("/news");
}

export async function deleteNews(formData: FormData) {
  const id = requireString(formData, "id");
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("news").delete().eq("id", id);

  await supabase.from("audit_logs").insert({
    actor_id: user?.id ?? null,
    action: "news.delete",
    entity_type: "news",
    entity_id: id,
  });

  revalidatePath("/admin/news");
  revalidatePath("/news");
}
