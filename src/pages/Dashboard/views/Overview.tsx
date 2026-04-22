import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../../hooks/useAppData';
import { TOKENS, SWAP_TOKENS, PORTFOLIO_ASSETS } from '../../../data/mockData';
import { useWalletStore } from '../../../store/useWalletStore';
import { useTranslation } from 'react-i18next';
import './Overview.scss';

export default function Overview() {
  const navigate = useNavigate();
  const { mode, balanceUsd, totalChange, totalChangePositive, overviewTransactions, assetAllocation } = useAppData();
  const setConnectModalOpen = useWalletStore((state) => state.setConnectModalOpen);
  const { t } = useTranslation();

  if (mode === 'disconnected') {
    return (
      <div className="overview-view">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '3rem', opacity: 0.4 }}>dashboard</span>
          <h2 style={{ marginTop: '1rem', fontSize: '1.25rem' }}>{t('overview.connectPrompt', 'Connect to View Dashboard')}</h2>
          <p style={{ opacity: 0.5, marginTop: '0.5rem', fontSize: '0.875rem' }}>
            {t('overview.connectDesc', 'Connect your wallet or use Demo Mode to access the dashboard.')}
          </p>
          <button
            className="btn-primary"
            style={{ marginTop: '1.5rem' }}
            onClick={() => setConnectModalOpen(true)}
          >
            {t('overview.connectWallet', 'Connect Wallet')}
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
            <h3>{t('overview.recentTransactions', 'Recent Transactions')}</h3>
            {overviewTransactions.length > 0 && (
              <button className="text-primary text-sm hover:underline" onClick={() => navigate('/dashboard/activity')}>{t('overview.viewAll', 'View All')}</button>
            )}
          </div>
          <div className="table-wrapper">
            {overviewTransactions.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>{t('activity.headers.action', 'Action')}</th>
                    <th>{t('activity.headers.asset', 'Asset')}</th>
                    <th>{t('activity.headers.amount', 'Amount')}</th>
                    <th>{t('activity.headers.status', 'Status')}</th>
                    <th style={{ textAlign: 'right' }}>{t('activity.headers.date', 'Time')}</th>
                  </tr>
                </thead>
                <tbody>
                  {overviewTransactions.map((tx, i) => {
                    const arrowParts = tx.asset.split(/\s*→\s*|\s*->\s*/);

                    const renderPart = (part: string, keyBase: string) => {
                      const text = part.trim();
                      // find token by exact symbol match first, then name inclusion
                      // build a combined token list (TOKENS, SWAP_TOKENS, PORTFOLIO_ASSETS)
                      const combined = [
                        ...Object.values(TOKENS),
                        ...Object.values(SWAP_TOKENS),
                        ...PORTFOLIO_ASSETS.map(a => ({ symbol: a.ticker, name: a.name, icon: a.icon })),
                      ];

                      const token = combined.find(t => t.symbol && t.symbol.toLowerCase() === text.toLowerCase())
                        || combined.find(t => t.symbol && text.toLowerCase().includes(t.symbol.toLowerCase()) || (t.name && t.name.toLowerCase().includes(text.toLowerCase())));

                      if (token) {
                        return (
                          <span key={keyBase} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <img src={token.icon} alt={token.symbol} style={{ width: 24, height: 24, borderRadius: 9999, objectFit: 'cover' }} />
                            <span>{token.symbol}</span>
                          </span>
                        );
                      }

                      return <span key={keyBase}>{text}</span>;
                    };

                    return (
                      <tr key={i}>
                        <td>
                          <div className="action-info">
                            <div className={`icon-box ${tx.actionClass}`}>
                              <span className="material-symbols-outlined">{tx.actionIcon}</span>
                            </div>
                            <span>{tx.action}</span>
                          </div>
                        </td>
                        <td className="asset">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {arrowParts.length > 1 ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {arrowParts.map((p, idx) => (
                                  <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                    {renderPart(p, `p-${i}-${idx}`)}
                                    {idx < arrowParts.length - 1 && <span style={{ opacity: 0.8 }}>→</span>}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              // single-part asset: try to show its icon if available
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {renderPart(arrowParts[0], `p-${i}-0`)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="amount">{tx.amount}</td>
                        <td>
                          <span className={`status-badge ${tx.statusClass}`}>{tx.status}</span>
                        </td>
                        <td className="time">{tx.time}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-2 opacity-50">
                <span className="material-symbols-outlined text-3xl">receipt_long</span>
                <p className="text-sm">{mode === 'wallet' ? t('activity.demoOnly', 'Activity available in Demo Mode only') : t('activity.noTransactions', 'No transactions yet')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Breakdown Sidebar Content */}
        <div className="sidebar-content">
          <div className="asset-allocation">
            <h3>{t('overview.assetAllocation', 'Asset Allocation')}</h3>
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
                <p className="text-sm">{mode === 'wallet' ? t('overview.noOnchainAssets', 'No on-chain assets to display') : t('overview.noAllocationData', 'No allocation data')}</p>
              </div>
            )}

            <div className="analysis-btn">
              <button onClick={() => navigate('/dashboard/portfolio')}>{t('overview.portfolioAnalysis', 'Portfolio Analysis')}</button>
            </div>
          </div>

          <div className="security-banner">
            <div className="content">
              <h4>{t('overview.shieldActive', 'Shield Active')}</h4>
              <p>{t('overview.shieldDesc', 'Your wallet is being monitored for suspicious approval requests.')}</p>
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
