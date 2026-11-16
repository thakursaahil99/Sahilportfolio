"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getLenis } from "@/lib/smooth-scroll";
import { markIntroDone } from "@/lib/use-intro";
import { getPerfTier, setPerfTier } from "@/lib/perf";
import { profile } from "@/data/profile";

/**
 * Intro: portrait inside a ring that draws as the page loads, the name rising
 * underneath, a large counter — then the whole slab lifts off the page with a
 * curved bottom edge and a molten layer trailing behind it.
 *
 * Built to stay smooth on phones and low-power laptops: React renders it twice
 * (once to show, once to leave). The counter, bar and ring are written straight
 * to the DOM from one requestAnimationFrame loop, and everything that moves is
 * a CSS transform or opacity (see `.intro-*` in globals.css).
 */

const FULL_MS = 2300; // first visit in this tab
const SHORT_MS = 800; // later loads in the same tab: no need to sit through it again
const LEAVE_MS = 1150; // slab + trailing layer have cleared the screen
const RING = 2 * Math.PI * 46;
const SEEN_KEY = "portfolio:intro-seen";
const OUT = "cubic-bezier(0.16, 1, 0.3, 1)";

const [FIRST, ...REST] = profile.name.toUpperCase().split(" ");
const LAST = REST.join(" ");

// read once per page load (effects can run twice in development)
let firstVisit: boolean | null = null;
function isFirstVisit() {
  if (firstVisit !== null) return firstVisit;
  try {
    firstVisit = sessionStorage.getItem(SEEN_KEY) !== "1";
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    firstVisit = true; // storage blocked: just play the full intro
  }
  return firstVisit;
}

/** Blend two #rrggbb colours. */
function mix(a: string, b: string, t: number) {
  const ch = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  const c = [0, 1, 2].map((i) => Math.round(ch(a, i) + (ch(b, i) - ch(a, i)) * t));
  return `rgb(${c.join(",")})`;
}

/** Word whose letters rise out of a mask one after another (CSS animation, no JS per frame). */
function Letters({ text, delay = 0, gradient = false }: { text: string; delay?: number; gradient?: boolean }) {
  const n = Math.max(1, text.length - 1);
  return (
    <span className="flex overflow-hidden pb-[0.06em]" aria-hidden="true">
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            color: gradient ? mix("#ffb547", "#ff2d20", i / n) : undefined,
            animation: `intro-rise 800ms ${OUT} ${delay + i * 40}ms both`,
          }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

export default function Preloader() {
  const [state, setState] = useState<"run" | "exit" | "gone">("run");
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    getPerfTier();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = isFirstVisit() ? FULL_MS : SHORT_MS;
    document.documentElement.style.overflow = "hidden";
    getLenis()?.stop();

    const start = performance.now();
    let raf = 0;
    let leaveTimer: ReturnType<typeof setTimeout>;
    let last = start;
    let frames = 0;
    let slow = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      setState("exit");
      markIntroDone(); // the hero starts animating while the slab lifts
      leaveTimer = setTimeout(() => setState("gone"), reduced ? 0 : LEAVE_MS);
    };
    skipRef.current = finish;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);

    const tick = (now: number) => {
      // rAF timestamps can predate `start` slightly, so clamp at 0
      const ms = Math.max(0, now - start);
      const t = Math.min(1, ms / total);
      // quick start, brief stall near the end — reads like real loading
      const p = t < 0.8 ? Math.pow(t / 0.8, 0.8) * 0.82 : 0.82 + ((t - 0.8) / 0.2) * 0.18;

      if (countRef.current) countRef.current.textContent = String(Math.round(p * 100)).padStart(2, "0");
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (ringRef.current) ringRef.current.style.strokeDashoffset = String(RING * (1 - p));

      // the intro doubles as a benchmark: a device that drops frames here gets the lite effects
      if (ms > 300 && ms < 1900) {
        frames++;
        if (now - last > 28) slow++;
      }
      last = now;

      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        if (frames > 20 && slow / frames > 0.35) setPerfTier("lite");
        finish();
      }
    };
    // reduced motion: no intro at all
    if (reduced) leaveTimer = setTimeout(finish, 0);
    else raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(leaveTimer);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // hand the page back once the overlay is gone
  useEffect(() => {
    if (state !== "gone") return;
    document.documentElement.style.overflow = "";
    getLenis()?.start();
  }, [state]);

  if (state === "gone") return null;

  return (
    <div className="intro fixed inset-0 z-[150] overflow-hidden" data-state={state} aria-label="Loading" role="status">
      {/* molten layer that trails the slab on the way out */}
      <div className="intro-layer intro-accent bg-gradient-to-r from-red via-gold to-red" />

      <div className="intro-layer bg-background">
        <div className="intro-content flex h-[100svh] flex-col justify-between px-6 py-7 md:px-12 md:py-9">
          {/* top bar */}
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-muted">
            <span className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-red" />
              Portfolio ©{new Date().getFullYear()}
            </span>
            <span className="hidden sm:block">{profile.coordinates}</span>
            <button
              onClick={() => skipRef.current()}
              className="rounded-full border border-line px-3 py-1.5 uppercase text-ink/70 transition-colors hover:border-ink hover:text-ink"
            >
              Skip →
            </button>
          </div>

          {/* portrait ring + name */}
          <div className="flex flex-col items-center text-center">
            <div className="relative h-24 w-24 md:h-32 md:w-32" style={{ animation: `intro-pop 700ms ${OUT} 60ms both` }}>
              <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-ink/10" />
                <circle
                  ref={ringRef}
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="url(#intro-ring)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeDasharray={RING}
                  strokeDashoffset={RING}
                />
                <defs>
                  <linearGradient id="intro-ring" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#ffb547" />
                    <stop offset="1" stopColor="#ff2d20" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-[9%] overflow-hidden rounded-full">
                <Image src={profile.avatar} alt="" fill sizes="128px" loading="eager" className="object-cover" />
              </span>
            </div>

            <h2 className="sr-only">{profile.name}</h2>
            <div className="mt-7 flex flex-col items-center font-display text-[15vw] font-black uppercase leading-[0.9] tracking-[-0.04em] md:flex-row md:gap-[0.28em] md:text-[7.4vw]">
              <span className="text-ink">
                <Letters text={FIRST} delay={180} />
              </span>
              {LAST && <Letters text={LAST} delay={330} gradient />}
            </div>
            <p
              className="mt-5 font-mono text-[10px] tracking-[0.3em] uppercase text-ink/70 md:text-xs"
              style={{ animation: `intro-fade 700ms ${OUT} 700ms both` }}
            >
              {profile.role} <span className="text-red">✦</span> {profile.location.split(",")[0]}
            </p>
          </div>

          {/* counter + bar */}
          <div>
            <div className="mb-3 flex items-end justify-between">
              <p className="font-display text-[19vw] font-black leading-[0.8] tracking-[-0.06em] tabular-nums text-ink md:text-[8.5vw]">
                <span ref={countRef}>00</span>
                <span className="ml-[0.06em] align-top font-mono text-[0.22em] font-normal tracking-normal text-red">%</span>
              </p>
              <p className="pb-1 text-right font-mono text-[10px] tracking-[0.3em] uppercase text-muted">
                Suiting up
                <br />
                <span className="text-ink/70">{profile.status}</span>
              </p>
            </div>
            <div className="h-px w-full bg-line">
              <div ref={barRef} className="h-full origin-left bg-gradient-to-r from-red to-gold" style={{ transform: "scaleX(0)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
