"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ACCENTS, getProject } from "@/data/projects";
import SectionTag from "../SectionTag";
import RevealText from "../fx/RevealText";
import TLink from "../transition/TLink";

// each step is illustrated with a screen from one of my own projects (`slug` in data/projects.ts)
const STEPS = [
  {
    title: "Discover",
    desc: "A call to understand the business, the users and what success looks like. Out of it comes a clear scope and plan.",
    items: ["Goals & audience", "Scope & timeline", "Tech recommendations"],
    shot: { slug: "glide-in-bir", src: "/projects/glide-in-bir.jpg", note: "The problem: booking a flight in Bir meant juggling WhatsApp chats with a dozen operators." },
  },
  {
    title: "Design",
    desc: "Wireframes, then high-fidelity screens and motion prototypes — so you see how it feels before a line of production code.",
    items: ["Wireframes", "UI design", "Motion prototypes"],
    shot: { slug: "bir-paragliding", src: "/projects/bir-paragliding/cover.jpg", note: "A 3D descent hero and ten scroll-driven sections, designed around how a flight feels." },
  },
  {
    title: "Build",
    desc: "Clean, typed code with frequent preview links. You follow progress live instead of waiting for a big reveal.",
    items: ["Frontend & backend", "CMS / API integrations", "Preview deployments"],
    shot: { slug: "quickcart", src: "/projects/quickcart/admin-dashboard.jpg", note: "Custom Magento 2 modules, a REST API and this sales dashboard — covered by 156 unit tests." },
  },
  {
    title: "Launch & grow",
    desc: "Deployment, SEO and analytics, then iteration based on real data — with support after go-live.",
    items: ["Deploy & monitoring", "SEO & analytics", "Ongoing support"],
    shot: { slug: "glideinbir-tech", src: "/projects/glideinbir-tech/cover.jpg", note: "Shipped in English and Hindi with hreflang, JSON-LD and conversion tracking." },
  },
];

function Step({ step, i, progress }: { step: (typeof STEPS)[number]; i: number; progress: MotionValue<number> }) {
  const n = STEPS.length;
  const project = getProject(step.shot.slug);
  const [a, b] = ACCENTS[project?.accent ?? "orange"];
  // each card lights up as the track scrolls it into the middle of the screen
  const lit = useTransform(progress, [(i - 0.6) / (n - 1), i / (n - 1), (i + 0.6) / (n - 1)], [0.35, 1, 0.35]);
  const fill = useTransform(progress, [(i - 1) / (n - 1), i / (n - 1)], ["0%", "100%"]);
  // the photo drifts a little against the card as it travels across the screen
  const shotX = useTransform(progress, [(i - 1) / (n - 1), (i + 1) / (n - 1)], ["6%", "-6%"]);

  return (
    <motion.article
      style={{ opacity: lit }}
      className="group relative grid h-[74vh] w-[84vw] shrink-0 grid-rows-[34%_1fr] overflow-hidden rounded-3xl border border-line bg-panel md:h-[64vh] md:w-[66vw] md:grid-cols-[1fr_0.95fr] md:grid-rows-1"
    >
      {/* copy */}
      <div className="relative order-2 flex flex-col justify-between gap-6 p-6 md:order-1 md:p-11">
        <span className="pointer-events-none absolute -left-2 -top-8 font-display text-[38vw] font-black leading-none text-ink/[0.04] md:text-[20vw]">
          {i + 1}
        </span>
        <div className="relative flex items-center gap-4">
          <span className="font-mono text-[11px] tracking-[0.3em] text-red">STEP {String(i + 1).padStart(2, "0")}</span>
          <span className="h-px flex-1 bg-line">
            <motion.span className="block h-full bg-gradient-to-r from-red to-gold" style={{ width: fill }} />
          </span>
        </div>
        <div className="relative">
          <h3 className="font-display text-[9.5vw] font-black uppercase leading-[0.9] tracking-[-0.04em] md:text-[3.6vw]">{step.title}</h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/70 md:mt-5 md:text-base">{step.desc}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {step.items.map((it) => (
              <li key={it} className="rounded-full border border-ink/20 px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase text-ink/80">
                {it}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* photo from a real project */}
      <div className="relative order-1 overflow-hidden md:order-2 md:m-4 md:rounded-2xl">
        <motion.div style={{ x: shotX }} className="absolute -inset-x-[8%] inset-y-0">
          <Image
            src={step.shot.src}
            alt={project ? `${project.title} — screenshot` : ""}
            fill
            sizes="(min-width: 768px) 36vw, 90vw"
            className="object-cover object-left-top transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/15 to-transparent" />
        <div
          className="absolute inset-0 opacity-30 mix-blend-soft-light"
          style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
        />

        {project && (
          <div className="absolute inset-x-4 bottom-4 md:inset-x-5 md:bottom-5">
            <p className="mb-3 hidden max-w-sm text-[13px] leading-relaxed text-ink/85 md:block">{step.shot.note}</p>
            <TLink
              href={`/work/${project.slug}`}
              data-cursor-label="Case"
              className="group/link inline-flex items-center gap-3 rounded-full bg-background/75 py-1.5 pl-4 pr-1.5 font-mono text-[10px] tracking-[0.2em] uppercase backdrop-blur-md"
            >
              <span>
                <span className="text-muted">From </span>
                {project.title}
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-background transition-transform duration-500 group-hover/link:-rotate-45">
                →
              </span>
            </TLink>
          </div>
        )}
      </div>
    </motion.article>
  );
}

/** Pinned section: vertical scroll drives a horizontal track of process steps, each shown with a real project screen. */
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
