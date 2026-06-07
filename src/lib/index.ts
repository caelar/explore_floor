export * from './audio';
export { calculateCategoryScores, computeCategoryMax, MAYBE_WEIGHT } from './categoryScoring';
export { getFitBand, isLowSignal, LOW_SIGNAL_MAX, SOLID_FIT, STRONG_FIT } from './fit';
export * from './motion';
export type { Point } from './nodeLayout';
export { CATEGORY_ANGLES, polarPoint, radarPoints, ringRadius } from './nodeLayout';
export { selectProgramsForRole } from './programSelection';
export { assembleRobot } from './robotAssembly';
export { calculateScores } from './scoring';
