"use client";

import { useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { useCopyEmail } from "@/lib/use-copy-email";
import SectionTag from "./SectionTag";
import Magnetic from "./fx/Magnetic";
import RevealText from "./fx/RevealText";
import LocalClock from "./fx/LocalClock";
import TLink from "./transition/TLink";

const EASE = [0.76, 0, 0.24, 1] as const;
const OUT = [0.16, 1, 0.3, 1] as const;

// what people usually write in about — each chip opens the contact form with that type ticked
const INTENTS = ["Web app", "eCommerce", "AI integration", "Motion / 3D site"];

const rise = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease: OUT, delay: i * 0.08 } }),
};

/** One cell of the "ways to reach me" rail under the card. */
function RailCell({ label, value, children }: { label: string; value: React.ReactNode; children?: React.ReactNode }) {
  return (
    <span className="flex h-full items-center justify-between gap-4 px-5 py-5 md:px-7 md:py-6">
      <span className="min-w-0">
        <span className="block font-mono text-[9px] tracking-[0.3em] uppercase text-muted">{label}</span>
        <span className="mt-1.5 block truncate font-display text-sm font-bold uppercase tracking-tight md:text-base">{value}</span>
      </span>
      {children ?? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/20 transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-ink group-hover:text-background">
          ↗
        </span>
      )}
    </span>
  );
}

/**
 * Closing section: one large card — headline, what-do-you-need chips and the main
 * call to action on the left, a portrait that tilts with the pointer on the right —
 * with a rail of direct contact routes underneath.
 */
