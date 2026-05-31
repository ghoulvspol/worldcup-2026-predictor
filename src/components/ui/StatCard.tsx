import { ReactNode } from 'react';

interface Props {
  kicker: string;
  value: ReactNode;
  sub?: ReactNode;
  accent?: 'gold' | 'red' | 'plain';
}

export default function StatCard({ kicker, value, sub, accent = 'gold' }: Props) {
  const border =
    accent === 'red'
      ? 'border-red/40 bg-red-soft'
      : accent === 'plain'
        ? 'border-line'
        : 'border-gold/30 bg-gold-soft';

  return (
    <div className={`panel border-l-[3px] p-5 ${border}`}>
      <div className="kicker mb-2">{kicker}</div>
      <div className="font-display font-extrabold text-3xl md:text-4xl leading-none">{value}</div>
      {sub ? <div className="mt-2 text-sm text-dim">{sub}</div> : null}
    </div>
  );
}
