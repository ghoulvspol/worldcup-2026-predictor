import { useEffect, useState } from 'react';

const NAMESPACE = 'ghoulvspol';
const KEY = 'wc2026-predictor';
const SESSION_FLAG = `${NAMESPACE}.${KEY}.counted`;

interface CounterResponse {
  count?: number;
  Count?: number;
}

async function fetchCount(increment: boolean): Promise<number | null> {
  const path = increment ? '/up' : '';
  const url = `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}${path}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as CounterResponse;
    return data.count ?? data.Count ?? null;
  } catch {
    return null;
  }
}

interface Props {
  /** Compact form for tight headers (mobile). */
  compact?: boolean;
}

export default function VisitorCounter({ compact = false }: Props) {
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
      if (!alreadyCounted) sessionStorage.setItem(SESSION_FLAG, '1');
    };
    load();
  }, []);

  const display = error ? '—' : count === null ? '...' : count.toLocaleString('en-US');

  if (compact) {
    return (
      <div
        className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-line bg-white/[0.02] font-mono"
        title="累计访问 · 同一会话只计一次"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" aria-hidden />
        <span className="font-display font-extrabold text-[12px] gold-fill tabular-nums leading-none">
          {display}
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-line bg-white/[0.02] font-mono"
      title="累计访问次数 · 同一会话只计一次"
    >
      <span className="w-2 h-2 rounded-full bg-gold animate-pulse" aria-hidden />
      <span className="text-[10px] text-dim tracking-[0.2em] uppercase">Visitors</span>
      <span className="font-display font-extrabold text-base gold-fill tabular-nums">
        {display}
      </span>
    </div>
  );
}
