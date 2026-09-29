"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { projects, tagsOf, type Project } from "@/data/projects";
import RevealText from "../fx/RevealText";
import TLink from "../transition/TLink";
import BrowserShot from "./BrowserShot";
import ProjectArt from "./ProjectArt";

const EASE = [0.16, 1, 0.3, 1] as const;
const CATEGORIES = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
const pad = (n: number) => String(n).padStart(2, "0");

/** Preview that trails the cursor over the list, tilting with its velocity. */
function CursorPreview({ active, x, y }: { active: Project | null; x: MotionValue<number>; y: MotionValue<number> }) {
  const sx = useSpring(x, { stiffness: 160, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 160, damping: 20, mass: 0.6 });
  const vx = useVelocity(sx);
  const rotate = useTransform(vx, [-2000, 0, 2000], [-12, 0, 12], { clamp: true });

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 hidden md:block"
      style={{ x: sx, y: sy, rotate, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        animate={active ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative h-[250px] w-[400px] overflow-hidden rounded-2xl border border-ink/15 bg-panel shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]"
      >
        {projects.map((p) => (
          <motion.div
            key={p.slug}
            initial={false}
            animate={{
              clipPath: active?.slug === p.slug ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
            }}
            transition={{ duration: 0.6, ease: EASE }}
            className="absolute inset-0"
          >
            {p.cover ? (
              <Image src={p.cover} alt="" fill sizes="400px" className="object-cover object-top" />
            ) : (
              <div className="group absolute inset-0">
                <ProjectArt accent={p.accent} />
                <span className="absolute inset-0 flex items-center justify-center font-display text-9xl font-black text-ink/15">
                  {p.title[0]}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function ListView({ items }: { items: Project[] }) {
  const [active, setActive] = useState<Project | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <div
      onPointerMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <CursorPreview active={active} x={x} y={y} />
      <ul className="border-t border-line [&:hover>li]:opacity-35 [&>li:hover]:!opacity-100">
        <AnimatePresence initial={false}>
          {items.map((p) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="border-b border-line transition-opacity duration-500"
              onPointerEnter={() => setActive(p)}
            >
              <TLink
                href={`/work/${p.slug}`}
                data-cursor-label="Open"
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-6 md:grid-cols-[80px_1fr_220px_100px_60px] md:gap-8 md:py-9"
              >
                <span className="font-mono text-[11px] tracking-[0.25em] text-muted">
                  {pad(projects.indexOf(p) + 1)}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate font-display text-[6.5vw] md:text-[2.6vw] font-black uppercase leading-none tracking-[-0.04em] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4">
                    {p.title}
                  </h3>
                  <p className="mt-2 truncate text-sm text-muted md:hidden">{p.tagline}</p>
                </div>
                <span className="hidden md:block font-mono text-[11px] tracking-[0.2em] uppercase text-ink/70">
                  {p.category}
                </span>
                <span className="hidden md:block font-mono text-[11px] tracking-[0.2em] text-ink/70">{p.year}</span>
                <span className="justify-self-end text-2xl transition-transform duration-500 group-hover:-rotate-45">→</span>
              </TLink>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function GridView({ items }: { items: Project[] }) {
  return (
    <motion.ul layout className="grid gap-x-8 gap-y-16 md:grid-cols-2">
      <AnimatePresence initial={false}>
        {items.map((p, i) => (
          <motion.li
            key={p.slug}
            layout
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: EASE, delay: (i % 2) * 0.08 }}
            className={i % 2 === 1 ? "md:mt-24" : undefined}
          >
            <TLink href={`/work/${p.slug}`} data-cursor-label="Open" className="group block">
              <div className="relative overflow-hidden rounded-3xl border border-line bg-panel p-5 md:p-8">
                <ProjectArt accent={p.accent} />
                <div className="relative">
                  {p.cover ? (
                    <BrowserShot src={p.cover} alt={`${p.title} — front page`} url={p.link} sizes="(min-width: 768px) 42vw, 90vw" />
                  ) : (
                    <div className="flex aspect-[16/10] items-center justify-center rounded-xl border border-dashed border-ink/15">
                      <span className="font-display text-[30vw] md:text-[12vw] font-black leading-none text-ink/10">
                        {p.title[0]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 flex items-start justify-between gap-6">
                <div>
                  <h3 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted">{p.tagline}</p>
                </div>
                <span className="shrink-0 font-mono text-[11px] tracking-[0.2em] text-ink/60">{p.year}</span>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {tagsOf(p).map((t) => (
                  <li key={t} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[9px] tracking-[0.15em] uppercase text-ink/70">
                    {t}
                  </li>
                ))}
              </ul>
            </TLink>
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}

export default function WorkIndex() {
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState<"list" | "grid">("list");
  const items = useMemo(() => (filter === "All" ? projects : projects.filter((p) => p.category === filter)), [filter]);

  return (
    <section className="px-6 pt-36 pb-28 md:px-12 md:pt-44">
      <p className="eyebrow mb-6">[ Archive — {new Date().getFullYear()} ]</p>
      <h1 className="font-display font-black uppercase leading-[0.85] tracking-[-0.04em] text-[14vw] md:text-[7vw]">
        <RevealText text="All work" split="chars" stagger={0.04} />
        <sup className="ml-2 align-top font-mono text-[3.5vw] md:text-[1.2vw] font-normal tracking-normal text-red">
          ({pad(projects.length)})
        </sup>
      </h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
        className="mt-8 max-w-xl text-base md:text-lg text-muted"
      >
        Platforms, storefronts, AI tools and cinematic brand sites — every project here shipped to real users. Click
        any one for the full case study.
      </motion.p>

      {/* controls */}
      <div className="mt-16 mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <LayoutGroup id="work-filter">
          <ul className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const count = c === "All" ? projects.length : projects.filter((p) => p.category === c).length;
              const on = filter === c;
              return (
                <li key={c}>
                  <button
                    onClick={() => setFilter(c)}
                    className={`relative rounded-full border px-4 py-2 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                      on ? "border-transparent text-background" : "border-line text-ink/70 hover:text-ink"
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="filter-pill"
                        className="absolute inset-0 rounded-full bg-ink"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">
                      {c} <span className={on ? "text-red" : "text-muted"}>{count}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </LayoutGroup>

        <div className="flex gap-1 rounded-full border border-line p-1 font-mono text-[11px] tracking-[0.2em] uppercase">
          {(["list", "grid"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`relative rounded-full px-4 py-1.5 transition-colors ${view === v ? "text-background" : "text-ink/60"}`}
            >
              {view === v && (
                <motion.span layoutId="view-pill" className="absolute inset-0 rounded-full bg-gold" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
              )}
              <span className="relative">{v}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {view === "list" ? <ListView items={items} /> : <GridView items={items} />}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
