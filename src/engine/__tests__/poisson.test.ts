import { describe, expect, it } from 'vitest';
import { poissonRandom, poissonPmf, poissonDistribution } from '../poisson';
import { eloExpectedWin, projectXg } from '../elo';

describe('poissonRandom', () => {
  it('mean converges to lambda', () => {
    const lambda = 1.8;
    const N = 20000;
    let sum = 0;
    for (let i = 0; i < N; i++) sum += poissonRandom(lambda);
    const mean = sum / N;
    expect(Math.abs(mean - lambda)).toBeLessThan(0.06);
  });

  it('returns 0 for non-positive lambda', () => {
    expect(poissonRandom(0)).toBe(0);
    expect(poissonRandom(-1)).toBe(0);
  });
});

describe('poissonPmf / Distribution', () => {
  it('pmf approximately matches sampled frequencies', () => {
    expect(poissonPmf(1, 0)).toBeCloseTo(0.3679, 3);
    expect(poissonPmf(1, 1)).toBeCloseTo(0.3679, 3);
    expect(poissonPmf(2, 2)).toBeCloseTo(0.2707, 3);
  });

  it('distribution sums to ~1', () => {
    const dist = poissonDistribution(1.5, 6);
    const sum = dist.reduce((a, b) => a + b, 0);
    expect(Math.abs(sum - 1)).toBeLessThan(1e-6);
  });
});

describe('elo helpers', () => {
  it('200 ELO diff ≈ 76% expected win', () => {
    expect(eloExpectedWin(200)).toBeCloseTo(0.76, 1);
  });

  it('400 ELO diff ≈ 91% expected win', () => {
    expect(eloExpectedWin(400)).toBeCloseTo(0.909, 2);
  });

  it('projectXg favors stronger team', () => {
    const a = { code: 'BRA', elo: 2000 };
    const b = { code: 'KSA', elo: 1700 };
    const [aXg, bXg] = projectXg(a, b);
    expect(aXg).toBeGreaterThan(bXg);
    expect(aXg + bXg).toBeCloseTo(2.7, 1);
  });
});
