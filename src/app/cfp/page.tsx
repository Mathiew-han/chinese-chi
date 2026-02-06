import { Markdown } from "@/components/Markdown";
import { readSiteMarkdown } from "@/lib/site-content";

export default async function CfpPage() {
  const content = await readSiteMarkdown("cfp");
  return <Markdown content={content} />;
}
