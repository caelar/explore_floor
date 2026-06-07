import { motion, useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, SegmentedControl } from '@/components';
import { flowList } from '@/data';
import { durations, easings } from '@/lib';
import { gsap, useGSAP } from '@/lib/gsap';
import { LandingSceneHint } from '@/scene/LandingSceneHint';
import { useFlow, useSessionStore } from '@/state';

// Landing: the frame + CTA, with a soft hint of the assembly-line scene below it. Motion owns the
// content entrance (and the CTA); GSAP owns the scene's DrawSVG line-draw reveal — different
// nodes, so the two engines never touch the same property (scene-motion ownership rule).
// The flow switcher is a researcher control for the question-structure study (DATA_MODEL §17):
// flipped here before the laptop is handed over; the choice survives "Start over". The CTA
// routes by flow kind — classic walks the Phase 1 sort, the study flows enter the step runner.
export function Landing() {
  const navigate = useNavigate();
  const startSession = useSessionStore((s) => s.startSession);
  const flowId = useSessionStore((s) => s.flowId);
  const selectFlow = useSessionStore((s) => s.selectFlow);
  const flow = useFlow();
  const { landingCopy } = flow;
  const reduce = !!useReducedMotion();
  const sceneRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Only draw the lines in when motion is welcome; reduced-motion users see them already drawn.
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.scene-draw', {
          drawSVG: 0,
          duration: durations.glide,
          stagger: 0.06,
          ease: 'power1.inOut',
        });
      });
    },
    { scope: sceneRef },
  );

  const begin = () => {
    startSession();
    navigate(flow.kind === 'classic' ? '/sort' : '/flow');
  };

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col items-center justify-center gap-space-6 p-space-6 text-center">
      <motion.div
        className="flex flex-col items-center gap-space-4"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: durations.glide, ease: easings.soft }}
      >
        <p className="text-overline uppercase text-text-faint">{landingCopy.overline}</p>
        <h1 className="font-heading text-h1 text-text-strong">{landingCopy.heading}</h1>
        <p className="max-w-sm text-body text-text-muted">{landingCopy.description}</p>
        <Button onClick={begin} data-testid="start-cta">
          {landingCopy.cta}
        </Button>

        <SegmentedControl
          label="Quiz flow"
          options={flowList.map((f) => ({ id: f.id, label: f.name }))}
          value={flowId}
          onChange={selectFlow}
          data-testid="flow"
        />
      </motion.div>

      <div ref={sceneRef} className="w-full max-w-md" aria-hidden="true">
        <LandingSceneHint />
      </div>
    </main>
  );
}
