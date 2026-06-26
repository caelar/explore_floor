import { createHashRouter } from 'react-router-dom';

import { FlowRunner } from '@/screens/Flow';
import { Landing } from '@/screens/Landing';
import { Results } from '@/screens/Results';
import { RoleSelect } from '@/screens/Select';

/** Navigation is driven by store actions + these routes. /flow is the step runner for the
 *  narrative flow; /results renders the node-map results. /select is the standalone
 *  "skip the quiz" comparator — not a registered flow, no session state.
 *  HashRouter (not browser history) so static GitHub Pages hosting survives refresh and
 *  deep links under the /explore_floor/ subpath without server-side rewrites. */
export const router = createHashRouter([
  { path: '/', element: <Landing /> },
  { path: '/flow', element: <FlowRunner /> },
  { path: '/results', element: <Results /> },
  { path: '/select', element: <RoleSelect /> },
]);
