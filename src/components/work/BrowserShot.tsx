import Image from "next/image";

const EASE_OUT = "ease-[cubic-bezier(0.16,1,0.3,1)]";

/**
 * Screenshot inside a browser window. With `tilt`, it sits rotated in 3D and
 * straightens when an ancestor with the `group` class is hovered.
 */
export default function BrowserShot({
  src,
  alt,
  url,
  tilt = false,
  sizes = "(min-width: 768px) 45vw, 90vw",
  priority = false,
}: {
  src: string;
  alt: string;
  url?: string;
  tilt?: boolean;
  sizes?: string;
  priority?: boolean;
}) {
  const domain = url ? new URL(url).hostname : undefined;
  return (
    <div className={tilt ? "[perspective:1600px]" : undefined}>
      <div
        className={`relative overflow-hidden rounded-xl border border-ink/15 bg-background shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)] transition-transform duration-1000 ${EASE_OUT} ${
          tilt
            ? "md:[transform:rotateY(-16deg)_rotateX(7deg)_rotateZ(1deg)] md:group-hover:[transform:rotateY(0deg)_rotateX(0deg)_scale(1.03)]"
            : ""
        }`}
      >
        <div className="flex items-center gap-3 border-b border-ink/10 bg-panel px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-gold/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#3ddc84]/80" />
          </span>
          <span className="flex-1 truncate rounded-md bg-background/70 px-3 py-1 text-center font-mono text-[10px] tracking-[0.1em] text-ink/60">
            {domain ?? "private build"}
          </span>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            loading={priority ? "eager" : "lazy"}
            className={`object-cover object-top transition-transform duration-[1.6s] ${EASE_OUT} group-hover:scale-[1.04]`}
          />
          {/* glare sweep */}
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[1.2s] ease-out group-hover:translate-x-full" />
        </div>
      </div>
    </div>
  );
}
