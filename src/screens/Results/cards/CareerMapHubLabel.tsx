import { motion } from 'motion/react';
import type { KeyboardEvent } from 'react';

import { roleDetails } from '@/data';
import { MAP_BUBBLE_LABEL, MAP_HUB_ICON, MAP_ROLE_COLOR_HEX } from '@/data/careerMapArt';
import type { CareerMapRoleLayout } from '@/lib';
import { durations, easings } from '@/lib';

// Hub label as native SVG text — explicit y positions in viewBox units stay locked to each hub.

const MAP_ENTRANCE_LABEL_DURATION = durations.reveal;

interface CareerMapHubLabelProps {
  role: CareerMapRoleLayout;
  pct: number;
  entranceDelay?: number;
  entrancePlaying?: boolean;
  reduce?: boolean;
  onSelect: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

function hubLabelLayout(role: CareerMapRoleLayout) {
  const d = role.r * 2;
  const l = MAP_BUBBLE_LABEL;
  const s = 1;
  const iconSize = d * l.icon * s;
  const nameSize = d * l.name * s;
  const pctSize = d * l.pct * s;
  const gap = d * l.gap * s;
  const nameH = nameSize * l.nameLine;
  const pctH = pctSize * l.pctLine;
  const total = iconSize + gap + nameH + gap + pctH;
  const top = role.cy - total / 2;

  return {
    iconY: top + iconSize / 2,
    nameY: top + iconSize + gap + nameH / 2,
    pctY: top + iconSize + gap + nameH + gap + pctH / 2,
    iconSize,
    nameSize,
    pctSize,
  };
}

export function CareerMapHubLabel({
  role,
  pct,
  entranceDelay = 0,
  entrancePlaying = false,
  reduce = false,
  onSelect,
  onHoverStart,
  onHoverEnd,
}: CareerMapHubLabelProps) {
  const color = MAP_ROLE_COLOR_HEX[role.category];
  const name = roleDetails[role.category].roleName;
  const layout = hubLabelLayout(role);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <motion.g
      role="button"
      tabIndex={0}
      data-testid={`map-bubble-${role.category}`}
      data-map-interactive
      aria-label={`${name}, ${pct} percent match`}
      className="map-hub-label"
      style={{ cursor: 'pointer' }}
      initial={entrancePlaying ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{
        delay: entrancePlaying ? entranceDelay : 0,
        duration: reduce ? durations.instant : MAP_ENTRANCE_LABEL_DURATION,
        ease: easings.soft,
      }}
      onClick={onSelect}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onKeyDown={onKeyDown}
    >
      <circle cx={role.cx} cy={role.cy} r={role.r} fill="transparent" pointerEvents="all" />
      <text
        x={role.cx}
        y={layout.iconY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={layout.iconSize}
        fontFamily="Material Icons"
        fill={color}
        pointerEvents="none"
      >
        {MAP_HUB_ICON[role.category]}
      </text>
      <text
        x={role.cx}
        y={layout.nameY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={layout.nameSize}
        fontFamily="Montserrat, system-ui, sans-serif"
        fontWeight={700}
        fill={color}
        pointerEvents="none"
      >
        {name}
      </text>
      <text
        x={role.cx}
        y={layout.pctY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={layout.pctSize}
        fontFamily="Montserrat, system-ui, sans-serif"
        fontWeight={700}
        fill="#ffffff"
        pointerEvents="none"
      >
        {pct}%
      </text>
    </motion.g>
  );
}
