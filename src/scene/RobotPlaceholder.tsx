import { ACCENT_CLASSES } from '@/components/accent';
import type { ArchetypeId } from '@/data/types';

interface RobotPlaceholderProps {
  /** Classic results tint by archetype. Omit when passing colorClass directly. */
  archetype?: ArchetypeId;
  /** A `text-*` class to tint the figure (category flows pass a category accent). */
  colorClass?: string;
  size?: number;
}

// Phase 1 placeholder robot — a simple line robot tinted with the active accent (via
// currentColor). The real modular SVG robot is authored in Phase 2; here the point is the
// compare *interaction* (classic) or a results anchor (study flows), so the figure just needs
// to read as "your robot". No hardcoded hex: stroke uses currentColor set by the tint class —
// either the archetype accent (classic) or a passed-in colorClass (category flows).
export function RobotPlaceholder({ archetype, colorClass, size = 116 }: RobotPlaceholderProps) {
  const tint = colorClass ?? (archetype ? ACCENT_CLASSES[archetype].text : 'text-text-muted');
  return (
    <svg
      width={size}
      height={(size / 116) * 136}
      viewBox="0 0 116 136"
      className={tint}
      role="img"
      aria-label="Your robot"
    >
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        {/* antenna */}
        <line x1="58" y1="14" x2="58" y2="5" />
        <circle cx="58" cy="5" r="3.5" fill="currentColor" />
        {/* head */}
        <rect x="36" y="14" width="44" height="32" rx="8" className="fill-bg" />
        {/* eyes */}
        <circle cx="49" cy="30" r="4" fill="currentColor" stroke="none" />
        <circle cx="67" cy="30" r="4" fill="currentColor" stroke="none" />
        {/* arms */}
        <rect x="12" y="54" width="13" height="34" rx="6" className="fill-bg" />
        <rect x="91" y="54" width="13" height="34" rx="6" className="fill-bg" />
        {/* body */}
        <rect x="28" y="50" width="60" height="56" rx="10" className="fill-bg" />
        {/* chest light */}
        <circle cx="58" cy="74" r="7" fill="currentColor" stroke="none" opacity="0.3" />
        {/* legs */}
        <rect x="38" y="108" width="13" height="24" rx="5" className="fill-bg" />
        <rect x="65" y="108" width="13" height="24" rx="5" className="fill-bg" />
      </g>
    </svg>
  );
}
