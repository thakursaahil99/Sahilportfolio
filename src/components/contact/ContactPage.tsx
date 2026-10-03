"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { profile } from "@/data/profile";
import RevealText from "../fx/RevealText";
import Magnetic from "../fx/Magnetic";
import LocalClock from "../fx/LocalClock";
import SpotlightCard from "../fx/SpotlightCard";
import Image from "next/image";

const EASE = [0.16, 1, 0.3, 1] as const;
const TYPES = ["Web app", "eCommerce", "AI integration", "Motion / 3D site", "Something else"];
const BUDGETS = ["< ₹50k", "₹50k – 2L", "₹2L – 5L", "₹5L +"];
const STEPS = [
  { title: "Brief", body: "You send the form — goals, scope, timeline and budget." },
  { title: "Discovery call", body: "A short call to dig into the problem and agree on what success looks like." },
  { title: "Proposal", body: "A clear plan with milestones, stack and a fixed quote — no surprises." },
  { title: "Build & launch", body: "Weekly demos while I build, then a smooth launch and handover." },
];

const FAQ = [
  {
    q: "What kind of projects do you take on?",
    a: "Full-stack web apps and platforms, Magento and multi-vendor eCommerce, AI features like assistants and RAG search, and high-end animated marketing sites.",
  },
  {
    q: "How fast can you start?",
    a: "Usually within a week or two. Small landing pages can start in days; platforms get a short discovery call first so the scope is clear.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes — I work remotely from Bir, India (IST) and overlap comfortably with Europe, the Middle East and Asia.",
  },
  {
    q: "Can you take over an existing codebase?",
    a: "Absolutely. I regularly audit, fix and extend Next.js, React, Node.js, Laravel and Magento 2 projects.",
  },
];

