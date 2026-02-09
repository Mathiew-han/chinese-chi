import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Markdown } from "@/components/Markdown";
import { readSiteMarkdown } from "@/lib/site-content";

import breakOutRoom1 from "../../../../images/break_out_room/1.png";
import breakOutRoom2 from "../../../../images/break_out_room/2.png";
import breakOutRoom3 from "../../../../images/break_out_room/3.png";
import floorplan from "../../../../images/floorplan.png";
import plenaryHall1 from "../../../../images/plenary_hall/1.png";
import plenaryHall2 from "../../../../images/plenary_hall/2.png";
import plenaryHall3 from "../../../../images/plenary_hall/3.png";
import plenaryHallImage from "../../../../images/plenary_hall/image.png";

export default async function VenuePage({ params }: { params: Promise<{ locale: string }> }) {
  const t = await getTranslations("Common");
  const { locale } = await params;
  const content = await readSiteMarkdown("venue", locale);
  const venueImages = [
    { src: floorplan, title: "floorplan.png" },
    { src: plenaryHallImage, title: "plenary_hall/image.png" },
    { src: plenaryHall1, title: "plenary_hall/1.png" },
    { src: plenaryHall2, title: "plenary_hall/2.png" },
    { src: plenaryHall3, title: "plenary_hall/3.png" },
    { src: breakOutRoom1, title: "break_out_room/1.png" },
    { src: breakOutRoom2, title: "break_out_room/2.png" },
    { src: breakOutRoom3, title: "break_out_room/3.png" },
  ];

  return (
    <div className="space-y-10">
      <Markdown content={content} />
      <section className="space-y-6">
        <div className="text-lg font-semibold tracking-wide text-black/85 dark:text-white/85">
          {t("venue")}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {venueImages.map((img) => (
            <div key={img.title} className="glass-panel p-4">
              <div className="overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.title}
                  width={900}
                  height={600}
                  className="h-44 w-full object-cover sm:h-48"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="mt-3 text-sm font-semibold text-black/75 dark:text-white/75">
                {img.title}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
