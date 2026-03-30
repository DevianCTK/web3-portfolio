import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../../../store/useWalletStore';
import { SWAP_TOKENS } from '../../../data/mockData';
import '../../Swap/Swap.scss';

export default function Swap() {
  const navigate = useNavigate();
  const address = useWalletStore((state) => state.address);
  const setConnectModalOpen = useWalletStore((state) => state.setConnectModalOpen);

  const [payToken, setPayToken] = useState(SWAP_TOKENS.ETH);
  const [receiveToken, setReceiveToken] = useState(SWAP_TOKENS.USDC);
  const [payAmount, setPayAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');

  const [isSwapping, setIsSwapping] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (!payAmount || isNaN(Number(payAmount))) {
      setReceiveAmount('');
      return;
    }
    const rate = payToken.price / receiveToken.price;
    const calculated = (Number(payAmount) * rate).toFixed(4);
    setReceiveAmount(calculated);
  }, [payAmount, payToken, receiveToken]);

  const handleSwapTokens = () => {
    setPayToken(receiveToken);
    setReceiveToken(payToken);
    setPayAmount('');
    setReceiveAmount('');
  };

  const handleMax = () => {
    setPayAmount(payToken.balance.toString());
  };

  const handleConfirmSwap = () => {
    if (!address) {
      setConnectModalOpen(true);
      return;
    }

    if (!payAmount || Number(payAmount) <= 0) return;

    setIsSwapping(true);

    setTimeout(() => {
      setIsSwapping(false);
      setShowSuccessModal(true);
      setPayAmount('');
      setReceiveAmount('');
    }, 2000); // Simulated network delay
  };

  const exchangeRate = (payToken.price / receiveToken.price).toFixed(2);
  const payUsdValue = payAmount ? (Number(payAmount) * payToken.price).toFixed(2) : '0.00';
  const receiveUsdValue = receiveAmount ? (Number(receiveAmount) * receiveToken.price).toFixed(2) : '0.00';

  const isInsufficientBalance = Number(payAmount) > payToken.balance;
  const isButtonDisabled = isSwapping || !payAmount || Number(payAmount) <= 0 || (!!address && isInsufficientBalance);

  let buttonText = 'Confirm Swap';
  if (!address) buttonText = 'Connect Wallet to Swap';
  else if (isSwapping) buttonText = 'Swapping...';
  else if (isInsufficientBalance) buttonText = `Insufficient ${payToken.symbol} balance`;

  return (
    <>
      <main className="swap-page">
        <section className="swap-container">
          <div className="swap-card">
            <div className="card-header">
              <h1>Swap Tokens</h1>
              <div className="actions">
                <button className="icon-btn" onClick={() => { setPayAmount(''); setReceiveAmount(''); }}>
                  <span className="material-symbols-outlined">refresh</span>
                </button>
                <button className="icon-btn">
                  <span className="material-symbols-outlined">tune</span>
                </button>
              </div>
            </div>

            <div className="input-section">
              <div className="input-header">
                <span className="label">You Pay</span>
                <span className="balance">Balance: {payToken.balance.toFixed(2)} {payToken.symbol}</span>
              </div>
              <div className="input-container">
                <div className="input-row">
                  <input
                    placeholder="0.0"
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                  />
                  <button className="token-selector">
                    <div className="token-icon">
                      <img alt={payToken.symbol} src={payToken.icon} />
                    </div>
                    <span className="token-symbol">{payToken.symbol}</span>
                    <span className="material-symbols-outlined">expand_more</span>
                  </button>
                </div>
                <div className="input-footer">
                  <span className="usd-value">≈ ${payUsdValue}</span>
                  <button className="max-btn" onClick={handleMax}>Max</button>
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
                <span className="label">You Receive</span>
                <span className="balance">Balance: {receiveToken.balance.toFixed(2)} {receiveToken.symbol}</span>
              </div>
              <div className="input-container">
                <div className="input-row">
                  <input placeholder="0.0" readOnly type="number" value={receiveAmount} />
                  <button className="token-selector">
                    <div className="token-icon">
                      <img alt={receiveToken.symbol} src={receiveToken.icon} />
                    </div>
                    <span className="token-symbol">{receiveToken.symbol}</span>
                    <span className="material-symbols-outlined">expand_more</span>
                  </button>
                </div>
                <div className="input-footer">
                  <span className="usd-value">≈ ${receiveUsdValue}</span>
                </div>
              </div>
            </div>

            <div className="swap-details">
              <div className="detail-row">
                <span className="label">Exchange Rate</span>
                <span className="value">1 {payToken.symbol} = {exchangeRate} {receiveToken.symbol}</span>
              </div>
              <div className="detail-row">
                <span className="label">Price Impact</span>
                <span className="value highlight-secondary">&lt; 0.01%</span>
              </div>
              <div className="detail-row">
                <div className="label-with-icon">
                  <span className="label">Max Slippage</span>
                  <span className="material-symbols-outlined icon">info</span>
                </div>
                <div className="value-with-action">
                  <span className="value">0.5%</span>
                  <button className="action-btn">Edit</button>
                </div>
              </div>
              <div className="detail-row footer-row">
                <div className="label-with-icon warning">
                  <span className="material-symbols-outlined icon">local_gas_station</span>
                  <span className="label">Network Cost</span>
                </div>
                <span className="value highlight-bold">{isSwapping ? 'Calculating...' : '$1.45'}</span>
              </div>
            </div>

            <button
              className={`confirm-btn ${isSwapping ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isButtonDisabled && !!address}
              onClick={handleConfirmSwap}
              style={{
                opacity: isButtonDisabled && !!address ? 0.5 : 1,
                cursor: isButtonDisabled && !!address ? 'not-allowed' : 'pointer'
              }}
            >
              {buttonText}
            </button>
          </div>
        </section>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="swap-modal-overlay">
          <div className="modal-backdrop" onClick={() => setShowSuccessModal(false)}></div>
          <div className="modal-content">
            <div className="success-icon">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <h2>Transaction Successful</h2>
            <p>Your swap has been processed and confirmed on the blockchain.</p>

            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/dashboard');
                }}
              >
                Return to Dashboard
              </button>
              <button
                className="btn-secondary"
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
