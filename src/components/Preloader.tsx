"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getLenis } from "@/lib/smooth-scroll";
import { markIntroDone } from "@/lib/use-intro";
import { profile } from "@/data/profile";

const BOOT_LINES = [
  "INITIALIZING MARK-26 OS",
  "LINKING NEURAL INTERFACE",
  "CALIBRATING REPULSORS",
  "COMPILING PORTFOLIO.TSX",
  `IDENTITY CONFIRMED — ${profile.name.toUpperCase()}`,
];

const DURATION = 2400;
const EASE = [0.76, 0, 0.24, 1] as const;

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // ease-in-out with a small stall near 80% — feels like real loading
      const eased = t < 0.8 ? Math.pow(t / 0.8, 0.8) * 0.82 : 0.82 + ((t - 0.8) / 0.2) * 0.18;
      setCount(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          setDone(true);
          markIntroDone(); // hero starts animating while the curtain lifts
        }, 250);
    };
    raf = requestAnimationFrame(tick);
    getLenis()?.stop();

    return () => cancelAnimationFrame(raf);
  }, []);

  const lines = Math.min(BOOT_LINES.length, Math.floor((count / 100) * (BOOT_LINES.length + 0.5)) + 1);

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
          className="fixed inset-0 z-[150] flex flex-col justify-between bg-background px-6 py-8 md:px-12 md:py-10"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <div className="flex items-start justify-between font-mono text-[11px] tracking-[0.25em] text-muted uppercase">
            <div className="space-y-2">
              {BOOT_LINES.slice(0, lines).map((line, i) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={i === BOOT_LINES.length - 1 ? "text-gold" : undefined}
                >
                  <span className="text-red">&gt;</span> {line}
                  {i === lines - 1 && <span className="ml-1 animate-pulse">_</span>}
                </motion.p>
              ))}
            </div>
            <span className="hidden md:block">{profile.coordinates}</span>
          </div>

          <div>
            <div className="flex items-end justify-between gap-6">
              <p className="font-display text-sm md:text-base uppercase tracking-[0.2em] text-ink/70 max-w-[14ch]">
                Suiting up the portfolio
              </p>
              <p className="font-display font-black leading-none tabular-nums text-[22vw] md:text-[12vw] text-ink">
                {String(count).padStart(3, "0")}
              </p>
            </div>
            <div className="mt-6 h-px w-full bg-line">
              <div
                className="h-full bg-gradient-to-r from-red to-gold"
                style={{ width: `${count}%`, transition: "width 80ms linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
