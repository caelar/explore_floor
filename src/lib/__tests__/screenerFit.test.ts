import { deriveScreenerProfile, screenerFitLines } from '@/lib/screenerFit';

// Screener fit (DATA_MODEL §17, D-020). Derivation reads the real screener answers; the
// fit comparison runs against the live roleDetails ladders. Education/pay levels: Technician
// 0, Specialist 2, Integrator 2.

describe('deriveScreenerProfile', () => {
  it('caps narrative education at 0 when the user is not going to college', () => {
    // n-q1 No branches over n-q2 — appetite is 0 regardless of any stale n-q2.
    expect(deriveScreenerProfile('narrative', { 'n-q1': 'n-q1-no', 'n-q3': 'n-q3-85' })).toEqual({
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
    expect(deriveScreenerProfile('narrative', { 'n-q3': 'n-q3-45' }).pay).toBe(0);
    expect(deriveScreenerProfile('narrative', { 'n-q3': 'n-q3-85' }).pay).toBe(1);
    expect(deriveScreenerProfile('narrative', { 'n-q3': 'n-q3-105' }).pay).toBe(2);
  });

  it('returns nulls for unanswered narrative screeners', () => {
    expect(deriveScreenerProfile('narrative', {})).toEqual({ education: null, pay: null });
  });
});

describe('screenerFitLines', () => {
  it('flags a heads-up when the role needs more school than the user wants', () => {
    // Integrator needs level 2; appetite 0 → heads-up.
    const lines = screenerFitLines('integrator', { education: 0, pay: null });
    const edu = lines.find((l) => l.axis === 'education')!;
    expect(edu.fits).toBe(false);
    expect(edu.text).toContain('Integrator');
    expect(edu.text.toLowerCase()).toContain('heads up');
  });

  it('lines up when the user is up for at least as much school as the role needs', () => {
    // Technician needs level 0; any appetite fits.
    expect(screenerFitLines('technician', { education: 2, pay: null })[0].fits).toBe(true);
    // Specialist needs level 2; appetite 2 fits.
    expect(screenerFitLines('specialist', { education: 2, pay: null })[0].fits).toBe(true);
  });

  it('flags pay when the role pays below the user’s target, fits otherwise', () => {
    // Technician pay level 0; target 2 → heads-up.
    const low = screenerFitLines('technician', { education: null, pay: 2 });
    expect(low[0].axis).toBe('pay');
    expect(low[0].fits).toBe(false);
    // Integrator pay level 2; target 1 → fits.
    expect(screenerFitLines('integrator', { education: null, pay: 1 })[0].fits).toBe(true);
  });

  it('returns one line per axis the flow asked about', () => {
    expect(screenerFitLines('specialist', { education: 1, pay: 2 })).toHaveLength(2);
    expect(screenerFitLines('specialist', { education: 1, pay: null })).toHaveLength(1);
    expect(screenerFitLines('specialist', { education: null, pay: null })).toHaveLength(0);
  });
});
