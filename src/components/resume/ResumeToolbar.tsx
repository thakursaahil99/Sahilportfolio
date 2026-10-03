"use client";

import { motion } from "framer-motion";
import TLink from "../transition/TLink";

const OUT = [0.16, 1, 0.3, 1] as const;

/** Actions above the résumé — hidden when printing. */
export default function ResumeToolbar() {
  return (
    <motion.div
      data-no-print
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: OUT, delay: 0.2 }}
      className="mx-auto mb-8 flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="eyebrow">[ Résumé ]</p>
        <p className="mt-2 text-sm text-ink/60">One page, ATS-friendly. Save it as PDF from the print dialog.</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => window.print()}
          className="group relative overflow-hidden rounded-full bg-red px-6 py-3.5 font-mono text-[11px] font-semibold tracking-[0.25em] uppercase text-ink"
        >
          <span className="absolute inset-0 translate-y-full rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />
          <span className="relative transition-colors duration-500 group-hover:text-background">Download PDF ↓</span>
        </button>
        <TLink
          href="/contact"
          className="inline-flex items-center rounded-full border border-ink/30 px-6 py-3.5 font-mono text-[11px] tracking-[0.25em] uppercase text-ink transition-colors hover:border-gold hover:text-gold"
        >
          Contact
        </TLink>
      </div>
    </motion.div>
  );
}
