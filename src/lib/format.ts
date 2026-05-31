export function pct(p: number, digits = 1): string {
  if (!isFinite(p) || p === 0) return '0%';
  if (p < 0.001) return '<0.1%';
  return `${(p * 100).toFixed(digits)}%`;
}

export function probFromCount(count: number, total: number): number {
  if (total === 0) return 0;
  return count / total;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}
