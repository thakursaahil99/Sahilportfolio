"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useIntroDone } from "@/lib/use-intro";
import { profile } from "@/data/profile";
import LocalClock from "./fx/LocalClock";
import TLink from "./transition/TLink";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const EASE = [0.76, 0, 0.24, 1] as const;

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/** Link whose label rolls up to reveal a duplicate on hover. */
function RollLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <TLink href={href} className="group relative flex items-center gap-2">
      <span
        className={`h-1.5 w-1.5 rounded-full bg-ink transition-transform duration-500 ${active ? "scale-100" : "scale-0"}`}
      />
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
          {label}
        </span>
        <span className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0">
          {label}
        </span>
      </span>
    </TLink>
  );
}

export default function Navbar() {
  const intro = useIntroDone();
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 200);
  });

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: !intro || (hidden && !open) ? -100 : 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: intro && !hidden ? 0.3 : 0 }}
        className="fixed inset-x-0 top-0 z-[120] px-6 py-5 md:px-12 mix-blend-difference"
      >
        <nav className="flex items-center justify-between text-ink">
          <TLink href="/" className="flex items-baseline gap-3" aria-label="Home">
            <span className="font-display text-xl font-black tracking-tight">S/T</span>
            <span className="hidden sm:block font-mono text-[10px] tracking-[0.25em] uppercase opacity-70">
              {profile.name} ©{new Date().getFullYear()}
            </span>
          </TLink>

          <ul className="hidden md:flex items-center gap-9 font-mono text-[11px] tracking-[0.25em] uppercase">
            {NAV.map((item) => (
              <li key={item.href}>
                <RollLink label={item.label} href={item.href} active={isActive(pathname, item.href)} />
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] uppercase">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ink" />
            </span>
            <LocalClock />
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden font-mono text-[11px] tracking-[0.25em] uppercase"
            aria-expanded={open}
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </motion.header>

      {/* mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 92% 4%)" }}
            animate={{ clipPath: "circle(150% at 92% 4%)" }}
            exit={{ clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="fixed inset-0 z-[110] flex flex-col justify-between bg-red px-6 pt-28 pb-10 md:hidden"
          >
            <ul className="space-y-2">
              {NAV.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.06 }}
                  >
                    <TLink
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 font-display text-4xl font-black uppercase tracking-tight text-background"
                    >
                      <span className="font-mono text-xs font-normal">0{i + 1}</span>
                      {item.label}
                    </TLink>
                  </motion.div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-mono text-[10px] tracking-[0.25em] uppercase text-background">
              <span>{profile.location.split(",")[0]}</span>
              <LocalClock />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
