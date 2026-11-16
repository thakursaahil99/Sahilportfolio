/** "Sahil Thakur●" wordmark (or just "Sahil●" with `short`) — size it with a font-size class; the dot scales with the text. */
export default function Logo({ className = "", mono = false, short = false }: { className?: string; mono?: boolean; short?: boolean }) {
  return (
    <span className={`inline-flex items-baseline whitespace-nowrap font-display font-black tracking-[-0.04em] leading-none ${className}`}>
      {short ? "Sahil" : "Sahil Thakur"}
      <span
        aria-hidden="true"
        className={`ml-[0.08em] inline-block h-[0.24em] w-[0.24em] rounded-full ${
          mono ? "bg-current" : "bg-gradient-to-br from-gold to-red"
        }`}
      />
    </span>
  );
}
