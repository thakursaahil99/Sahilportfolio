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
import { ACCENTS, projects, tagsOf, type Project } from "@/data/projects";
import RevealText from "../fx/RevealText";
import TLink from "../transition/TLink";

const EASE = [0.16, 1, 0.3, 1] as const;
const CATEGORIES = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
const LIVE = projects.filter((p) => p.link).length;
const pad = (n: number) => String(n).padStart(2, "0");
const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");

/** Preview that trails the cursor over the list, tilting with its velocity. */
function CursorPreview({ active, x, y }: { active: Project | null; x: MotionValue<number>; y: MotionValue<number> }) {
  const sx = useSpring(x, { stiffness: 160, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 160, damping: 20, mass: 0.6 });
  const vx = useVelocity(sx);
  const rotate = useTransform(vx, [-2000, 0, 2000], [-12, 0, 12], { clamp: true });

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 hidden lg:block"
      style={{ x: sx, y: sy, rotate, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        animate={active ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative h-[250px] w-[400px] overflow-hidden rounded-2xl border border-ink/15 bg-panel shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]"
      >
        <AnimatePresence initial={false}>
          {active?.cover && (
            <motion.div
              key={active.slug}
              initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ opacity: 0.99, transition: { duration: 0.6 } }}
              transition={{ duration: 0.6, ease: EASE }}
              className="absolute inset-0"
            >
              <Image src={active.cover} alt="" fill sizes="400px" className="object-cover object-top" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent px-4 pt-10 pb-3 font-mono text-[10px] tracking-[0.2em] uppercase text-ink">
                {active.tagline}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
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
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5 md:grid-cols-[40px_112px_1fr_150px_56px_40px] md:gap-6 md:py-6"
              >
                <span className="hidden font-mono text-[11px] tracking-[0.25em] text-muted md:block">
                  {pad(projects.indexOf(p) + 1)}
                </span>
                {/* thumbnail */}
                <span className="relative block h-14 w-[88px] shrink-0 overflow-hidden rounded-lg border border-ink/10 bg-panel md:h-[70px] md:w-28">
                  {p.cover && (
                    <Image
                      src={p.cover}
                      alt=""
                      fill
                      sizes="112px"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate font-display text-[5.4vw] font-black uppercase leading-none tracking-[-0.04em] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 md:text-[2vw]">
                    {p.title}
                  </h3>
                  <p className="mt-2 truncate text-[13px] text-muted transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 md:text-sm">
                    {p.tagline}
                  </p>
                </div>
                <span className="hidden font-mono text-[11px] tracking-[0.2em] uppercase text-ink/70 md:block">{p.category}</span>
                <span className="hidden font-mono text-[11px] tracking-[0.2em] text-ink/70 md:block">{p.year}</span>
                <span className="justify-self-end text-2xl transition-transform duration-500 group-hover:-rotate-45">→</span>
              </TLink>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

/** Photo card with the brief underneath. */
function Card({ project: p, index }: { project: Project; index: number }) {
  const [a, b] = ACCENTS[p.accent];
  return (
    <TLink href={`/work/${p.slug}`} data-cursor-label="Open" className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-panel transition-colors duration-500 hover:border-ink/30">
      {/* photo */}
      <div className="relative aspect-[16/10] overflow-hidden bg-background">
        {p.cover ? (
          <Image
            src={p.cover}
            alt={`${p.title} — front page`}
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 46vw, 92vw"
            className="object-cover object-top transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-display text-8xl font-black text-ink/10">{p.title[0]}</span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-background/30" />
        {/* accent wash that comes up on hover */}
        <div
          className="absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-700 group-hover:opacity-70"
          style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
        />
        <span className="absolute left-4 top-4 rounded-full bg-background/70 px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] text-ink backdrop-blur-md">
          {pad(index + 1)}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-background/70 px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] uppercase text-ink backdrop-blur-md">
          {p.category}
        </span>
        <span className="absolute bottom-4 right-4 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-ink text-lg text-background opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:-rotate-45 group-hover:opacity-100">
          →
        </span>
      </div>

      {/* brief */}
      <div className="flex min-w-0 flex-1 flex-col p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-xl font-black uppercase leading-[1.05] tracking-tight md:text-2xl">{p.title}</h3>
          <span className="shrink-0 pt-1 font-mono text-[11px] tracking-[0.2em] text-ink/60">{p.year}</span>
        </div>
        <p className="mt-2 font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: a }}>
          {p.tagline}
        </p>
        <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-ink/65">{p.summary}</p>

        <ul className="mt-5 mb-5 flex flex-wrap gap-1.5">
          {tagsOf(p)
            .slice(0, 5)
            .map((t) => (
              <li key={t} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[9px] tracking-[0.15em] uppercase text-ink/70">
                {t}
              </li>
            ))}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-4 font-mono text-[10px] tracking-[0.18em] uppercase text-muted">
          <span className="truncate">{p.role}</span>
          <span className="flex shrink-0 items-center gap-2 text-ink/80">
            <span className={`h-1.5 w-1.5 rounded-full ${p.link ? "bg-[#3ddc84]" : "bg-gold"}`} />
            {p.link ? host(p.link) : "Private build"}
          </span>
        </div>
      </div>
    </TLink>
  );
}

function GridView({ items }: { items: Project[] }) {
  return (
    <motion.ul layout className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 xl:grid-cols-3">
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((p, i) => (
          <motion.li
            key={p.slug}
            layout
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.8, ease: EASE, delay: (i % 3) * 0.07 }}
            className="min-w-0"
          >
            <Card project={p} index={projects.indexOf(p)} />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}

export default function WorkIndex() {
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");
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

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
          className="max-w-xl text-base md:text-lg text-muted"
        >
          Platforms, marketplaces, AI tools and cinematic brand sites. Every card has a photo and a short brief — open
          any one for the full case study.
        </motion.p>

        <motion.dl
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          className="grid grid-cols-3 divide-x divide-line rounded-2xl border border-line"
        >
          {[
            { v: projects.length, k: "Case studies" },
            { v: LIVE, k: "Live links" },
            { v: CATEGORIES.length - 1, k: "Categories" },
          ].map((s) => (
            <div key={s.k} className="px-5 py-4 md:px-7">
              <dd className="font-display text-2xl font-black md:text-3xl">{s.v}</dd>
              <dt className="mt-1 font-mono text-[9px] tracking-[0.25em] uppercase text-muted">{s.k}</dt>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* controls */}
      <div className="mt-14 mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <LayoutGroup id="work-filter">
          <ul className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const count = c === "All" ? projects.length : projects.filter((p) => p.category === c).length;
              const on = filter === c;
              return (
                <li key={c}>
                  <button
                    onClick={() => setFilter(c)}
                    aria-pressed={on}
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

        <div className="flex gap-1 self-start rounded-full border border-line p-1 font-mono text-[11px] tracking-[0.2em] uppercase">
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              aria-pressed={view === v}
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
