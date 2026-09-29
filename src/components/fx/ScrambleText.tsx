"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/\\";

interface ScrambleTextProps {
  /** a single phrase, or several to cycle through */
  phrases: string[];
  className?: string;
  /** ms each phrase stays on screen before the next one decodes */
  hold?: number;
  start?: boolean;
}

/** Decodes text out of random glyphs, then cycles to the next phrase. */
export default function ScrambleText({ phrases, className, hold = 2600, start = true }: ScrambleTextProps) {
  const [output, setOutput] = useState(phrases[0].replace(/\S/g, " "));
  const frame = useRef(0);

  useEffect(() => {
    if (!start) return;
    let index = 0;
    let raf = 0;
    let timeout: ReturnType<typeof setTimeout>;
    let from = output;

    const decode = (to: string) => {
      const len = Math.max(from.length, to.length);
      const queue = Array.from({ length: len }, (_, i) => {
        const begin = Math.floor(Math.random() * 18);
        return { from: from[i] ?? "", to: to[i] ?? "", begin, end: begin + 8 + Math.floor(Math.random() * 18) };
      });
      frame.current = 0;

      const run = () => {
        let done = 0;
        let text = "";
        for (const q of queue) {
          if (frame.current >= q.end) {
            done++;
            text += q.to;
          } else if (frame.current >= q.begin) {
            text += q.to === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          } else {
            text += q.from;
          }
        }
        setOutput(text);
        if (done === queue.length) {
          from = to;
          if (phrases.length > 1) {
            timeout = setTimeout(() => {
              index = (index + 1) % phrases.length;
              decode(phrases[index]);
            }, hold);
          }
          return;
        }
        frame.current++;
        raf = requestAnimationFrame(run);
      };
      run();
    };

    decode(phrases[0]);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
    // phrases are static per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, hold]);

  return (
    <span className={className} aria-label={phrases[0]}>
      <span aria-hidden="true">{output}</span>
    </span>
  );
}
