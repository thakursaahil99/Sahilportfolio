import TLink from "@/components/transition/TLink";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] flex-col items-start justify-center overflow-hidden px-6 md:px-12">
      <div className="pointer-events-none absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-red/20 blur-[140px]" />
      <p className="eyebrow relative mb-6">[ Error 404 — Signal lost ]</p>
      <h1 className="relative font-display text-[24vw] md:text-[14vw] font-black leading-[0.8] tracking-[-0.06em] text-molten">
        404
      </h1>
      <p className="relative mt-8 max-w-md text-lg text-muted">
        This page flew off the launch site and never came back. Let&apos;s get you home.
      </p>
      <TLink
        href="/"
        className="relative mt-10 rounded-full bg-ink px-7 py-3.5 font-mono text-[11px] font-semibold tracking-[0.25em] uppercase text-background transition-colors hover:bg-gold"
      >
        ← Back to base
      </TLink>
    </main>
  );
}
