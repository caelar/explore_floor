import { useState } from 'react';

import type { MapPhase } from '@/lib';

// The results internal view-state machine (DATA_MODEL §17, D-029 Phase C–F). The career map owns
// the explore zoom ladder (overview → role → job) inside `view === 'map'`; the docked JobSidePanel
// rail carries the role and compact-job content. The rail's "Job overview →" CTA opens the large
// standalone job page (`view === 'job-overview'`), a full-bleed surface over the same field.

export type ResultsView = 'cards' | 'compare' | 'map' | 'job-overview';

export interface ResultsNav {
  view: ResultsView;
  setView: (v: ResultsView) => void;
  roleIndex: number;
  prev: () => void;
  next: () => void;
  atStart: boolean;
  atEnd: boolean;
  activeTab: number;
  setActiveTab: (t: number) => void;
  expanded: boolean;
  toggleExpanded: () => void;
  mapPhase: MapPhase;
  selectedJob: number | null;
  openConstellation: (i: number) => void;
  openJob: (rank: number, jobIndex: number) => void;
  openJobOverview: () => void;
  backToConstellation: () => void;
  backToJob: () => void;
  backToMapOverview: () => void;
  compareWith: number;
  openCompare: () => void;
  setCompareWith: (i: number) => void;
  compareExpanded: [boolean, boolean];
  toggleCompareSide: (side: 0 | 1) => void;
  targetJobId: string | null;
  setTargetJob: (jobId: string) => void;
}

const scrollTop = () => window.scrollTo({ top: 0 });

export function useResultsNav(roleCount: number, initialView: ResultsView = 'cards'): ResultsNav {
  const [view, setViewState] = useState<ResultsView>(initialView);
  const [mapPhase, setMapPhase] = useState<MapPhase>('overview');
  const [roleIndex, setRoleIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [compareWith, setCompareWithState] = useState(roleCount > 1 ? 1 : 0);
  const [compareExpanded, setCompareExpanded] = useState<[boolean, boolean]>([false, false]);
  const [targetJobId, setTargetJobId] = useState<string | null>(null);

  const goToRole = (i: number) => {
    if (i < 0 || i >= roleCount) return;
    setRoleIndex(i);
    setActiveTab(0);
    setExpanded(false);
    scrollTop();
  };

  const defaultTarget = (current: number) => {
    if (current + 1 < roleCount) return current + 1;
    return current > 0 ? 0 : Math.min(1, roleCount - 1);
  };

  return {
    view,
    setView: (v) => {
      if (v === 'map') {
        setMapPhase('overview');
        setSelectedJob(null);
      }
      setViewState(v);
      scrollTop();
    },
    roleIndex,
    prev: () => goToRole(roleIndex - 1),
    next: () => goToRole(roleIndex + 1),
    atStart: roleIndex === 0,
    atEnd: roleIndex === roleCount - 1,
    activeTab,
    setActiveTab,
    expanded,
    toggleExpanded: () => setExpanded((e) => !e),
    mapPhase,
    selectedJob,
    openConstellation: (i) => {
      if (i < 0 || i >= roleCount) return;
      goToRole(i);
      setSelectedJob(null);
      setMapPhase('role');
      setViewState('map');
    },
    openJob: (rank, jobIndex) => {
      if (rank < 0 || rank >= roleCount) return;
      goToRole(rank);
      setSelectedJob(jobIndex);
      setMapPhase('job');
      setViewState('map');
      scrollTop();
    },
    // The rail's "Job overview →" CTA: leave the map for the large standalone job page, keeping
    // the current role + selected job (mapPhase stays 'job' so backToJob returns to the rail).
    openJobOverview: () => {
      setViewState('job-overview');
      scrollTop();
    },
    backToConstellation: () => {
      setSelectedJob(null);
      setMapPhase('role');
      setViewState('map');
      scrollTop();
    },
    // Close the large job page → back to the compact job rail on the map (mapPhase is already
    // 'job'; setViewState directly so we don't trip setView('map')'s overview reset).
    backToJob: () => {
      setMapPhase('job');
      setViewState('map');
      scrollTop();
    },
    backToMapOverview: () => {
      setSelectedJob(null);
      setMapPhase('overview');
      setViewState('map');
      scrollTop();
    },
    compareWith,
    openCompare: () => {
      setCompareWithState((t) => (t === roleIndex ? defaultTarget(roleIndex) : t));
      setCompareExpanded([false, false]);
      setViewState('compare');
      scrollTop();
    },
    setCompareWith: (i) => {
      if (i < 0 || i >= roleCount || i === roleIndex) return;
      setCompareWithState(i);
    },
    compareExpanded,
    toggleCompareSide: (side) =>
      setCompareExpanded((prev) => {
        const out: [boolean, boolean] = [prev[0], prev[1]];
        out[side] = !out[side];
        return out;
      }),
    targetJobId,
    setTargetJob: (jobId) =>
      setTargetJobId((current) => (current === jobId ? null : jobId)),
  };
}
