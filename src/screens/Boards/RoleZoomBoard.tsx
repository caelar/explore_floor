import { MAP_ROLE_COLOR } from '@/data/careerMapArt';

// Board 3 — role zoom wayfinding + panel layout (CAREER_MAP_REVIEW.md CM-10/11/12). DEV-ONLY
// workshop scaffolding: miniature layout wireframes, real tokens, skeleton content. Each cell
// is a 16:9 stage showing where persistent context, the back controls, and the job panel live.

const teal = MAP_ROLE_COLOR.specialist;

/** Mini cluster: hub + 4 jobs, optionally squeezed into the right portion of the stage. */
function MiniCluster({ cxShift = 0, scale = 1 }: { cxShift?: number; scale?: number }) {
  const hub = { cx: 340 + cxShift, cy: 160 };
  const jobs = [
    { cx: hub.cx + 150 * scale, cy: hub.cy - 75 * scale, label: 'Robotics Programmer' },
    { cx: hub.cx - 130 * scale, cy: hub.cy - 95 * scale, label: 'Robotics Engineer' },
    { cx: hub.cx - 120 * scale, cy: hub.cy + 85 * scale, label: 'Mechatronics Engineer' },
    { cx: hub.cx + 125 * scale, cy: hub.cy + 95 * scale, label: 'Automation Engineer' },
  ];
  return (
    <g>
      {jobs.map((j, i) => (
        <g key={i}>
          <path
            d={`M ${hub.cx} ${hub.cy} L ${j.cx} ${j.cy}`}
            stroke={teal}
            strokeOpacity={0.3}
            strokeWidth={1.2}
            strokeDasharray="3 3"
          />
          <circle cx={j.cx} cy={j.cy} r={13 * scale} fill={teal} fillOpacity={0.3} />
          <circle
            cx={j.cx}
            cy={j.cy}
            r={13 * scale}
            fill="none"
            stroke={teal}
            strokeOpacity={0.4}
          />
          <text
            x={j.cx}
            y={j.cy + 24 * scale}
            textAnchor="middle"
            fontSize={9}
            fontWeight={700}
            fontFamily="Montserrat, system-ui, sans-serif"
            fill="#7fe0f2"
          >
            {j.label}
          </text>
        </g>
      ))}
      <circle cx={hub.cx} cy={hub.cy} r={40 * scale} fill={teal} fillOpacity={0.3} />
      <circle cx={hub.cx} cy={hub.cy} r={40 * scale} fill="none" stroke={teal} strokeWidth={1.6} />
      <text
        x={hub.cx}
        y={hub.cy - 4}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fontFamily="Montserrat, system-ui, sans-serif"
        fill="#7fe0f2"
      >
        Specialist
      </text>
      <text
        x={hub.cx}
        y={hub.cy + 12}
        textAnchor="middle"
        fontSize={13}
        fontWeight={700}
        fontFamily="Montserrat, system-ui, sans-serif"
        fill="#ffffff"
      >
        30%
      </text>
    </g>
  );
}

/** Skeleton text bars for panel/rail content. */
function Skeleton({ x, y, widths, gap = 14 }: { x: number; y: number; widths: number[]; gap?: number }) {
  return (
    <g>
      {widths.map((w, i) => (
        <rect
          key={i}
          x={x}
          y={y + i * gap}
          width={w}
          height={7}
          rx={3.5}
          fill="rgb(255 255 255 / 0.18)"
        />
      ))}
    </g>
  );
}

function Chip({ x, y, w, label }: { x: number; y: number; w: number; label: string }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={24}
        rx={6}
        fill="rgb(38 38 38 / 0.85)"
        stroke="rgb(255 255 255 / 0.12)"
      />
      <text
        x={x + 10}
        y={y + 16}
        fontSize={10}
        fontFamily="Montserrat, system-ui, sans-serif"
        fill="rgb(255 255 255 / 0.75)"
      >
        {label}
      </text>
    </g>
  );
}

interface ZoomVariant {
  id: string;
  label: string;
  note: string;
  draw: () => React.ReactNode;
}

const PANEL_FILL = 'rgb(38 38 38 / 0.92)';
const PANEL_STROKE = 'rgb(255 255 255 / 0.12)';

