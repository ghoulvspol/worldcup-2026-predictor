export interface Team {
  code: string;       // 3-letter ISO-ish (BRA, ARG, USA...)
  name: string;
  nameEn: string;
  flag: string;       // emoji
  elo: number;
  fifaRank: number;
  group: string;      // 'A'..'L'
  pot: 1 | 2 | 3 | 4;
  projected?: boolean;
}

export interface MatchResult {
  homeCode: string;
  awayCode: string;
  homeGoals: number;
  awayGoals: number;
  winner: 'home' | 'away' | 'draw';
  extraTime?: boolean;
  penalties?: boolean;
}

export interface GroupTableRow {
  code: string;
  played: number;
  win: number;
  draw: number;
  loss: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
}

export interface SimRunSummary {
  /** count of how many times this team finished in each stage */
  champion: Record<string, number>;
  finalist: Record<string, number>;
  semis: Record<string, number>;
  quarters: Record<string, number>;
  r16: Record<string, number>;
  groupExit: Record<string, number>;
  /** per-pair finals frequency, key = "A_vs_B" sorted */
  finalsPair: Record<string, number>;
  totalRuns: number;
  avgGoalsPerMatch: number;
}

export type StageId = 'champion' | 'finalist' | 'semis' | 'quarters' | 'r16' | 'groupExit';
