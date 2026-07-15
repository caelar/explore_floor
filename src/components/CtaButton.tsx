import type { ButtonHTMLAttributes, ReactNode } from 'react';

// The shared rectangular call-to-action, the code mirror of the ecosystem `CtaButton` component set
// (componentization run, D-049 / registry §1). It replaces the Phase-0 `Button` placeholder for the
// primary CTAs so height, radius, padding, and weight stay coupled to the control scale and can't
// drift per screen. `color` picks the fill (gold encouragement / teal interactive / outline), `size`
// couples h-control-* + px + text; width/placement (w-full / shrink-0) stay a className passthrough.
// Radius is `rounded-md` (8px) — the D-043 value the Figma master settled on. Children may include a
// leading/trailing <Icon> (the set's icon slots, D-046); the gap is built in.

type Color = 'gold' | 'teal' | 'outline';
type Size = 'lg' | 'md';

const colorClasses: Record<Color, string> = {
  gold: 'bg-arm-gold text-near-black hover:bg-arm-gold-soft',
  teal: 'bg-arm-teal text-white hover:bg-arm-teal-soft',
  outline: 'border border-glass-border bg-glass-fill text-text-on-dark hover:bg-glass-fill-strong',
};

const sizeClasses: Record<Size, string> = {
  lg: 'h-control-lg px-space-3 text-small',
  // `text-small` (not the dashboard's `text-label`, which isn't a token in this repo's scale —
  // h1–h5 / body / small / overline); md differs from lg by height + padding, same type step.
  md: 'h-control-md px-space-2 text-small',
};

interface CtaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: Color;
  size?: Size;
  children: ReactNode;
}

export function CtaButton({
  color = 'teal',
  size = 'lg',
  className = '',
  children,
  ...rest
}: CtaButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-space-1 rounded-md font-body font-medium transition-colors ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
