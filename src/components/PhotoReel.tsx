"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { projects } from "@/data/projects";
import VelocityMarquee from "./fx/VelocityMarquee";
import TLink from "./transition/TLink";

type Tile = { src: string; title: string; slug: string };

// every screenshot we have, tagged with the project it belongs to
const TILES: Tile[] = projects.flatMap((p) =>
  [p.cover, ...(p.gallery ?? []).map((g) => g.src)]
    .filter((src): src is string => Boolean(src))
    .map((src) => ({ src, title: p.title, slug: p.slug }))
);
const ROW_A = TILES.filter((_, i) => i % 2 === 0);
const ROW_B = TILES.filter((_, i) => i % 2 === 1);

function TileCard({ tile }: { tile: Tile }) {
  return (
    <TLink
      href={`/work/${tile.slug}`}
      data-cursor-label="View"
      className="group relative mx-2.5 block h-[150px] w-[240px] shrink-0 overflow-hidden rounded-2xl border border-ink/10 bg-panel md:mx-3 md:h-[220px] md:w-[352px]"
    >
      <Image
        src={tile.src}
        alt={tile.title}
        fill
        sizes="352px"
        className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="absolute bottom-3 left-4 translate-y-3 font-mono text-[10px] tracking-[0.25em] uppercase text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        {tile.title} ↗
      </span>
    </TLink>
  );
}

/**
 * Tilted 3D wall of project screenshots: two rows drifting in opposite
 * directions (faster while scrolling), flattening out as it scrolls into view.
 */
export default function PhotoReel() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [28, 8, -10]);
  const rotateZ = useTransform(scrollYProgress, [0, 0.5, 1], [-6, -3, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.15, 1]);

  return (
    <div ref={ref} className="relative overflow-hidden py-10 [perspective:1400px] md:py-16">
      <motion.div style={{ rotateX, rotateZ, scale }} className="space-y-5 md:space-y-6">
        <VelocityMarquee baseVelocity={-1.4}>
          {ROW_A.map((t) => (
            <TileCard key={t.src} tile={t} />
          ))}
        </VelocityMarquee>
        <VelocityMarquee baseVelocity={1.4}>
          {ROW_B.map((t) => (
            <TileCard key={t.src} tile={t} />
          ))}
        </VelocityMarquee>
      </motion.div>
      {/* fade the edges into the page */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent md:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent md:w-40" />
    </div>
  );
}
