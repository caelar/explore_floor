import { deriveScreenerProfile, screenerFitLines } from '@/lib/screenerFit';

// Screener fit (DATA_MODEL §17, D-020). Derivation reads the real screener answers; the
// fit comparison runs against the live roleDetails ladders. Education levels: Operator 0,
// Technician 1, Specialist 2, Integrator 2. Pay levels mirror them.

describe('deriveScreenerProfile', () => {
  it('caps narrative education at 0 when the user is not going to college', () => {
    // n-q1 No branches over n-q2 — appetite is 0 regardless of any stale n-q2.
    expect(deriveScreenerProfile('narrative', { 'n-q1': 'n-q1-no', 'n-q3': 'n-q3-60' })).toEqual({
      education: 0,
      pay: 1,
    });
  });

  it('derives narrative education from "how long" when going to college', () => {
    const long = deriveScreenerProfile('narrative', { 'n-q1': 'n-q1-yes', 'n-q2': 'n-q2-typical' });
    expect(long.education).toBe(2);
    const some = deriveScreenerProfile('narrative', { 'n-q1': 'n-q1-yes', 'n-q2': 'n-q2-short' });
    expect(some.education).toBe(1);
    const whatever = deriveScreenerProfile('narrative', {
      'n-q1': 'n-q1-yes',
      'n-q2': 'n-q2-whatever',
    });
    expect(whatever.education).toBe(1);
  });

  it('reads narrative pay from the salary question (0/1/2)', () => {
    expect(deriveScreenerProfile('narrative', { 'n-q3': 'n-q3-40' }).pay).toBe(0);
    expect(deriveScreenerProfile('narrative', { 'n-q3': 'n-q3-60' }).pay).toBe(1);
    expect(deriveScreenerProfile('narrative', { 'n-q3': 'n-q3-80' }).pay).toBe(2);
  });

  it('returns nulls for unanswered narrative screeners', () => {
    expect(deriveScreenerProfile('narrative', {})).toEqual({ education: null, pay: null });
  });
});

describe('screenerFitLines', () => {
  it('flags a heads-up when the role needs more school than the user wants', () => {
    // Integrator (plan) needs level 2; appetite 0 → heads-up.
    const lines = screenerFitLines('plan', { education: 0, pay: null });
    const edu = lines.find((l) => l.axis === 'education')!;
    expect(edu.fits).toBe(false);
    expect(edu.text).toContain('Integrator');
    expect(edu.text.toLowerCase()).toContain('heads up');
  });

  it('lines up when the user is up for at least as much school as the role needs', () => {
    // Operator (operate) needs level 0; any appetite fits.
    expect(screenerFitLines('operate', { education: 2, pay: null })[0].fits).toBe(true);
    // Specialist (program) needs level 2; appetite 2 fits.
    expect(screenerFitLines('program', { education: 2, pay: null })[0].fits).toBe(true);
  });

  it('flags pay when the role pays below the user’s target, fits otherwise', () => {
    // Operator pay level 0; target 2 → heads-up.
    const low = screenerFitLines('operate', { education: null, pay: 2 });
    expect(low[0].axis).toBe('pay');
    expect(low[0].fits).toBe(false);
    // Integrator pay level 2; target 1 → fits.
    expect(screenerFitLines('plan', { education: null, pay: 1 })[0].fits).toBe(true);
  });

  it('returns one line per axis the flow asked about', () => {
    expect(screenerFitLines('program', { education: 1, pay: 2 })).toHaveLength(2);
    expect(screenerFitLines('program', { education: 1, pay: null })).toHaveLength(1);
    expect(screenerFitLines('program', { education: null, pay: null })).toHaveLength(0);
  });
});
