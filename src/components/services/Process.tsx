"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import SectionTag from "../SectionTag";
import RevealText from "../fx/RevealText";

const STEPS = [
  {
    title: "Discover",
    desc: "A call to understand the business, the users and what success looks like. Out of it comes a clear scope and plan.",
    items: ["Goals & audience", "Scope & timeline", "Tech recommendations"],
  },
  {
    title: "Design",
    desc: "Wireframes, then high-fidelity screens and motion prototypes — so you see how it feels before a line of production code.",
    items: ["Wireframes", "UI design", "Motion prototypes"],
  },
  {
    title: "Build",
    desc: "Clean, typed code with frequent preview links. You follow progress live instead of waiting for a big reveal.",
    items: ["Frontend & backend", "CMS / API integrations", "Preview deployments"],
  },
  {
    title: "Launch & grow",
    desc: "Deployment, SEO and analytics, then iteration based on real data — with support after go-live.",
    items: ["Deploy & monitoring", "SEO & analytics", "Ongoing support"],
  },
];

function Step({ step, i, progress }: { step: (typeof STEPS)[number]; i: number; progress: MotionValue<number> }) {
  const n = STEPS.length;
  // each card lights up as the track scrolls it into the middle of the screen
  const lit = useTransform(progress, [(i - 0.6) / (n - 1), i / (n - 1), (i + 0.6) / (n - 1)], [0.35, 1, 0.35]);
  const fill = useTransform(progress, [(i - 1) / (n - 1), i / (n - 1)], ["0%", "100%"]);

  return (
    <motion.article
      style={{ opacity: lit }}
      className="relative flex h-[62vh] w-[82vw] shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-line bg-panel p-7 md:w-[46vw] md:p-12"
    >
      <span className="pointer-events-none absolute -right-4 -top-10 font-display text-[40vw] font-black leading-none text-ink/[0.04] md:text-[22vw]">
        {i + 1}
      </span>
      <div className="relative flex items-center gap-4">
        <span className="font-mono text-[11px] tracking-[0.3em] text-red">STEP {String(i + 1).padStart(2, "0")}</span>
        <span className="h-px flex-1 bg-line">
          <motion.span className="block h-full bg-gradient-to-r from-red to-gold" style={{ width: fill }} />
        </span>
      </div>
      <div className="relative">
        <h3 className="font-display text-[11vw] font-black uppercase leading-[0.9] tracking-[-0.04em] md:text-[4.5vw]">{step.title}</h3>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/70 md:text-lg">{step.desc}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {step.items.map((it) => (
            <li key={it} className="rounded-full border border-ink/20 px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase text-ink/80">
              {it}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

/** Pinned section: vertical scroll drives a horizontal track of process steps. */
export default function Process({ index = "03" }: { index?: string }) {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const x = useTransform(progress, [0, 1], [0, -distance]);

  useEffect(() => {
    const measure = () => {
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section className="relative pt-28 md:pt-40">
      <div className="px-6 md:px-12">
        <SectionTag index={index} label="Process — How we'll work" />
        <RevealText
          as="h2"
          text="Four steps from idea to launch."
          className="block max-w-4xl font-display text-[9vw] font-black uppercase leading-[0.9] tracking-[-0.04em] md:text-[3.6vw]"
        />
      </div>

      <div ref={section} className="relative h-[320vh]">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <motion.div ref={track} style={{ x }} className="flex gap-6 px-6 md:gap-8 md:px-12">
            {STEPS.map((s, i) => (
              <Step key={s.title} step={s} i={i} progress={progress} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
