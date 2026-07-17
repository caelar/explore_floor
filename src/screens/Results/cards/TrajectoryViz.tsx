import { AnimatePresence, useReducedMotion } from 'motion/react';
import { useState } from 'react';

import { SparkleStar } from '@/components';
import { ROLE_ACCENT } from '@/components/categoryAccent';
import { MAP_JOB_GLOW_HEX } from '@/data/careerMapArt';
import { roleDetails } from '@/data';
import type { Job } from '@/data/types';
import { buildJobTrajectory, trajectoryRungY, type TrajectoryRung } from '@/lib/jobTrajectory';

import { CareerMapOrbGlow } from './CareerMapOrbGlow';
import { fill } from './copy';

// "Where this can lead" on the job-overview "How you fit" tab. A per-job career ladder built from
// featured job titles in jobs.ts — entry / mid / senior steps within and across ARM tiers. Cross-tier
// rungs show a "{role} path" subline so the jump is visible. Unselected rungs are clickable to pan
// the map to that job and open its overview panel; hover reuses CareerMapOrbGlow from the map.

const PANEL_W = 636;
const PANEL_H = 430;
const NODE = 64;
const NODE_R = NODE / 2;
const CX = 150;
const LABEL_X = CX + NODE_R + 22;

const xPct = (v: number) => `${(v / PANEL_W) * 100}%`;
const yPct = (v: number) => `${(v / PANEL_H) * 100}%`;

function rungCaption(
  rung: TrajectoryRung,
  crossRoleTemplate: string,
): string | null {
  if (rung.kind === 'current') return "You're here";
  if (rung.crossCategory) {
    return fill(crossRoleTemplate, { role: roleDetails[rung.job.categoryId].roleName });
  }
  return null;
}

export function TrajectoryViz({
  job,
  crossRoleLabel,
  onSelectJob,
}: {
  job: Job;
  crossRoleLabel: string;
  onSelectJob?: (job: Job) => void;
}) {
  const reduce = !!useReducedMotion();
  const [hoveredJobId, setHoveredJobId] = useState<string | null>(null);
  const rungs = buildJobTrajectory(job);
  const accent = ROLE_ACCENT[job.categoryId];
  const yPositions = rungs.map((_, i) => trajectoryRungY(rungs.length, i));
  const hoveredIndex = hoveredJobId ? rungs.findIndex((r) => r.job.id === hoveredJobId) : -1;
  const hoveredRung = hoveredIndex >= 0 ? rungs[hoveredIndex] : null;

  return (
    <div
      className="relative mx-auto w-full overflow-hidden rounded-lg border border-glass-border-soft"
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
        {yPositions.slice(0, -1).map((yTop, i) => {
          const yBottom = yPositions[i + 1];
          const aboveCurrent = rungs[i].kind === 'next';
          return (
            <line
              key={`${rungs[i].job.id}-${rungs[i + 1].job.id}`}
              x1={CX}
              y1={yTop + NODE_R}
              x2={CX}
              y2={yBottom - NODE_R}
              stroke={aboveCurrent ? `var(--color-role-${job.categoryId}-soft)` : 'var(--color-constellation-line)'}
              strokeOpacity={aboveCurrent ? 0.85 : 0.32}
              strokeWidth={1.5}
              strokeDasharray="6 6"
            />
          );
        })}
      </svg>

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${PANEL_W} ${PANEL_H}`}
        aria-hidden
      >
        <AnimatePresence>
          {hoveredRung && hoveredRung.kind !== 'current' && (
            <CareerMapOrbGlow
              key={hoveredRung.job.id}
              cx={CX}
              cy={yPositions[hoveredIndex]}
              baseR={NODE_R}
              glow={MAP_JOB_GLOW_HEX[hoveredRung.job.categoryId]}
              reduce={reduce}
            />
          )}
        </AnimatePresence>
      </svg>

      {rungs.map((rung, i) => {
        const isCurrent = rung.kind === 'current';
        const isNext = rung.kind === 'next';
        const isHovered = hoveredJobId === rung.job.id;
        const caption = rungCaption(rung, crossRoleLabel);
        const interactive = !isCurrent && onSelectJob != null;
        const selectJob = () => onSelectJob?.(rung.job);
        const rowTop = yPct(yPositions[i]);

        const nodeStyle = {
          width: NODE,
          height: NODE,
          background: isCurrent ? `var(--color-role-${job.categoryId})` : 'var(--color-glass-fill)',
          border: `2px solid ${
            isCurrent
              ? `var(--color-role-${job.categoryId})`
              : isHovered
                ? `var(--color-role-${rung.job.categoryId}-soft)`
                : isNext
                  ? 'rgba(255, 255, 255, 0.7)'
                  : 'rgba(255, 255, 255, 0.25)'
          }`,
          boxShadow: isCurrent ? `0 0 24px ${accent.glow}` : undefined,
        };

        const labelBody = (
          <>
            <span
              className={`font-heading text-body font-bold ${
                isCurrent ? accent.textSoft : 'text-text-on-dark-muted'
              }`}
            >
              {rung.job.title}
            </span>
            {caption ? (
              <span className="font-body text-small text-text-on-dark-faint">{caption}</span>
            ) : null}
          </>
        );

        return (
          <div
            key={rung.job.id}
            className="absolute right-0 left-0"
            style={{ top: rowTop, height: NODE, transform: 'translateY(-50%)' }}
            onMouseEnter={interactive ? () => setHoveredJobId(rung.job.id) : undefined}
            onMouseLeave={
              interactive
                ? () => setHoveredJobId((current) => (current === rung.job.id ? null : current))
                : undefined
            }
          >
            {interactive ? (
              <button
                type="button"
                data-testid={`trajectory-job-${rung.job.id}`}
                aria-label={`View ${rung.job.title}`}
                onClick={selectJob}
                onFocus={() => setHoveredJobId(rung.job.id)}
                onBlur={() => setHoveredJobId((current) => (current === rung.job.id ? null : current))}
                className="absolute inset-0 cursor-pointer border-0 bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-arm-teal-soft"
              />
            ) : null}
            <div
              className="pointer-events-none absolute grid place-items-center rounded-full"
              style={{
                left: xPct(CX),
                top: '50%',
                transform: 'translate(-50%, -50%)',
                ...nodeStyle,
              }}
            >
              <SparkleStar
                size={26}
                className={isCurrent ? accent.onAccent : 'text-text-on-dark-faint'}
                style={{
                  filter: isCurrent ? `drop-shadow(0 0 6px ${accent.glow})` : undefined,
                }}
              />
            </div>
            <div
              className="pointer-events-none absolute flex max-w-[calc(100%-180px)] flex-col gap-space-0"
              style={{ left: xPct(LABEL_X), top: '50%', transform: 'translateY(-50%)' }}
            >
              {labelBody}
            </div>
          </div>
        );
      })}
    </div>
  );
}
