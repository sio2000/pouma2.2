"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_LUXURY } from "@/lib/motion";

type SectionLabelProps = {
  children: React.ReactNode;
  variant?: "light" | "dark" | "ornament";
  className?: string;
  delay?: number;
};

export default function SectionLabel({
  children,
  variant = "ornament",
  className,
  delay = 0,
}: SectionLabelProps) {
  if (variant === "ornament") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.65, delay, ease: EASE_LUXURY }}
        className={cn("rule-ornament mb-8 w-fit", className)}
      >
        {children}
      </motion.div>
    );
  }

  const styles =
    variant === "dark"
      ? "text-lav-300"
      : "text-lav-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.65, delay, ease: EASE_LUXURY }}
      className={cn("inline-flex items-center gap-3 mb-8", className)}
    >
      <span className={cn("h-px w-8 bg-gradient-to-r from-transparent to-lav-400", variant === "dark" && "to-lav-500")} />
      <span className={cn("text-[10px] font-semibold tracking-[0.28em] uppercase", styles)}>
        {children}
      </span>
      <span className={cn("h-px w-8 bg-gradient-to-l from-transparent to-lav-400", variant === "dark" && "to-lav-500")} />
    </motion.div>
  );
}
