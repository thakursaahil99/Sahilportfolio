"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { ACCENTS, type Project } from "@/data/projects";
import { fitTitle } from "@/lib/fit-title";
import RevealText from "../fx/RevealText";
import ScrollLitText from "../fx/ScrollLitText";
import SpotlightCard from "../fx/SpotlightCard";
import Magnetic from "../fx/Magnetic";
import TLink from "../transition/TLink";
import BrowserShot from "./BrowserShot";
import ProjectArt from "./ProjectArt";

const EASE = [0.16, 1, 0.3, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

function Label({ n, text }: { n: string; text: string }) {
  return (
    <p className="mb-8 flex items-center gap-4 md:sticky md:top-32 md:mb-0">
      <span className="font-mono text-[11px] tracking-[0.3em] text-red">({n})</span>
      <span className="h-px w-10 bg-line" />
      <span className="eyebrow">{text}</span>
    </p>
  );
}

/** Cover that grows from an inset rounded card to full-bleed as it scrolls into view. */
function ExpandingCover({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.15"] });
  const inset = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const side = useTransform(inset, (v) => v * 1.6);
  const radius = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const clip = useMotionTemplate`inset(${inset}% ${side}% ${inset}% ${side}% round ${radius}px)`;
  const scale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);

  return (
    <div ref={ref} className="relative h-[60vh] w-full md:h-[100vh]">
      <motion.div style={{ clipPath: clip }} className="group absolute inset-0 overflow-hidden bg-panel">
        {project.cover ? (
          <motion.div style={{ scale }} className="absolute inset-0">
            <Image src={project.cover} alt={`${project.title} — front page`} fill sizes="100vw" loading="eager" className="object-cover object-top" />
          </motion.div>
        ) : (
          <>
            <ProjectArt accent={project.accent} />
            <span className="absolute inset-0 flex items-center justify-center font-display text-[30vw] font-black leading-none text-ink/[0.07]">
              {project.title[0]}
            </span>
            <span className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.3em] uppercase text-ink/50">
              Private client build — screenshots on request
            </span>
          </>
        )}
      </motion.div>
    </div>
  );
}

