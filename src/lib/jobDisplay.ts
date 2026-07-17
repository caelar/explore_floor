const SALARY_MEDIAN = /^National median (\$[\d,]+)(\/yr)$/;

export function parseSalaryMedian(median: string) {
  const match = median.match(SALARY_MEDIAN);
  if (!match) return null;
  return { prefix: 'National median', amount: match[1], suffix: match[2] };
}
