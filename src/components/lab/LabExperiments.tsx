"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import RevealText from "../fx/RevealText";
import DotField from "./DotField";

const OUT = [0.16, 1, 0.3, 1] as const;
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=<>/";

function Panel({ n, title, hint, children, className = "" }: { n: string; title: string; hint: string; children: ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1, ease: OUT }}
      className={`relative overflow-hidden rounded-3xl border border-line bg-panel ${className}`}
    >
      <header className="pointer-events-none relative z-10 flex items-start justify-between gap-6 p-6 md:p-8">
        <div>
          <span className="font-mono text-[10px] tracking-[0.3em] text-red">EXPERIMENT {n}</span>
          <h3 className="mt-2 font-display text-2xl font-black uppercase tracking-tight md:text-4xl">{title}</h3>
        </div>
        <span className="rounded-full border border-line px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink/60">{hint}</span>
      </header>
      {children}
    </motion.section>
  );
}

/** A word that decodes from random glyphs whenever it's hovered or tapped. */
function ScrambleWord({ word }: { word: string }) {
  const [text, setText] = useState(word);
  const running = useRef(false);

  const play = () => {
    if (running.current) return;
    running.current = true;
    let frame = 0;
    const total = word.length * 3 + 8;
    const tick = () => {
      frame++;
      setText(
        word
          .split("")
          .map((ch, i) => (ch === " " || frame > i * 3 + 8 ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join("")
      );
      if (frame < total) requestAnimationFrame(tick);
      else running.current = false;
    };
    requestAnimationFrame(tick);
  };

  return (
    <span
      onPointerEnter={play}
      onPointerDown={play}
      className="cursor-default select-none font-display font-black uppercase tracking-tight transition-colors duration-300 hover:text-gold"
    >
      {text}
    </span>
  );
}

const WORDS = ["Design", "Build", "Ship", "Iterate", "Motion", "WebGL", "Commerce", "AI", "Scale", "Repeat"];
const CHIPS = [
  { t: "Next.js", c: "bg-ink text-background" },
  { t: "GSAP", c: "bg-red text-ink" },
  { t: "WebGL", c: "bg-gold text-background" },
  { t: "Magento 2", c: "bg-[#4f7cff] text-ink" },
  { t: "Node.js", c: "bg-[#3ddc84] text-background" },
  { t: "Framer Motion", c: "bg-[#7c5cff] text-ink" },
  { t: "TypeScript", c: "bg-[#1688ff] text-ink" },
  { t: "Laravel", c: "bg-[#ff7a3d] text-background" },
];

/** Blend two #rrggbb colours. */
function mix(a: string, b: string, t: number) {
  const ch = (hex: string, k: number) => parseInt(hex.slice(1 + k * 2, 3 + k * 2), 16);
  const c = [0, 1, 2].map((k) => Math.round(ch(a, k) + (ch(b, k) - ch(a, k)) * t));
  return `rgb(${c.join(",")})`;
}

function WaveLetter({ ch, i, n, progress }: { ch: string; i: number; n: number; progress: MotionValue<number> }) {
  // rounded so the server-rendered transform matches the client exactly (no hydration mismatch)
  const y = useTransform(progress, (p) => Math.round(Math.sin(p * Math.PI * 4 + i * 0.6) * 40));
  const rotate = useTransform(progress, (p) => Math.round(Math.cos(p * Math.PI * 4 + i * 0.6) * 100) / 10);
  // per-letter colour: background-clip text can't follow per-letter transforms
  return (
    <motion.span className="inline-block" style={{ y, rotate, color: mix("#ffb547", "#ff2d20", i / Math.max(1, n - 1)) }}>
      {ch === " " ? " " : ch}
    </motion.span>
  );
}

export default function LabExperiments() {
  const dragArea = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: waveRef, offset: ["start end", "end start"] });
  const wave = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  return (
    <div className="grid gap-6 px-6 pb-10 md:grid-cols-2 md:px-12">
      <Panel n="01" title="Repulsor field" hint="Move / drag" className="h-[70vh] md:col-span-2">
        <DotField />
      </Panel>

      <Panel n="02" title="Decoder" hint="Hover / tap" className="min-h-[60vh]">
        <div className="flex flex-wrap gap-x-5 gap-y-1 px-6 pb-8 text-[10vw] leading-[1] md:px-8 md:text-[3.6vw]">
          {WORDS.map((w) => (
            <ScrambleWord key={w} word={w} />
          ))}
        </div>
      </Panel>

      <Panel n="03" title="Toolbox" hint="Drag & throw" className="min-h-[60vh]">
        <div ref={dragArea} className="absolute inset-0 top-24 m-4">
          {CHIPS.map((chip, i) => (
            <motion.div
              key={chip.t}
              drag
              dragConstraints={dragArea}
              dragElastic={0.25}
              dragTransition={{ bounceStiffness: 300, bounceDamping: 18 }}
              whileDrag={{ scale: 1.12, rotate: 6, zIndex: 20 }}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: -60, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: (i % 2 ? 1 : -1) * (4 + i) }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 14, delay: i * 0.06 }}
              className={`absolute cursor-grab touch-none rounded-full px-5 py-3 font-display text-base font-black uppercase tracking-tight shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] active:cursor-grabbing md:text-xl ${chip.c}`}
              style={{ left: `${8 + (i % 3) * 30}%`, top: `${8 + Math.floor(i / 3) * 28}%` }}
            >
              {chip.t}
            </motion.div>
          ))}
        </div>
      </Panel>

      <Panel n="04" title="Tidal type" hint="Scroll" className="md:col-span-2">
        <div ref={waveRef} className="overflow-hidden px-6 pt-10 pb-20 md:px-8 md:pt-16 md:pb-28">
          <p className="whitespace-nowrap text-center font-display text-[13vw] font-black uppercase leading-none tracking-[-0.04em] md:text-[9vw]">
            {"Make it move".split("").map((ch, i, all) => (
              <WaveLetter key={i} ch={ch} i={i} n={all.length} progress={wave} />
            ))}
          </p>
        </div>
      </Panel>
    </div>
  );
}

export function LabHero() {
  return (
    <section className="relative px-6 pt-36 pb-16 md:px-12 md:pt-44 md:pb-24">
      <motion.p
        className="eyebrow mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: OUT, delay: 0.2 }}
      >
        [ Lab — Playground ]
      </motion.p>
      <h1 className="font-display font-black uppercase leading-[0.85] tracking-[-0.05em]">
        <RevealText text="The" split="chars" className="block text-[18vw] md:text-[11vw]" />
        <RevealText text="motion lab." split="chars" delay={0.15} className="block text-[18vw] text-molten md:text-[11vw]" />
      </h1>
      <motion.p
        className="mt-10 max-w-lg text-base leading-relaxed text-ink/70 md:text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: OUT, delay: 0.5 }}
      >
        Small interactive experiments — the building blocks behind the sites I make. Poke at them: everything here
        reacts to your cursor, finger or scroll.
      </motion.p>
    </section>
  );
}
