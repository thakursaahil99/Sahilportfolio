"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { profile } from "@/data/profile";
import RevealText from "../fx/RevealText";
import Magnetic from "../fx/Magnetic";
import LocalClock from "../fx/LocalClock";

const EASE = [0.16, 1, 0.3, 1] as const;
const TYPES = ["Web app", "eCommerce", "AI integration", "Motion / 3D site", "Something else"];
const BUDGETS = ["< ₹50k", "₹50k – 2L", "₹2L – 5L", "₹5L +"];
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
        className="peer block w-full resize-none border-b border-line bg-transparent pb-3 font-display text-xl md:text-2xl text-ink outline-none placeholder-transparent"
      />
      <span className="pointer-events-none absolute left-0 top-6 font-display text-xl md:text-2xl text-muted transition-all duration-300 peer-focus:top-0 peer-focus:font-mono peer-focus:text-[11px] peer-focus:tracking-[0.25em] peer-focus:uppercase peer-focus:text-gold peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:font-mono peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:tracking-[0.25em] peer-[:not(:placeholder-shown)]:uppercase">
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
    <section className="relative overflow-hidden px-6 pt-36 md:px-12 md:pt-44">
      <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-red/20 blur-[140px]" />

      <p className="eyebrow relative mb-6">[ Contact ]</p>
      <h1 className="relative font-display font-black uppercase leading-[0.85] tracking-[-0.05em] text-[15vw] md:text-[8vw]">
        <RevealText text="Let's" split="chars" className="block" stagger={0.05} />
        <RevealText text="talk." split="chars" className="block text-molten" delay={0.25} stagger={0.05} />
      </h1>

      <div className="relative mt-20 grid gap-20 pb-28 md:mt-28 lg:grid-cols-[1.5fr_1fr] lg:gap-24 md:pb-40">
        {/* form */}
        <motion.form
          ref={scope}
          onSubmit={submit}
          noValidate
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: EASE }}
          className="space-y-10"
        >
          <div className="grid gap-10 md:grid-cols-2">
            <Field label="Your name" name="name" value={form.name} onChange={set("name")} error={errors.name} />
            <Field label="Email address" name="email" type="email" value={form.email} onChange={set("email")} error={errors.email} />
          </div>
          <Field label="Company (optional)" name="company" value={form.company} onChange={set("company")} />

          <div>
            <p className="eyebrow mb-4">I need help with</p>
            <Chips
              options={TYPES}
              selected={types}
              onToggle={(v) => setTypes((t) => (t.includes(v) ? t.filter((x) => x !== v) : [...t, v]))}
            />
          </div>
          <div>
            <p className="eyebrow mb-4">Budget</p>
            <Chips options={BUDGETS} selected={budget} onToggle={(v) => setBudget((b) => (b[0] === v ? [] : [v]))} />
          </div>

          <Field label="Tell me about your project" name="message" textarea value={form.message} onChange={set("message")} error={errors.message} />

          <div className="flex flex-wrap items-center gap-6">
            <Magnetic>
              <button
                type="submit"
                className="group relative overflow-hidden rounded-full bg-red px-10 py-5 font-mono text-[12px] font-semibold tracking-[0.25em] uppercase text-ink"
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

        {/* info */}
        <motion.aside
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55, ease: EASE }}
          className="space-y-12 lg:sticky lg:top-32 lg:self-start"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-[#3ddc84]/40 px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ddc84] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3ddc84]" />
            </span>
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#3ddc84]">{profile.status}</span>
          </div>

          <div>
            <p className="eyebrow mb-3">Email</p>
            <a href={`mailto:${profile.email}`} className="break-all font-display text-xl md:text-2xl font-semibold hover:text-gold">
              {profile.email}
            </a>
          </div>
          <div>
            <p className="eyebrow mb-3">Based in</p>
            <p className="text-lg">{profile.location}</p>
            <p className="mt-1 font-mono text-[11px] tracking-[0.2em] text-muted">
              <LocalClock /> · {profile.coordinates}
            </p>
          </div>
          <div>
            <p className="eyebrow mb-3">Elsewhere</p>
            <ul className="flex gap-6 font-mono text-[12px] tracking-[0.2em] uppercase">
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-gold">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="border-l-2 border-gold pl-4 text-sm leading-relaxed text-muted">
            I reply to every brief within 24 hours — usually much sooner.
          </p>
        </motion.aside>
      </div>

      {/* faq */}
      <div className="relative grid gap-10 border-t border-line py-28 md:grid-cols-[260px_1fr] md:gap-16 md:py-40">
        <p className="eyebrow">[ FAQ ]</p>
        <ul className="border-t border-line">
          {FAQ.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
