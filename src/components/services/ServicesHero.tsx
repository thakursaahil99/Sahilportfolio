"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import RevealText from "../fx/RevealText";
import ScrambleText from "../fx/ScrambleText";
import VelocityMarquee from "../fx/VelocityMarquee";

const OUT = [0.16, 1, 0.3, 1] as const;
const OFFERS = ["WEB APPS", "ECOMMERCE", "AI FEATURES", "MOTION SITES", "APIS & BACKENDS"];
// three of my own builds, fanned out beside the headline
const SHOTS = [
  { src: "/projects/sahu-music/cover.jpg", alt: "Sahu Music", pos: "right-0 top-0", rotate: 7, delay: 0.5 },
  { src: "/projects/quickcart/cover.jpg", alt: "QuickCart", pos: "left-0 top-[24%]", rotate: -6, delay: 0.65 },
  { src: "/projects/glide-in-bir.jpg", alt: "Glide in Bir", pos: "right-[8%] top-[50%]", rotate: 3, delay: 0.8 },
];
const STACK = ["Next.js", "React", "Node.js", "Magento 2", "Laravel", "PostgreSQL", "MongoDB", "GSAP", "WebGL", "Tailwind"];

export default function ServicesHero() {
  return (
    <section className="relative overflow-hidden pt-36 md:pt-44">
      {/* slow orbiting rings */}
      <div className="pointer-events-none absolute -right-[20vw] -top-[10vw] h-[70vw] w-[70vw] rounded-full border border-line md:h-[45vw] md:w-[45vw] md:-right-[8vw]">
        <div className="absolute inset-[12%] rounded-full border border-dashed border-ink/10 animate-spin-slow" />
        <div className="absolute inset-[30%] rounded-full bg-[radial-gradient(closest-side,rgb(255_45_32/0.25),transparent)]" />
      </div>

      {/* project screens — desktop only, the headline owns the phone layout */}
      <div aria-hidden="true" className="pointer-events-none absolute right-[5vw] top-[15vh] hidden h-[44vh] w-[33vw] lg:block">
        {SHOTS.map((s, i) => (
          <motion.div
            key={s.src}
            initial={{ opacity: 0, y: 80, rotate: 0, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, rotate: s.rotate, scale: 1 }}
            transition={{ duration: 1.2, ease: OUT, delay: s.delay }}
            className={`absolute w-[60%] ${s.pos}`}
          >
            <div
              className="float-y relative aspect-[16/10] overflow-hidden rounded-xl border border-ink/15 bg-panel shadow-[0_40px_80px_-25px_rgba(0,0,0,0.9)]"
              style={{ animationDelay: `${-i * 2.3}s` }}
            >
              <Image src={s.src} alt={s.alt} fill sizes="20vw" loading="eager" className="object-cover object-left-top" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative px-6 md:px-12">
        <motion.p
          className="eyebrow mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: OUT, delay: 0.2 }}
        >
          [ Services — {new Date().getFullYear()} ]
        </motion.p>

        <h1 className="font-display font-black uppercase leading-[0.85] tracking-[-0.05em]">
          <RevealText text="What I" split="chars" className="block text-[18vw] md:text-[11vw]" />
          <RevealText text="build." split="chars" delay={0.2} className="block text-[18vw] text-molten md:text-[11vw]" />
        </h1>

        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[1fr_1fr] md:items-end">
          <motion.p
            className="max-w-md text-base leading-relaxed text-ink/70 md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: OUT, delay: 0.5 }}
          >
            From the database schema to the last micro-interaction — I design, build and ship complete products that are
            fast, accessible and a little bit cinematic.
          </motion.p>
          <motion.div
            className="md:text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.7 }}
          >
            <span className="eyebrow mb-2 block">Currently shipping</span>
            <ScrambleText phrases={OFFERS} hold={1800} className="font-mono text-lg tracking-[0.2em] text-gold md:text-2xl" />
          </motion.div>
        </div>
      </div>

      <div className="mt-20 border-y border-line py-5 md:mt-28">
        <VelocityMarquee baseVelocity={-2}>
          {STACK.map((s) => (
            <span key={s} className="flex items-center gap-8 px-4 font-display text-3xl font-black uppercase tracking-tight text-ink/80 md:text-5xl">
              {s}
              <span className="text-red">✦</span>
            </span>
          ))}
        </VelocityMarquee>
      </div>
    </section>
  );
}
