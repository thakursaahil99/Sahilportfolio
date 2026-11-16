"use client";

import { createElement, useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

/**
 * Scroll reveals without per-frame JavaScript: one IntersectionObserver for the
 * whole page marks an element with `data-in` the first time it enters the
 * viewport, and CSS transitions (globals.css → "scroll reveals") do the rest.
 */
let observer: IntersectionObserver | null = null;

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-in", "");
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  return observer;
}

function useReveal<T extends Element>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);
  return ref;
}

type Kind = "up" | "left" | "right" | "scale" | "clip" | "rule";

/** Wraps content that should animate in when scrolled to. `delay` is in ms. */
export default function Reveal({
  as = "div",
  kind = "up",
  delay = 0,
  className,
  style,
  children,
}: {
  as?: ElementType;
  kind?: Kind;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const ref = useReveal<HTMLElement>();
  return createElement(
    as,
    { ref, "data-reveal": kind, className, style: delay ? ({ ...style, "--d": `${delay}ms` } as CSSProperties) : style },
    children
  );
}

/** Headline whose words rise out of a mask one by one. Words listed in `accent` get the molten gradient, `outline` the outlined style. */
export function SplitReveal({
  text,
  as = "span",
  className,
  delay = 0,
  accent = [],
  outline = [],
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  accent?: string[];
  outline?: string[];
}) {
  const ref = useReveal<HTMLElement>();
  const key = (word: string) => word.toLowerCase().replace(/[^a-z0-9']/g, "");
  return createElement(
    as,
    { ref, className: `rv ${className ?? ""}`, "aria-label": text, style: delay ? ({ "--d": `${delay}ms` } as CSSProperties) : undefined },
    text.split(" ").map((word, i) => (
      <span key={i} aria-hidden="true">
        <span className="rv-mask">
          <span
            className={`rv-word ${accent.includes(key(word)) ? "text-molten" : outline.includes(key(word)) ? "text-outline" : ""}`}
            style={{ "--i": i } as CSSProperties}
          >
            {word}
          </span>
        </span>{" "}
      </span>
    ))
  );
}
