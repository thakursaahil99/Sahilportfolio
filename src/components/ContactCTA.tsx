"use client";

import { profile } from "@/data/profile";
import SectionTag from "./SectionTag";
import RevealText from "./fx/RevealText";
import Magnetic from "./fx/Magnetic";
import TLink from "./transition/TLink";

const RING_TEXT = `${profile.status} • ${new Date().getFullYear()} • Let's talk • `;

/** Big "Let's build something legendary" block with the orbiting magnetic button. */
export default function ContactCTA({ index = "05" }: { index?: string }) {
  return (
    <section className="relative overflow-hidden px-6 pt-28 pb-10 md:px-12 md:pt-40">
      <SectionTag index={index} label="Contact — Open a channel" />

      <div className="grid gap-16 md:grid-cols-[1fr_auto] md:items-end">
        <h2 className="font-display font-black uppercase leading-[0.86] tracking-[-0.04em] text-[11vw] md:text-[5.2vw]">
          <RevealText text="Let's build" className="block" />
          <RevealText text="something" className="block text-outline" delay={0.1} />
          <RevealText text="legendary." className="block text-molten" delay={0.2} />
        </h2>

        <Magnetic strength={0.4} className="justify-self-start md:justify-self-end">
          <TLink
            href="/contact"
            data-cursor-label="Let's go"
            className="group relative flex h-44 w-44 md:h-56 md:w-56 items-center justify-center"
          >
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow">
              <defs>
                <path id="cta-ring" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
              </defs>
              <text className="fill-ink/60 font-mono text-[11px] uppercase">
                {/* stretch the phrase to exactly one lap of the circle */}
                <textPath href="#cta-ring" textLength={2 * Math.PI * 82 - 6} lengthAdjust="spacing">
                  {RING_TEXT}
                </textPath>
              </text>
            </svg>
            <span className="relative flex h-28 w-28 md:h-36 md:w-36 items-center justify-center rounded-full bg-red text-center font-mono text-[11px] font-semibold tracking-[0.2em] uppercase text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
              Start a<br />project →
            </span>
          </TLink>
        </Magnetic>
      </div>
    </section>
  );
}
