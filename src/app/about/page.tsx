import { Markdown } from "@/components/Markdown";
import { readSiteMarkdown } from "@/lib/site-content";

export default async function AboutPage() {
  const content = await readSiteMarkdown("about");
  return <Markdown content={content} />;
}
