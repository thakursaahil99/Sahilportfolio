"use client";

import { motion } from "framer-motion";
import { skillGroups, skills } from "@/data/profile";
import { projects } from "@/data/projects";
import SectionTag from "./SectionTag";
import RevealText from "./fx/RevealText";
import SpotlightCard from "./fx/SpotlightCard";
import TLink from "./transition/TLink";

const OUT = [0.16, 1, 0.3, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

/** Shipped projects whose stack includes any of the skill's names (prefix match, e.g. "Next.js 16"). */
const projectsUsing = (match: string[]) =>
  projects.filter((p) => p.stack.some((g) => g.items.some((item) => match.some((m) => item.startsWith(m)))));

export default function Arsenal({ index = "03" }: { index?: string }) {
  return (
    <section id="arsenal" className="relative px-6 py-28 md:px-12 md:py-40">
      <SectionTag index={index} label="Arsenal — Suit modules" />

      <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
        <RevealText
          as="h2"
          text="Tech that powers the armour."
          className="block max-w-5xl font-display text-[12vw] font-black uppercase leading-[0.88] tracking-[-0.05em] md:text-[6vw]"
        />
        <p className="max-w-xs text-sm leading-relaxed text-ink/60 md:text-right">
          No self-rated percentages — just the tools, how long I&apos;ve used them and the shipped projects they power.
        </p>
      </div>

      {/* core stack: evidence, not progress bars */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 [perspective:1400px]">
        {skills.map((s, i) => {
          const used = projectsUsing(s.match);
          return (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: OUT, delay: (i % 4) * 0.07 }}
              className={i === 0 ? "sm:col-span-2" : ""}
            >
              <SpotlightCard className="group flex h-full flex-col justify-between gap-8 rounded-2xl border border-line bg-panel p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-red">CORE {pad(i + 1)}</span>
                  {s.years && (
                    <span className="rounded-full border border-ink/20 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-ink/80">{s.years}</span>
                  )}
                </div>
                <div>
                  <h3
                    className={`font-display font-black uppercase leading-[0.9] tracking-[-0.04em] ${
                      i === 0 ? "text-[10vw] md:text-[3.6vw]" : "text-2xl md:text-[1.6vw]"
                    }`}
                  >
                    {s.name}
                  </h3>
                  <p className="mt-4 flex items-baseline gap-2">
                    <span className={`font-display font-black text-molten ${i === 0 ? "text-6xl md:text-7xl" : "text-4xl"}`}>
                      {used.length}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
                      shipped project{used.length === 1 ? "" : "s"}
                    </span>
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {used.map((p) => (
                      <li key={p.slug}>
                        <TLink
                          href={`/work/${p.slug}`}
                          className="inline-block rounded-full border border-line px-2.5 py-1 font-mono text-[9px] tracking-[0.15em] uppercase text-ink/70 transition-colors hover:border-gold hover:text-gold"
                        >
                          {p.title}
                        </TLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </div>

      {/* everything else in the toolbox */}
      <div className="mt-20 border-t border-line md:mt-28">
        {skillGroups.map((g, i) => (
          <motion.div
            key={g.category}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: OUT }}
            className="group grid gap-5 border-b border-line py-8 md:grid-cols-[80px_1fr_1.6fr] md:items-center md:gap-10 md:py-10"
          >
            <span className="font-mono text-[11px] tracking-[0.3em] text-red">MOD-{pad(i + 1)}</span>
            <h3 className="font-display text-[9vw] font-black uppercase leading-none tracking-[-0.04em] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 md:text-[2.8vw]">
              {g.category}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {g.items.map((item, k) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: OUT, delay: 0.1 + k * 0.03 }}
                  whileHover={{ y: -3 }}
                  className="rounded-full border border-ink/20 px-4 py-2 font-mono text-[11px] tracking-[0.12em] uppercase text-ink/85 transition-colors hover:border-gold hover:text-gold"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
