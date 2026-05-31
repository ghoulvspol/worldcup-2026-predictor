import { poissonRandom } from './poisson';
import { projectXg } from './elo';
import type { MatchResult, Team } from './types';

const UPSET_FACTOR = 0.05;

/** Simulate a single match. If knockout, never returns 'draw' — uses extra time + penalties. */
export function simulateMatch(
  home: Team,
  away: Team,
  knockout = false,
  rng: () => number = Math.random,
): MatchResult {
  // Tiny upset noise: small ELO jiggle each game so model doesn't feel deterministic
  const homeJittered = { ...home, elo: home.elo + (rng() - 0.5) * 60 * UPSET_FACTOR * 20 };
  const awayJittered = { ...away, elo: away.elo + (rng() - 0.5) * 60 * UPSET_FACTOR * 20 };

  const [homeXg, awayXg] = projectXg(homeJittered, awayJittered, true);

  let hg = poissonRandom(homeXg, rng);
  let ag = poissonRandom(awayXg, rng);

  if (!knockout || hg !== ag) {
    return result(home.code, away.code, hg, ag);
  }

  // Extra time = 30 minutes ≈ 1/3 of regulation xG
  const eth = poissonRandom(homeXg / 3, rng);
  const eta = poissonRandom(awayXg / 3, rng);
  hg += eth;
  ag += eta;

  if (hg !== ag) {
    return { ...result(home.code, away.code, hg, ag), extraTime: true };
  }

  // Penalty shootout — sample with mild ELO bias
  const eloDiff = home.elo - away.elo;
  const homeWinProb = 0.5 + clamp(eloDiff / 1600, -0.15, 0.15);
  const homeWins = rng() < homeWinProb;
  // record as 1-0 in penalties (real score keeps regulation+ET tally)
  return {
    homeCode: home.code,
    awayCode: away.code,
    homeGoals: hg,
    awayGoals: ag,
    winner: homeWins ? 'home' : 'away',
    extraTime: true,
    penalties: true,
  };
}

function result(homeCode: string, awayCode: string, hg: number, ag: number): MatchResult {
  return {
    homeCode,
    awayCode,
    homeGoals: hg,
    awayGoals: ag,
    winner: hg > ag ? 'home' : ag > hg ? 'away' : 'draw',
  };
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}
