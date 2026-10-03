"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionTag from "../SectionTag";
import RevealText from "../fx/RevealText";

const EASE = [0.76, 0, 0.24, 1] as const;

const QA = [
  {
    q: "What kind of projects do you take on?",
    a: "Web apps and platforms, eCommerce stores (especially Magento 2), AI-powered features and motion-heavy marketing sites. If it lives in a browser, it's probably a fit.",
  },
  {
    q: "How long does a project take?",
    a: "It depends on scope. A focused marketing site moves much faster than a full platform. After the first call you get a timeline with clear milestones.",
  },
  {
    q: "Can you work on my existing site or store?",
    a: "Yes — redesigns, performance work, new features and Magento storefront rebuilds on top of an existing setup are all regular work.",
  },
  {
    q: "Which stack will you use?",
    a: "Usually Next.js, React and TypeScript on the front, with Node.js, Laravel or Magento on the back — but the stack follows the project, not the other way round.",
  },
  {
    q: "What happens after launch?",
    a: "Deployment, analytics and SEO basics are part of launch. After that I can stay on for fixes, improvements and new features.",
  },
];

export default function Faq({ index = "05" }: { index?: string }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative px-6 pt-28 md:px-12 md:pt-40">
      <SectionTag index={index} label="FAQ — Good questions" />
      <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
        <RevealText
          as="h2"
          text="Before we start."
          className="block font-display text-[11vw] font-black uppercase leading-[0.9] tracking-[-0.04em] md:text-[4.5vw]"
        />
        <ul className="border-t border-line">
          {QA.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className="border-b border-line">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-8"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-[11px] text-red">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-lg font-semibold tracking-tight transition-colors group-hover:text-gold md:text-2xl">
                      {item.q}
                    </span>
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0, backgroundColor: isOpen ? "var(--red)" : "rgba(0,0,0,0)" }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/25 text-xl"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-8 pl-9 text-sm leading-relaxed text-ink/70 md:text-base">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
