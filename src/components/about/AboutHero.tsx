"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import RevealText from "../fx/RevealText";
import ScrambleText from "../fx/ScrambleText";
import SpotlightCard from "../fx/SpotlightCard";
import LocalClock from "../fx/LocalClock";

const EASE = [0.16, 1, 0.3, 1] as const;
const INITIALS = profile.name
  .split(" ")
  .map((w) => w[0])
  .join("");

/** Pseudo-random but stable barcode widths derived from the name. */
const BARS = Array.from(profile.name + profile.role, (c, i) => ((c.charCodeAt(0) * (i + 3)) % 4) + 1);

function IdCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotate: 6 }}
      animate={{ opacity: 1, y: 0, rotate: -3 }}
      transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
      className="[perspective:1400px]"
    >
      <SpotlightCard tilt={14} className="relative w-full max-w-[420px] overflow-hidden p-7 md:p-8">
        {/* holo sheen */}
        <div className="pointer-events-none absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,transparent,rgba(255,181,71,0.12),transparent,rgba(94,242,255,0.1),transparent)] opacity-80 animate-spin-slow [animation-duration:24s] scale-150" />
        {/* scanning line */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-gold/15 to-transparent"
          animate={{ top: ["-20%", "110%"] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold">Stark Industries</p>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted">Developer clearance · L-5</p>
          </div>
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ddc84] opacity-70" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-[#3ddc84]" />
          </span>
        </div>

        <div className="relative my-10 flex items-center gap-6">
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow">
              <circle cx="50" cy="50" r="47" fill="none" stroke="#ffb547" strokeOpacity="0.6" strokeWidth="1" strokeDasharray="3 5" />
            </svg>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red to-gold font-display text-3xl font-black text-background">
              {INITIALS}
            </div>
          </div>
          <div className="min-w-0">
            <p className="font-display text-2xl font-black uppercase leading-none tracking-tight">{profile.name}</p>
            <p className="mt-2 font-mono text-[11px] tracking-[0.2em] uppercase text-ink/70">{profile.role}</p>
          </div>
        </div>

        <dl className="relative grid grid-cols-2 gap-x-6 gap-y-4 font-mono text-[10px] tracking-[0.2em] uppercase">
          <div>
            <dt className="text-muted">Base</dt>
            <dd className="mt-1 text-ink">{profile.location.split(",")[0]}</dd>
          </div>
          <div>
            <dt className="text-muted">Local time</dt>
            <dd className="mt-1 text-ink">
              <LocalClock />
            </dd>
          </div>
          <div>
            <dt className="text-muted">Coords</dt>
            <dd className="mt-1 text-ink">{profile.coordinates}</dd>
          </div>
          <div>
            <dt className="text-muted">Status</dt>
            <dd className="mt-1 text-[#3ddc84]">Available</dd>
          </div>
        </dl>

        <div className="relative mt-8 flex h-10 items-end gap-[2px]" aria-hidden="true">
          {BARS.map((w, i) => (
            <span key={i} className="h-full bg-ink/70" style={{ width: w }} />
          ))}
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden px-6 pt-36 pb-10 md:px-12 md:pt-44">
      <div className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-red/20 blur-[140px]" />
      <div className="relative grid gap-16 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow mb-6">[ About ]</p>
          <h1 className="font-display font-black uppercase leading-[0.86] tracking-[-0.04em] text-[11vw] lg:text-[5vw]">
            <RevealText text="The person" className="block" />
            <RevealText text="inside the" className="block text-outline" delay={0.1} />
            <RevealText text="suit." className="block text-molten" delay={0.2} />
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: EASE }}
            className="mt-10 max-w-xl"
          >
            <p className="eyebrow mb-3">[ Currently ]</p>
            <ScrambleText phrases={profile.roles} className="font-mono text-sm md:text-base tracking-[0.18em] text-ink" />
          </motion.div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <IdCard />
        </div>
      </div>
    </section>
  );
}
