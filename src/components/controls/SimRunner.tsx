import { useSimStore } from '../../store/useSimStore';
import { formatNumber } from '../../lib/format';

export default function SimRunner() {
  const { runs, setRuns, isRunning, runSimulation, lastRun } = useSimStore();

  return (
    <div className="panel p-5 sm:p-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-2">
        <span className="kicker">MONTE CARLO</span>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl uppercase leading-none">
          Run <span className="gold-fill">{formatNumber(runs)}</span> simulations
        </h2>
        <p className="text-sm text-dim max-w-md">
          每次模拟从小组赛全程跑到决赛 · 用 Poisson 抽样 + ELO 期望进球。
        </p>
      </div>

      <div className="flex items-end gap-3">
        <label className="flex flex-col gap-1.5 font-mono text-[11px] tracking-[0.2em] text-dim uppercase shrink-0">
          Runs
          <input
            type="number"
            min={100}
            max={50000}
            step={1000}
            value={runs}
            onChange={(e) => setRuns(parseInt(e.target.value, 10) || 1000)}
            disabled={isRunning}
            className="bg-white/5 border border-line rounded-md px-3 py-2.5 text-white font-mono text-base w-28 sm:w-32 focus:outline-none focus:border-gold disabled:opacity-50"
          />
        </label>
        <button
          onClick={runSimulation}
          disabled={isRunning}
          className={`flex-1 sm:flex-none font-display font-extrabold uppercase tracking-wider px-5 sm:px-7 py-3 rounded-md transition-all border whitespace-nowrap ${
            isRunning
              ? 'bg-white/5 border-line text-dim cursor-wait'
              : 'bg-gold-fill border-gold text-bg-0 hover:scale-[1.02] active:scale-95 animate-pulse-red'
          }`}
        >
          {isRunning ? 'RUNNING…' : lastRun ? 'RE-SIMULATE' : 'RUN SIM'}
        </button>
      </div>
    </div>
  );
}
