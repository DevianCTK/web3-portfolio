import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { COIN_DETAILS } from '../../data/mockData';
import { useWallet } from '../../hooks/useWallet';
import { useWalletStore } from '../../store/useWalletStore';
import { useToast } from '../../components/ui/Toast';
import { usePrices } from '../../hooks/usePrices';
import { formatUsd, formatMarketCap } from '../../services/api/priceService';
import { generateChartData } from '../../services/chartData';
import type { CoinDetail as CoinDetailType } from '../../data/mockData';
import './CoinDetail.scss';

export default function CoinDetail() {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isConnected } = useWallet();
  const mode = useWalletStore((state) => state.mode);
  const walletBalance = useWalletStore((state) => state.balance);
  const setConnectModalOpen = useWalletStore((state) => state.setConnectModalOpen);
  const { data: prices } = usePrices();
  const [timeframe, setTimeframe] = useState('1D');
  const [payAmount, setPayAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [coin, setCoin] = useState<CoinDetailType | null>(null);

  useEffect(() => {
    if (coinId && COIN_DETAILS[coinId]) {
      setCoin(COIN_DETAILS[coinId]);
    } else {
      setCoin(null);
    }
  }, [coinId]);

  // Derive live price data
  const livePrice = coinId ? prices?.[coinId] : null;
  const priceNum = livePrice?.usd ?? (coin ? parseFloat(coin.price.replace(/[$,]/g, '')) : 0);
  const priceLabel = formatUsd(priceNum);
  const change24h = livePrice?.usd_24h_change;
  const changeLabel = change24h != null
    ? (change24h >= 0 ? '+' : '') + change24h.toFixed(2) + '%'
    : coin?.change ?? '--';
  const changePositive = change24h != null ? change24h >= 0 : (coin?.isPositive ?? true);
  const mcapLabel = livePrice?.usd_market_cap ? formatMarketCap(livePrice.usd_market_cap) : coin?.mcap ?? '--';

  // Derive chart low/high from live price
  const coinSeed = coinId ? coinId.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : 42;
  const chartData = useMemo(
    () => generateChartData(priceNum, timeframe, coinSeed),
    [priceNum, timeframe, coinSeed],
  );
  const chartLow = formatUsd(chartData.low);
  const chartHigh = formatUsd(chartData.high);

  // Mode-aware balance
  const balanceInfo = useMemo(() => {
    if (mode === 'demo') {
      return { main: coin?.balance ?? '--', fiat: coin?.balanceFiat ?? '' };
    }
    if (mode === 'wallet') {
      // Only show real balance for ETH since that's all MetaMask provides
      if (coinId === 'ethereum') {
        const ethBal = parseFloat(walletBalance || '0');
        return {
          main: ethBal.toFixed(4) + ' ETH',
          fiat: formatUsd(ethBal * priceNum),
        };
      }
      return { main: 'No balance data', fiat: '' };
    }
    return { main: 'Connect wallet to view', fiat: '' };
  }, [mode, coin, coinId, walletBalance, priceNum]);

  useEffect(() => {
    if (!payAmount || isNaN(Number(payAmount))) {
      setReceiveAmount('');
      return;
    }
    if (priceNum > 0) {
      const calculated = (Number(payAmount) / priceNum).toFixed(6);
      setReceiveAmount(calculated);
    }
  }, [payAmount, priceNum]);

  if (!coin) {
    return (
      <div className="coin-detail-page text-center">
        <h2 className="text-2xl opacity-50">Coin not found</h2>
        <button className="mt-4 text-primary" onClick={() => navigate('/markets')}>Back to Markets</button>
      </div>
    );
  }

  const handleSwap = () => {
    if (!isConnected) {
      setConnectModalOpen(true);
      return;
    }
    if (!payAmount || Number(payAmount) <= 0) return;
    showToast(`Swapping ${payAmount} USDC for ${receiveAmount} ${coin.symbol}`, 'success');
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
            <span className="price">{priceLabel}</span>
            <span className={`change ${changePositive ? '' : 'negative'}`}>
              <span className="material-symbols-outlined">
                {changePositive ? 'arrow_drop_up' : 'arrow_drop_down'}
              </span>
              {changeLabel}
            </span>
          </div>
          <p className="mcap-label">Market Cap: {mcapLabel}</p>
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
                <path d={chartData.areaPath} fill="url(#chartGradient)"></path>
                <path d={chartData.path} fill="none" stroke="#cdbdff" strokeLinecap="round" strokeWidth="3"></path>
              </svg>

              <div className="chart-tooltip">
                <div className="guide-line"></div>
                <div className="tooltip-card">
                  <div className="time">Now</div>
                  <div className="value">{priceLabel}</div>
                </div>
              </div>
            </div>

            <div className="chart-footer">
              <div className="stat">
                <span className="label">Low (24h)</span>
                <span className="val">{chartLow}</span>
              </div>
              <div className="range-visual">
                <div className="bar-bg">
                  <div className="fill"></div>
                </div>
                <span className="label">Price Range</span>
              </div>
              <div className="stat" style={{ alignItems: 'flex-end' }}>
                <span className="label">High (24h)</span>
                <span className="val">{chartHigh}</span>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="glass-card about-section">
            <h3 className="title">About {coin.name}</h3>
            <div className="content">
              <p>
                {coin.description}
              </p>
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
              <div className="swap-btn">
                <span className="material-symbols-outlined">swap_vert</span>
              </div>
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
                    readOnly
                  />
                  <div className="token-display">
                    <span className="token-symbol">{coin.symbol}</span>
                  </div>
                </div>
                <div className="input-footer">
                  <span className="usd-value">≈ ${receiveAmount ? (Number(receiveAmount) * priceNum).toFixed(2) : '0.00'}</span>
                </div>
              </div>
            </div>

            <div className="swap-details">
              <div className="detail-row">
                <span className="label">Exchange Rate</span>
                <span className="value">1 {coin.symbol} = {priceNum.toLocaleString()} USDC</span>
              </div>
              <div className="detail-row">
                <span className="label">Price Impact</span>
                <span className="value highlight-secondary">&lt; 0.01%</span>
              </div>
            </div>

            <button className="confirm-btn" onClick={handleSwap}>
              {!isConnected ? 'Connect Wallet to Swap' : 'Swap Now'}
            </button>
          </div>

          {/* Market Statistics */}
          <div className="glass-card stats-card">
            <h4 className="title">Market Stats</h4>
            <div className="stat-list">
              <div className="row">
                <span className="label">Market Cap</span>
                <span className="val">{mcapLabel}</span>
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
            <div className="balance-main" style={mode === 'disconnected' ? { fontSize: '0.875rem', opacity: 0.5 } : undefined}>
              {balanceInfo.main}
            </div>
            {balanceInfo.fiat && <div className="balance-fiat">{balanceInfo.fiat}</div>}
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
