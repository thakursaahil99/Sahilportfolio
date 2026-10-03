"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
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
    <SpotlightCard tilt={14} className="relative w-[300px] overflow-hidden bg-panel/85 p-6 backdrop-blur-xl md:w-[330px]">
      {/* holo sheen */}
      <div className="pointer-events-none absolute inset-0 scale-150 animate-spin-slow bg-[conic-gradient(from_180deg_at_50%_50%,transparent,rgba(255,181,71,0.12),transparent,rgba(94,242,255,0.1),transparent)] opacity-80 [animation-duration:24s]" />
      {/* scanning line */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-gold/15 to-transparent"
        animate={{ top: ["-20%", "110%"] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-gold">Stark Industries</p>
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted">Developer clearance · L-5</p>
        </div>
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ddc84] opacity-70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#3ddc84]" />
        </span>
      </div>

      <div className="relative my-6 flex items-center gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
          <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow">
            <circle cx="50" cy="50" r="47" fill="none" stroke="#ffb547" strokeOpacity="0.6" strokeWidth="1.5" strokeDasharray="3 5" />
          </svg>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red to-gold font-display text-lg font-black text-background">
            {INITIALS}
          </div>
        </div>
        <div className="min-w-0">
          <p className="font-display text-lg font-black uppercase leading-none tracking-tight">{profile.name}</p>
          <p className="mt-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink/70">{profile.role}</p>
        </div>
      </div>

      <dl className="relative grid grid-cols-2 gap-x-4 gap-y-3 font-mono text-[9px] tracking-[0.2em] uppercase">
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

      <div className="relative mt-5 flex h-7 items-end gap-[2px]" aria-hidden="true">
        {BARS.map((w, i) => (
          <span key={i} className="h-full bg-ink/70" style={{ width: w }} />
        ))}
      </div>
    </SpotlightCard>
  );
}

/** Mountain photo + floating polaroid + ID card, drifting apart with the pointer. */
function Collage() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });
  const photoX = useTransform(sx, (v) => v * -12);
  const photoY = useTransform(sy, (v) => v * -12);
  const polaX = useTransform(sx, (v) => v * 22);
  const polaY = useTransform(sy, (v) => v * 22);
  const cardX = useTransform(sx, (v) => v * 34);
  const cardY = useTransform(sy, (v) => v * 34);

  return (
    <div
      className="relative mx-auto h-[520px] w-full max-w-[560px] md:h-[600px]"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {/* main photo */}
      <motion.div style={{ x: photoX, y: photoY }} className="absolute right-0 top-0 h-[78%] w-[86%]">
        <motion.div
          initial={{ clipPath: "inset(100% 0% 0% 0% round 28px)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0% round 28px)" }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
          className="relative h-full w-full overflow-hidden rounded-[28px]"
        >
          <motion.div
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, delay: 0.3, ease: EASE }}
            className="absolute inset-0"
          >
            <Image src="/about/mountains.jpg" alt="Forested ridge above Bir Billing" fill sizes="(min-width: 1024px) 480px, 86vw" loading="eager" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          <p className="absolute right-5 top-5 rounded-full bg-background/50 px-3 py-1 backdrop-blur-md font-mono text-[10px] tracking-[0.25em] uppercase text-ink/90">
            Bir Billing · Himachal Pradesh
          </p>
        </motion.div>
      </motion.div>

      {/* polaroid */}
      <motion.div style={{ x: polaX, y: polaY }} className="absolute -top-4 left-2 z-10 md:left-0">
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -18 }}
          animate={{ opacity: 1, y: 0, rotate: -8 }}
          transition={{ duration: 1.2, delay: 0.9, ease: EASE }}
          className="w-[150px] bg-ink p-2 pb-8 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] md:w-[180px]"
        >
          <div className="relative aspect-square overflow-hidden">
            <Image src="/about/glide-red.jpg" alt="Paraglider over the Himalaya" fill sizes="180px" className="object-cover" />
          </div>
          <p className="absolute bottom-2 left-3 font-mono text-[9px] tracking-[0.15em] uppercase text-background">
            The view from base ✦
          </p>
        </motion.div>
      </motion.div>

      {/* id card */}
      <motion.div style={{ x: cardX, y: cardY }} className="absolute bottom-0 left-0 z-20">
        <motion.div
          initial={{ opacity: 0, y: 60, rotate: 8 }}
          animate={{ opacity: 1, y: 0, rotate: -3 }}
          transition={{ duration: 1.2, delay: 0.6, ease: EASE }}
          className="[perspective:1400px]"
        >
          <IdCard />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-10 md:px-12 md:pt-40">
      <div className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] bg-[radial-gradient(closest-side,rgb(255_45_32/0.2),transparent)]" />
      <div className="relative grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <p className="eyebrow mb-6">[ About ]</p>
          <h1 className="font-display font-black uppercase leading-[0.88] tracking-[-0.04em] text-[11vw] lg:text-[4.6vw]">
            <RevealText text="The person" className="block" />
            <RevealText text="inside the" className="block text-outline" delay={0.1} />
            <RevealText text="suit." className="block text-molten" delay={0.2} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: EASE }}
            className="mt-8 max-w-lg text-base md:text-lg leading-relaxed text-muted"
          >
            Hi, I&apos;m <span className="text-ink">{profile.name}</span> — a {profile.role.toLowerCase()} building
            from the mountains of Bir Billing. {profile.bio[0]}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: EASE }}
            className="mt-10 flex flex-wrap items-end gap-10"
          >
            <div>
              <p className="eyebrow mb-3">[ Currently ]</p>
              <ScrambleText phrases={profile.roles} className="font-mono text-sm tracking-[0.18em] text-ink" />
            </div>
            <div className="flex gap-8">
              {profile.stats.slice(0, 2).map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl font-black">
                    {s.value}
                    {s.suffix}
                  </p>
                  <p className="eyebrow mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <Collage />
      </div>
    </section>
  );
}
