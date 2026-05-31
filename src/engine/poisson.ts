/**
 * Poisson sampler (Knuth) — fine for λ ≤ ~10. Returns integer goals.
 * For our domain λ ∈ [0.2, 4.0] this is well-behaved and fast.
 */
export function poissonRandom(lambda: number, rng: () => number = Math.random): number {
  if (lambda <= 0) return 0;
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= rng();
  } while (p > L);
  return k - 1;
}

/** P(X = k) for Poisson(λ). */
export function poissonPmf(lambda: number, k: number): number {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  let logP = -lambda + k * Math.log(lambda);
  for (let i = 2; i <= k; i++) logP -= Math.log(i);
  return Math.exp(logP);
}

/** Distribution over goals 0..maxK and the residual for ≥maxK+1. */
export function poissonDistribution(lambda: number, maxK = 5): number[] {
  const out: number[] = [];
  let cumulative = 0;
  for (let k = 0; k <= maxK; k++) {
    const p = poissonPmf(lambda, k);
    out.push(p);
    cumulative += p;
  }
  out.push(Math.max(0, 1 - cumulative));
  return out;
}
