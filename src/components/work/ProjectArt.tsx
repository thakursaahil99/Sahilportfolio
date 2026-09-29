import { ACCENTS, type Accent } from "@/data/projects";

/** Animated gradient blobs + grid used behind project panels and cards. */
export default function ProjectArt({ accent, className = "" }: { accent: Accent; className?: string }) {
  const [a, b] = ACCENTS[accent];
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      <div
        className="animate-blob absolute -left-1/4 top-1/4 h-[70%] w-[70%] rounded-full opacity-40 blur-[90px] transition-opacity duration-1000 group-hover:opacity-70"
        style={{ background: a }}
      />
      <div
        className="animate-blob absolute -right-1/4 -bottom-1/4 h-[70%] w-[70%] rounded-full opacity-35 blur-[100px] transition-opacity duration-1000 [animation-delay:-7s] group-hover:opacity-60"
        style={{ background: b }}
      />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(242,239,233,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(242,239,233,.35) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, #000 20%, transparent 75%)",
        }}
      />
    </div>
  );
}
