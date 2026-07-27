"use client";
import { motion } from "framer-motion";

function Star({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0c.6 6.5 5.5 11.4 12 12-6.5.6-11.4 5.5-12 12-.6-6.5-5.5-11.4-12-12C6.5 11.4 11.4 6.5 12 0Z" />
    </svg>
  );
}

export default function LogoSparkle() {
  return (
    <span className="pointer-events-none absolute inset-0 z-10" aria-hidden>
      <motion.span
        className="absolute text-gold-300 drop-shadow-[0_0_16px_rgba(245,179,53,1),0_0_24px_rgba(245,179,53,0.6)]"
        style={{ top: "58%", left: "72%" }}
        initial={{ opacity: 0, scale: 0.75, rotate: 0 }}
        animate={{ opacity: [0, 0.9, 1, 0.9, 0], scale: [0.75, 1.25, 1.1, 1.0, 0.75], rotate: [0, 35, 0, 35, 0] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatDelay: 4.5,
          delay: 0.5,
          ease: "easeInOut",
        }}
      >
        <Star size={18} />
      </motion.span>
    </span>
  );
}
