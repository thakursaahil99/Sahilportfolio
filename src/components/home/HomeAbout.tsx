"use client";

import Image from "next/image";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import SectionTag from "../SectionTag";
import Counter from "../fx/Counter";
import LocalClock from "../fx/LocalClock";
import Reveal, { SplitReveal } from "../fx/Reveal";
import ScrambleText from "../fx/ScrambleText";
import TLink from "../transition/TLink";

const STATEMENT =
  "I build digital armour for brands — fast storefronts, scalable APIs and AI-powered interfaces that load instantly and convert.";

const LIVE = projects.filter((p) => p.link).length;
const STATS = [
  { value: projects.length, suffix: "", label: "Projects shipped" },
  { value: LIVE, suffix: "", label: "Live on the web" },
  { value: profile.stats[0].value, suffix: profile.stats[0].suffix, label: profile.stats[0].label },
  { value: 35, suffix: "+", label: "Technologies used" },
];

const cell = "relative overflow-hidden rounded-3xl border border-line bg-panel transition-colors duration-500 hover:border-ink/25";

/** About, as a bento grid: statement, portrait, numbers, what I'm doing now and where I'm based. */
export default function HomeAbout() {
  return (
    <section id="about" className="relative px-4 pt-20 pb-10 md:px-8 md:pt-32 md:pb-16">
      <div className="px-2 md:px-4">
        <SectionTag index="01" label="About — The person inside the suit" />
      </div>

      <div className="grid gap-4 md:grid-cols-6 lg:grid-cols-12 lg:gap-5">
        {/* statement */}
        <Reveal className={`${cell} flex flex-col justify-between gap-12 p-6 md:col-span-6 md:p-10 lg:col-span-7 lg:row-span-2 lg:p-12`}>
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 bg-[radial-gradient(closest-side,rgb(255_45_32/0.18),transparent)]" />
          <SplitReveal
            as="h2"
            text={STATEMENT}
            accent={["armour", "instantly", "convert"]}
            delay={150}
            className="relative block font-display text-[6.4vw] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[3.3vw] lg:text-[2.35vw]"
          />
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-lg text-sm leading-relaxed text-muted md:text-base">{profile.bio[1]}</p>
            <TLink href="/about" className="group inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] uppercase">
              <span className="relative">
                The full story
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-gold transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/30 transition-all duration-500 group-hover:-rotate-45 group-hover:border-transparent group-hover:bg-ink group-hover:text-background">
                →
              </span>
            </TLink>
          </div>
        </Reveal>

        {/* portrait */}
        <Reveal kind="clip" delay={120} className="group relative min-h-[420px] overflow-hidden rounded-3xl bg-panel md:col-span-3 lg:col-span-5 lg:row-span-2 lg:min-h-[520px]">
          <Image
            src={profile.portrait}
            alt={`${profile.name} — ${profile.role}`}
            fill
            sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 92vw"
            className="object-cover object-top transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-background/25" />
          <p className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-background/60 px-3 py-1.5 font-mono text-[9px] tracking-[0.25em] uppercase backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ddc84] opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#3ddc84]" />
            </span>
            {profile.status}
          </p>
          <div className="absolute inset-x-6 bottom-6">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold">Hi, I&apos;m</p>
            <p className="mt-1 font-display text-4xl font-black uppercase leading-none tracking-[-0.04em] md:text-5xl">{profile.name}</p>
            <p className="mt-3 font-mono text-[10px] tracking-[0.22em] uppercase text-ink/70">{profile.role}</p>
          </div>
        </Reveal>

        {/* numbers */}
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 80} className={`${cell} group p-6 md:col-span-3 lg:col-span-3 lg:p-8`}>
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-t from-red/25 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100" />
            <span className="relative font-mono text-[10px] tracking-[0.25em] text-muted">0{i + 1}</span>
            <Counter
              to={s.value}
              suffix={s.suffix}
              className="relative mt-6 block font-display text-5xl font-black tracking-tight md:text-6xl"
            />
            <p className="eyebrow relative mt-3">{s.label}</p>
          </Reveal>
        ))}

        {/* now */}
        <Reveal className={`${cell} flex flex-col justify-between gap-10 p-6 md:col-span-3 lg:col-span-7 lg:p-10`}>
          <div className="flex items-center justify-between">
            <p className="eyebrow">[ Currently ]</p>
            <LocalClock className="font-mono text-[10px] tracking-[0.25em] text-ink/70" />
          </div>
          <div>
            <ScrambleText phrases={profile.roles} className="block font-mono text-base tracking-[0.16em] text-ink md:text-2xl" />
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{profile.bio[0]}</p>
          </div>
        </Reveal>

        {/* base */}
        <Reveal kind="clip" delay={120} className="group relative min-h-[240px] overflow-hidden rounded-3xl bg-panel md:col-span-6 lg:col-span-5">
          <Image
            src="/about/mountains.jpg"
            alt="Forested ridge above Bir Billing"
            fill
            sizes="(min-width: 1024px) 40vw, 92vw"
            className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow !text-ink/70">Based in</p>
              <p className="mt-2 font-display text-2xl font-black uppercase tracking-tight md:text-3xl">
                {profile.location.split(",")[0]}
              </p>
            </div>
            <p className="text-right font-mono text-[10px] tracking-[0.25em] uppercase text-ink/80">
              Himachal Pradesh, IN
              <br />
              {profile.coordinates}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
