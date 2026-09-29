"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { Accent } from "@/data/projects";
import SectionTag from "./SectionTag";
import RevealText from "./fx/RevealText";
import ProjectArt from "./work/ProjectArt";
import TLink from "./transition/TLink";

type Service = {
  title: string;
  desc: string;
  tags: string[];
  accent: Accent;
  glyph: string;
  /** [back, front] screenshots shown in the card */
  shots: [string, string];
  example: { label: string; slug: string };
};

const SERVICES: Service[] = [
  {
    title: "Web apps & platforms",
    desc: "Booking engines, super-apps and dashboards — from the database schema and API to a pixel-perfect, real-time UI.",
    tags: ["Next.js", "React", "Node.js", "Express", "NestJS", "MongoDB", "PostgreSQL"],
    accent: "orange",
    glyph: "{ }",
    shots: ["/projects/glido/cover-1.jpg", "/projects/glide-in-bir.jpg"],
    example: { label: "Glide in Bir", slug: "glide-in-bir" },
  },
  {
    title: "eCommerce",
    desc: "Magento 2 storefronts, multi-vendor marketplaces and checkout flows engineered for speed and conversion.",
    tags: ["Magento 2", "Laravel", "GraphQL", "Razorpay", "Multi-vendor"],
    accent: "green",
    glyph: "₹",
    shots: ["/projects/glido/cover-0.jpg", "/projects/pahadibhai.jpg"],
    example: { label: "Pahadibhai", slug: "pahadibhai" },
  },
  {
    title: "AI integrations",
    desc: "Assistants, voice agents, RAG search and AI features that ship to production — not just demos.",
    tags: ["LLM APIs", "Ollama", "Qdrant RAG", "Vapi Voice", "FastAPI"],
    accent: "violet",
    glyph: "✦",
    shots: ["/projects/sahucodex/cover-1.jpg", "/projects/sahucodex/cover-0.jpg"],
    example: { label: "SahuCodeX", slug: "sahucodex" },
  },
  {
    title: "Motion & 3D sites",
    desc: "Cinematic, award-style websites with WebGL shaders, GSAP scroll stories and smooth scrolling — like this one.",
    tags: ["WebGL", "Three.js", "GSAP", "Lenis", "Framer Motion"],
    accent: "red",
    glyph: "◐",
    shots: ["/projects/redbean-hospitality/3d-0.jpg", "/projects/bobby-singh/cover-0.jpg"],
    example: { label: "Bobby Singh", slug: "bobby-singh" },
  },
];

const EASE_OUT = "ease-[cubic-bezier(0.16,1,0.3,1)]";

function Shot({ src, className }: { src: string; className: string }) {
  return (
    <div
      className={`absolute aspect-[16/10] overflow-hidden rounded-xl border border-ink/15 bg-background shadow-[0_40px_80px_-25px_rgba(0,0,0,0.9)] transition-transform duration-1000 ${EASE_OUT} ${className}`}
    >
      <Image src={src} alt="" fill sizes="(min-width: 768px) 32vw, 70vw" className="object-cover object-top" />
    </div>
  );
}

function ServiceCard({ service, index, progress }: { service: Service; index: number; progress: MotionValue<number> }) {
  const n = SERVICES.length;
  // each card shrinks and dims as the cards after it stack on top
  const scale = useTransform(progress, [index / n, 1], [1, 1 - (n - 1 - index) * 0.05]);
  const dim = useTransform(progress, [index / n, 1], [0, (n - 1 - index) * 0.18]);

  return (
    <div className="sticky flex h-[78vh] items-start justify-center md:h-[82vh]" style={{ top: `calc(11vh + ${index * 24}px)` }}>
      <motion.article
        style={{ scale }}
        className="group relative grid h-[66vh] w-full origin-top grid-rows-[38%_1fr] overflow-hidden rounded-3xl border border-line bg-panel md:h-[64vh] md:grid-cols-[1fr_1.15fr] md:grid-rows-1"
      >
        <ProjectArt accent={service.accent} />
        <motion.div style={{ opacity: dim }} className="pointer-events-none absolute inset-0 z-10 bg-background" />

        {/* screenshots — fan out on hover */}
        <div className="relative order-1 md:order-2">
          <Shot
            src={service.shots[0]}
            className="right-[4%] top-[10%] w-[62%] rotate-[5deg] opacity-80 md:right-[6%] md:top-[12%] md:w-[64%] group-hover:translate-x-4 group-hover:-translate-y-3 group-hover:rotate-[8deg]"
          />
          <Shot
            src={service.shots[1]}
            className="left-[6%] bottom-[4%] w-[68%] -rotate-[4deg] md:left-[2%] md:bottom-[12%] md:w-[70%] group-hover:-translate-x-3 group-hover:translate-y-2 group-hover:-rotate-[1deg] group-hover:scale-[1.04]"
          />
        </div>

        {/* copy */}
        <div className="relative order-2 flex flex-col justify-between gap-4 p-6 md:order-1 md:p-10">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/70">
              Service {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 font-display text-lg text-ink/80 transition-transform duration-700 group-hover:rotate-[20deg] md:h-14 md:w-14 md:text-xl">
              {service.glyph}
            </span>
          </div>

          <div>
            <h3 className="font-display text-[7vw] md:text-[2.4vw] font-black uppercase leading-[0.92] tracking-[-0.03em]">
              {service.title}
            </h3>
            <p className="mt-3 max-w-md text-sm md:text-base leading-relaxed text-ink/75">{service.desc}</p>
            <ul className="mt-4 hidden flex-wrap gap-1.5 sm:flex">
              {service.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-ink/20 bg-background/30 px-2.5 py-0.5 font-mono text-[9px] tracking-[0.15em] uppercase backdrop-blur-md"
                >
                  {t}
                </li>
              ))}
            </ul>
            <TLink
              href={`/work/${service.example.slug}`}
              className="group/link mt-5 inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] uppercase"
            >
              <span className="relative">
                See it in {service.example.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover/link:scale-x-100" />
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/30 transition-all duration-500 group-hover/link:bg-ink group-hover/link:text-background">
                →
              </span>
            </TLink>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section className="relative px-6 pt-20 md:px-12 md:pt-28">
      <SectionTag index="02" label="Services — What I build" />
      <RevealText
        as="h2"
        text="Four ways I can suit you up."
        className="block max-w-5xl font-display text-[9vw] md:text-[3.6vw] font-black uppercase leading-[0.9] tracking-[-0.04em]"
      />
      <div ref={ref} className="relative mt-12 md:mt-16">
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.title} service={s} index={i} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
