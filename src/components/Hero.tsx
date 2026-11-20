"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { useIntroDone } from "@/lib/use-intro";
import { scrollToTarget } from "@/lib/smooth-scroll";
import LiquidReveal from "./fx/LiquidReveal";
import RevealText from "./fx/RevealText";
import ScrambleText from "./fx/ScrambleText";
import Magnetic from "./fx/Magnetic";
import TLink from "./transition/TLink";

// real case in the markup — the heading is uppercased with CSS
const [FIRST_NAME, ...REST] = profile.name.split(" ");
const LAST_NAME = REST.join(" ");
const EASE = [0.16, 1, 0.3, 1] as const;

const FACTS = [
  { value: String(projects.length), label: "Projects shipped" },
  { value: profile.experienceYears, label: "Years building" },
  { value: String(projects.filter((p) => p.link).length), label: "Live on the web" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const intro = useIntroDone();
  const [active, setActive] = useState(false);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: intro ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 1, ease: EASE, delay },
  });

  return (
    <section
      id="home"
      ref={sectionRef}
      data-cursor="hidden"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden select-none touch-pan-y"
    >
      {/* static fallback if WebGL is unavailable */}
      <div
        className="absolute inset-0 bg-cover"
        style={{
          backgroundImage: `url(${profile.heroImages.superhero.src})`,
          backgroundPosition: profile.heroImages.superhero.focus.map((v) => `${v * 100}%`).join(" "),
        }}
      />
      <LiquidReveal
        targetRef={sectionRef}
        top={profile.heroImages.superhero.src}
        bottom={profile.heroImages.original.src}
        topFocus={profile.heroImages.superhero.focus}
        bottomFocus={profile.heroImages.original.focus}
        play={intro}
        onActiveChange={setActive}
      />

      {/* readability */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/55 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-background/90 via-background/50 to-transparent md:h-56" />
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-background/60 to-transparent md:block" />

      {/* corner brackets — a viewfinder around the frame */}
      <motion.div {...fade(0.9)} aria-hidden="true" className="pointer-events-none absolute inset-4 hidden md:block">
        {["left-0 top-24 border-l border-t", "right-0 top-24 border-r border-t", "left-0 bottom-0 border-l border-b", "right-0 bottom-0 border-r border-b"].map((c) => (
          <span key={c} className={`absolute h-5 w-5 border-ink/30 ${c}`} />
        ))}
      </motion.div>

      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between px-6 pt-28 pb-6 md:px-12 md:pt-32 md:pb-8">
        {/* top row */}
        <div className="flex items-start justify-between gap-6">
          <motion.div {...fade(0.5)} className="max-w-xs">
            <p className="eyebrow mb-3">[ Currently ]</p>
            <ScrambleText
              phrases={profile.roles}
              start={intro}
              className="font-mono text-sm md:text-base tracking-[0.18em] text-ink"
            />
          </motion.div>
          <motion.div {...fade(0.65)} className="hidden md:block text-right font-mono text-[10px] tracking-[0.25em] uppercase text-muted space-y-1.5">
            <p className="flex items-center justify-end gap-2 text-gold">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ddc84] opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#3ddc84]" />
              </span>
              {profile.status}
            </p>
            <p>{profile.location.split(",")[0]}, IN</p>
            <p>{profile.coordinates}</p>
          </motion.div>
        </div>

        {/* name + rail */}
        <div>
          {/* the two words sit in separate blocks for the layout; the plain-text name below is what
              search engines and screen readers read, so it is "Sahil Thakur", not "SAHILTHAKUR" */}
          <h1 className="font-display font-black uppercase leading-[0.82] tracking-[-0.04em]">
            <span className="sr-only">{profile.name} — {profile.role}</span>{" "}
            <span aria-hidden="true">
            <RevealText
              text={FIRST_NAME}
              split="chars"
              play={intro}
              delay={0.25}
              stagger={0.05}
              className="block text-[20vw] md:text-[10.5vw] text-ink mix-blend-difference"
            />
            {/* a real space between the words (the blocks make it invisible) */}
            {LAST_NAME && " "}
            {LAST_NAME && (
              <RevealText
                text={LAST_NAME}
                split="chars"
                play={intro}
                delay={0.45}
                stagger={0.05}
                className="block text-right text-[15vw] md:text-[10.5vw] text-molten"
              />
            )}
            </span>
          </h1>

          {/* hairline that draws across, then the rail under it */}
          <motion.div
            aria-hidden="true"
            className="mt-5 h-px origin-left bg-ink/20 md:mt-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: intro ? 1 : 0 }}
            transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.7 }}
          />

          <div className="mt-5 grid items-end gap-5 md:grid-cols-[auto_1fr_auto] md:gap-10">
            <motion.div {...fade(0.9)} className="pointer-events-auto flex items-center gap-3">
              <Magnetic>
                <button
                  onClick={() => scrollToTarget("#work")}
                  className="group relative overflow-hidden rounded-full bg-ink px-7 py-3.5 font-mono text-[11px] font-semibold tracking-[0.25em] uppercase text-background"
                >
                  <span className="absolute inset-0 translate-y-full rounded-full bg-red transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />
                  <span className="relative transition-colors duration-500 group-hover:text-ink">Explore work ↓</span>
                </button>
              </Magnetic>
              <Magnetic>
                <TLink
                  href="/contact"
                  className="inline-flex rounded-full border border-ink/30 px-7 py-3.5 font-mono text-[11px] tracking-[0.25em] uppercase text-ink transition-colors duration-300 hover:border-gold hover:text-gold"
                >
                  Hire me
                </TLink>
              </Magnetic>
            </motion.div>

            {/* quick facts */}
            <motion.dl {...fade(1)} className="hidden justify-center gap-10 lg:flex xl:gap-14">
              {FACTS.map((f) => (
                <div key={f.label} className="flex items-baseline gap-3">
                  <dd className="font-display text-2xl font-black tracking-tight xl:text-3xl">{f.value}</dd>
                  <dt className="font-mono text-[9px] tracking-[0.25em] uppercase text-ink/60">{f.label}</dt>
                </div>
              ))}
            </motion.dl>

            <motion.div {...fade(1.1)} className="flex items-center gap-3 md:justify-end">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red" />
              </span>
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/80">
                {active ? (
                  "That's me under the armour — hold to expand"
                ) : (
                  <>
                    <span className="hidden md:inline">Move your cursor to unmask</span>
                    <span className="md:hidden">Drag across to unmask</span>
                  </>
                )}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
