"use client";

import { useRef } from "react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { profile } from "@/data/profile";
import { useCopyEmail } from "@/lib/use-copy-email";
import SectionTag from "./SectionTag";
import Magnetic from "./fx/Magnetic";
import SpotlightCard from "./fx/SpotlightCard";
import VelocityMarquee from "./fx/VelocityMarquee";
import LocalClock from "./fx/LocalClock";
import TLink from "./transition/TLink";

const RING_TEXT = `${profile.status} • ${new Date().getFullYear()} • Let's talk • `;
const EASE = [0.76, 0, 0.24, 1] as const;
const OUT = [0.16, 1, 0.3, 1] as const;

const card = {
  hidden: { opacity: 0, y: 60 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease: OUT, delay: i * 0.08 } }),
};

/** Full-screen closing section: marquee, scroll-driven headline, big magnetic button, contact cards. */
export default function ContactCTA({ index = "05" }: { index?: string }) {
  const ref = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const { copied, copy } = useCopyEmail();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  // the headline tracks its own position: on phones the section is very tall, so its
  // centre arrives long after the headline has scrolled past
  const { scrollYProgress: headProgress } = useScroll({ target: headRef, offset: ["start end", "start 0.4"] });
  const hp = useSpring(headProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const leftX = useTransform(hp, [0, 1], ["-35%", "0%"]);
  const rightX = useTransform(hp, [0, 1], ["35%", "0%"]);
  const btnScale = useTransform(p, [0.3, 1], [0.55, 1]);
  const btnRotate = useTransform(p, [0, 1], [-90, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 pb-20 md:pt-40 md:pb-28">
      {/* molten glow behind everything */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(255_45_32/0.16),transparent)]" />

      <div className="relative px-6 md:px-12">
        <SectionTag index={index} label="Contact — Open a channel" />
      </div>

      {/* giant marquee band */}
      <div className="relative -rotate-2 border-y border-line bg-panel/60 py-4 md:py-6">
        <VelocityMarquee baseVelocity={2.5}>
          {["Let's work together", "Got a project?", "Start something legendary"].map((t) => (
            <span key={t} className="flex items-center">
              <span className="px-6 font-display text-[12vw] font-black uppercase leading-none tracking-[-0.04em] md:text-[7vw]">
                {t}
              </span>
              <span className="text-[6vw] text-red md:text-[3.5vw]">✦</span>
            </span>
          ))}
        </VelocityMarquee>
      </div>

      <div className="relative mt-20 grid gap-14 px-6 md:mt-28 md:grid-cols-[1fr_auto] md:items-center md:px-12">
        <div>
          <motion.p
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-line px-4 py-2 font-mono text-[10px] tracking-[0.25em] uppercase text-ink/80"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: OUT }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {profile.status} — {new Date().getFullYear()}
          </motion.p>

          <h2 ref={headRef} className="font-display font-black uppercase leading-[0.86] tracking-[-0.05em] text-[12.5vw] md:text-[8.5vw]">
            <motion.span className="block" style={{ x: leftX }}>
              Got a
            </motion.span>
            <motion.span className="block text-molten" style={{ x: rightX }}>
              project?
            </motion.span>
          </h2>

          <motion.p
            className="mt-8 max-w-lg text-base leading-relaxed text-ink/70 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: OUT, delay: 0.15 }}
          >
            eCommerce stores, web apps and AI-powered interfaces. Tell me what you&apos;re building and I&apos;ll get
            back to you.
          </motion.p>
        </div>

        {/* big orbiting magnetic button */}
        <motion.div style={{ scale: btnScale, rotate: btnRotate }} className="justify-self-center md:justify-self-end">
          <Magnetic strength={0.4}>
            <TLink
              href="/contact"
              data-cursor-label="Let's go"
              className="group relative flex h-64 w-64 items-center justify-center md:h-80 md:w-80"
            >
              <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow">
                <defs>
                  <path id="cta-ring" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
                </defs>
                <text className="fill-ink/60 font-mono text-[10px] uppercase">
                  {/* stretch the phrase to exactly one lap of the circle */}
                  <textPath href="#cta-ring" textLength={2 * Math.PI * 88 - 6} lengthAdjust="spacing">
                    {RING_TEXT}
                  </textPath>
                </text>
              </svg>
              <span className="relative flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-red text-center font-display text-lg font-black uppercase leading-tight tracking-tight text-ink md:h-56 md:w-56 md:text-2xl">
                {/* fill sweeps up from the bottom on hover */}
                <span className="absolute inset-0 translate-y-full rounded-full bg-ink transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />
                <span className="relative transition-colors duration-500 group-hover:text-background">
                  Start a<br />
                  project
                  <span className="mt-2 block text-3xl transition-transform duration-500 group-hover:translate-x-2 md:text-4xl">
                    →
                  </span>
                </span>
              </span>
            </TLink>
          </Magnetic>
        </motion.div>
      </div>

      {/* ways to reach me */}
      <div className="relative mt-20 grid gap-4 px-6 sm:grid-cols-2 md:mt-28 md:px-12 lg:grid-cols-4">
        <motion.div custom={0} variants={card} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <SpotlightCard className="h-full rounded-2xl border border-line bg-panel">
            <button onClick={copy} className="flex h-full w-full flex-col justify-between gap-10 p-6 text-left" data-cursor-label="Copy">
              <span className="flex items-center justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-muted">
                Email <span className="text-lg text-ink/70">⧉</span>
              </span>
              <span className="relative block overflow-hidden font-display text-sm font-semibold break-all md:text-base">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "copied" : "email"}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className={`block ${copied ? "text-gold" : ""}`}
                  >
                    {copied ? "Copied to clipboard ✓" : profile.email}
                  </motion.span>
                </AnimatePresence>
              </span>
            </button>
          </SpotlightCard>
        </motion.div>

        {profile.socials.map((s, i) => (
          <motion.div key={s.label} custom={i + 1} variants={card} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
            <SpotlightCard className="h-full rounded-2xl border border-line bg-panel">
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col justify-between gap-10 p-6"
              >
                <span className="flex items-center justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-muted">
                  Elsewhere
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-500 group-hover:rotate-45 group-hover:bg-ink group-hover:text-background">
                    ↗
                  </span>
                </span>
                <span className="font-display text-2xl font-black uppercase tracking-tight md:text-3xl">{s.label}</span>
              </a>
            </SpotlightCard>
          </motion.div>
        ))}

        <motion.div custom={profile.socials.length + 1} variants={card} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <SpotlightCard className="h-full rounded-2xl border border-line bg-panel">
            <div className="flex h-full flex-col justify-between gap-10 p-6">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted">Local time</span>
              <div>
                <span className="block font-display text-2xl font-black tabular-nums md:text-3xl">
                  <LocalClock />
                </span>
                <span className="mt-1 block font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60">
                  {profile.location.split(",")[0]}, India
                </span>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>
      </div>
    </section>
  );
}
