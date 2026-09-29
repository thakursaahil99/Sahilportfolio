"use client";

import { motion, type Variants } from "framer-motion";
import type { ElementType } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

interface RevealTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** "words" slides each word up from a mask, "chars" does it per letter */
  split?: "words" | "chars";
  delay?: number;
  stagger?: number;
  /** animate when this becomes true instead of on scroll-into-view */
  play?: boolean;
}

/** Text that rises out of an invisible mask, word-by-word or letter-by-letter. */
export default function RevealText({
  text,
  as: Tag = "span",
  className,
  split = "words",
  delay = 0,
  stagger,
  play,
}: RevealTextProps) {
  const step = stagger ?? (split === "chars" ? 0.03 : 0.06);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: step, delayChildren: delay } },
  };
  const item: Variants = {
    hidden: { y: "110%", rotate: split === "chars" ? 8 : 3 },
    show: { y: "0%", rotate: 0, transition: { duration: 1, ease: EASE } },
  };

  const words = text.split(" ");
  const trigger =
    play === undefined
      ? { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.4 } }
      : { initial: "hidden", animate: play ? "show" : "hidden" };

  return (
    <Tag className={className} aria-label={text}>
      <motion.span className="inline" variants={container} {...trigger}>
        {words.map((word, wi) => (
          <span key={wi} aria-hidden="true" className="inline-block whitespace-nowrap">
            {split === "words" ? (
              <span className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em] px-[0.06em] -mx-[0.06em]">
                <motion.span className="inline-block origin-bottom-left" variants={item}>
                  {word}
                </motion.span>
              </span>
            ) : (
              word.split("").map((ch, ci) => (
                <span
                  key={ci}
                  // side padding keeps glyph overhang visible under negative tracking
                  className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em] px-[0.06em] -mx-[0.06em]"
                >
                  <motion.span className="inline-block origin-bottom-left" variants={item}>
                    {ch}
                  </motion.span>
                </span>
              ))
            )}
            {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
