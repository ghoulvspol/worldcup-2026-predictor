import { simulateGroup } from './groupStage';
import { buildR32, selectQualifiers, simulateKnockout } from './knockout';
import { simulateMatch } from './matchSim';
import type { SimRunSummary, Team } from './types';

interface RunInput {
  teams: Team[];
  groupOrder: string[]; // ['A', 'B', ..., 'L']
  runs: number;
  rng?: () => number;
}

export function runMonteCarlo({ teams, groupOrder, runs, rng = Math.random }: RunInput): SimRunSummary {
  const teamsByCode = new Map(teams.map((t) => [t.code, t]));
  const teamsByGroup = new Map<string, Team[]>();
  for (const t of teams) {
    const arr = teamsByGroup.get(t.group) ?? [];
    arr.push(t);
    teamsByGroup.set(t.group, arr);
  }

  const init = (): Record<string, number> =>
    Object.fromEntries(teams.map((t) => [t.code, 0]));

  const summary: SimRunSummary = {
    champion: init(),
    finalist: init(),
    semis: init(),
    quarters: init(),
    r16: init(),
    groupExit: init(),
    finalsPair: {},
    totalRuns: runs,
    avgGoalsPerMatch: 0,
  };

  let totalGoals = 0;
  let totalMatches = 0;

  for (let i = 0; i < runs; i++) {
    const groupResults = groupOrder.map((g) =>
      simulateGroup(g, teamsByGroup.get(g) ?? [], rng),
    );
    for (const gr of groupResults) {
      for (const m of gr.matches) {
        totalGoals += m.homeGoals + m.awayGoals;
        totalMatches++;
      }
    }
    const advancing = new Set(
      selectQualifiers(groupResults, teamsByCode).map((q) => q.code),
    );
    for (const t of teams) {
      if (!advancing.has(t.code)) summary.groupExit[t.code]++;
    }

    const qualifiers = selectQualifiers(groupResults, teamsByCode);
    const r32Pairs = buildR32(qualifiers, teamsByCode);
    const trace = simulateKnockout(r32Pairs, rng);

    // Each "reached" set means this team played in (or won) that round.
    // We tally "reached r16" for teams that won R32, etc.
    for (const code of trace.reached.r16) summary.r16[code]++;
    for (const code of trace.reached.quarters) summary.quarters[code]++;
    for (const code of trace.reached.semis) summary.semis[code]++;
    for (const code of trace.reached.finalists) summary.finalist[code]++;
    summary.champion[trace.reached.champion]++;

    const [a, b] = trace.reached.finalsPair;
    const key = a < b ? `${a}_vs_${b}` : `${b}_vs_${a}`;
    summary.finalsPair[key] = (summary.finalsPair[key] ?? 0) + 1;
  }

  summary.avgGoalsPerMatch = totalMatches > 0 ? totalGoals / totalMatches : 0;
  return summary;
}

export interface PairOutcomeStats {
  homeWin: number;
  draw: number;
  awayWin: number;
  topScores: Array<{ score: string; count: number }>;
  homeXg: number;
  awayXg: number;
}

/** Run N samples of a single match-up to get score distribution. */
export function simulatePairStats(
  home: Team,
  away: Team,
  knockout: boolean,
  runs = 5000,
  rng: () => number = Math.random,
): PairOutcomeStats {
  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;
  const tally: Record<string, number> = {};

  for (let i = 0; i < runs; i++) {
    const m = simulateMatch(home, away, knockout, rng);
    const key = `${m.homeGoals}-${m.awayGoals}`;
    tally[key] = (tally[key] ?? 0) + 1;
    if (m.winner === 'home') homeWin++;
    else if (m.winner === 'away') awayWin++;
    else draw++;
  }

  const topScores = Object.entries(tally)
    .map(([score, count]) => ({ score, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // also surface xG (deterministic) for the chart
  // we recompute via projectXg instead of tallying — simpler and consistent
  // re-import to avoid circular: inline
  const eloHome = home.elo;
  const eloAway = away.elo;
  const HOST = new Set(['USA', 'CAN', 'MEX']);
  let diff = eloHome - eloAway;
  if (HOST.has(home.code) && !HOST.has(away.code)) diff += 75;
  if (HOST.has(away.code) && !HOST.has(home.code)) diff -= 75;
  const half = 0.0032 * diff * 0.5;
  const homeXg = clamp(1.35 + half, 0.2, 4);
  const awayXg = clamp(1.35 - half, 0.2, 4);

  return { homeWin, draw, awayWin, topScores, homeXg, awayXg };
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}
