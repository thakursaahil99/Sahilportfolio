import type { Metadata } from "next";
import Image from "next/image";
import { experience, highlights, profile, skillGroups } from "@/data/profile";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/site";
import ResumeToolbar from "@/components/resume/ResumeToolbar";

export const metadata: Metadata = {
  title: "Résumé — Sahil Thakur",
  description: `Résumé of ${profile.name}, ${profile.role} — the full journey, skills and selected projects.`,
  alternates: { canonical: "/resume" },
};

// the case studies a recruiter should see first
const SELECTED = ["glide-in-bir", "glideinbir-kart", "glideup", "sahu-music", "sahucodex", "quickcart"];

const ROLES = experience.filter((e) => e.kind === "role");
const CLIENTS = experience.filter((e) => e.kind === "client");

// "TOOLS & AI" → "Tools & AI"
const label = (cat: string) =>
  cat.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase()).replace(/\bAi\b/g, "AI");

const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 print:mt-4">
      <h2 className="mb-3 break-after-avoid border-b border-neutral-300 pb-1.5 text-[11px] font-bold tracking-[0.2em] text-neutral-500 uppercase print:mb-2 print:pb-1">
        {title}
      </h2>
      {children}
    </section>
  );
}

const small = "text-[12px] text-neutral-500 print:text-[9px]";

