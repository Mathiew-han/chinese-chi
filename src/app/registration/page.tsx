import { Markdown } from "@/components/Markdown";
import { readSiteMarkdown } from "@/lib/site-content";

export default async function RegistrationPage() {
  const content = await readSiteMarkdown("registration");
  return <Markdown content={content} />;
}
