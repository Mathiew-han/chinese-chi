import { access, readFile } from "node:fs/promises";
import path from "node:path";

export async function readSiteMarkdown(slug: string, locale: string = "en"): Promise<string> {
  const baseDir = path.join(process.cwd(), "content", "site");

  const localizedPath = path.join(baseDir, `${slug}.${locale}.md`);
  try {
    await access(localizedPath);
    return await readFile(localizedPath, "utf8");
  } catch {
    const defaultPath = path.join(baseDir, `${slug}.md`);
    try {
      return await readFile(defaultPath, "utf8");
    } catch {
      return `Content for ${slug} not found.`;
    }
  }
}
