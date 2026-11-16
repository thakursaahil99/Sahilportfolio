import Image from "next/image";
import { ACCENTS, projects, type Project } from "@/data/projects";
import SectionTag from "../SectionTag";
import Reveal, { SplitReveal } from "../fx/Reveal";
import TLink from "../transition/TLink";

type Row = { category: string; items: Project[] };

// projects grouped by category, biggest group first
const ROWS: Row[] = [...new Set(projects.map((p) => p.category))]
  .map((category) => ({ category, items: projects.filter((p) => p.category === category) }))
  .sort((a, b) => b.items.length - a.items.length);
const MAX = ROWS[0].items.length;
const LIVE = projects.filter((p) => p.link).length;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * What I've shipped, by type: one row per category with a bar sized by the
 * number of projects and the front pages of the projects in it. All real
 * numbers, computed from data/projects.ts.
 */
export default function Shipped({ index = "05" }: { index?: string }) {
  return (
    <section className="relative px-6 py-24 md:px-12 md:py-36">
      <SectionTag index={index} label="Shipped — The work, by type" />

      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        {/* headline + totals */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SplitReveal
            as="h2"
            text={`${projects.length} projects, ${ROWS.length} kinds of problem.`}
            accent={["problem"]}
            className="block font-display text-[10vw] font-black uppercase leading-[0.9] tracking-[-0.04em] md:text-[4.2vw]"
          />
          <Reveal as="p" delay={150} className="mt-6 max-w-md text-base leading-relaxed text-muted">
            Every one has its own case study with screenshots, the stack and — for {LIVE} of them — a live link you can
            open right now.
          </Reveal>

          <Reveal delay={250} className="mt-10 flex flex-wrap gap-3">
            <TLink
              href="/work"
              className="group relative overflow-hidden rounded-full bg-ink px-7 py-4 font-mono text-[11px] font-semibold tracking-[0.25em] uppercase text-background"
            >
              <span className="absolute inset-0 translate-y-full rounded-full bg-red transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />
              <span className="relative transition-colors duration-500 group-hover:text-ink">See all work →</span>
            </TLink>
            <TLink
              href="/resume"
              className="rounded-full border border-ink/25 px-7 py-4 font-mono text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 hover:border-gold hover:text-gold"
            >
              Download résumé
            </TLink>
          </Reveal>
        </div>

        {/* one row per category */}
        <ul className="border-t border-line">
          {ROWS.map((row, i) => {
            const [a, b] = ACCENTS[row.items[0].accent];
            return (
              <Reveal as="li" key={row.category} delay={i * 80} className="group border-b border-line py-7 md:py-8">
                <div className="flex items-baseline justify-between gap-6">
                  <h3 className="flex items-baseline gap-4 font-display text-[7vw] font-black uppercase leading-none tracking-[-0.04em] md:text-[2.4vw]">
                    <span className="font-mono text-[11px] font-normal tracking-[0.25em] text-muted">{pad(i + 1)}</span>
                    {row.category}
                  </h3>
                  <span className="font-display text-3xl font-black text-molten md:text-4xl">{row.items.length}</span>
                </div>

                {/* bar: grows from the left when the row scrolls in (the `rule` reveal) */}
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-ink/[0.07]">
                  <Reveal
                    kind="rule"
                    delay={200 + i * 80}
                    className="h-full rounded-full"
                    style={{ width: `${(row.items.length / MAX) * 100}%`, background: `linear-gradient(90deg, ${a}, ${b})` }}
                  />
                </div>

                {/* front pages of the projects in this category */}
                <ul className="mt-5 flex flex-wrap gap-2.5">
                  {row.items.map((p) => (
                    <li key={p.slug}>
                      <TLink
                        href={`/work/${p.slug}`}
                        data-cursor-label="View"
                        title={p.title}
                        className="group/tile relative block h-14 w-[88px] overflow-hidden rounded-lg border border-ink/10 bg-panel md:h-16 md:w-[102px]"
                      >
                        {p.cover && (
                          <Image
                            src={p.cover}
                            alt={p.title}
                            fill
                            sizes="102px"
                            className="object-cover object-top opacity-70 transition-all duration-500 group-hover/tile:scale-110 group-hover/tile:opacity-100"
                          />
                        )}
                      </TLink>
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
