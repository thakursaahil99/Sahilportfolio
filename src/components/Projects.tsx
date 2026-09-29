"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, tagsOf, type Project } from "@/data/projects";
import BrowserShot from "./work/BrowserShot";
import ProjectArt from "./work/ProjectArt";
import TLink from "./transition/TLink";
import { fitTitle } from "@/lib/fit-title";

gsap.registerPlugin(ScrollTrigger);

const FEATURED = projects.filter((p) => p.featured);
const EASE_OUT = "ease-[cubic-bezier(0.16,1,0.3,1)]";
const pad = (n: number) => String(n).padStart(2, "0");

function ProjectPanel({ project, index }: { project: Project; index: number }) {
  return (
    <TLink
      href={`/work/${project.slug}`}
      data-cursor-label="View"
      className="project-panel group relative grid w-[86vw] shrink-0 overflow-hidden rounded-3xl border border-line bg-panel md:h-[64vh] md:w-[78vw] md:grid-cols-[0.85fr_1.15fr] lg:w-[72vw]"
    >
      <ProjectArt accent={project.accent} className="project-art scale-110" />

      {/* visual */}
      <div className="project-float relative order-1 flex items-center justify-center p-5 pb-0 md:order-2 md:p-10 md:pl-0">
        {project.cover && (
          <div className="w-full">
            <BrowserShot src={project.cover} alt={`${project.title} — front page`} url={project.link} tilt sizes="(min-width: 768px) 42vw, 86vw" />
          </div>
        )}
      </div>

      {/* copy */}
      <div className="relative order-2 flex flex-col justify-between gap-8 p-6 md:order-1 md:p-10">
        <div className="flex items-start justify-between font-mono text-[11px] tracking-[0.25em] uppercase">
          <span className="text-ink">
            {pad(index + 1)} / {pad(FEATURED.length)}
          </span>
          <span className="text-ink/70">
            {project.category} · {project.year}
          </span>
        </div>

        <div>
          <p className="mb-3 font-mono text-[10px] tracking-[0.25em] uppercase text-gold">{project.role}</p>
          <h3
            style={fitTitle(project.title, 7.5, 2.4, [70, 25])}
            className={`font-display text-[length:var(--fs-m)] md:text-[length:var(--fs-d)] font-black uppercase leading-[0.9] tracking-[-0.04em] transition-transform duration-700 ${EASE_OUT} group-hover:translate-x-2`}
          >
            {project.title}
          </h3>
          <p className="mt-5 text-sm leading-relaxed text-ink/75 md:line-clamp-4">{project.summary}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {tagsOf(project).map((t) => (
              <li
                key={t}
                className="rounded-full border border-ink/20 bg-background/30 px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase backdrop-blur-md"
              >
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-6 inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] uppercase">
            <span className="relative">
              Read case study
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/30 transition-all duration-500 group-hover:rotate-[-45deg] group-hover:bg-ink group-hover:text-background">
              →
            </span>
          </p>
        </div>
      </div>
    </TLink>
  );
}

function AllWorkPanel() {
  return (
    <TLink
      href="/work"
      data-cursor-label="All work"
      className="project-panel group relative flex w-[86vw] shrink-0 flex-col items-start justify-end overflow-hidden rounded-3xl border border-dashed border-ink/20 p-8 md:h-[64vh] md:w-[34vw] md:p-10"
    >
      <span className="absolute inset-0 origin-bottom scale-y-0 bg-red transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100" />
      <span className="relative mb-6 font-mono text-[11px] tracking-[0.25em] uppercase text-muted transition-colors group-hover:text-background">
        {projects.length} projects in the archive
      </span>
      <span className="relative font-display text-4xl md:text-[2.8vw] font-black uppercase leading-[0.9] tracking-[-0.04em] transition-colors group-hover:text-background">
        View all
        <br />
        work →
      </span>
    </TLink>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
            const idx = Math.min(FEATURED.length, Math.max(1, Math.round(self.progress * FEATURED.length + 0.5)));
            setCurrent((c) => (c === idx ? c : idx));
          },
        },
      });

      // parallax inside each panel as it travels across the screen:
      // backdrop drifts one way, the screenshot the other — reads as depth
      gsap.utils.toArray<HTMLElement>(".project-panel").forEach((panel) => {
        const layers: [string, number][] = [
          [".project-art", 8],
          [".project-float", -6],
        ];
        for (const [selector, amount] of layers) {
          const el = panel.querySelector(selector);
          if (!el) continue;
          gsap.fromTo(
            el,
            { xPercent: -amount },
            {
              xPercent: amount,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        }
      });
    });

    // fonts/images can shift layout after mount
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, []);

  return (
    <section id="work" ref={sectionRef} className="relative overflow-hidden py-28 md:flex md:h-screen md:flex-col md:justify-center md:py-0">
      <div className="mb-10 flex items-end justify-between px-6 md:mb-12 md:px-12">
        <div>
          <p className="mb-4 flex items-center gap-4">
            <span className="font-mono text-[11px] tracking-[0.3em] text-red">(03)</span>
            <span className="h-px w-12 bg-line" />
            <span className="eyebrow">Featured work</span>
          </p>
          <h2 className="font-display text-[9vw] md:text-[3.2vw] font-black uppercase leading-[0.9] tracking-[-0.04em]">
            Missions <span className="text-outline">shipped</span>
          </h2>
        </div>
        <p className="hidden md:block font-mono text-[11px] tracking-[0.25em] tabular-nums text-muted">
          <span className="text-ink">{pad(current)}</span> — {pad(FEATURED.length)}
        </p>
      </div>

      <div ref={trackRef} className="flex w-full flex-col gap-6 px-6 md:w-max md:flex-row md:gap-8 md:px-12 md:pr-[12vw]">
        {FEATURED.map((p, i) => (
          <ProjectPanel key={p.slug} project={p} index={i} />
        ))}
        <AllWorkPanel />
      </div>

      <div className="mx-12 mt-10 hidden h-px bg-line md:block">
        <div ref={barRef} className="h-full origin-left bg-gradient-to-r from-red to-gold" style={{ transform: "scaleX(0)" }} />
      </div>
    </section>
  );
}
