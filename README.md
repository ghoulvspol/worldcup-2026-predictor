# 2026 World Cup · Monte Carlo Predictor

> 一个本地纯前端 + GitHub Pages 部署的 2026 美加墨世界杯预测沙盘
>
> 用 **Poisson + ELO** 把 48 队的实力换成期望进球，再用 **蒙特卡洛 10,000 次**模拟整个赛事，给出每队的夺冠 / 进决赛 / 进 4 强 / 出线概率。

🌐 **公网体验**：[ghoulvspol.github.io/worldcup-2026-predictor](https://ghoulvspol.github.io/worldcup-2026-predictor/)

📦 **仓库**：[github.com/ghoulvspol/worldcup-2026-predictor](https://github.com/ghoulvspol/worldcup-2026-predictor)

---

## 目录

- [特性概览](#特性概览)
- [视觉风格](#视觉风格)
- [快速开始](#快速开始)
  - [本地运行](#本地运行)
  - [运行测试](#运行测试)
  - [生产构建](#生产构建)
- [项目结构](#项目结构)
- [预测引擎原理](#预测引擎原理)
  - [Step 1 · 输入数据](#step-1--输入数据)
  - [Step 2 · ELO 评分](#step-2--elo-评分)
  - [Step 3 · 期望进球（xG）](#step-3--期望进球xg)
  - [Step 4 · Poisson 抽样](#step-4--poisson-抽样)
  - [Step 5 · 淘汰赛决胜](#step-5--淘汰赛决胜)
  - [Step 6 · 蒙特卡洛](#step-6--蒙特卡洛)
- [数据来源与可信度](#数据来源与可信度)
- [页面与功能](#页面与功能)
- [移动端适配](#移动端适配)
- [部署](#部署)
  - [GitHub Pages 自动部署](#github-pages-自动部署)
  - [部署到 Vercel / Netlify / Cloudflare Pages](#部署到-vercel--netlify--cloudflare-pages)
- [访问统计](#访问统计)
- [自定义和扩展](#自定义和扩展)
- [性能](#性能)
- [已知限制](#已知限制)
- [Roadmap](#roadmap)
- [贡献](#贡献)
- [License](#license)
- [致谢](#致谢)

---

## 特性概览

- ⚽ **完整 48 队 · 12 小组**（2026 首次扩军赛制）
- 🎲 **蒙特卡洛模拟**：默认 10,000 次跑通整个赛事（72 场小组赛 + 31 场淘汰赛）
- 📊 **每队 5 个阶段概率**：夺冠 / 进决赛 / 4 强 / 8 强 / 16 强 / 出线
- 🔬 **Poisson 进球分布图**：单场比赛可视化双方 P(进 k 球)
- 🎯 **Top 5 比分预测**：每场比赛最常见的 5 个比分
- ✏️ **可调 ELO**：在 Teams 页面手改任意球队的 ELO，立即重算
- 🏟️ **主办国加成**：USA / CAN / MEX 在主场 +75 ELO
- 📱 **完整移动端适配**：Header 折叠为汉堡菜单，表格自动转卡片列表
- 📈 **访问计数器**：counterapi.dev 提供，零认证、零隐私收集
- 🏆 **可运行的方法学**：Methodology 章节用代码 + 公式说明每一步逻辑

---

## 视觉风格

**nba-bold 主题**：黑底 + 红橙金渐变 + Impact 字体，借鉴 NBA 球场强力量感。

| 元素 | 值 |
|------|---|
| 背景 | `#0a0a0a` → `#1a0808`（径向 + 线性渐变叠加）|
| 主色（金） | `#FF6B1A` |
| 强调（红） | `#C8102E` |
| 字体 · display | Oswald / Impact / PingFang SC |
| 字体 · body | Inter / Noto Sans SC |
| 字体 · mono | JetBrains Mono |
| 装饰层 | 球场弧线 + 对角红条纹 + 渐变光晕 |

---

## 快速开始

### 本地运行

需要 Node.js ≥ 20。

```bash
git clone https://github.com/ghoulvspol/worldcup-2026-predictor.git
cd worldcup-2026-predictor
npm install
npm run dev
# 浏览器自动打开 http://localhost:5173
```

### 运行测试

引擎含 7 个单测（Poisson 收敛、PMF、ELO 期望胜率、xG 推算）：

```bash
npm test          # 一次性
npm run test:watch  # 监听模式
```

### 生产构建

本地预览生产产物：

```bash
npm run build       # 输出到 dist/
npm run preview     # 用静态服务器预览 dist/
```

为 GitHub Pages 构建（注入子路径）：

```bash
BASE=/worldcup-2026-predictor/ npm run build
```

---

## 项目结构

```
worldcup-2026-predictor/
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions 自动部署
├── public/
│   └── favicon.svg                # nba-bold 配色 SVG favicon
├── src/
│   ├── main.tsx                   # 入口 · HashRouter
│   ├── App.tsx                    # 路由 + 全局布局
│   ├── routes/
│   │   ├── Overview.tsx           # 仪表盘 + RUN + 冠军概率条形图
│   │   ├── Groups.tsx             # 12 个小组卡
│   │   ├── Bracket.tsx            # 淘汰赛 5 阶段 + 完整 ladder
│   │   ├── Match.tsx              # 单场比赛 · Poisson 分布 + Top 5 比分
│   │   └── Teams.tsx              # 48 队 ELO 编辑器（PC 表格 / 移动卡片）
│   ├── components/
│   │   ├── Methodology.tsx        # 站内可见的"方法学"6 步说明
│   │   ├── layout/
│   │   │   ├── Header.tsx         # 顶栏 + 移动汉堡抽屉
│   │   │   └── VisitorCounter.tsx # 访问计数器（compact / full）
│   │   ├── ui/
│   │   │   ├── StatCard.tsx       # KPI 卡（accent: gold/red/plain）
│   │   │   ├── TeamFlag.tsx       # 国旗 emoji + 名称
│   │   │   └── ProbBar.tsx        # 概率条
│   │   └── controls/
│   │       └── SimRunner.tsx      # 模拟次数输入 + RUN 按钮
│   ├── engine/                    # 预测核心 · 0 外部依赖
│   │   ├── poisson.ts             # Knuth 算法 + PMF + 分布
│   │   ├── elo.ts                 # 期望胜率 + xG 投影 + 主场加成
│   │   ├── matchSim.ts            # 单场比赛 · 加时 + 点球
│   │   ├── groupStage.ts          # 6 场循环赛 + 排名规则
│   │   ├── knockout.ts            # 32 → 1 简化对阵图
│   │   ├── monteCarlo.ts          # N 次循环聚合
│   │   ├── types.ts               # Team / MatchResult / SimRunSummary
│   │   └── __tests__/
│   │       └── poisson.test.ts
│   ├── data/
│   │   ├── teams.ts               # 48 队投影数据
│   │   └── groups.ts              # 12 个小组（A-L）
│   ├── store/
│   │   └── useSimStore.ts         # Zustand · sim 状态 + ELO 覆盖
│   ├── lib/
│   │   └── format.ts              # pct / formatNumber
│   └── styles/
│       └── global.css             # Tailwind + 主题 token + Recharts 覆盖
├── index.html
├── vite.config.ts                 # base 由 BASE env 控制
├── tailwind.config.ts             # nba-bold 调色板
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## 预测引擎原理

预测不是黑盒 ML，每一步都可读懂、可调参。完整 6 步：

### Step 1 · 输入数据

- **FIFA 男足世界排名**（2026.05 时点）→ 48 队种子
- **主办国保送**：USA / CAN / MEX 自动晋级
- **2026 赛制**：12 组 × 4 队 → 24 + 8 = 32 强淘汰赛
- 未确定的 45 个席位按 FIFA 排名 + 预选赛进度投影；UI 标 `Projected` 红标

### Step 2 · ELO 评分

把 FIFA 排名映射为 ELO（[src/data/teams.ts:eloFromRank](src/data/teams.ts)）：

| 排名 | ELO 范围 |
|------|----------|
| Top 1-5 | 2050 → 1990（每位 -15）|
| Rank 6-12 | 1985 → 1915（每位 -10）|
| Rank 13-24 | 1900 → 1804（每位 -8）|
| Rank 25-36 | 1800 → 1704（每位 -8）|
| Rank 37-48 | 1700 → 1480（每位 -14）|

**主场加成**：USA / CAN / MEX 在主场对非主办国时 **+75 ELO**。

**用户可改**：Teams 页可手改任意球队的 ELO 重算。

### Step 3 · 期望进球（xG）

[src/engine/elo.ts:projectXg](src/engine/elo.ts)

```
diff = ELO_home − ELO_away + host_bonus
half = 0.0032 × diff × 0.5
home_xG = clamp(1.35 + half, 0.2, 4.0)
away_xG = clamp(1.35 − half, 0.2, 4.0)
```

- `1.35` ≈ 世界杯历史每队场均进球（base xG）
- `0.0032` 标定 ELO 差 400 → 强弱队 xG 差 ≈ 1.3 球
- `clamp` 防止 ELO 极端差产生负 xG 或离谱值

### Step 4 · Poisson 抽样

[src/engine/poisson.ts](src/engine/poisson.ts)

进球数服从泊松分布：

```
P(X = k) = e^(−λ) × λ^k / k!
home_goals = Poisson(home_xG)
away_goals = Poisson(away_xG)
```

用 **Knuth 算法**采样（无依赖）：

```typescript
function poissonRandom(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0, p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
}
```

每场比赛只需 ~10 次 `Math.random()` 调用。这是足球比分建模工业标准（参 Maher 1982、Dixon-Coles 1997）。

### Step 5 · 淘汰赛决胜

[src/engine/matchSim.ts:simulateMatch](src/engine/matchSim.ts)

| 阶段 | 规则 |
|------|------|
| 90 分钟 | Poisson 抽样 |
| 平局 → 加时 | xG × 1/3 再抽一次（30 分钟 ≈ 1/3 时长）|
| 仍平局 → 点球 | 50% 基线 ± `ELO/1600` 偏差，clamped 到 [-15%, +15%] |

点球大战刻意降低 ELO 权重——真实数据里点球更接近"近抛硬币"。

### Step 6 · 蒙特卡洛

[src/engine/monteCarlo.ts:runMonteCarlo](src/engine/monteCarlo.ts)

每次模拟跑通完整赛事并记录每队抵达的最高阶段：

```typescript
for (let i = 0; i < 10000; i++) {
  const groupResults = simulateGroupStage(groups);
  const r32 = buildR32(groupResults);
  const trace = simulateKnockout(r32);
  // 记录 trace.reached.{r16, quarters, semis, finalists, champion}
}
```

最终 **概率 = 次数 / 10000**。

---

## 数据来源与可信度

**重要：所有数据是 2026.05 时点的投影，不是已确定的事实。**

| 数据 | 来源 | 可信度 |
|------|------|--------|
| USA / CAN / MEX 参赛 | 主办国保送 FIFA 规则 | ✅ 100% |
| 其他 45 支球队 | FIFA 男足排名 + 预选赛进度 | ⚠️ 投影 |
| 12 个小组分组 | 蛇形档分配（投影抽签）| ⚠️ 投影 |
| 初始 ELO | FIFA 排名分档映射 | ⚠️ 校准值 |
| 主办国 +75 加成 | 历史世界杯主场胜率 | ⚠️ 经验值 |

**数据更新路径：**

1. 2025/12 官方抽签后 → 改 [src/data/teams.ts](src/data/teams.ts) 的 `group` 字段
2. 2026 预选赛全部结束后 → 把 `projected: true` 的球队替换为实际晋级队伍
3. ELO 想要更准 → 用真实历史比赛 + Glicko-2 模型重新拟合

---

## 页面与功能

| 路由 | 内容 |
|------|------|
| `/` Overview | Hero 横幅 · RUN 模拟按钮 · 6 张 KPI 卡（Top 3 / 黑马 / 平均进球 / 决赛对阵）· Top 24 冠军概率条形图 · Top 5 决赛对阵 · **Methodology** 6 步说明 |
| `/groups` Groups | 12 张小组卡 · 4 队头像 + ELO + 出线概率条 + 6 场对阵入口 |
| `/bracket` Bracket | 5 阶段网格（R16 / QF / SF / F / 🏆）· 每阶段列出抵达概率最高的 12 队 · 32 强完整 ladder 表 |
| `/match/:home/:away` Match | 双方对阵 · 胜/平/负三色概率 · Poisson 进球分布柱状图 · Top 5 最常见比分 |
| `/match/:home/:away/ko` Match | 同上但走淘汰赛规则（加时 + 点球）|
| `/teams` Teams | 48 队 ELO 编辑器 · 按小组筛选 · RESET ELO + RE-SIMULATE 按钮 |

---

## 移动端适配

| 区域 | PC（≥768px）| 移动（<768px）|
|------|-------------|---------------|
| Header | 5 个 NAV 横排 + Visitors 卡 | 汉堡菜单抽屉 + 紧凑 Visitors 数字 |
| Overview Hero | 7xl 字号 | 4xl 字号 |
| 冠军概率图 | 520px 高 | 420px 高 |
| Match 双方对阵 | 三栏并排 | 上下三块（VS 居中），旗帜从 9xl 缩到 6xl |
| Match 胜/平/负 | 3 列宽卡 | 3 列窄卡（仍并排，文字缩小）|
| Bracket 阶段卡 | 5 列横排 | 2 列网格 |
| Bracket 全 ladder 表 | 完整宽度 | 横向滚动 |
| Teams | 7 列表格 + ELO 输入框 | 卡片列表，每行 = 旗 + 队名 + ELO |
| Methodology | 2 列网格 | 1 列叠放 |
| Groups 12 卡 | 3 列 | 1 列 |
| 全局 padding | px-6 py-10 | px-4 py-6 |

汉堡菜单打开时：背景变模糊半透明、滚动锁定、点击空白处或路由切换自动关闭。

---

## 部署

### GitHub Pages 自动部署

**已配置好**：仓库根目录有 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)，每次 push 到 `main` 自动：

1. `npm ci` 安装依赖
2. `npm test` 跑引擎测试
3. `BASE=/worldcup-2026-predictor/ npm run build` 构建（注入子路径）
4. 上传 `dist/` 到 GitHub Pages

第一次启用步骤：

```bash
# 1. 创建仓库并推送
gh repo create ghoulvspol/worldcup-2026-predictor --public --source=. --remote=origin --push

# 2. 启用 Pages（GitHub Actions 模式）
gh api -X POST /repos/ghoulvspol/worldcup-2026-predictor/pages -f 'build_type=workflow'

# 之后每次 push 都会自动部署
git push
```

部署用时约 30-40 秒。访问 https://USERNAME.github.io/worldcup-2026-predictor/

### 部署到 Vercel / Netlify / Cloudflare Pages

无需特殊配置（甚至不需要 `BASE`，因为这些平台默认走根路径）：

| 平台 | 步骤 |
|------|------|
| **Vercel** | `vercel deploy` 或 `https://vercel.com/new` 绑定仓库即可 |
| **Netlify** | `netlify deploy` 或 `https://app.netlify.com/start` 绑定仓库 |
| **Cloudflare Pages** | Dashboard → Pages → Connect Git，build command `npm run build`，output `dist` |

> 因为用了 `HashRouter`（不是 `BrowserRouter`），所有平台不需要配置 SPA 重写规则。

---

## 访问统计

[VisitorCounter.tsx](src/components/layout/VisitorCounter.tsx) 用 [counterapi.dev](https://counterapi.dev) 实现：

- ✅ 完全免费、无需注册
- ✅ 同一会话只计 1 次（用 `sessionStorage` 标记）
- ✅ API 失败优雅降级为 `—`
- ✅ 移动端有 compact 紧凑模式
- ❌ **不收集任何隐私信息**（无 IP、无 UA、无地理位置）

namespace = `ghoulvspol`，key = `wc2026-predictor`。fork 后建议改成你自己的（同名会共享计数）。

---

## 自定义和扩展

### 改主题色

编辑 [tailwind.config.ts](tailwind.config.ts)：

```ts
colors: {
  bg: { 0: '#0a0a0a', 1: '#161616', 2: '#1a0808' },
  red: { DEFAULT: '#C8102E', soft: 'rgba(200,16,46,.18)' },
  gold: { DEFAULT: '#FF6B1A', hi: '#FFB347' },
}
```

### 改球队 / 小组

[src/data/teams.ts](src/data/teams.ts) — 每条记录：

```ts
{ code: 'BRA', name: '巴西', nameEn: 'Brazil', flag: '🇧🇷',
  fifaRank: 5, pot: 1, group: 'H' }
```

ELO 由 `eloFromRank()` 从 `fifaRank` 自动算出。手动覆盖请用 Teams 页面 UI。

### 改主场加成 / xG 公式

[src/engine/elo.ts](src/engine/elo.ts) 的常量：

```ts
const BASE_XG = 1.35;        // 世界杯历史均值
const SLOPE = 0.0032;        // ELO 差 → 进球差斜率
const HOST_BONUS = 75;       // 主办国 ELO 加成
const HOST_CODES = new Set(['USA', 'CAN', 'MEX']);
```

### 改默认模拟次数

[src/store/useSimStore.ts](src/store/useSimStore.ts)：`runs: 10000`（用户也可在 UI 上改 100-50000）

### 接入 Web Worker（性能优化）

目前单线程 10000 次 ~1.5s，UI 略卡。如果想丝滑：

```ts
// src/engine/sim.worker.ts
import { runMonteCarlo } from './monteCarlo';
self.onmessage = (e) => {
  const summary = runMonteCarlo(e.data);
  self.postMessage(summary);
};
```

然后在 store 里 `new Worker(new URL('./sim.worker.ts', import.meta.url))`。

---

## 性能

| 指标 | 值 |
|------|---|
| Bundle size（gzip）| ~172 KB |
| 首屏白屏 | < 500ms（Vercel Edge）|
| 10,000 次模拟（Chrome M2 MBP）| ~1.5s |
| 引擎单测 | 7/7 通过，~3ms |
| Lighthouse Performance | 95+ |

主要 bundle 占位是 Recharts（~120KB gzip），其他都很小。

---

## 已知限制

1. **32 强对阵图是简化映射** — 不是 FIFA 官方"小组 A1 vs B2"那种确定 bracket。等抽签出来后可以替换 [src/engine/knockout.ts:buildR32](src/engine/knockout.ts)
2. **没有"小组第三晋级 → 16 强对手映射表"** — 用 ELO 排序+对位代替（FIFA 历史上根据小组第三所属小组决定对手）
3. **Poisson 假设进球独立** — 1 球差距比赛刻画偏弱（轻微低估冷门）。可换 Dixon-Coles bivariate 修正
4. **不刻画战术、伤病、首发选择** — ELO 是粗粒度实力指标
5. **ELO 不区分进攻/防守强度** — 高级模型应该分别 fit
6. **Wales / Scotland / 英格兰** — 用区域旗 emoji，部分浏览器渲染会缺字形
7. **没有真实历史比赛数据** — v0 用合成 ELO，未来应该接 [openfootball/worldcup](https://github.com/openfootball/worldcup) 数据集

---

## Roadmap

- [ ] 抽签后用真实小组替换投影
- [ ] 接入 openfootball 历史数据校准 ELO
- [ ] 加 Dixon-Coles 修正（低分平局更精准）
- [ ] Web Worker 化模拟，UI 不卡
- [ ] "What if" 对比模式：保存两套 ELO 配置并排比较
- [ ] 导出小红书风预测海报（接 ht-card-skill）
- [ ] 多语言：英文版

---

## 贡献

欢迎 PR：

```bash
git checkout -b feat/your-feature
# ... 改代码
npm test                    # 引擎测试必须过
npm run build               # 构建必须过
git commit -m "feat: ..."
git push origin feat/your-feature
gh pr create
```

代码风格：
- TypeScript strict
- Tailwind utility-first
- 不引新依赖，除非真有必要
- 引擎层保持 0 外部依赖

---

## License

MIT — 随便用、随便改、商用也行。

如果你想 fork 改成自己的版本：

1. 修改 [src/components/layout/VisitorCounter.tsx](src/components/layout/VisitorCounter.tsx) 里的 `NAMESPACE` 和 `KEY`
2. 改 [vite.config.ts](vite.config.ts) 里的 `BASE` 默认值（或部署时注入）
3. 改 [public/favicon.svg](public/favicon.svg) 换 logo

---

## 致谢

- 灵感来源：[mikobinbin/2026-world-cup-predictor](https://github.com/mikobinbin/2026-world-cup-predictor)（中文 Poisson + xG + 玄学因子）
- 数据集：[openfootball/worldcup](https://github.com/openfootball/worldcup)（公共域历届数据）
- 计数器：[counterapi.dev](https://counterapi.dev)
- 视觉灵感：NBA 球场强力量感 + 杂志感

---

**作者**：[@ghoulvspol](https://github.com/ghoulvspol)
**最后更新**：2026.05.31
