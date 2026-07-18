import type { ReactNode } from 'react';

// A small glass pill used for the "what you chose" answer chips and the Tab-2 competency chips.
// `variant="job"` matches the job-overview skills chips (Figma 1386:494): bordered pill with
// body text. Tokens only (D-029).
export function Chip({
  children,
  variant = 'default',
}: {
  children: ReactNode;
  variant?: 'default' | 'job';
}) {
  const base =
    variant === 'job'
      ? 'rounded-sm border border-glass-border-soft bg-glass-fill px-space-2 py-space-1 font-body text-small text-text-on-dark-muted'
      : 'rounded-sm bg-glass-fill-strong px-space-2 py-space-1 font-body text-small text-text-on-dark-muted';

  return <span className={`inline-flex items-center gap-space-1 whitespace-nowrap ${base}`}>{children}</span>;
}
