import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useSimStore } from '../store/useSimStore';
import { simulatePairStats } from '../engine/monteCarlo';
import { poissonDistribution } from '../engine/poisson';
import { pct } from '../lib/format';
import ProbBar from '../components/ui/ProbBar';

export default function Match() {
  const { home: homeCode, away: awayCode, knockout: knockoutFlag } = useParams();
  const { teams } = useSimStore();
  const isKnockout = knockoutFlag === 'ko';

  const home = teams.find((t) => t.code === homeCode?.toUpperCase());
  const away = teams.find((t) => t.code === awayCode?.toUpperCase());

  const stats = useMemo(() => {
    if (!home || !away) return null;
    return simulatePairStats(home, away, isKnockout, 5000);
  }, [home, away, isKnockout]);

  if (!home || !away) {
    return (
      <div className="panel p-12 text-center">
        <p className="font-display text-2xl uppercase">Match not found</p>
        <Link to="/groups" className="kicker mt-4 inline-block">← Back to groups</Link>
      </div>
    );
  }

  const homeDist = poissonDistribution(stats!.homeXg, 5);
  const awayDist = poissonDistribution(stats!.awayXg, 5);

  const goalsChartData = homeDist.map((p, k) => ({
    bucket: k === 6 ? '6+' : `${k}`,
    home: p,
    away: awayDist[k],
  }));

  const total = stats!.homeWin + stats!.draw + stats!.awayWin;

  return (
    <div className="flex flex-col gap-6">
      <Link to="/groups" className="kicker text-dim hover:text-gold w-fit">← BACK TO GROUPS</Link>

      <section className="stadium border border-line rounded-xl p-8 md:p-10 relative overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[100%] aspect-square rounded-full border border-gold/20 pointer-events-none" />
        <div className="grid grid-cols-3 items-center gap-4 relative z-10">
          <div className="text-right md:text-left">
            <div className="text-7xl md:text-9xl mb-2">{home.flag}</div>
            <div className="font-display font-extrabold text-2xl md:text-3xl uppercase">{home.nameEn}</div>
            <div className="font-mono text-xs text-gold tracking-wider">ELO {Math.round(home.elo)}</div>
          </div>
          <div className="text-center">
            <div className="kicker text-red mb-2">VS</div>
            <div className="font-display font-extrabold text-4xl md:text-6xl gold-fill">
              {stats!.homeXg.toFixed(2)} : {stats!.awayXg.toFixed(2)}
            </div>
            <div className="font-mono text-[10px] tracking-wider text-dim mt-2">EXPECTED GOALS</div>
            <div className="kicker text-[10px] mt-3">
              {isKnockout ? 'KNOCKOUT · 加时 + 点球' : 'GROUP STAGE'}
            </div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-7xl md:text-9xl mb-2 md:text-right text-left">{away.flag}</div>
            <div className="font-display font-extrabold text-2xl md:text-3xl uppercase">{away.nameEn}</div>
            <div className="font-mono text-xs text-gold tracking-wider">ELO {Math.round(away.elo)}</div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="panel border-l-[3px] border-gold/40 bg-gold-soft p-5">
          <div className="kicker mb-2">{home.nameEn} WIN</div>
          <div className="font-display font-extrabold text-4xl gold-fill">{pct(stats!.homeWin / total)}</div>
        </div>
        <div className="panel border-l-[3px] border-line p-5">
          <div className="kicker mb-2 text-dim">DRAW</div>
          <div className="font-display font-extrabold text-4xl text-white">
            {isKnockout ? '—' : pct(stats!.draw / total)}
          </div>
        </div>
        <div className="panel border-l-[3px] border-red/40 bg-red-soft p-5">
          <div className="kicker mb-2 text-red">{away.nameEn} WIN</div>
          <div className="font-display font-extrabold text-4xl gold-fill">{pct(stats!.awayWin / total)}</div>
        </div>
      </section>

      <section className="panel p-6">
        <div className="kicker mb-3">RESULT DISTRIBUTION</div>
        <h3 className="font-display font-extrabold text-2xl uppercase mb-2">3-Way Probabilities</h3>
        <div className="flex flex-col gap-3 mt-4">
          <ProbBar value={stats!.homeWin / total} label={`${home.flag} ${home.nameEn} 胜`} color="gold" height="lg" />
          {!isKnockout ? (
            <ProbBar value={stats!.draw / total} label="平局" color="cyan" height="lg" />
          ) : null}
          <ProbBar value={stats!.awayWin / total} label={`${away.flag} ${away.nameEn} 胜`} color="red" height="lg" />
        </div>
      </section>

      <section className="panel p-6">
        <div className="kicker mb-3">POISSON GOAL DISTRIBUTION</div>
        <h3 className="font-display font-extrabold text-2xl uppercase mb-1">单场进球分布</h3>
        <p className="text-dim text-sm mb-5">基于 ELO 推得的双方 xG · P(进 k 球) 用 Poisson(λ) PMF</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={goalsChartData} barCategoryGap="20%">
              <XAxis dataKey="bucket" stroke="rgba(255,255,255,0.4)" />
              <YAxis tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`} stroke="rgba(255,255,255,0.4)" />
              <Tooltip
                cursor={{ fill: 'rgba(255,107,26,0.05)' }}
                contentStyle={{
                  background: '#0a0a0a',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 6,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 12,
                }}
                formatter={(v: number) => `${(v * 100).toFixed(1)}%`}
              />
              <Bar dataKey="home" fill="#FF6B1A" radius={[4, 4, 0, 0]} name={home.nameEn}>
                {goalsChartData.map((_, i) => <Cell key={i} fill="#FF6B1A" />)}
              </Bar>
              <Bar dataKey="away" fill="#C8102E" radius={[4, 4, 0, 0]} name={away.nameEn}>
                {goalsChartData.map((_, i) => <Cell key={i} fill="#C8102E" />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-6 mt-4 font-mono text-xs">
          <span className="flex items-center gap-2"><span className="w-3 h-3 bg-gold rounded-sm" /> {home.nameEn}</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 bg-red rounded-sm" /> {away.nameEn}</span>
        </div>
      </section>

      <section className="panel p-6">
        <div className="kicker mb-3">TOP 5 LIKELY SCORES</div>
        <div className="flex flex-col gap-2">
          {stats!.topScores.map((s, i) => (
            <div key={s.score} className="flex items-center gap-4 py-2 border-b border-line/50 last:border-0">
              <span className="font-display text-2xl text-gold w-8 text-center">{(i + 1).toString().padStart(2, '0')}</span>
              <span className="font-display font-extrabold text-3xl gold-fill">{s.score}</span>
              <div className="flex-1"><ProbBar value={s.count / 5000} /></div>
              <span className="font-mono text-sm text-white tabular-nums w-16 text-right">
                {pct(s.count / 5000)}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
