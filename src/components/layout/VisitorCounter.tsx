import { useEffect, useState } from 'react';

/**
 * Visitor counter backed by counterapi.dev (free, no auth).
 * - Increments once per browser session (sessionStorage flag).
 * - Falls back to local-only count if the API is unreachable.
 *
 * Namespace + key are arbitrary; pick something unique enough
 * that we don't collide with other public projects.
 */
const NAMESPACE = 'ghoulvspol';
const KEY = 'wc2026-predictor';
const SESSION_FLAG = `${NAMESPACE}.${KEY}.counted`;

interface CounterResponse {
  count?: number;
  Count?: number;
}

async function fetchCount(increment: boolean): Promise<number | null> {
  const path = increment ? 'up' : '';
  const url = `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}${path ? `/${path}` : ''}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as CounterResponse;
    return data.count ?? data.Count ?? null;
  } catch {
    return null;
  }
}

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const alreadyCounted =
      typeof window !== 'undefined' && sessionStorage.getItem(SESSION_FLAG) === '1';

    const load = async () => {
      const value = await fetchCount(!alreadyCounted);
      if (value === null) {
        setError(true);
        return;
      }
      setCount(value);
      if (!alreadyCounted) {
        sessionStorage.setItem(SESSION_FLAG, '1');
      }
    };
    load();
  }, []);

  return (
    <div
      className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-line bg-white/[0.02] font-mono"
      title="累计访问次数 · 同一会话只计一次"
    >
      <span className="w-2 h-2 rounded-full bg-gold animate-pulse" aria-hidden />
      <span className="text-[10px] text-dim tracking-[0.2em] uppercase">Visitors</span>
      <span className="font-display font-extrabold text-base gold-fill tabular-nums">
        {error ? '—' : count === null ? '...' : count.toLocaleString('en-US')}
      </span>
    </div>
  );
}
