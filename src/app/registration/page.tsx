import Image from "next/image";

import { Markdown } from "@/components/Markdown";
import { readSiteMarkdown } from "@/lib/site-content";

import registrationArea from "../../../images/registration_Area.png";

export default async function RegistrationPage() {
  const content = await readSiteMarkdown("registration");
  return (
    <div className="space-y-8">
      <Markdown content={content} />
      <section className="space-y-6">
        <div className="text-lg font-semibold tracking-wide text-black/85 dark:text-white/85">
          注册与报到
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="glass-panel p-4">
            <div className="overflow-hidden">
              <Image
                src={registrationArea}
                alt="registration_Area.png"
                width={900}
                height={600}
                className="h-48 w-full object-cover sm:h-56"
              />
            </div>
            <div className="mt-3 text-sm font-semibold text-black/75 dark:text-white/75">
              registration_Area.png
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
