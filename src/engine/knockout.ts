import { simulateMatch } from './matchSim';
import type { GroupTableRow, Team } from './types';

/**
 * Build the Round of 32 from group stage results.
 * 2026 format: 12 groups × top 2 (24 teams) + best 8 third-placed teams = 32.
 *
 * The official 2026 bracket structure mapping is non-trivial. For the v1
 * predictor we use a simplified deterministic mapping that preserves
 * "winners avoid winners early" and is reproducible. This is a model, not
 * the official bracket.
 */

interface QualifiedTeam {
  code: string;
  position: 1 | 2 | 3;
  group: string;
  pts: number;
  gd: number;
  gf: number;
  fifaRank: number;
}

export function selectQualifiers(
  groupResults: Array<{ group: string; table: GroupTableRow[] }>,
  teamsByCode: Map<string, Team>,
): QualifiedTeam[] {
  const winners: QualifiedTeam[] = [];
  const runnersUp: QualifiedTeam[] = [];
  const thirdPlace: QualifiedTeam[] = [];

  for (const g of groupResults) {
    const [w, r, t] = g.table;
    const meta = (row: GroupTableRow, pos: 1 | 2 | 3): QualifiedTeam => ({
      code: row.code,
      position: pos,
      group: g.group,
      pts: row.pts,
      gd: row.gd,
      gf: row.gf,
      fifaRank: teamsByCode.get(row.code)!.fifaRank,
    });
    winners.push(meta(w, 1));
    runnersUp.push(meta(r, 2));
    thirdPlace.push(meta(t, 3));
  }

  thirdPlace.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.fifaRank - b.fifaRank;
  });
  const bestEightThirds = thirdPlace.slice(0, 8);

  return [...winners, ...runnersUp, ...bestEightThirds];
}

/** Build R32 pairings — simplified (winners vs runners-up/thirds, ELO-aware seeding). */
export function buildR32(
  qualifiers: QualifiedTeam[],
  teamsByCode: Map<string, Team>,
): Array<[Team, Team]> {
  // sort by quality: winners (by ELO desc), then runners-up, then best thirds
  const sortByEloDesc = (arr: QualifiedTeam[]) =>
    [...arr].sort((a, b) => teamsByCode.get(b.code)!.elo - teamsByCode.get(a.code)!.elo);

  const winners = sortByEloDesc(qualifiers.filter((q) => q.position === 1));
  const others = sortByEloDesc(qualifiers.filter((q) => q.position !== 1));

  // 16 matches: top winners vs bottom others, working inward
  const pairs: Array<[Team, Team]> = [];
  const top: QualifiedTeam[] = [...winners, ...others.slice(0, 16 - winners.length)];
  const bottom: QualifiedTeam[] = others.slice(16 - winners.length);
  // ensure 16+16
  while (top.length < 16) top.push(others[top.length]);
  while (bottom.length < 16) bottom.push(others[others.length - 1 - bottom.length]);

  for (let i = 0; i < 16; i++) {
    const a = teamsByCode.get(top[i].code)!;
    const b = teamsByCode.get(bottom[bottom.length - 1 - i].code)!;
    if (a.code !== b.code) pairs.push([a, b]);
  }
  return pairs;
}

export interface KnockoutTrace {
  /** map: stage -> teams that REACHED that stage */
  reached: {
    r32: string[];
    r16: string[];
    quarters: string[];
    semis: string[];
    finalists: string[];
    champion: string;
    finalsPair: [string, string];
  };
}

export function simulateKnockout(
  pairs: Array<[Team, Team]>,
  rng: () => number = Math.random,
): KnockoutTrace {
  const r32: string[] = pairs.flatMap(([a, b]) => [a.code, b.code]);

  const advance = (matches: Array<[Team, Team]>): Team[] =>
    matches.map(([h, a]) => {
      const r = simulateMatch(h, a, true, rng);
      return r.winner === 'home' ? h : a;
    });

  const r16Teams = advance(pairs);
  const r16: string[] = r16Teams.map((t) => t.code);

  const qfPairs: Array<[Team, Team]> = [];
  for (let i = 0; i < r16Teams.length; i += 2) qfPairs.push([r16Teams[i], r16Teams[i + 1]]);
  const qfTeams = advance(qfPairs);
  const quarters: string[] = qfTeams.map((t) => t.code);

  const sfPairs: Array<[Team, Team]> = [];
  for (let i = 0; i < qfTeams.length; i += 2) sfPairs.push([qfTeams[i], qfTeams[i + 1]]);
  const sfTeams = advance(sfPairs);
  const semis: string[] = sfTeams.map((t) => t.code);

  const finalPair: [Team, Team] = [sfTeams[0], sfTeams[1]];
  const champion = simulateMatch(finalPair[0], finalPair[1], true, rng).winner === 'home'
    ? finalPair[0]
    : finalPair[1];
  const finalists: string[] = [finalPair[0].code, finalPair[1].code];

  return {
    reached: {
      r32,
      r16,
      quarters,
      semis,
      finalists,
      champion: champion.code,
      finalsPair: [finalPair[0].code, finalPair[1].code],
    },
  };
}
