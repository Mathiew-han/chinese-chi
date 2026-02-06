export const MAX_SUBMISSION_FILE_BYTES = 25 * 1024 * 1024;

export const ALLOWED_SUBMISSION_FILE_KINDS = new Set(["paper", "supplement"]);

export const ALLOWED_SUBMISSION_MIME_TYPES = new Set(["application/pdf"]);

export function validateSubmissionFileUpload(file: File): string | null {
  if (file.size <= 0) return "Empty file";
  if (file.size > MAX_SUBMISSION_FILE_BYTES) return "File too large";

  const name = file.name.toLowerCase();
  if (!name.endsWith(".pdf")) return "Only PDF files are allowed";

  const type = file.type?.toLowerCase() ?? "";
  if (type && !ALLOWED_SUBMISSION_MIME_TYPES.has(type)) {
    return "Unsupported content type";
  }

  return null;
}
