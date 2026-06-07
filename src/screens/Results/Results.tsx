import { useFlow } from '@/state';

import { CategoryResults } from './category/CategoryResults';
import { ClassicResults } from './ClassicResults';
import { ExamResults } from './exam/ExamResults';

// /results dispatches by the active flow (DATA_MODEL §17). Each condition gets its own results
// presentation — part of what the study compares: classic keeps its three-role-card conversion
// screen; narrative gets the node map (explore by rings); exam gets the dashboard (bars +
// breakdown + your roles). One route either way, so retake/reset semantics stay identical.
export function Results() {
  const flow = useFlow();
  if (flow.kind === 'classic') return <ClassicResults />;
  if (flow.kind === 'exam') return <ExamResults />;
  return <CategoryResults />;
}