function Field({
  label,
  name,
  type = "text",
  textarea = false,
  value,
  onChange,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <label className="group relative block pt-6">
      <Tag
        name={name}
        type={textarea ? undefined : type}
        value={value}
        rows={textarea ? 4 : undefined}
        placeholder=" "
        onChange={(e) => onChange(e.target.value)}
        className="peer block w-full resize-none border-b border-line bg-transparent pb-3 font-display text-lg md:text-xl text-ink outline-none placeholder-transparent"
      />
      <span className="pointer-events-none absolute left-0 top-6 font-display text-lg md:text-xl text-muted transition-all duration-300 peer-focus:top-0 peer-focus:font-mono peer-focus:text-[11px] peer-focus:tracking-[0.25em] peer-focus:uppercase peer-focus:text-gold peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:font-mono peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:tracking-[0.25em] peer-[:not(:placeholder-shown)]:uppercase">
        {label}
      </span>
      {/* underline that fills on focus */}
      <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-red to-gold transition-transform duration-500 peer-focus:scale-x-100" />
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute right-0 top-0 font-mono text-[10px] tracking-[0.2em] uppercase text-red"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}

function Chips({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = selected.includes(o);
        return (
          <motion.button
            key={o}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => onToggle(o)}
            className={`rounded-full border px-4 py-2 font-mono text-[11px] tracking-[0.15em] uppercase transition-colors duration-300 ${
              on ? "border-ink bg-ink text-background" : "border-line text-ink/70 hover:border-ink/40 hover:text-ink"
            }`}
          >
            {on ? "✓ " : "+ "}
            {o}
          </motion.button>
        );
      })}
    </div>
  );
}

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="border-b border-line">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-6 py-6 text-left" aria-expanded={open}>
        <span className="flex items-baseline gap-5">
          <span className="font-mono text-[11px] text-muted">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-lg md:text-xl">{q}</span>
        </span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.4, ease: EASE }} className="text-2xl text-gold">
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 pl-10 text-muted leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [types, setTypes] = useState<string[]>([]);
  const [budget, setBudget] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const [scope, animate] = useAnimate();

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Valid email please";
    if (form.message.trim().length < 10) next.message = "Tell me a bit more";
    setErrors(next);
    if (Object.keys(next).length) {
      animate(scope.current, { x: [0, -12, 10, -8, 6, 0] }, { duration: 0.5 });
      return;
    }

    const subject = `New project enquiry — ${form.name}${form.company ? ` (${form.company})` : ""}`;
    const details = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.company ? `Company: ${form.company}` : null,
      types.length ? `Project type: ${types.join(", ")}` : null,
      budget.length ? `Budget: ${budget[0]}` : null,
    ].filter(Boolean);
    const body = `${details.join("\n")}\n\n${form.message}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section className="relative overflow-hidden px-6 pt-32 md:px-12 md:pt-40">
      <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] bg-[radial-gradient(closest-side,rgb(255_45_32/0.2),transparent)]" />

      {/* ---------- hero ---------- */}
      <div className="relative grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow mb-6">[ Contact ]</p>
          <h1 className="font-display font-black uppercase leading-[0.86] tracking-[-0.05em] text-[15vw] md:text-[7vw]">
            <RevealText text="Let's" split="chars" className="block" stagger={0.05} />
            <RevealText text="talk." split="chars" className="block text-molten" delay={0.25} stagger={0.05} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: EASE }}
            className="mt-8 max-w-md text-base md:text-lg leading-relaxed text-muted"
          >
            Got a platform, a storefront or a wild idea? Tell me about it — I read every message myself and reply within 24
            hours.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.65, ease: EASE }}
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#3ddc84]/40 px-4 py-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ddc84] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3ddc84]" />
            </span>
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#3ddc84]">{profile.status}</span>
          </motion.div>
        </div>

        {/* location card */}
        <motion.div
          initial={{ clipPath: "inset(0% 0% 100% 0% round 28px)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0% round 28px)" }}
          transition={{ duration: 1.3, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
          className="group relative h-[340px] overflow-hidden rounded-[28px] md:h-[420px]"
        >
          <Image
            src="/about/glide-snow.jpg"
            alt="Paraglider above snowy peaks"
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            loading="eager"
            className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-background/30" />
          <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow text-ink/70">Currently in</p>
                <p className="mt-1 font-display text-xl md:text-2xl font-black uppercase">Bir Billing, IN</p>
              </div>
              <svg viewBox="0 0 100 100" className="h-20 w-20 animate-spin-slow md:h-24 md:w-24" aria-hidden="true">
                <defs>
                  <path id="open-ring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <text className="fill-ink font-mono text-[9px] uppercase">
                  <textPath href="#open-ring" textLength={2 * Math.PI * 38 - 4} lengthAdjust="spacing">
                    Open for projects • Open for projects •
                  </textPath>
                </text>
                <circle cx="50" cy="50" r="6" className="fill-gold" />
              </svg>
            </div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-ink/70">Local time</p>
                <p className="mt-1 whitespace-nowrap font-display text-2xl sm:text-3xl md:text-4xl font-black tabular-nums">
                  <LocalClock />
                </p>
              </div>
              <p className="font-mono text-[10px] tracking-[0.2em] text-ink/70">{profile.coordinates}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ---------- channels ---------- */}
      <div className="relative mt-14 grid gap-3 [perspective:1400px] sm:grid-cols-2 lg:grid-cols-4">
        {[
          { glyph: "@", label: "Email", value: copied ? "Copied ✓" : "Click to copy", onClick: copyEmail, cursor: "Copy" },
          ...profile.socials.map((s) => ({ glyph: s.label === "GitHub" ? "</>" : "in", label: s.label, value: "Open profile ↗", href: s.href, cursor: "Open" })),
          { glyph: "⚡", label: "Response time", value: "Within 24 hours", cursor: undefined },
        ].map((c, i) => {
          const body = (
            <SpotlightCard className="flex h-full items-center gap-4 p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink/15 font-mono text-sm text-gold">
                {c.glyph}
              </span>
              <span className="min-w-0 text-left">
                <span className="eyebrow block">{c.label}</span>
                <span className={`mt-1 block truncate text-sm ${c.label === "Email" && copied ? "text-[#3ddc84]" : "text-ink"}`}>
                  {c.value}
                </span>
              </span>
            </SpotlightCard>
          );
          return (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 + i * 0.08, ease: EASE }}
            >
              {"href" in c && c.href ? (
                <a href={c.href} target="_blank" rel="noreferrer" data-cursor-label={c.cursor} className="block h-full">
                  {body}
                </a>
              ) : "onClick" in c && c.onClick ? (
                <button onClick={c.onClick} data-cursor-label={c.cursor} className="block h-full w-full">
                  {body}
                </button>
              ) : (
                body
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ---------- form + process ---------- */}
      <div className="relative mt-20 grid gap-10 pb-24 md:mt-28 lg:grid-cols-[1.55fr_1fr] lg:gap-16 md:pb-32">
        <motion.form
          ref={scope}
          onSubmit={submit}
          noValidate
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1, ease: EASE }}
          className="relative space-y-9 overflow-hidden rounded-3xl border border-line bg-panel/60 p-6 md:p-10"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 bg-[radial-gradient(closest-side,rgb(255_45_32/0.15),transparent)]" />
          <div className="relative flex items-end justify-between border-b border-line pb-6">
            <div>
              <p className="eyebrow mb-2">[ Project brief ]</p>
              <h2 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tight">Tell me what you need</h2>
            </div>
            <span className="hidden font-mono text-[10px] tracking-[0.2em] uppercase text-muted sm:block">~ 2 minutes</span>
          </div>

          <div className="relative grid gap-9 md:grid-cols-2">
            <Field label="Your name" name="name" value={form.name} onChange={set("name")} error={errors.name} />
            <Field label="Email address" name="email" type="email" value={form.email} onChange={set("email")} error={errors.email} />
          </div>
          <Field label="Company (optional)" name="company" value={form.company} onChange={set("company")} />

          <div className="relative">
            <p className="eyebrow mb-4">I need help with</p>
            <Chips
              options={TYPES}
              selected={types}
              onToggle={(v) => setTypes((t) => (t.includes(v) ? t.filter((x) => x !== v) : [...t, v]))}
            />
          </div>
          <div className="relative">
            <p className="eyebrow mb-4">Budget</p>
            <Chips options={BUDGETS} selected={budget} onToggle={(v) => setBudget((b) => (b[0] === v ? [] : [v]))} />
          </div>

          <Field label="Tell me about your project" name="message" textarea value={form.message} onChange={set("message")} error={errors.message} />

          <div className="relative flex flex-wrap items-center gap-6 pt-2">
            <Magnetic>
              <button
                type="submit"
                className="group relative overflow-hidden rounded-full bg-red px-9 py-4 font-mono text-[11px] font-semibold tracking-[0.25em] uppercase text-ink"
                data-cursor-label="Send"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />
                <span className="relative transition-colors duration-500 group-hover:text-background">Send brief →</span>
              </button>
            </Magnetic>
            <AnimatePresence>
              {sent && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#3ddc84]"
                >
                  ✓ Opening your mail app with the brief
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.form>

        {/* what happens next */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow mb-3">[ What happens next ]</p>
          <h2 className="mb-8 font-display text-2xl font-black uppercase tracking-tight">From brief to launch</h2>
          <ol className="relative space-y-7 border-l border-line pl-8">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                className="relative"
              >
                <span className="absolute -left-[45px] top-0 flex h-7 w-7 items-center justify-center rounded-full border border-gold/60 bg-background font-mono text-[10px] text-gold">
                  {i + 1}
                </span>
                <p className="font-display text-base font-black uppercase tracking-tight">{s.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
              </motion.li>
            ))}
          </ol>
          <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-2xl border border-line">
            <Image src="/projects/glide-in-bir.jpg" alt="Glide in Bir — a recent launch" fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
            <p className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.2em] uppercase text-ink/90">
              Recent launch — Glide in Bir
            </p>
          </div>
        </aside>
      </div>

      {/* ---------- faq ---------- */}
      <div className="relative grid gap-10 border-t border-line py-24 md:grid-cols-[260px_1fr] md:gap-16 md:py-32">
        <div>
          <p className="eyebrow mb-3">[ FAQ ]</p>
          <h2 className="font-display text-2xl font-black uppercase tracking-tight">Good questions</h2>
        </div>
        <ul className="border-t border-line">
          {FAQ.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