const VARIANTS: ZoomVariant[] = [
  {
    id: 'current',
    label: 'A — Current build (baseline)',
    note: 'Orbs in space, one floating text link. No role summary, no job list, no stable exit.',
    draw: () => (
      <>
        <MiniCluster />
        <text
          x={16}
          y={26}
          fontSize={10}
          fontFamily="Montserrat, system-ui, sans-serif"
          fill="rgb(255 255 255 / 0.6)"
        >
          &lsaquo; Back to the map
        </text>
      </>
    ),
  },
  {
    id: 'rail',
    label: 'B — Slim context rail (ledger lead)',
    note: 'Persistent rail on role/job zoom: role + %, the four jobs (click to zoom), phase back + stable exit. The map keeps its continuous-space feel to the right.',
    draw: () => (
      <>
        <rect x={0} y={0} width={168} height={320} fill={PANEL_FILL} stroke={PANEL_STROKE} />
        <Chip x={12} y={12} w={110} label="< Back to the map" />
        <text
          x={12}
          y={64}
          fontSize={12}
          fontWeight={700}
          fontFamily="Montserrat, system-ui, sans-serif"
          fill="#7fe0f2"
        >
          Specialist &middot; 30%
        </text>
        <Skeleton x={12} y={76} widths={[130, 96]} gap={12} />
        <text
          x={12}
          y={124}
          fontSize={10}
          fontWeight={700}
          fontFamily="Montserrat, system-ui, sans-serif"
          fill="rgb(255 255 255 / 0.85)"
        >
          Jobs in this path (4)
        </text>
        {['Robotics Programmer', 'Robotics Engineer', 'Mechatronics Eng.', 'Automation Eng.'].map(
          (j, i) => (
            <g key={j}>
              <rect
                x={12}
                y={134 + i * 32}
                width={144}
                height={26}
                rx={6}
                fill="rgb(255 255 255 / 0.06)"
                stroke={PANEL_STROKE}
              />
              <text
                x={22}
                y={151 + i * 32}
                fontSize={9}
                fontFamily="Montserrat, system-ui, sans-serif"
                fill="rgb(255 255 255 / 0.8)"
              >
                {j}
              </text>
            </g>
          ),
        )}
        <Chip x={12} y={278} w={130} label="< Back to your results" />
        <MiniCluster cxShift={40} scale={0.9} />
      </>
    ),
  },
  {
    id: 'camera',
    label: 'C — Docked panel + panel-aware camera',
    note: 'CM-11 fix inside the current layout: the camera fits the cluster into the space the panel leaves, so all four jobs stay visible when a job is open.',
    draw: () => (
      <>
        <rect x={0} y={0} width={230} height={320} fill={PANEL_FILL} stroke={PANEL_STROKE} />
        <Chip x={14} y={12} w={44} label="Job" />
        <text
          x={14}
          y={62}
          fontSize={13}
          fontWeight={700}
          fontFamily="Montserrat, system-ui, sans-serif"
          fill="#ffffff"
        >
          Robotics Programmer
        </text>
        <Skeleton x={14} y={78} widths={[190, 200, 160, 120, 180, 140]} />
        <Chip x={14} y={278} w={90} label="Expand page" />
        <MiniCluster cxShift={130} scale={0.72} />
      </>
    ),
  },
  {
    id: 'overlay',
    label: 'D — Overlay panel',
    note: 'Panel floats over the map with a scrim; the cluster stays where it was. Cheapest camera, some occlusion.',
    draw: () => (
      <>
        <MiniCluster cxShift={60} />
        <rect x={0} y={0} width={640} height={320} fill="rgb(23 23 23 / 0.45)" />
        <rect
          x={24}
          y={20}
          width={230}
          height={280}
          rx={10}
          fill={PANEL_FILL}
          stroke={PANEL_STROKE}
        />
        <text
          x={40}
          y={58}
          fontSize={13}
          fontWeight={700}
          fontFamily="Montserrat, system-ui, sans-serif"
          fill="#ffffff"
        >
          Robotics Programmer
        </text>
        <Skeleton x={40} y={74} widths={[190, 180, 150, 190, 120]} />
      </>
    ),
  },
  {
    id: 'sheet',
    label: 'E — Bottom sheet',
    note: 'Summary sheet slides up under the cluster; drag up (or Expand) for the full read. Touch-friendly, keeps the whole cluster visible.',
    draw: () => (
      <>
        <MiniCluster scale={0.85} />
        <rect x={0} y={222} width={640} height={98} fill={PANEL_FILL} stroke={PANEL_STROKE} />
        <rect x={296} y={230} width={48} height={4} rx={2} fill="rgb(255 255 255 / 0.3)" />
        <text
          x={20}
          y={256}
          fontSize={12}
          fontWeight={700}
          fontFamily="Montserrat, system-ui, sans-serif"
          fill="#ffffff"
        >
          Robotics Programmer
        </text>
        <Skeleton x={20} y={268} widths={[420, 360]} gap={13} />
        <Chip x={520} y={248} w={100} label="Full overview >" />
      </>
    ),
  },
  {
    id: 'fullpage',
    label: 'F — Full job page (old convention)',
    note: 'CM-12: jobs get the same full-bleed treatment roles get. Map recedes entirely; strongest reading surface, weakest sense of place.',
    draw: () => (
      <>
        <rect x={0} y={0} width={640} height={320} fill="var(--color-near-black)" />
        <Chip x={16} y={12} w={110} label="< Back to the map" />
        <text
          x={16}
          y={70}
          fontSize={18}
          fontWeight={700}
          fontFamily="Montserrat, system-ui, sans-serif"
          fill="#ffffff"
        >
          Robotics Programmer
        </text>
        <Skeleton x={16} y={92} widths={[280, 300, 240]} />
        <rect x={16} y={150} width={190} height={70} rx={8} fill="rgb(255 255 255 / 0.06)" stroke={PANEL_STROKE} />
        <rect x={220} y={150} width={190} height={70} rx={8} fill="rgb(255 255 255 / 0.06)" stroke={PANEL_STROKE} />
        <Skeleton x={16} y={244} widths={[420, 380, 340]} />
      </>
    ),
  },
];

export function RoleZoomBoard() {
  return (
    <div className="flex flex-col gap-space-6">
      <p className="max-w-read font-body text-body text-text-on-dark-muted">
        What the old constellation had and the map lost: where you are, what you can do next, and a
        way back that never moves. Variant B is the ledger&rsquo;s leading candidate; C&ndash;F are
        the CM-11/12 panel options.
      </p>
      <div className="grid grid-cols-1 gap-space-5 xl:grid-cols-2">
        {VARIANTS.map((v) => (
          <section key={v.id} className="flex flex-col gap-space-2">
            <h2 className="font-heading text-h4 font-bold text-text-on-dark">{v.label}</h2>
            <p className="font-body text-small text-text-on-dark-muted">{v.note}</p>
            <svg
              viewBox="0 0 640 320"
              className="w-full rounded-lg border border-glass-border"
              style={{ background: 'var(--color-near-black)' }}
            >
              {v.draw()}
            </svg>
          </section>
        ))}
      </div>
    </div>
  );
}
