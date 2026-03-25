import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import LandingPage from './pages/LandingPage/LandingPage';
import DashboardLayout from './pages/Dashboard/Dashboard';
import Overview from './pages/Dashboard/views/Overview';
import Portfolio from './pages/Dashboard/views/Portfolio';
import Activity from './pages/Dashboard/views/Activity';
import DashboardSwap from './pages/Dashboard/views/Swap';
import Swap from './pages/Swap/Swap';
import Markets from './pages/Markets';
import Governance from './pages/Governance';
import { ConnectWalletModal } from './components/wallet/ConnectWalletModal';
import './App.scss';

function App() {
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
          </Route>
          {/* Keep legacy route just in case users hit /swap directly, although links are now /dashboard/swap */}
          <Route path="/swap" element={<Swap />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/governance" element={<Governance />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
