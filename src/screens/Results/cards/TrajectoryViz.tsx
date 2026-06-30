import { Fragment } from 'react';

import { SparkleStar } from '@/components';
import { ROLE_ACCENT } from '@/components/categoryAccent';
import { roleDetails } from '@/data';
import type { CategoryId } from '@/data/types';

// "Where this can lead" on the job-overview "How you fit" tab. A role-tier GROWTH LADDER — ARM's
// three published roles stacked low→high (Technician → Specialist → Integrator) — so the page reads
// "this is a starting place, not an end": the current tier is lit, the climb above it glows in the
// role accent ("room to grow"), and a per-tier role count hints that each rung holds many jobs to
// explore. Restores the liked "move through the roles" read and matches the constellation's sparkle /
// dashed-line language. Static (reduced-motion safe). Replaces the old job-branch diamond + its
// purple handoff gradient with the current orb-style, role-tinted background.

const PANEL_W = 636;
const PANEL_H = 430;
const NODE = 64; // node diameter (px); r = 32
const CX = 150; // node column x (labels run to the right)
const LABEL_X = CX + NODE / 2 + 22;

// Top → bottom = highest tier first. The role you're viewing is the lit "current" rung; rungs above
// it are the climb ahead (accent), rungs below are the foundation (dimmed).
const TIERS: CategoryId[] = ['integrator', 'specialist', 'technician'];
const CY: Record<number, number> = { 0: 84, 1: 215, 2: 346 };

const xPct = (v: number) => `${(v / PANEL_W) * 100}%`;
const yPct = (v: number) => `${(v / PANEL_H) * 100}%`;

export function TrajectoryViz({ category }: { category: CategoryId }) {
  const accent = ROLE_ACCENT[category];
  const currentIndex = TIERS.indexOf(category);
  const accentSoftVar = `var(--color-role-${category}-soft)`;

  return (
    <div
      className="relative mx-auto w-full overflow-hidden rounded-lg border border-glass-border-soft"
      // Role-tinted glow rising from the bottom (where "you are now") over a subtle glass base —
      // echoes the constellation's role-center glow and the shared orb field; replaces the old
      // purple handoff gradient. accent.glow is already a low-alpha rgb(...) value.
      style={{
        maxWidth: PANEL_W,
        aspectRatio: `${PANEL_W} / ${PANEL_H}`,
        background: `radial-gradient(120% 80% at ${(CX / PANEL_W) * 100}% 100%, ${accent.glow}, transparent 60%), var(--color-glass-fill)`,
      }}
      data-testid="trajectory"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${PANEL_W} ${PANEL_H}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* connectors between consecutive rungs; the climb above the current tier glows in the role
            accent ("room to grow"), the foundation below stays neutral grey */}
        {[0, 1].map((i) => {
          const lit = i < currentIndex;
          return (
            <line
              key={i}
              x1={CX}
              y1={CY[i] + NODE / 2}
              x2={CX}
              y2={CY[i + 1] - NODE / 2}
              stroke={lit ? accentSoftVar : 'var(--color-constellation-line)'}
              strokeOpacity={lit ? 0.85 : 0.32}
              strokeWidth={1.5}
              strokeDasharray="6 6"
            />
          );
        })}
      </svg>

      {TIERS.map((tier, i) => {
        const detail = roleDetails[tier];
        const isCurrent = i === currentIndex;
        const isClimb = i < currentIndex; // a rung above the current one
        const starTone = isCurrent
          ? accent.textSoft
          : isClimb
            ? 'text-text-on-dark'
            : 'text-text-on-dark-faint';
        return (
          <Fragment key={tier}>
            {/* node */}
            <div
              className="absolute grid place-items-center rounded-full"
              style={{
                left: xPct(CX),
                top: yPct(CY[i]),
                width: NODE,
                height: NODE,
                transform: 'translate(-50%, -50%)',
                background: isCurrent ? `var(--color-role-${tier})` : 'var(--color-glass-fill)',
                border: `2px solid ${
                  isCurrent
                    ? `var(--color-role-${tier})`
                    : isClimb
                      ? 'rgba(255, 255, 255, 0.7)'
                      : 'rgba(255, 255, 255, 0.25)'
                }`,
                boxShadow: isCurrent ? `0 0 24px ${accent.glow}` : undefined,
              }}
            >
              <SparkleStar
                size={26}
                className={isCurrent ? accent.onAccent : starTone}
                style={{
                  filter: isCurrent ? `drop-shadow(0 0 6px ${accent.glow})` : undefined,
                }}
              />
            </div>

            {/* label: role name + a "you're here" / role-count caption (breadth cue) */}
            <div
              className="absolute flex flex-col gap-space-0"
              style={{ left: xPct(LABEL_X), top: yPct(CY[i]), transform: 'translate(0, -50%)' }}
            >
              <span
                className={`font-heading text-body font-bold ${
                  isCurrent
                    ? accent.textSoft
                    : isClimb
                      ? 'text-text-on-dark'
                      : 'text-text-on-dark-muted'
                }`}
              >
                {detail.roleName}
              </span>
              <span className="font-body text-small text-text-on-dark-faint">
                {isCurrent
                  ? "You're here"
                  : `${detail.commonJobTitles.length} roles to explore`}
              </span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
