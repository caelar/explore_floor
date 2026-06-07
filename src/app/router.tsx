import { createBrowserRouter } from 'react-router-dom';

import { Build } from '@/screens/Build';
import { FlowRunner } from '@/screens/Flow';
import { Landing } from '@/screens/Landing';
import { Results } from '@/screens/Results';
import { Sort } from '@/screens/Sort';

/** Navigation is driven by store actions + these routes. /sort and /build belong to the
 *  classic flow; /flow is the step runner for the study flows; /results dispatches by kind. */
export const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/sort', element: <Sort /> },
  { path: '/flow', element: <FlowRunner /> },
  { path: '/build', element: <Build /> },
  { path: '/results', element: <Results /> },
]);
