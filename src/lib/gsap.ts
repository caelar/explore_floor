import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

// Register GSAP plugins once for the whole app (scene-motion discipline: register at app start,
// never inside a component). This is a DORMANT future seam: the Landing DrawSVG reveal (GSAP's
// last consumer) was removed at step-8 Phase A, so GSAP has zero live uses today — we still
// register useGSAP + DrawSVGPlugin so scene motion can return without re-plumbing. (The Phase-2
// conveyor / part-to-robot arcs that would have used MorphSVG + MotionPath are the documented
// cut — never built, never registered.)
gsap.registerPlugin(useGSAP, DrawSVGPlugin);

export { gsap, useGSAP };
