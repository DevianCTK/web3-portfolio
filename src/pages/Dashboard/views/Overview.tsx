import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../../hooks/useAppData';
import { useWalletStore } from '../../../store/useWalletStore';
import './Overview.scss';

export default function Overview() {
  const navigate = useNavigate();
  const { mode, balanceUsd, totalChange, totalChangePositive, overviewTransactions, assetAllocation } = useAppData();
  const setConnectModalOpen = useWalletStore((state) => state.setConnectModalOpen);

  if (mode === 'disconnected') {
    return (
      <div className="overview-view">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '3rem', opacity: 0.4 }}>dashboard</span>
          <h2 style={{ marginTop: '1rem', fontSize: '1.25rem' }}>Connect to View Dashboard</h2>
          <p style={{ opacity: 0.5, marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Connect your wallet or use Demo Mode to access the dashboard.
          </p>
          <button
            className="btn-primary"
            style={{ marginTop: '1.5rem' }}
            onClick={() => setConnectModalOpen(true)}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overview-view">
      {/* Hero Grid */}
      <div className="hero-grid">
        {/* Total Net Worth Card */}
        <div className="net-worth-card group">
          <div className="content-left">
            <p className="label">Total Net Worth</p>
            <h1 className="amount">{balanceUsd}</h1>
            <div className="growth">
              {totalChange !== '--' && (
                <span className="badge">
                  <span className="material-symbols-outlined">
                    {totalChangePositive ? 'trending_up' : 'trending_down'}
                  </span>
                  {totalChange}
                </span>
              )}
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

      </div>

      {/* Dashboard Content Layout */}
      <div className="content-layout">
        {/* Transactions Table */}
        <div className="transactions-table">
          <div className="table-header">
            <h3>Recent Transactions</h3>
            {overviewTransactions.length > 0 && (
              <button className="text-primary text-sm hover:underline" onClick={() => navigate('/dashboard/activity')}>View All</button>
            )}
          </div>
          <div className="table-wrapper">
            {overviewTransactions.length > 0 ? (
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
                  {overviewTransactions.map((tx, i) => (
                    <tr key={i}>
                      <td>
                        <div className="action-info">
                          <div className={`icon-box ${tx.actionClass}`}>
                            <span className="material-symbols-outlined">{tx.actionIcon}</span>
                          </div>
                          <span>{tx.action}</span>
                        </div>
                      </td>
                      <td className="asset">{tx.asset}</td>
                      <td className="amount">{tx.amount}</td>
                      <td>
                        <span className={`status-badge ${tx.statusClass}`}>{tx.status}</span>
                      </td>
                      <td className="time">{tx.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-2 opacity-50">
                <span className="material-symbols-outlined text-3xl">receipt_long</span>
                <p className="text-sm">{mode === 'wallet' ? 'Activity available in Demo Mode only' : 'No transactions yet'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Breakdown Sidebar Content */}
        <div className="sidebar-content">
          <div className="asset-allocation">
            <h3>Asset Allocation</h3>
            {assetAllocation.length > 0 ? (
              <div className="allocation-list">
                {assetAllocation.map((item, i) => (
                  <div className="alloc-item" key={i}>
                    <div className="info">
                      {item.icon ? (
                        <div className="token-icon-small"><img src={item.icon} alt={item.label} /></div>
                      ) : (
                        <div className={`dot ${item.dotClass}`}></div>
                      )}
                      <span>{item.label}</span>
                    </div>
                    <span className="percent">{item.percent}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 gap-2 opacity-50">
                <span className="material-symbols-outlined text-2xl">pie_chart</span>
                <p className="text-sm">{mode === 'wallet' ? 'No on-chain assets to display' : 'No allocation data'}</p>
              </div>
            )}

            <div className="analysis-btn">
              <button onClick={() => navigate('/dashboard/portfolio')}>Portfolio Analysis</button>
            </div>
          </div>

          <div className="security-banner">
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
