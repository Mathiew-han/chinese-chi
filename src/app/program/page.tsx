import { Markdown } from "@/components/Markdown";
import { readSiteMarkdown } from "@/lib/site-content";

export default async function ProgramPage() {
  const content = await readSiteMarkdown("program");
  return <Markdown content={content} />;
}
