"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import SectionTag from "../SectionTag";
import RevealText from "../fx/RevealText";

const OUT = [0.16, 1, 0.3, 1] as const;

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

/** One principle: an outlined title that fills with molten colour as it scrolls through the viewport. */
function Row({ p, i }: { p: (typeof PRINCIPLES)[number]; i: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.35"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const clip = useTransform(fill, (v) => `inset(0 ${100 - v * 100}% 0 0)`);
  const numY = useTransform(fill, [0, 1], ["40%", "0%"]);

  return (
    <li ref={ref} className="group relative grid gap-6 border-b border-line py-10 md:grid-cols-[120px_1fr_320px] md:items-center md:gap-10 md:py-14">
      <motion.span style={{ y: numY }} className="font-mono text-sm tracking-[0.3em] text-red">
        ({String(i + 1).padStart(2, "0")})
      </motion.span>

      <h3 className="relative font-display text-[11vw] font-black uppercase leading-[0.9] tracking-[-0.05em] md:text-[5.6vw]">
        <span className="text-outline">{p.title}</span>
        {/* solid copy revealed left→right by scroll */}
        <motion.span aria-hidden="true" style={{ clipPath: clip }} className="text-molten absolute inset-0">
          {p.title}
        </motion.span>
      </h3>

      <motion.p
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease: OUT, delay: 0.15 }}
        className="text-base leading-relaxed text-ink/70 md:text-lg"
      >
        {p.body}
      </motion.p>
    </li>
  );
}

export default function Principles({ index = "05" }: { index?: string }) {
  return (
    <section className="px-6 py-28 md:px-12 md:py-40">
      <SectionTag index={index} label="Principles — Operating system" />
      <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
        <RevealText
          as="h2"
          text="How I build."
          className="block font-display text-[14vw] font-black uppercase leading-[0.88] tracking-[-0.05em] md:text-[7vw]"
        />
        <p className="max-w-xs text-sm leading-relaxed text-ink/60 md:text-right">
          Four rules I don&apos;t break, on every project — big or small.
        </p>
      </div>
      <ol className="border-t border-line">
        {PRINCIPLES.map((p, i) => (
          <Row key={p.title} p={p} i={i} />
        ))}
      </ol>
    </section>
  );
}
