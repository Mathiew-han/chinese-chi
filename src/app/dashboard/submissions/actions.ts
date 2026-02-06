"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  ALLOWED_SUBMISSION_FILE_KINDS,
  validateSubmissionFileUpload,
} from "@/lib/submission-policy";

export async function createSubmission(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const abstract = String(formData.get("abstract") ?? "").trim();

  if (!title) {
    redirect("/dashboard/submissions?error=Title%20is%20required");
  }
  if (title.length > 200) {
    redirect("/dashboard/submissions?error=Title%20is%20too%20long");
  }
  if (abstract.length > 8000) {
    redirect("/dashboard/submissions?error=Abstract%20is%20too%20long");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect(
      "/dashboard/submissions?error=Missing%20NEXT_PUBLIC_SUPABASE_URL%20%2F%20NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data, error } = await supabase
    .from("submissions")
    .insert({
      user_id: user.id,
      title,
      abstract,
      status: "submitted",
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect(
      `/dashboard/submissions?error=${encodeURIComponent(
        error?.message ?? "Failed to create",
      )}`,
    );
  }

  revalidatePath("/dashboard/submissions");
  redirect(`/dashboard/submissions/${data.id}`);
}

export async function uploadSubmissionFile(
  submissionId: string,
  formData: FormData,
) {
  const file = formData.get("file");
  const kind = String(formData.get("kind") ?? "paper").trim() || "paper";

  if (!(file instanceof File)) {
    redirect(`/dashboard/submissions/${submissionId}?error=File%20is%20required`);
  }

  if (!ALLOWED_SUBMISSION_FILE_KINDS.has(kind)) {
    redirect(`/dashboard/submissions/${submissionId}?error=Invalid%20file%20kind`);
  }

  const fileError = validateSubmissionFileUpload(file);
  if (fileError) {
    redirect(
      `/dashboard/submissions/${submissionId}?error=${encodeURIComponent(
        fileError,
      )}`,
    );
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect(
      `/dashboard/submissions/${submissionId}?error=Missing%20NEXT_PUBLIC_SUPABASE_URL%20%2F%20NEXT_PUBLIC_SUPABASE_ANON_KEY`,
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: submission, error: submissionError } = await supabase
    .from("submissions")
    .select("id")
    .eq("id", submissionId)
    .maybeSingle();

  if (submissionError || !submission) {
    redirect(`/dashboard/submissions/${submissionId}?error=Submission%20not%20found`);
  }

  const safeName = file.name.replaceAll("/", "-").replaceAll("\\", "-");
  const path = `${user.id}/${submissionId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("submissions")
    .upload(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    redirect(
      `/dashboard/submissions/${submissionId}?error=${encodeURIComponent(
        uploadError.message,
      )}`,
    );
  }

  const { error: insertError } = await supabase.from("submission_files").insert({
    submission_id: submissionId,
    user_id: user.id,
    kind,
    path,
  });

  if (insertError) {
    redirect(
      `/dashboard/submissions/${submissionId}?error=${encodeURIComponent(
        insertError.message,
      )}`,
    );
  }

  revalidatePath(`/dashboard/submissions/${submissionId}`);
}
