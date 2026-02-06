import { Markdown } from "@/components/Markdown";
import { readSiteMarkdown } from "@/lib/site-content";

export default async function CommitteesPage() {
  const content = await readSiteMarkdown("committees");
  return <Markdown content={content} />;
}
