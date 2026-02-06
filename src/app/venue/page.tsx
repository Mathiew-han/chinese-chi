import { Markdown } from "@/components/Markdown";
import { readSiteMarkdown } from "@/lib/site-content";

export default async function VenuePage() {
  const content = await readSiteMarkdown("venue");
  return <Markdown content={content} />;
}
