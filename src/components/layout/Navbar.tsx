import { NavLink } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import { useWalletStore } from '../../store/useWalletStore';
import './Navbar.scss';

export function Navbar() {
  const { isConnected, address, balance, disconnect, mode } = useWallet();
  const setConnectModalOpen = useWalletStore((state) => state.setConnectModalOpen);

  const handleLogout = () => {
    // Clear demo localStorage data on logout
    disconnect();
  };

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
            <NavLink to="/markets" className={({ isActive }) => isActive ? "active" : ""}>Markets</NavLink>
          </nav>
        </div>

        {/* Right Section */}
        <div className="nav-right">

          {!isConnected ? (
            <button className="connect-wallet-btn" onClick={() => setConnectModalOpen(true)}>
              Connect Wallet
            </button>
          ) : (
            <div className="wallet-info-group">
              {mode === 'demo' && <span className="mode-badge demo">Demo</span>}
              {mode === 'wallet' && <span className="mode-badge live">Live</span>}
              <div className="wallet-details">
                <span className="balance-text">{balance || '0.00 ETH'}</span>
                <span className="address-text">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Demo Wallet'}
                </span>
              </div>
              <button className="logout-btn" onClick={handleLogout} title="Disconnect and return to landing">
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
