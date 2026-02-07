import Image from "next/image";

import { Markdown } from "@/components/Markdown";
import { readSiteMarkdown } from "@/lib/site-content";

import ica3pp2024 from "../../../images/ICA3PP2024.png";
import scenicRound from "../../../images/圆形风景照.png";

export default async function AboutPage() {
  const content = await readSiteMarkdown("about");
  return (
    <div className="space-y-8">
      <Markdown content={content} />
      <section className="space-y-6">
        <div className="text-lg font-semibold tracking-wide text-black/85 dark:text-white/85">
          会议背景与形象
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="glass-panel p-4">
            <div className="overflow-hidden">
              <Image
                src={ica3pp2024}
                alt="ICA3PP2024.png"
                width={900}
                height={600}
                className="h-48 w-full object-cover sm:h-56"
              />
            </div>
            <div className="mt-3 text-sm font-semibold text-black/75 dark:text-white/75">
              ICA3PP2024.png
            </div>
          </div>
          <div className="glass-panel p-4">
            <div className="overflow-hidden">
              <Image
                src={scenicRound}
                alt="圆形风景照.png"
                width={900}
                height={600}
                className="h-48 w-full object-cover sm:h-56"
              />
            </div>
            <div className="mt-3 text-sm font-semibold text-black/75 dark:text-white/75">
              圆形风景照.png
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
