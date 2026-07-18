import type { CSSProperties } from 'react';

import { LANDING_BG, SCENE_BACKGROUNDS } from '@/data/sceneBackgrounds';

// Board 1 — glass surface treatment (CAREER_MAP_REVIEW.md CM-01/02/03). DEV-ONLY workshop
// scaffolding: each cell renders the quiz stack (context card + answer rows + back platter)
// over the real scene art with one candidate surface treatment. Literal rgba/blur values are
// the point here — they're token CANDIDATES; the winning treatment gets promoted into
// globals.css as a proper glass-on-image tier and this board is deleted.

interface Treatment {
  id: string;
  label: string;
  note: string;
  card: CSSProperties;
  row: CSSProperties;
  rowText: string; // tailwind text color class for unselected rows
  cardText: string; // tailwind text color class for card copy
  veil?: string; // optional background veil (the "veil axis") as a CSS background value
}

const GOLD_SELECTED: CSSProperties = {
  background: 'var(--color-arm-gold)',
  borderColor: 'var(--color-arm-gold)',
};

const TREATMENTS: Treatment[] = [
  {
    id: 'current',
    label: 'A — Current build (baseline)',
    note: 'glass-fill 4.5% white, no blur. The CM-01 complaint: text floats on the image.',
    card: { background: 'var(--color-glass-fill)', borderColor: 'var(--color-glass-border)' },
    row: { background: 'var(--color-glass-fill)', borderColor: 'var(--color-glass-border)' },
    rowText: 'text-text-on-dark',
    cardText: 'text-text-on-dark',
  },
  {
    id: 'panel',
    label: 'B — Her own panel glass',
    note: 'glass-fill-strong 6% + blur 14 (what CharacterSelect / the job panel already use).',
    card: {
      background: 'var(--color-glass-fill-strong)',
      borderColor: 'var(--color-glass-border)',
      backdropFilter: 'blur(var(--blur-panel))',
      WebkitBackdropFilter: 'blur(var(--blur-panel))',
    },
    row: {
      background: 'var(--color-glass-fill-strong)',
      borderColor: 'var(--color-glass-border)',
      backdropFilter: 'blur(var(--blur-panel))',
      WebkitBackdropFilter: 'blur(var(--blur-panel))',
    },
    rowText: 'text-text-on-dark',
    cardText: 'text-text-on-dark',
  },
  {
    id: 'dark-scrim',
    label: 'C — Inner dark scrim',
    note: 'glass-panel (near-black 85%) + blur 8. Contrast lives in the card, dark idiom kept.',
    card: {
      background: 'var(--color-glass-panel)',
      borderColor: 'var(--color-glass-border)',
      backdropFilter: 'blur(var(--blur-bar))',
      WebkitBackdropFilter: 'blur(var(--blur-bar))',
    },
    row: {
      background: 'rgb(38 38 38 / 0.7)',
      borderColor: 'var(--color-glass-border)',
      backdropFilter: 'blur(var(--blur-bar))',
      WebkitBackdropFilter: 'blur(var(--blur-bar))',
    },
    rowText: 'text-text-on-dark',
    cardText: 'text-text-on-dark',
  },
  {
    id: 'frost-light',
    label: 'D — Light white frost',
    note: 'white 12% + blur 20 + brighter border. Frost look, text stays light.',
    card: {
      background: 'rgb(255 255 255 / 0.12)',
      borderColor: 'rgb(255 255 255 / 0.22)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    },
    row: {
      background: 'rgb(255 255 255 / 0.12)',
      borderColor: 'rgb(255 255 255 / 0.22)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    },
    rowText: 'text-text-on-dark',
    cardText: 'text-text-on-dark',
  },
  {
    id: 'frost-heavy',
    label: 'E — Figma 238-242 heavy frost',
    note: 'White 78% + blur 24, dark ink, selected goes solid gold. The Figma target, literally.',
    card: {
      background: 'rgb(255 255 255 / 0.78)',
      borderColor: 'rgb(255 255 255 / 0.5)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
    },
    row: {
      background: 'rgb(255 255 255 / 0.55)',
      borderColor: 'rgb(255 255 255 / 0.4)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
    },
    rowText: 'text-near-black',
    cardText: 'text-near-black',
  },
  {
    id: 'veil',
    label: 'F — Current card + scene veil',
    note: 'Same weak glass, but a near-black 50% veil behind (the axis the Figma target rejects).',
    card: {
      background: 'var(--color-glass-fill)',
      borderColor: 'var(--color-glass-border)',
      backdropFilter: 'blur(var(--blur-bar))',
      WebkitBackdropFilter: 'blur(var(--blur-bar))',
    },
    row: { background: 'var(--color-glass-fill)', borderColor: 'var(--color-glass-border)' },
    rowText: 'text-text-on-dark',
    cardText: 'text-text-on-dark',
    veil: 'rgb(23 23 23 / 0.5)',
  },
];

const BACKGROUNDS = [
  { id: 'scene', label: 'Scene 1 (bedroom)', src: SCENE_BACKGROUNDS['n-s1'] },
  { id: 'landing', label: 'Landing factory', src: LANDING_BG },
];

function QuizStack({ t }: { t: Treatment }) {
  const rows = ["That's me", 'Kinda me', 'Not me'];
  return (
    <div className="flex w-full max-w-[420px] flex-col gap-space-3">
      <div className="flex flex-col gap-space-2 rounded-lg border p-space-4" style={t.card}>
        <p className={`text-small ${t.cardText}`}>Scene 1 of 7</p>
        <div className="border-t border-glass-border-soft" />
        <p className={`font-heading text-h5 font-bold ${t.cardText}`}>
          Your alarm goes off in the morning. You&rsquo;re getting ready for your first day of
          school.
        </p>
        <p className={`font-body text-body ${t.cardText}`}>How do you start the day?</p>
      </div>
      <div className="flex flex-col gap-space-2">
        {rows.map((label, i) => {
          const selected = i === 2;
          return (
            <div
              key={label}
              className={`rounded-md border px-space-4 py-space-3 font-body text-body ${
                selected ? 'font-medium text-near-black' : t.rowText
              }`}
              style={selected ? { ...t.row, ...GOLD_SELECTED, backdropFilter: undefined } : t.row}
            >
              {label}
            </div>
          );
        })}
      </div>
      {/* CM-03: the Back control gets whatever platter wins. */}
      <div
        className={`self-start rounded-md border px-space-3 py-space-1 font-body text-small ${t.rowText}`}
        style={t.row}
      >
        &larr; Back
      </div>
    </div>
  );
}

export function GlassBoard() {
  return (
    <div className="flex flex-col gap-space-6">
      {TREATMENTS.map((t) => (
        <section key={t.id} className="flex flex-col gap-space-2">
          <h2 className="font-heading text-h4 font-bold text-text-on-dark">{t.label}</h2>
          <p className="max-w-read font-body text-small text-text-on-dark-muted">{t.note}</p>
          <div className="grid grid-cols-1 gap-space-3 xl:grid-cols-2">
            {BACKGROUNDS.map((bg) => (
              <div
                key={bg.id}
                className="relative overflow-hidden rounded-lg border border-glass-border"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${bg.src})` }}
                />
                {t.veil ? (
                  <div className="absolute inset-0" style={{ background: t.veil }} />
                ) : null}
                <div className="relative flex justify-start p-space-5">
                  <QuizStack t={t} />
                </div>
                <p className="absolute bottom-space-1 right-space-2 font-body text-small text-text-on-dark-faint">
                  {bg.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
