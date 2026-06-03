/**
 * Random guesser benchmark utilities.
 *
 * Score distributions come from a pre-computed simulation (100,000 trials,
 * scripts/simulateRandom.js) rather than being computed at runtime.
 * Exported functions are pure lookups with no computation per call.
 *
 * Scoring rule: exact match = 1pt, off-by-1 = 0.5pt, else 0pt.
 * RANDOM_DISTRIBUTIONS keys: nClips (5..50 step 5) → halfPoints (integer) → probability.
 * halfPoints = score × 2  (e.g. 3.5pts → key 7).
 */

import { RANDOM_DISTRIBUTIONS } from './randomDistributions';

/**
 * Full half-point PMF for a random guesser after `nClips` clips.
 * Keys are real scores (0, 0.5, 1, …, nClips); values are probabilities.
 */
export function computeRandomPMF(nClips: number): Map<number, number> {
  const raw = RANDOM_DISTRIBUTIONS[nClips];
  const out = new Map<number, number>();
  for (const [hp, prob] of Object.entries(raw)) {
    out.set(Number(hp) / 2, prob);
  }
  return out;
}

/**
 * Integer-binned PMF for bar chart display.
 * Keys are 0, 1, …, nClips; values are probabilities.
 */
export function getBinnedPMF(nClips: number): Map<number, number> {
  const pmf = computeRandomPMF(nClips);
  const out = new Map<number, number>();
  for (const [score, prob] of pmf) {
    const bin = Math.floor(score + 0.5);
    out.set(bin, (out.get(bin) ?? 0) + prob);
  }
  return out;
}

/**
 * Returns the percentile (0–100, one decimal) of `userScore` vs. a random
 * guesser after `nClips` clips.  E.g. 72.3 means the user beats 72.3% of
 * random guessers.
 */
export function getRandomPercentile(userScore: number, nClips: number): number {
  const pmf = computeRandomPMF(nClips);
  let cumulative = 0;
  for (const [score, prob] of pmf) {
    if (score <= userScore) cumulative += prob;
  }
  return Math.round(cumulative * 1000) / 10;
}
