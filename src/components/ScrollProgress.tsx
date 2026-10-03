"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      data-no-print
      className="fixed inset-x-0 top-0 z-[130] h-[2px] origin-left bg-gradient-to-r from-red via-gold to-red"
    />
  );
}
