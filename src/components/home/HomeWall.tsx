import Image from "next/image";
import { projects } from "@/data/projects";
import Reveal, { SplitReveal } from "../fx/Reveal";
import TLink from "../transition/TLink";

type Tile = { src: string; title: string; slug: string; category: string };

// one tile per project — its front page
const TILES: Tile[] = projects
  .filter((p) => p.cover)
  .map((p) => ({ src: p.cover as string, title: p.title, slug: p.slug, category: p.category }));
const ROW_A = TILES.filter((_, i) => i % 2 === 0);
const ROW_B = TILES.filter((_, i) => i % 2 === 1);

function Row({ tiles, reverse = false, duration }: { tiles: Tile[]; reverse?: boolean; duration: number }) {
  return (
    <div className="marquee-pause overflow-hidden">
      {/* the list is rendered twice and slides by exactly half its width, so the loop is seamless */}
      <div className={`marquee ${reverse ? "marquee-reverse" : ""}`} style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {tiles.map((t) => (
              <TLink
                key={t.slug}
                href={`/work/${t.slug}`}
                tabIndex={copy === 1 ? -1 : undefined}
                data-cursor-label="View"
                className="group relative mx-2 block h-[132px] w-[211px] shrink-0 overflow-hidden rounded-2xl border border-ink/10 bg-panel md:mx-3 md:h-[210px] md:w-[336px]"
              >
                <Image
                  src={t.src}
                  alt={copy === 0 ? `${t.title} — front page` : ""}
                  fill
                  sizes="(min-width: 768px) 336px, 211px"
                  className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute inset-x-4 bottom-3 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="block font-display text-sm font-black uppercase tracking-tight md:text-base">{t.title}</span>
                  <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-gold">{t.category} ↗</span>
                </span>
              </TLink>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Wall of every project's front page: two rows sliding in opposite directions
 * on a tilted plane. Pure CSS animation — it pauses on hover and costs nothing
 * in JavaScript.
 */
export default function HomeWall() {
  return (
    <section className="relative overflow-hidden pt-20 pb-10 md:pt-28 md:pb-16">
      <div className="mb-10 grid gap-6 px-6 md:mb-14 md:grid-cols-[1fr_auto] md:items-end md:px-12">
        <div>
          <Reveal as="p" className="eyebrow mb-4">
            (00) — Selected screens
          </Reveal>
          <SplitReveal
            as="h2"
            text={`${TILES.length} things I've shipped.`}
            accent={["shipped"]}
            className="block font-display text-[8.4vw] font-black uppercase leading-[0.95] tracking-[-0.04em] md:text-[3.4vw]"
          />
        </div>
        <Reveal as="p" delay={150} className="max-w-xs text-sm leading-relaxed text-muted">
          Real screens from booking platforms, marketplaces, AI tools and brand sites. Hover to pause, tap any tile for its
          case study.
        </Reveal>
      </div>

      <Reveal kind="scale" className="relative [perspective:1600px]">
        <div className="space-y-4 [transform:rotateX(14deg)_rotateZ(-3deg)_scale(1.06)] md:space-y-6">
          <Row tiles={ROW_A} duration={70} />
          <Row tiles={ROW_B} duration={84} reverse />
        </div>
        {/* fade the edges into the page */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent md:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent md:w-40" />
      </Reveal>
    </section>
  );
}
