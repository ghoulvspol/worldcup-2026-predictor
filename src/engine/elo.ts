/**
 * ELO helpers: expected win rate, and translating ELO diff into expected goals.
 *
 * Calibration:
 *  - 400 ELO step doubles odds (standard).
 *  - Base xG = 1.35 (≈ World Cup historical mean per side).
 *  - We translate ELO diff into a goal-diff expectation, then split symmetrically.
 *  - Home advantage adds a fixed ELO bonus (host nations only at WC).
 */

const BASE_XG = 1.35;
const SLOPE = 0.0032; // goals per ELO point of diff (≈ 1.3 goals at 400 diff)
const HOST_BONUS = 75;
const XG_MIN = 0.2;
const XG_MAX = 4.0;

const HOST_CODES = new Set(['USA', 'CAN', 'MEX']);

/** Expected win probability for A given ELO diff (no draws). */
export function eloExpectedWin(diff: number): number {
  return 1 / (1 + Math.pow(10, -diff / 400));
}

export interface EloTeam {
  code: string;
  elo: number;
}

/** Compute (homeXg, awayXg) from two teams + neutral flag. Hosts get a small bump. */
export function projectXg(home: EloTeam, away: EloTeam, neutral = true): [number, number] {
  let diff = home.elo - away.elo;
  if (!neutral) diff += 60;
  if (HOST_CODES.has(home.code) && !HOST_CODES.has(away.code)) diff += HOST_BONUS;
  if (HOST_CODES.has(away.code) && !HOST_CODES.has(home.code)) diff -= HOST_BONUS;

  const half = SLOPE * diff * 0.5;
  const homeXg = clamp(BASE_XG + half, XG_MIN, XG_MAX);
  const awayXg = clamp(BASE_XG - half, XG_MIN, XG_MAX);
  return [homeXg, awayXg];
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}
