import { Markdown } from "@/components/Markdown";
import { readSiteMarkdown } from "@/lib/site-content";

export default async function NewsPage() {
  const content = await readSiteMarkdown("news");
  return <Markdown content={content} />;
}
