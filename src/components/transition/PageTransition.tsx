"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { stagger, useAnimate } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/lib/smooth-scroll";
import { getProject } from "@/data/projects";

const COLUMNS = 5;
const EASE = [0.76, 0, 0.24, 1] as const;

type Ctx = { navigate: (href: string) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

const pathOf = (href: string) => href.split(/[?#]/)[0] || "/";

function labelFor(path: string) {
  if (path === "/") return "Home";
  if (path.startsWith("/work/")) return getProject(path.slice(6))?.title ?? "Work";
  const seg = path.slice(1);
  return seg.charAt(0).toUpperCase() + seg.slice(1);
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Curtain page transitions: columns wipe up to cover the page, the route
 * changes underneath, then the columns wipe away to reveal the new page.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [scope, animate] = useAnimate();
  const [label, setLabel] = useState("");
  const [blocking, setBlocking] = useState(false);
  const busy = useRef(false);
  const arrival = useRef<{ path: string; resolve: () => void } | null>(null);

  // resolve the pending navigation once the new route has rendered
  useEffect(() => {
    if (arrival.current && arrival.current.path === pathname) {
      arrival.current.resolve();
      arrival.current = null;
    }
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
      setLabel(labelFor(path));
      setBlocking(true);

      // cover
      await animate(".t-col", { originY: 1 }, { duration: 0 });
      animate(".t-red", { scaleY: [0, 1] }, { duration: 0.55, ease: EASE, delay: stagger(0.05) });
      await animate(".t-dark", { scaleY: [0, 1] }, { duration: 0.55, ease: EASE, delay: stagger(0.05, { startDelay: 0.12 }) });
      animate(".t-label", { opacity: [0, 1], y: [40, 0] }, { duration: 0.45, ease: [0.16, 1, 0.3, 1] });

      // swap route underneath
      const arrived = new Promise<void>((resolve) => (arrival.current = { path, resolve }));
      router.push(href, { scroll: false });
      await Promise.race([arrived, wait(5000)]);
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
      await wait(350);
      ScrollTrigger.refresh();

      // reveal
      await animate(".t-label", { opacity: 0, y: -40 }, { duration: 0.3, ease: EASE });
      await animate(".t-col", { originY: 0 }, { duration: 0 });
      animate(".t-dark", { scaleY: 0 }, { duration: 0.6, ease: EASE, delay: stagger(0.05) });
      await animate(".t-red", { scaleY: 0 }, { duration: 0.6, ease: EASE, delay: stagger(0.05, { startDelay: 0.1 }) });

      setBlocking(false);
      busy.current = false;
    },
    [animate, pathname, router]
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={scope}
        aria-hidden="true"
        className={`fixed inset-0 z-[140] ${blocking ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div className="absolute inset-0 flex">
          {Array.from({ length: COLUMNS }, (_, i) => (
            // initial scale via inline transform: Tailwind's scale-y-0 uses the CSS `scale`
            // property, which would stack with Framer's transform and keep columns invisible
            <div key={i} className="t-col t-red h-full flex-1 bg-red" style={{ marginLeft: i ? -1 : 0, transform: "scaleY(0)" }} />
          ))}
        </div>
        <div className="absolute inset-0 flex">
          {Array.from({ length: COLUMNS }, (_, i) => (
            <div key={i} className="t-col t-dark h-full flex-1 bg-background" style={{ marginLeft: i ? -1 : 0, transform: "scaleY(0)" }} />
          ))}
        </div>
        <div className="t-label absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0">
          <span className="font-mono text-[11px] tracking-[0.35em] uppercase text-muted">Loading</span>
          <span className="px-6 text-center font-display text-[10vw] md:text-[5vw] font-black uppercase leading-none tracking-[-0.04em] text-ink">
            {label}
          </span>
          <span className="h-px w-24 bg-gradient-to-r from-red to-gold" />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
