/**
 * Thin, evenly-weighted line icons for the hero trust strip and the editorial
 * sections. Deliberately hairline (1.5px) and monochrome so they read as
 * typographic marks rather than illustrations — the language of the mockups.
 */
type IconProps = { className?: string };

const base = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export const StarIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 3.5l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.9l6-.8L12 3.5z" />
  </svg>
);

export const LiveIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M5.5 9.5a9 9 0 0113 0M8 12.4a5.4 5.4 0 018 0" />
    <circle cx="12" cy="16.5" r="1.2" />
  </svg>
);

export const GroupIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="9" cy="9" r="3" />
    <path d="M3.5 19c0-3 2.5-4.6 5.5-4.6s5.5 1.6 5.5 4.6" />
    <path d="M16 6.6a3 3 0 010 5.6M17.5 19c0-2.2-.9-3.7-2.3-4.6" opacity="0.55" />
  </svg>
);

export const NoteIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M7 4h7l4 4v12H7z" />
    <path d="M14 4v4h4" opacity="0.55" />
    <path d="M10 12.5h6M10 16h4" />
  </svg>
);

export const SpeakIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M8 4.5a4.5 4.5 0 00-.6 8.9V19h2.4v-5.6A4.5 4.5 0 008 4.5z" />
    <path d="M13.5 8.6a4 4 0 010 6.8M16.5 6.4a7.5 7.5 0 010 11.2" opacity="0.6" />
  </svg>
);

export const MindIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 4.2c-2 0-3.2 1.2-3.4 2.5-1.5.3-2.4 1.5-2.4 2.9 0 .9.4 1.7 1 2.2-.5.5-.8 1.2-.8 2 0 1.6 1.3 2.9 3 3 .3 1.2 1.4 2 2.6 2V4.2z" />
    <path d="M12 4.2c2 0 3.2 1.2 3.4 2.5 1.5.3 2.4 1.5 2.4 2.9 0 .9-.4 1.7-1 2.2.5.5.8 1.2.8 2 0 1.6-1.3 2.9-3 3-.3 1.2-1.4 2-2.6 2" opacity="0.6" />
  </svg>
);

export const FreezeIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
    <path d="M9.4 4.6L12 6.9l2.6-2.3M9.4 19.4L12 17.1l2.6 2.3" opacity="0.6" />
  </svg>
);

export const ChatIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M4 6.5h16v10h-9.5L6 20v-3.5H4z" />
    <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
  </svg>
);

export const GlobeIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17" />
    <path d="M12 3.5c2.2 2.3 3.4 5.3 3.4 8.5S14.2 18.2 12 20.5c-2.2-2.3-3.4-5.3-3.4-8.5S9.8 5.8 12 3.5z" />
  </svg>
);

export const CalendarIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="4" y="5.5" width="16" height="14" rx="2" />
    <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
  </svg>
);
