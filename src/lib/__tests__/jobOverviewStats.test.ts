import { describe, expect, it } from 'vitest';

import { parseSalaryMedian } from '@/lib/jobDisplay';

describe('parseSalaryMedian', () => {
  it('splits the national-median figure into prefix, amount, and suffix', () => {
    expect(parseSalaryMedian('National median $105,000/yr')).toEqual({
      prefix: 'National median',
      amount: '$105,000',
      suffix: '/yr',
    });
  });

  it('returns null for unexpected formats', () => {
    expect(parseSalaryMedian('$105,000/yr')).toBeNull();
  });
});
