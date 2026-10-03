"use client";

import { motion } from "framer-motion";
import SectionTag from "../SectionTag";
import RevealText from "../fx/RevealText";
import SpotlightCard from "../fx/SpotlightCard";

const OUT = [0.16, 1, 0.3, 1] as const;

const ITEMS = [
  { glyph: "⚡", title: "Fast by default", desc: "Optimised images, code-splitting and static rendering wherever it fits — speed is a feature." },
  { glyph: "▣", title: "Every screen size", desc: "Layouts designed for phones first and tested up to wide desktop displays." },
  { glyph: "◎", title: "SEO-ready", desc: "Semantic markup, metadata and social previews so the site is easy to find and share." },
  { glyph: "◐", title: "Motion that performs", desc: "Animations tuned to stay smooth on low-power devices, not just on the latest laptop." },
  { glyph: "{ }", title: "Clean handoff", desc: "A typed, readable codebase in your own repository, with notes on how it all fits together." },
  { glyph: "↺", title: "After launch", desc: "Fixes, improvements and new features once real users arrive." },
];

export default function Deliverables({ index = "04" }: { index?: string }) {
  return (
    <section className="relative px-6 pt-28 md:px-12 md:pt-40">
      <SectionTag index={index} label="Included — Every project" />
      <RevealText
        as="h2"
        text="What you get, every time."
        className="block max-w-4xl font-display text-[9vw] font-black uppercase leading-[0.9] tracking-[-0.04em] md:text-[3.6vw]"
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
        {ITEMS.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 50, rotate: i % 2 ? 2 : -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: OUT, delay: (i % 3) * 0.08 }}
          >
            <SpotlightCard className="group h-full rounded-2xl border border-line bg-panel p-7 md:p-9">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-ink/20 font-display text-xl text-gold transition-transform duration-700 group-hover:rotate-[25deg] group-hover:scale-110">
                {it.glyph}
              </span>
              <h3 className="mt-10 font-display text-2xl font-black uppercase tracking-tight md:text-3xl">{it.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70 md:text-base">{it.desc}</p>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
