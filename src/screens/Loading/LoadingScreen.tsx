import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loadingCopy } from '@/data/loadingCopy';
import { durations, easings } from '@/lib';
import { useSessionStore } from '@/state';

import { LoadingMiniMap } from './LoadingMiniMap';

// Post-quiz loading interstitial (Figma 433:338): miniature career map stagger-in, progress bar,
// rotating status copy, then a brief hold and fade into results.

type LoadingPhase = 'running' | 'linger' | 'exit';

export function LoadingScreen() {
  const navigate = useNavigate();
  const reduce = !!useReducedMotion();
  const currentScreen = useSessionStore((s) => s.state.currentScreen);
  const categoryResult = useSessionStore((s) => s.state.categoryResult);
  const finishLoading = useSessionStore((s) => s.finishLoading);

  const duration = reduce ? durations.instant * 1000 : loadingCopy.durationMs;
  const lingerMs = reduce ? 0 : loadingCopy.lingerMs;
  const exitDuration = reduce ? durations.instant : durations.glide;

  const [phase, setPhase] = useState<LoadingPhase>('running');
  const [progress, setProgress] = useState(0);
  const exitHandled = useRef(false);

  // Bounce invalid sessions to landing, but allow the handoff to results after the exit fade.
  useEffect(() => {
    if (currentScreen === 'results') return;
    if (currentScreen !== 'loading' || !categoryResult) {
      navigate('/', { replace: true });
    }
  }, [currentScreen, categoryResult, navigate]);

  useEffect(() => {
    if (currentScreen !== 'loading') return;

    exitHandled.current = false;
    setPhase('running');
    setProgress(0);

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (elapsed < duration) {
        frame = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setPhase('linger');
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [currentScreen, duration]);

  useEffect(() => {
    if (phase !== 'linger') return;

    const timer = window.setTimeout(() => setPhase('exit'), lingerMs);
    return () => window.clearTimeout(timer);
  }, [phase, lingerMs]);

  const handleExitComplete = () => {
    if (exitHandled.current || phase !== 'exit') return;
    exitHandled.current = true;
    navigate('/results', { state: { fromLoading: true } });
    finishLoading();
  };

  if (currentScreen !== 'loading' || !categoryResult) return null;

  const messageIndex = Math.min(
    loadingCopy.messages.length - 1,
    Math.floor((progress / 100) * loadingCopy.messages.length),
  );

  return (
    <motion.main
      className="mx-auto flex w-full max-w-[662px] flex-1 flex-col items-center justify-center gap-space-5 px-space-5"
      data-testid="loading-screen"
      aria-busy={phase !== 'exit'}
      aria-live="polite"
      initial={false}
      animate={{ opacity: phase === 'exit' ? 0 : 1 }}
      transition={{ duration: exitDuration, ease: easings.soft }}
      onAnimationComplete={handleExitComplete}
    >
      <LoadingMiniMap
        ranking={categoryResult.ranking}
        matchPercentages={categoryResult.matchPercentages}
        reduce={reduce}
      />

      <div className="w-full">
        <div className="h-4 overflow-hidden rounded-full bg-white/50">
          <motion.div
            className="h-full rounded-full bg-arm-gold"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: reduce ? durations.instant : durations.snap, ease: easings.soft }}
            data-testid="loading-progress"
          />
        </div>
      </div>

      <p className="font-body text-small font-bold text-text-on-dark" data-testid="loading-percent">
        {progress}%
      </p>
      <p className="font-body text-body text-text-on-dark" data-testid="loading-message">
        {loadingCopy.messages[messageIndex]}
      </p>
    </motion.main>
  );
}
