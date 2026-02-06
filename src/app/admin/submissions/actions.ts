"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function adminUpdateSubmissionStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !status) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("submissions").update({ status }).eq("id", id);

  await supabase.from("audit_logs").insert({
    actor_id: user?.id ?? null,
    action: "submission.status.update",
    entity_type: "submission",
    entity_id: id,
    meta: { status },
  });

  revalidatePath("/admin/submissions");
}
