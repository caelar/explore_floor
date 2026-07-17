import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'hero' | 'neutral' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

// Tokens only — no literals. Phase 0 styling is intentionally plain; the real button
// variants come from the Figma foundation set in Phase 1+.
const VARIANTS: Record<Variant, string> = {
  primary: 'cursor-pointer rounded-md px-space-4 py-space-2 font-body text-body bg-arm-gold text-near-black hover:bg-arm-gold-soft',
  // Figma 1368:450 — 20px radius, 30px horizontal padding, 14/36 type.
  hero: 'cursor-pointer h-9 rounded-cta px-cta-x py-0 font-body text-small font-medium leading-9 tracking-[0.28px] bg-arm-gold text-near-black hover:bg-arm-gold-soft',
  neutral: 'cursor-pointer rounded-md px-space-4 py-space-2 font-body text-body border border-border-default bg-bg text-text-default hover:bg-bg-section',
  ghost: 'cursor-pointer rounded-md px-space-4 py-space-2 font-body text-body bg-transparent text-text-muted hover:text-text-default',
};

export function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      className={`transition-colors ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
