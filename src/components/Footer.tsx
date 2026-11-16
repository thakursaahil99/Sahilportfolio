"use client";

import { useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { NAV as PAGES } from "@/data/nav";
import { scrollToTarget } from "@/lib/smooth-scroll";
import { useCopyEmail } from "@/lib/use-copy-email";
import { openCommandMenu } from "./CommandMenu";
import LocalClock from "./fx/LocalClock";
import Magnetic from "./fx/Magnetic";
import Logo from "./Logo";
import TLink from "./transition/TLink";

const linkClass = "group inline-flex items-center transition-colors hover:text-gold";
const Dash = () => <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:mr-2 group-hover:w-4" />;

// newest builds first — the list in data/projects.ts is already ordered that way
const RECENT = projects.filter((p) => p.cover).slice(0, 4);
const STRIP = ["Available for full-time roles", "Freelance projects welcome", "Based in Bir Billing, India", "Remote-friendly · IST"];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { copied, copy } = useCopyEmail();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const nameY = useTransform(scrollYProgress, [0, 1], ["60%", "0%"]);

  return (
    <footer data-no-print ref={ref} className="relative mt-10 overflow-hidden rounded-t-[2rem] border-t border-line bg-panel md:rounded-t-[3rem]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red to-transparent" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[80vw] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(255_45_32/0.14),transparent)]" />

      {/* status strip */}
      <div className="relative border-b border-line py-3.5">
        {/* CSS marquee: the strip is rendered twice and slides by half its width */}
        <div className="overflow-hidden">
          <div className="marquee" style={{ "--marquee-duration": "38s" } as React.CSSProperties}>
            {[0, 1, 2, 3].map((copy) => (
              <div key={copy} className="flex shrink-0" aria-hidden={copy > 0}>
                {STRIP.map((t) => (
                  <span key={t} className="flex items-center font-mono text-[10px] tracking-[0.3em] uppercase text-ink/60 md:text-[11px]">
                    <span className="px-6">{t}</span>
                    <span className="text-red">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative grid grid-cols-2 gap-x-6 gap-y-12 px-6 pt-14 pb-12 md:px-12 md:pt-20 lg:grid-cols-[1.25fr_0.6fr_2fr_0.65fr] lg:gap-x-10">
        {/* brand */}
        <div className="col-span-2 lg:col-span-1">
          <div className="flex items-center gap-4">
            <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-full border border-ink/20">
              <Image src={profile.avatar} alt={profile.name} fill sizes="56px" className="object-cover" />
            </span>
            <div>
              <Logo className="text-2xl" />
              <p className="mt-1.5 flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase text-gold">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ddc84] opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#3ddc84]" />
                </span>
                {profile.status}
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink/60">
            {profile.role} based in {profile.location.split(",")[0]}, India — building platforms, storefronts and
            AI-powered interfaces that load fast and feel cinematic.
          </p>

          <button onClick={copy} className="group mt-8 block text-left" data-cursor-label={copied ? "Done" : "Copy"}>
            <span className="eyebrow mb-2 block">Email — tap to copy</span>
            <span className="relative block overflow-hidden font-display text-base font-semibold tracking-tight md:text-xl">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? "copied" : "email"}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                  className={`block ${copied ? "text-gold" : "transition-colors group-hover:text-gold"}`}
                >
                  {copied ? "Copied to clipboard ✓" : profile.email}
                </motion.span>
              </AnimatePresence>
            </span>
          </button>
        </div>

        {/* pages */}
        <nav aria-label="Footer">
          <span className="eyebrow mb-5 block">Pages</span>
          <ul className="space-y-3 font-mono text-[12px] tracking-[0.2em] uppercase">
            {[...PAGES, { label: "Résumé", href: "/resume" }].map((p) => (
              <li key={p.href}>
                <TLink href={p.href} className={linkClass}>
                  <Dash />
                  {p.label}
                </TLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* recent work, with thumbnails */}
        <div className="col-span-2 row-start-3 lg:col-span-1 lg:row-start-auto">
          <span className="eyebrow mb-5 flex items-center justify-between">
            Recent work
            <TLink href="/work" className="text-ink/70 transition-colors hover:text-gold">
              All {projects.length} →
            </TLink>
          </span>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {RECENT.map((p) => (
              <li key={p.slug}>
                <TLink
                  href={`/work/${p.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-line bg-background/40 p-2 transition-colors duration-300 hover:border-ink/30"
                >
                  <span className="relative block h-11 w-[64px] shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={p.cover!}
                      alt=""
                      fill
                      sizes="76px"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-[12px] font-bold uppercase tracking-tight">{p.title}</span>
                    <span className="block truncate font-mono text-[9px] tracking-[0.2em] uppercase text-muted">
                      {p.category} · {p.year}
                    </span>
                  </span>
                </TLink>
              </li>
            ))}
          </ul>
        </div>

        {/* elsewhere */}
        <div>
          <span className="eyebrow mb-5 block">Elsewhere</span>
          <ul className="space-y-3 font-mono text-[12px] tracking-[0.2em] uppercase">
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className={linkClass}>
                  <Dash />
                  {s.label} ↗
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${profile.email}`} className={linkClass}>
                <Dash />
                Email ↗
              </a>
            </li>
            <li>
              <button onClick={openCommandMenu} className={`${linkClass} uppercase`}>
                <Dash />
                Search ⌕
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative mx-6 flex flex-col gap-4 border-t border-line py-6 font-mono text-[10px] tracking-[0.25em] uppercase text-muted md:mx-12 md:flex-row md:items-center md:justify-between">
        <span>
          © {new Date().getFullYear()} {profile.name} — Designed &amp; built in the Himalaya
        </span>
        <span className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-3">
            <span>{profile.coordinates}</span>
            <LocalClock className="text-ink/80" />
          </span>
          <Magnetic>
            <button
              onClick={() => scrollToTarget(0)}
              aria-label="Back to top"
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 text-base text-ink transition-colors duration-300 hover:border-transparent hover:bg-red"
            >
              <span className="transition-transform duration-500 group-hover:-translate-y-0.5">↑</span>
            </button>
          </Magnetic>
        </span>
      </div>

      <div className="relative overflow-hidden px-6 md:px-12">
        <motion.p
          style={{ y: nameY }}
          aria-hidden="true"
          className="whitespace-nowrap pt-2 pb-[2vw] text-center font-display text-[8.6vw] font-black uppercase leading-[0.85] tracking-[-0.05em] text-molten md:text-[9.2vw]"
        >
          {profile.name}
        </motion.p>
      </div>
    </footer>
  );
}
