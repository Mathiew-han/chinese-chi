import Image from "next/image";

import { Markdown } from "@/components/Markdown";
import { readSiteMarkdown } from "@/lib/site-content";

import registrationArea from "../../../../images/registration_Area.png";

export default async function RegistrationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = await readSiteMarkdown("registration", locale);
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

      <section className="space-y-6">
        <div className="text-lg font-semibold tracking-wide text-black/85 dark:text-white/85">
          细则与政策（参考 2025 版）
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="glass-panel px-6 py-6 lg:col-span-2">
            <div className="text-sm font-semibold text-black/60 dark:text-white/60">Details</div>
            <div className="mt-2 text-sm text-black/75 dark:text-white/75">
              注册时间、费用档位、税费与操作注意事项；已录用论文注册要求；退款政策与注册权益。
            </div>
          </div>
          <div className="glass-panel px-6 py-6">
            <div className="text-sm font-semibold text-black/60 dark:text-white/60">Action</div>
            <div className="mt-4">
              <a href="#" className="glass px-5 py-2 text-sm font-semibold">了解更多</a>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="text-lg font-semibold tracking-wide text-black/85 dark:text-white/85">
          场地与住宿
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-panel px-6 py-6">
            <div className="text-sm font-semibold text-black/60 dark:text-white/60">Venue &amp; Maps</div>
            <div className="mt-2 space-y-2 text-sm text-black/75 dark:text-white/75">
              <a href="#" className="underline underline-offset-4">百度地图</a>
              <br />
              <a href="#" className="underline underline-offset-4">Google Maps</a>
            </div>
          </div>
          <div className="glass-panel px-6 py-6">
            <div className="text-sm font-semibold text-black/60 dark:text-white/60">Nearby Hotels</div>
            <table className="mt-3 w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="p-2">酒店</th>
                  <th className="p-2">步行</th>
                  <th className="p-2">链接</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                <tr>
                  <td className="p-2">Hotel Royal Queens（参考）</td>
                  <td className="p-2">10–15 分钟</td>
                  <td className="p-2"><a href="#" className="underline underline-offset-4">官网</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
