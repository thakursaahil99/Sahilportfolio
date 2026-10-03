"use client";

import { useEffect, useRef } from "react";
import { getPerfTier } from "@/lib/perf";

/**
 * Grid of dots that scatter away from the pointer and spring back. Dots near
 * the pointer heat up from ink to molten red/gold. Canvas 2D, paused off-screen.
 */
export default function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const lite = getPerfTier() === "lite";
    const gap = lite ? 30 : 22;
    const dpr = Math.min(window.devicePixelRatio || 1, lite ? 1 : 2);
    let dots: { hx: number; hy: number; x: number; y: number; vx: number; vy: number }[] = [];
    let w = 0;
    let h = 0;

    const build = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = gap / 2; y < h; y += gap)
        for (let x = gap / 2; x < w; x += gap) dots.push({ hx: x, hy: y, x, y, vx: 0, vy: 0 });
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(canvas);

    const pointer = { x: -9999, y: -9999 };
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const leave = () => {
      pointer.x = pointer.y = -9999;
    };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerdown", move);
    canvas.addEventListener("pointerleave", leave);
    const up = (e: PointerEvent) => e.pointerType !== "mouse" && leave();
    canvas.addEventListener("pointerup", up);

    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const R = 120;
    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const dx = d.x - pointer.x;
        const dy = d.y - pointer.y;
        const dist2 = dx * dx + dy * dy;
        let heat = 0;
        if (dist2 < R * R) {
          const dist = Math.sqrt(dist2) || 1;
          const force = (1 - dist / R) * 6;
          d.vx += (dx / dist) * force;
          d.vy += (dy / dist) * force;
          heat = 1 - dist / R;
        }
        // spring home + damping
        d.vx += (d.hx - d.x) * 0.06;
        d.vy += (d.hy - d.y) * 0.06;
        d.vx *= 0.82;
        d.vy *= 0.82;
        d.x += d.vx;
        d.y += d.vy;

        const offset = Math.min(1, Math.hypot(d.x - d.hx, d.y - d.hy) / 30);
        const t = Math.max(heat, offset);
        ctx.fillStyle = t > 0.02 ? `rgb(255,${Math.round(45 + 136 * (1 - t))},${Math.round(32 + 39 * (1 - t))})` : "rgba(242,239,233,0.22)";
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.4 + t * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerdown", move);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("pointerup", up);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full touch-pan-y" aria-hidden="true" />;
}
