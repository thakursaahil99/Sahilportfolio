"use client";

import { useState } from "react";
import Image from "next/image";
import { ACCENTS } from "@/data/projects";
import SectionTag from "../SectionTag";
import { SERVICES } from "../Services";
import Reveal, { SplitReveal } from "../fx/Reveal";
import TLink from "../transition/TLink";

const pad = (n: number) => String(n).padStart(2, "0");
const EASE = "ease-[cubic-bezier(0.16,1,0.3,1)]";

/**
 * Services as an interactive index: hover (or tap) a row and it opens, while
 * the preview panel beside it cross-fades to that service's screens. On phones
 * each row opens in place with its own screenshot.
 */
export default function HomeServices() {
  const [active, setActive] = useState(0);
  const [a, b] = ACCENTS[SERVICES[active].accent];

  return (
    <section className="relative px-6 pt-20 pb-10 md:px-12 md:pt-32 md:pb-16">
      <SectionTag index="02" label="Services — What I build" />

      <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-[1fr_auto] md:items-end">
        <SplitReveal
          as="h2"
          text="Four ways I can suit you up."
          accent={["suit"]}
          className="block max-w-4xl font-display text-[9.5vw] font-black uppercase leading-[0.9] tracking-[-0.04em] md:text-[4.4vw]"
        />
        <Reveal delay={150}>
          <TLink
            href="/services"
            className="inline-flex rounded-full border border-ink/25 px-6 py-3.5 font-mono text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 hover:border-gold hover:text-gold"
          >
            How I work →
          </TLink>
        </Reveal>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        {/* index */}
        <ul className="min-w-0 border-t border-line">
          {SERVICES.map((s, i) => {
            const on = i === active;
            return (
              <Reveal as="li" key={s.title} delay={i * 90} className="border-b border-line">
                <button
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-expanded={on}
                  className="group relative block w-full py-6 text-left md:py-8"
                >
                  {/* accent bar that grows down the left edge of the open row */}
                  <span
                    className={`absolute left-0 top-0 h-full w-[3px] origin-top transition-transform duration-700 ${EASE} ${on ? "scale-y-100" : "scale-y-0"}`}
                    style={{ background: `linear-gradient(${ACCENTS[s.accent][0]}, ${ACCENTS[s.accent][1]})` }}
                  />
                  <span className={`flex items-baseline gap-4 transition-[padding] duration-700 md:gap-5 ${EASE} ${on ? "pl-4 md:pl-7" : "pl-0"}`}>
                    <span className={`font-mono text-[11px] tracking-[0.25em] transition-colors duration-500 ${on ? "text-gold" : "text-muted"}`}>
                      {pad(i + 1)}
                    </span>
                    <span
                      className={`min-w-0 flex-1 font-display text-[6vw] font-black uppercase leading-[0.95] tracking-[-0.04em] transition-colors duration-500 md:text-[3vw] ${
                        on ? "text-ink" : "text-ink/35 group-hover:text-ink/70"
                      }`}
                    >
                      {s.title}
                    </span>
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full border font-display text-base transition-all duration-700 ${EASE} ${
                        on ? "rotate-0 border-transparent bg-ink text-background" : "-rotate-45 border-ink/20 text-ink/60"
                      }`}
                    >
                      {s.glyph}
                    </span>
                  </span>

                  {/* details — the row grows from 0fr to 1fr, which animates height without measuring it */}
                  <span className={`grid transition-[grid-template-rows] duration-700 ${EASE} ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <span className="overflow-hidden">
                      <span className={`block pt-5 pl-4 transition-opacity duration-500 md:pl-[4.6rem] ${on ? "opacity-100 delay-150" : "opacity-0"}`}>
                        <span className="block max-w-xl text-sm leading-relaxed text-ink/70 md:text-base">{s.desc}</span>
                        <span className="mt-4 flex flex-wrap gap-1.5">
                          {s.tags.map((t) => (
                            <span key={t} className="rounded-full border border-ink/20 px-2.5 py-0.5 font-mono text-[9px] tracking-[0.15em] uppercase text-ink/75">
                              {t}
                            </span>
                          ))}
                        </span>
                        {/* phones: the screenshot lives inside the row */}
                        <span className="relative mt-5 block aspect-[16/10] overflow-hidden rounded-2xl border border-ink/10 lg:hidden">
                          <Image src={s.shots[1]} alt="" fill sizes="92vw" className="object-cover object-top" />
                        </span>
                      </span>
                    </span>
                  </span>
                </button>
              </Reveal>
            );
          })}
        </ul>

        {/* preview — desktop only */}
        <Reveal kind="clip" delay={200} className="relative hidden lg:block">
          <div className="sticky top-28 aspect-[4/5] max-h-[72vh] w-full overflow-hidden rounded-[28px] border border-line bg-panel">
            {/* glow in the active service's colours */}
            <div
              className="absolute -inset-1/4 opacity-40 blur-3xl transition-[background] duration-1000"
              style={{ background: `radial-gradient(closest-side at 30% 30%, ${a}, transparent), radial-gradient(closest-side at 75% 80%, ${b}, transparent)` }}
            />

            {SERVICES.map((s, i) => {
              const on = i === active;
              return (
                <div
                  key={s.title}
                  aria-hidden={!on}
                  className={`absolute inset-0 transition-opacity duration-700 ${on ? "opacity-100" : "pointer-events-none opacity-0"}`}
                >
                  <div
                    className={`absolute right-[6%] top-[9%] aspect-[16/10] w-[70%] overflow-hidden rounded-xl border border-ink/15 shadow-[0_40px_80px_-25px_rgba(0,0,0,0.9)] transition-transform duration-1000 ${EASE} ${
                      on ? "rotate-[5deg]" : "translate-y-10 rotate-[10deg] scale-90"
                    }`}
                  >
                    <Image src={s.shots[0]} alt="" fill sizes="30vw" className="object-cover object-top" />
                  </div>
                  <div
                    className={`absolute bottom-[20%] left-[6%] aspect-[16/10] w-[78%] overflow-hidden rounded-xl border border-ink/15 shadow-[0_40px_80px_-25px_rgba(0,0,0,0.9)] transition-transform delay-75 duration-1000 ${EASE} ${
                      on ? "-rotate-[4deg]" : "-translate-y-10 -rotate-[9deg] scale-90"
                    }`}
                  >
                    <Image src={s.shots[1]} alt="" fill sizes="34vw" className="object-cover object-top" />
                  </div>

                  <div className="absolute inset-x-6 bottom-6 flex items-center justify-between gap-4">
                    <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/70">
                      Service {pad(i + 1)} / {pad(SERVICES.length)}
                    </span>
                    <TLink
                      href={`/work/${s.example.slug}`}
                      tabIndex={on ? undefined : -1}
                      className="group/link inline-flex items-center gap-3 rounded-full bg-background/70 py-1.5 pl-4 pr-1.5 font-mono text-[10px] tracking-[0.2em] uppercase backdrop-blur-md"
                    >
                      See it in {s.example.label}
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-background transition-transform duration-500 group-hover/link:-rotate-45">
                        →
                      </span>
                    </TLink>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
