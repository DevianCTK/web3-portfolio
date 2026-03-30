import { useEffect } from 'react';
import { useWalletStore } from '../../store/useWalletStore';
import { useWallet } from '../../hooks/useWallet';
import './ConnectWalletModal.scss';

export function ConnectWalletModal() {
  const isConnectModalOpen = useWalletStore((state) => state.isConnectModalOpen);
  const setConnectModalOpen = useWalletStore((state) => state.setConnectModalOpen);
  const { connectReal, connectDemo, isConnected, isConnecting, hasMetaMask } = useWallet();

  useEffect(() => {
    if (isConnected) {
      setConnectModalOpen(false);
    }
  }, [isConnected, setConnectModalOpen]);

  if (!isConnectModalOpen) return null;

  return (
    <div className="connect-modal-overlay">
      <div
        className="modal-backdrop"
        onClick={() => setConnectModalOpen(false)}
      ></div>
      <div className="modal-container">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Connect Identity</h2>
            <button
              className="close-btn"
              onClick={() => setConnectModalOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {hasMetaMask ? (
            <>
              <div className="wallet-list">
                <button
                  onClick={connectReal}
                  className="wallet-item"
                >
                  <div className="wallet-info">
                    <div className="wallet-icon">
                      <img alt="MetaMask" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_qVqpDlzzIwBBYiYPgGrbgEQIc5GwWAcz9kmragoMsKLt1uYFihRYC3YM6HqrRf7SAQ96YVqZUHSBxKpZP69PQOfz_NGNTnRLthmXzZ2qFeiisb7oz6pwpz-u13Oob6o4LCdL2Mi8whmIP3xXbZbh7cleTfYFaA1SYB4uONO8D7SZn8Gz92m4RJaxbla511gqtimnDR_9c_7SdmDVVGo668mpHDKqhWcMHjXA3kSEOMcSVzO4TBIa4ZW6QFne55s6L1QJWvIFbcw" />
                    </div>
                    <div className="wallet-text">
                      <div className="name">MetaMask</div>
                      <div className="description">Browser Extension</div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined chevron">chevron_right</span>
                </button>

                <button
                  onClick={connectDemo}
                  className="wallet-item"
                >
                  <div className="wallet-info">
                    <div className="wallet-icon demo-icon">
                      <span className="material-symbols-outlined">science</span>
                    </div>
                    <div className="wallet-text">
                      <div className="name">Demo Mode</div>
                      <div className="description">Explore with mock data</div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined chevron">chevron_right</span>
                </button>
              </div>

              {isConnecting && (
                <div className="connecting-status">
                  <div className="spinner-wrapper">
                    <div className="spinner-track"></div>
                    <div className="spinner-head"></div>
                  </div>
                  <div className="status-text">
                    <div className="title">Connecting to MetaMask...</div>
                    <div className="subtitle">Awaiting Signature</div>
                  </div>
                </div>
              )}

              <div className="modal-footer">
                <p>
                  By connecting, you agree to the Sovereign Protocol Terms.
                </p>
              </div>
            </>
          ) : (
            <div className="no-wallet-container">
              <span className="material-symbols-outlined no-wallet-icon">warning</span>
              <div className="no-wallet-text">
                <h3>No wallet detected</h3>
                <p>MetaMask is required for full functionality.</p>
              </div>

              <div className="no-wallet-actions">
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-install"
                >
                  Install MetaMask
                </a>
                <button
                  onClick={connectDemo}
                  className="btn-demo"
                >
                  Continue with Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
