import Image from "next/image";
import { profile } from "@/data/profile";
import SectionTag from "../SectionTag";
import Reveal, { SplitReveal } from "../fx/Reveal";
import TLink from "../transition/TLink";

const WAYS = [
  {
    tag: "Full-time",
    title: "Join your team",
    desc: "A full-stack developer who can own a feature from the database to the last animation — and ship it.",
    points: ["Frontend, backend and deployment", "Remote-friendly, IST hours", profile.status],
    photo: { src: profile.portrait, alt: profile.name, position: "object-top" },
    cta: { label: "View résumé", href: "/resume" },
  },
  {
    tag: "Project",
    title: "Build it end to end",
    desc: "One defined product — a platform, a store or a site — taken through the four steps above, from discovery to launch.",
    points: ["Clear scope and milestones", "Weekly demos while I build", "Launch and handover"],
    photo: { src: "/projects/glideinbir-kart/cover.jpg", alt: "Glideinbir Kart — front page", position: "object-left-top" },
    cta: { label: "Start a project", href: "/contact?type=Web%20app" },
  },
  {
    tag: "Existing code",
    title: "Fix, extend, speed up",
    desc: "Already have a site or store? I audit, fix and extend Next.js, React, Node.js, Laravel and Magento 2 codebases.",
    points: ["Audit and performance pass", "New features on your stack", "Storefront rebuilds"],
    photo: { src: "/projects/plantshed/cover-0.jpg", alt: "PlantShed — storefront rebuild", position: "object-left-top" },
    cta: { label: "Talk about your site", href: "/contact?type=Something%20else" },
  },
];

/** Three ways to work together, each with a real photo and a direct next step. */
export default function Engagements({ index = "04" }: { index?: string }) {
  return (
    <section className="relative px-6 pt-28 md:px-12 md:pt-40">
      <SectionTag index={index} label="Ways to work — Pick what fits" />
      <SplitReveal
        as="h2"
        text="Three ways to work with me."
        accent={["work"]}
        className="block max-w-4xl font-display text-[9vw] font-black uppercase leading-[0.9] tracking-[-0.04em] md:text-[3.6vw]"
      />

      <div className="mt-12 grid gap-5 md:mt-16 lg:grid-cols-3">
        {WAYS.map((w, i) => (
          <Reveal key={w.tag} delay={i * 110} className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-panel transition-colors duration-500 hover:border-ink/30">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={w.photo.src}
                alt={w.photo.alt}
                fill
                sizes="(min-width: 1024px) 31vw, 92vw"
                className={`object-cover ${w.photo.position} transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-background/30" />
              <span className="absolute left-4 top-4 rounded-full bg-background/70 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase backdrop-blur-md">
                0{i + 1} · {w.tag}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-6 md:p-8">
              <h3 className="font-display text-2xl font-black uppercase leading-[1] tracking-tight md:text-3xl">{w.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70 md:text-base">{w.desc}</p>
              <ul className="mt-6 mb-8 space-y-2.5">
                {w.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-3 text-sm text-ink/85">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-gold to-red" />
                    {pt}
                  </li>
                ))}
              </ul>
              <TLink
                href={w.cta.href}
                className="group/link mt-auto inline-flex items-center gap-3 self-start font-mono text-[11px] tracking-[0.25em] uppercase"
              >
                <span className="relative">
                  {w.cta.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover/link:scale-x-100" />
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/30 transition-all duration-500 group-hover/link:-rotate-45 group-hover/link:border-transparent group-hover/link:bg-ink group-hover/link:text-background">
                  →
                </span>
              </TLink>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
