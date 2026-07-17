import { motion, useReducedMotion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

import { CHARACTER_SELECT_ART } from '@/data/sceneBackgrounds';
import type { CharacterId } from '@/data/types';
import { durations, easings } from '@/lib';
import { LandingBackground } from '@/screens/Landing/LandingBackground';
import { useSessionStore } from '@/state';

// Figma 1369:452 — pick girl or boy on the factory floor, then enter the quiz.

const OPTIONS: { id: CharacterId; label: string }[] = [
  { id: 'girl', label: 'Girl' },
  { id: 'boy', label: 'Boy' },
];

export function CharacterSelect() {
  const navigate = useNavigate();
  const startSession = useSessionStore((s) => s.startSession);
  const reduce = !!useReducedMotion();

  const pick = (characterId: CharacterId) => {
    startSession(characterId);
    navigate('/flow');
  };

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <LandingBackground />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-[996px] flex-1 flex-col items-center justify-center gap-space-5 px-space-4 py-space-7"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: durations.glide, ease: easings.soft }}
      >
        <h1 className="w-full text-center font-heading text-h1 text-text-on-dark">Choose your character</h1>

        <div className="flex w-full flex-col items-center justify-center gap-space-5 md:flex-row md:gap-10">
          {OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              data-testid={`character-select-${option.id}`}
              aria-label={`Choose ${option.label.toLowerCase()} character`}
              onClick={() => pick(option.id)}
              className="group relative h-[min(549px,60vh)] w-full max-w-[478px] shrink-0 overflow-hidden rounded-cta border border-glass-border bg-glass-fill-strong shadow-dark-card backdrop-blur-panel transition-colors hover:border-text-on-dark-faint hover:bg-glass-fill"
            >
              <img
                src={CHARACTER_SELECT_ART[option.id]}
                alt=""
                className="pointer-events-none absolute left-1/2 top-1/2 h-full w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain object-bottom transition-transform duration-100 group-hover:scale-[1.02]"
              />
            </button>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
