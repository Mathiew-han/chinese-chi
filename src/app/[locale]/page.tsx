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

      <section className="mx-auto w-full max-w-6xl px-4 pb-14">
        <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/important-dates"
              className="glass-panel px-5 py-5 transition-transform duration-300 ease-out hover:-translate-y-0.5"
            >
              <div className="text-sm font-semibold">{t("importantDates")}</div>
              <div className="mt-1 text-sm text-black/65 dark:text-white/65 opacity-80">
                Key milestones and deadlines
              </div>
            </Link>
            <Link
              href="/cfp"
              className="glass-panel px-5 py-5 transition-transform duration-300 ease-out hover:-translate-y-0.5"
            >
              <div className="text-sm font-semibold">{t("cfp")}</div>
              <div className="mt-1 text-sm text-black/65 dark:text-white/65 opacity-80">
                Submissions and decisions
              </div>
            </Link>
            <Link
              href="/registration"
              className="glass-panel px-5 py-5 transition-transform duration-300 ease-out hover:-translate-y-0.5"
            >
              <div className="text-sm font-semibold">{t("attend")}</div>
              <div className="mt-1 text-sm text-black/65 dark:text-white/65 opacity-80">
                Registration and travel
              </div>
            </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-panel px-6 py-8">
            <div className="text-sm font-semibold tracking-[0.2em] text-black/60 dark:text-white/60">
              {t("aboutTitle")}
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-black/85 dark:text-white/85">
              {t("aboutSubtitle")}
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-black/75 dark:text-white/75 sm:text-base">
              <p>{t("aboutP1")}</p>
              <p>{t("aboutP2")}</p>
              <p>{t("aboutP3")}</p>
            </div>
            <div className="mt-6">
              <Link href="/registration" className="glass px-6 py-2 text-sm font-semibold">
                {t("registerNow")}
              </Link>
            </div>
          </div>
          <div className="glass-panel px-6 py-8">
            <div className="text-sm font-semibold tracking-[0.2em] text-black/60 dark:text-white/60">
              {t("themeTitle")}
            </div>
            <div className="mt-4 space-y-4 text-sm text-black/75 dark:text-white/75">
              <div className="text-lg font-semibold text-black/85 dark:text-white/85">
                {t("themeSubtitle")}
              </div>
              <div className="text-sm leading-relaxed text-black/70 dark:text-white/70">
                {t("themeDescription")}
              </div>
              <div className="grid gap-3 text-xs font-medium uppercase tracking-[0.2em] text-black/50 dark:text-white/50">
                <div>Research · Design · Art · Industry</div>
                <div>Human-Centered AI · Cultural Computing · Responsible Tech</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-panel px-6 py-8">
            <div className="text-sm font-semibold tracking-[0.2em] text-black/60 dark:text-white/60">
              {t("keynotesTitle")}
            </div>
            <div className="mt-3 text-lg font-semibold text-black/85 dark:text-white/85">
              {t("keynotesSubtitle")}
            </div>
            <div className="mt-4 space-y-3 text-sm text-black/75 dark:text-white/75">
              <div className="italic opacity-60">
                Details to be announced...
              </div>
            </div>
            <div className="mt-5">
              <Link href="/keynotes" className="underline underline-offset-4 text-sm">
                {t("viewDetails")}
              </Link>
            </div>
          </div>
          <div className="glass-panel px-6 py-8">
            <div className="text-sm font-semibold tracking-[0.2em] text-black/60 dark:text-white/60">
              {t("milestonesTitle")}
            </div>
            <div className="mt-3 text-lg font-semibold text-black/85 dark:text-white/85">
              {t("milestonesSubtitle")}
            </div>
            <div className="mt-4 space-y-3 text-sm text-black/75 dark:text-white/75">
              <div>Early May · CFP Launch</div>
              <div>Late August · Submission Deadline</div>
              <div>Late September · Decisions</div>
            </div>
            <div className="mt-5">
              <Link href="/important-dates" className="underline underline-offset-4 text-sm">
                {t("viewSchedule")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20">
        <div className="glass-panel px-6 py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Image src={logo} alt="ICACHI" width={140} height={36} className="h-7 w-auto" />
              <div>
                <div className="text-sm font-semibold text-black/80 dark:text-white/80">{t("contact")}</div>
                <div className="text-sm text-black/60 dark:text-white/60">contact@ichec.org</div>
              </div>
            </div>
            <div className="text-sm">
              <Link href="/" className="underline underline-offset-4">{t("backToHome")}</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
