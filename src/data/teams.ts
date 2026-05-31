import type { Team } from '../engine/types';

/**
 * 2026 World Cup projected lineup (as of 2026.05).
 * - Hosts (USA, CAN, MEX) auto-qualify.
 * - Other 45 teams sourced from FIFA men's ranking + qualifying status snapshot.
 * - ELO is mapped from FIFA rank tiers; final lineup may differ.
 *
 * Group letter (A-L) is a projected draw — used by the engine to group
 * teams. Real draw will set this in late 2025.
 */

interface SeedTeam {
  code: string;
  name: string;
  nameEn: string;
  flag: string;
  fifaRank: number;
  pot: 1 | 2 | 3 | 4;
  group: string;
  projected?: boolean;
}

const SEED: SeedTeam[] = [
  // Pot 1: hosts + top 9 by FIFA rank
  { code: 'USA', name: '美国', nameEn: 'United States', flag: '🇺🇸', fifaRank: 16, pot: 1, group: 'A' },
  { code: 'MEX', name: '墨西哥', nameEn: 'Mexico', flag: '🇲🇽', fifaRank: 17, pot: 1, group: 'B' },
  { code: 'CAN', name: '加拿大', nameEn: 'Canada', flag: '🇨🇦', fifaRank: 30, pot: 1, group: 'C' },
  { code: 'ARG', name: '阿根廷', nameEn: 'Argentina', flag: '🇦🇷', fifaRank: 1, pot: 1, group: 'D' },
  { code: 'FRA', name: '法国', nameEn: 'France', flag: '🇫🇷', fifaRank: 2, pot: 1, group: 'E' },
  { code: 'ESP', name: '西班牙', nameEn: 'Spain', flag: '🇪🇸', fifaRank: 3, pot: 1, group: 'F' },
  { code: 'ENG', name: '英格兰', nameEn: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', fifaRank: 4, pot: 1, group: 'G' },
  { code: 'BRA', name: '巴西', nameEn: 'Brazil', flag: '🇧🇷', fifaRank: 5, pot: 1, group: 'H' },
  { code: 'POR', name: '葡萄牙', nameEn: 'Portugal', flag: '🇵🇹', fifaRank: 6, pot: 1, group: 'I' },
  { code: 'NED', name: '荷兰', nameEn: 'Netherlands', flag: '🇳🇱', fifaRank: 7, pot: 1, group: 'J' },
  { code: 'BEL', name: '比利时', nameEn: 'Belgium', flag: '🇧🇪', fifaRank: 8, pot: 1, group: 'K' },
  { code: 'GER', name: '德国', nameEn: 'Germany', flag: '🇩🇪', fifaRank: 9, pot: 1, group: 'L' },

  // Pot 2: rank 10-21 (12 teams)
  { code: 'CRO', name: '克罗地亚', nameEn: 'Croatia', flag: '🇭🇷', fifaRank: 10, pot: 2, group: 'A' },
  { code: 'COL', name: '哥伦比亚', nameEn: 'Colombia', flag: '🇨🇴', fifaRank: 11, pot: 2, group: 'B' },
  { code: 'ITA', name: '意大利', nameEn: 'Italy', flag: '🇮🇹', fifaRank: 12, pot: 2, group: 'C', projected: true },
  { code: 'MAR', name: '摩洛哥', nameEn: 'Morocco', flag: '🇲🇦', fifaRank: 13, pot: 2, group: 'D' },
  { code: 'URU', name: '乌拉圭', nameEn: 'Uruguay', flag: '🇺🇾', fifaRank: 14, pot: 2, group: 'E' },
  { code: 'SUI', name: '瑞士', nameEn: 'Switzerland', flag: '🇨🇭', fifaRank: 15, pot: 2, group: 'F' },
  { code: 'JPN', name: '日本', nameEn: 'Japan', flag: '🇯🇵', fifaRank: 18, pot: 2, group: 'G' },
  { code: 'SEN', name: '塞内加尔', nameEn: 'Senegal', flag: '🇸🇳', fifaRank: 19, pot: 2, group: 'H' },
  { code: 'IRN', name: '伊朗', nameEn: 'Iran', flag: '🇮🇷', fifaRank: 20, pot: 2, group: 'I' },
  { code: 'DEN', name: '丹麦', nameEn: 'Denmark', flag: '🇩🇰', fifaRank: 21, pot: 2, group: 'J' },
  { code: 'AUT', name: '奥地利', nameEn: 'Austria', flag: '🇦🇹', fifaRank: 22, pot: 2, group: 'K' },
  { code: 'KOR', name: '韩国', nameEn: 'South Korea', flag: '🇰🇷', fifaRank: 23, pot: 2, group: 'L' },

  // Pot 3: rank 24-35 (12 teams)
  { code: 'AUS', name: '澳大利亚', nameEn: 'Australia', flag: '🇦🇺', fifaRank: 24, pot: 3, group: 'A' },
  { code: 'UKR', name: '乌克兰', nameEn: 'Ukraine', flag: '🇺🇦', fifaRank: 25, pot: 3, group: 'B', projected: true },
  { code: 'WAL', name: '威尔士', nameEn: 'Wales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', fifaRank: 26, pot: 3, group: 'C', projected: true },
  { code: 'SCO', name: '苏格兰', nameEn: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', fifaRank: 27, pot: 3, group: 'D', projected: true },
  { code: 'ECU', name: '厄瓜多尔', nameEn: 'Ecuador', flag: '🇪🇨', fifaRank: 28, pot: 3, group: 'E' },
  { code: 'TUR', name: '土耳其', nameEn: 'Türkiye', flag: '🇹🇷', fifaRank: 29, pot: 3, group: 'F', projected: true },
  { code: 'TUN', name: '突尼斯', nameEn: 'Tunisia', flag: '🇹🇳', fifaRank: 31, pot: 3, group: 'G' },
  { code: 'PAR', name: '巴拉圭', nameEn: 'Paraguay', flag: '🇵🇾', fifaRank: 32, pot: 3, group: 'H' },
  { code: 'EGY', name: '埃及', nameEn: 'Egypt', flag: '🇪🇬', fifaRank: 33, pot: 3, group: 'I', projected: true },
  { code: 'NGA', name: '尼日利亚', nameEn: 'Nigeria', flag: '🇳🇬', fifaRank: 34, pot: 3, group: 'J', projected: true },
  { code: 'NOR', name: '挪威', nameEn: 'Norway', flag: '🇳🇴', fifaRank: 35, pot: 3, group: 'K', projected: true },
  { code: 'CIV', name: '科特迪瓦', nameEn: "Côte d'Ivoire", flag: '🇨🇮', fifaRank: 36, pot: 3, group: 'L' },

  // Pot 4: rank 37+ (12 teams)
  { code: 'PAN', name: '巴拿马', nameEn: 'Panama', flag: '🇵🇦', fifaRank: 37, pot: 4, group: 'A' },
  { code: 'CRC', name: '哥斯达黎加', nameEn: 'Costa Rica', flag: '🇨🇷', fifaRank: 38, pot: 4, group: 'B', projected: true },
  { code: 'KSA', name: '沙特阿拉伯', nameEn: 'Saudi Arabia', flag: '🇸🇦', fifaRank: 39, pot: 4, group: 'C' },
  { code: 'POL', name: '波兰', nameEn: 'Poland', flag: '🇵🇱', fifaRank: 40, pot: 4, group: 'D', projected: true },
  { code: 'RSA', name: '南非', nameEn: 'South Africa', flag: '🇿🇦', fifaRank: 41, pot: 4, group: 'E', projected: true },
  { code: 'JAM', name: '牙买加', nameEn: 'Jamaica', flag: '🇯🇲', fifaRank: 42, pot: 4, group: 'F', projected: true },
  { code: 'MLI', name: '马里', nameEn: 'Mali', flag: '🇲🇱', fifaRank: 43, pot: 4, group: 'G', projected: true },
  { code: 'CHI', name: '智利', nameEn: 'Chile', flag: '🇨🇱', fifaRank: 44, pot: 4, group: 'H', projected: true },
  { code: 'IRQ', name: '伊拉克', nameEn: 'Iraq', flag: '🇮🇶', fifaRank: 45, pot: 4, group: 'I', projected: true },
  { code: 'CMR', name: '喀麦隆', nameEn: 'Cameroon', flag: '🇨🇲', fifaRank: 46, pot: 4, group: 'J', projected: true },
  { code: 'NZL', name: '新西兰', nameEn: 'New Zealand', flag: '🇳🇿', fifaRank: 47, pot: 4, group: 'K' },
  { code: 'UZB', name: '乌兹别克斯坦', nameEn: 'Uzbekistan', flag: '🇺🇿', fifaRank: 48, pot: 4, group: 'L' },
];

/** Map FIFA rank to seed ELO. Top tier ~ 2050, last tier ~ 1480. */
function eloFromRank(rank: number): number {
  if (rank <= 5) return 2050 - (rank - 1) * 15;          // 2050..1990
  if (rank <= 12) return 1985 - (rank - 5) * 10;          // 1985..1915
  if (rank <= 24) return 1900 - (rank - 12) * 8;          // 1900..1804
  if (rank <= 36) return 1800 - (rank - 24) * 8;          // 1800..1704
  return Math.max(1480, 1700 - (rank - 36) * 14);
}

export const TEAMS: Team[] = SEED.map((t) => ({
  ...t,
  elo: eloFromRank(t.fifaRank),
}));

export const TEAMS_BY_CODE: Map<string, Team> = new Map(TEAMS.map((t) => [t.code, t]));
