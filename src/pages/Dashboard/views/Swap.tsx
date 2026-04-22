import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWalletStore } from '../../../store/useWalletStore';
import { useDemoBalances } from '../../../hooks/useDemoBalances';
import { useDemoTransactions } from '../../../hooks/useDemoTransactions';
import { TOKENS } from '../../../data/mockData';
import '../../Swap/Swap.scss';

export default function Swap() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mode = useWalletStore((state) => state.mode);

  const { balances, updateBalance } = useDemoBalances();
  const { addTransaction } = useDemoTransactions();
  const ALLOWED_SWAP_SYMBOLS = ['ETH', 'BTC', 'SOL', 'ARB', 'LINK', 'DOGE', 'USDC'];
  const location = useLocation();
  type LocationState = { receive?: string };
  const navReceive = (location.state as LocationState)?.receive as string | undefined;

  // All hooks must be declared before any early return
  const [paySymbol, setPaySymbol] = useState<string>('ETH');
  const [receiveSymbol, setReceiveSymbol] = useState<string>('USDC');
  const [payAmount, setPayAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [editingField, setEditingField] = useState<'pay' | 'receive' | null>('pay');
  const [isSwapping, setIsSwapping] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [tokenPickerTarget, setTokenPickerTarget] = useState<'pay' | 'receive' | null>(null);
  const [tokenSearch, setTokenSearch] = useState('');
  // Initialize symbols from navigation state (Markets -> Trade)
  useEffect(() => {
    // Resolve a requested receive token passed via navigation state (Markets -> Trade)
    const s = navReceive;
    if (!s) return;

    const normalize = (v: string) => v.toUpperCase();

    // Prefer direct match in balances (handles demo-created tokens)
    const direct = balances[s] || balances[normalize(s)];
    if (direct) {
      if (receiveSymbol !== direct.symbol) {
        // schedule state updates to avoid synchronous setState within effect
        setTimeout(() => {
          setReceiveSymbol(direct.symbol);
          setPaySymbol('USDC');
        }, 0);
      }
      return;
    }

    // Fall back to TOKENS metadata (match by symbol/id/name, case-insensitive)
    const resolved = Object.values(TOKENS).find(t =>
      t.symbol === s ||
      t.symbol === normalize(s) ||
      t.id === s ||
      t.id === s.toLowerCase() ||
      t.name === s
    );
    if (resolved && receiveSymbol !== resolved.symbol) {
      setTimeout(() => {
        setReceiveSymbol(resolved.symbol);
        setPaySymbol('USDC');
      }, 0);
    }
    // include location.key so navigation to the same path with different state updates the UI
  }, [location.key, navReceive, balances, receiveSymbol]);

  const buildFallbackToken = (sym: string) => {
    const meta = Object.values(TOKENS).find(t => t.symbol === sym || t.id === sym.toLowerCase());
    if (meta) {
      return {
        symbol: meta.symbol,
        name: meta.name,
        price: meta.price,
        balance: 0,
        icon: meta.icon,
      };
    }
    // last resort: pick first balance
    return Object.values(balances)[0] || { symbol: 'USDC', name: 'USD Coin', price: 1, balance: 0, icon: '' };
  };

  const payToken = balances[paySymbol] || buildFallbackToken(paySymbol);
  const receiveToken = balances[receiveSymbol] || buildFallbackToken(receiveSymbol);

  // Calculate amounts bidirectionally depending on which field is being edited
  useEffect(() => {
    const p = Number(payAmount);
    const rate = (payToken.price || 0) / (receiveToken.price || 1);
    if (editingField === 'pay') {
      if (!payAmount || isNaN(p) || p <= 0) setTimeout(() => setReceiveAmount(''), 0);
      else setTimeout(() => setReceiveAmount((p * rate).toFixed(6)), 0);
    }
  }, [payAmount, payToken?.price, receiveToken?.price, editingField]);

  useEffect(() => {
    const r = Number(receiveAmount);
    const rate = (payToken.price || 0) / (receiveToken.price || 1);
    if (editingField === 'receive') {
      if (!receiveAmount || isNaN(r) || r <= 0) setTimeout(() => setPayAmount(''), 0);
      else setTimeout(() => setPayAmount((r / rate).toFixed(6)), 0);
    }
  }, [receiveAmount, payToken?.price, receiveToken?.price, editingField]);

  // Disconnected guard
  if (mode === 'disconnected') {
    return (
      <main className="swap-page">
        <section className="swap-container">
          <div className="swap-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', opacity: 0.4 }}>swap_horiz</span>
            <h2 style={{ marginTop: '1rem', fontSize: '1.25rem' }}>{t('swap.connectPrompt')}</h2>
            <p style={{ opacity: 0.5, marginTop: '0.5rem', fontSize: '0.875rem' }}>
              {t('swap.connectDesc')}
            </p>
            <button
              className="confirm-btn"
              style={{ marginTop: '1.5rem' }}
              onClick={() => useWalletStore.getState().setConnectModalOpen(true)}
            >
              {t('navbar.connectWallet')}
            </button>
          </div>
        </section>
      </main>
    );
  }

  // Wallet mode guard â€” swap simulator is demo only
  if (mode === 'wallet') {
    return (
      <main className="swap-page">
        <section className="swap-container">
          <div className="swap-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', opacity: 0.4 }}>swap_horiz</span>
            <h2 style={{ marginTop: '1rem', fontSize: '1.25rem' }}>{t('swap.simulatorTitle')}</h2>
            <p style={{ opacity: 0.5, marginTop: '0.5rem', fontSize: '0.875rem' }}>
              {t('swap.simulatorDesc')}
            </p>
            <button
              className="confirm-btn"
              style={{ marginTop: '1.5rem' }}
              onClick={() => navigate('/dashboard')}
            >
              {t('swap.backToDashboard')}
            </button>
          </div>
        </section>
      </main>
    );
  }

  const handleSwapTokens = () => {
    setPaySymbol((p) => {
      const newPay = receiveSymbol;
      setReceiveSymbol(p);
      setPayAmount('');
      setReceiveAmount('');
      setEditingField('pay');
      return newPay;
    });

  };

  const handleMax = () => {
    setPayAmount(payToken.balance.toFixed(6));
    setEditingField('pay');
  };

  const handleConfirmSwap = () => {
    const pay = Number(payAmount);
    if (!pay || pay <= 0 || pay > payToken.balance) return;

    setIsSwapping(true);

    setTimeout(() => {
      const recv = Number(receiveAmount);
      updateBalance(payToken.symbol, -pay);
      updateBalance(receiveSymbol, recv);

      const now = dayjs();
      addTransaction({
        date: now.format('MMM D, YYYY'),
        time: now.format('h:mm:ss A'),
        action: 'swap',
        asset: payToken.symbol + ' -> ' + receiveSymbol,
        amount: recv.toFixed(4) + ' ' + receiveSymbol,
        amountSign: '',
        fiat: '~$' + (recv * receiveToken.price).toFixed(2),
        status: 'completed',
        icon: 'sync_alt',
        iconColor: 'swap',
      });

      setIsSwapping(false);
      setShowSuccessModal(true);
      setPayAmount('');
    }, 1500);
  };

  const exchangeRate = (payToken.price / receiveToken.price).toFixed(2);
  const payUsdValue = payAmount ? (Number(payAmount) * payToken.price).toFixed(2) : '0.00';
  const receiveUsdValue = receiveAmount ? (Number(receiveAmount) * receiveToken.price).toFixed(2) : '0.00';

  // Simple network cost estimator (USD)
  const networkCost = (() => {
    // base costs (demo): ETH transactions cost more than layer2/stable swaps
    const base = payToken?.symbol === 'ETH' ? 1.45 : 0.25;
    return (Number(base)).toFixed(2);
  })();

  const isInsufficientBalance = Number(payAmount) > (payToken?.balance ?? 0);
  const isButtonDisabled = isSwapping || !payAmount || Number(payAmount) <= 0 || isInsufficientBalance;



  return (
    <>
      <main className="swap-page">
        <section className="swap-container">
          <div className="swap-card">
            <div className="card-header">
              <h1>{t('swap.title')}</h1>
              <div className="actions">
                <button className="icon-btn" onClick={() => {
                  // reset amounts and tokens to sensible defaults
                  setPayAmount('');
                  setReceiveAmount('');
                  setPaySymbol('ETH');
                  setReceiveSymbol('USDC');
                  setEditingField('pay');
                  setTokenPickerTarget(null);
                }}>
                  <span className="material-symbols-outlined">refresh</span>
                </button>
              </div>
            </div>

            <div className="input-section">
              <div className="input-header">
                <span className="label">{t('coin.youPay')}</span>
                <span className="balance">{t('common.balance')}: {(payToken?.balance ?? 0).toFixed(2)} {payToken.symbol}</span>
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
                  <button
                    className="token-selector"
                    onClick={() => {
                      // open modal-style token palette
                      setTokenPickerTarget('pay');
                      setTokenSearch('');
                    }}
                    aria-haspopup="listbox"
                    aria-expanded={tokenPickerTarget === 'pay'}
                  >
                    <div className="token-icon">
                      <img alt={payToken.symbol} src={payToken.icon} />
                    </div>
                    <span className="token-symbol">{payToken.symbol}</span>
                    <span className="material-symbols-outlined">expand_more</span>
                  </button>
                </div>
                <div className="input-footer">
                  <span className="usd-value">~ ${payUsdValue}</span>
                  <button className="max-btn" onClick={handleMax}>{t('coin.max')}</button>
                </div>
              </div>
            </div>

            <div className="swap-divider">
              <button className="swap-btn" onClick={handleSwapTokens}>
                <span className="material-symbols-outlined">swap_vert</span>
              </button>
            </div>

            <div className="input-section mb-large">
              <div className="input-header">
                <span className="label">{t('coin.youReceive')}</span>
                <span className="balance">{t('common.balance')}: {(receiveToken?.balance ?? 0).toFixed(2)} {receiveToken.symbol}</span>
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
                  <button
                    className="token-selector"
                    onClick={() => {
                      setTokenPickerTarget('receive');
                      setTokenSearch('');
                    }}
                    aria-haspopup="listbox"
                    aria-expanded={tokenPickerTarget === 'receive'}
                  >
                    <div className="token-icon">
                      <img alt={receiveToken.symbol} src={receiveToken.icon} />
                    </div>
                    <span className="token-symbol">{receiveToken.symbol}</span>
                    <span className="material-symbols-outlined">expand_more</span>
                  </button>
                </div>
                <div className="input-footer">
                  <span className="usd-value">~ ${receiveUsdValue}</span>
                </div>
              </div>
            </div>

            <div className="swap-details">
              <div className="detail-row">
                <span className="label">{t('coin.exchangeRate')}</span>
                <span className="value">1 {payToken.symbol} = {exchangeRate} {receiveToken.symbol}</span>
              </div>
              <div className="detail-row">
                <span className="label">{t('coin.priceImpact')}</span>
                <span className="value highlight-secondary">&lt; 0.01%</span>
              </div>
              <div className="detail-row">
                <div className="label-with-icon">
                  <span className="label">{t('swap.maxSlippage')}</span>
                  <span className="material-symbols-outlined icon">info</span>
                </div>
                <span className="value">0.5%</span>
              </div>
              <div className="detail-row footer-row">
                <div className="label-with-icon warning">
                  <span className="material-symbols-outlined icon">local_gas_station</span>
                  <span className="label">{t('swap.networkCost')}</span>
                </div>
                <span className="value highlight-bold">{isSwapping ? 'Calculating...' : '$' + networkCost}</span>
              </div>
            </div>

            <button
              className={`confirm-btn ${isSwapping ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isButtonDisabled}
              onClick={handleConfirmSwap}
              style={{
                opacity: isButtonDisabled ? 0.5 : 1,
                cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
              }}
            >
              {isSwapping ? t('swap.swapping') : (isInsufficientBalance && payAmount ? t('swap.insufficientBalance', { symbol: payToken.symbol }) : t('swap.swap'))}
            </button>
          </div>
        </section>
      </main>

      {/* Token Picker Palette Modal */}
      {tokenPickerTarget && (
        <div className="token-picker-overlay">
          <div className="picker-backdrop" onClick={() => setTokenPickerTarget(null)} />
          <div className="picker-content">
            <div className="picker-header">
              <h3>{t('swap.selectToken')}</h3>
              <button className="close-btn" onClick={() => setTokenPickerTarget(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="picker-search">
              <span className="material-symbols-outlined">search</span>
              <input value={tokenSearch} onChange={(e) => setTokenSearch(e.target.value)} placeholder={t('swap.searchPlaceholder')} />
            </div>

            <div className="picker-top">
              {['ETH', 'USDC', 'BTC', 'SOL', 'ARB', 'LINK', 'DOGE'].map((s) => {
                const t = balances[s] || Object.values(TOKENS).find(x => x.symbol === s);
                return t ? (
                  <button key={s} className="pill" onClick={() => {
                    if (tokenPickerTarget === 'pay') setPaySymbol(s);
                    else setReceiveSymbol(s);
                    setTokenPickerTarget(null);
                  }}>{t.symbol}</button>
                ) : null;
              })}
            </div>

            <div className="picker-list">
              {Array.from(new Set([
                ...Object.keys(balances),
                ...Object.values(TOKENS).map(t => t.symbol)
              ]))
                .filter(s => ALLOWED_SWAP_SYMBOLS.includes(s))
                .map(sym => {
                  const tokenFromBalances = balances[sym];
                  const meta = tokenFromBalances || Object.values(TOKENS).find(x => x.symbol === sym);
                  if (!meta) return null;
                  const q = tokenSearch.trim().toLowerCase();
                  if (q && !(meta.name.toLowerCase().includes(q) || meta.symbol.toLowerCase().includes(q))) return null;
                  const displayBal = (typeof tokenFromBalances?.balance === 'number')
                    ? (tokenFromBalances.balance >= 1 ? tokenFromBalances.balance.toFixed(4) : tokenFromBalances.balance.toFixed(6))
                    : (meta && typeof meta.balance === 'number' ? (meta.balance >= 1 ? meta.balance.toFixed(4) : meta.balance.toFixed(6)) : '--');
                  return (
                    <button key={sym} className="picker-row" onClick={() => {
                      if (tokenPickerTarget === 'pay') setPaySymbol(sym);
                      else setReceiveSymbol(sym);
                      setTokenPickerTarget(null);
                    }}>
                      <div className="row-left">
                        <img src={meta.icon} alt={meta.symbol} />
                        <div className="meta">
                          <div className="name">{meta.name}</div>
                          <div className="symbol">{meta.symbol}</div>
                        </div>
                      </div>
                      <div className="row-right">{displayBal}</div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}
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
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
