"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { experience } from "@/data/profile";
import { getProject } from "@/data/projects";
import SectionTag from "./SectionTag";
import RevealText from "./fx/RevealText";
import ProjectArt from "./work/ProjectArt";
import TLink from "./transition/TLink";

const EASE = [0.76, 0, 0.24, 1] as const;
const OUT = [0.16, 1, 0.3, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");
// "2026 — Present" → "2026"
const yearOf = (date: string) => date.match(/\d{4}/)?.[0] ?? date;

type Job = (typeof experience)[number];

function Mission({ job, i, onActive }: { job: Job; i: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const project = getProject(job.slug);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);

  useEffect(() => {
    if (inView) onActive(i);
  }, [inView, i, onActive]);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: OUT }}
      className="group relative overflow-hidden rounded-3xl border border-line bg-panel"
    >
      {/* screenshot with scroll parallax */}
      <TLink href={`/work/${job.slug}`} data-cursor-label="Case" className="relative block aspect-[16/9] overflow-hidden border-b border-line">
        <motion.div className="absolute inset-0" style={{ y: imgY, scale: imgScale }}>
          {project?.cover ? (
            <Image src={project.cover} alt={`${job.company} — project screenshot`} fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover object-top" />
          ) : (
            <ProjectArt accent={project?.accent ?? "blue"} />
          )}
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-panel via-panel/20 to-transparent" />
        <span className="absolute left-5 top-5 rounded-full border border-ink/20 bg-background/60 px-3 py-1.5 font-mono text-[10px] tracking-[0.25em] uppercase md:left-8 md:top-8">
          {job.date}
        </span>
        <span className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-xl text-background transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 group-hover:scale-110 md:right-8 md:top-8 md:h-14 md:w-14">
          ↗
        </span>
      </TLink>

      <div className="relative p-6 md:p-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <span className="font-mono text-[11px] tracking-[0.3em] text-red">MISSION {pad(i + 1)}</span>
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-gold">{job.role}</span>
        </div>

        <h3 className="mt-4 font-display text-[11vw] font-black uppercase leading-[0.88] tracking-[-0.05em] md:text-[4.6vw]">
          {job.company}
        </h3>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/75 md:text-lg">{job.description}</p>

        {project && (
          <ul className="mt-7 grid gap-3 md:grid-cols-3">
            {project.features.slice(0, 3).map((f, k) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: OUT, delay: 0.1 + k * 0.08 }}
                className="rounded-2xl border border-line bg-background/40 p-4 text-sm leading-snug text-ink/80"
              >
                <span className="mb-2 block font-mono text-[10px] text-red">{pad(k + 1)}</span>
                {f}
              </motion.li>
            ))}
          </ul>
        )}

        <div className="mt-7 flex flex-wrap items-center justify-between gap-5">
          <ul className="flex flex-wrap gap-2">
            {job.tech.map((t) => (
              <li key={t} className="rounded-full border border-ink/20 px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase text-ink/80">
                {t}
              </li>
            ))}
          </ul>
          <TLink
            href={`/work/${job.slug}`}
            className="group/btn relative inline-flex overflow-hidden rounded-full border border-ink/30 px-6 py-3 font-mono text-[10px] tracking-[0.25em] uppercase"
          >
            <span className="absolute inset-0 translate-y-full rounded-full bg-red transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:translate-y-0" />
            <span className="relative">View case study →</span>
          </TLink>
        </div>
      </div>
    </motion.article>
  );
}

/** Career timeline: a sticky year counter on the left, big mission cards scrolling on the right. */
export default function Experience({ index = "03" }: { index?: string }) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.5", "end 0.5"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const job = experience[active];

  return (
    <section id="journey" className="relative px-6 py-24 md:px-12 md:py-32">
      <SectionTag index={index} label="Journey — Flight log" />

      <div className="mb-14 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between">
        <RevealText
          as="h2"
          text="Every mission, an upgrade."
          className="block max-w-4xl font-display text-[12vw] font-black uppercase leading-[0.88] tracking-[-0.05em] md:text-[6vw]"
        />
        <p className="max-w-xs text-sm leading-relaxed text-ink/60 md:text-right">
          The roles and launches that shaped how I build — newest first. Each one links to the full case study.
        </p>
      </div>

      <div ref={listRef} className="relative grid gap-10 md:grid-cols-[0.8fr_2fr] md:gap-14">
        {/* sticky year + progress (desktop) */}
        <aside className="hidden md:block">
          <div className="sticky top-28 flex h-[70vh] gap-6">
            <div className="relative w-[2px] overflow-hidden rounded-full bg-line">
              <motion.span className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-red to-gold" style={{ scaleY: progress }} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] tracking-[0.3em] text-muted">
                  MISSION {pad(active + 1)} / {pad(experience.length)}
                </span>
                <div className="relative mt-4 h-[6.6vw] w-full overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={job.date}
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "-100%" }}
                      transition={{ duration: 0.7, ease: EASE }}
                      className="absolute inset-0 font-display text-[6vw] font-black leading-none tracking-[-0.05em] text-molten"
                    >
                      {yearOf(job.date)}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={job.company}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: OUT }}
                    className="mt-3 font-display text-xl font-black uppercase tracking-tight"
                  >
                    {job.company}
                  </motion.p>
                </AnimatePresence>
              </div>
              <ol className="space-y-3 font-mono text-[10px] tracking-[0.2em] uppercase">
                {experience.map((e, k) => (
                  <li key={e.company} className={`flex items-center gap-3 transition-colors duration-500 ${k === active ? "text-ink" : "text-muted"}`}>
                    <span className={`h-px transition-all duration-500 ${k === active ? "w-8 bg-red" : "w-3 bg-line"}`} />
                    {e.company}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </aside>

        <div className="space-y-10 md:space-y-16">
          {experience.map((e, i) => (
            <Mission key={e.company} job={e} i={i} onActive={setActive} />
          ))}
        </div>
      </div>
    </section>
  );
}
