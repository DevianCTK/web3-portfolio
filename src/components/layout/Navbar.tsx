import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWallet } from '../../hooks/useWallet';
import { useWalletStore } from '../../store/useWalletStore';
import { SHOW_LANGUAGE_SELECTOR } from '../../config/appConfig';
import './Navbar.scss';

export function Navbar() {
  const { t, i18n } = useTranslation();
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
            <div className="logo">{t('app.name')}</div>
          </NavLink>
          <nav className="nav-links">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>{t('navbar.dashboard')}</NavLink>
            <NavLink to="/markets" className={({ isActive }) => isActive ? "active" : ""}>{t('navbar.markets')}</NavLink>
          </nav>
        </div>

        {/* Right Section */}
        <div className="nav-right">

          {!isConnected ? (
            <button className="connect-wallet-btn" onClick={() => setConnectModalOpen(true)}>
              {t('navbar.connectWallet')}
            </button>
          ) : (
            <div className="wallet-info-group">
              {mode === 'demo' && <span className="mode-badge demo">{t('navbar.demo')}</span>}
              {mode === 'wallet' && <span className="mode-badge live">{t('navbar.live')}</span>}
              <div className="wallet-details">
                <span className="balance-text">{balance || '0.00 ETH'}</span>
                <span className="address-text">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : t('navbar.demoWallet')}
                </span>
              </div>
              <button className="logout-btn" onClick={handleLogout} title={t('navbar.disconnectTitle')}>
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          )}
          {SHOW_LANGUAGE_SELECTOR && (
            <div className="lang-select">
              <select value={i18n.language || 'en'} onChange={(e) => i18n.changeLanguage(e.target.value)} aria-label="Language">
                <option value="en">EN</option>
                <option value="vi">VI</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
