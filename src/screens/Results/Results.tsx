import { useFlow } from '@/state';

import { CategoryResults } from './category/CategoryResults';
import { ClassicResults } from './ClassicResults';

// /results dispatches by the active flow's kind: the classic flow keeps its three-role-card
// conversion screen; the study flows get the shared category results (node map + role sheet,
// DATA_MODEL §17). One route either way, so retake/reset semantics stay identical.
export function Results() {
  const flow = useFlow();
  return flow.kind === 'classic' ? <ClassicResults /> : <CategoryResults />;
}
