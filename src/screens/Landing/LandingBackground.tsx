// Figma 1367:312 — full-bleed factory illustration behind the landing hero.

import { LANDING_BG } from '@/data/sceneBackgrounds';

export function LandingBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <img
        src={LANDING_BG}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      {/* Figma 1368:440 — dims the illustration so hero copy stays legible. */}
      <div className="absolute inset-0 bg-near-black/50" />
    </div>
  );
}
