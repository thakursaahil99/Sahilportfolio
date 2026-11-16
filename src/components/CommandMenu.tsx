"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { getLenis } from "@/lib/smooth-scroll";
import { useCopyEmail } from "@/lib/use-copy-email";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { NAV } from "@/data/nav";
import { usePageTransition } from "./transition/PageTransition";

const OPEN_EVENT = "portfolio:command";
const OUT = [0.16, 1, 0.3, 1] as const;

/** Open the palette from anywhere (e.g. the navbar search button). */
export const openCommandMenu = () => window.dispatchEvent(new Event(OPEN_EVENT));

type Item = {
  id: string;
  group: "Pages" | "Projects" | "Actions";
  label: string;
  hint: string;
  /** extra text matched by the search box */
  keywords: string;
  thumb?: string;
  run: () => void;
};

/**
 * Ctrl/⌘ + K palette: jump to any page or case study, or run a quick action.
 * Type to filter, ↑ ↓ to move, Enter to open, Esc to close.
 */
export default function CommandMenu() {
  const { navigate } = usePageTransition();
  const { copy } = useCopyEmail();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => navigate(href);
    const external = (href: string) => () => window.open(href, "_blank", "noopener,noreferrer");
    return [
      ...[...NAV, { label: "Résumé", href: "/resume" }].map<Item>((n) => ({
        id: n.href,
        group: "Pages",
        label: n.label,
        hint: n.href,
        keywords: n.label,
        run: go(n.href),
      })),
      ...projects.map<Item>((p) => ({
        id: `/work/${p.slug}`,
        group: "Projects",
        label: p.title,
        hint: `${p.category} · ${p.year}`,
        keywords: [p.title, p.tagline, p.category, ...(p.tags ?? p.stack.flatMap((s) => s.items))].join(" "),
        thumb: p.cover,
        run: go(`/work/${p.slug}`),
      })),
      { id: "copy-email", group: "Actions", label: "Copy email address", hint: profile.email, keywords: "email mail contact copy", run: copy },
      ...profile.socials.map<Item>((s) => ({
        id: s.href,
        group: "Actions",
        label: `Open ${s.label}`,
        hint: s.href.replace(/^https?:\/\//, ""),
        keywords: s.label,
        run: external(s.href),
      })),
    ];
  }, [navigate, copy]);

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return items;
    return items.filter((it) => {
      const hay = `${it.label} ${it.keywords}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [items, query]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setCursor(0);
  };

  // global shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  // while open: freeze the page behind and focus the search box
  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    const id = setTimeout(() => inputRef.current?.focus(), 40);
    return () => {
      clearTimeout(id);
      getLenis()?.start();
    };
  }, [open]);

  // keep the highlighted row in view
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${cursor}"]`)?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const choose = (item: Item | undefined) => {
    if (!item) return;
    close();
    item.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (results.length ? (c + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[cursor]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-no-print
          className="fixed inset-0 z-[140] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onKeyDown={onKeyDown}
        >
          <button aria-label="Close search" className="absolute inset-0 bg-background/70 backdrop-blur-md" onClick={close} />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search pages and projects"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: OUT }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-ink/15 bg-panel shadow-[0_60px_120px_-30px_rgba(0,0,0,0.95)]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red to-transparent" />

            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <circle cx="7" cy="7" r="4.6" />
                <path d="m10.6 10.6 3.4 3.4" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCursor(0);
                }}
                placeholder="Search projects, pages, tech…"
                aria-label="Search"
                style={{ outline: "none" }}
                className="w-full bg-transparent font-display text-base text-ink outline-none placeholder:text-muted md:text-lg"
              />
              <kbd className="shrink-0 rounded border border-ink/20 px-1.5 py-0.5 font-mono text-[10px] text-ink/60">Esc</kbd>
            </div>

            <ul ref={listRef} data-lenis-prevent className="max-h-[52vh] overflow-y-auto overscroll-contain p-2">
              {results.length === 0 && (
                <li className="px-4 py-10 text-center text-sm text-muted">Nothing matches “{query}”. Try a tech name like “Next.js”.</li>
              )}
              {results.map((it, i) => {
                const firstOfGroup = i === 0 || results[i - 1].group !== it.group;
                const on = i === cursor;
                return (
                  <li key={it.id}>
                    {firstOfGroup && <p className="px-3 pt-3 pb-1.5 font-mono text-[9px] tracking-[0.3em] uppercase text-muted">{it.group}</p>}
                    <button
                      data-index={i}
                      onPointerMove={() => setCursor(i)}
                      onClick={() => choose(it)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-150 ${
                        on ? "bg-ink/10" : ""
                      }`}
                    >
                      <span className="relative flex h-9 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-ink/10 bg-background font-mono text-[10px] text-ink/60">
                        {it.thumb ? (
                          <Image src={it.thumb} alt="" fill sizes="56px" className="object-cover object-top" />
                        ) : it.group === "Pages" ? (
                          "↗"
                        ) : (
                          "✦"
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-sm font-semibold text-ink">{it.label}</span>
                        <span className="block truncate font-mono text-[10px] tracking-[0.12em] text-muted">{it.hint}</span>
                      </span>
                      <span className={`font-mono text-[10px] tracking-[0.2em] uppercase transition-opacity ${on ? "text-gold opacity-100" : "opacity-0"}`}>
                        Enter ↵
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center justify-between border-t border-line px-5 py-3 font-mono text-[9px] tracking-[0.25em] uppercase text-muted">
              <span>↑ ↓ to move · Enter to open</span>
              <span>
                {results.length} result{results.length === 1 ? "" : "s"}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
