import { NavLink, Outlet } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import { useWalletStore } from '../../store/useWalletStore';
import './Dashboard.scss';

export default function DashboardLayout() {
  const { isConnected, address, mode } = useWallet();
  const setConnectModalOpen = useWalletStore((state) => state.setConnectModalOpen);
  const isWalletMode = mode === 'wallet';

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <nav className="nav-menu">
          <NavLink to="/dashboard" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="material-symbols-outlined">dashboard</span>
            <span>Overview</span>
          </NavLink>
          <NavLink to="/dashboard/portfolio" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span>Portfolio</span>
          </NavLink>
          {!isWalletMode && (
            <NavLink to="/dashboard/swap" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="material-symbols-outlined">swap_horiz</span>
              <span>Swap</span>
            </NavLink>
          )}
          {!isWalletMode && (
            <NavLink to="/dashboard/activity" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="material-symbols-outlined">history</span>
              <span>Activity</span>
            </NavLink>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <div className="dashboard-content-container">
          <Outlet />
        </div>
      </main>

      {/* Mobile Nav */}
      <div className="dashboard-mobile-nav">
        <NavLink to="/dashboard" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="label">Overview</span>
        </NavLink>
        <NavLink to="/dashboard/portfolio" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="label">Portfolio</span>
        </NavLink>
        {!isWalletMode && (
          <NavLink to="/dashboard/swap" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="material-symbols-outlined">swap_horiz</span>
            <span className="label">Swap</span>
          </NavLink>
        )}
        {!isWalletMode && (
          <NavLink to="/dashboard/activity" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="material-symbols-outlined">history</span>
            <span className="label">Activity</span>
          </NavLink>
        )}
      </div>
    </div>
  );
}
