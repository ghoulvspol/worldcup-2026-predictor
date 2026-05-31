import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSimStore } from '../store/useSimStore';
import { pct } from '../lib/format';

interface StageStat {
  stage: 'r16' | 'quarters' | 'semis' | 'finalist' | 'champion';
  label: string;
  count: number; // teams reaching this stage on average
}

export default function Bracket() {
  const { teams, lastRun } = useSimStore();

  const ladder = useMemo(() => {
    if (!lastRun) return [];
    return teams
      .map((t) => ({
        code: t.code,
        name: t.name,
        flag: t.flag,
        elo: t.elo,
        r16: lastRun.r16[t.code] / lastRun.totalRuns,
        quarters: lastRun.quarters[t.code] / lastRun.totalRuns,
        semis: lastRun.semis[t.code] / lastRun.totalRuns,
        finalist: lastRun.finalist[t.code] / lastRun.totalRuns,
        champion: lastRun.champion[t.code] / lastRun.totalRuns,
      }))
      .sort((a, b) => b.champion - a.champion);
  }, [lastRun, teams]);

  const stages: StageStat[] = [
    { stage: 'r16', label: '1/8 决赛 · R16', count: 16 },
    { stage: 'quarters', label: '1/4 决赛 · QF', count: 8 },
    { stage: 'semis', label: '半决赛 · SF', count: 4 },
    { stage: 'finalist', label: '决赛 · F', count: 2 },
    { stage: 'champion', label: '冠军 · 🏆', count: 1 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="kicker">KNOCKOUT STAGE</div>
        <h1 className="font-display font-extrabold text-4xl uppercase mt-1">
          Bracket <span className="gold-fill">Probability</span>
        </h1>
        <p className="text-dim text-sm mt-2 max-w-2xl">
          每队走到各阶段的频率（占总模拟次数）。点任一阶段的球队 → 看它会面对的最常见对手。
        </p>
      </div>

      {!lastRun ? (
        <div className="panel p-12 text-center">
          <p className="font-display text-2xl uppercase gold-fill">RUN A SIMULATION FIRST</p>
          <p className="text-dim mt-2">回 Overview 页 · 按 RUN SIMULATION</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {stages.map((s) => (
            <section key={s.stage} className="panel p-5 flex flex-col">
              <header className="mb-4">
                <div className="kicker mb-1">{s.label}</div>
                <div className="font-display text-3xl gold-fill">{s.count}</div>
                <div className="font-mono text-[10px] text-dim tracking-wider">SLOTS</div>
              </header>
              <ul className="flex flex-col gap-1.5 flex-1">
                {ladder
                  .filter((l) => (l[s.stage] ?? 0) > 0.005)
                  .slice(0, 12)
                  .map((l) => {
                    const v = l[s.stage] as number;
                    return (
                      <li key={l.code} className="flex items-center gap-2 text-sm">
                        <span className="text-base w-6">{l.flag}</span>
                        <span className="flex-1 truncate">{l.name}</span>
                        <span className="font-mono text-[11px] text-gold tabular-nums">
                          {pct(v, 0)}
                        </span>
                      </li>
                    );
                  })}
              </ul>
              {ladder.filter((l) => (l[s.stage] ?? 0) > 0.005).length === 0 ? (
                <p className="text-dim text-xs">no data — runs too few</p>
              ) : null}
            </section>
          ))}
        </div>
      )}

      {lastRun ? (
        <section className="panel p-6">
          <div className="kicker mb-3">FULL LADDER</div>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm font-mono min-w-[640px]">
              <thead>
                <tr className="border-b border-line text-left text-[11px] tracking-wider text-dim uppercase">
                  <th className="py-2 px-2">#</th>
                  <th className="py-2 px-2">Team</th>
                  <th className="py-2 px-2 text-right">ELO</th>
                  <th className="py-2 px-2 text-right">R16</th>
                  <th className="py-2 px-2 text-right">QF</th>
                  <th className="py-2 px-2 text-right">SF</th>
                  <th className="py-2 px-2 text-right">F</th>
                  <th className="py-2 px-2 text-right">🏆</th>
                </tr>
              </thead>
              <tbody>
                {ladder.slice(0, 32).map((l, i) => (
                  <tr key={l.code} className="border-b border-line/50 hover:bg-white/[0.02]">
                    <td className="py-2 px-2 text-dim">{i + 1}</td>
                    <td className="py-2 px-2">
                      <Link to={`/teams`} className="flex items-center gap-2 hover:text-gold">
                        <span className="text-lg">{l.flag}</span>
                        <span>{l.name}</span>
                      </Link>
                    </td>
                    <td className="py-2 px-2 text-right text-dim">{Math.round(l.elo)}</td>
                    <td className="py-2 px-2 text-right">{pct(l.r16, 0)}</td>
                    <td className="py-2 px-2 text-right">{pct(l.quarters, 0)}</td>
                    <td className="py-2 px-2 text-right">{pct(l.semis, 0)}</td>
                    <td className="py-2 px-2 text-right">{pct(l.finalist, 0)}</td>
                    <td className="py-2 px-2 text-right text-gold font-bold">{pct(l.champion)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
