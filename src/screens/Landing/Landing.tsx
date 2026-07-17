import { motion, useReducedMotion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components';
import { roleSelectLanding } from '@/data';
import { durations, easings } from '@/lib';
import { useFlow, useSessionStore } from '@/state';

import { LandingBackground } from './LandingBackground';

const LOGO = `${import.meta.env.BASE_URL}rc_logo_white_text.png`;

// Landing hero (Figma 1367:312): factory-floor illustration, centered logo + headline + CTA.

export function Landing() {
  const navigate = useNavigate();
  const devSeedLoading = useSessionStore((s) => s.devSeedLoading);
  const flowId = useSessionStore((s) => s.flowId);
  const flow = useFlow();
  const landingCopy = flowId === 'select' ? roleSelectLanding : flow.landingCopy;
  const reduce = !!useReducedMotion();

  const begin = () => {
    if (flowId === 'select') {
      navigate('/select');
      return;
    }
    navigate('/character');
  };

  const devToLoading = () => {
    devSeedLoading();
    navigate('/loading');
  };

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      <LandingBackground />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-[729px] flex-1 flex-col items-center justify-center gap-space-4 px-space-4 py-space-7 text-center"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: durations.glide, ease: easings.soft }}
      >
        <img src={LOGO} alt="RoboticsCareer.org" className="h-10 w-auto shrink-0" />
        <h1 className="font-heading text-h1 text-text-on-dark">{landingCopy.heading}</h1>
        <p className="max-w-md text-body text-text-on-dark-muted">{landingCopy.description}</p>
        <Button onClick={begin} variant="hero" data-testid="start-cta">
          {landingCopy.cta}
        </Button>
        <button
          type="button"
          onClick={devToLoading}
          data-testid="dev-skip-to-loading"
          className="font-body text-small text-text-on-dark-faint underline transition-colors hover:text-text-on-dark"
        >
          Dev: skip to loading
        </button>
      </motion.div>
    </main>
  );
}
