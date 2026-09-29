"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import SectionTag from "./SectionTag";
import ScrollLitText from "./fx/ScrollLitText";
import Counter from "./fx/Counter";
import VelocityMarquee from "./fx/VelocityMarquee";
import TLink from "./transition/TLink";
import PhotoReel from "./PhotoReel";

const MANIFESTO =
  "I build digital armour for brands — fast storefronts, scalable APIs and AI-powered interfaces that feel cinematic, load instantly and convert. Every pixel engineered, every millisecond earned.";

const TICKER = [
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "TypeScript",
  "Magento 2",
  "Laravel",
  "GraphQL",
  "PostgreSQL",
  "AI Interfaces",
];

/** `teaser` adds a link through to the full /about page (used on the home page). */
export default function About({ teaser = false }: { teaser?: boolean }) {
  return (
    <section id="about" className="relative pt-20 pb-28 md:pt-28 md:pb-40">
      {teaser && (
        <>
          <div className="mb-2 grid gap-6 px-6 md:grid-cols-[1fr_auto] md:items-end md:px-12">
            <div>
              <p className="eyebrow mb-4">(00) — Selected screens</p>
              <h2 className="font-display text-[7vw] md:text-[2.6vw] font-black uppercase leading-[0.95] tracking-[-0.03em]">
                A wall of things I&apos;ve <span className="text-molten">shipped.</span>
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Real screens from platforms, storefronts and AI tools — hover any tile to open its case study.
            </p>
          </div>
          <PhotoReel />
        </>
      )}

      {/* slim tech strip */}
      <div className="mb-24 border-y border-line py-4 md:mb-32">
        <VelocityMarquee baseVelocity={-2}>
          {TICKER.map((t) => (
            <span key={t} className="flex items-center font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-ink/70">
              <span className="px-6">{t}</span>
              <span className="text-red">✦</span>
            </span>
          ))}
        </VelocityMarquee>
      </div>

      <div className="px-6 md:px-12">
        <SectionTag index="01" label="About — The person inside the suit" />

        <ScrollLitText
          text={MANIFESTO}
          highlight={["armour", "cinematic", "engineered"]}
          className="max-w-6xl font-display text-[5.2vw] md:text-[2.4vw] font-medium leading-[1.08] tracking-[-0.03em]"
        />

        <div className="mt-24 grid gap-16 md:mt-36 md:grid-cols-[1fr_1.4fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 text-base md:text-lg leading-relaxed text-muted"
          >
            {profile.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-ink/70">
              Based in {profile.location}
            </p>
            {teaser && (
              <TLink
                href="/about"
                className="group inline-flex items-center gap-3 pt-4 font-mono text-[11px] tracking-[0.25em] uppercase text-ink"
              >
                <span className="relative">
                  The full story
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-gold transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/30 transition-all duration-500 group-hover:bg-ink group-hover:text-background">
                  →
                </span>
              </TLink>
            )}
          </motion.div>

          <div className="grid grid-cols-2 border-t border-l border-line">
            {profile.stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="group relative overflow-hidden border-r border-b border-line p-6 md:p-10"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-panel transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100" />
                <Counter
                  to={s.value}
                  suffix={s.suffix}
                  className="relative block font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-ink"
                />
                <p className="relative mt-3 eyebrow">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
