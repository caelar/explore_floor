import type { CSSProperties } from 'react';

// A four-point sparkle/twinkle star — the trajectory-ladder node glyph. The Claude Design
// handoff uses this exact path (not a Material `star` glyph), which is what makes the nodes read as
// glowing sparkles rather than generic five-point stars. `fill: currentColor` so the tint comes from
// a text-color class on the caller; `size` and an optional glow `style` (e.g. a drop-shadow filter)
// also come from the caller. Decorative — the node's button carries the accessible label.
const SPARKLE_PATH =
  'M 29.457 58.877 C 30.43 58.877 31.142 58.166 31.329 57.155 C 33.986 36.644 36.868 33.537 57.155 31.291 C 58.203 31.179 58.914 30.393 58.914 29.42 C 58.914 28.447 58.203 27.698 57.155 27.548 C 36.868 25.302 33.986 22.196 31.329 1.684 C 31.142 0.674 30.43 0 29.457 0 C 28.484 0 27.773 0.674 27.623 1.684 C 24.966 22.196 22.046 25.302 1.796 27.548 C 0.711 27.698 0 28.447 0 29.42 C 0 30.393 0.711 31.179 1.796 31.291 C 22.009 33.949 24.816 36.681 27.623 57.155 C 27.773 58.166 28.484 58.877 29.457 58.877 Z';

interface SparkleStarProps {
  /** px (width = height). */
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export function SparkleStar({ size = 30, className, style }: SparkleStarProps) {
  return (
    <svg
      viewBox="0 0 58.914 58.877"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
      className={className}
      style={style}
    >
      <path d={SPARKLE_PATH} />
    </svg>
  );
}
