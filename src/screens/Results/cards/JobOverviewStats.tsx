// Salary + education stat boxes for the job-overview panel (Figma 1386:494). Split typography:
// salary shows "National median" then a large figure + "/yr"; education shows the credential
// line then an optional subline. Tokens only.

import { parseSalaryMedian } from '@/lib/jobDisplay';

export function JobSalaryStat({ label, median }: { label: string; median: string }) {
  const parsed = parseSalaryMedian(median);

  return (
    <div className="flex min-h-job-stat flex-1 flex-col rounded-lg border border-glass-border-soft bg-glass-fill p-job-stat">
      <p className="font-body text-small font-medium text-text-on-dark-faint">{label}</p>
      <div className="mt-space-2 flex flex-col">
        {parsed ? (
          <>
            <p className="font-body text-small text-text-on-dark-muted">{parsed.prefix}</p>
            <p className="font-heading text-h4 text-text-on-dark">
              {parsed.amount}
              <span className="font-heading text-h4 font-normal text-text-on-dark-faint">{parsed.suffix}</span>
            </p>
          </>
        ) : (
          <p className="font-heading text-h4 text-text-on-dark">{median}</p>
        )}
      </div>
    </div>
  );
}

export function JobEducationStat({
  label,
  credential,
  subline,
}: {
  label: string;
  credential: string;
  subline?: string;
}) {
  return (
    <div className="flex min-h-job-stat flex-1 flex-col rounded-lg border border-glass-border-soft bg-glass-fill p-job-stat">
      <p className="font-body text-small font-medium text-text-on-dark-faint">{label}</p>
      <div className="mt-space-2 flex flex-col">
        <p className="font-heading text-h4 text-text-on-dark">{credential}</p>
        {subline ? <p className="font-body text-small text-text-on-dark-muted">{subline}</p> : null}
      </div>
    </div>
  );
}
