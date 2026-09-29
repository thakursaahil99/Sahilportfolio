"use client";

import { motion } from "framer-motion";
import { skillGroups, skills } from "@/data/profile";
import SectionTag from "./SectionTag";
import RevealText from "./fx/RevealText";
import SpotlightCard from "./fx/SpotlightCard";

const SEGMENTS = 24;
const EASE = [0.16, 1, 0.3, 1] as const;

function PowerBar({ level, index }: { level: number; index: number }) {
  const lit = Math.round((level / 100) * SEGMENTS);
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: SEGMENTS }, (_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.08, scaleY: 0.4 }}
          whileInView={i < lit ? { opacity: 1, scaleY: 1 } : { opacity: 0.08, scaleY: 0.4 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.4, delay: index * 0.12 + i * 0.025, ease: EASE }}
          className={`h-5 flex-1 origin-bottom rounded-[2px] ${
            i < lit ? (i > SEGMENTS * 0.8 ? "bg-gold" : "bg-red") : "bg-ink"
          }`}
        />
      ))}
    </div>
  );
}

export default function Arsenal() {
  return (
    <section id="arsenal" className="relative px-6 py-28 md:px-12 md:py-40">
      <SectionTag index="03" label="Arsenal — Suit modules" />

      <div className="mb-16 flex flex-col gap-8 md:mb-24 md:flex-row md:items-end md:justify-between">
        <RevealText
          as="h2"
          text="Tech that powers the armour."
          className="max-w-4xl font-display text-[9vw] md:text-[3.6vw] font-black uppercase leading-[0.9] tracking-[-0.04em]"
        />
        <p className="max-w-sm text-muted">
          A battle-tested stack for building storefronts, platforms and intelligent interfaces — end to end.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 [perspective:1400px]">
        {/* power levels */}
        <SpotlightCard className="p-6 md:col-span-2 md:row-span-2 md:p-10" tilt={3}>
          <div className="mb-10 flex items-center justify-between">
            <p className="eyebrow">Power levels</p>
            <span className="font-mono text-[10px] tracking-[0.25em] text-gold">SYS.DIAG ●</span>
          </div>
          <ul className="space-y-7">
            {skills.map((s, i) => (
              <li key={s.name}>
                <div className="mb-2.5 flex items-baseline justify-between gap-4">
                  <span className="font-display text-sm md:text-base font-semibold uppercase tracking-tight">{s.name}</span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-muted">
                    {s.meta} · <span className="text-ink">{s.level}%</span>
                  </span>
                </div>
                <PowerBar level={s.level} index={i} />
              </li>
            ))}
          </ul>
        </SpotlightCard>

        {/* module cards */}
        {skillGroups.map((g, i) => (
          <SpotlightCard
            key={g.category}
            // first four sit beside the power-levels card; the rest span a full row between them
            className={`group flex min-h-[240px] flex-col justify-between p-6 md:p-8 ${i >= 4 ? "md:col-span-2" : ""}`}
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-[10px] tracking-[0.25em] text-red">MOD-{String(i + 1).padStart(2, "0")}</span>
              <svg viewBox="0 0 40 40" className="h-10 w-10 text-ink/30 transition-colors duration-500 group-hover:text-gold">
                <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" className="origin-center animate-spin-slow" />
                <circle cx="20" cy="20" r="6" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h3 className="mb-4 font-display text-2xl font-black uppercase tracking-tight">{g.category}</h3>
              <ul className="flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase text-ink/80 transition-colors duration-300 group-hover:border-ink/30"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}
