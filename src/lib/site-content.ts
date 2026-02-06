import { readFile } from "node:fs/promises";
import path from "node:path";

export async function readSiteMarkdown(slug: string): Promise<string> {
  const filePath = path.join(process.cwd(), "content", "site", `${slug}.md`);
  return await readFile(filePath, "utf8");
}
