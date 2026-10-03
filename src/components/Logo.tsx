/** "Sahil●" wordmark — size it with a font-size class; the dot scales with the text. */
export default function Logo({ className = "", mono = false }: { className?: string; mono?: boolean }) {
  return (
    <span className={`inline-flex items-baseline font-display font-black tracking-[-0.04em] leading-none ${className}`}>
      Sahil
      <span
        aria-hidden="true"
        className={`ml-[0.08em] inline-block h-[0.24em] w-[0.24em] rounded-full ${
          mono ? "bg-current" : "bg-gradient-to-br from-gold to-red"
        }`}
      />
    </span>
  );
}
