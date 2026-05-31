import { NavLink } from 'react-router-dom';
import VisitorCounter from './VisitorCounter';

const NAV = [
  { to: '/', label: 'Overview', en: 'OVERVIEW' },
  { to: '/groups', label: '小组赛', en: 'GROUPS' },
  { to: '/bracket', label: '淘汰赛', en: 'BRACKET' },
  { to: '/teams', label: '球队 / ELO', en: 'TEAMS' },
  { to: '/#methodology', label: '方法', en: 'METHOD' },
];

export default function Header() {
  return (
    <header className="border-b border-line bg-bg-0/80 backdrop-blur-md sticky top-0 z-30">
      <div className="mx-auto max-w-[1400px] px-6 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-md bg-gold-fill flex items-center justify-center font-display text-bg-0 font-extrabold text-sm">
            ★
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-extrabold text-[15px] uppercase tracking-tight">
              World Cup <span className="gold-fill">2026</span>
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-dim mt-0.5">
              MONTE CARLO PREDICTOR
            </span>
          </div>
        </NavLink>

        <nav className="flex items-center gap-1">
          {NAV.filter((n) => !n.to.includes('#')).map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-md font-mono text-[12px] tracking-[0.18em] uppercase transition-all ${
                  isActive
                    ? 'bg-gold/10 text-gold border border-gold/40'
                    : 'text-dim hover:text-white hover:bg-white/5'
                }`
              }
            >
              {n.en}
            </NavLink>
          ))}
          <a
            href="/#methodology"
            className="px-4 py-2 rounded-md font-mono text-[12px] tracking-[0.18em] uppercase transition-all text-dim hover:text-gold hover:bg-white/5"
          >
            METHOD
          </a>
          <span className="ml-2"><VisitorCounter /></span>
        </nav>
      </div>
    </header>
  );
}
