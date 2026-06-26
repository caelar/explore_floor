import { SCREENER_COPY, SCREENER_LEVELS } from '@/data/flows/screeners';
import { roleDetails } from '@/data/roleDetails';
import type { CategoryId, FlowId } from '@/data/types';

// Screener fit (DATA_MODEL §17, D-020). The initial screener questions gauge how much
// school / pay the user is after (0/1/2); we compare that appetite to the matched role's
// ladder (roleDetails educationLevel / payLevel) to surface an always-on fit line on
// results — a green "lines up" or an amber "heads up, this asks for more". Pure, no React,
// fully unit-testable — mirrors the scoring engine's isolation. The levels + copy are data
// (src/data/flows/screeners.ts); this only derives and compares.

export interface ScreenerProfile {
  /** Education appetite 0/1/2, or null if the flow didn't ask / it's unanswered. */
  education: number | null;
  /** Pay appetite 0/1/2, or null (only the narrative flow asks about pay). */
  pay: number | null;
}

export interface FitLine {
  axis: 'education' | 'pay';
  /** True = the user's appetite meets or exceeds what the role asks (green check). */
  fits: boolean;
  text: string;
}

const levelOf = (choiceId: string | undefined): 0 | 1 | 2 | null =>
  choiceId !== undefined && choiceId in SCREENER_LEVELS ? SCREENER_LEVELS[choiceId] : null;

/** Read the user's school/pay appetite off the narrative screener answers: Q1 ("going to
 *  college?") + Q2 ("how long?") give education, Q3 gives pay. */
export function deriveScreenerProfile(
  flowId: FlowId,
  answers: Record<string, string>,
): ScreenerProfile {
  if (flowId === 'narrative') {
    // "No college" caps appetite at 0; "Yes" defers to "how long?" (default 1 if Yes but
    // unanswered, which the Q1→Q2 branch shouldn't allow).
    const education =
      answers['n-q1'] === 'n-q1-no'
        ? 0
        : answers['n-q1'] === 'n-q1-yes'
          ? (levelOf(answers['n-q2']) ?? 1)
          : null;
    return { education, pay: levelOf(answers['n-q3']) };
  }
  return { education: null, pay: null };
}

const fill = (template: string, role: string, detail: string): string =>
  template.replace('{role}', role).replace('{education}', detail).replace('{salary}', detail);

/** The fit lines for one role given the user's appetite. Always returns a line per axis
 *  the flow asked about (the team wants the read shown even when it lines up). */
export function screenerFitLines(category: CategoryId, profile: ScreenerProfile): FitLine[] {
  const role = roleDetails[category];
  const lines: FitLine[] = [];

  if (profile.education !== null) {
    const fits = profile.education >= role.educationLevel;
    lines.push({
      axis: 'education',
      fits,
      text: fill(
        fits ? SCREENER_COPY.educationFits : SCREENER_COPY.educationShort,
        role.roleName,
        role.education,
      ),
    });
  }
  if (profile.pay !== null) {
    const fits = profile.pay <= role.payLevel;
    lines.push({
      axis: 'pay',
      fits,
      text: fill(fits ? SCREENER_COPY.payFits : SCREENER_COPY.payShort, role.roleName, role.salary),
    });
  }
  return lines;
}
