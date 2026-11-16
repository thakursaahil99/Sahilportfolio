"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { animate, motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { useCopyEmail } from "@/lib/use-copy-email";
import { openCommandMenu } from "../CommandMenu";
import Counter from "../fx/Counter";
import LiquidReveal from "../fx/LiquidReveal";
import Magnetic from "../fx/Magnetic";
import Reveal, { SplitReveal } from "../fx/Reveal";
import RevealText from "../fx/RevealText";
import ScrollLitText from "../fx/ScrollLitText";
import SpotlightCard from "../fx/SpotlightCard";
import VelocityMarquee from "../fx/VelocityMarquee";
import TLink from "../transition/TLink";
import BrowserShot from "../work/BrowserShot";
import DotField from "./DotField";

const OUT = [0.16, 1, 0.3, 1] as const;
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=<>/";
const COVERS = projects.filter((p) => p.cover);

/** Every experiment on the page: number, name, how to play with it and where it is used on the site. */
export const EXPERIMENT_COUNT = 21;

function Panel({
  n,
  title,
  hint,
  usedIn,
  replay = false,
  children,
  className = "",
}: {
  n: string;
  title: string;
  hint: string;
  /** where this effect is used on the site */
  usedIn: string;
  /** adds a Replay button that remounts the demo so its entrance plays again */
  replay?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const [run, setRun] = useState(0);
  return (
    <motion.section
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1, ease: OUT }}
      className={`relative flex flex-col overflow-hidden rounded-3xl border border-line bg-panel ${className}`}
    >
      <header className="pointer-events-none relative z-10 flex items-start justify-between gap-6 p-6 md:p-8">
        <div>
          <span className="font-mono text-[10px] tracking-[0.3em] text-red">EXPERIMENT {n}</span>
          <h3 className="mt-2 font-display text-2xl font-black uppercase tracking-tight md:text-3xl">{title}</h3>
          <p className="mt-2 font-mono text-[10px] tracking-[0.18em] uppercase text-muted">
            Used in — <span className="text-ink/70">{usedIn}</span>
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="rounded-full border border-line bg-panel/70 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink/60">{hint}</span>
          {replay && (
            <button
              onClick={() => setRun((r) => r + 1)}
              className="pointer-events-auto rounded-full bg-ink px-3 py-1.5 font-mono text-[10px] font-semibold tracking-[0.2em] uppercase text-background transition-colors hover:bg-gold"
            >
              Replay ↻
            </button>
          )}
        </div>
      </header>
      <div key={run} className="relative flex-1">
        {children}
      </div>
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

/** The hero's WebGL lens, in a box: the armour on top, the photo underneath. */
function XRay() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} data-cursor="hidden" className="absolute inset-0 touch-pan-y select-none">
      <LiquidReveal
        targetRef={ref}
        top={profile.heroImages.superhero.src}
        bottom={profile.heroImages.original.src}
        topFocus={profile.heroImages.superhero.focus}
        bottomFocus={profile.heroImages.original.focus}
        play
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-panel to-transparent" />
    </div>
  );
}

/** Ring + counter that fill together — the intro loader. Plays on mount. */
function LoaderRing() {
  const ring = useRef<SVGCircleElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const LENGTH = 2 * Math.PI * 46;

  useEffect(() => {
    const controls = animate(0, 1, {
      duration: 2.4,
      ease: [0.76, 0, 0.24, 1],
      onUpdate: (v) => {
        if (ring.current) ring.current.style.strokeDashoffset = String(LENGTH * (1 - v));
        if (num.current) num.current.textContent = String(Math.round(v * 100)).padStart(2, "0");
      },
    });
    return () => controls.stop();
  }, [LENGTH]);

  return (
    <div className="flex h-full min-h-[260px] items-center justify-center gap-8 px-6 pb-10">
      <div className="relative h-36 w-36 md:h-44 md:w-44">
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-ink/10" />
          <circle ref={ring} cx="50" cy="50" r="46" fill="none" stroke="#ff2d20" strokeWidth="2.4" strokeLinecap="round" strokeDasharray={LENGTH} strokeDashoffset={LENGTH} />
        </svg>
        <span className="absolute inset-[9%] overflow-hidden rounded-full">
          <Image src={profile.avatar} alt="" fill sizes="176px" className="object-cover" />
        </span>
      </div>
      <p className="font-display text-7xl font-black leading-none tracking-[-0.06em] tabular-nums md:text-8xl">
        <span ref={num}>00</span>
        <span className="align-top font-mono text-lg font-normal text-red">%</span>
      </p>
    </div>
  );
}

