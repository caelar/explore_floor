import type { ReactNode } from 'react';

// The results sheet: a centered, internally-scrolling translucent panel that floats over the shared
// AmbientField (so cards / compare share the same orb background). A sticky glass header (the
// control bar) pins a constant gap below the nav; the body scrolls up under it, the blur showing
// the content behind. The body fills to the viewport while there's more to read; only at the end
// does it scroll up to reveal the rounded bottom, which rests with a matching bottom gap.
//
// The centering column is pointer-events-none except the panel itself, so on the cards view clicks in
// the side gutters / the top-gap strip fall THROUGH to the gutter-nav layer behind it (reference
// parity: the panel sits over a full-bleed click target).
export function ResultsPanel({
  controlBar,
  children,
}: {
  controlBar: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="pointer-events-none relative z-10 mx-auto flex h-full w-full max-w-lg flex-col pt-space-5">
      <div className="pointer-events-auto flex min-h-0 flex-1 flex-col overflow-y-auto rounded-t-lg pb-space-5 shadow-dark-panel">
        <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-space-3 rounded-t-lg border border-glass-border-soft bg-glass-panel px-space-4 backdrop-blur-bar">
          {controlBar}
        </div>
        <div className="flex flex-col gap-space-5 rounded-b-lg border border-t-0 border-glass-border-soft bg-glass-panel px-space-4 py-space-5 backdrop-blur-panel">
          {children}
        </div>
      </div>
    </div>
  );
}
