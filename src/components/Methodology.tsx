/**
 * Visible "How the prediction works" panel.
 * Inlined into Overview so users see it before they trust any number.
 */
export default function Methodology() {
  return (
    <section id="methodology" className="panel p-4 sm:p-6 md:p-8 scroll-mt-20">
      <div className="kicker mb-2">METHODOLOGY · 预测依据</div>
      <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl uppercase mb-2">
        这些数字是<span className="gold-fill">怎么算</span>出来的
      </h2>
      <p className="text-dim text-sm md:text-base max-w-3xl mb-6">
        本预测不是占卜，也不是黑盒 ML。一句话：用 ELO 把球队实力换成期望进球，用 Poisson 抽进球数，
        再用蒙特卡洛跑 10000 次平行宇宙。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <Step
          n="01"
          title="输入数据"
          subtitle="INPUT"
          body={
            <ul className="space-y-2 text-sm">
              <li>· <strong className="text-gold">FIFA 男足世界排名</strong>（2026.05 时点）→ 48 队种子</li>
              <li>· <strong className="text-gold">主办国保送</strong>：USA / CAN / MEX 自动晋级</li>
              <li>· <strong className="text-gold">2026 赛制</strong>：12 组 × 4 队 → 24+8 = 32 强淘汰</li>
              <li className="text-dim text-xs pt-2 border-t border-line/50">
                未确定的 45 个席位按 FIFA 排名 + 预选赛进度投影；标 Projected。
              </li>
            </ul>
          }
        />

        <Step
          n="02"
          title="ELO 评分"
          subtitle="STRENGTH"
          body={
            <ul className="space-y-2 text-sm">
              <li>FIFA 排名 → 初始 ELO 分档：</li>
              <li className="font-mono text-xs text-dim">
                · Top 1-5 → 2050…1990<br />
                · Rank 6-12 → 1985…1915<br />
                · Rank 13-24 → 1900…1804<br />
                · Rank 25-48 → 1800…1480
              </li>
              <li className="pt-2 border-t border-line/50">
                <strong className="text-gold">主场加成</strong>：USA / CAN / MEX 在主场 +75 ELO
              </li>
              <li>
                <strong className="text-gold">用户可改</strong>：在 Teams 页直接改 ELO 重算
              </li>
            </ul>
          }
        />

        <Step
          n="03"
          title="期望进球（xG）"
          subtitle="GOAL EXPECTATION"
          body={
            <div className="space-y-3 text-sm">
              <div className="font-mono text-xs bg-bg-1/60 rounded p-3 leading-relaxed border border-line">
                <div>diff = ELO<sub>home</sub> − ELO<sub>away</sub> + host_bonus</div>
                <div>half = 0.0032 × diff × 0.5</div>
                <div className="text-gold">home_xG = clamp(1.35 + half, 0.2, 4.0)</div>
                <div className="text-red">away_xG = clamp(1.35 − half, 0.2, 4.0)</div>
              </div>
              <p className="text-dim text-xs">
                base 1.35 ≈ 世界杯历史每队场均进球。slope 0.0032 让 ELO 差 400 时强弱队 xG 差约
                <strong className="text-white"> 1.3 球</strong>。
              </p>
            </div>
          }
        />

        <Step
          n="04"
          title="Poisson 抽样"
          subtitle="SCORE GENERATOR"
          body={
            <div className="space-y-3 text-sm">
              <p>
                把双方的 xG 当成 Poisson 分布的 λ，独立抽样得到双方进球数。
              </p>
              <div className="font-mono text-xs bg-bg-1/60 rounded p-3 leading-relaxed border border-line">
                <div>P(X = k) = e<sup>−λ</sup> · λ<sup>k</sup> / k!</div>
                <div className="text-gold mt-1">home_goals = Poisson(home_xG)</div>
                <div className="text-red">away_goals = Poisson(away_xG)</div>
              </div>
              <p className="text-dim text-xs">
                用 Knuth 算法采样，每场比赛只需 ~10 次 Math.random。
                这是足球比分建模的工业标准选择（参 Maher 1982、Dixon-Coles 1997）。
              </p>
            </div>
          }
        />

        <Step
          n="05"
          title="淘汰赛决胜"
          subtitle="KNOCKOUT TIE-BREAK"
          body={
            <ul className="space-y-2 text-sm">
              <li>· 90 分钟内分胜负 → 直接出结果</li>
              <li>· 平局 → <strong className="text-gold">加时</strong>：xG × 1/3 再抽一次</li>
              <li>· 仍平局 → <strong className="text-red">点球</strong>：50% 基线 ± ELO/1600 偏差</li>
              <li className="text-dim text-xs pt-2 border-t border-line/50">
                理由：30 分钟加时 ≈ 1/3 时长，进球率按比例缩；点球大战 ELO 影响权重比正常比赛低很多。
              </li>
            </ul>
          }
        />

        <Step
          n="06"
          title="蒙特卡洛 10000 次"
          subtitle="MONTE CARLO"
          body={
            <ul className="space-y-2 text-sm">
              <li>每次跑通整个赛事：72 场小组赛 + 32 → 1 淘汰</li>
              <li>
                统计每队抵达 <span className="text-gold">R16/QF/SF/F</span>{' '}和夺冠次数
              </li>
              <li>
                <strong className="text-gold">概率 = 次数 / 10000</strong>
              </li>
              <li className="text-dim text-xs pt-2 border-t border-line/50">
                浏览器单线程跑 10000 次约 1-2 秒。次数越多稳定越好（&lt;1% 误差需要 ≥10000）。
              </li>
            </ul>
          }
        />
      </div>

      <div className="mt-6 sm:mt-8 panel border-l-[3px] border-gold/40 bg-gold-soft p-4 sm:p-5">
        <div className="kicker mb-2">CAVEATS · 不要过度信赖这些数字</div>
        <ul className="text-sm text-white space-y-1.5">
          <li>· ELO 不能完全刻画战术、伤病、首发选择</li>
          <li>· 模型不知道"东道主光环""死亡之组"等隐性变量</li>
          <li>· 投影名单基于 2026.05，最终参赛队和小组分组可能不同</li>
          <li>· Poisson 假设进球独立，对 1 球差距比赛刻画偏弱（轻微低估冷门）</li>
          <li>
            · 这是<strong className="text-gold">娱乐 + 数据可视化</strong>工具，
            不要用来下注，也不要拿它替代真正的体育博彩模型。
          </li>
        </ul>
      </div>
    </section>
  );
}

interface StepProps {
  n: string;
  title: string;
  subtitle: string;
  body: React.ReactNode;
}

function Step({ n, title, subtitle, body }: StepProps) {
  return (
    <article className="panel p-4 sm:p-5 flex flex-col">
      <header className="flex items-baseline justify-between mb-3 pb-3 border-b border-line gap-2">
        <div className="flex items-baseline gap-2.5 sm:gap-3 min-w-0">
          <span className="font-display text-2xl sm:text-3xl gold-fill leading-none shrink-0">{n}</span>
          <h3 className="font-display font-extrabold text-lg sm:text-xl uppercase truncate">{title}</h3>
        </div>
        <span className="kicker text-[10px] shrink-0">{subtitle}</span>
      </header>
      <div className="flex-1">{body}</div>
    </article>
  );
}
