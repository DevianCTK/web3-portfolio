import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../../../store/useWalletStore';
import './Overview.scss';

export default function Overview() {
  const navigate = useNavigate();
  const address = useWalletStore((state) => state.address);
  const balance = useWalletStore((state) => state.balance);
  const setConnectModalOpen = useWalletStore((state) => state.setConnectModalOpen);

  // If connected, we use the real or demo balance
  const parsedBalance = parseFloat(balance || "0");
  const displayUsd = balance ? (parsedBalance * 2450.12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";

  const handleAuthAction = () => {
    if (!address) {
      setConnectModalOpen(true);
    } else {
      navigate('/dashboard/swap');
    }
  };

  const handleAction = (label: string) => {
    alert(`${label} feature coming soon!`);
  };

  return (
    <div className="overview-view">
      {/* Hero Grid */}
      <div className="hero-grid">
        {/* Total Net Worth Card */}
        <div className="net-worth-card group">
          <div className="content-left">
            <p className="label">Total Net Worth</p>
            <h1 className="amount">${displayUsd}</h1>
            <div className="growth">
              <span className="badge">
                <span className="material-symbols-outlined">trending_up</span>
                +12.4%
              </span>
              <span className="context">vs last 30 days</span>
            </div>
          </div>
          <div className="content-right">
            {/* Visual placeholder for a small growth chart */}
            <div className="bar-chart">
              <div className="bar b1"></div>
              <div className="bar b2"></div>
              <div className="bar b3"></div>
              <div className="bar b4"></div>
              <div className="bar b5"></div>
              <div className="bar b6"></div>
              <div className="bar b7"></div>
            </div>
          </div>
          {/* Decorative Background Gradient */}
          <div className="glow-bg"></div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="action-btn" onClick={handleAuthAction}>
            <div className="icon-circle send">
              <span className="material-symbols-outlined">north_east</span>
            </div>
            <span className="label">Send</span>
          </button>
          <button className="action-btn" onClick={handleAuthAction}>
            <div className="icon-circle receive">
              <span className="material-symbols-outlined">south_west</span>
            </div>
            <span className="label">Receive</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/dashboard/swap')}>
            <div className="icon-circle swap">
              <span className="material-symbols-outlined">swap_horiz</span>
            </div>
            <span className="label">Swap</span>
          </button>
          <button className="action-btn" onClick={() => handleAction('Add Token')}>
            <div className="icon-circle add">
              <span className="material-symbols-outlined">add</span>
            </div>
            <span className="label">Add Token</span>
          </button>
        </div>
      </div>

      {/* Dashboard Content Layout */}
      <div className="content-layout">
        {/* Transactions Table */}
        <div className="transactions-table">
          <div className="table-header">
            <h3>Recent Transactions</h3>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard/activity'); }}>View All</a>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Asset</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="action-info">
                      <div className="icon-box received">
                        <span className="material-symbols-outlined">call_received</span>
                      </div>
                      <span>Received</span>
                    </div>
                  </td>
                  <td className="asset">Ethereum</td>
                  <td className="amount">1.42 ETH</td>
                  <td>
                    <span className="status-badge completed">Completed</span>
                  </td>
                  <td className="time">2 mins ago</td>
                </tr>
                <tr>
                  <td>
                    <div className="action-info">
                      <div className="icon-box swap">
                        <span className="material-symbols-outlined">swap_horiz</span>
                      </div>
                      <span>Swap</span>
                    </div>
                  </td>
                  <td className="asset">USDC → ETH</td>
                  <td className="amount">$5,000.00</td>
                  <td>
                    <span className="status-badge completed">Completed</span>
                  </td>
                  <td className="time">1 hour ago</td>
                </tr>
                <tr>
                  <td>
                    <div className="action-info">
                      <div className="icon-box sent">
                        <span className="material-symbols-outlined">call_made</span>
                      </div>
                      <span>Sent</span>
                    </div>
                  </td>
                  <td className="asset">Solana</td>
                  <td className="amount">42.00 SOL</td>
                  <td>
                    <span className="status-badge pending">Pending</span>
                  </td>
                  <td className="time">3 hours ago</td>
                </tr>
                <tr>
                  <td>
                    <div className="action-info">
                      <div className="icon-box received">
                        <span className="material-symbols-outlined">call_received</span>
                      </div>
                      <span>Received</span>
                    </div>
                  </td>
                  <td className="asset">Chainlink</td>
                  <td className="amount">150.0 LINK</td>
                  <td>
                    <span className="status-badge completed">Completed</span>
                  </td>
                  <td className="time">Yesterday</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Portfolio Breakdown Sidebar Content */}
        <div className="sidebar-content">
          <div className="asset-allocation">
            <h3>Asset Allocation</h3>
            <div className="allocation-list">
              <div className="alloc-item">
                <div className="info">
                  <div className="dot eth"></div>
                  <span>Ethereum</span>
                </div>
                <span className="percent">54.2%</span>
              </div>
              <div className="alloc-item">
                <div className="info">
                  <div className="dot stable"></div>
                  <span>Stablecoins</span>
                </div>
                <span className="percent">28.9%</span>
              </div>
              <div className="alloc-item">
                <div className="info">
                  <div className="dot defi"></div>
                  <span>DeFi Assets</span>
                </div>
                <span className="percent">12.5%</span>
              </div>
              <div className="alloc-item">
                <div className="info">
                  <div className="dot other"></div>
                  <span>Other</span>
                </div>
                <span className="percent">4.4%</span>
              </div>
            </div>
            
            <div className="analysis-btn">
              <button onClick={() => navigate('/dashboard/portfolio')}>Portfolio Analysis</button>
            </div>
          </div>

          <div className="security-banner" onClick={() => handleAction('Security Center')}>
            <div className="content">
              <h4>Shield Active</h4>
              <p>Your wallet is being monitored for suspicious approval requests.</p>
            </div>
            <span className="material-symbols-outlined bg-icon" style={{ fontVariationSettings: "'FILL' 1" }}>
              security
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