function Gallery({ project }: { project: Project }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const shots = project.gallery ?? [];
  if (!shots.length) return null;

  return (
    <section className="py-28 md:py-40">
      <div className="mb-12 flex items-end justify-between px-6 md:px-12">
        <div>
          <Label n="04" text="Gallery" />
          <h2 className="mt-6 font-display text-[8vw] md:text-[3.2vw] font-black uppercase leading-[0.9] tracking-[-0.04em]">
            Inside the build
          </h2>
        </div>
        <span className="hidden md:block font-mono text-[11px] tracking-[0.25em] uppercase text-muted">
          ← Drag to explore →
        </span>
      </div>
      <div ref={trackRef} className="overflow-hidden px-6 md:px-12" data-cursor-label="Drag">
        <motion.ul drag="x" dragConstraints={trackRef} dragElastic={0.08} className="flex w-max cursor-grab gap-6 active:cursor-grabbing md:gap-10">
          {shots.map((s, i) => (
            <motion.li
              key={s.src}
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: EASE, delay: i * 0.06 }}
              className="group w-[82vw] md:w-[46vw]"
            >
              <div className="pointer-events-none select-none">
                <BrowserShot src={s.src} alt={s.caption} url={s.url ?? project.link} sizes="(min-width: 768px) 46vw, 82vw" />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <p className="text-sm text-ink/80">
                  <span className="mr-3 font-mono text-[11px] text-muted">{pad(i + 1)}</span>
                  {s.caption}
                </p>
                {s.url && s.url !== project.link && (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 font-mono text-[10px] tracking-[0.2em] uppercase text-gold hover:underline"
                    onPointerDownCapture={(e) => e.stopPropagation()}
                  >
                    Live ↗
                  </a>
                )}
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

function NextProject({ next }: { next: Project }) {
  return (
    <TLink
      href={`/work/${next.slug}`}
      data-cursor-label="Next"
      className="group relative block overflow-hidden border-t border-line px-6 py-24 md:px-12 md:py-36"
    >
      {/* image that fades up behind the title on hover */}
      <div className="absolute inset-0 scale-110 opacity-0 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-40">
        {next.cover ? (
          <Image src={next.cover} alt="" fill sizes="100vw" className="object-cover object-top" />
        ) : (
          <ProjectArt accent={next.accent} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/70" />
      </div>
      <p className="eyebrow relative mb-6">Next project →</p>
      <h2
        style={fitTitle(next.title, 11, 6.5)}
        className="relative font-display text-[length:var(--fs-m)] md:text-[length:var(--fs-d)] font-black uppercase leading-[0.85] tracking-[-0.05em] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-6">
        {next.title}
      </h2>
      <p className="relative mt-6 text-muted">{next.tagline}</p>
    </TLink>
  );
}

export default function CaseStudy({ project, next, index }: { project: Project; next: Project; index: number }) {
  const [accent] = ACCENTS[project.accent];

  return (
    <article>
      {/* ---------- hero ---------- */}
      <header className="px-6 pt-32 md:px-12 md:pt-40">
        <TLink href="/work" className="group mb-12 inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] uppercase text-muted hover:text-ink">
          <span className="transition-transform duration-500 group-hover:-translate-x-2">←</span> All work
        </TLink>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="mb-6 flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] uppercase text-ink/70"
        >
          <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
          Case {pad(index + 1)} — {project.category}
        </motion.p>

        <h1
          style={fitTitle(project.title, 12, 7)}
          className="font-display font-black uppercase leading-[0.85] tracking-[-0.05em] text-[length:var(--fs-m)] md:text-[length:var(--fs-d)]"
        >
          <RevealText text={project.title} split="chars" stagger={0.035} />
        </h1>

        <div className="mt-12 grid gap-10 border-t border-line pt-8 md:mt-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="font-display text-lg md:text-xl font-medium leading-snug"
          >
            {project.tagline}
          </motion.p>
          {[
            ["Role", project.role],
            ["Year", project.year],
            ["Category", project.category],
          ].map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6 + i * 0.08, ease: EASE }}
            >
              <p className="eyebrow mb-2">{k}</p>
              <p className="text-ink">{v}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
          className="mt-10 flex flex-wrap gap-4"
        >
          {project.link && (
            <Magnetic>
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="group relative inline-flex overflow-hidden rounded-full bg-ink px-7 py-3.5 font-mono text-[11px] font-semibold tracking-[0.25em] uppercase text-background"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-red transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />
                <span className="relative transition-colors duration-500 group-hover:text-ink">Visit live site ↗</span>
              </a>
            </Magnetic>
          )}
          {project.repo && (
            <Magnetic>
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-ink/30 px-7 py-3.5 font-mono text-[11px] tracking-[0.25em] uppercase text-ink transition-colors hover:border-gold hover:text-gold"
              >
                View code on GitHub ↗
              </a>
            </Magnetic>
          )}
        </motion.div>
      </header>

      {/* ---------- cover ---------- */}
      <div className="mt-20 md:mt-28">
        <ExpandingCover project={project} />
      </div>

      {/* ---------- overview ---------- */}
      <section className="grid gap-4 px-6 py-28 md:grid-cols-[260px_1fr] md:gap-16 md:px-12 md:py-40">
        <Label n="01" text="Overview" />
        <div>
          <ScrollLitText
            text={project.overview[0]}
            className="font-display text-[5.5vw] md:text-[2vw] font-medium leading-[1.15] tracking-[-0.02em]"
          />
          {project.overview.slice(1).map((p) => (
            <motion.p
              key={p}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1, ease: EASE }}
              className="mt-10 max-w-3xl text-base md:text-xl leading-relaxed text-muted"
            >
              {p}
            </motion.p>
          ))}
        </div>
      </section>

      {/* ---------- features ---------- */}
      <section className="grid gap-4 px-6 pb-28 md:grid-cols-[260px_1fr] md:gap-16 md:px-12 md:pb-40">
        <Label n="02" text="What I built" />
        <ol className="border-t border-line">
          {project.features.map((f, i) => (
            <motion.li
              key={f}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.05 }}
              className="group relative overflow-hidden border-b border-line"
            >
              <span
                className="absolute inset-0 origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100"
                style={{ background: `linear-gradient(90deg, ${accent}22, transparent)` }}
              />
              <div className="relative flex items-baseline gap-6 py-6 md:gap-10 md:py-8">
                <span className="font-mono text-[11px] tracking-[0.2em]" style={{ color: accent }}>
                  {pad(i + 1)}
                </span>
                <span className="text-base md:text-xl leading-snug transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3">
                  {f}
                </span>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* ---------- stack ---------- */}
      <section className="grid gap-4 px-6 pb-12 md:grid-cols-[260px_1fr] md:gap-16 md:px-12">
        <Label n="03" text="Tech stack" />
        <div className={`grid gap-4 [perspective:1400px] ${project.stack.length > 3 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {project.stack.map((group, gi) => (
            <SpotlightCard key={group.label} className="p-6 md:p-8">
              <p className="mb-6 flex items-center justify-between">
                <span className="font-display text-lg font-black uppercase tracking-tight">{group.label}</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-muted">{pad(group.items.length)}</span>
              </p>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((t, ti) => (
                  <motion.li
                    key={t}
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: EASE, delay: gi * 0.1 + ti * 0.04 }}
                    className="rounded-full border border-ink/20 px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase text-ink/85"
                  >
                    {t}
                  </motion.li>
                ))}
              </ul>
            </SpotlightCard>
          ))}
        </div>
      </section>

      <Gallery project={project} />

      <NextProject next={next} />
    </article>
  );
}
