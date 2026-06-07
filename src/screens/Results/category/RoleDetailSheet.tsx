import { motion } from 'motion/react';

import type { CategoryWeights, FlowResultsCopy, RoleDetail } from '@/data/types';
import { durations, easings } from '@/lib';

import { FitRadar } from './FitRadar';

interface RoleDetailSheetProps {
  detail: RoleDetail;
  /** The job-title node the user clicked — the sheet's headline, with the role name as
   *  the overline (node map). Omitted when opened from a role itself (exam "your roles"):
   *  the role name becomes the headline and the overline is dropped. */
  jobTitle?: string;
  matchPercentages: CategoryWeights;
  copy: FlowResultsCopy['sheet'];
  reduce: boolean;
  onClose: () => void;
}

// Layer 2 of the category results: a sheet over the map with the role-card content
// from RC.org (description, activities, education, titles, salary) plus the fit
// radar. "Add this Role to your profile" is a deliberate stub — it goes nowhere in
// this prototype. Motion owns the overlay enter/exit.
export function RoleDetailSheet({
  detail,
  jobTitle,
  matchPercentages,
  copy,
  reduce,
  onClose,
}: RoleDetailSheetProps) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center p-space-4">
      <motion.div
        className="absolute inset-0 bg-near-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: durations.snap }}
        onClick={onClose}
        data-testid="sheet-scrim"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={jobTitle ?? detail.roleName}
        data-testid="role-sheet"
        className="relative max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-md bg-bg p-space-6 shadow-elev-2"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: durations.glide, ease: easings.soft }}
      >
        <button
          type="button"
          aria-label="Close"
          data-testid="sheet-close"
          onClick={onClose}
          className="absolute right-space-4 top-space-4 text-h4 leading-none text-text-faint transition-colors hover:text-text-default"
        >
          ×
        </button>

        <div className="flex flex-col gap-space-4">
          <div className="flex flex-col gap-space-1 text-center">
            {jobTitle && <p className="text-overline uppercase text-text-faint">{detail.roleName}</p>}
            <h2 className="font-heading text-h3 text-text-strong">{jobTitle ?? detail.roleName}</h2>
          </div>

          <p className="text-body text-text-default">{detail.description}</p>

          <button
            type="button"
            data-testid="add-to-profile"
            className="self-start text-body text-arm-blue underline"
          >
            {copy.addToProfile}
          </button>

          <section className="flex flex-col gap-space-2">
            <h3 className="text-overline uppercase text-text-faint">{copy.activities}</h3>
            <ul className="list-disc pl-space-4 text-body text-text-default">
              {detail.jobActivities.map((activity) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-space-1">
            <h3 className="text-overline uppercase text-text-faint">{copy.education}</h3>
            <p className="text-body text-text-default">{detail.education}</p>
          </section>

          <section className="flex flex-col gap-space-1">
            <h3 className="text-overline uppercase text-text-faint">{copy.titles}</h3>
            <p className="text-body text-text-default">{detail.commonJobTitles.join(' · ')}</p>
          </section>

          <section className="flex flex-col gap-space-1">
            <h3 className="text-overline uppercase text-text-faint">{copy.salary}</h3>
            <p className="text-body text-text-default">{detail.salary}</p>
          </section>

          <section className="flex flex-col gap-space-2">
            <h3 className="text-overline uppercase text-text-faint">{copy.fit}</h3>
            <FitRadar matchPercentages={matchPercentages} />
          </section>
        </div>
      </motion.div>
    </div>
  );
}
