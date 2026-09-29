/** "(01) — About" style section label with a hairline rule. */
export default function SectionTag({ index, label }: { index: string; label: string }) {
  return (
    <div className="mb-12 flex items-center gap-4 md:mb-20">
      <span className="font-mono text-[11px] tracking-[0.3em] text-red">({index})</span>
      <span className="h-px w-12 bg-line" />
      <span className="eyebrow">{label}</span>
    </div>
  );
}
