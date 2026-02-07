import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="flex min-h-[calc(110vh-96px)] min-h-[calc(110dvh-96px)] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-6xl font-light tracking-[0.08em] text-black/90 drop-shadow-sm dark:text-white/90 sm:text-8xl">
          ICHEC 2026
        </h1>

        <div className="mt-7 text-2xl font-semibold tracking-wide text-black/75 dark:text-white/75 sm:text-3xl">
          包容 · 智能 · 连接
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-wide text-black/80 dark:text-white/80">
          Inclusion · Intelligence · Connection
        </div>

        <div className="mt-7 h-px w-[min(560px,88vw)] bg-black/20 dark:bg-white/20" />

        <div className="mt-7 max-w-3xl text-base font-medium leading-relaxed text-black/75 dark:text-white/75 sm:text-lg">
          2026年11月23–26日，中国澳门永利皇宫
          <div className="mt-1 text-sm font-semibold opacity-80 sm:text-base">
            November 23–26, 2026 · Wynn Palace · Macau SAR, China
          </div>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/important-dates"
            className="glass px-6 py-2 text-sm font-semibold text-black/85 transition-transform duration-300 ease-out hover:-translate-y-0.5 dark:text-white/85"
          >
            重要日期
          </Link>
          <Link
            href="/cfp"
            className="glass px-6 py-2 text-sm font-semibold text-black/85 transition-transform duration-300 ease-out hover:-translate-y-0.5 dark:text-white/85"
          >
            征稿与征集
          </Link>
          <Link
            href="/program"
            className="glass px-6 py-2 text-sm font-semibold text-black/85 transition-transform duration-300 ease-out hover:-translate-y-0.5 dark:text-white/85"
          >
            大会日程
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-14">
        <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/important-dates"
              className="glass-panel px-5 py-5 transition-transform duration-300 ease-out hover:-translate-y-0.5"
            >
              <div className="text-sm font-semibold">重要日期</div>
              <div className="mt-1 text-sm text-black/65 dark:text-white/65">
                AoE 截止与投稿/注册节点
              </div>
            </Link>
            <Link
              href="/cfp"
              className="glass-panel px-5 py-5 transition-transform duration-300 ease-out hover:-translate-y-0.5"
            >
              <div className="text-sm font-semibold">For Authors</div>
              <div className="mt-1 text-sm text-black/65 dark:text-white/65">
                Two-round CFP, submissions and decisions
              </div>
            </Link>
            <Link
              href="/registration"
              className="glass-panel px-5 py-5 transition-transform duration-300 ease-out hover:-translate-y-0.5"
            >
              <div className="text-sm font-semibold">Attend</div>
              <div className="mt-1 text-sm text-black/65 dark:text-white/65">
                Registration, venue and travel
              </div>
            </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-panel px-6 py-8">
            <div className="text-sm font-semibold tracking-[0.2em] text-black/60 dark:text-white/60">
              About ICHEC 2026
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-black/85 dark:text-white/85">
              开放、包容、面向未来的人机交互共同体
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-black/75 dark:text-white/75 sm:text-base">
              <p>
                ICHEC 2026 将在中国澳门举办，延续人机交互（HCI）精神，聚焦人工智能与新兴技术如何与人类价值、文化和生活经验交织。
                作为从 Chinese CHI 升级而来的国际平台，我们期待连接研究、设计、艺术与产业实践，推动跨学科的对话与合作。
              </p>
              <p>
                大会覆盖 HCI 全域议题，从技术创新到批判性探究、从创意表达到可部署系统，欢迎来自全球的研究者、设计师、艺术家与技术专家共同分享成果与观点。
              </p>
              <p>
                我们鼓励以人为本、负责任的 AI 与交互技术实践，促进研究成果向社会应用的有效转化，塑造更包容、更具韧性的未来技术生态。
              </p>
            </div>
          </div>
          <div className="glass-panel px-6 py-8">
            <div className="text-sm font-semibold tracking-[0.2em] text-black/60 dark:text-white/60">
              Theme
            </div>
            <div className="mt-4 space-y-4 text-sm text-black/75 dark:text-white/75">
              <div className="text-lg font-semibold text-black/85 dark:text-white/85">
                包容 · 智能 · 连接
              </div>
              <div className="text-sm leading-relaxed text-black/70 dark:text-white/70">
                汇聚多元学科与文化背景，关注人机协作的社会影响与伦理边界，在智能化浪潮中强化人与技术的互信与共创。
              </div>
              <div className="grid gap-3 text-xs font-medium uppercase tracking-[0.2em] text-black/50 dark:text-white/50">
                <div>Research · Design · Art · Industry</div>
                <div>Human-Centered AI · Cultural Computing · Responsible Tech</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
