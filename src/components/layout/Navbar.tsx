import { NavLink } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import { Search, Bell, Settings, LogOut } from 'lucide-react';
import { useWalletStore } from '../../store/useWalletStore';
import './Navbar.scss';

export function Navbar() {
  const { isConnected, address, balance, disconnect, isDemoMode } = useWallet();

  const setConnectModalOpen = useWalletStore((state) => state.setConnectModalOpen);

  return (
    <header className="navbar">
      <div className="nav-container">

        {/* Left Section */}
        <div className="nav-left">
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
            <div className="logo">ETHEREAL</div>
          </NavLink>
          <nav className="nav-links">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
            <NavLink to="/swap" className={({ isActive }) => isActive ? "active" : ""}>Swap</NavLink>
            <NavLink to="/markets" className={({ isActive }) => isActive ? "active" : ""}>Markets</NavLink>
            <NavLink to="/governance" className={({ isActive }) => isActive ? "active" : ""}>Governance</NavLink>
          </nav>
        </div>

        {/* Right Section */}
        <div className="nav-right">
          <div className="search-bar flex items-center">
            <Search className="search-icon" />
            <input type="text" placeholder="Search protocol..." />
          </div>

          <button className="icon-btn">
            <Bell />
          </button>

          <button className="icon-btn">
            <Settings />
          </button>

          {!isConnected ? (
            <button className="connect-wallet-btn" onClick={() => setConnectModalOpen(true)}>
              Connect Wallet
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end text-right mr-2">
                <div className="text-sm font-bold text-gray-200 flex items-center justify-end">
                  {isDemoMode && <span className="text-[10px] text-yellow-500 border border-yellow-500/20 bg-yellow-500/10 px-1.5 py-0.5 rounded mr-2 uppercase tracking-widest leading-none">Demo</span>}
                  {balance || '0.00 ETH'}
                </div>
                <div className="text-xs text-gray-400 font-mono mt-0.5">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
              </div>
              <button className="connect-wallet-btn connected flex items-center gap-2" onClick={disconnect} title="Disconnect">
                <LogOut className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
