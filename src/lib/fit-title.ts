import type { CSSProperties } from "react";

// Unbounded Black averages ~0.8em per uppercase glyph at tight tracking.
const GLYPH_EM = 0.8;

/**
 * Font sizes (in vw) that keep the longest word of a display title on one
 * line: capped at `mobile` / `desktop` vw, shrunk for long words.
 * Use with `text-[length:var(--fs-m)] md:text-[length:var(--fs-d)]`.
 */
export function fitTitle(
  title: string,
  mobile: number,
  desktop: number,
  /** usable width of the heading's container, in vw, on [mobile, desktop] */
  available: [number, number] = [86, 90]
): CSSProperties {
  const longest = Math.max(...title.split(/\s+/).map((w) => w.length));
  const fit = (width: number) => width / (longest * GLYPH_EM);
  return {
    "--fs-m": `${Math.min(mobile, fit(available[0])).toFixed(2)}vw`,
    "--fs-d": `${Math.min(desktop, fit(available[1])).toFixed(2)}vw`,
  } as CSSProperties;
}
