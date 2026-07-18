import { createHashRouter } from 'react-router-dom';

import { AppLayout } from '@/app/AppLayout';
import { BoardsScreen } from '@/screens/Boards/BoardsScreen';
import { CharacterSelect } from '@/screens/CharacterSelect';
import { FlowRunner } from '@/screens/Flow';
import { Landing } from '@/screens/Landing';
import { LoadingScreen } from '@/screens/Loading';
import { Results } from '@/screens/Results';
import { RoleSelect } from '@/screens/Select';

/** Navigation is driven by store actions + these routes, all nested under the dark AppLayout shell
 *  (header + dark canvas, D-029). /flow is the step runner for the narrative flow; /results renders
 *  the node-map results. /select is the standalone "skip the quiz" comparator — not a registered
 *  flow, no session state. HashRouter (not browser history) so static GitHub Pages hosting survives
 *  refresh and deep links under the /explore_floor/ subpath without server-side rewrites. */
export const router = createHashRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/character', element: <CharacterSelect /> },
      { path: '/flow', element: <FlowRunner /> },
      { path: '/loading', element: <LoadingScreen /> },
      { path: '/results', element: <Results /> },
      { path: '/select', element: <RoleSelect /> },
      // Dev-only workshop route for the career-map review boards (CAREER_MAP_REVIEW.md).
      // Not a product screen; deleted with src/screens/Boards once the decisions land.
      ...(import.meta.env.DEV ? [{ path: '/boards', element: <BoardsScreen /> }] : []),
    ],
  },
]);
