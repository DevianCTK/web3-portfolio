import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { COIN_DETAILS, TOKENS } from '../../data/mockData';
import { useWalletStore } from '../../store/useWalletStore';
import { usePrices } from '../../hooks/usePrices';
import { useDemoBalances } from '../../hooks/useDemoBalances';
import type { DemoTokenBalance } from '../../hooks/useDemoBalances';
import { useDemoTransactions } from '../../hooks/useDemoTransactions';
import { formatUsd, formatMarketCap } from '../../services/api/priceService';
import { generateChartData } from '../../services/chartData';
import PriceChart from '../../components/PriceChart/PriceChart';
import type { DataPoint, RangeKey } from '../../components/PriceChart/PriceChart';
import dayjs from 'dayjs';
import type { CoinDetail as CoinDetailType } from '../../data/mockData';
import './CoinDetail.scss';

export default function CoinDetail() {
  const { t } = useTranslation();
  const { coinId } = useParams();
  const navigate = useNavigate();
  // no toast in coin detail swaps
  const mode = useWalletStore((state) => state.mode);
  const walletBalance = useWalletStore((state) => state.balance);
  const setConnectModalOpen = useWalletStore((state) => state.setConnectModalOpen);
  const { data: prices, dataUpdatedAt } = usePrices();
  const { updateBalance, balances } = useDemoBalances();
  const { addTransaction } = useDemoTransactions();
  const [timeframe, setTimeframe] = useState('1D');
  const [payAmount, setPayAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [coin, setCoin] = useState<CoinDetailType | null>(null);
  const [payIsUsdc, setPayIsUsdc] = useState(true);
  const [editingField, setEditingField] = useState<'pay' | 'receive' | null>('pay');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (coinId && COIN_DETAILS[coinId]) {
      // schedule to avoid synchronous setState in effect
      setTimeout(() => setCoin(COIN_DETAILS[coinId]), 0);
    } else {
      setTimeout(() => setCoin(null), 0);
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

  // Map generated chart points to PriceChart DataPoint (with timestamps)
  const series: DataPoint[] = useMemo(() => {
    const pts = chartData.points || [];
    // estimate duration for timeframe
    const now = dayjs().valueOf();
    let duration = 24 * 60 * 60 * 1000; // default 1D
    if (timeframe === '1W') duration = 7 * 24 * 60 * 60 * 1000;
    if (timeframe === '1M') duration = 30 * 24 * 60 * 60 * 1000;
    if (timeframe === '1Y' || timeframe === 'ALL') duration = 365 * 24 * 60 * 60 * 1000;

    return pts.map(p => ({
      time: Math.max(0, now - Math.round((1 - p.x) * duration)),
      price: p.y,
    }));
  }, [chartData.points, timeframe]);

  // Mode-aware balance: prefer live demo balances for the coin when in demo mode
  const balanceInfo = useMemo(() => {
    if (mode === 'demo') {
      const sym = coin?.symbol;
      const live = sym ? balances[sym] : undefined;
      if (live) {
        return { main: live.balance.toFixed(6) + ' ' + sym, fiat: '' };
      }

      const raw = coin?.balance;
      const parsed = Number(String(raw).replace(/[^0-9.-]+/g, ''));
      if (!isNaN(parsed)) return { main: parsed.toFixed(6) + ' ' + (coin?.symbol ?? ''), fiat: coin?.balanceFiat ?? '' };
      return { main: raw ?? '--', fiat: coin?.balanceFiat ?? '' };
    }
    if (mode === 'wallet') {
      if (coinId === 'ethereum') {
        const ethBal = parseFloat(walletBalance || '0');
        return { main: ethBal.toFixed(4) + ' ETH', fiat: formatUsd(ethBal * priceNum) };
      }
      return { main: 'No balance data', fiat: '' };
    }
    return { main: t('coin.connectWalletToView'), fiat: '' };
  }, [mode, coin, coinId, walletBalance, priceNum, balances, t]);

  // Bidirectional inputs: when editing payAmount compute receive, and vice versa
  useEffect(() => {
    if (editingField !== 'pay') return;
    if (!payAmount || isNaN(Number(payAmount))) {
      setTimeout(() => setReceiveAmount(''), 0);
      return;
    }
    if (priceNum > 0) {
      const p = Number(payAmount);
      if (payIsUsdc) setTimeout(() => setReceiveAmount((p / priceNum).toFixed(6)), 0);
      else setTimeout(() => setReceiveAmount((p * priceNum).toFixed(2)), 0);
    }
  }, [payAmount, priceNum, payIsUsdc, editingField]);

  useEffect(() => {
    if (editingField !== 'receive') return;
    if (!receiveAmount || isNaN(Number(receiveAmount))) {
      setTimeout(() => setPayAmount(''), 0);
      return;
    }
    if (priceNum > 0) {
      const r = Number(receiveAmount);
      if (payIsUsdc) setTimeout(() => setPayAmount((r * priceNum).toFixed(2)), 0);
      else setTimeout(() => setPayAmount((r / priceNum).toFixed(6)), 0);
    }
  }, [receiveAmount, priceNum, payIsUsdc, editingField]);

  if (!coin) {
    return (
      <div className="coin-detail-page text-center">
        <h2 className="text-2xl opacity-50">{t('coin.notFound')}</h2>
        <button className="mt-4 text-primary" onClick={() => navigate('/markets')}>{t('coin.backToMarkets')}</button>
      </div>
    );
  }

  const handleSwap = () => {
    if (mode === 'disconnected') {
      setConnectModalOpen(true);
      return;
    }
    if (mode === 'wallet') return; // disabled in wallet mode
    if (!payAmount || Number(payAmount) <= 0) return;
    const pay = Number(payAmount);
    const recv = Number(receiveAmount);

    // Update demo balances depending on direction
    if (payIsUsdc) {
      // paying USDC -> receive coin
      updateBalance('USDC', -pay);
      if (coin?.symbol) {
        updateBalance(coin.symbol, recv);
      }
    } else {
      // paying coin -> receive USDC
      if (coin?.symbol) {
        updateBalance(coin.symbol, -pay);
      }
      updateBalance('USDC', recv);
    }

    // Record the transaction with a meaningful asset label depending on direction
    const now = dayjs();
    addTransaction({
      date: now.format('MMM D, YYYY'),
      time: now.format('h:mm:ss A'),
      action: 'swap',
      asset: payIsUsdc ? `USDC → ${coin?.symbol}` : `${coin?.symbol} → USDC`,
      amount: payIsUsdc ? `${recv.toFixed(6)} ${coin?.symbol}` : `${pay.toFixed(6)} ${coin?.symbol}`,
      amountSign: '',
      fiat: `≈ $${(payIsUsdc ? pay : recv).toFixed(2)}`,
      status: 'completed',
      icon: 'sync_alt',
      iconColor: 'swap',
    });

    // Do not show top-right toast in CoinDetail (use modal on success)

    setPayAmount('');
    setReceiveAmount('');
    setShowSuccessModal(true);
  };

  const buildFallbackToken = (sym: string): DemoTokenBalance => {
    const meta = Object.values(TOKENS).find(t => t.symbol === sym || t.id === sym.toLowerCase());
    if (meta) return { symbol: meta.symbol, name: meta.name, price: meta.price, balance: 0, icon: meta.icon } as DemoTokenBalance;
    return { symbol: sym, name: sym, price: 0, balance: 0, icon: '' } as DemoTokenBalance;
  };

  const payToken = payIsUsdc ? (balances['USDC'] || buildFallbackToken('USDC')) : (balances[coin.symbol] || buildFallbackToken(coin.symbol));
  const receiveToken = payIsUsdc ? (balances[coin.symbol] || buildFallbackToken(coin.symbol)) : (balances['USDC'] || buildFallbackToken('USDC'));

  const handleSwapTokens = () => {
    const oldPay = payAmount;
    const oldRecv = receiveAmount;
    setPayIsUsdc((s) => !s);
    setPayAmount(oldRecv);
    setReceiveAmount(oldPay);
    setEditingField('pay');
  };

  const handleMax = () => {
    setPayAmount((payToken?.balance ?? 0).toFixed(6));
    setEditingField('pay');
  };

  const swapButtonDisabled = mode === 'wallet' || !payAmount || Number(payAmount) <= 0;
  const swapButtonText = mode === 'disconnected'
    ? t('coin.swap.connectToSwap')
    : mode === 'wallet'
      ? t('coin.swap.demoOnly')
      : t('coin.swap.now');

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
            <span className={`change ${changePositive ? 'positive' : 'negative'}`}>
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
              <div className="last-updated">
                {dataUpdatedAt ? `Prices updated: ${dayjs(dataUpdatedAt).format('h:mm:ss A M/D/YYYY')}` : ''}
              </div>
            </div>

            {/* Chart Visual replaced by Recharts component */}
            <div className="chart-visual">
              <PriceChart
                data={series}
                range={((): RangeKey => {
                  if (timeframe === '1W') return '7D';
                  if (timeframe === 'ALL') return '1Y';
                  return timeframe as RangeKey;
                })()}
                onRangeChange={(r) => {
                  // map PriceChart ranges back to our timeframe values
                  if (r === '7D') setTimeframe('1W');
                  else if (r === '1Y') setTimeframe('1Y');
                  else setTimeframe(r);
                }}
              />
            </div>

            <div className="chart-footer">
              <div className="stat">
                <span className="label">{t('coin.low24')}</span>
                <span className="val">{chartLow}</span>
              </div>
              <div className="range-visual">
                <div className="bar-bg">
                  <div className="fill"></div>
                </div>
                <span className="label">{t('coin.priceRange')}</span>
              </div>
              <div className="stat" style={{ alignItems: 'flex-end' }}>
                <span className="label">{t('coin.high24')}</span>
                <span className="val">{chartHigh}</span>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="glass-card about-section">
            <h3 className="title">{t('coin.aboutTitle', { name: coin.name })}</h3>
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
          <div className="trade-card swap-card">
            <div className="glow"></div>
            <h4 className="title">{t('coin.trade', { symbol: coin.symbol })}</h4>

            <div className="input-section">
              <div className="input-header">
                <span className="label">{t('coin.youPay')}</span>
                <span className="balance">{t('common.balance')}: {(payToken?.balance ?? 0).toFixed(4)} {payToken.symbol}</span>
              </div>
              <div className="input-container">
                <div className="input-row">
                  <input
                    placeholder="0.0"
                    type="number"
                    value={payAmount}
                    onFocus={() => setEditingField('pay')}
                    onChange={(e) => { setEditingField('pay'); setPayAmount(e.target.value); }}
                  />
                  <div className="token-display">
                    <div className="token-icon-small">
                      <img alt={payToken.symbol} src={payToken.icon} />
                    </div>
                    <span className="token-symbol">{payToken.symbol}</span>
                  </div>
                </div>
                <div className="input-footer">
                  <span className="usd-value">~ ${payIsUsdc ? (payAmount || '0.00') : (payAmount ? (Number(payAmount) * priceNum).toFixed(2) : '0.00')}</span>
                  <button className="max-btn" onClick={handleMax}>{t('coin.max')}</button>
                </div>
              </div>
            </div>

            <div className="swap-divider">
              <button className="swap-btn" onClick={handleSwapTokens} aria-label="Swap direction">
                <span className="material-symbols-outlined">swap_vert</span>
              </button>
            </div>

            <div className="input-section mb-large">
              <div className="input-header">
                <span className="label">{t('coin.youReceive')}</span>
                <span className="balance">{t('common.balance')}: {(receiveToken?.balance ?? 0).toFixed(4)} {receiveToken.symbol}</span>
              </div>
              <div className="input-container">
                <div className="input-row">
                  <input
                    placeholder="0.0"
                    type="number"
                    value={receiveAmount}
                    onFocus={() => setEditingField('receive')}
                    onChange={(e) => { setEditingField('receive'); setReceiveAmount(e.target.value); }}
                  />
                  <div className="token-display">
                    <div className="token-icon-small">
                      <img alt={receiveToken.symbol} src={receiveToken.icon} />
                    </div>
                    <span className="token-symbol">{receiveToken.symbol}</span>
                  </div>
                </div>
                <div className="input-footer">
                  <span className="usd-value">~ ${payIsUsdc ? (receiveAmount ? (Number(receiveAmount) * priceNum).toFixed(2) : '0.00') : (receiveAmount || '0.00')}</span>
                </div>
              </div>
            </div>

            <div className="swap-details">
              <div className="detail-row">
                <span className="label">{t('coin.exchangeRate')}</span>
                <span className="value">1 {coin.symbol} = {priceNum.toLocaleString()} USDC</span>
              </div>
              <div className="detail-row">
                <span className="label">{t('coin.priceImpact')}</span>
                <span className="value highlight-secondary">&lt; 0.01%</span>
              </div>
            </div>

            <button
              className="confirm-btn"
              onClick={handleSwap}
              disabled={swapButtonDisabled}
              style={{
                opacity: swapButtonDisabled ? 0.5 : 1,
                cursor: swapButtonDisabled ? 'not-allowed' : 'pointer',
              }}
            >
              {swapButtonText}
            </button>
          </div>

          {/* Market Statistics */}
          <div className="glass-card stats-card">
            <h4 className="title">{t('coin.marketStats')}</h4>
            <div className="stat-list">
              <div className="row">
                <span className="label">{t('coin.marketCap')}</span>
                <span className="val">{mcapLabel}</span>
              </div>
              <div className="row">
                <span className="label">{t('coin.volume24')}</span>
                <span className="val">{coin.stats.volume}</span>
              </div>
              <div className="row">
                <span className="label">{t('coin.circulatingSupply')}</span>
                <span className="val">{coin.stats.supply}</span>
              </div>
              <div className="row">
                <span className="label">{t('coin.allTimeHigh')}</span>
                <span className="val">{coin.stats.ath}</span>
              </div>
              <div className="row">
                <span className="label">{t('coin.allTimeLow')}</span>
                <span className="val">{coin.stats.atl}</span>
              </div>
            </div>
          </div>

          {/* Portfolio Integration */}
          <div className="balance-card">
            <span className="label">{t('coin.yourBalance')}</span>
            <div className="balance-main" style={mode === 'disconnected' ? { fontSize: '0.875rem', opacity: 0.5 } : undefined}>
              {balanceInfo.main}
            </div>
            {balanceInfo.fiat && <div className="balance-fiat">{balanceInfo.fiat}</div>}
          </div>
        </aside>
      </div>

      {/* Token picker removed from CoinDetail - swaps are coin <-> USDC only here */}

      <div className="bg-blobs">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
      </div>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="swap-modal-overlay">
          <div className="modal-backdrop" onClick={() => setShowSuccessModal(false)}></div>
          <div className="modal-content">
            <div className="success-icon">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <h2>{t('coin.transactionSuccessTitle')}</h2>
            <p>{t('coin.transactionSuccessBody')}</p>

            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/dashboard');
                }}
              >
                {t('coin.returnToDashboard')}
              </button>
              <button
                className="btn-secondary"
                onClick={() => setShowSuccessModal(false)}
              >
                {t('common.close') || 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
