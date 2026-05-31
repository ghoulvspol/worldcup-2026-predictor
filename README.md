# 2026 World Cup · Monte Carlo Predictor

本地纯前端的 2026 美加墨世界杯预测沙盘。Vite + React + TypeScript + Tailwind + Zustand + Recharts。

参考 GitHub 上 `mikobinbin/2026-world-cup-predictor` 的思路（Poisson + ELO + 主场加成），把它扩成完整 48 队赛程模拟。

## 启动

```bash
cd /Users/htsage/workspace/worldcup-2026-predictor
npm install
npm run dev
# 浏览器自动打开 http://localhost:5173
```

引擎单测：

```bash
npm run test
```

## 数据来源（重要）

**当前所有数据是 2026.05 时点的"投影"**，不是确定的真实赛事数据：

| 数据 | 来源 | 状态 |
|------|------|------|
| USA / CAN / MEX | 主办国保送（FIFA 规则） | ✅ Confirmed |
| 其他 45 支球队 | 截至 2026.05 的 FIFA 男足世界排名 + 已知预选赛进度 | ⚠️ Projected |
| 12 个小组分配 | 按蛇形档分配的投影抽签（A-L 12 组 × 4 队） | ⚠️ Projected |
| 初始 ELO | 由 FIFA 排名分档映射（Top 1-5 ≈ 2050，Bottom ≈ 1480） | ⚠️ Calibrated |

**不准确的地方与改进路径：**
- 2025/12 官方抽签后 → 改 `src/data/teams.ts` 的 `group` 字段为真实抽签
- 2026 预选赛全部结束后 → 把 `projected: true` 的球队替换为实际晋级队伍
- ELO 想要更准 → 用真实历史比赛 + Glicko 模型重新拟合

UI 上每支球队都有 `Projected` / `Confirmed` 标签，主页 Hero 也有醒目提示。

## 引擎

### 算法

1. **xG 推算**：双方 ELO 差 → 期望进球差 → 各自 xG（base 1.35、slope 0.0032、clamp [0.2, 4.0]）
2. **Poisson 抽样**：Knuth 算法，0 依赖，单次 ~10ns
3. **小组赛**：6 场循环 → 积分 → 净胜球 → 进球数 → ELO 备份排序
4. **32 强出线**：12 组前 2（24 队） + 8 个最佳第 3
5. **淘汰赛**：32 → 16 → 8 → 4 → 2 → 1，平局走加时（xG × 1/3） + 点球（ELO 加权）
6. **蒙特卡洛**：默认 10000 次跑，记录每队各阶段抵达率

### 参数

- 主办国主场加成：+75 ELO（USA / CAN / MEX）
- 偶发"upset 因子"：每场 ±60 ELO 的 ±1% 噪声，让冷门有空间

性能：浏览器单线程跑 10000 次约 1-2s。引擎在 Node 上 2000 次 ~75ms。

## 视觉

复用我做小红书 deck 的 nba-bold 主题：
- 背景：黑底 + 球场弧线 + 红橙渐变 + 对角红条纹
- 字体：Oswald（display）+ Inter（body）+ JetBrains Mono（meta/数字）
- 主色：金 `#FF6B1A` + 红 `#C8102E`

## 路由

- `/` — Overview · 仪表盘 + RUN 按钮 + Top 24 冠军概率条形图 + 决赛对阵 Top 5
- `/groups` — 12 个小组卡 · 出线概率
- `/bracket` — 5 列阶段图（R16 / QF / SF / F / 🏆）+ 完整 ladder 表
- `/match/:home/:away[/ko]` — 单场比赛 · Poisson 进球分布 + Top 5 比分
- `/teams` — 48 队 · ELO 输入框 · RE-SIMULATE

## 不做

- 后端 / 服务端模拟
- 真实历史数据接入（v0 用合成 ELO）
- 用户登录 / 多设备同步
- 部署到生产（先本地跑通，公网部署是后话）

## 已知 limitation

1. 32 强对阵图用的是简化映射（强弱平衡 + 同 ELO 不撞早），不是 FIFA 官方"小组 A1 vs B2"那种确定 bracket。等抽签出来后可以替换 `src/engine/knockout.ts#buildR32`。
2. 国家/球队类型（中文体育圈调用习惯：英格兰是国家队但用 ENG 区分），这里用 ISO 3-letter 简写。Wales/Scotland 用区域旗 emoji。
3. 没有"小组第三晋级 → 16 强对手映射表"那张官方表，统一用 ELO 排序+对位代替。
