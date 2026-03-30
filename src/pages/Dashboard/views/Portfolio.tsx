import { useState } from 'react';
import { useWalletStore } from '../../../store/useWalletStore';
import { useAppData } from '../../../hooks/useAppData';
import './Portfolio.scss';

export default function Portfolio() {
  const address = useWalletStore((state) => state.address);
  const [activeTimeFilter, setActiveTimeFilter] = useState('1W');
  const { mode, balanceUsd, totalChange, totalChangePositive, portfolioAssets, networkAllocation } = useAppData();

  if (!address) {
    return (
      <div className="portfolio-page">
        <div className="flex flex-col items-center justify-center py-24 gap-4 opacity-60">
          <span className="material-symbols-outlined text-5xl">account_balance_wallet</span>
          <h2 className="text-xl font-semibold">Connect your wallet to view portfolio</h2>
          <p className="text-sm text-gray-400">Your assets and performance will appear here once connected.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      {/* Hero: Portfolio Performance */}
      <section className="portfolio-hero">
        <div className="hero-header">
          <div>
            <h2 className="title">Total Balance</h2>
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
          <div className="time-filters">
            {['1D', '1W', '1M', '1Y', 'ALL'].map(t => (
              <button key={t} className={activeTimeFilter === t ? 'active' : ''} onClick={() => setActiveTimeFilter(t)}>{t}</button>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-bg"></div>
          {/* SVG Area Chart Custom Implementation */}
          <svg className="chart-svg" viewBox="0 0 1000 300">
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#cdbdff" stopOpacity="0.5"></stop>
                <stop offset="95%" stopColor="#cdbdff" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <path
              d="M0,250 C100,240 150,280 250,200 C350,120 400,180 500,140 C600,100 650,50 750,80 C850,110 900,20 1000,40 V300 H0 Z"
              fill="url(#chartGradient)"
            />
            <path
              d="M0,250 C100,240 150,280 250,200 C350,120 400,180 500,140 C600,100 650,50 750,80 C850,110 900,20 1000,40"
              fill="none"
              stroke="#cdbdff"
              strokeLinecap="round"
              strokeWidth="3"
            />
            {/* Chart Points */}
            <circle cx="250" cy="200" fill="#cdbdff" r="4"></circle>
            <circle cx="500" cy="140" fill="#cdbdff" r="4"></circle>
            <circle cx="750" cy="80" fill="#cdbdff" r="4"></circle>
            <circle cx="1000" cy="40" fill="#cdbdff" r="6" style={{ animation: "pulse 2s infinite" }}></circle>
          </svg>

          {/* Chart Labels */}
          <div className="chart-labels">
            <span>MAY 01</span>
            <span>MAY 08</span>
            <span>MAY 15</span>
            <span>MAY 22</span>
            <span>MAY 29</span>
          </div>
        </div>
      </section>

      {/* Detailed Asset List Section */}
      <section className="portfolio-assets">
        <div className="assets-header">
          <h3>Your Assets</h3>
          {portfolioAssets.length > 0 && (
            <div className="sort-controls">
              <span>Sort by:</span>
              <select>
                <option>Value (High to Low)</option>
                <option>Balance</option>
                <option>Name</option>
              </select>
            </div>
          )}
        </div>

        {/* Asset Table */}
        <div className="assets-table">
          {portfolioAssets.length > 0 ? (
            <>
              <div className="table-header">
                <div className="col-asset">Asset</div>
                <div className="col-balance">Balance</div>
                <div className="col-value">Value (USD)</div>
                <div className="col-change">24h Change</div>
              </div>

              {portfolioAssets.map((asset) => (
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
              <p className="text-sm">{mode === 'wallet' ? 'No assets found in your wallet' : 'No assets to display'}</p>
            </div>
          )}
        </div>
      </section>

      {/* Ecosystem Distribution */}
      <section className="portfolio-network">
        <div className="network-allocation">
          <h4>Network Allocation</h4>
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
                <span className="label">Mainnet</span>
                <span className="value">{networkAllocation.length > 0 ? `${networkAllocation[0].percent}%` : '0%'}</span>
              </div>
            </div>
            <div className="allocation-legend">
              {networkAllocation.length > 0 ? (
                networkAllocation.map((net) => (
                  <div className="legend-item" key={net.label}>
                    <div className="info">
                      <div className={`dot ${net.dotClass}`}></div>
                      <span>{net.label}</span>
                    </div>
                    <span className="amount">{net.amount}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-4 opacity-50">
                  <p className="text-sm">No network data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="portfolio-health">
          <div>
            <div className="health-header">
              <span className="material-symbols-outlined">auto_awesome</span>
              <h4>Portfolio Health</h4>
              <p>Your sovereign assets are diversified across {networkAllocation.length} network{networkAllocation.length !== 1 ? 's' : ''} with a focus on high-liquidity tokens.</p>
            </div>
          </div>
          <div className="health-score">
            <div className="score-info">
              <span>Risk Score</span>
              <span className="value">Low Volatility</span>
            </div>
            <div className="score-bar">
              <div className="fill"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