export default function ContactCTA({ index = "05" }: { index?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { copied, copy } = useCopyEmail();

  // glow that follows the pointer across the card
  const gx = useMotionValue(50);
  const gy = useMotionValue(30);
  const glow = useMotionTemplate`radial-gradient(620px circle at ${gx}% ${gy}%, rgb(255 80 40 / 0.16), transparent 65%)`;

  // portrait: parallax on scroll + tilt toward the pointer
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const tx = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const ty = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const rotateY = useTransform(tx, (v) => v * 9);
  const rotateX = useTransform(ty, (v) => v * -9);

  return (
    <section className="relative px-4 pt-24 pb-16 md:px-8 md:pt-36 md:pb-24">
      <div className="px-2 md:px-4">
        <SectionTag index={index} label="Contact — Open a channel" />
      </div>

      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.1, ease: OUT }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          gx.set(px * 100);
          gy.set(py * 100);
          tx.set(px - 0.5);
          ty.set(py - 0.5);
        }}
        onPointerLeave={() => {
          tx.set(0);
          ty.set(0);
        }}
        className="relative overflow-hidden rounded-[2rem] border border-line bg-panel md:rounded-[3rem]"
      >
        {/* backdrop: fine grid + pointer glow + molten hairline */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(242,239,233,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(242,239,233,.4) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse at 30% 40%, #000 10%, transparent 75%)",
          }}
        />
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: glow }} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red to-transparent" />

        <div className="relative grid gap-10 p-6 md:p-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14 lg:p-16">
          {/* copy */}
          <div className="flex flex-col justify-between gap-12">
            <div>
              <p className="mb-8 inline-flex items-center gap-3 rounded-full border border-line bg-background/40 px-4 py-2 font-mono text-[10px] tracking-[0.25em] uppercase text-ink/80">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ddc84] opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3ddc84]" />
                </span>
                {profile.status} — {new Date().getFullYear()}
              </p>

              <h2 className="font-display text-[11.5vw] font-black uppercase leading-[0.88] tracking-[-0.05em] md:text-[7.4vw] lg:text-[5.6vw]">
                <RevealText text="Have an idea?" className="block" />
                <RevealText text="Let's make" className="block text-outline" delay={0.1} />
                <RevealText text="it real." className="block text-molten" delay={0.2} />
              </h2>

              <motion.p
                custom={2}
                variants={rise}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="mt-8 max-w-xl text-base leading-relaxed text-ink/70 md:text-lg"
              >
                {projects.length} projects shipped so far — booking platforms, marketplaces, AI tools and cinematic brand
                sites. Tell me what you&apos;re building, or what your team needs, and I&apos;ll come back with a clear plan.
              </motion.p>
            </div>

            <div>
              <p className="eyebrow mb-4">What do you need?</p>
              <ul className="flex flex-wrap gap-2">
                {INTENTS.map((t, i) => (
                  <motion.li key={t} custom={i} variants={rise} initial="hidden" whileInView="show" viewport={{ once: true }}>
                    <TLink
                      href={`/contact?type=${encodeURIComponent(t)}`}
                      className="group/chip relative block overflow-hidden rounded-full border border-ink/20 px-4 py-2.5 font-mono text-[11px] tracking-[0.18em] uppercase"
                    >
                      <span className="absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/chip:scale-x-100" />
                      <span className="relative transition-colors duration-500 group-hover/chip:text-background">+ {t}</span>
                    </TLink>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Magnetic strength={0.25}>
                  <TLink
                    href="/contact"
                    data-cursor-label="Let's go"
                    className="group/cta relative flex items-center gap-4 overflow-hidden rounded-full bg-red py-2 pl-7 pr-2 font-display text-sm font-black uppercase tracking-tight text-ink md:text-base"
                  >
                    <span className="absolute inset-0 translate-y-full rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/cta:translate-y-0" />
                    <span className="relative transition-colors duration-500 group-hover/cta:text-background">Start a project</span>
                    <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-background text-lg text-ink transition-transform duration-500 group-hover/cta:-rotate-45">
                      →
                    </span>
                  </TLink>
                </Magnetic>
                <TLink
                  href="/resume"
                  className="rounded-full border border-ink/25 px-6 py-4 font-mono text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 hover:border-gold hover:text-gold"
                >
                  View résumé
                </TLink>
              </div>
            </div>
          </div>

          {/* portrait */}
          <div className="relative mx-auto w-full max-w-[420px] [perspective:1400px] lg:max-w-none">
            <motion.div
              style={{ rotateX, rotateY }}
              className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-ink/15 bg-background shadow-[0_60px_120px_-40px_rgba(0,0,0,0.95)]"
            >
              <motion.div style={{ y: photoY }} className="absolute -inset-y-[8%] inset-x-0">
                <Image src={profile.portrait} alt={`${profile.name} — ${profile.role}`} fill sizes="(min-width: 1024px) 34vw, 420px" className="object-cover object-top" />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/20" />

              <p className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-background/60 px-3 py-1.5 font-mono text-[9px] tracking-[0.25em] uppercase backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-red" />
                <LocalClock />
              </p>

              <div className="absolute inset-x-5 bottom-5">
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold">Hi, I&apos;m</p>
                <p className="mt-1 font-display text-3xl font-black uppercase leading-none tracking-[-0.04em] md:text-4xl">{profile.name}</p>
                <p className="mt-2 font-mono text-[10px] tracking-[0.22em] uppercase text-ink/70">
                  {profile.role} · {profile.location.split(",")[0]}
                </p>
              </div>
            </motion.div>

            {/* floating stat chips */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: OUT, delay: 0.4 }}
              className="absolute -left-3 top-[18%] rounded-2xl border border-ink/15 bg-panel/90 px-4 py-3 shadow-2xl backdrop-blur-md md:-left-8"
            >
              <span className="block font-display text-2xl font-black text-molten">{profile.experienceYears}</span>
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-muted">Years shipping</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: OUT, delay: 0.55 }}
              className="absolute -right-3 top-[52%] rounded-2xl border border-ink/15 bg-panel/90 px-4 py-3 shadow-2xl backdrop-blur-md md:-right-6"
            >
              <span className="block font-display text-2xl font-black text-molten">{projects.length}</span>
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-muted">Case studies</span>
            </motion.div>
          </div>
        </div>

        {/* direct routes */}
        <ul className="relative grid border-t border-line sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1.1fr] [&>li]:border-b [&>li]:border-line sm:[&>li:nth-child(odd)]:border-r lg:[&>li]:border-b-0 lg:[&>li:not(:last-child)]:border-r">
          <li>
            <button onClick={copy} className="group block h-full w-full text-left transition-colors duration-300 hover:bg-ink/[0.04]" data-cursor-label={copied ? "Done" : "Copy"}>
              <RailCell
                label="Email — tap to copy"
                value={
                  <span className="relative block overflow-hidden text-[13px] normal-case tracking-normal md:text-sm">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={copied ? "copied" : "email"}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className={`block truncate ${copied ? "text-gold" : ""}`}
                      >
                        {copied ? "Copied ✓" : profile.email}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                }
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/20 transition-all duration-500 group-hover:border-transparent group-hover:bg-ink group-hover:text-background">
                  ⧉
                </span>
              </RailCell>
            </button>
          </li>
          {profile.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="group block h-full transition-colors duration-300 hover:bg-ink/[0.04]">
                <RailCell label="Elsewhere" value={s.label} />
              </a>
            </li>
          ))}
          <li>
            <RailCell label={`Based in · ${profile.coordinates}`} value={`${profile.location.split(",")[0]}, India`}>
              <span className="h-2 w-2 shrink-0 rounded-full bg-red" />
            </RailCell>
          </li>
        </ul>
      </motion.div>
    </section>
  );
}
