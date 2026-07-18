import { MAP_ROLE_COLOR, MAP_ROLE_COLOR_HEX } from '@/data/careerMapArt';
import type { CategoryId } from '@/data/types';

// Board 2 — map overview information design (CAREER_MAP_REVIEW.md CM-05/06). DEV-ONLY workshop
// scaffolding. Sample result deliberately includes a TIE (specialist 30 / integrator 30): the
// hard requirement is that equal percentages read equal. Static SVG mocks, not the live field.

interface SampleRole {
  category: CategoryId;
  name: string;
  pct: number;
  cx: number;
  cy: number;
}

// Tie case: technician 40, specialist 30, integrator 30.
const ROLES: SampleRole[] = [
  { category: 'technician', name: 'Technician', pct: 40, cx: 250, cy: 190 },
  { category: 'specialist', name: 'Specialist', pct: 30, cx: 560, cy: 130 },
  { category: 'integrator', name: 'Integrator', pct: 30, cx: 470, cy: 320 },
];

/** Current build: size comes from the rank slot, not the % — the CM-05 lie. */
const RANK_SLOT_R = [66, 45, 45];

/** Area-true scaling: r ∝ sqrt(pct), tuned so 40% ≈ the old hero size. */
const pctRadius = (pct: number) => 10.4 * Math.sqrt(pct);

/** Four job dots around a hub, same spread every variant. */
const jobOffsets = [
  { dx: 105, dy: -62 },
  { dx: -98, dy: -78 },
  { dx: -88, dy: 78 },
  { dx: 96, dy: 88 },
];

const HUB_ICON: Record<CategoryId, string> = {
  technician: 'precision_manufacturing',
  specialist: 'code',
  integrator: 'assignment',
};

interface VariantSpec {
  id: string;
  label: string;
  note: string;
  radius: (role: SampleRole, rank: number) => number;
  jobDotOpacity: number; // 0 hides them
  labelNearest: boolean; // label the nearest job per hub
  distinctIcons: boolean;
}

const VARIANTS: VariantSpec[] = [
  {
    id: 'current',
    label: 'A — Current build (baseline)',
    note: 'Fixed rank-slot sizes: the two 30% roles render at different sizes. One shared arm icon. Twelve anonymous dots.',
    radius: (_role, rank) => RANK_SLOT_R[rank],
    jobDotOpacity: 1,
    labelNearest: false,
    distinctIcons: false,
  },
  {
    id: 'pct-dimmed',
    label: 'B — %-sized orbs, job dots dimmed',
    note: 'Radius tracks match % (area-true), ties read equal. Job dots recede to 25% until you zoom — the "dropping in" reveal survives.',
    radius: (role) => pctRadius(role.pct),
    jobDotOpacity: 0.25,
    labelNearest: false,
    distinctIcons: true,
  },
  {
    id: 'pct-hidden',
    label: 'C — %-sized orbs, job dots hidden at landing',
    note: 'Only the three role orbs + dashed stubs at overview (closest to the old orbs, grown). Jobs appear on zoom. Distinct hub icons from the mockup.',
    radius: (role) => pctRadius(role.pct),
    jobDotOpacity: 0,
    labelNearest: false,
    distinctIcons: true,
  },
  {
    id: 'pct-nearest',
    label: 'D — %-sized orbs, nearest job labeled',
    note: 'Dimmed dots plus one labeled job per hub as a teaser of what is inside each path.',
    radius: (role) => pctRadius(role.pct),
    jobDotOpacity: 0.35,
    labelNearest: true,
    distinctIcons: true,
  },
];

const JOB_LABELS: Record<CategoryId, string> = {
  technician: 'Robot Operator',
  specialist: 'Robotics Programmer',
  integrator: 'Robotics Integrator',
};

