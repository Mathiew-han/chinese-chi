import Link from "next/link";
import { Markdown } from "@/components/Markdown";
import { readSiteMarkdown } from "@/lib/site-content";

export default async function CFPPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = await readSiteMarkdown("cfp", locale);
  return (
    <div className="space-y-10">
      <Markdown content={content} />

      <section className="space-y-6">
        <div className="text-lg font-semibold tracking-tight text-black/85 dark:text-white/85">
          投稿与征集（最小可用版本）
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="glass-panel px-6 py-6 lg:col-span-2">
            <div className="text-sm font-semibold text-black/60 dark:text-white/60">Submit</div>
            <div className="mt-2 text-sm text-black/75 dark:text-white/75">
              通过 EasyChair 提交稿件，需先登录账户。格式与模板要求请参见下方链接。
            </div>
            <div className="mt-4">
              <Link href="/auth" className="glass px-5 py-2 text-sm font-semibold">
                登录并提交
              </Link>
            </div>
          </div>
          <div className="glass-panel px-6 py-6">
            <div className="text-sm font-semibold text-black/60 dark:text-white/60">Links</div>
            <div className="mt-3 space-y-2 text-sm text-black/75 dark:text-white/75">
              <Link href="#" className="underline underline-offset-4">格式模板</Link>
              <Link href="#" className="underline underline-offset-4">查重入口 A</Link>
              <Link href="#" className="underline underline-offset-4">查重入口 B</Link>
              <Link href="#" className="underline underline-offset-4">文章处理费用</Link>
              <Link href="#" className="underline underline-offset-4">常见问题</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="text-lg font-semibold tracking-tight text-black/85 dark:text-white/85">
          互动与艺术板块征集
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-panel px-6 py-6">
            <div className="text-sm font-semibold text-black/60 dark:text-white/60">Overview</div>
            <div className="mt-2 text-sm text-black/75 dark:text-white/75">
              面向交互作品、艺术演示与部署系统，强调公共性与现场体验。
            </div>
            <div className="mt-4">
              <Link href="/auth" className="glass px-5 py-2 text-sm font-semibold">
                登录并提交
              </Link>
            </div>
          </div>
          <div className="glass-panel px-6 py-6">
            <div className="text-sm font-semibold text-black/60 dark:text-white/60">Guidelines</div>
            <div className="mt-2 text-sm text-black/75 dark:text-white/75">
              包含时间节点、材料要求、文档规范、评审标准及评审委员会信息。
            </div>
            <div className="mt-3 text-sm">
              <Link href="#" className="underline underline-offset-4">提交表格链接</Link>
              <span className="mx-2">·</span>
              <Link href="#" className="underline underline-offset-4">ACM 模板与出版流程</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
