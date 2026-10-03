"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getLenis } from "@/lib/smooth-scroll";
import { markIntroDone } from "@/lib/use-intro";
import { getPerfTier, setPerfTier } from "@/lib/perf";
import { profile } from "@/data/profile";

/** Intro: quick multilingual greeting → name reveal → curtain splits open. */

const GREETINGS = ["Hello", "नमस्ते", "Hola", "Bonjour", "Ciao", "こんにちは", "Welcome"];
const GREET_FIRST = 380; // first word lingers a little
const GREET_STEP = 150;
const GREET_END = 1500; // "Welcome" holds until the name comes in
const DURATION = 3000;
const EASE = [0.76, 0, 0.24, 1] as const;
const OUT = [0.16, 1, 0.3, 1] as const;
const FADE_AT = DURATION - 450; // name fades, then the seam flashes on a clean screen
const SEAM_AT = DURATION - 250;

const [FIRST, ...REST] = profile.name.toUpperCase().split(" ");
const LAST = REST.join(" ");

function greetingIndex(ms: number) {
  if (ms < GREET_FIRST) return 0;
  return Math.min(GREETINGS.length - 1, 1 + Math.floor((ms - GREET_FIRST) / GREET_STEP));
}

/** Blend two #rrggbb colours. */
function mix(a: string, b: string, t: number) {
  const ch = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  const c = [0, 1, 2].map((i) => Math.round(ch(a, i) + (ch(b, i) - ch(a, i)) * t));
  return `rgb(${c.join(",")})`;
}

/**
 * Word whose letters slide up one after another. `gradient` colours each letter
 * along a gold→red ramp — background-clip text can't follow per-letter transforms.
 */
function Letters({
  text,
  delay = 0,
  gradient = false,
  className = "",
}: {
  text: string;
  delay?: number;
  gradient?: boolean;
  className?: string;
}) {
  const n = Math.max(1, text.length - 1);
  return (
    <span className={`flex overflow-hidden pb-[0.06em] ${className}`} aria-hidden="true">
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={gradient ? { color: mix("#ffb547", "#ff2d20", i / n) } : undefined}
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: OUT, delay: delay + i * 0.04 }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function Preloader() {
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    getPerfTier();
    document.documentElement.style.overflow = "hidden";
    const start = performance.now();
    let raf = 0;
    let timer: ReturnType<typeof setTimeout>;
    let last = start;
    let frames = 0;
    let slow = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      setDone(true);
      markIntroDone(); // hero starts animating while the curtain opens
    };
    skipRef.current = finish;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);

    const tick = (now: number) => {
      // rAF timestamps can predate `start` slightly, so clamp at 0
      const ms = Math.max(0, now - start);
      setElapsed(Math.min(ms, DURATION));

      // the intro doubles as a benchmark: a device that drops frames here gets the lite effects
      if (ms > 300 && ms < 2400) {
        frames++;
        if (now - last > 28) slow++;
      }
      last = now;

      if (ms < DURATION) raf = requestAnimationFrame(tick);
      else {
        if (frames > 20 && slow / frames > 0.35) setPerfTier("lite");
        timer = setTimeout(finish, 150);
      }
    };
    // reduced motion: no intro at all
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setTimeout(finish, 0);
    else raf = requestAnimationFrame(tick);
    getLenis()?.stop();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const phase = elapsed < GREET_END ? "greet" : "name";
  const t = elapsed / DURATION;
  // quick start, brief stall near the end — feels like real loading
  const count = Math.round((t < 0.8 ? Math.pow(t / 0.8, 0.8) * 0.82 : 0.82 + ((t - 0.8) / 0.2) * 0.18) * 100);
  const word = GREETINGS[greetingIndex(elapsed)];
  const curtain = { duration: 1.1, ease: EASE, delay: 0.15 };

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.style.overflow = "";
        getLenis()?.start();
      }}
    >
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[150]"
          exit={{ opacity: 1 }}
          transition={{ duration: 1.3 }}
          aria-label="Loading"
          role="status"
        >
          {/* curtain halves */}
          <motion.div className="absolute inset-x-0 top-0 h-1/2 bg-background" exit={{ y: "-100%" }} transition={curtain} />
          <motion.div className="absolute inset-x-0 bottom-0 h-1/2 bg-background" exit={{ y: "100%" }} transition={curtain} />

          {/* molten seam that flashes across right before the split */}
          <motion.div
            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 origin-center bg-gradient-to-r from-transparent via-red to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={elapsed > SEAM_AT ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: OUT }}
          />

          <motion.div
            className="relative flex h-full flex-col justify-between px-6 py-8 md:px-12 md:py-10"
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-muted">
              <span>Portfolio ©{new Date().getFullYear()}</span>
              <button
                onClick={() => skipRef.current()}
                className="pointer-events-auto rounded-full border border-line px-3 py-1.5 text-ink/70 transition-colors hover:border-ink hover:text-ink sm:order-last"
              >
                Skip intro →
              </button>
              <span className="hidden sm:block">{profile.coordinates}</span>
            </div>

            {/* greeting and name share one grid cell so they cross over with no gap */}
            <motion.div
              className="grid flex-1 place-items-center [&>*]:[grid-area:1/1]"
              animate={elapsed > FADE_AT ? { opacity: 0, y: -24 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <AnimatePresence initial={false}>
                {phase === "greet" ? (
                  <motion.p
                    key="greet"
                    className="flex items-center gap-4 font-display text-4xl font-semibold text-ink md:text-6xl"
                    exit={{ opacity: 0, y: -40, transition: { duration: 0.4, ease: EASE } }}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-gold to-red md:h-3.5 md:w-3.5" />
                    <span>{word}</span>
                  </motion.p>
                ) : (
                  <motion.div key="name" className="text-center">
                    <h2 className="sr-only">{profile.name}</h2>
                    <div className="font-display font-black uppercase leading-[0.9] tracking-[-0.04em]">
                      <Letters text={FIRST} className="justify-center text-[17vw] text-ink md:text-[9vw]" />
                      {LAST && (
                        <Letters text={LAST} delay={0.15} gradient className="justify-center text-[17vw] md:text-[9vw]" />
                      )}
                    </div>
                    <motion.p
                      className="mt-6 font-mono text-[10px] tracking-[0.3em] uppercase text-ink/70 md:text-xs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: OUT, delay: 0.55 }}
                    >
                      {profile.role} <span className="text-red">✦</span> {profile.location.split(",")[0]}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div>
              <div className="mb-3 flex items-end justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-muted">
                <span>{phase === "greet" ? "Loading experience" : "Suiting up"}</span>
                <span className="tabular-nums text-ink">{String(count).padStart(3, "0")}</span>
              </div>
              <div className="h-px w-full bg-line">
                <div className="h-full bg-gradient-to-r from-red to-gold" style={{ width: `${count}%` }} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
