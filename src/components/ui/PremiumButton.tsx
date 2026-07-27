"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type PremiumButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export default function PremiumButton({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  type = "button",
  disabled,
}: PremiumButtonProps) {
  const sizes = {
    md: "px-7 py-3 text-sm max-lg:min-h-11",
    lg: "px-9 py-4 text-[15px] max-lg:min-h-[3.25rem] max-lg:w-full sm:max-lg:w-auto",
  };

  const variants = {
    primary:
      "bg-lav-600 text-white shadow-strong hover:shadow-glow group",
    secondary:
      "bg-white/70 text-plum border border-plum/10 backdrop-blur-md hover:bg-white hover:border-lav-300 hover:shadow-soft",
    ghost:
      "border text-white/80 hover:bg-white/10 hover:border-white/35 hover:text-white",
    gold:
      "bg-gradient-to-br from-gold-400 to-gold-500 text-plum font-semibold shadow-gold-glow",
  };

  const inner = (
    <>
      {(variant === "primary" || variant === "gold") && (
        <span
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400",
            variant === "primary"
              ? "bg-gradient-to-br from-lav-500 via-lav-400 to-lav-300"
              : "bg-gradient-to-br from-gold-300 via-gold-400 to-kroke-400"
          )}
        />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2.5">{children}</span>
    </>
  );

  const classes = cn(
    "relative rounded-2xl font-semibold overflow-hidden cursor-pointer inline-flex items-center justify-center transition-shadow duration-300",
    sizes[size],
    variants[variant],
    disabled && "opacity-60 pointer-events-none",
    className
  );

  const motionProps = {
    whileHover: disabled ? undefined : { scale: 1.02, y: -2 },
    whileTap: disabled ? undefined : { scale: 0.98 },
    transition: { type: "spring" as const, stiffness: 380, damping: 22 },
  };

  if (href) {
    return (
      <Link href={href} className={classes}>
        <motion.span className="contents" {...motionProps}>
          {inner}
        </motion.span>
      </Link>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...motionProps}
    >
      {inner}
    </motion.button>
  );
}
