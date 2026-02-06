import { Markdown } from "@/components/Markdown";
import { readSiteMarkdown } from "@/lib/site-content";

export default async function KeynotesPage() {
  const content = await readSiteMarkdown("keynotes");
  return <Markdown content={content} />;
}
