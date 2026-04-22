import { useAppData } from '../../../hooks/useAppData';
import { TOKENS, SWAP_TOKENS, PORTFOLIO_ASSETS } from '../../../data/mockData';
import { useWalletStore } from '../../../store/useWalletStore';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Activity.scss';

const ACTION_CONFIG = {
  receive: { icon: 'south_west', className: 'receive', label: 'Receive' },
  send: { icon: 'north_east', className: 'send', label: 'Send' },
  swap: { icon: 'sync_alt', className: 'swap', label: 'Swap' },
} as const;

export default function Activity() {
  const { t } = useTranslation();
  const { mode, transactions } = useAppData();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 8; // items per page for activity listing
  const setConnectModalOpen = useWalletStore((state) => state.setConnectModalOpen);
  const navigate = useNavigate();

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));

  useEffect(() => {
    // reset to first page when transactions change
    // schedule async to avoid synchronous setState-in-effect cascading renders
    const t = window.setTimeout(() => setCurrentPage(1), 0);
    return () => window.clearTimeout(t);
  }, [transactions.length]);

  if (mode === 'disconnected') {
    return (
      <div className="activity-page">
        <section className="activity-content">
          <div className="content-container">
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '3rem', opacity: 0.4 }}>receipt_long</span>
              <h2 style={{ marginTop: '1rem', fontSize: '1.25rem' }}>{t('activity.connectPrompt')}</h2>
              <p style={{ opacity: 0.5, marginTop: '0.5rem', fontSize: '0.875rem' }}>
                {t('activity.connectDesc')}
              </p>
              <button
                className="btn-primary"
                style={{ marginTop: '1.5rem' }}
                onClick={() => setConnectModalOpen(true)}
              >
                {t('navbar.connectWallet')}
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="activity-page">
      <section className="activity-content">
        <div className="content-container">
          {/* Page Header */}
          <div className="page-header">
            <div className="title-area">
              <p className="subtitle">{t('activity.historicalLedger')}</p>
              <h1 className="title">{t('activity.title')}</h1>
            </div>
          </div>

          {/* Transaction Table Container */}
          <div className="table-container">
            {transactions.length > 0 ? (
              <>
                <table className="activity-table">
                  <thead>
                    <tr>
                      <th>{t('activity.headers.date')}</th>
                      <th>{t('activity.headers.action')}</th>
                      <th>{t('activity.headers.asset')}</th>
                      <th>{t('activity.headers.amount')}</th>
                      <th>{t('activity.headers.status')}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions
                      .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                      .map((tx) => {
                        const config = ACTION_CONFIG[tx.action];
                        return (
                          <tr className="table-row group" key={tx.id}>
                            <td className="col-date">
                              <div className="date-time">
                                <span className="date">{tx.date}</span>
                                <span className="time">{tx.time}</span>
                              </div>
                            </td>
                            <td className="col-action">
                              <span className={`action-badge ${config.className}`}>
                                <span className="material-symbols-outlined">{config.icon}</span>
                                <span>{config.label}</span>
                              </span>
                            </td>
                            <td className="col-asset">
                              <div className="asset-info" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {(() => {
                                  const parts = tx.asset.split(/\s*→\s*|\s*->\s*/).map(p => p.trim());

                                  const renderSegment = (segment: string, key: string) => {
                                    const combined = [
                                      ...Object.values(TOKENS),
                                      ...Object.values(SWAP_TOKENS),
                                      ...PORTFOLIO_ASSETS.map(a => ({ symbol: a.ticker, name: a.name, icon: a.icon })),
                                    ];

                                    const bySymbol = combined.find(t => t.symbol && t.symbol.toLowerCase() === segment.toLowerCase());
                                    if (bySymbol) {
                                      return (
                                        <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                          <img src={bySymbol.icon} alt={bySymbol.symbol} style={{ width: 24, height: 24, borderRadius: 9999, objectFit: 'cover' }} />
                                          <span>{bySymbol.symbol}</span>
                                        </span>
                                      );
                                    }

                                    const byInclusion = combined.find(t => (t.symbol && segment.toLowerCase().includes(t.symbol.toLowerCase())) || (t.name && t.name.toLowerCase().includes(segment.toLowerCase())));
                                    if (byInclusion) {
                                      return (
                                        <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                          <img src={byInclusion.icon} alt={byInclusion.symbol} style={{ width: 24, height: 24, borderRadius: 9999, objectFit: 'cover' }} />
                                          <span>{byInclusion.symbol}</span>
                                        </span>
                                      );
                                    }

                                    return <span key={key}>{segment}</span>;
                                  };

                                  if (parts.length > 1) {
                                    return (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {parts.map((seg, idx) => (
                                          <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                            {renderSegment(seg, `seg-${tx.id}-${idx}`)}
                                            {idx < parts.length - 1 && <span style={{ opacity: 0.8 }}>→</span>}
                                          </span>
                                        ))}
                                      </div>
                                    );
                                  }

                                  // fallback: render original icon or token name
                                  return (
                                    <>
                                      <div className={`icon ${tx.iconColor}`}>
                                        <span className="material-symbols-outlined">
                                          {tx.action === 'swap' ? 'sync_alt' : 'token'}
                                        </span>
                                      </div>
                                      <span className="name">{tx.asset}</span>
                                    </>
                                  );
                                })()}
                              </div>
                            </td>
                            <td className="col-amount">
                              <div className="amount-info">
                                <span className={`value ${tx.amountSign === '+' ? 'positive' : tx.amountSign === '-' ? 'negative' : ''}`}>
                                  {tx.amount}
                                </span>
                                <span className="fiat">{tx.fiat}</span>
                              </div>
                            </td>
                            <td className="col-status">
                              <span className={`status-badge ${tx.status}`}>
                                <span className={`dot ${tx.status === 'pending' ? 'animate-pulse' : ''}`}></span>
                                <span>{tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}</span>
                              </span>
                            </td>
                            <td className="col-link text-right">
                              <button
                                className="icon-link-btn"
                                title={t('activity.viewTransaction')}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/dashboard/activity/${tx.id}`);
                                }}
                              >
                                <span className="material-symbols-outlined icon-link">open_in_new</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="activity-pagination" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <div className="pagination-info" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                    Showing {(transactions.length === 0) ? 0 : ((currentPage - 1) * PAGE_SIZE + 1)} - {Math.min(currentPage * PAGE_SIZE, transactions.length)} of {transactions.length}
                  </div>
                  <div className="pagination-controls">
                    <button className="btn-link" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} style={{ marginRight: '0.5rem' }}>
                      {t('pagination.prev')}
                    </button>
                    <span style={{ margin: '0 0.5rem' }}>{currentPage} / {totalPages}</span>
                    <button className="btn-link" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} style={{ marginLeft: '0.5rem' }}>
                      {t('pagination.next')}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-3 opacity-50">
                <span className="material-symbols-outlined text-4xl">receipt_long</span>
                <h3 className="text-lg font-medium">
                  {mode === 'wallet' ? t('activity.demoOnly') : t('activity.noTransactions')}
                </h3>
                <p className="text-sm text-gray-400">
                  {mode === 'wallet'
                    ? t('activity.switchToDemo')
                    : t('activity.afterFirstSwap')}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
