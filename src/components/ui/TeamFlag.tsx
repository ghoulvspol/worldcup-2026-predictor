import type { Team } from '../../engine/types';

interface Props {
  team: Team;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  showElo?: boolean;
}

export default function TeamFlag({ team, size = 'md', showName = true, showElo = false }: Props) {
  const fontSize =
    size === 'sm' ? 'text-base' : size === 'lg' ? 'text-3xl' : 'text-xl';
  const labelSize =
    size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';

  return (
    <div className="flex items-center gap-2">
      <span className={`${fontSize} leading-none`} aria-hidden>
        {team.flag}
      </span>
      {showName ? (
        <div className="flex flex-col leading-tight">
          <span className={`${labelSize} font-medium text-white`}>{team.name}</span>
          {showElo ? (
            <span className="font-mono text-[10px] text-dim tracking-wider">
              ELO {Math.round(team.elo)}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
