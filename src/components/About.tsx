"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import SectionTag from "./SectionTag";
import ScrollLitText from "./fx/ScrollLitText";
import Counter from "./fx/Counter";
import VelocityMarquee from "./fx/VelocityMarquee";

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

/** Manifesto, bio and numbers — the body of the /about page. */
export default function About() {
  return (
    <section id="about" className="relative pt-20 pb-28 md:pt-28 md:pb-40">
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
