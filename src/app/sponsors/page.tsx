import { Markdown } from "@/components/Markdown";
import { readSiteMarkdown } from "@/lib/site-content";

export default async function SponsorsPage() {
  const content = await readSiteMarkdown("sponsors");
  return <Markdown content={content} />;
}
