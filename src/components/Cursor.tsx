"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

const QUERY = "(hover: hover) and (pointer: fine)";

const useFinePointer = () =>
  useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(QUERY);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(QUERY).matches,
    () => false
  );

type State = { mode: "default" | "link" | "label" | "hidden"; label?: string };

/**
 * Blend-mode cursor. Elements opt in with:
 *  data-cursor="hidden"          — hide the ring (e.g. hero lens draws its own)
 *  data-cursor-label="View"      — ring grows into a labelled disc
 *  a / button                    — ring grows slightly
 */
export default function Cursor() {
  const enabled = useFinePointer();
  const [state, setState] = useState<State>({ mode: "default" });
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>("[data-cursor-label]");
      if (labelled) return setState({ mode: "label", label: labelled.dataset.cursorLabel });
      if (t.closest("a, button, [data-cursor='link']")) return setState({ mode: "link" });
      if (t.closest("[data-cursor='hidden']")) return setState({ mode: "hidden" });
      setState({ mode: "default" });
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = { default: 14, link: 56, label: 96, hidden: 6 }[state.mode];

  return (
    <motion.div
      aria-hidden="true"
      data-no-print
      className="fixed top-0 left-0 z-[200] pointer-events-none flex items-center justify-center rounded-full bg-ink mix-blend-difference"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{ width: size, height: size, scale: pressed ? 0.8 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <AnimatePresence>
        {state.mode === "label" && (
          <motion.span
            key={state.label}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="font-mono text-[11px] font-semibold tracking-[0.2em] uppercase text-black"
          >
            {state.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
