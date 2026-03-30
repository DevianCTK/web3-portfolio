import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { COIN_DETAILS } from '../../data/mockData';
import { useToast } from '../../components/ui/Toast';
import type { CoinDetail as CoinDetailType } from '../../data/mockData';
import './CoinDetail.scss';

export default function CoinDetail() {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [timeframe, setTimeframe] = useState('1D');
  const [payAmount, setPayAmount] = useState('0.5');
  const [receiveAmount, setReceiveAmount] = useState('0.0002');
  const [coin, setCoin] = useState<CoinDetailType | null>(null);

  useEffect(() => {
    if (coinId && COIN_DETAILS[coinId]) {
      setCoin(COIN_DETAILS[coinId]);
    } else {
      setCoin(null);
    }
  }, [coinId]);

  if (!coin) {
    return (
      <div className="coin-detail-page text-center">
        <h2 className="text-2xl opacity-50">Coin not found</h2>
        <button className="mt-4 text-primary" onClick={() => navigate('/markets')}>Back to Markets</button>
      </div>
    );
  }

  const handleSwap = () => {
    showToast(`Swapping ${payAmount} USDC for ${receiveAmount} ${coin.symbol}`, 'success');
  };

  const handleAction = (action: string) => {
    showToast(`${action} — coming soon for ${coin.name}`, 'info');
  };

  return (
    <main className="coin-detail-page">
      {/* Header Section: Asset Identity */}
      <header className="detail-header">
        <div className="asset-info">
          <div className="logo-wrapper">
            <div className="inner">
              <img src={coin.icon} alt={coin.name} />
            </div>
          </div>
          <div className="text-area">
            <div className="title-row">
              <h1 className="name">{coin.name}</h1>
              <span className="symbol">{coin.symbol}</span>
            </div>
            <div className="meta-row">
              <span className="rank">Rank {coin.rank}</span>
              <span className="network">
                <span className="material-symbols-outlined">link</span> {coin.type}
              </span>
            </div>
          </div>
        </div>

        <div className="price-info">
          <div className="price-row">
            <span className="price">{coin.price}</span>
            <span className={`change ${coin.isPositive ? '' : 'negative'}`}>
              <span className="material-symbols-outlined">
                {coin.isPositive ? 'arrow_drop_up' : 'arrow_drop_down'}
              </span>
              {coin.change}
            </span>
          </div>
          <p className="mcap-label">Market Cap: {coin.mcap}</p>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="detail-grid">
        {/* Left Column */}
        <div className="main-col">
          {/* Chart Module */}
          <section className="glass-card chart-section">
            <div className="chart-header">
              <div className="timeframe-picker">
                {['1D', '1W', '1M', '1Y', 'ALL'].map(t => (
                  <button 
                    key={t}
                    className={timeframe === t ? 'active' : ''} 
                    onClick={() => setTimeframe(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="chart-actions">
                <button onClick={() => handleAction('Compare')}>
                  <span className="material-symbols-outlined">add_chart</span> Compare
                </button>
                <button onClick={() => handleAction('Fullscreen')}>
                  <span className="material-symbols-outlined">fullscreen</span>
                </button>
              </div>
            </div>

            {/* Chart Visual */}
            <div className="chart-visual">
              <svg preserveAspectRatio="none" viewBox="0 0 1000 300">
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#cdbdff" stopOpacity="0.3"></stop>
                    <stop offset="100%" stopColor="#cdbdff" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d="M0,250 C100,240 150,200 250,180 C350,160 400,220 500,190 C600,160 700,100 800,80 C900,60 950,90 1000,70 L1000,300 L0,300 Z" fill="url(#chartGradient)"></path>
                <path d="M0,250 C100,240 150,200 250,180 C350,160 400,220 500,190 C600,160 700,100 800,80 C900,60 950,90 1000,70" fill="none" stroke="#cdbdff" strokeLinecap="round" strokeWidth="3"></path>
              </svg>
              
              <div className="chart-tooltip">
                <div className="guide-line"></div>
                <div className="tooltip-card">
                  <div className="time">OCT 24, 14:00</div>
                  <div className="value">$2,581.12</div>
                </div>
              </div>
            </div>

            <div className="chart-footer">
              <div className="stat">
                <span className="label">Low (24h)</span>
                <span className="val">$2,310.12</span>
              </div>
              <div className="range-visual">
                <div className="bar-bg">
                  <div className="fill"></div>
                </div>
                <span className="label">Price Range</span>
              </div>
              <div className="stat" style={{ alignItems: 'flex-end' }}>
                <span className="label">High (24h)</span>
                <span className="val">$2,605.44</span>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="glass-card about-section">
            <h3 className="title">About {coin.name}</h3>
            <div className="content">
              <p>
                {coin.name} is a decentralized, open-source blockchain with smart contract functionality. 
                <span className="highlight"> {coin.name} ({coin.symbol})</span> is the native cryptocurrency of the platform. 
                Among cryptocurrencies, {coin.symbol} is second only to Bitcoin in market capitalization.
              </p>
              <p>
                The platform was conceived in 2013 by programmer Vitalik Buterin. Following a crowdsale in 2014, the network went live in 2015. 
                Ethereum allows anyone to deploy permanent and immutable decentralized applications onto it, with which users can interact.
              </p>
            </div>
            <div className="link-grid">
              <a href="#" className="asset-link" onClick={(e) => { e.preventDefault(); handleAction('Website'); }}>
                <span className="material-symbols-outlined">language</span>
                <span>Website</span>
              </a>
              <a href="#" className="asset-link" onClick={(e) => { e.preventDefault(); handleAction('Whitepaper'); }}>
                <span className="material-symbols-outlined">article</span>
                <span>Whitepaper</span>
              </a>
              <a href="#" className="asset-link" onClick={(e) => { e.preventDefault(); handleAction('Explorer'); }}>
                <span className="material-symbols-outlined">description</span>
                <span>Explorer</span>
              </a>
              <a href="#" className="asset-link" onClick={(e) => { e.preventDefault(); handleAction('Community'); }}>
                <span className="material-symbols-outlined">forum</span>
                <span>Community</span>
              </a>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <aside className="sidebar-col">
          {/* Trading Action Card */}
          <div className="trade-card">
            <div className="glow"></div>
            <h4 className="title">Trade {coin.symbol}</h4>
            
            <div className="input-section">
              <div className="input-header">
                <span className="label">You Pay</span>
              </div>
              <div className="input-container">
                <div className="input-row">
                  <input
                    placeholder="0.0"
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                  />
                  <div className="token-display">
                    <span className="token-symbol">USDC</span>
                  </div>
                </div>
                <div className="input-footer">
                  <span className="usd-value">≈ ${payAmount || '0.00'}</span>
                </div>
              </div>
            </div>

            <div className="swap-divider">
              <button 
                className="swap-btn" 
                onClick={() => {
                  const temp = payAmount;
                  setPayAmount(receiveAmount);
                  setReceiveAmount(temp);
                }}
              >
                <span className="material-symbols-outlined">swap_vert</span>
              </button>
            </div>

            <div className="input-section mb-large">
              <div className="input-header">
                <span className="label">You Receive</span>
              </div>
              <div className="input-container">
                <div className="input-row">
                  <input 
                    placeholder="0.0" 
                    type="number" 
                    value={receiveAmount} 
                    onChange={(e) => setReceiveAmount(e.target.value)}
                  />
                  <div className="token-display">
                    <span className="token-symbol">{coin.symbol}</span>
                  </div>
                </div>
                <div className="input-footer">
                  <span className="usd-value">≈ ${receiveAmount ? (Number(receiveAmount) * 2450).toFixed(2) : '0.00'}</span>
                </div>
              </div>
            </div>

            <div className="swap-details">
              <div className="detail-row">
                <span className="label">Exchange Rate</span>
                <span className="value">1 {coin.symbol} = 2,450.12 USDC</span>
              </div>
              <div className="detail-row">
                <span className="label">Price Impact</span>
                <span className="value highlight-secondary">&lt; 0.01%</span>
              </div>
            </div>

            <button className="confirm-btn" onClick={handleSwap}>Swap Now</button>
          </div>

          {/* Market Statistics */}
          <div className="glass-card stats-card">
            <h4 className="title">Market Stats</h4>
            <div className="stat-list">
              <div className="row">
                <span className="label">Market Cap</span>
                <span className="val">{coin.stats.marketCap}</span>
              </div>
              <div className="row">
                <span className="label">Volume (24h)</span>
                <span className="val">{coin.stats.volume}</span>
              </div>
              <div className="row">
                <span className="label">Circulating Supply</span>
                <span className="val">{coin.stats.supply}</span>
              </div>
              <div className="row">
                <span className="label">All Time High</span>
                <span className="val">{coin.stats.ath}</span>
              </div>
              <div className="row">
                <span className="label">All Time Low</span>
                <span className="val">{coin.stats.atl}</span>
              </div>
            </div>
          </div>

          {/* Portfolio Integration */}
          <div className="balance-card">
            <span className="label">Your Balance</span>
            <div className="balance-main">{coin.balance}</div>
            <div className="balance-fiat">{coin.balanceFiat}</div>
            <div className="actions">
              <button onClick={() => handleAction('Stake')}>Stake {coin.symbol}</button>
              <button onClick={() => handleAction('Transfer')}>Transfer</button>
            </div>
          </div>
        </aside>
      </div>

      <div className="bg-blobs">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
      </div>
    </main>
  );
}
