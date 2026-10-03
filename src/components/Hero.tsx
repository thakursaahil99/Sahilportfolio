"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { useIntroDone } from "@/lib/use-intro";
import { scrollToTarget } from "@/lib/smooth-scroll";
import LiquidReveal from "./fx/LiquidReveal";
import RevealText from "./fx/RevealText";
import ScrambleText from "./fx/ScrambleText";
import Magnetic from "./fx/Magnetic";
import TLink from "./transition/TLink";

const [FIRST_NAME, ...REST] = profile.name.toUpperCase().split(" ");
const LAST_NAME = REST.join(" ");
const EASE = [0.16, 1, 0.3, 1] as const;

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
      className="relative h-[100svh] min-h-[620px] w-full overflow-hidden select-none touch-pan-y"
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-background/90 via-background/50 to-transparent md:h-56" />
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-background/60 to-transparent md:block" />

      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between px-6 pt-28 pb-8 md:px-12 md:pt-32">
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
            <p className="text-gold">{profile.status}</p>
            <p>{profile.location.split(",")[0]}, IN</p>
            <p>{profile.coordinates}</p>
          </motion.div>
        </div>

        {/* name + actions */}
        <div>
          <h1 className="font-display font-black uppercase leading-[0.82] tracking-[-0.04em]">
            <RevealText
              text={FIRST_NAME}
              split="chars"
              play={intro}
              delay={0.25}
              stagger={0.05}
              className="block text-[20vw] md:text-[10.5vw] text-ink mix-blend-difference"
            />
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
          </h1>

          <div className="mt-6 flex flex-col-reverse gap-6 md:flex-row md:items-end md:justify-between">
            <motion.div {...fade(0.9)} className="pointer-events-auto flex items-center gap-4">
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

            <motion.div {...fade(1)} className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red" />
              </span>
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/80">
                {active ? (
                  "Identity exposed — hold to expand"
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
