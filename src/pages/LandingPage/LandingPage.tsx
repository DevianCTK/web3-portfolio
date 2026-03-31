import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import { useWalletStore } from '../../store/useWalletStore';
import { usePrices } from '../../hooks/usePrices';
import './LandingPage.scss';

export default function LandingPage() {
  const { isConnected } = useWallet();
  const setConnectModalOpen = useWalletStore((state) => state.setConnectModalOpen);
  const navigate = useNavigate();
  const { data: prices } = usePrices();

  return (
    <>
      <main className="landing-page">
        {/* Hero Section */}
        <section className="hero-section">
          {/* Background Decorations */}
          <div className="bg-blob-primary"></div>
          <div className="bg-blob-secondary"></div>

          <div className="hero-container">
            <div className="hero-content">
              <div className="status-badge">
                <span className="dot"></span>
                Live on Mainnet
              </div>
              <h1 className="hero-title">
                The Future of <br />
                <span className="gradient-text">Finance is Here.</span>
              </h1>
              <p className="hero-description">
                Experience the Protocol Interface for navigating the decentralized frontier. Swap, earn, and govern with the speed of a high-performance terminal and the security of a digital vault.
              </p>
              <div className="hero-actions">
                {!isConnected ? (
                  <button onClick={() => setConnectModalOpen(true)} className="btn-primary">
                    Connect Wallet
                  </button>
                ) : (
                  <button onClick={() => navigate('/dashboard')} className="btn-primary">
                    Go to Dashboard
                  </button>
                )}
                <button className="btn-outline" onClick={() => navigate('/markets')}>
                  <span className="label">Explore Markets</span>
                  <span className="material-symbols-outlined icon">arrow_forward</span>
                </button>
              </div>
            </div>

            <div className="hero-visual">
              {/* LandingPage Mockup/Visual */}
              <div className="landingPage-mockup">
                <div className="mockup-header">
                  <div className="dots">
                    <div className="dot dot-red"></div>
                    <div className="dot dot-yellow"></div>
                    <div className="dot dot-green"></div>
                  </div>
                  <span className="version">Protocol Terminal v1.0.4</span>
                </div>
                <div className="mockup-content">
                  <div className="portfolio-card">
                    <div className="card-header">
                      <span className="label">Total Portfolio</span>
                      <span className="change">+12.4%</span>
                    </div>
                    <div className="value">$142,593.12</div>
                  </div>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <span className="label">Active Swaps</span>
                      <span className="value">24</span>
                    </div>
                    <div className="stat-card">
                      <span className="label">Gas Saving</span>
                      <span className="value value-secondary">42%</span>
                    </div>
                  </div>
                  <div className="chart-mockup">
                    <div className="bar" style={{ height: '20%', opacity: 0.2 }}></div>
                    <div className="bar" style={{ height: '40%', opacity: 0.4 }}></div>
                    <div className="bar" style={{ height: '35%', opacity: 0.3 }}></div>
                    <div className="bar" style={{ height: '60%', opacity: 0.6 }}></div>
                    <div className="bar" style={{ height: '85%', opacity: 0.8 }}></div>
                    <div className="bar" style={{ height: '70%', opacity: 0.7 }}></div>
                    <div className="bar" style={{ height: '95%', opacity: 1 }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="features-section">
          <div className="features-container">
            <div className="features-header">
              <div>
                <h2 className="title">Engineered for <br />High-Frequency Intent.</h2>
                <p className="description">Our architecture prioritizes low-latency execution and cryptographic transparency at every layer of the stack.</p>
              </div>
              <div className="metrics">
                <div className="metric-card">
                  <span className="value secondary">1.2s</span>
                  <span className="label">Finality</span>
                </div>
                <div className="metric-card">
                  <span className="value tertiary">$4.2B+</span>
                  <span className="label">Volume</span>
                </div>
              </div>
            </div>

            <div className="bento-grid">
              {/* Large Feature: Speed */}
              <div className="feature-large">
                <div className="content">
                  <span className="material-symbols-outlined icon">bolt</span>
                  <h3>Blazing Fast Swaps</h3>
                  <p>Utilizing a proprietary off-chain order matching engine with on-chain settlement for instantaneous liquidity access.</p>
                </div>
                <div className="visual">
                  <img alt="abstract light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNviLT-q-hg3VpIfP0Iv2ssCyoxSmwbVL1TfWxaUI98YinKcLw811Q-w2wRbS-OVBsaTBUZ_sdBF21qedDi4UR2kW0Ki-t16ioTRdPDmIJTBnvpEsJhFwAT-Vx59W3oJqmNQ56y1OkZUZ0jhYMVkGNopPiNNIfm9PAJvtx4HWlWnsH5DbGN_9RtfWbo6qmmcgevQe4xk_JOKIYSd6-BLSmIMBBvP9N1Uvc_C213ndOZL_aIjTRbsxXxY5sux4ahtBM__-cTKAVwo4" />
                </div>
              </div>

              {/* Security */}
              <div className="feature-security">
                <div className="icon-bg">
                  <span className="material-symbols-outlined">shield</span>
                </div>
                <div className="content">
                  <h3>Unrivaled Security</h3>
                  <p>Multi-sig custody and rigorous smart contract audits by Tier-1 cybersecurity firms ensure your assets remain secure.</p>
                </div>
              </div>

              {/* Yield */}
              <div className="feature-yield">
                <span className="material-symbols-outlined icon">trending_up</span>
                <h3>Yield Optimization</h3>
                <p>Automated compounding and cross-protocol arbitrage to maximize your capital efficiency without manual intervention.</p>
              </div>

              {/* Market Data Small */}
              <div className="feature-market">
                <div className="ticker-list">
                  <div className="ticker-item">
                    <div className="pair">
                      <div className="icon-wrapper secondary">
                        <span className="material-symbols-outlined">currency_bitcoin</span>
                      </div>
                      <span className="name">BTC/USDT</span>
                    </div>
                    <span className="price secondary">{prices?.bitcoin ? '$' + prices.bitcoin.usd.toLocaleString() : '--'}</span>
                  </div>
                  <div className="ticker-item">
                    <div className="pair">
                      <div className="icon-wrapper primary">
                        <span className="material-symbols-outlined">token</span>
                      </div>
                      <span className="name">ETH/USDT</span>
                    </div>
                    <span className="price primary">{prices?.ethereum ? '$' + prices.ethereum.usd.toLocaleString() : '--'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="bg-gradient"></div>
          <div className="cta-container">
            <h2 className="title">Ready to navigate the <br />New Internet?</h2>
            <p className="description">Connect your wallet today and claim your Protocol Interface identity in the Ethereal Edge ecosystem.</p>
            <div className="actions">
              {!isConnected ? (
                <button onClick={() => setConnectModalOpen(true)} className="btn-primary">
                  Connect Wallet
                </button>
              ) : (
                <button onClick={() => navigate('/dashboard')} className="btn-primary">
                  Go to Dashboard
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

    </>
  );
}
