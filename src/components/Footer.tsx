"use client";

import { useRef } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { profile } from "@/data/profile";
import { NAV as PAGES } from "@/data/nav";
import { scrollToTarget } from "@/lib/smooth-scroll";
import { useCopyEmail } from "@/lib/use-copy-email";
import LocalClock from "./fx/LocalClock";
import Logo from "./Logo";
import TLink from "./transition/TLink";


const linkClass = "group inline-flex items-center transition-colors hover:text-gold";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { copied, copy } = useCopyEmail();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const nameY = useTransform(scrollYProgress, [0, 1], ["60%", "0%"]);

  return (
    <footer data-no-print ref={ref} className="relative overflow-hidden border-t border-line">
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 px-6 pt-16 pb-12 md:grid-cols-[1.6fr_1fr_1fr] md:px-12 md:pt-20">
        <div className="col-span-2 md:col-span-1">
          <Logo className="text-3xl" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/60">
            {profile.role} based in {profile.location.split(",")[0]}, India. Building fast, modern web experiences.
          </p>

          <button onClick={copy} className="group mt-8 text-left" data-cursor-label={copied ? "Done" : "Copy"}>
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

        <nav aria-label="Footer">
          <span className="eyebrow mb-5 block">Pages</span>
          <ul className="space-y-3 font-mono text-[12px] tracking-[0.2em] uppercase">
            {PAGES.map((p) => (
              <li key={p.href}>
                <TLink href={p.href} className={linkClass}>
                  <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:mr-2 group-hover:w-4" />
                  {p.label}
                </TLink>
              </li>
            ))}
            <li>
              <TLink href="/resume" className={linkClass}>
                <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:mr-2 group-hover:w-4" />
                Résumé
              </TLink>
            </li>
          </ul>
        </nav>

        <div>
          <span className="eyebrow mb-5 block">Elsewhere</span>
          <ul className="space-y-3 font-mono text-[12px] tracking-[0.2em] uppercase">
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className={linkClass}>
                  <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:mr-2 group-hover:w-4" />
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-6 flex flex-col gap-4 border-t border-line py-6 font-mono text-[10px] tracking-[0.25em] uppercase text-muted md:mx-12 md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
        <span className="flex items-center justify-between gap-6">
          <LocalClock />
          <button
            onClick={() => scrollToTarget(0)}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 uppercase text-ink transition-colors hover:border-gold hover:text-gold"
          >
            Back to top ↑
          </button>
        </span>
      </div>

      <div className="overflow-hidden px-6 md:px-12">
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
