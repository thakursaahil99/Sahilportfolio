"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { projects, type Project } from "@/data/projects";
import SectionTag from "../SectionTag";
import Reveal, { SplitReveal } from "../fx/Reveal";
import TLink from "../transition/TLink";

/** "Next.js 16" and "Next.js 15" are the same tool; "Magento 2.4.9" is Magento 2. */
function normalise(item: string) {
  if (item.startsWith("Magento")) return "Magento 2";
  return item.replace(/\s+\d+(\.\d+)*$/, "");
}

type Tech = { name: string; group: string; projects: Project[] };

// what each stack-group label in data/projects.ts falls under here
const GROUP_OF: Record<string, string> = {
  Frontend: "Frontend",
  Web: "Frontend",
  "Web & Admin": "Frontend",
  "Live site": "Frontend",
  Redesigns: "Frontend",
  "UI & Motion": "Frontend",
  Backend: "Backend & APIs",
  API: "Backend & APIs",
  Platform: "Hosting & platform",
  Hosting: "Hosting & platform",
  Data: "Data & infrastructure",
  "Data & Infra": "Data & infrastructure",
  "Data & Ops": "Data & infrastructure",
  "Data & Services": "Data & infrastructure",
  Ops: "Data & infrastructure",
  "AI & Ops": "AI & operations",
  Motion: "Motion & 3D",
  "Motion & 3D": "Motion & 3D",
  "3D & Forms": "Motion & 3D",
  Media: "Motion & 3D",
  Mobile: "Mobile",
  "Mobile & Tooling": "Mobile",
  App: "Mobile",
  Commerce: "Commerce",
  Services: "Services & integrations",
  Quality: "Testing & quality",
};
const GROUP_ORDER = [
  "Frontend",
  "Backend & APIs",
  "Data & infrastructure",
  "Commerce",
  "Mobile",
  "Motion & 3D",
  "AI & operations",
  "Services & integrations",
  "Testing & quality",
  "Hosting & platform",
];

/** Every technology named in a project's stack, with the projects that used it. */
function buildIndex(): Tech[] {
  const map = new Map<string, Tech>();
  for (const p of projects) {
    for (const g of p.stack) {
      for (const raw of g.items) {
        const name = normalise(raw);
        const entry = map.get(name) ?? { name, group: GROUP_OF[g.label] ?? "Services & integrations", projects: [] };
        if (!entry.projects.includes(p)) entry.projects.push(p);
        map.set(name, entry);
      }
    }
  }
  return [...map.values()].sort((a, b) => b.projects.length - a.projects.length || a.name.localeCompare(b.name));
}

const INDEX = buildIndex();
export const TECH_COUNT = INDEX.length;

/**
 * Everything I've shipped with: each technology is a chip sized by how many
 * projects used it. Pick one to see those projects; search narrows the list.
 */
export default function LabStack({ index = "02" }: { index?: string }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(INDEX[0].name);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const shown = q ? INDEX.filter((t) => t.name.toLowerCase().includes(q)) : INDEX;
    return GROUP_ORDER.map((g) => ({ group: g, items: shown.filter((t) => t.group === g) })).filter((g) => g.items.length);
  }, [query]);

  const active = INDEX.find((t) => t.name === selected) ?? INDEX[0];
  const matches = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <section className="relative px-6 pt-20 pb-10 md:px-12 md:pt-32 md:pb-16">
      <SectionTag index={index} label="Stack index — Everything I've used" />

      <div className="mb-10 grid gap-6 md:mb-14 md:grid-cols-[1fr_auto] md:items-end">
        <SplitReveal
          as="h2"
          text={`${TECH_COUNT} technologies, ${projects.length} projects.`}
          accent={["technologies"]}
          className="block max-w-4xl font-display text-[9vw] font-black uppercase leading-[0.9] tracking-[-0.04em] md:text-[4.2vw]"
        />
        <Reveal as="p" delay={150} className="max-w-xs text-sm leading-relaxed text-muted">
          Taken straight from the stack of every case study. The number on each chip is how many projects used it —
          tap one to see them.
        </Reveal>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12">
        {/* index */}
        <div className="min-w-0">
          <label className="mb-8 flex items-center gap-3 rounded-full border border-line bg-panel px-5 py-3.5">
            <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="7" cy="7" r="4.6" />
              <path d="m10.6 10.6 3.4 3.4" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter — try “Next” or “Postgres”"
              aria-label="Filter technologies"
              style={{ outline: "none" }}
              className="w-full bg-transparent text-sm text-ink placeholder:text-muted md:text-base"
            />
            <span className="hidden shrink-0 font-mono text-[10px] tracking-[0.2em] text-muted sm:block">
              {matches} / {TECH_COUNT}
            </span>
          </label>

          {groups.length === 0 && <p className="py-10 text-sm text-muted">Nothing in the stack matches “{query}”.</p>}

          <div className="space-y-8">
            {groups.map((g) => (
              <Reveal key={g.group}>
                <p className="eyebrow mb-3 flex items-center gap-3">
                  {g.group}
                  <span className="h-px flex-1 bg-line" />
                  <span>{g.items.length}</span>
                </p>
                <ul className="flex flex-wrap gap-2">
                  {g.items.map((t) => {
                    const on = t.name === active.name;
                    const heavy = t.projects.length >= 5;
                    return (
                      <li key={t.name}>
                        <button
                          onClick={() => setSelected(t.name)}
                          aria-pressed={on}
                          className={`flex items-center gap-2 rounded-full border transition-colors duration-300 ${
                            heavy ? "px-4 py-2 font-display text-sm font-bold uppercase tracking-tight" : "px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] uppercase"
                          } ${on ? "border-transparent bg-ink text-background" : "border-ink/15 text-ink/80 hover:border-ink/50 hover:text-ink"}`}
                        >
                          {t.name}
                          <span className={`font-mono text-[10px] font-normal tracking-normal ${on ? "text-red" : "text-gold"}`}>{t.projects.length}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>

        {/* projects that used the selected technology */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="overflow-hidden rounded-3xl border border-line bg-panel">
            <div className="border-b border-line p-6">
              <p className="eyebrow">{active.group}</p>
              <p className="mt-2 font-display text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">{active.name}</p>
              <p className="mt-3 font-mono text-[10px] tracking-[0.2em] uppercase text-gold">
                Used in {active.projects.length} project{active.projects.length === 1 ? "" : "s"}
              </p>
            </div>
            <ul data-lenis-prevent className="max-h-[52vh] overflow-y-auto overscroll-contain p-2">
              {active.projects.map((p) => (
                <li key={p.slug}>
                  <TLink href={`/work/${p.slug}`} className="group flex items-center gap-3 rounded-2xl p-2 transition-colors duration-200 hover:bg-ink/[0.06]">
                    <span className="relative block h-12 w-[76px] shrink-0 overflow-hidden rounded-lg border border-ink/10 bg-background">
                      {p.cover && <Image src={p.cover} alt="" fill sizes="76px" className="object-cover object-top" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-sm font-bold uppercase tracking-tight">{p.title}</span>
                      <span className="block truncate font-mono text-[9px] tracking-[0.18em] uppercase text-muted">
                        {p.category} · {p.year}
                      </span>
                    </span>
                    <span className="pr-2 text-ink/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink">→</span>
                  </TLink>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
