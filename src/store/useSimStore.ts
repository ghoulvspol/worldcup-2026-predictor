import { create } from 'zustand';
import { TEAMS } from '../data/teams';
import { GROUPS } from '../data/groups';
import { runMonteCarlo } from '../engine/monteCarlo';
import type { SimRunSummary, Team } from '../engine/types';

interface SimState {
  teams: Team[];
  lastRun: SimRunSummary | null;
  isRunning: boolean;
  runs: number;
  setRuns: (n: number) => void;
  setEloOverride: (code: string, elo: number) => void;
  resetEloOverrides: () => void;
  runSimulation: () => Promise<void>;
}

export const useSimStore = create<SimState>((set, get) => ({
  teams: TEAMS,
  lastRun: null,
  isRunning: false,
  runs: 10000,
  setRuns: (n) => set({ runs: Math.max(100, Math.min(50000, Math.round(n))) }),
  setEloOverride: (code, elo) =>
    set((s) => ({
      teams: s.teams.map((t) => (t.code === code ? { ...t, elo: Math.max(1200, Math.min(2200, elo)) } : t)),
      lastRun: null,
    })),
  resetEloOverrides: () => set({ teams: TEAMS, lastRun: null }),
  runSimulation: async () => {
    if (get().isRunning) return;
    set({ isRunning: true });
    // yield to paint, then run sync (10k runs ~ 1-2s)
    await new Promise((r) => requestAnimationFrame(() => r(undefined)));
    const teams = get().teams;
    const runs = get().runs;
    const summary = runMonteCarlo({ teams, groupOrder: GROUPS, runs });
    set({ lastRun: summary, isRunning: false });
  },
}));
