"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/lib/smooth-scroll";
import { getProject } from "@/data/projects";
import { NAV } from "@/data/nav";

const EASE = [0.76, 0, 0.24, 1] as const;
const OUT = [0.16, 1, 0.3, 1] as const;
const GREETINGS = ["Hello", "नमस्ते", "Hola", "Bonjour", "Ciao", "こんにちは", "Welcome"];

const COVER_MS = 650; // curtains close
const MIN_HOLD_MS = 1100; // title on screen at least this long, so the intro always reads
const REVEAL_MS = 1100; // curtains open

type Phase = "idle" | "cover" | "hold" | "reveal";
type Ctx = { navigate: (href: string) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

const pathOf = (href: string) => href.split(/[?#]/)[0] || "/";
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function describe(path: string) {
  const i = NAV.findIndex((n) => n.href === path);
  if (i >= 0) return { title: NAV[i].label, kicker: `(${String(i + 1).padStart(2, "0")}) / ${String(NAV.length).padStart(2, "0")}` };
  if (path.startsWith("/work/")) return { title: getProject(path.slice(6))?.title ?? "Work", kicker: "Case study" };
  const seg = path.slice(1);
  return { title: seg.charAt(0).toUpperCase() + seg.slice(1) || "Home", kicker: "Loading" };
}

/** Big title whose letters rise in one after another and leave upward. */
function Title({ text }: { text: string }) {
  const letters = text.toUpperCase().split("");
  // long project names get a smaller size so they stay on one line
  const size = text.length > 12 ? "text-[11vw] md:text-[8vw]" : "text-[17vw] md:text-[12vw]";
  return (
    <span aria-hidden="true" className={`flex overflow-hidden pb-[0.06em] font-display font-black leading-[0.9] tracking-[-0.05em] ${size}`}>
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "110%", rotate: 6 }}
          animate={{ y: "0%", rotate: 0, transition: { duration: 0.8, ease: OUT, delay: 0.05 + i * 0.035 } }}
          exit={{ y: "-110%", rotate: -4, transition: { duration: 0.5, ease: EASE, delay: i * 0.02 } }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

/**
 * Intro-style page transitions, played on every client navigation (links and
 * browser back/forward): curtains close, a greeting flickers, the page title
 * rises with a progress counter, then a molten seam flashes and the curtains part.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [info, setInfo] = useState({ title: "", kicker: "" });
  const [greet, setGreet] = useState(0);
  const [count, setCount] = useState(0);
  // back/forward: the new page is already on screen, so the curtains must snap shut
  const [instant, setInstant] = useState(false);
  const busy = useRef(false);
  const lastPath = useRef(pathname);
  const arrival = useRef<{ path: string; resolve: () => void } | null>(null);

  // greeting flicker + counter while the overlay is up
  useEffect(() => {
    if (phase !== "cover" && phase !== "hold") return;
    const start = performance.now();
    const id = setInterval(() => {
      const t = performance.now() - start;
      setGreet(Math.min(GREETINGS.length - 1, Math.floor(t / 110)));
      setCount((c) => Math.min(99, Math.max(c, Math.round((1 - Math.exp(-t / 450)) * 99))));
    }, 40);
    return () => clearInterval(id);
  }, [phase]);

  const settle = async () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    await wait(120);
    ScrollTrigger.refresh();
  };

  const reveal = async () => {
    setCount(100);
    await wait(180);
    setPhase("reveal");
    await wait(REVEAL_MS);
    setPhase("idle");
    busy.current = false;
  };

  // resolve a pending navigation once the new route has rendered; a path change
  // we didn't start (browser back/forward) still gets the intro, played over it
  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    if (arrival.current && arrival.current.path === pathname) {
      arrival.current.resolve();
      arrival.current = null;
      return;
    }
    if (busy.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    busy.current = true;
    setInfo(describe(pathname));
    setGreet(0);
    setCount(0);
    setInstant(true);
    setPhase("hold");
    void (async () => {
      await settle();
      await wait(MIN_HOLD_MS);
      await reveal();
    })();
  }, [pathname]);

  const navigate = useCallback(
    async (href: string) => {
      const path = pathOf(href);
      if (busy.current) return;
      if (path === pathname) {
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(0, { duration: 1.2 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }

      busy.current = true;
      setInfo(describe(path));
      setGreet(0);
      setCount(0);
      setInstant(false);
      setPhase("cover");
      const shownAt = performance.now();
      await wait(COVER_MS);
      setPhase("hold");

      // swap the route underneath
      const arrived = new Promise<void>((resolve) => (arrival.current = { path, resolve }));
      router.push(href, { scroll: false });
      await Promise.race([arrived, wait(5000)]);
      await settle();
      await wait(Math.max(0, COVER_MS + MIN_HOLD_MS - (performance.now() - shownAt)));
      await reveal();
    },
    [pathname, router]
  );

  const closed = phase === "cover" || phase === "hold";
  const curtain = (from: "top" | "bottom", color: string, delay: number) => (
    <motion.div
      className={`absolute inset-x-0 h-1/2 ${from === "top" ? "top-0" : "bottom-0"} ${color}`}
      initial={false}
      animate={{ y: closed ? "0%" : from === "top" ? "-100%" : "100%" }}
      transition={
        closed && instant
          ? { duration: 0 }
          : { duration: closed ? 0.6 : 0.95, ease: EASE, delay: closed ? delay : 0.12 + (0.1 - delay) }
      }
    />
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-[140] overflow-hidden ${phase === "idle" ? "pointer-events-none invisible" : "pointer-events-auto"}`}
      >
        {/* red leads, dark follows — a flash of colour on the way in and out */}
        {curtain("top", "bg-red", 0)}
        {curtain("bottom", "bg-red", 0)}
        {curtain("top", "bg-background", 0.08)}
        {curtain("bottom", "bg-background", 0.08)}

        {/* molten seam where the halves meet */}
        <motion.div
          className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-red to-transparent"
          initial={false}
          animate={phase === "reveal" ? { scaleX: [0, 1, 1], opacity: [0, 1, 0] } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.7, ease: OUT, times: [0, 0.4, 1] }}
        />

        <AnimatePresence>
          {phase === "hold" && (
            <motion.div
              key={info.title}
              className="absolute inset-0 flex flex-col justify-between px-6 py-8 md:px-12 md:py-10"
              exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.25 } }}
            >
              <div className="flex justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-muted">
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {info.kicker}
                </motion.span>
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-gold to-red" />
                  {GREETINGS[greet]}
                </motion.span>
              </div>

              <div className="flex flex-col items-center gap-5">
                <motion.span
                  className="font-mono text-[11px] tracking-[0.4em] uppercase text-ink/60"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: OUT } }}
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.3 } }}
                >
                  {info.kicker === "Case study" ? "Case study" : "Now entering"}
                </motion.span>
                <Title text={info.title} />
                <motion.span
                  className="h-px w-32 origin-center bg-gradient-to-r from-red to-gold"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1, transition: { duration: 0.8, ease: OUT, delay: 0.3 } }}
                  exit={{ scaleX: 0, transition: { duration: 0.3 } }}
                />
              </div>

              <div>
                <div className="mb-3 flex justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-muted">
                  <span>Sahil Thakur — Portfolio</span>
                  <span className="tabular-nums text-ink">{String(count).padStart(3, "0")}</span>
                </div>
                <div className="h-px w-full bg-line">
                  <div className="h-full bg-gradient-to-r from-red to-gold transition-[width] duration-150" style={{ width: `${count}%` }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TransitionContext.Provider>
  );
}
