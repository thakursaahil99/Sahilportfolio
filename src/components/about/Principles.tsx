"use client";

import { motion } from "framer-motion";
import SectionTag from "../SectionTag";
import RevealText from "../fx/RevealText";

const PRINCIPLES = [
  {
    title: "Speed is a feature",
    body: "Every millisecond is earned — lean bundles, smart caching and images that never block the first paint.",
  },
  {
    title: "Real over demo",
    body: "Real databases, real auth, real payments. If a feature is on screen, it works end to end.",
  },
  {
    title: "Motion with meaning",
    body: "Animation guides the eye and tells the story. It never gets in the way of the content.",
  },
  {
    title: "Own the whole stack",
    body: "From schema to shader — one person who can reason about the database, the API and the pixels.",
  },
];

export default function Principles() {
  return (
    <section className="px-6 py-28 md:px-12 md:py-40">
      <SectionTag index="04" label="Principles — Operating system" />
      <RevealText
        as="h2"
        text="How I build."
        className="mb-16 block font-display text-[9vw] md:text-[3.6vw] font-black uppercase leading-[0.9] tracking-[-0.04em] md:mb-24"
      />
      <div className="grid border-t border-l border-line md:grid-cols-2 lg:grid-cols-4">
        {PRINCIPLES.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex min-h-[340px] flex-col justify-between overflow-hidden border-r border-b border-line p-6 md:p-8"
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-gold transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100" />
            <span className="relative font-display text-5xl font-black text-ink/15 transition-colors duration-500 group-hover:text-background/30">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="relative transition-colors duration-500 group-hover:text-background">
              <h3 className="mb-3 font-display text-xl font-black uppercase tracking-tight">{p.title}</h3>
              <p className="text-sm leading-relaxed text-muted transition-colors duration-500 group-hover:text-background/80">
                {p.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
