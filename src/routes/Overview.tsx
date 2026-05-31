import { useMemo } from 'react';
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
import SimRunner from '../components/controls/SimRunner';
import StatCard from '../components/ui/StatCard';
import ProbBar from '../components/ui/ProbBar';
import Methodology from '../components/Methodology';
import { TEAMS_BY_CODE } from '../data/teams';
import { pct } from '../lib/format';

export default function Overview() {
  const { lastRun, teams } = useSimStore();

  const champRanking = useMemo(() => {
    if (!lastRun) return [];
    return teams
      .map((t) => ({
        code: t.code,
        name: t.name,
        flag: t.flag,
        prob: lastRun.champion[t.code] / lastRun.totalRuns,
        finalProb: lastRun.finalist[t.code] / lastRun.totalRuns,
        semiProb: lastRun.semis[t.code] / lastRun.totalRuns,
      }))
      .sort((a, b) => b.prob - a.prob);
  }, [lastRun, teams]);

  const top3 = champRanking.slice(0, 3);

  const blackHorse = useMemo(() => {
    if (!lastRun) return null;
    // teams ranked outside top 10 by ELO with > 2% champion prob
    const eloOrder = [...teams].sort((a, b) => b.elo - a.elo);
    const lowSeedSet = new Set(eloOrder.slice(10).map((t) => t.code));
    return champRanking.find((c) => lowSeedSet.has(c.code) && c.prob > 0.01) ?? null;
  }, [champRanking, teams, lastRun]);

  const finalsTop = useMemo(() => {
    if (!lastRun) return [];
    return Object.entries(lastRun.finalsPair)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key, count]) => {
        const [a, b] = key.split('_vs_');
        const tA = TEAMS_BY_CODE.get(a);
        const tB = TEAMS_BY_CODE.get(b);
        return { a: tA, b: tB, count, prob: count / lastRun.totalRuns };
      });
  }, [lastRun]);

  return (
    <div className="flex flex-col gap-8">
      <Hero />
      <SimRunner />

      {!lastRun ? (
        <EmptyState />
      ) : (
        <>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {top3.map((c, i) => (
              <StatCard
                key={c.code}
                kicker={`★ TOP ${i + 1} · CHAMPION`}
                value={
                  <span className="flex items-baseline gap-2">
                    <span className="text-3xl">{c.flag}</span>
                    <span className="gold-fill">{pct(c.prob)}</span>
                  </span>
                }
                sub={
                  <span>
                    {c.name} · 进决赛 {pct(c.finalProb)} · 进4强 {pct(c.semiProb)}
                  </span>
                }
                accent={i === 0 ? 'gold' : 'plain'}
              />
            ))}
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              kicker="AVG GOALS / MATCH"
              value={lastRun.avgGoalsPerMatch.toFixed(2)}
              sub="跨所有模拟比赛 · 双方相加"
              accent="plain"
            />
            {blackHorse ? (
              <StatCard
                kicker="DARK HORSE"
                value={
                  <span className="flex items-baseline gap-2">
                    <span className="text-3xl">{blackHorse.flag}</span>
                    <span>{pct(blackHorse.prob)}</span>
                  </span>
                }
                sub={`${blackHorse.name} · ELO 之外的爆冷可能`}
                accent="red"
              />
            ) : (
              <StatCard kicker="DARK HORSE" value="—" sub="还没有出线惊喜 · 加大 runs" accent="plain" />
            )}
            <StatCard
              kicker="MOST LIKELY FINAL"
              value={
                finalsTop[0] ? (
                  <span className="flex items-baseline gap-2 text-2xl">
                    <span>{finalsTop[0].a?.flag} vs {finalsTop[0].b?.flag}</span>
                  </span>
                ) : '—'
              }
              sub={
                finalsTop[0]
                  ? `${finalsTop[0].a?.name} vs ${finalsTop[0].b?.name} · ${pct(finalsTop[0].prob)}`
                  : ''
              }
              accent="plain"
            />
          </section>

          <section className="panel p-6">
            <div className="flex items-end justify-between mb-5">
              <div>
                <div className="kicker">CHAMPION PROBABILITY</div>
                <h3 className="font-display font-extrabold text-2xl uppercase mt-1">
                  Top 24 by win odds
                </h3>
              </div>
              <span className="font-mono text-xs text-dim tracking-wider">
                BASED ON {lastRun.totalRuns.toLocaleString()} RUNS
              </span>
            </div>
            <div className="h-[520px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={champRanking.slice(0, 24)}
                  layout="vertical"
                  margin={{ top: 0, right: 30, left: 60, bottom: 0 }}
                  barCategoryGap={4}
                >
                  <XAxis
                    type="number"
                    tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                    domain={[0, (max: number) => Math.max(0.05, max * 1.15)]}
                    stroke="rgba(255,255,255,0.4)"
                  />
                  <YAxis
                    type="category"
                    dataKey="flag"
                    width={50}
                    stroke="rgba(255,255,255,0.4)"
                    tick={{ fontSize: 18 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,107,26,0.08)' }}
                    contentStyle={{
                      background: '#0a0a0a',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 6,
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 12,
                    }}
                    formatter={(v: number, _n, p) => [pct(v), `${(p.payload as { name: string }).name}`]}
                    labelFormatter={() => ''}
                  />
                  <Bar dataKey="prob" radius={[0, 4, 4, 0]}>
                    {champRanking.slice(0, 24).map((_, i) => (
                      <Cell key={i} fill={i === 0 ? '#FF6B1A' : i < 3 ? '#FFB347' : 'rgba(255,107,26,0.5)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {finalsTop.length > 0 ? (
            <section className="panel p-6">
              <div className="kicker mb-2">MOST FREQUENT FINALS</div>
              <h3 className="font-display font-extrabold text-2xl uppercase mb-5">Top 5 finals matchups</h3>
              <div className="flex flex-col gap-3">
                {finalsTop.map((f, i) => (
                  <div key={i} className="flex items-center gap-4 py-2 border-b border-line last:border-0">
                    <span className="font-display text-2xl text-gold w-8 text-center">{(i + 1).toString().padStart(2, '0')}</span>
                    <div className="flex items-center gap-3 flex-1 text-base">
                      <span className="text-2xl">{f.a?.flag}</span>
                      <span className="text-white font-medium">{f.a?.name}</span>
                      <span className="font-mono text-xs text-red mx-1">VS</span>
                      <span className="text-2xl">{f.b?.flag}</span>
                      <span className="text-white font-medium">{f.b?.name}</span>
                    </div>
                    <div className="w-48"><ProbBar value={f.prob} /></div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}

      <Methodology />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl stadium border border-line p-10 md:p-14">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[120%] aspect-square rounded-full border border-gold/20 pointer-events-none" />
      <div
        className="absolute top-0 right-0 w-[8%] h-full opacity-[0.18]"
        style={{
          background:
            'repeating-linear-gradient(135deg, #C8102E 0 12px, transparent 12px 26px)',
        }}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="kicker">CHAPTER 01 · 2026 WORLD CUP</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-red border border-red/50 px-2 py-0.5 rounded">
            ★ Projected Lineup · 2026.05
          </span>
        </div>
        <h1 className="display-hero text-5xl md:text-7xl">
          <span className="stroke-fill block">WORLD CUP</span>
          <span className="gold-fill block">MONTE CARLO</span>
        </h1>
        <p className="mt-6 max-w-xl font-sans text-base md:text-lg text-dim leading-relaxed">
          48 队 · 12 小组 · Poisson + ELO + 主场加成。<br />
          按下按钮，让 1 万次平行宇宙告诉你谁是冠军。
        </p>
        <p className="mt-3 max-w-xl text-xs text-dim/80">
          球队名单基于 FIFA 排名投影，部分席位待预选赛确定。可在 <strong className="text-gold">Teams</strong> 页面手改 ELO 后重算。
        </p>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="panel p-12 text-center">
      <div className="kicker mb-3">▶ AWAITING SIMULATION</div>
      <p className="font-display font-extrabold text-3xl uppercase mb-4">
        Press <span className="gold-fill">RUN</span> to start
      </p>
      <p className="text-dim max-w-md mx-auto">
        默认 10000 次 · 单线程跑约 1-2 秒 · 跑完再去 Groups / Bracket / Match 页看细节。
      </p>
    </div>
  );
}
