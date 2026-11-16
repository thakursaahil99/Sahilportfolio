"use client";

import Image from "next/image";
import { highlights, profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { useCopyEmail } from "@/lib/use-copy-email";
import SectionTag from "../SectionTag";
import LocalClock from "../fx/LocalClock";
import Reveal, { SplitReveal } from "../fx/Reveal";
import TLink from "../transition/TLink";

const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/**
 * The details, large: who I am, where I am and how to reach me — one row per
 * fact in display type, next to the portrait and a few lines of what I've done.
 */
export default function FactSheet({ index = "07" }: { index?: string }) {
  const { copied, copy } = useCopyEmail();

  // long values (the email, URLs) get a smaller size so they stay on one line instead of breaking mid-word
  const LONG = "text-[4.1vw] md:text-[1.45vw]";
  const rows: { k: string; v: React.ReactNode; href?: string; onClick?: () => void; hint?: string; size?: string }[] = [
    { k: "Name", v: profile.name },
    { k: "Role", v: profile.role },
    { k: "Experience", v: `${profile.experienceYears} years · ${projects.length} projects` },
    { k: "Based in", v: profile.location.split(",").slice(0, 2).join(",") },
    { k: "Local time", v: <LocalClock /> },
    { k: "Status", v: profile.status },
    { k: "Email", v: copied ? "Copied to clipboard ✓" : profile.email, onClick: copy, hint: "Copy", size: LONG },
    ...profile.socials.map((s) => ({ k: s.label, v: host(s.href), href: s.href, hint: "Open ↗", size: LONG })),
    { k: "Focus next", v: profile.focus.join(" · ") },
  ];

  return (
    <section className="relative px-6 py-24 md:px-12 md:py-36">
      <SectionTag index={index} label="Details — The fact sheet" />

      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        {/* portrait + what I've done */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SplitReveal
            as="h2"
            text="Everything about me, on one page."
            accent={["me"]}
            className="block font-display text-[10vw] font-black uppercase leading-[0.9] tracking-[-0.04em] md:text-[4vw]"
          />

          <Reveal kind="clip" delay={150} className="group relative mt-10 aspect-[4/3] overflow-hidden rounded-3xl bg-panel">
            <Image
              src={profile.portrait}
              alt={`${profile.name} — ${profile.role}`}
              fill
              sizes="(min-width: 1024px) 38vw, 92vw"
              className="object-cover object-[50%_16%] transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
            <p className="absolute inset-x-6 bottom-5 font-mono text-[10px] tracking-[0.25em] uppercase text-ink/80">
              {profile.coordinates} · {profile.location.split(",")[0]}
            </p>
          </Reveal>

          <ul className="mt-8 space-y-3">
            {highlights.map((h, i) => (
              <Reveal as="li" key={h} delay={i * 80} className="flex gap-4 text-sm leading-relaxed text-ink/75 md:text-base">
                <span className="mt-0.5 font-mono text-[11px] text-red">0{i + 1}</span>
                {h}
              </Reveal>
            ))}
          </ul>
        </div>

        {/* the facts */}
        <div>
          <dl className="border-t border-line">
            {rows.map((r, i) => {
              const body = (
                <>
                  <dt className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted md:text-[11px]">{r.k}</dt>
                  <dd className={`min-w-0 font-display font-bold leading-[1.1] tracking-[-0.02em] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 ${r.size ?? "text-[5.6vw] md:text-[1.9vw]"}`}>
                    {r.v}
                  </dd>
                  {r.hint && (
                    <span className="hidden font-mono text-[10px] tracking-[0.2em] uppercase text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block">
                      {r.hint}
                    </span>
                  )}
                </>
              );
              const row = "group grid w-full gap-2 py-5 text-left md:grid-cols-[150px_1fr_auto] md:items-baseline md:gap-8 md:py-6";
              return (
                <Reveal key={r.k} delay={i * 50} className="border-b border-line transition-colors duration-300 hover:bg-ink/[0.03]">
                  {r.href ? (
                    <a href={r.href} target="_blank" rel="noreferrer" className={row}>
                      {body}
                    </a>
                  ) : r.onClick ? (
                    <button onClick={r.onClick} className={row} data-cursor-label={copied ? "Done" : "Copy"}>
                      {body}
                    </button>
                  ) : (
                    <div className={row}>{body}</div>
                  )}
                </Reveal>
              );
            })}
          </dl>

          <Reveal delay={200} className="mt-10 flex flex-wrap gap-3">
            <TLink
              href="/resume"
              className="group relative overflow-hidden rounded-full bg-red px-8 py-4 font-mono text-[11px] font-semibold tracking-[0.25em] uppercase text-ink"
            >
              <span className="absolute inset-0 translate-y-full rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />
              <span className="relative transition-colors duration-500 group-hover:text-background">Open my résumé →</span>
            </TLink>
            <TLink
              href="/contact"
              className="rounded-full border border-ink/25 px-8 py-4 font-mono text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 hover:border-gold hover:text-gold"
            >
              Get in touch
            </TLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
