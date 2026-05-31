import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSimStore } from '../store/useSimStore';
import { GROUPS, GROUP_HOST } from '../data/groups';
import ProbBar from '../components/ui/ProbBar';
import { pct } from '../lib/format';

export default function GroupsRoute() {
  const { teams, lastRun } = useSimStore();

  const teamsByGroup = useMemo(() => {
    const map = new Map<string, typeof teams>();
    for (const t of teams) {
      const arr = map.get(t.group) ?? [];
      arr.push(t);
      map.set(t.group, arr);
    }
    for (const [g, arr] of map) arr.sort((a, b) => b.elo - a.elo);
    return map;
  }, [teams]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="kicker">GROUP STAGE</div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl uppercase mt-1">
            12 Groups · <span className="gold-fill">Projected</span>
          </h1>
          <p className="text-dim text-sm mt-2 max-w-2xl">
            按 FIFA 排名预投影分档。前 2 + 8 个最佳第 3 进入 32 强。
          </p>
        </div>
        {lastRun ? (
          <span className="font-mono text-[10px] sm:text-xs text-dim tracking-wider">
            BASED ON {lastRun.totalRuns.toLocaleString()} RUNS
          </span>
        ) : (
          <span className="font-mono text-[10px] sm:text-xs text-gold tracking-wider">— RUN SIM TO SHOW PROBS —</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GROUPS.map((g) => {
          const list = teamsByGroup.get(g) ?? [];
          return (
            <article key={g} className="panel p-5">
              <header className="flex items-baseline justify-between mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-4xl gold-fill">GROUP {g}</span>
                </div>
                <span className="font-mono text-[10px] text-dim tracking-wider">
                  {GROUP_HOST[g]}
                </span>
              </header>

              <ul className="flex flex-col gap-2">
                {list.map((t) => {
                  const advance = lastRun
                    ? 1 - (lastRun.groupExit[t.code] ?? 0) / lastRun.totalRuns
                    : null;
                  return (
                    <li key={t.code} className="flex items-center gap-3">
                      <span className="text-xl w-7 text-center">{t.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-sm font-medium truncate">{t.name}</span>
                          <span className="font-mono text-[10px] text-dim tracking-wider">
                            ELO {Math.round(t.elo)}
                          </span>
                        </div>
                        {advance !== null ? (
                          <div className="mt-1 flex items-center gap-2">
                            <ProbBar value={advance} height="sm" />
                            <span className="font-mono text-[10px] text-gold w-12 text-right">
                              {pct(advance, 0)}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <footer className="mt-4 pt-3 border-t border-line">
                <div className="kicker text-[10px] mb-2">PAIRINGS</div>
                <div className="flex flex-wrap gap-2">
                  {list.length === 4
                    ? matchPairs(list).map(([a, b]) => (
                        <Link
                          key={a.code + b.code}
                          to={`/match/${a.code}/${b.code}`}
                          className="font-mono text-[10px] tracking-wider px-2 py-1 rounded border border-line hover:border-gold hover:text-gold text-dim transition-all"
                        >
                          {a.code} v {b.code}
                        </Link>
                      ))
                    : null}
                </div>
              </footer>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function matchPairs<T>(arr: T[]): Array<[T, T]> {
  const [a, b, c, d] = arr;
  return [
    [a, b],
    [c, d],
    [a, c],
    [b, d],
    [a, d],
    [b, c],
  ];
}
