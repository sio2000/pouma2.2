/**
 * The line-mark set for the new homepage. Everything is drawn on the same
 * 24×24 grid at the same hairline weight so the marks read as one family —
 * the engraved, brass-plate look of the reference layout.
 */
type IconProps = { className?: string };

const base = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

const make = (path: React.ReactNode) =>
  function Icon({ className }: IconProps) {
    return (
      <svg {...base} className={className}>
        {path}
      </svg>
    );
  };

/* ── Hero badges ─────────────────────────────────── */
export const UsersIcon = make(
  <>
    <circle cx="9" cy="8.5" r="3" />
    <path d="M3.5 19c0-3.1 2.5-4.8 5.5-4.8s5.5 1.7 5.5 4.8" />
    <path d="M16 6.1a3 3 0 010 5.8M17.6 19c0-2.3-.9-3.9-2.4-4.8" opacity="0.55" />
  </>,
);

export const TargetIcon = make(
  <>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="1" />
  </>,
);

export const GrowthIcon = make(
  <>
    <path d="M4 18.5L9 13l3.2 3L20 7.5" />
    <path d="M15.4 7.5H20v4.6" />
  </>,
);

/* ── Programme marks ─────────────────────────────── */
export const QuoteBubbleIcon = make(
  <>
    <path d="M4 6h16v9.5h-9.4L6 19v-3.5H4z" />
    <path d="M8.4 10.6h.01M12 10.6h.01M15.6 10.6h.01" />
  </>,
);

export const ResetIcon = make(
  <>
    <path d="M19.6 12a7.6 7.6 0 01-13.2 5.1M4.4 12a7.6 7.6 0 0113.2-5.1" />
    <path d="M17.6 3.4v3.6H14M6.4 20.6V17H10" />
  </>,
);

export const PracticeIcon = make(
  <>
    <circle cx="8.5" cy="8" r="2.8" />
    <path d="M3.5 18.5c0-2.9 2.3-4.5 5-4.5s5 1.6 5 4.5" />
    <circle cx="17" cy="9.5" r="2.2" opacity="0.6" />
    <path d="M15 18.5c0-2.2 1-3.6 2.6-3.9" opacity="0.6" />
  </>,
);

export const CrestIcon = make(
  <>
    <path d="M12 3.2l7 2.6v6.1c0 3.6-2.8 6.6-7 8.9-4.2-2.3-7-5.3-7-8.9V5.8l7-2.6z" />
    <path d="M9.6 12l1.7 1.8 3.2-3.6" />
  </>,
);

export const BriefcaseIcon = make(
  <>
    <rect x="3" y="7.5" width="18" height="12" rx="2" />
    <path d="M9 7.5V5.8A1.8 1.8 0 0110.8 4h2.4A1.8 1.8 0 0115 5.8v1.7M3 12.5h18" />
  </>,
);

export const StrategyIcon = make(
  <>
    <path d="M4 19.5V10M9.3 19.5V5.5M14.6 19.5v-6M20 19.5V8" />
  </>,
);

export const ChatIcon = make(
  <>
    <path d="M4 5.8h11.5a2 2 0 012 2v4.9a2 2 0 01-2 2H9l-3.8 3v-3H4a2 2 0 01-2-2V7.8a2 2 0 012-2z" />
    <path d="M20 9.6a2 2 0 012 2v4.2a2 2 0 01-2 2v2.2l-2.4-1.8" opacity="0.55" />
  </>,
);

/* ── Method steps ────────────────────────────────── */
export const CompassIcon = make(
  <>
    <circle cx="12" cy="12" r="8.3" />
    <path d="M15.2 8.8l-1.9 4.5-4.5 1.9 1.9-4.5 4.5-1.9z" />
  </>,
);

export const StarBubbleIcon = make(
  <>
    <path d="M4 5.5h16v10h-9.6L6 19v-3.5H4z" />
    <path d="M12 8l1.1 2.3 2.5.3-1.8 1.7.4 2.5-2.2-1.2-2.2 1.2.4-2.5L8.4 10.6l2.5-.3L12 8z" />
  </>,
);

export const FlagIcon = make(
  <>
    <path d="M6 21V4" />
    <path d="M6 5.2h10.5l-1.9 3.2 1.9 3.2H6" />
  </>,
);

/* ── Why Pouma traits ────────────────────────────── */
export const LotusIcon = make(
  <>
    <path d="M12 5.5c1.8 1.9 2.7 4 2.7 6.2 0 2.2-.9 4.1-2.7 5.8-1.8-1.7-2.7-3.6-2.7-5.8 0-2.2.9-4.3 2.7-6.2z" />
    <path d="M12 17.5c-2.6 0-4.7-1-6.4-3 1-1.2 2.2-1.9 3.6-2M12 17.5c2.6 0 4.7-1 6.4-3-1-1.2-2.2-1.9-3.6-2" opacity="0.6" />
  </>,
);

export const EyeIcon = make(
  <>
    <path d="M2.8 12S6.5 6.4 12 6.4 21.2 12 21.2 12 17.5 17.6 12 17.6 2.8 12 2.8 12z" />
    <circle cx="12" cy="12" r="2.6" />
  </>,
);

export const MountainIcon = make(
  <>
    <path d="M2.5 19l5.6-9.4 3.4 5.3 2.3-3.6 5.7 7.7z" />
    <path d="M8.1 9.6l1.9 3" opacity="0.5" />
  </>,
);

export const ShieldIcon = make(
  <>
    <path d="M12 3.4l7 2.6v6c0 3.6-2.8 6.6-7 8.8-4.2-2.2-7-5.2-7-8.8V6l7-2.6z" />
  </>,
);

export const PrecisionIcon = make(
  <>
    <circle cx="12" cy="12" r="7.6" />
    <path d="M12 4.4v3M12 16.6v3M4.4 12h3M16.6 12h3" />
    <circle cx="12" cy="12" r="2.2" />
  </>,
);

/* ── Dimitra facts ───────────────────────────────── */
export const ClockIcon = make(
  <>
    <circle cx="12" cy="12" r="8.2" />
    <path d="M12 7.4V12l3 1.8" />
  </>,
);

export const BookIcon = make(
  <>
    <path d="M4 5.2h6a2.5 2.5 0 012.5 2.5V19a2.2 2.2 0 00-2.2-2H4z" />
    <path d="M20 5.2h-6A2.5 2.5 0 0011.5 7.7V19a2.2 2.2 0 012.2-2H20z" />
  </>,
);

export const BadgeIcon = make(
  <>
    <circle cx="12" cy="9.4" r="4.9" />
    <path d="M8.6 13.6L7.5 20.5l4.5-2.3 4.5 2.3-1.1-6.9" />
  </>,
);

/* ── Contact ─────────────────────────────────────── */
export const PhoneIcon = make(
  <path d="M6.4 3.8h3l1.5 3.7-2 1.4a11.5 11.5 0 006.2 6.2l1.4-2 3.7 1.5v3a1.7 1.7 0 01-1.9 1.7C10.6 18.6 5.4 13.4 4.7 5.7a1.7 1.7 0 011.7-1.9z" />,
);

export const MailIcon = make(
  <>
    <rect x="3" y="5.6" width="18" height="12.8" rx="2" />
    <path d="M3.8 6.8L12 12.8l8.2-6" />
  </>,
);

export const PinIcon = make(
  <>
    <path d="M12 21c4-4.4 6-7.7 6-10a6 6 0 10-12 0c0 2.3 2 5.6 6 10z" />
    <circle cx="12" cy="10.8" r="2.3" />
  </>,
);
