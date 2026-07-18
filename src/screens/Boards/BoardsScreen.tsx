import { useState } from 'react';

import { GlassBoard } from './GlassBoard';
import { MapOverviewBoard } from './MapOverviewBoard';
import { RoleZoomBoard } from './RoleZoomBoard';

// DEV-ONLY workshop route (/boards) for the career-map pre-merge review boards
// (docs/knowledge/CAREER_MAP_REVIEW.md §Workshop boards). Not a product screen: the route is
// registered only under import.meta.env.DEV and the whole folder is deleted once the three
// board decisions are recorded in the ledger.

const BOARDS = [
  { id: 'glass', label: '1 · Glass surfaces (CM-01/02/03)', el: <GlassBoard /> },
  { id: 'map', label: '2 · Map overview (CM-05/06)', el: <MapOverviewBoard /> },
  { id: 'zoom', label: '3 · Role zoom + panel (CM-10/11/12)', el: <RoleZoomBoard /> },
] as const;

export function BoardsScreen() {
  const [active, setActive] = useState<(typeof BOARDS)[number]['id']>('glass');
  const board = BOARDS.find((b) => b.id === active) ?? BOARDS[0];

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-space-5 px-space-3 py-space-5">
      <header className="flex flex-col gap-space-2">
        <h1 className="font-heading text-h3 font-bold text-text-on-dark">
          Career-map review boards
        </h1>
        <p className="font-body text-small text-text-on-dark-muted">
          Dev-only workshop route. Each board ends in a decision recorded in
          CAREER_MAP_REVIEW.md, then this route is deleted.
        </p>
        <nav className="flex flex-wrap gap-space-2">
          {BOARDS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setActive(b.id)}
              className={`rounded-md border px-space-3 py-space-1 font-body text-small transition-colors ${
                b.id === active
                  ? 'border-arm-gold bg-arm-gold font-medium text-near-black'
                  : 'border-glass-border bg-glass-fill text-text-on-dark hover:border-arm-gold'
              }`}
            >
              {b.label}
            </button>
          ))}
        </nav>
      </header>
      {board.el}
    </div>
  );
}
