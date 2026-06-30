import { motion } from 'motion/react';

import { ROLE_ACCENT } from '@/components/categoryAccent';
import type { CategoryId, Job } from '@/data/types';
import { CONSTELLATION_VIEW, constellationLayout, durations, easings } from '@/lib';

import { ConstellationNode } from './ConstellationNode';

// The job constellation for a role (D-029 Phase F): the role itself as an accent-filled center,
// the role's featured jobs ringing it as nodes (count-aware polar layout from lib/constellationLayout),
// and dashed edges from the center out to each node. Positions come from the pure layout in a fixed
// CONSTELLATION_VIEW space, mapped to percentages so the field scales with its container (height-driven
// like BubbleField, desktop-first; responsive is Phase G). Opening a job dims the others + their edges.

interface ConstellationFieldProps {
  category: CategoryId;
  roleName: string;
  pct: number;
  jobs: Job[];
  selectedJob: number | null;
  reduce: boolean;
  onSelect: (jobIndex: number) => void;
}

const { width: VW, height: VH } = CONSTELLATION_VIEW;
const xPct = (v: number) => `${(v / VW) * 100}%`;
const yPct = (v: number) => `${(v / VH) * 100}%`;
const LABEL_W = 240; // label box width (view units), centered under each node

export function ConstellationField({
  category,
  roleName,
  pct,
  jobs,
  selectedJob,
  reduce,
  onSelect,
}: ConstellationFieldProps) {
  const { center, nodes } = constellationLayout(jobs.length);
  const accent = ROLE_ACCENT[category];
  const jobActive = selectedJob !== null;

  return (
    <div
      className="relative mx-auto max-h-full"
      // Aspect-locked to its WIDTH (the parent flex cell is min-w-0, so the field shrinks to the
      // space left of the 404px rail instead of overflowing right). Width caps at the
      // --container-constellation token; height follows the aspect ratio so the ring stays circular.
      // Desktop-first; the responsive story is Phase G.
      style={{
        aspectRatio: `${VW} / ${VH}`,
        width: 'min(100%, var(--container-constellation))',
      }}
      data-testid="constellation-field"
    >
      {/* dashed edges, center rim → node rim */}
      <svg aria-hidden viewBox={`0 0 ${VW} ${VH}`} className="absolute inset-0 h-full w-full" fill="none">
        {nodes.map((n) => {
          const opacity = jobActive ? (selectedJob === n.index ? 0.7 : 0.18) : 0.5;
          return (
            <line
              key={n.index}
              x1={n.edge.x1}
              y1={n.edge.y1}
              x2={n.edge.x2}
              y2={n.edge.y2}
              stroke="var(--color-constellation-line)"
              strokeWidth={1.5}
              strokeDasharray="7 7"
              strokeOpacity={opacity}
            />
          );
        })}
      </svg>

      {/* role center */}
      <motion.div
        className={`absolute flex flex-col items-center justify-center rounded-full px-space-2 text-center ${accent.bg} ${accent.onAccent}`}
        style={{
          left: xPct(center.cx - center.r),
          top: yPct(center.cy - center.r),
          width: xPct(center.r * 2),
          aspectRatio: '1 / 1',
          // Soft role glow; offset/blur are decorative literals (no shadow token for a colored glow).
          boxShadow: `0 0 60px ${accent.glow}`,
        }}
        initial={reduce ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduce ? 0 : durations.glide, ease: easings.soft }}
        data-testid="constellation-center"
      >
        {/* Fluid center text: scales with the (viewport-sized) circle, so it has no fixed type token. */}
        <span className="font-heading font-bold leading-tight" style={{ fontSize: 'clamp(1rem, 1.6vw, 1.4rem)' }}>
          {roleName}
        </span>
        <span
          className="font-heading font-bold leading-none tabular-nums"
          style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.6rem)' }}
        >
          {pct}%
        </span>
      </motion.div>

      {/* job nodes */}
      {nodes.map((n) => (
        <ConstellationNode
          key={jobs[n.index].id}
          job={jobs[n.index]}
          accent={accent}
          index={n.index}
          active={selectedJob === n.index}
          dimmed={jobActive && selectedJob !== n.index}
          reduce={reduce}
          style={{ left: xPct(n.cx - n.r), top: yPct(n.cy - n.r), width: xPct(n.r * 2) }}
          onClick={() => onSelect(n.index)}
        />
      ))}

      {/* node labels (below each node; titles run wider than the node circle). With the 4-corner
          layout every below-label clears the center orb — the corner nodes sit far enough to the
          sides that their labels fall outside it (reference parity). */}
      {nodes.map((n) => {
        const dimmed = jobActive && selectedJob !== n.index;
        // Non-dimmed labels carry the role's soft accent tint (per the reference) so the ring reads
        // as one role's constellation; only the backgrounded (another job open) labels fade to faint.
        const tone = dimmed ? 'text-text-on-dark-faint' : accent.textSoft;
        return (
          <span
            key={`label-${jobs[n.index].id}`}
            aria-hidden
            className={`pointer-events-none absolute text-center font-heading text-small font-bold leading-tight transition-colors ${tone}`}
            style={{ left: xPct(n.cx - LABEL_W / 2), top: yPct(n.cy + n.r + 10), width: xPct(LABEL_W) }}
          >
            {jobs[n.index].title}
          </span>
        );
      })}
    </div>
  );
}
