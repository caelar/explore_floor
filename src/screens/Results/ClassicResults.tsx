import { motion, useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { roles } from '@/data';
import type { ArchetypeId, RoleId } from '@/data/types';
import { durations, easings, isLowSignal } from '@/lib';
import { RobotPlaceholder } from '@/scene/RobotPlaceholder';
import { useQuestionSet, useSessionStore } from '@/state';

import { Pedestal } from './Pedestal';
import { RoleCard } from './RoleCard';

// The classic conversion screen (PRD §5.4). Three role cards with the active one centered +
// full-sized; the robot stands on a pedestal above. "Trying on" a role — by tapping an
// alternative card or dragging the robot onto it — makes it active: the cards reflow (Motion
// `layout`, which owns results compare per scene-motion) and its four-part read becomes the
// prominent content. Rendered by Results.tsx when the classic flow is active.

export function ClassicResults() {
  const navigate = useNavigate();
  const reduce = !!useReducedMotion();

  // Results copy is owned by the active question set; roles/scores are shared data.
  const { resultsCopy } = useQuestionSet();
  const scoreResult = useSessionStore((s) => s.state.scoreResult);
  const currentlyTryingOn = useSessionStore((s) => s.state.currentlyTryingOn);
  const tryOnRole = useSessionStore((s) => s.tryOnRole);
  const reset = useSessionStore((s) => s.reset);

  // Card DOM nodes, so a dropped robot can be hit-tested against them.
  const cardRefs = useRef<Partial<Record<RoleId, HTMLElement | null>>>({});

  if (!scoreResult) {
    return (
      <main className="mx-auto flex min-h-full max-w-lg flex-col items-center justify-center gap-space-3 p-space-6 text-center">
        <h2 className="font-heading text-h2 text-text-strong">No results yet</h2>
        <p className="text-body text-text-muted">Sort your interests first and we&apos;ll match you.</p>
        <Link to="/" className="text-body text-arm-blue underline">
          Start the sort
        </Link>
      </main>
    );
  }

  const activeRoleId = currentlyTryingOn ?? scoreResult.primaryRole;
  const roleByArchetype = (archetype: ArchetypeId) =>
    roles.find((role) => role.archetypeId === archetype)!;
  const activeArchetype = roles.find((role) => role.id === activeRoleId)!.archetypeId;

  // Active role centered; the two alternatives flank it in rank order.
  const inactives = scoreResult.ranking.filter((archetype) => archetype !== activeArchetype);
  const displayRoles = [inactives[0], activeArchetype, inactives[1]].map(roleByArchetype);

  function handleRobotDragEnd(event: MouseEvent | TouchEvent | PointerEvent) {
    if (!('clientX' in event)) return;
    const { clientX, clientY } = event;
    for (const role of roles) {
      const rect = cardRefs.current[role.id]?.getBoundingClientRect();
      if (!rect) continue;
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        tryOnRole(role.id);
        return;
      }
    }
  }

  function handleRetake() {
    reset();
    navigate('/');
  }

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col items-center gap-space-5 p-space-5">
      <h2 className="font-heading text-h2 text-text-strong">{resultsCopy.heading}</h2>

      {isLowSignal(scoreResult) && (
        <p
          data-testid="low-signal"
          className="max-w-md rounded-md bg-bg-section p-space-3 text-center text-body text-text-muted"
        >
          {resultsCopy.lowSignal}
        </p>
      )}

      <Pedestal archetype={activeArchetype}>
        <motion.div
          data-testid="robot"
          drag={!reduce}
          dragSnapToOrigin
          dragElastic={0.3}
          whileDrag={{ scale: 1.05, zIndex: 10 }}
          onDragEnd={(event) => handleRobotDragEnd(event)}
          className="cursor-grab touch-none active:cursor-grabbing"
        >
          <RobotPlaceholder archetype={activeArchetype} />
        </motion.div>
      </Pedestal>
      <p className="text-small text-text-faint">{resultsCopy.compareHint}</p>

      <div className="flex w-full items-start justify-center gap-space-4">
        {displayRoles.map((role) => (
          <motion.div
            key={role.id}
            layout
            transition={reduce ? { duration: 0 } : { duration: durations.glide, ease: easings.soft }}
          >
            <RoleCard
              ref={(el) => {
                cardRefs.current[role.id] = el;
              }}
              role={role}
              pct={scoreResult.matchPercentages[role.archetypeId]}
              isActive={role.id === activeRoleId}
              onTryOn={tryOnRole}
            />
          </motion.div>
        ))}
      </div>

      <button
        type="button"
        data-testid="retake"
        onClick={handleRetake}
        className="text-small text-text-faint underline transition-colors hover:text-text-default"
      >
        {resultsCopy.retake}
      </button>
    </main>
  );
}
