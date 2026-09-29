"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring } from "framer-motion";
import { experience } from "@/data/profile";
import { getProject } from "@/data/projects";
import SectionTag from "./SectionTag";
import RevealText from "./fx/RevealText";
import ProjectArt from "./work/ProjectArt";
import TLink from "./transition/TLink";

export default function Experience({ index = "03" }: { index?: string }) {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.75", "end 0.6"] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="journey" className="relative px-6 py-24 md:px-12 md:py-32">
      <SectionTag index={index} label="Journey — Flight log" />

      <RevealText
        as="h2"
        text="Every mission, an upgrade."
        className="mb-14 block max-w-5xl font-display text-[9vw] md:text-[3.6vw] font-black uppercase leading-[0.9] tracking-[-0.04em] md:mb-20"
      />

      <ol ref={listRef} className="relative border-t border-line">
        {/* line that draws itself as you scroll */}
        <motion.span
          aria-hidden="true"
          style={{ scaleY: line }}
          className="absolute left-0 top-0 h-full w-[2px] origin-top bg-gradient-to-b from-red via-gold to-transparent"
        />

        {experience.map((job, i) => {
          const project = getProject(job.slug);
          return (
            <motion.li
              key={job.company}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden border-b border-line"
            >
              <TLink href={`/work/${job.slug}`} data-cursor-label="Case" className="block">
                {/* fill that wipes up on hover */}
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-red transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100" />

                <div className="relative grid gap-5 py-7 pl-6 pr-2 transition-colors duration-500 group-hover:text-background md:grid-cols-[110px_170px_1fr_1.1fr_auto] md:items-center md:gap-8 md:py-9 md:pl-10">
                  <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-muted transition-colors duration-500 group-hover:text-background/70">
                    {job.date}
                  </span>

                  {/* thumbnail */}
                  <div className="relative aspect-[16/10] w-[170px] overflow-hidden rounded-lg border border-ink/10 bg-panel transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-2 group-hover:scale-105">
                    {project?.cover ? (
                      <Image src={project.cover} alt={job.company} fill sizes="170px" className="object-cover object-top" />
                    ) : (
                      <>
                        <ProjectArt accent={project?.accent ?? "blue"} />
                        <span className="absolute inset-0 flex items-center justify-center font-display text-4xl font-black text-ink/25">
                          {job.company[0]}
                        </span>
                      </>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display text-xl md:text-2xl font-black uppercase tracking-tight transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                      {job.company}
                    </h3>
                    <p className="mt-2 font-mono text-[10px] tracking-[0.2em] uppercase text-gold transition-colors duration-500 group-hover:text-background">
                      {job.role}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm leading-relaxed text-muted transition-colors duration-500 group-hover:text-background/80">
                      {job.description}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {job.tech.map((t) => (
                        <li
                          key={t}
                          className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[9px] tracking-[0.15em] uppercase transition-colors duration-500 group-hover:border-background/40"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="hidden md:block text-3xl transition-transform duration-500 group-hover:rotate-45">↗</span>
                </div>
              </TLink>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
