import { Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Overview from './routes/Overview';
import Groups from './routes/Groups';
import Bracket from './routes/Bracket';
import Match from './routes/Match';
import Teams from './routes/Teams';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-[1400px] px-6 py-10">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/bracket" element={<Bracket />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/match/:home/:away" element={<Match />} />
          <Route path="/match/:home/:away/:knockout" element={<Match />} />
        </Routes>
      </main>
      <footer className="border-t border-line py-6 text-center font-mono text-[11px] tracking-[0.25em] text-dim uppercase">
        ★ World Cup 2026 · Monte Carlo · Poisson + ELO · Projected Lineup ★
      </footer>
    </div>
  );
}
