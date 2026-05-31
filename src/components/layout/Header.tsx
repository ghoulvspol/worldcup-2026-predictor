import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import VisitorCounter from './VisitorCounter';

const NAV = [
  { to: '/', en: 'OVERVIEW', zh: '总览' },
  { to: '/groups', en: 'GROUPS', zh: '小组赛' },
  { to: '/bracket', en: 'BRACKET', zh: '淘汰赛' },
  { to: '/teams', en: 'TEAMS', zh: '球队' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  // lock body scroll while drawer open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="border-b border-line bg-bg-0/85 backdrop-blur-md sticky top-0 z-30">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        <NavLink to="/" className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-gold-fill flex items-center justify-center font-display text-bg-0 font-extrabold text-sm shrink-0">
            ★
          </div>
          <div className="flex flex-col leading-none min-w-0">
            <span className="font-display font-extrabold text-[13px] sm:text-[15px] uppercase tracking-tight truncate">
              World Cup <span className="gold-fill">2026</span>
            </span>
            <span className="hidden sm:block font-mono text-[10px] tracking-[0.2em] text-dim mt-0.5">
              MONTE CARLO PREDICTOR
            </span>
          </div>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                `px-3 lg:px-4 py-2 rounded-md font-mono text-[12px] tracking-[0.18em] uppercase transition-all ${
                  isActive
                    ? 'bg-gold/10 text-gold border border-gold/40'
                    : 'text-dim hover:text-white hover:bg-white/5'
                }`
              }
            >
              {n.en}
            </NavLink>
          ))}
          <NavLink
            to="/"
            onClick={() => {
              // After router lands on "/", scroll to the methodology anchor.
              // We use a tiny timeout so the route renders first.
              setTimeout(() => {
                document.getElementById('methodology')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 50);
            }}
            className="px-3 lg:px-4 py-2 rounded-md font-mono text-[12px] tracking-[0.18em] uppercase transition-all text-dim hover:text-gold hover:bg-white/5"
          >
            METHOD
          </NavLink>
          <span className="ml-2"><VisitorCounter /></span>
        </nav>

        {/* Mobile: visitor counter (compact) + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <VisitorCounter compact />
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? '关闭菜单' : '打开菜单'}
            aria-expanded={open}
            className="w-10 h-10 rounded-md border border-line bg-white/[0.03] flex items-center justify-center active:scale-95 transition-transform"
          >
            <span className="sr-only">Menu</span>
            <div className="relative w-5 h-4 flex flex-col justify-between" aria-hidden>
              <span className={`block h-[2px] bg-gold transition-all origin-center ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`block h-[2px] bg-gold transition-opacity ${open ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`block h-[2px] bg-gold transition-all origin-center ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 top-14 z-20 transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-bg-0/85 backdrop-blur-sm" />
        <nav
          className="relative h-full overflow-y-auto px-5 pt-6 pb-10 flex flex-col gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-5 py-4 rounded-lg border font-mono uppercase tracking-[0.18em] text-sm transition-all ${
                  isActive
                    ? 'bg-gold/10 text-gold border-gold/40'
                    : 'text-dim border-line hover:text-white hover:border-white/30'
                }`
              }
            >
              <span>{n.en}</span>
              <span className="text-[11px] opacity-70">{n.zh}</span>
            </NavLink>
          ))}
          <NavLink
            to="/"
            onClick={() => {
              setTimeout(() => {
                document.getElementById('methodology')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 50);
            }}
            className="flex items-center justify-between px-5 py-4 rounded-lg border font-mono uppercase tracking-[0.18em] text-sm text-dim border-line hover:text-gold hover:border-gold/40 transition-all"
          >
            <span>METHOD</span>
            <span className="text-[11px] opacity-70">方法</span>
          </NavLink>
          <p className="text-dim text-xs mt-6 text-center">
            ★ World Cup 2026 · Monte Carlo Predictor ★
          </p>
        </nav>
      </div>
    </header>
  );
}