function VariantCanvas({ v }: { v: VariantSpec }) {
  return (
    <svg
      viewBox="0 0 760 440"
      className="w-full rounded-lg border border-glass-border"
      style={{ background: 'var(--color-near-black)' }}
    >
      {ROLES.map((role, rank) => {
        const r = v.radius(role, rank);
        const color = MAP_ROLE_COLOR[role.category];
        const hex = MAP_ROLE_COLOR_HEX[role.category];
        return (
          <g key={role.category}>
            {jobOffsets.map((o, i) => {
              const jx = role.cx + o.dx * (0.72 + r / 130);
              const jy = role.cy + o.dy * (0.72 + r / 130);
              return (
                <g key={i} opacity={v.jobDotOpacity}>
                  <path
                    d={`M ${role.cx + (o.dx > 0 ? r : -r)} ${role.cy} H ${jx} V ${jy + (o.dy > 0 ? -14 : 14)}`}
                    fill="none"
                    stroke={color}
                    strokeOpacity={0.35}
                    strokeWidth={1.4}
                    strokeDasharray="3 3"
                  />
                  <circle cx={jx} cy={jy} r={14} fill={color} fillOpacity={0.3} />
                  <circle
                    cx={jx}
                    cy={jy}
                    r={13.3}
                    fill="none"
                    stroke={color}
                    strokeOpacity={0.35}
                    strokeWidth={1.4}
                  />
                  {v.labelNearest && i === 0 ? (
                    <text
                      x={jx}
                      y={jy + 30}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight={700}
                      fontFamily="Montserrat, system-ui, sans-serif"
                      fill={hex}
                      opacity={Math.min(1, v.jobDotOpacity * 2.6)}
                    >
                      {JOB_LABELS[role.category]}
                    </text>
                  ) : null}
                </g>
              );
            })}
            {v.jobDotOpacity === 0
              ? jobOffsets.slice(0, 2).map((o, i) => (
                  <path
                    key={`stub-${i}`}
                    d={`M ${role.cx + (o.dx > 0 ? r : -r)} ${role.cy} h ${o.dx > 0 ? 34 : -34}`}
                    fill="none"
                    stroke={color}
                    strokeOpacity={0.3}
                    strokeWidth={1.4}
                    strokeDasharray="3 3"
                  />
                ))
              : null}
            <circle cx={role.cx} cy={role.cy} r={r} fill={color} fillOpacity={0.3} />
            <circle
              cx={role.cx}
              cy={role.cy}
              r={r - 1}
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeOpacity={0.8}
            />
            <text
              x={role.cx}
              y={role.cy - r * 0.34}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={r * 0.34}
              fontFamily="Material Icons"
              fill={hex}
            >
              {v.distinctIcons ? HUB_ICON[role.category] : HUB_ICON.technician}
            </text>
            <text
              x={role.cx}
              y={role.cy + r * 0.08}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={Math.max(11, r * 0.16)}
              fontWeight={700}
              fontFamily="Montserrat, system-ui, sans-serif"
              fill={hex}
            >
              {role.name}
            </text>
            <text
              x={role.cx}
              y={role.cy + r * 0.42}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={Math.max(15, r * 0.3)}
              fontWeight={700}
              fontFamily="Montserrat, system-ui, sans-serif"
              fill="#ffffff"
            >
              {role.pct}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function MapOverviewBoard() {
  return (
    <div className="flex flex-col gap-space-6">
      <p className="max-w-read font-body text-body text-text-on-dark-muted">
        Sample result is a deliberate tie: Technician 40, Specialist 30, Integrator 30. The hard
        requirement from the ledger: equal percentages must read equal. Variant A is the current
        build for reference.
      </p>
      <div className="grid grid-cols-1 gap-space-5 xl:grid-cols-2">
        {VARIANTS.map((v) => (
          <section key={v.id} className="flex flex-col gap-space-2">
            <h2 className="font-heading text-h4 font-bold text-text-on-dark">{v.label}</h2>
            <p className="font-body text-small text-text-on-dark-muted">{v.note}</p>
            <VariantCanvas v={v} />
          </section>
        ))}
      </div>
    </div>
  );
}
