import { Markdown } from "@/components/Markdown";
import { readSiteMarkdown } from "@/lib/site-content";

export default async function ImportantDatesPage() {
  const content = await readSiteMarkdown("important-dates");
  return <Markdown content={content} />;
}
