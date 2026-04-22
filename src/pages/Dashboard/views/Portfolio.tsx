import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppData } from '../../../hooks/useAppData';
import { useWalletStore } from '../../../store/useWalletStore';
import { generateChartData } from '../../../services/chartData';
import './Portfolio.scss';

export default function Portfolio() {
  const { t } = useTranslation();
  const [activeTimeFilter, setActiveTimeFilter] = useState('1W');
  const [sortOption, setSortOption] = useState('value');
  const { mode, balanceUsd, totalChange, totalChangePositive, portfolioAssets, networkAllocation } = useAppData();
  const setConnectModalOpen = useWalletStore((state) => state.setConnectModalOpen);

  const balanceNum = useMemo(() => parseFloat(balanceUsd.replace(/[$,]/g, '')) || 100000, [balanceUsd]);
  const chartData = useMemo(() => generateChartData(balanceNum, activeTimeFilter, 0xdeadbeef), [balanceNum, activeTimeFilter]);
  const showChart = false; // Chart can be toggled on when ready, but hiding for now since it's static data and not the focus of this view
  // Sorting portfolio assets
  const sortedAssets = useMemo(() => {
    const items = [...portfolioAssets];
    if (sortOption === 'value') {
      return items.sort((a, b) => parseFloat(b.value.replace(/[$,]/g, '')) - parseFloat(a.value.replace(/[$,]/g, '')));
    }
    if (sortOption === 'balance') {
      return items.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));
    }
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [portfolioAssets, sortOption]);

  // Portfolio health/risk score based on top allocation concentration
  const healthScore = useMemo(() => {
    const topPct = networkAllocation[0]?.percent ?? 0;
    const score = Math.max(5, Math.min(95, 100 - topPct));
    const labelKey = score >= 70 ? 'health.low' : score >= 40 ? 'health.medium' : 'health.high';
    const label = labelKey;
    return { score, label };
  }, [networkAllocation]);

  if (mode === 'disconnected') {
    return (
      <div className="portfolio-page">
        <section className="portfolio-hero">
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', opacity: 0.4 }}>account_balance_wallet</span>
            <h2 style={{ marginTop: '1rem', fontSize: '1.25rem' }}>{t('portfolio.connectPrompt')}</h2>
            <p style={{ opacity: 0.5, marginTop: '0.5rem', fontSize: '0.875rem' }}>
              {t('portfolio.connectPrompt') /* short prompt repeated; keep concise */}
            </p>
            <button
              className="btn-primary"
              style={{ marginTop: '1.5rem' }}
              onClick={() => setConnectModalOpen(true)}
            >
              {t('portfolio.connectWallet')}
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      {/* Hero: Portfolio Performance */}
      <section className="portfolio-hero">
        <div className="hero-header">
          <div>
            <h2 className="title">{t('portfolio.totalBalance')}</h2>
            <div className="balance-row">
              <span className="amount">{balanceUsd}</span>
              {totalChange !== '--' && (
                <span className="change">
                  <span className="material-symbols-outlined">
                    {totalChangePositive ? 'trending_up' : 'trending_down'}
                  </span>
                  {totalChange}
                </span>
              )}
            </div>
          </div>
          {showChart && <div className="time-filters">
            {['1D', '1W', '1M', '1Y', 'ALL'].map(t => (
              <button key={t} className={activeTimeFilter === t ? 'active' : ''} onClick={() => setActiveTimeFilter(t)}>{t}</button>
            ))}
          </div>}
        </div>

        {showChart && <div className="chart-card">
          <div className="chart-bg"></div>
          {/* SVG Area Chart - driven by activeTimeFilter */}
          <svg className="chart-svg" viewBox="0 0 1000 300">
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#cdbdff" stopOpacity="0.5"></stop>
                <stop offset="95%" stopColor="#cdbdff" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <path
              d={chartData.areaPath}
              fill="url(#chartGradient)"
            />
            <path
              d={chartData.path}
              fill="none"
              stroke="#cdbdff"
              strokeLinecap="round"
              strokeWidth="3"
            />
          </svg>

          {/* Chart Labels */}
          <div className="chart-labels">
            {[0, Math.floor(chartData.points.length * 0.25), Math.floor(chartData.points.length * 0.5), Math.floor(chartData.points.length * 0.75), chartData.points.length - 1]
              .map((idx) => chartData.points[idx]?.label ?? '')
              .map((lbl, i) => (
                <span key={i}>{lbl}</span>
              ))}
          </div>
        </div>}
      </section>

      {/* Detailed Asset List Section */}
      <section className="portfolio-assets">
        <div className="assets-header">
          <h3>{t('portfolio.yourAssets')}</h3>
          {portfolioAssets.length > 0 && (
            <div className="sort-controls">
              <span>{t('portfolio.sortBy')}</span>
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="value">{t('portfolio.valueUSD')} (High to Low)</option>
                <option value="balance">{t('common.balance')}</option>
                <option value="name">{t('common.name')}</option>
              </select>
            </div>
          )}
        </div>

        {/* Asset Table */}
        <div className="assets-table">
          {portfolioAssets.length > 0 ? (
            <>
              <div className="table-header">
                <div className="col-asset">{t('common.name')}</div>
                <div className="col-balance">{t('common.balance')}</div>
                <div className="col-value">{t('portfolio.valueUSD')}</div>
                <div className="col-change">{t('portfolio.change24h')}</div>
              </div>

              {sortedAssets.map((asset) => (
                <div className="asset-row" key={asset.id}>
                  <div className="col-asset">
                    <div className="asset-icon">
                      <img src={asset.icon} alt={asset.ticker} />
                    </div>
                    <div className="asset-info">
                      <div className="name">{asset.name}</div>
                      <div className="ticker">{asset.ticker} / {asset.priceLabel}</div>
                    </div>
                  </div>
                  <div className="col-balance">{asset.balance}</div>
                  <div className="col-value">{asset.value}</div>
                  <div className="col-change">
                    <div className={`change-badge ${asset.change === '--' ? 'neutral' : asset.isPositive ? 'positive' : 'negative'}`}>
                      {asset.change}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3 opacity-50">
              <span className="material-symbols-outlined text-4xl">account_balance_wallet</span>
              <p className="text-sm">{mode === 'wallet' ? t('portfolio.noAssetsWallet') : t('portfolio.noAssets')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Ecosystem Distribution */}
      <section className="portfolio-network">
        <div className="network-allocation">
          <h4>{t('portfolio.networkAllocation')}</h4>
          <div className="allocation-content">
            <div className="chart-ring">
              <svg viewBox="0 0 36 36">
                {networkAllocation.map((net, i) => {
                  const offset = networkAllocation.slice(0, i).reduce((sum, n) => sum + n.percent, 0);
                  const colors = ['#cdbdff', '#bdf4ff', '#ffb1c1'];
                  return (
                    <path
                      key={net.label}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={colors[i] || '#888'}
                      strokeDasharray={`${net.percent}, ${100 - net.percent}`}
                      strokeDashoffset={`${-offset}`}
                      strokeWidth="4"
                    />
                  );
                })}
              </svg>
              <div className="chart-center">
                <span className="label">{t('portfolio.mainnet')}</span>
                <span className="value">{networkAllocation.length > 0 ? `${networkAllocation[0].percent}%` : '0%'}</span>
              </div>
            </div>
            <div className="allocation-legend">
              {networkAllocation.length > 0 ? (
                networkAllocation.map((net) => {
                  const assetIcon = portfolioAssets.find((a) => a.id === net.id)?.icon;


                  const ICON_SIZE = 24;

                  const dotStyle: React.CSSProperties = {
                    background: 'black',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 6px 14px rgba(0,0,0,0.45)',
                    width: `${ICON_SIZE}px`,
                    height: `${ICON_SIZE}px`,
                    minWidth: `${ICON_SIZE}px`,
                    minHeight: `${ICON_SIZE}px`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '9999px',
                  };

                  return (
                    <div className="legend-item" key={net.label}>
                      <div className="info">
                        {/* show mini icon if available and valid, otherwise render colored dot */}
                        {assetIcon ? (
                          <img
                            src={assetIcon}
                            alt={net.label}
                            style={{
                              width: ICON_SIZE,
                              height: ICON_SIZE,
                              borderRadius: 9999,
                              boxShadow: '0 6px 14px rgba(0,0,0,0.45)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <div className={`dot ${net.dotClass}`} style={dotStyle}></div>
                        )}
                        <span style={{ marginLeft: 8 }}>{net.label}</span>
                      </div>
                      <span className="amount">{net.amount}</span>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center py-4 opacity-50">
                  <p className="text-sm">{t('portfolio.noNetworkData') || 'No network data available'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="portfolio-health">
          <div>
            <div className="health-header">
              <span className="material-symbols-outlined">auto_awesome</span>
              <h4>{t('portfolio.portfolioHealth')}</h4>
              <p>{t('portfolio.diversifiedText', { count: networkAllocation.length, plural: networkAllocation.length !== 1 ? 's' : '' })}</p>
            </div>
          </div>
          <div className="health-score">
            <div className="score-info">
              <span>{t('portfolio.riskScore')}</span>
              <span className="value">{t(healthScore.label)} • {healthScore.score}%</span>
            </div>
            <div className="score-bar">
              <div className="fill" style={{ width: `${healthScore.score}%` }}></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
