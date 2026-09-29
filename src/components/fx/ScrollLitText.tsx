"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/** Paragraph whose words light up one by one as it scrolls through the viewport. */
export default function ScrollLitText({
  text,
  highlight = [],
  className,
}: {
  text: string;
  /** words (lower-case, punctuation-free) that light up in the accent colour */
  highlight?: string[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <Word
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          accent={highlight.includes(word.toLowerCase().replace(/[^a-z0-9]/g, ""))}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  accent,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <motion.span
      aria-hidden="true"
      style={{ opacity, y }}
      className={`mr-[0.25em] inline-block ${accent ? "text-molten" : ""}`}
    >
      {children}
    </motion.span>
  );
}
