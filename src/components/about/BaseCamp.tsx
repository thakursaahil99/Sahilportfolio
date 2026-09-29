"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { profile } from "@/data/profile";
import LocalClock from "../fx/LocalClock";
import RevealText from "../fx/RevealText";
import SectionTag from "../SectionTag";

const EASE = [0.16, 1, 0.3, 1] as const;

const STRIP = [
  { src: "/about/landing.jpg", caption: "Landing-field evenings" },
  { src: "/about/glide-snow.jpg", caption: "Above the ridgeline" },
  { src: "/about/camp.jpg", caption: "Camp nights" },
  { src: "/about/glide-blue.jpg", caption: "Launch-day skies" },
];

const FACTS = [
  { k: "Base", v: "Bir Billing, HP" },
  { k: "Known as", v: "India's paragliding capital" },
  { k: "Coordinates", v: profile.coordinates },
];

/** Full-bleed parallax photo of Bir with facts, followed by a hover-zoom photo strip. */
export default function BaseCamp() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const clip = useTransform(scrollYProgress, [0, 0.35], ["inset(12% 8% 12% 8% round 32px)", "inset(0% 0% 0% 0% round 0px)"]);

  return (
    <section className="relative py-20 md:py-28">
      <div className="px-6 md:px-12">
        <SectionTag index="02" label="Base camp — Where I build from" />
      </div>

      <div ref={ref} className="relative h-[80vh] min-h-[520px] w-full">
        <motion.div style={{ clipPath: clip }} className="absolute inset-0 overflow-hidden">
          <motion.div style={{ y }} className="absolute -inset-y-[15%] inset-x-0">
            <Image src="/about/glide-valley.jpg" alt="Paraglider soaring over a forested valley" fill sizes="100vw" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/40" />

          <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-12">
            <div className="flex items-center gap-3 self-end rounded-full border border-ink/20 bg-background/40 px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase">
                Local time <LocalClock />
              </span>
            </div>
            <div>
              <RevealText
                as="h2"
                text="Coding in the Himalayan foothills."
                className="block max-w-3xl font-display text-[9vw] md:text-[4vw] font-black uppercase leading-[0.92] tracking-[-0.04em]"
              />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease: EASE }}
                className="mt-5 max-w-lg text-sm md:text-base leading-relaxed text-ink/80"
              >
                I work remotely from Bir Billing in the Himalayan foothills — the town that inspired Glide in Bir. Clean
                air, clear thinking, and clients anywhere in the world.
              </motion.p>
              <dl className="mt-8 grid max-w-2xl grid-cols-1 gap-4 border-t border-ink/20 pt-6 sm:grid-cols-3">
                {FACTS.map((f) => (
                  <div key={f.k}>
                    <dt className="eyebrow">{f.k}</dt>
                    <dd className="mt-1 text-sm text-ink">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </motion.div>
      </div>

      {/* photo strip */}
      <ul className="mt-6 grid grid-cols-2 gap-3 px-6 md:mt-8 md:grid-cols-4 md:gap-4 md:px-12">
        {STRIP.map((s, i) => (
          <motion.li
            key={s.src}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }}
            className={`group relative aspect-[4/5] overflow-hidden rounded-2xl ${i % 2 ? "md:mt-12" : ""}`}
          >
            <Image
              src={s.src}
              alt={s.caption}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <p className="absolute bottom-4 left-4 right-4 font-mono text-[10px] tracking-[0.2em] uppercase text-ink/90">
              <span className="text-gold">0{i + 1}</span> — {s.caption}
            </p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
