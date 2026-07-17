import { Link } from 'react-router-dom';

import { Icon } from './Icon';

// The RC.org top nav (D-029 / VISUAL_REARCHITECTURE.md). The real finalized TopNav, ported from the
// dashboard repo (career_dashboard/src/shell/TopNav): a 60px dark utility bar — the RC brand mark, a
// centered scoped search, and a profile pill. Search + profile are placeholder chrome (no backend /
// no auth per repo scope); the prototype has no /profile route, so the pill is non-interactive.
export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 h-nav shrink-0 border-b border-glass-border bg-near-black">
      <div className="flex h-full w-full items-center gap-space-3 px-space-3">
        <Link
          to="/"
          aria-label="RoboticsCareer.org home"
          className="group flex shrink-0 items-center no-underline"
        >
          <img
            src={`${import.meta.env.BASE_URL}rc_logo_white_text.png`}
            alt="RoboticsCareer.org"
            className="h-10 w-auto shrink-0 transition-opacity duration-100 group-hover:opacity-90"
          />
        </Link>

        {/* Centered scoped search — placeholder chrome (no backend per scope). */}
        <div className="flex min-w-0 flex-1 justify-center">
          <div className="flex h-10 w-full max-w-[440px] items-center gap-space-1 rounded-md border border-glass-border bg-glass-fill px-space-2">
            <Icon name="search" size={16} className="shrink-0 text-text-on-dark-faint" />
            <input
              type="search"
              aria-label="Search"
              placeholder="Search roles, jobs, and programs"
              className="w-full bg-transparent font-body text-small text-text-on-dark placeholder:text-text-on-dark-faint focus:outline-none"
            />
            <Icon name="sliders" size={16} className="shrink-0 text-text-on-dark-faint" />
          </div>
        </div>

        {/* Profile pill — no auth; a generic account stub for chrome fidelity. */}
        <div className="flex shrink-0 items-center gap-space-1 rounded-full bg-glass-fill py-space-0 pl-space-0 pr-space-2 text-text-on-dark">
          <span
            className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-arm-gold to-gold-deep text-near-black"
            aria-hidden
          >
            <Icon name="user" size={15} />
          </span>
          <span className="hidden font-body text-small font-medium sm:inline">Guest</span>
          <Icon name="chevron-d" size={12} className="text-text-on-dark-faint" />
        </div>
      </div>
    </header>
  );
}
