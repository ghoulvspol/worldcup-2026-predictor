import { simulateMatch } from './matchSim';
import type { GroupTableRow, MatchResult, Team } from './types';

/** Round-robin pairings for a 4-team group: 6 matches. */
function pairings(teams: Team[]): Array<[Team, Team]> {
  const [a, b, c, d] = teams;
  return [
    [a, b],
    [c, d],
    [a, c],
    [b, d],
    [a, d],
    [b, c],
  ];
}

export interface GroupSimResult {
  group: string;
  matches: MatchResult[];
  table: GroupTableRow[];
}

/** Simulate one group's 6 matches and return final standings. */
export function simulateGroup(
  groupId: string,
  teams: Team[],
  rng: () => number = Math.random,
): GroupSimResult {
  const matches: MatchResult[] = [];
  const table = new Map<string, GroupTableRow>();
  for (const t of teams) {
    table.set(t.code, {
      code: t.code,
      played: 0,
      win: 0,
      draw: 0,
      loss: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0,
    });
  }

  for (const [home, away] of pairings(teams)) {
    const m = simulateMatch(home, away, false, rng);
    matches.push(m);
    const h = table.get(home.code)!;
    const a = table.get(away.code)!;
    h.played++;
    a.played++;
    h.gf += m.homeGoals;
    h.ga += m.awayGoals;
    a.gf += m.awayGoals;
    a.ga += m.homeGoals;
    if (m.winner === 'home') {
      h.win++;
      a.loss++;
      h.pts += 3;
    } else if (m.winner === 'away') {
      a.win++;
      h.loss++;
      a.pts += 3;
    } else {
      h.draw++;
      a.draw++;
      h.pts++;
      a.pts++;
    }
  }
  for (const r of table.values()) r.gd = r.gf - r.ga;

  // Sort: pts → GD → GF → ELO (proxy for FIFA rank tiebreak)
  const teamByCode = new Map(teams.map((t) => [t.code, t]));
  const sorted = [...table.values()].sort((x, y) => {
    if (y.pts !== x.pts) return y.pts - x.pts;
    if (y.gd !== x.gd) return y.gd - x.gd;
    if (y.gf !== x.gf) return y.gf - x.gf;
    const xElo = teamByCode.get(x.code)!.elo;
    const yElo = teamByCode.get(y.code)!.elo;
    return yElo - xElo;
  });

  return { group: groupId, matches, table: sorted };
}