export default function ResumePage() {
  const selected = SELECTED.map((slug) => projects.find((p) => p.slug === slug)).filter((p) => p !== undefined);
  const others = projects.filter((p) => !SELECTED.includes(p.slug));
  const github = profile.socials.find((s) => s.label === "GitHub");
  const linkedin = profile.socials.find((s) => s.label === "LinkedIn");

  // the closing block: everything someone needs to get in touch, in one place
  const details: { k: string; v: string; href?: string }[] = [
    { k: "Location", v: profile.location },
    { k: "Availability", v: `${profile.status} · remote-friendly (IST)` },
    { k: "Email", v: profile.email, href: `mailto:${profile.email}` },
    { k: "Portfolio", v: host(SITE_URL), href: SITE_URL },
    ...(github ? [{ k: "GitHub", v: host(github.href), href: github.href }] : []),
    ...(linkedin ? [{ k: "LinkedIn", v: host(linkedin.href), href: linkedin.href }] : []),
    { k: "Experience", v: `${profile.experienceYears} years · ${projects.length} projects shipped` },
    { k: "Focus next", v: profile.focus.join(" · ") },
  ];

  return (
    <main className="relative px-4 pt-32 pb-24 md:px-12 md:pt-40 print:p-0">
      <ResumeToolbar />

      <article
        id="resume"
        className="mx-auto max-w-4xl rounded-2xl bg-white px-6 py-10 text-[13px] leading-relaxed text-neutral-800 shadow-[0_40px_120px_-30px_rgba(255,45,32,0.35)] md:px-14 md:py-14 print:max-w-none print:rounded-none print:p-0 print:text-[9.6px] print:leading-snug print:shadow-none"
      >
        {/* ---------- header ---------- */}
        <header className="flex flex-col gap-5 border-b-2 border-neutral-900 pb-6 md:flex-row md:items-center md:justify-between print:flex-row print:items-center print:justify-between print:pb-3">
          <div className="flex items-center gap-5 print:gap-4">
            <span className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-full border border-neutral-300 print:h-[58px] print:w-[58px]">
              <Image src={profile.avatar} alt={profile.name} fill sizes="80px" className="object-cover" />
            </span>
            <div>
              <h1 className="font-display text-3xl font-black tracking-tight text-neutral-950 md:text-4xl print:text-[22px]">{profile.name}</h1>
              <p className="mt-1 text-base font-semibold text-[#e0241a] print:text-[11px]">{profile.role}</p>
              <p className="mt-1 text-[12px] text-neutral-600 print:text-[9px]">
                {profile.experienceYears} years · {projects.length} projects shipped · {profile.status}
              </p>
            </div>
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
            Full-stack developer with {profile.experienceYears} years of experience and {projects.length} shipped projects
            — booking platforms, multi-vendor marketplaces, AI tools and eCommerce storefronts — built end to end, from
            database schema and APIs to responsive, accessible, high-performance UIs. Started as a web development
            trainee, spent three years on Magento 2 and Laravel, and now builds across Next.js, React and TypeScript on
            the front end; Node.js, NestJS, FastAPI, Laravel and Magento 2 on the back end; Flutter and React Native on
            mobile. Founder of Glide in Bir, a paragliding booking platform.
          </p>
          <ul className="mt-3 grid gap-x-8 gap-y-1 sm:grid-cols-2 print:mt-2 print:grid-cols-2 print:gap-y-0.5">
            {highlights.map((h) => (
              <li key={h} className="flex gap-2">
                <span className="text-[#e0241a]">▸</span>
                {h}
              </li>
            ))}
          </ul>
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

        {/* ---------- the journey, newest first ---------- */}
        <Section title="Experience">
          <ul className="space-y-5 print:space-y-3">
            {ROLES.map((e) => (
              <li key={e.company} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-[14px] font-semibold text-neutral-950 print:text-[10.5px]">
                    {e.role} <span className="font-normal text-neutral-600">· {e.company}</span>
                  </h3>
                  <span className="text-[12px] font-semibold text-neutral-600 print:text-[9px]">{e.date}</span>
                </div>
                <p className="mt-1 print:mt-0.5">{e.description}</p>
                {e.points && (
                  <ul className="mt-1 list-disc space-y-0.5 pl-5 print:mt-0.5 print:space-y-0">
                    {e.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                )}
                <p className={`mt-1 ${small}`}>{e.tech.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Client work">
          <ul className="space-y-3 print:space-y-2">
            {CLIENTS.map((e) => (
              <li key={e.company} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-semibold text-neutral-950">
                    {e.company} <span className="font-normal text-neutral-600">— {e.role}</span>
                  </h3>
                  <span className={small}>{e.date}</span>
                </div>
                <p className="mt-0.5">{e.description}</p>
                <p className={`mt-0.5 ${small}`}>{e.tech.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Selected projects">
          <ul className="space-y-4 print:space-y-2.5">
            {selected.map((p) => (
              <li key={p.slug} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-semibold text-neutral-950">
                    {p.title} <span className="font-normal text-neutral-500">— {p.tagline}</span>
                  </h3>
                  <span className={small}>
                    {p.role} · {p.year}
                  </span>
                </div>
                <ul className="mt-1 list-disc space-y-0.5 pl-5 print:mt-0.5 print:space-y-0">
                  {p.features.slice(0, 3).map((f, i) => (
                    // two bullets per project on paper keeps the résumé to two pages
                    <li key={f} className={i > 1 ? "print:hidden" : undefined}>
                      {f}
                    </li>
                  ))}
                </ul>
                <p className={`mt-1 ${small}`}>
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

        <Section title={`More projects (${others.length})`}>
          <p>
            {others.map((p, i) => (
              <span key={p.slug}>
                {i > 0 && " · "}
                <a href={`${SITE_URL}/work/${p.slug}`} className="hover:underline">
                  <span className="font-semibold text-neutral-950">{p.title}</span>
                </a>
                <span className="text-neutral-500 print:hidden"> ({p.category})</span>
              </span>
            ))}
          </p>
          <p className={`mt-1 ${small}`}>
            Case studies with screenshots, stack and live links:{" "}
            <a href={`${SITE_URL}/work`} className="text-[#e0241a] hover:underline">
              {host(SITE_URL)}/work
            </a>
          </p>
        </Section>

        <Section title="Education & training">
          <ul className="space-y-1">
            {profile.education.map((ed) => (
              <li key={ed.title} className="flex flex-wrap items-baseline justify-between gap-x-4">
                <span>
                  <span className="font-semibold text-neutral-950">{ed.title}</span>
                  {ed.school && <span className="text-neutral-600"> · {ed.school}</span>}
                </span>
                {ed.year && <span className={small}>{ed.year}</span>}
              </li>
            ))}
          </ul>
        </Section>

        {/* ---------- closing block ---------- */}
        <section className="mt-10 break-inside-avoid rounded-xl border-2 border-neutral-900 p-6 md:p-8 print:mt-5 print:rounded-lg print:border print:p-4">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-neutral-300 pb-4 print:pb-2">
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-neutral-500 uppercase print:text-[8px]">Details</p>
              <p className="mt-1 font-display text-2xl font-black tracking-tight text-neutral-950 md:text-3xl print:text-[17px]">{profile.name}</p>
            </div>
            <p className="text-base font-semibold text-[#e0241a] print:text-[11px]">{profile.role}</p>
          </div>
          <dl className="mt-4 grid gap-x-10 gap-y-3 sm:grid-cols-2 print:mt-2.5 print:grid-cols-2 print:gap-y-1.5">
            {details.map((d) => (
              <div key={d.k}>
                <dt className="text-[10px] font-bold tracking-[0.18em] text-neutral-500 uppercase print:text-[7.5px]">{d.k}</dt>
                <dd className="mt-0.5 text-[15px] font-semibold text-neutral-950 print:mt-0 print:text-[10.5px]">
                  {d.href ? (
                    <a href={d.href} className="hover:underline">
                      {d.v}
                    </a>
                  ) : (
                    d.v
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
    </main>
  );
}
