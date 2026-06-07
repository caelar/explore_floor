import { flows } from '@/data';
import type { Flow } from '@/data/types';

import { useSessionStore } from './sessionStore';

/** The active flow — kind, steps, and the copy it owns (DATA_MODEL §17).
 *  Reactive: re-renders consumers when the landing switcher changes the flow. */
export function useFlow(): Flow {
  const id = useSessionStore((s) => s.flowId);
  return flows[id];
}
