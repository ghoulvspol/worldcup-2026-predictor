import { useMemo, useState } from 'react';
import { useSimStore } from '../store/useSimStore';
import { GROUPS } from '../data/groups';

export default function Teams() {
  const { teams, setEloOverride, resetEloOverrides, runSimulation, isRunning, lastRun } = useSimStore();
  const [filter, setFilter] = useState<string>('ALL');

  const filtered = useMemo(() => {
    const arr = filter === 'ALL' ? teams : teams.filter((t) => t.group === filter);
    return [...arr].sort((a, b) => b.elo - a.elo);
  }, [teams, filter]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="kicker">TEAMS · ELO TUNING</div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl uppercase mt-1">
            48 Teams · <span className="gold-fill">Adjustable</span>
          </h1>
          <p className="text-dim text-sm mt-2 max-w-2xl">
            觉得阿根廷应该再高一点？把 ELO 改了，按"RE-SIMULATE"重算。
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={resetEloOverrides}
            className="flex-1 sm:flex-none font-mono text-xs uppercase tracking-wider px-4 py-2.5 rounded border border-line text-dim hover:border-red hover:text-red transition-all"
          >
            RESET ELO
          </button>
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className={`flex-1 sm:flex-none font-display font-extrabold uppercase tracking-wider px-5 py-2.5 rounded-md transition-all border ${
              isRunning
                ? 'bg-white/5 border-line text-dim cursor-wait'
                : 'bg-gold-fill border-gold text-bg-0 hover:scale-[1.02] active:scale-95'
            }`}
          >
            {isRunning ? 'RUNNING…' : lastRun ? 'RE-SIMULATE' : 'RUN SIM'}
          </button>
        </div>
      </div>

      <div className="panel border-l-[3px] border-red/50 bg-red-soft p-4 flex gap-4 items-start">
        <span className="font-display text-2xl text-red leading-none mt-0.5">!</span>
        <div className="text-sm leading-relaxed">
          <span className="font-bold text-red uppercase tracking-wider text-xs mr-2">DATA SOURCE</span>
          <span className="text-white">
            参赛球队基于 2026.05 时点的 FIFA 世界排名 + 主办国保送做的<strong className="text-gold">投影</strong>。
            预选赛尚有部分席位未定，标 <span className="font-mono text-red">Projected</span> 的队伍存在变更可能；
            标 <span className="font-mono text-gold">Confirmed</span> 的（含 USA / CAN / MEX 主办国）已锁定。
            正式抽签后可以在这里手改 ELO 后 RE-SIMULATE。
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <FilterBtn value="ALL" current={filter} onClick={setFilter} />
        {GROUPS.map((g) => (
          <FilterBtn key={g} value={g} current={filter} onClick={setFilter} />
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block panel p-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[11px] tracking-wider text-dim uppercase font-mono">
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-3">Team</th>
              <th className="py-3 px-3">FIFA</th>
              <th className="py-3 px-3">Group</th>
              <th className="py-3 px-3">Pot</th>
              <th className="py-3 px-3 w-44">ELO</th>
              <th className="py-3 px-3">Tag</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr key={t.code} className="border-b border-line/50 hover:bg-white/[0.02]">
                <td className="py-3 px-3 text-dim font-mono">{i + 1}</td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{t.flag}</span>
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <div className="font-mono text-[10px] text-dim tracking-wider">{t.nameEn} · {t.code}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-dim font-mono text-xs">#{t.fifaRank}</td>
                <td className="py-3 px-3"><span className="font-display text-gold">{t.group}</span></td>
                <td className="py-3 px-3 font-mono text-xs text-dim">P{t.pot}</td>
                <td className="py-3 px-3">
                  <input
                    type="number"
                    min={1200}
                    max={2200}
                    step={10}
                    value={Math.round(t.elo)}
                    onChange={(e) => setEloOverride(t.code, parseInt(e.target.value, 10) || t.elo)}
                    className="bg-white/5 border border-line rounded px-3 py-1 w-24 font-mono text-sm focus:outline-none focus:border-gold"
                  />
                </td>
                <td className="py-3 px-3">
                  {t.projected ? (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-red border border-red/40 px-2 py-0.5 rounded">
                      Projected
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-gold/60 border border-gold/30 px-2 py-0.5 rounded">
                      Confirmed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: card list */}
      <div className="md:hidden flex flex-col gap-2.5">
        {filtered.map((t, i) => (
          <article key={t.code} className="panel p-3.5 flex items-center gap-3">
            <span className="font-mono text-xs text-dim w-5 text-center shrink-0">{i + 1}</span>
            <span className="text-3xl shrink-0">{t.flag}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-medium truncate">{t.name}</span>
                <span className="font-display text-gold text-sm">G{t.group}</span>
                {t.projected ? (
                  <span className="font-mono text-[9px] uppercase tracking-wider text-red border border-red/40 px-1.5 py-0.5 rounded">
                    Proj
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="font-mono text-[10px] text-dim tracking-wider">FIFA #{t.fifaRank}</span>
                <span className="font-mono text-[10px] text-dim/70">·</span>
                <span className="font-mono text-[10px] text-dim tracking-wider">P{t.pot}</span>
              </div>
            </div>
            <input
              type="number"
              min={1200}
              max={2200}
              step={10}
              value={Math.round(t.elo)}
              onChange={(e) => setEloOverride(t.code, parseInt(e.target.value, 10) || t.elo)}
              className="bg-white/5 border border-line rounded px-2 py-1.5 w-20 font-mono text-sm focus:outline-none focus:border-gold shrink-0"
              aria-label={`${t.name} ELO`}
            />
          </article>
        ))}
      </div>
    </div>
  );
}

function FilterBtn({
  value,
  current,
  onClick,
}: {
  value: string;
  current: string;
  onClick: (v: string) => void;
}) {
  const active = current === value;
  return (
    <button
      onClick={() => onClick(value)}
      className={`font-mono text-[11px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-md transition-all border ${
        active
          ? 'bg-gold/10 text-gold border-gold/40'
          : 'border-line text-dim hover:text-white hover:border-white/30'
      }`}
    >
      {value === 'ALL' ? 'All' : `Group ${value}`}
    </button>
  );
}
