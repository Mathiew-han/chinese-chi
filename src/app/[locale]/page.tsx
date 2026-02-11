import Image from "next/image";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

import logo from "../../../images/icachi-logo-dark.svg";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <div className="flex flex-col">
      <section className="-mt-8 flex min-h-[calc(110vh-96px)] min-h-[calc(110dvh-96px)] flex-col items-center justify-center px-4 text-center sm:-mt-12">
        <h1 className="text-6xl font-light tracking-[0.08em] text-black/90 drop-shadow-sm dark:text-white/90 sm:text-8xl">
          {t("title")}
        </h1>

        <div className="mt-7 text-2xl font-semibold tracking-wide text-black/75 dark:text-white/75 sm:text-3xl">
          {t("tagline")}
        </div>

        <div className="mt-7 h-px w-[min(560px,88vw)] bg-black/20 dark:bg-white/20" />

        <div className="mt-7 max-w-3xl text-base font-medium leading-relaxed text-black/75 dark:text-white/75 sm:text-lg">
          {t("date")} · {t("location")}
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/important-dates"
            className="glass px-6 py-2 text-sm font-semibold text-black/85 transition-transform duration-300 ease-out hover:-translate-y-0.5 dark:text-white/85"
          >
            {t("importantDates")}
          </Link>
          <Link
            href="/cfp"
            className="glass px-6 py-2 text-sm font-semibold text-black/85 transition-transform duration-300 ease-out hover:-translate-y-0.5 dark:text-white/85"
          >
            {t("cfp")}
          </Link>
          <Link
            href="/program"
            className="glass px-6 py-2 text-sm font-semibold text-black/85 transition-transform duration-300 ease-out hover:-translate-y-0.5 dark:text-white/85"
          >
            {t("program")}
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-32 pt-24">
        <div className="grid gap-12 md:grid-cols-3">
            <Link
              href="/important-dates"
              className="macau-card"
            >
              <p className="card-title">{t("importantDates")}</p>
              <p className="card-desc">Key milestones and deadlines</p>
              <div className="macau-corner">
                <div className="macau-arrow">→</div>
              </div>
            </Link>
            <Link
              href="/cfp"
              className="macau-card"
            >
              <p className="card-title">{t("cfp")}</p>
              <p className="card-desc">Submissions and decisions</p>
              <div className="macau-corner">
                <div className="macau-arrow">→</div>
              </div>
            </Link>
            <Link
              href="/registration"
              className="macau-card"
            >
              <p className="card-title">{t("attend")}</p>
              <p className="card-desc">Registration and travel</p>
              <div className="macau-corner">
                <div className="macau-arrow">→</div>
              </div>
            </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-32">
        <div className="grid gap-16 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="macau-card-large">
            <div className="inline-block px-4 py-1.5 rounded-sm bg-[#006c3f]/10 dark:bg-[#1db07c]/15 mb-5">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#006c3f] dark:text-[#1db07c]">
                {t("aboutTitle")}
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-black/90 dark:text-white/90 leading-snug">
              {t("aboutSubtitle")}
            </h2>
            <div className="mt-7 space-y-5 text-base leading-loose text-black/75 dark:text-white/75">
              <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-[#c9a154] first-letter:mr-1 first-letter:float-left first-letter:leading-none first-letter:mt-1">{t("aboutP1")}</p>
              <p>{t("aboutP2")}</p>
              <p>{t("aboutP3")}</p>
            </div>
            <div className="mt-8">
              <Link href="/registration" className="macau-cta">
                {t("registerNow")} <span className="macau-cta-arrow">→</span>
              </Link>
            </div>
          </div>
          <div className="macau-card-theme">
            <div className="inline-block px-4 py-1.5 rounded-sm bg-[#c9a154]/15 dark:bg-[#caa65a]/20 mb-5">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#8f6d2f] dark:text-[#caa65a]">
                {t("themeTitle")}
              </span>
            </div>
            <div className="space-y-5">
              <div className="text-xl font-bold text-black/90 dark:text-white/90 leading-tight">
                {t("themeSubtitle")}
              </div>
              <div className="text-sm leading-relaxed text-black/70 dark:text-white/70">
                {t("themeDescription")}
              </div>
              <div className="pt-4 space-y-3">
                <div className="macau-tag">Research · Design · Art · Industry</div>
                <div className="macau-tag">Human-Centered AI · Cultural Computing · Responsible Tech</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-32">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <Link href="/keynotes" className="macau-card-info">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-black/60 dark:text-white/60 block mb-4">
              {t("keynotesTitle")}
            </span>
            <p className="card-title-large">{t("keynotesSubtitle")}</p>
            <p className="card-desc-large mt-4">Details to be announced...</p>
            <div className="macau-corner-large">
              <div className="macau-arrow">→</div>
            </div>
          </Link>
          
          <div className="macau-timeline-box">
            <div className="mb-6">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-black/60 dark:text-white/60 block mb-2">
                {t("milestonesTitle")}
              </span>
              <p className="text-xl font-bold text-black/90 dark:text-white/90">{t("milestonesSubtitle")}</p>
            </div>
            
            <div className="timeline-step timeline-completed">
              <div className="timeline-circle">1</div>
              <div className="timeline-line"></div>
              <div className="timeline-content">
                <div className="timeline-title">{t("timelineCfpLaunch")}</div>
                <div className="timeline-status">{t("timelineStatusCompleted")}</div>
                <div className="timeline-time">{t("timelineEarlyMay")}</div>
              </div>
            </div>

            <div className="timeline-step timeline-active">
              <div className="timeline-circle">2</div>
              <div className="timeline-line"></div>
              <div className="timeline-content">
                <div className="timeline-title">{t("timelineSubmissionDeadline")}</div>
                <div className="timeline-status">{t("timelineStatusInProgress")}</div>
                <div className="timeline-time">{t("timelineLateAugust")}</div>
              </div>
            </div>

            <div className="timeline-step timeline-pending">
              <div className="timeline-circle">3</div>
              <div className="timeline-content">
                <div className="timeline-title">{t("timelineDecisions")}</div>
                <div className="timeline-status">{t("timelineStatusPending")}</div>
                <div className="timeline-time">{t("timelineLateSeptember")}</div>
              </div>
            </div>
            
            <div className="mt-6">
              <Link href="/important-dates" className="timeline-link">
                View Full Schedule →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-40">
        <div className="footer-card relative overflow-hidden">
          <div className="footer-pattern"></div>
          <div className="relative z-10 flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-6">
              <Image src={logo} alt="ICACHI" width={140} height={36} className="h-8 w-auto opacity-90" />
              <div className="h-12 w-px bg-black/15 dark:bg-white/15"></div>
              <div>
                <div className="text-sm font-bold text-black/85 dark:text-white/85 mb-1">{t("contact")}</div>
                <div className="text-sm text-black/65 dark:text-white/65 font-mono">contact@ichec.org</div>
              </div>
            </div>
            <div>
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-accent-green dark:text-accent-green-soft hover:gap-3 transition-all duration-300">
                {t("backToHome")} <span>↑</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

