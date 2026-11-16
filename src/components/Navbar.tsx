"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useIntroDone } from "@/lib/use-intro";
import { getLenis } from "@/lib/smooth-scroll";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { NAV } from "@/data/nav";
import { openCommandMenu } from "./CommandMenu";
import LocalClock from "./fx/LocalClock";
import Logo from "./Logo";
import TLink from "./transition/TLink";

const EASE = [0.76, 0, 0.24, 1] as const;
const OUT = [0.16, 1, 0.3, 1] as const;
const SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/** Small counts shown next to menu entries, e.g. the number of projects. */
const BADGES: Record<string, string> = { "/work": String(projects.length).padStart(2, "0") };

/** Portrait chip with a live "available" dot. */
function Avatar({ className = "" }: { className?: string }) {
  return (
    <span className={`relative block shrink-0 ${className}`}>
      <span className="relative block h-full w-full overflow-hidden rounded-full border border-ink/25">
        <Image src={profile.avatar} alt="" fill sizes="44px" className="object-cover" />
      </span>
      <span className="absolute -right-0.5 -bottom-0.5 flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ddc84] opacity-70" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-background bg-[#3ddc84]" />
      </span>
    </span>
  );
}

/** Centre capsule: a pill slides under the hovered link and rests on the active page. */
function Capsule({ pathname }: { pathname: string }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <ul
      onPointerLeave={() => setHovered(null)}
      className="hidden items-center rounded-full border border-ink/10 bg-background/55 p-1.5 font-mono text-[11px] tracking-[0.22em] uppercase shadow-[0_18px_50px_-18px_rgba(0,0,0,0.9)] backdrop-blur-xl lg:flex"
    >
      {NAV.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href} onPointerEnter={() => setHovered(item.href)}>
            <TLink
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-2 transition-colors duration-300 lg:px-4 ${
                active ? "text-background" : "text-ink/75 hover:text-ink"
              }`}
            >
              {active && <motion.span layoutId="nav-active" transition={SPRING} className="absolute inset-0 rounded-full bg-ink" />}
              {!active && hovered === item.href && (
                <motion.span layoutId="nav-hover" transition={SPRING} className="absolute inset-0 rounded-full bg-ink/10" />
              )}
              <span className="relative">{item.label}</span>
              {BADGES[item.href] && (
                <span className={`relative text-[9px] tracking-normal ${active ? "text-red" : "text-gold"}`}>{BADGES[item.href]}</span>
              )}
            </TLink>
          </li>
        );
      })}
    </ul>
  );
}

export default function Navbar() {
  const intro = useIntroDone();
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 200);
    setScrolled(y > 60);
  });

  // close the menu after navigating
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  // lock page scroll while the mobile menu is open
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    getLenis()?.stop();
    return () => {
      document.documentElement.style.overflow = "";
      getLenis()?.start();
    };
  }, [open]);

  return (
    <>
      <motion.header
        data-no-print
        initial={{ y: -110 }}
        animate={{ y: !intro || (hidden && !open) ? -110 : 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: intro && !hidden ? 0.3 : 0 }}
        className="fixed inset-x-0 top-0 z-[120] px-4 py-3.5 md:px-8 md:py-4"
      >
        {/* soft scrim so the bar stays readable over any section once the page has moved */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background/85 to-transparent transition-opacity duration-500 ${
            scrolled && !open ? "opacity-100" : "opacity-0"
          }`}
        />

        <nav className="relative flex items-center justify-between gap-4 text-ink">
          <TLink href="/" onClick={() => setOpen(false)} className="group flex items-center gap-3" aria-label="Home">
            <Avatar className="h-9 w-9 transition-transform duration-500 group-hover:scale-110 md:h-10 md:w-10" />
            <span className="flex flex-col gap-1">
              <Logo className="text-[15px] sm:text-lg xl:text-xl" />
              <span
                className={`hidden font-mono text-[9px] tracking-[0.25em] uppercase text-ink/60 transition-opacity duration-500 lg:block ${
                  scrolled ? "opacity-0" : "opacity-100"
                }`}
              >
                {profile.role}
              </span>
            </span>
          </TLink>

          <Capsule pathname={pathname} />

          <div className="hidden items-center gap-2.5 font-mono text-[10px] tracking-[0.22em] uppercase lg:flex">
            <span className="mr-2 hidden items-center gap-2 text-ink/70 2xl:flex">
              <LocalClock />
            </span>
            <button
              onClick={openCommandMenu}
              aria-label="Search pages and projects"
              className="hidden items-center gap-2 rounded-full border border-ink/15 bg-background/55 px-3.5 py-2.5 text-ink/75 backdrop-blur-xl transition-colors duration-300 hover:border-ink/40 hover:text-ink xl:flex"
            >
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <circle cx="7" cy="7" r="4.6" />
                <path d="m10.6 10.6 3.4 3.4" strokeLinecap="round" />
              </svg>
              Search
              <kbd className="rounded border border-ink/20 px-1 py-px font-mono text-[9px] tracking-normal text-ink/60">Ctrl K</kbd>
            </button>
            <TLink
              href="/resume"
              className="hidden rounded-full border border-ink/15 bg-background/55 px-4 py-2.5 text-ink/80 backdrop-blur-xl transition-colors duration-300 hover:border-gold hover:text-gold xl:block"
            >
              Résumé
            </TLink>
            <TLink
              href="/contact"
              className="group relative overflow-hidden rounded-full bg-ink px-4 py-2.5 font-semibold text-background"
            >
              <span className="absolute inset-0 translate-y-full rounded-full bg-red transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />
              <span className="relative transition-colors duration-500 group-hover:text-ink">Let&apos;s talk ↗</span>
            </TLink>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-full border border-ink/15 bg-background/55 px-4 py-2.5 font-mono text-[11px] tracking-[0.22em] uppercase backdrop-blur-xl lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="relative block h-2.5 w-4" aria-hidden="true">
              <span className={`absolute left-0 h-px w-full bg-ink transition-all duration-500 ${open ? "top-1/2 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-full bg-ink transition-all duration-500 ${open ? "top-1/2 -rotate-45" : "bottom-0"}`} />
            </span>
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </motion.header>

      {/* mobile full-screen menu — opens as a circle growing out of the menu button */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 3.5rem) 2.4rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 3.5rem) 2.4rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 3.5rem) 2.4rem)" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="fixed inset-0 z-[110] flex flex-col justify-between overflow-hidden bg-panel px-6 pt-24 pb-8 lg:hidden"
          >
            <div className="pointer-events-none absolute -right-1/3 -top-1/4 h-[70vh] w-[70vh] bg-[radial-gradient(closest-side,rgb(255_45_32/0.28),transparent)]" />
            <div className="pointer-events-none absolute -bottom-1/4 -left-1/3 h-[60vh] w-[60vh] bg-[radial-gradient(closest-side,rgb(255_181_71/0.14),transparent)]" />

            <ul className="relative">
              {NAV.map((item, i) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href} className="overflow-hidden border-b border-line">
                    <motion.div
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.7, ease: OUT, delay: 0.25 + i * 0.06 }}
                    >
                      <TLink
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-baseline gap-4 py-3 font-display text-[min(10.5vw,3.6rem)] font-black uppercase leading-none tracking-[-0.04em] ${
                          active ? "text-molten" : "text-ink"
                        }`}
                      >
                        <span className="w-6 font-mono text-[10px] font-normal tracking-[0.2em] text-muted">0{i + 1}</span>
                        {item.label}
                        {BADGES[item.href] && (
                          <span className="font-mono text-[10px] font-normal tracking-[0.2em] text-gold">({BADGES[item.href]})</span>
                        )}
                        <span className="ml-auto self-center text-xl text-ink/40">→</span>
                      </TLink>
                    </motion.div>
                  </li>
                );
              })}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: OUT, delay: 0.6 }}
              className="relative space-y-6"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14" />
                <div className="min-w-0">
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-gold">{profile.status}</p>
                  <a href={`mailto:${profile.email}`} className="mt-1 block truncate text-sm text-ink/80">
                    {profile.email}
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <TLink
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full bg-red px-5 py-3.5 text-center font-mono text-[11px] font-semibold tracking-[0.25em] uppercase text-ink"
                >
                  Start a project
                </TLink>
                <TLink
                  href="/resume"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-ink/25 px-5 py-3.5 font-mono text-[11px] tracking-[0.25em] uppercase"
                >
                  Résumé ↗
                </TLink>
              </div>
              <div className="flex justify-between font-mono text-[10px] tracking-[0.25em] uppercase text-muted">
                <span>{profile.location.split(",")[0]}, IN</span>
                <LocalClock />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
