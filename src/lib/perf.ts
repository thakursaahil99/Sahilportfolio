"use client";

/**
 * Rough device tier. "lite" turns off the purely decorative, GPU-hungry effects
 * (animated grain, molten text shimmer, drifting blurred blobs, backdrop blur)
 * via `html[data-perf="lite"]` in globals.css, and lowers the hero WebGL resolution.
 */
type Nav = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

let tier: "lite" | "full" | null = null;

export function getPerfTier() {
  if (tier) return tier;
  const nav = navigator as Nav;
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  const lite =
    cores <= 4 ||
    memory <= 4 ||
    nav.connection?.saveData === true ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  setPerfTier(lite ? "lite" : "full");
  return tier!;
}

export function setPerfTier(next: "lite" | "full") {
  tier = next;
  document.documentElement.dataset.perf = next;
}
