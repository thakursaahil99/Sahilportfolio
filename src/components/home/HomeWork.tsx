"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ACCENTS, projects, tagsOf, type Project } from "@/data/projects";
import Reveal, { SplitReveal } from "../fx/Reveal";
import TLink from "../transition/TLink";

const FEATURED = projects.filter((p) => p.featured);
const TOTAL = FEATURED.length + 1; // + the "view all" card
const pad = (n: number) => String(n).padStart(2, "0");
const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");

function Slide({ project: p, index, active }: { project: Project; index: number; active: boolean }) {
  const [a, b] = ACCENTS[p.accent];
  return (
    <TLink
      href={`/work/${p.slug}`}
      data-cursor-label="View"
      data-slide
      className={`group relative grid w-[86vw] shrink-0 snap-center overflow-hidden rounded-[28px] border bg-panel transition-[border-color,opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:w-[72vw] md:grid-cols-[1.15fr_0.85fr] lg:w-[66vw] ${
        active ? "border-ink/25" : "border-line opacity-55 md:scale-[0.96]"
      }`}
    >
      {/* photo */}
      <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[58vh]">
        {p.cover && (
          <Image
            src={p.cover}
            alt={`${p.title} — front page`}
            fill
            sizes="(min-width: 768px) 40vw, 86vw"
            className="object-cover object-left-top transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-panel" />
        <div
          className="absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-700 group-hover:opacity-70"
          style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
        />
        {p.link && (
          <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-background/70 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-ink backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3ddc84]" />
            {host(p.link)}
          </span>
        )}
      </div>

      {/* brief */}
      <div className="relative flex flex-col justify-between gap-8 p-6 md:p-9">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 opacity-25 blur-3xl"
          style={{ background: `radial-gradient(closest-side, ${a}, transparent)` }}
        />
        <div className="relative flex items-start justify-between font-mono text-[11px] tracking-[0.25em] uppercase">
          <span className="text-ink">
            {pad(index + 1)} <span className="text-muted">/ {pad(FEATURED.length)}</span>
          </span>
          <span className="text-ink/70">
            {p.category} · {p.year}
          </span>
        </div>

        <div className="relative">
          <p className="mb-3 font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: a }}>
            {p.role}
          </p>
          <h3 className="font-display text-[7.6vw] font-black uppercase leading-[0.92] tracking-[-0.04em] md:text-[2.5vw]">{p.title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-ink/70 md:line-clamp-5">{p.summary}</p>
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {tagsOf(p)
              .slice(0, 5)
              .map((t) => (
                <li key={t} className="rounded-full border border-ink/20 px-2.5 py-0.5 font-mono text-[9px] tracking-[0.15em] uppercase text-ink/75">
                  {t}
                </li>
              ))}
          </ul>
        </div>

        <p className="relative inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] uppercase">
          <span className="relative">
            Read case study
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/30 transition-all duration-500 group-hover:-rotate-45 group-hover:border-transparent group-hover:bg-ink group-hover:text-background">
            →
          </span>
        </p>
      </div>
    </TLink>
  );
}

/**
 * Featured work as a snap carousel: swipe on touch, drag the trackpad, use the
 * arrows or the keyboard. Scrolling is the browser's own, so it stays smooth on
 * phones; JavaScript only notes which card is centred.
 */
export default function HomeWork() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const mid = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let dist = Infinity;
      track.querySelectorAll<HTMLElement>("[data-slide]").forEach((el, i) => {
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      setCurrent((c) => (c === best ? c : best));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const track = trackRef.current;
    const slide = track?.querySelectorAll<HTMLElement>("[data-slide]")[Math.min(TOTAL - 1, Math.max(0, current + dir))];
    if (!track || !slide) return;
    track.scrollTo({ left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2, behavior: "smooth" });
  };

  const arrow =
    "flex h-12 w-12 items-center justify-center rounded-full border border-ink/25 text-lg transition-all duration-300 hover:border-transparent hover:bg-ink hover:text-background disabled:pointer-events-none disabled:opacity-25";

  return (
    <section id="work" className="relative overflow-hidden pt-20 pb-10 md:pt-32 md:pb-16">
      <div className="mb-10 flex items-end justify-between gap-6 px-6 md:mb-14 md:px-12">
        <div>
          <Reveal as="p" className="mb-4 flex items-center gap-4">
            <span className="font-mono text-[11px] tracking-[0.3em] text-red">(03)</span>
            <span className="h-px w-12 bg-line" />
            <span className="eyebrow">Featured work</span>
          </Reveal>
          <SplitReveal
            as="h2"
            text="Missions shipped"
            outline={["shipped"]}
            className="block font-display text-[10vw] font-black uppercase leading-[0.9] tracking-[-0.04em] md:text-[4.4vw]"
          />
        </div>

        <Reveal delay={150} className="flex items-center gap-5">
          <p className="hidden font-mono text-[11px] tracking-[0.25em] tabular-nums text-muted sm:block">
            <span className="text-ink">{pad(current + 1)}</span> — {pad(TOTAL)}
          </p>
          <div className="flex gap-2">
            <button onClick={() => go(-1)} disabled={current === 0} aria-label="Previous project" className={arrow}>
              ←
            </button>
            <button onClick={() => go(1)} disabled={current === TOTAL - 1} aria-label="Next project" className={arrow}>
              →
            </button>
          </div>
        </Reveal>
      </div>

      <Reveal kind="right">
        <div
          ref={trackRef}
          tabIndex={0}
          aria-label="Featured projects"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[7vw] pb-2 outline-none md:gap-7 md:px-[14vw] lg:px-[17vw]"
        >
          {FEATURED.map((p, i) => (
            <Slide key={p.slug} project={p} index={i} active={i === current} />
          ))}

          {/* closing card */}
          <TLink
            href="/work"
            data-slide
            data-cursor-label="All work"
            className={`group relative flex w-[86vw] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-[28px] border border-dashed p-8 transition-[opacity,transform] duration-700 md:w-[44vw] md:p-12 ${
              current === TOTAL - 1 ? "border-ink/40" : "border-ink/20 opacity-55 md:scale-[0.96]"
            }`}
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-red transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100" />
            <span className="relative mb-6 font-mono text-[11px] tracking-[0.25em] uppercase text-muted transition-colors group-hover:text-background">
              {projects.length - FEATURED.length} more in the archive
            </span>
            <span className="relative font-display text-[11vw] font-black uppercase leading-[0.9] tracking-[-0.04em] transition-colors group-hover:text-background md:text-[4vw]">
              View all
              <br />
              {projects.length} →
            </span>
          </TLink>
        </div>
      </Reveal>

      {/* progress */}
      <div className="mx-6 mt-8 h-px bg-line md:mx-12 md:mt-12">
        <div
          className="h-full origin-left bg-gradient-to-r from-red to-gold transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `scaleX(${(current + 1) / TOTAL})` }}
        />
      </div>
    </section>
  );
}
