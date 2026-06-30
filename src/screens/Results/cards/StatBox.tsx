import type { ReactNode } from 'react';

// A salary / education stat card. Sentence-case label (no uppercase eyebrow — the mockup project's
// voice rule), then the value content. `compact` is the constellation side rail's small chip
// (tighter padding + value, reference parity); the default is the larger role/job-tab box. Tokens
// only (D-029).
export function StatBox({
  label,
  compact = false,
  children,
}: {
  label: string;
  compact?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex-1 rounded-lg border border-glass-border-soft bg-glass-fill ${
        compact ? 'px-space-3 py-space-2' : 'p-space-4'
      }`}
    >
      <p className="font-body text-small font-medium text-text-on-dark-faint">{label}</p>
      <div className={compact ? 'mt-space-1' : 'mt-space-2'}>{children}</div>
    </div>
  );
}