/** List whose rows pull a preview image along behind the pointer. */
function HoverList() {
  const items = COVERS.slice(0, 5);
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 160, damping: 20, mass: 0.6 });

  return (
    <div
      className="relative px-6 pb-8 md:px-8"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="border-t border-line [&:hover>li]:opacity-40 [&>li:hover]:!opacity-100">
        {items.map((p, i) => (
          <li key={p.slug} className="border-b border-line transition-opacity duration-300" onPointerEnter={() => setActive(i)}>
            <TLink href={`/work/${p.slug}`} className="flex items-center justify-between gap-4 py-4">
              <span className="font-display text-xl font-black uppercase tracking-tight md:text-2xl">{p.title}</span>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted">{p.category}</span>
            </TLink>
          </li>
        ))}
      </ul>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-20 hidden aspect-[16/10] w-56 overflow-hidden rounded-xl border border-ink/15 shadow-2xl md:block"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: active === null ? 0 : 1, scale: active === null ? 0.5 : 1 }}
        transition={{ duration: 0.35, ease: OUT }}
      >
        {items.map((p, i) => (
          <Image
            key={p.slug}
            src={p.cover as string}
            alt=""
            fill
            sizes="224px"
            className={`object-cover object-top transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </motion.div>
    </div>
  );
}

const ACCORDION = [
  { q: "No height measuring", a: "The row animates grid-template-rows from 0fr to 1fr, so the browser works out the height itself." },
  { q: "Cheap on phones", a: "It is one CSS transition — nothing runs in JavaScript while it opens." },
  { q: "Keyboard friendly", a: "Each row is a real button with aria-expanded, so Tab, Enter and Space all work." },
];

function Accordion() {
  const [open, setOpen] = useState(0);
  return (
    <ul className="mx-6 mb-8 border-t border-line md:mx-8">
      {ACCORDION.map((it, i) => {
        const on = open === i;
        return (
          <li key={it.q} className="border-b border-line">
            <button onClick={() => setOpen(on ? -1 : i)} aria-expanded={on} className="flex w-full items-center justify-between gap-4 py-4 text-left">
              <span className={`font-display text-lg font-bold uppercase tracking-tight transition-colors md:text-xl ${on ? "text-gold" : ""}`}>{it.q}</span>
              <span className={`text-2xl text-gold transition-transform duration-500 ${on ? "rotate-45" : ""}`}>+</span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <p className="overflow-hidden text-sm leading-relaxed text-ink/70">
                <span className="block pb-5">{it.a}</span>
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Snap carousel in miniature — the browser's own scrolling, snapped to each card. */
function SnapStrip() {
  return (
    <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-6 pb-8 md:px-8">
      {COVERS.slice(5, 14).map((p) => (
        <TLink
          key={p.slug}
          href={`/work/${p.slug}`}
          className="group relative aspect-[16/10] w-[70%] shrink-0 snap-center overflow-hidden rounded-2xl border border-ink/10 sm:w-[46%]"
        >
          <Image src={p.cover as string} alt={p.title} fill sizes="320px" className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent px-4 pt-10 pb-3 font-display text-sm font-black uppercase tracking-tight">
            {p.title}
          </span>
        </TLink>
      ))}
    </div>
  );
}

const REVEALS: { kind: "up" | "left" | "right" | "scale" | "clip" | "rule"; label: string }[] = [
  { kind: "up", label: "Rise" },
  { kind: "left", label: "From left" },
  { kind: "right", label: "From right" },
  { kind: "scale", label: "Scale" },
  { kind: "clip", label: "Curtain" },
];

function Btn({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-full border border-ink/25 px-5 py-3 font-mono text-[11px] tracking-[0.2em] uppercase"
    >
      <span className="absolute inset-0 translate-y-full rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />
      <span className="relative transition-colors duration-500 group-hover:text-background">{children}</span>
    </button>
  );
}

function SystemControls() {
  const { copied, copy } = useCopyEmail();
  return (
    <div className="flex flex-wrap gap-3 px-6 pb-8 md:px-8">
      <Btn onClick={openCommandMenu}>Open search · Ctrl K</Btn>
      <Btn
        onClick={() => {
          try {
            sessionStorage.removeItem("portfolio:intro-seen");
          } catch {
            /* storage blocked — the full intro plays anyway */
          }
          window.location.reload();
        }}
      >
        Replay the intro
      </Btn>
      <TLink
        href="/work"
        className="rounded-full bg-red px-5 py-3 font-mono text-[11px] font-semibold tracking-[0.2em] uppercase text-ink transition-colors hover:bg-ink hover:text-background"
      >
        Play page transition → Work
      </TLink>
      <Btn onClick={copy}>{copied ? "Copied ✓" : "Copy my email"}</Btn>
    </div>
  );
}

export default function LabExperiments() {
  const dragArea = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: waveRef, offset: ["start end", "end start"] });
  const wave = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  return (
    <div className="grid gap-6 px-6 pb-10 md:grid-cols-2 md:px-12">
      {/* ---------- canvas & WebGL ---------- */}
      <Panel n="01" title="Repulsor field" hint="Move / drag" usedIn="Lab" className="h-[70vh] md:col-span-2">
        <div className="absolute inset-0">
          <DotField />
        </div>
      </Panel>

      <Panel n="02" title="Liquid x-ray" hint="Move / hold" usedIn="Home hero" className="h-[72vh] md:col-span-2">
        <XRay />
      </Panel>

      {/* ---------- type ---------- */}
      <Panel n="03" title="Decoder" hint="Hover / tap" usedIn="Hero role line">
        <div className="flex flex-wrap gap-x-5 gap-y-1 px-6 pb-8 text-[10vw] leading-[1] md:px-8 md:text-[3.2vw]">
          {WORDS.map((w) => (
            <ScrambleWord key={w} word={w} />
          ))}
        </div>
      </Panel>

      <Panel n="04" title="Masked headline" hint="Auto" usedIn="Home section titles" replay>
        <div className="px-6 pb-10 md:px-8">
          <SplitReveal
            as="p"
            text="Every word rises out of its own mask, one after another."
            accent={["rises", "mask"]}
            className="block font-display text-[8vw] font-black uppercase leading-[0.95] tracking-[-0.04em] md:text-[2.8vw]"
          />
        </div>
      </Panel>

      <Panel n="05" title="Scroll-lit copy" hint="Scroll" usedIn="About manifesto" className="md:col-span-2">
        <div className="px-6 pb-12 md:px-8 md:pb-16">
          <ScrollLitText
            text="Words light up one by one as the paragraph moves through the screen, so you read at the speed you scroll — a small trick that makes long copy feel alive."
            highlight={["light", "alive"]}
            className="max-w-5xl font-display text-[6vw] font-medium leading-[1.1] tracking-[-0.03em] md:text-[2.6vw]"
          />
        </div>
      </Panel>

      <Panel n="06" title="Type specimen" hint="Hover" usedIn="Everywhere">
        <div className="space-y-3 px-6 pb-8 md:px-8">
          <p className="font-display text-[10.5vw] font-black uppercase leading-[0.9] tracking-[-0.05em] text-molten md:text-[4.2vw]">Molten</p>
          <p className="font-display text-[10.5vw] font-black uppercase leading-[0.9] tracking-[-0.05em] text-outline md:text-[4.2vw]">Outline</p>
          <p className="font-display text-[10.5vw] font-black uppercase leading-[0.9] tracking-[-0.05em] transition-colors duration-500 hover:text-gold md:text-[4.2vw]">
            Unbounded
          </p>
          <p className="eyebrow pt-2">[ Geist Mono — labels, numbers, code ]</p>
        </div>
      </Panel>

      <Panel n="07" title="Count-up" hint="Auto" usedIn="Stats on Home & About" replay>
        <div className="grid grid-cols-2 gap-px px-6 pb-8 md:px-8">
          {[
            { to: projects.length, suffix: "", label: "Projects" },
            { to: projects.filter((p) => p.link).length, suffix: "", label: "Live links" },
            { to: profile.stats[0].value, suffix: "+", label: "Years" },
            { to: new Set(projects.map((p) => p.category)).size, suffix: "", label: "Categories" },
          ].map((s) => (
            <div key={s.label} className="border border-line p-5">
              <Counter to={s.to} suffix={s.suffix} className="block font-display text-5xl font-black tracking-tight" />
              <p className="eyebrow mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </Panel>

      {/* ---------- pointer ---------- */}
      <Panel n="08" title="Magnetic buttons" hint="Hover" usedIn="Hero, contact, footer" className="min-h-[340px]">
        <div className="flex h-full min-h-[200px] flex-wrap items-center justify-center gap-8 px-6 pb-10">
          {[
            { s: 0.2, label: "Soft" },
            { s: 0.45, label: "Medium" },
            { s: 0.8, label: "Strong" },
          ].map((b) => (
            <Magnetic key={b.label} strength={b.s}>
              <span className="flex h-28 w-28 cursor-default items-center justify-center rounded-full border border-ink/25 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 hover:border-transparent hover:bg-red">
                {b.label}
              </span>
            </Magnetic>
          ))}
        </div>
      </Panel>

      <Panel n="09" title="Spotlight & tilt" hint="Move" usedIn="About ID card, skill cards">
        <div className="grid gap-4 px-6 pb-8 sm:grid-cols-2 md:px-8 [perspective:1200px]">
          {["Glow follows the pointer", "The card leans toward it"].map((t, i) => (
            <SpotlightCard key={t} tilt={i ? 16 : 8} className="p-6">
              <span className="font-mono text-[10px] tracking-[0.25em] text-gold">0{i + 1}</span>
              <p className="mt-8 font-display text-xl font-black uppercase leading-tight tracking-tight">{t}</p>
            </SpotlightCard>
          ))}
        </div>
      </Panel>

      <Panel n="10" title="Cursor morph" hint="Mouse only" usedIn="Whole site">
        <div className="grid grid-cols-2 gap-3 px-6 pb-8 md:px-8">
          {["View", "Drag", "Copy", "Let's go"].map((label) => (
            <div
              key={label}
              data-cursor-label={label}
              className="flex h-24 items-center justify-center rounded-2xl border border-dashed border-ink/20 font-mono text-[10px] tracking-[0.2em] uppercase text-ink/60"
            >
              Hover → “{label}”
            </div>
          ))}
        </div>
      </Panel>

      <Panel n="11" title="Hover preview list" hint="Hover" usedIn="Work page — list view">
        <HoverList />
      </Panel>

      <Panel n="12" title="Toolbox" hint="Drag & throw" usedIn="Lab" className="min-h-[60vh]">
        <div ref={dragArea} className="absolute inset-0 m-4">
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

      <Panel n="13" title="Tilted browser" hint="Hover" usedIn="Case studies">
        <div className="group px-8 pb-10 md:px-12">
          <BrowserShot src="/projects/glideinbir-kart/cover.jpg" alt="Glideinbir Kart — front page" url="https://glideinbir-kart.vercel.app" tilt sizes="(min-width: 768px) 40vw, 90vw" />
        </div>
      </Panel>

      {/* ---------- scroll & reveal ---------- */}
      <Panel n="14" title="Reveal kit" hint="Auto" usedIn="Every Home section" replay>
        <div className="grid grid-cols-2 gap-3 px-6 pb-6 sm:grid-cols-3 md:px-8">
          {REVEALS.map((r, i) => (
            <Reveal key={r.kind} kind={r.kind} delay={i * 140} className="relative flex h-24 items-center justify-center overflow-hidden rounded-2xl bg-ink/10 font-mono text-[10px] tracking-[0.2em] uppercase">
              {r.label}
            </Reveal>
          ))}
          <div className="flex h-24 flex-col justify-center gap-3">
            <Reveal kind="rule" delay={700} className="h-px bg-gradient-to-r from-red to-gold" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/70">Drawn rule</span>
          </div>
        </div>
        <p className="px-6 pb-8 text-sm leading-relaxed text-muted md:px-8">
          One IntersectionObserver for the whole page; the motion is plain CSS, so it stays smooth on phones.
        </p>
      </Panel>

      <Panel n="15" title="Loader ring" hint="Auto" usedIn="Intro" replay>
        <LoaderRing />
      </Panel>

      <Panel n="16" title="Velocity marquee" hint="Scroll fast" usedIn="Services, About" className="md:col-span-2">
        <div className="border-y border-line py-5">
          <VelocityMarquee baseVelocity={-2.5}>
            {["Scroll faster", "It speeds up", "Scroll back", "It reverses"].map((t) => (
              <span key={t} className="flex items-center">
                <span className="px-6 font-display text-[10vw] font-black uppercase leading-none tracking-[-0.04em] md:text-[5vw]">{t}</span>
                <span className="text-[5vw] text-red md:text-[2.4vw]">✦</span>
              </span>
            ))}
          </VelocityMarquee>
        </div>
        <div className="h-8" />
      </Panel>

      <Panel n="17" title="Endless wall" hint="Hover to pause" usedIn="Home — screens wall" className="md:col-span-2">
        <div className="marquee-pause overflow-hidden pb-8">
          <div className="marquee" style={{ "--marquee-duration": "60s" } as React.CSSProperties}>
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
                {COVERS.slice(0, 12).map((p) => (
                  <span key={p.slug} className="relative mx-2 block h-28 w-44 shrink-0 overflow-hidden rounded-xl border border-ink/10 md:h-36 md:w-56">
                    <Image src={p.cover as string} alt="" fill sizes="224px" className="object-cover object-top" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel n="18" title="Snap carousel" hint="Swipe" usedIn="Home — featured work">
        <SnapStrip />
      </Panel>

      <Panel n="19" title="Zero-measure accordion" hint="Tap" usedIn="Home services, FAQ">
        <Accordion />
      </Panel>

      <Panel n="20" title="Tidal type" hint="Scroll" usedIn="Lab" className="md:col-span-2">
        <div ref={waveRef} className="overflow-hidden px-6 pt-6 pb-20 md:px-8 md:pt-10 md:pb-28">
          <p className="whitespace-nowrap text-center font-display text-[13vw] font-black uppercase leading-none tracking-[-0.04em] md:text-[9vw]">
            {"Make it move".split("").map((ch, i, all) => (
              <WaveLetter key={i} ch={ch} i={i} n={all.length} progress={wave} />
            ))}
          </p>
        </div>
      </Panel>

      {/* ---------- system ---------- */}
      <Panel n="21" title="Site controls" hint="Click" usedIn="Search, intro, page transitions" className="md:col-span-2">
        <SystemControls />
      </Panel>
    </div>
  );
}

export function LabHero({ techCount }: { techCount: number }) {
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
        <RevealText text="The" split="chars" className="block text-[15.5vw] md:text-[11vw]" />
        <RevealText text="motion lab." split="chars" delay={0.15} className="block text-[15.5vw] text-molten md:text-[11vw]" />
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <motion.p
          className="max-w-lg text-base leading-relaxed text-ink/70 md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: OUT, delay: 0.5 }}
        >
          Every effect this site is built from, taken apart so you can play with each one — and below them, every
          technology I&apos;ve shipped with, linked to the projects that used it.
        </motion.p>

        <motion.dl
          className="grid grid-cols-3 divide-x divide-line rounded-2xl border border-line"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: OUT, delay: 0.6 }}
        >
          {[
            { v: EXPERIMENT_COUNT, k: "Experiments" },
            { v: techCount, k: "Technologies" },
            { v: projects.length, k: "Projects" },
          ].map((s) => (
            <div key={s.k} className="px-5 py-4 md:px-7">
              <dd className="font-display text-2xl font-black md:text-3xl">{s.v}</dd>
              <dt className="mt-1 font-mono text-[9px] tracking-[0.25em] uppercase text-muted">{s.k}</dt>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
