import { skillGroups } from "@/data/profile";
import Reveal from "../fx/Reveal";

const ALL = skillGroups.flatMap((g) => g.items);
const ROW_A = ALL.filter((_, i) => i % 2 === 0);
const ROW_B = ALL.filter((_, i) => i % 2 === 1);

function Row({ words, reverse = false, duration }: { words: string[]; reverse?: boolean; duration: number }) {
  return (
    <div className="marquee-pause overflow-hidden">
      <div className={`marquee ${reverse ? "marquee-reverse" : ""}`} style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {words.map((w, i) => (
              <span key={w} className="flex items-center">
                <span
                  className={`px-5 font-display text-[11vw] font-black uppercase leading-none tracking-[-0.04em] transition-colors duration-300 md:px-8 md:text-[5.6vw] ${
                    i % 3 === 1 ? "text-ink hover:text-gold" : "text-ink/[0.14] hover:text-ink"
                  }`}
                >
                  {w}
                </span>
                <span className="text-[5vw] text-red md:text-[2.4vw]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** The toolbox as two oversized bands of type sliding against each other. Pure CSS; pauses on hover. */
export default function HomeStack() {
  return (
    <section aria-label="Technologies" className="relative overflow-hidden py-14 md:py-24">
      <Reveal as="p" className="eyebrow mb-8 px-6 md:mb-10 md:px-12">
        [ The toolbox — {ALL.length} tools in regular use ]
      </Reveal>
      <Reveal kind="rule" className="h-px bg-line" />
      <div className="space-y-2 py-6 md:space-y-4 md:py-10">
        <Row words={ROW_A} duration={95} />
        <Row words={ROW_B} duration={110} reverse />
      </div>
      <Reveal kind="rule" delay={150} className="h-px bg-line" />
    </section>
  );
}
