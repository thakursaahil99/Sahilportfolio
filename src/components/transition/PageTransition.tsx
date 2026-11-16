"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/lib/smooth-scroll";
import { getPerfTier } from "@/lib/perf";
import { getProject } from "@/data/projects";
import { NAV } from "@/data/nav";

/**
 * Page transitions, played on every client navigation (links and browser
 * back/forward): a molten layer and a dark panel slide up over the page, the
 * next page's title rises on the panel, then both carry on upward and uncover
 * the new page.
 *
 * Kept deliberately light so it never stutters on phones or older laptops:
 * - the motion is two CSS transforms (see `.pt-*` in globals.css) — no
 *   JavaScript runs per frame and nothing re-renders while it plays;
 * - React state changes three times per navigation (in → out → idle);
 * - the context value is stable, so the links on the page don't re-render;
 * - low-power devices get shorter timings and a single layer.
 */

type Phase = "idle" | "in" | "out";
type Info = { title: string; kicker: string; label: string; path: string; thumb?: string };
type Ctx = { navigate: (href: string) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

const FULL = { cover: 600, read: 820, reveal: 700 }; // ms: layers up · title readable · layers away
const LITE = { cover: 420, read: 620, reveal: 500 };
const CSS_IN = { full: 520, lite: 350 }; // transform durations behind `cover` (the panel starts 70ms late)
const CSS_OUT = { full: 620, lite: 430 };

const pathOf = (href: string) => href.split(/[?#]/)[0] || "/";
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const pad = (n: number) => String(n).padStart(2, "0");

function describe(path: string): Info {
  const i = NAV.findIndex((n) => n.href === path);
  if (i >= 0) return { title: NAV[i].label, kicker: `${pad(i + 1)} / ${pad(NAV.length)}`, label: "Now entering", path };
  if (path.startsWith("/work/")) {
    const project = getProject(path.slice(6));
    return { title: project?.title ?? "Work", kicker: project?.category ?? "Case study", label: "Case study", path, thumb: project?.cover };
  }
  const seg = path.slice(1);
  return { title: seg.charAt(0).toUpperCase() + seg.slice(1) || "Home", kicker: "Loading", label: "Now entering", path };
}

/** Font size that keeps the title on one line: Unbounded Black is ~0.8em per glyph at this tracking. */
function titleSize(text: string) {
  const fit = 80 / (Math.max(1, text.length) * 0.8);
  return { "--fs-m": `${Math.min(17, fit).toFixed(2)}vw`, "--fs-d": `${Math.min(12, fit).toFixed(2)}vw` } as CSSProperties;
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [info, setInfo] = useState<Info>({ title: "", kicker: "", label: "", path: "" });
  // back/forward: the new page is already on screen, so the layers must snap shut
  const [instant, setInstant] = useState(false);
  const [lite, setLite] = useState(false);
  const busy = useRef(false);
  const lastPath = useRef(pathname);
  const arrival = useRef<{ path: string; resolve: () => void } | null>(null);

  /** Timings for this device, read when a transition starts. */
  const timings = () => {
    const isLite = getPerfTier() === "lite";
    setLite(isLite);
    return isLite ? LITE : FULL;
  };

  const settle = async () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    await wait(60);
    ScrollTrigger.refresh();
  };

  const reveal = async (ms: number) => {
    setPhase("out");
    await wait(ms);
    setPhase("idle");
    busy.current = false;
  };

  // resolve a pending navigation once the new route has rendered; a path change
  // we didn't start (browser back/forward) still gets the title card, played over it
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
    void (async () => {
      await wait(0); // let the route change commit before we draw over it
      const t = timings();
      setInfo(describe(pathname));
      setInstant(true);
      setPhase("in");
      await settle();
      await wait(t.read - 200);
      await reveal(t.reveal);
    })();
  }, [pathname]);

  const navigate = useCallback(
    async (href: string) => {
      const path = pathOf(href);
      if (busy.current) return;
      if (path === pathname) {
        // same page with a different query (e.g. /contact?type=…) still needs the URL updated
        if (href !== path) router.replace(href, { scroll: false });
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
      const t = timings();
      setInfo(describe(path));
      setInstant(false);
      setPhase("in");
      const shownAt = performance.now();
      await wait(t.cover);

      // swap the route underneath, hidden by the panel
      const arrived = new Promise<void>((resolve) => (arrival.current = { path, resolve }));
      router.push(href, { scroll: false });
      await Promise.race([arrived, wait(5000)]);
      await settle();
      // hold only as long as the title needs to be read
      await wait(Math.max(0, t.read - (performance.now() - shownAt)));
      await reveal(t.reveal);
    },
    [pathname, router]
  );

  // stable value: a transition must not re-render every link on the page
  const ctx = useMemo(() => ({ navigate }), [navigate]);

  const vars = {
    "--pt-in": `${lite ? CSS_IN.lite : CSS_IN.full}ms`,
    "--pt-out": `${lite ? CSS_OUT.lite : CSS_OUT.full}ms`,
  } as CSSProperties;

  return (
    <TransitionContext.Provider value={ctx}>
      {children}
      <div aria-hidden="true" className="pt-root" data-phase={phase} data-instant={instant} style={vars}>
        {/* molten layer: first in, last out */}
        <div className="pt-layer pt-accent bg-gradient-to-r from-red via-gold to-red" />

        <div className="pt-layer pt-panel flex flex-col justify-between bg-background px-6 py-8 md:px-12 md:py-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red to-transparent" />

          <div className="pt-fade flex justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-muted">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-gold to-red" />
              {info.kicker}
            </span>
            <span className="max-w-[55%] truncate normal-case tracking-[0.15em]">{info.path}</span>
          </div>

          <div className="flex flex-col items-center gap-5">
            {info.thumb && (
              <span className="block overflow-hidden rounded-xl">
                <span className="pt-rise relative block aspect-[16/10] w-40 -rotate-2 overflow-hidden rounded-xl border border-ink/15 md:w-56">
                  <Image src={info.thumb} alt="" fill sizes="224px" className="object-cover object-top" />
                </span>
              </span>
            )}
            <span className="pt-fade font-mono text-[11px] tracking-[0.4em] uppercase text-ink/60">{info.label}</span>
            {/* the title rises out of a mask as one piece — one transform, however long the name */}
            <span className="block overflow-hidden pb-[0.06em]">
              <span
                style={titleSize(info.title)}
                className="pt-rise block whitespace-nowrap font-display text-[length:var(--fs-m)] font-black uppercase leading-[0.9] tracking-[-0.05em] md:text-[length:var(--fs-d)]"
              >
                {info.title}
              </span>
            </span>
            <span className="pt-fade h-px w-32 bg-gradient-to-r from-red to-gold" />
          </div>

          <div className="pt-fade flex justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-muted">
            <span>Sahil Thakur — Portfolio</span>
            <span className="text-ink/70">{new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
