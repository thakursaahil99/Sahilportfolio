import type { Metadata } from "next";
import { experience, profile, skillGroups } from "@/data/profile";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/site";
import ResumeToolbar from "@/components/resume/ResumeToolbar";

export const metadata: Metadata = {
  title: "Résumé — Sahil Thakur",
  description: `Résumé of ${profile.name}, ${profile.role} — experience, skills and selected projects.`,
  alternates: { canonical: "/resume" },
};

// the case studies a recruiter should see first
const SELECTED = ["glide-in-bir", "sahucodex", "glido", "pahadibhai", "dell-store"];

// "TOOLS & AI" → "Tools & AI"
const label = (cat: string) =>
  cat.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase()).replace(/\bAi\b/g, "AI");

const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 break-inside-avoid-page print:mt-3">
      <h2 className="mb-3 border-b border-neutral-300 pb-1.5 print:mb-1.5 print:pb-1 text-[11px] font-bold tracking-[0.2em] text-neutral-500 uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ResumePage() {
  const selected = SELECTED.map((slug) => projects.find((p) => p.slug === slug)).filter((p) => p !== undefined);

  return (
    <main className="relative px-4 pt-32 pb-24 md:px-12 md:pt-40 print:p-0">
      <ResumeToolbar />

      <article
        id="resume"
        className="mx-auto max-w-4xl rounded-2xl bg-white px-6 py-10 text-[13px] leading-relaxed text-neutral-800 shadow-[0_40px_120px_-30px_rgba(255,45,32,0.35)] md:px-14 md:py-14 print:max-w-none print:rounded-none print:p-0 print:text-[9.5px] print:leading-snug print:shadow-none"
      >
        <header className="flex flex-col gap-4 border-b-2 border-neutral-900 pb-6 md:flex-row md:items-end md:justify-between print:flex-row print:items-end print:justify-between print:pb-3">
          <div>
            <h1 className="font-display text-3xl font-black tracking-tight text-neutral-950 md:text-4xl print:text-2xl">{profile.name}</h1>
            <p className="mt-1 text-base font-semibold text-[#e0241a]">{profile.role}</p>
          </div>
          <ul className="space-y-0.5 text-[12px] text-neutral-600 md:text-right print:space-y-0 print:text-right print:text-[9px]">
            <li>{profile.location}</li>
            <li>
              <a href={`mailto:${profile.email}`} className="hover:underline">
                {profile.email}
              </a>
            </li>
            <li>
              <a href={SITE_URL} className="hover:underline">
                {host(SITE_URL)}
              </a>
            </li>
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="hover:underline">
                  {host(s.href)}
                </a>
              </li>
            ))}
          </ul>
        </header>

        <Section title="Summary">
          <p>
            Full-stack developer with {profile.experienceYears} years of experience building web platforms, eCommerce
            storefronts and AI-powered interfaces end to end — from database schema and APIs to responsive, accessible,
            high-performance UIs. Works across Next.js, React and TypeScript on the front end and Node.js, Laravel and
            Magento 2 on the back end. Founder of Glide in Bir, a paragliding booking platform.
          </p>
        </Section>

        <Section title="Skills">
          <dl className="grid gap-x-6 gap-y-1.5 sm:grid-cols-[150px_1fr] print:grid-cols-[100px_1fr] print:gap-y-0">
            {skillGroups.map((g) => (
              <div key={g.category} className="contents">
                <dt className="font-semibold text-neutral-950">{label(g.category)}</dt>
                <dd>{g.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Experience">
          <ul className="space-y-4 print:space-y-2">
            {experience.map((e) => (
              <li key={e.company} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-semibold text-neutral-950">
                    {e.role} · {e.company}
                  </h3>
                  <span className="text-[12px] text-neutral-500 print:text-[9px]">{e.date}</span>
                </div>
                <p className="mt-0.5">{e.description}</p>
                <p className="mt-0.5 text-[12px] text-neutral-500 print:text-[9px]">{e.tech.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Selected projects">
          <ul className="space-y-4 print:space-y-2">
            {selected.map((p) => (
              <li key={p.slug} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-semibold text-neutral-950">
                    {p.title} <span className="font-normal text-neutral-500">— {p.tagline}</span>
                  </h3>
                  <span className="text-[12px] text-neutral-500 print:text-[9px]">{p.year}</span>
                </div>
                <ul className="mt-1 list-disc space-y-0.5 pl-5 print:mt-0.5 print:space-y-0">
                  {p.features.slice(0, 3).map((f, i) => (
                    // two bullets per project on paper keeps the résumé to one page
                    <li key={f} className={i > 1 ? "print:hidden" : undefined}>
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="mt-1 text-[12px] text-neutral-500 print:text-[9px]">
                  {p.stack.flatMap((s) => s.items).slice(0, 7).join(" · ")}
                  {p.link && (
                    <>
                      {" — "}
                      <a href={p.link} className="text-[#e0241a] hover:underline">
                        {host(p.link)}
                      </a>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Education">
          <ul className="space-y-1">
            {profile.education.map((ed) => (
              <li key={ed.title} className="flex flex-wrap items-baseline justify-between gap-x-4">
                <span>
                  <span className="font-semibold text-neutral-950">{ed.title}</span>
                  {ed.school && <span className="text-neutral-600"> · {ed.school}</span>}
                </span>
                {ed.year && <span className="text-[12px] text-neutral-500 print:text-[9px]">{ed.year}</span>}
              </li>
            ))}
          </ul>
        </Section>
      </article>
    </main>
  );
}
