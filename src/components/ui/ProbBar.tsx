import { pct } from '../../lib/format';

interface Props {
  value: number; // 0..1
  label?: string;
  color?: 'gold' | 'red' | 'cyan';
  height?: 'sm' | 'md' | 'lg';
}

export default function ProbBar({ value, label, color = 'gold', height = 'md' }: Props) {
  const h = height === 'sm' ? 'h-1.5' : height === 'lg' ? 'h-3' : 'h-2';
  const fill =
    color === 'red' ? 'bg-red' : color === 'cyan' ? 'bg-sky-400' : 'bg-gold-fill';
  const w = Math.max(0, Math.min(1, value)) * 100;

  return (
    <div className="w-full">
      {label ? (
        <div className="flex justify-between font-mono text-[11px] text-dim tracking-wider mb-1">
          <span>{label}</span>
          <span className="text-white font-bold">{pct(value)}</span>
        </div>
      ) : null}
      <div className={`w-full ${h} rounded-full bg-white/[0.06] overflow-hidden`}>
        <div className={`${h} ${fill} rounded-full transition-all duration-700 ease-out`} style={{ width: `${w}%` }} />
      </div>
    </div>
  );
}
