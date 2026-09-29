"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { profile } from "@/data/profile";
import { scrollToTarget } from "@/lib/smooth-scroll";
import LocalClock from "./fx/LocalClock";
import TLink from "./transition/TLink";

const PAGES = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const nameY = useTransform(scrollYProgress, [0, 1], ["70%", "0%"]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-line">
      <div className="grid gap-12 px-6 pt-16 pb-12 md:grid-cols-[1.4fr_1fr_1fr] md:px-12">
        <button onClick={copyEmail} className="group text-left" data-cursor-label={copied ? "Done" : "Copy"}>
          <span className="eyebrow mb-3 block">Email — click to copy</span>
          <span className="relative block overflow-hidden font-display text-lg md:text-3xl font-semibold tracking-tight">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? "copied" : "email"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                className={`block ${copied ? "text-gold" : ""}`}
              >
                {copied ? "Copied to clipboard ✓" : profile.email}
              </motion.span>
            </AnimatePresence>
          </span>
        </button>

        <div>
          <span className="eyebrow mb-4 block">Pages</span>
          <ul className="space-y-2 font-mono text-[12px] tracking-[0.2em] uppercase">
            {PAGES.map((p) => (
              <li key={p.href}>
                <TLink href={p.href} className="transition-colors hover:text-gold">
                  {p.label}
                </TLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="eyebrow mb-4 block">Elsewhere</span>
          <ul className="space-y-2 font-mono text-[12px] tracking-[0.2em] uppercase">
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-gold">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-6 pb-4 font-mono text-[10px] tracking-[0.25em] uppercase text-muted md:flex-row md:items-center md:justify-between md:px-12">
        <span>
          © {new Date().getFullYear()} {profile.name} — Built with Next.js, WebGL & GSAP
        </span>
        <span className="flex items-center gap-6">
          <LocalClock />
          <button onClick={() => scrollToTarget(0)} className="text-ink transition-colors hover:text-gold">
            Back to top ↑
          </button>
        </span>
      </div>

      <div className="overflow-hidden border-t border-line">
        <motion.p
          style={{ y: nameY }}
          aria-hidden="true"
          className="whitespace-nowrap pt-4 text-center font-display text-[7vw] font-black uppercase leading-[0.8] tracking-[-0.05em] text-molten"
        >
          {profile.name}
        </motion.p>
      </div>
    </footer>
  );
}
