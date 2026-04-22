import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import LandingPage from './pages/LandingPage/LandingPage';
import DashboardLayout from './pages/Dashboard/Dashboard';
import Overview from './pages/Dashboard/views/Overview';
import Portfolio from './pages/Dashboard/views/Portfolio';
import Activity from './pages/Dashboard/views/Activity';
import ActivityDetail from './pages/Dashboard/views/ActivityDetail';
import DashboardSwap from './pages/Dashboard/views/Swap';
import Markets from './pages/Markets';
import CoinDetail from './pages/CoinDetail/CoinDetail';
import { ConnectWalletModal } from './components/wallet/ConnectWalletModal';
import './App.scss';
import { useTokenBalances } from './hooks/useTokenBalances';

function App() {
  // Kick off background token balance sync when app mounts
  useTokenBalances();
  return (
    <div className="min-h-screen bg-background text-on-surface font-body overflow-x-hidden">
      <Navbar />
      <ConnectWalletModal />
      <div className="flex-1 w-full relative padded-route">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="swap" element={<DashboardSwap />} />
            <Route path="activity" element={<Activity />} />
            <Route path="activity/:txId" element={<ActivityDetail />} />
          </Route>
          {/* Redirect legacy /swap to dashboard swap */}
          <Route path="/swap" element={<Navigate to="/dashboard/swap" replace />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/markets/:coinId" element={<CoinDetail />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
