import { motion, useReducedMotion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

import { CtaButton } from '@/components';
import { roleSelectLanding } from '@/data';
import { durations, easings } from '@/lib';
import { useFlow, useSessionStore } from '@/state';

// Landing: a type-led dark hero (D-029, Phase A — the line-art scene hint was retired with the
// conveyor concept). Motion owns the content entrance; there's no scene engine here anymore.
// For the virtual test round the on-screen controls are stripped to a single Start CTA, so a tester
// has no option but to begin the narrative quiz. The condition-switcher and the dev skip-to-results
// UI were removed, but their capabilities stay intact (the `selectFlow` store action, the `/select`
// route, and `devSeedResults` still exist) — the CTA still routes by condition, so restoring the
// switcher later re-enables the 'select' arm with no other change.
export function Landing() {
  const navigate = useNavigate();
  const startSession = useSessionStore((s) => s.startSession);
  const flowId = useSessionStore((s) => s.flowId);
  const flow = useFlow();
  const landingCopy = flowId === 'select' ? roleSelectLanding : flow.landingCopy;
  const reduce = !!useReducedMotion();

  const begin = () => {
    if (flowId === 'select') {
      navigate('/select');
      return;
    }
    startSession();
    navigate('/flow');
  };

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col items-center justify-center gap-space-6 px-space-4 py-space-7 text-center">
      <motion.div
        className="flex flex-col items-center gap-space-4"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: durations.glide, ease: easings.soft }}
      >
        <p className="text-overline text-text-on-dark-faint">{landingCopy.overline}</p>
        <h1 className="font-heading text-h1 text-text-on-dark">{landingCopy.heading}</h1>
        <p className="max-w-md text-body text-text-on-dark-muted">{landingCopy.description}</p>
        <CtaButton color="gold" size="lg" onClick={begin} data-testid="start-cta">
          {landingCopy.cta}
        </CtaButton>
      </motion.div>
    </main>
  );
}
