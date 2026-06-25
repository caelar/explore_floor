interface SegmentedControlOption<T extends string> {
  id: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  /** Accessible name for the group — announced, not rendered (the control stays visually bare). */
  label: string;
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (id: T) => void;
  'data-testid'?: string;
}

// Tokens only — no literals. The active segment is deliberately QUIET (section fill + strong
// text, not brand-yellow): arm-gold is reserved for the primary action, and this control must
// stay subordinate to the CTA it sits near (design-review 2026-06-04). Built for the
// researcher-facing question-set switcher on Landing, but generic.
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  'data-testid': testId,
}: SegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={label} data-testid={testId} className="flex items-center">
      <div className="flex overflow-hidden rounded-md border border-border-default">
        {options.map((option) => {
          const active = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              data-testid={testId ? `${testId}-${option.id}` : undefined}
              onClick={() => onChange(option.id)}
              className={`px-space-3 py-space-1 font-body text-small transition-colors duration-100 ${
                active
                  ? 'bg-bg-section font-medium text-text-strong'
                  : 'bg-bg text-text-muted hover:text-text-default'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
