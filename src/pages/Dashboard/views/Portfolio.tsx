import { useWalletStore } from '../../../store/useWalletStore';
import './Portfolio.scss';

export default function Portfolio() {
  const balance = useWalletStore((state) => state.balance);
  const displayUsd = balance ? (Number(balance) * 2450.12).toLocaleString() : "0.00";

  return (
    <div className="portfolio-page">
      {/* Hero: Portfolio Performance */}
      <section className="portfolio-hero">
        <div className="hero-header">
          <div>
            <h2 className="title">Total Balance</h2>
            <div className="balance-row">
              <span className="amount">${displayUsd}</span>
              <span className="change">
                <span className="material-symbols-outlined">trending_up</span>
                +12.4%
              </span>
            </div>
          </div>
          <div className="time-filters">
            <button>1D</button>
            <button className="active">1W</button>
            <button>1M</button>
            <button>1Y</button>
            <button>ALL</button>
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
          <div className="sort-controls">
            <span>Sort by:</span>
            <select>
              <option>Value (High to Low)</option>
              <option>Balance</option>
              <option>Name</option>
            </select>
          </div>
        </div>

        {/* Asset Table */}
        <div className="assets-table">
          <div className="table-header">
            <div className="col-asset">Asset</div>
            <div className="col-balance">Balance</div>
            <div className="col-value">Value (USD)</div>
            <div className="col-change">24h Change</div>
          </div>

          <div className="asset-row">
            <div className="col-asset">
              <div className="asset-icon">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb6S7eJTzRYqtG1tbBOBOdQJm94x3CxsawkQOc1SFZ1v2dEtozvU-6bzpObC9z6sphB3YeL7Ye7kt02WS-zDvNamxXn-DCow13E5LM4MjkUOT_sKhcls7eBp6OzU05Y84h7mGtHXi2Ypbk93Qw6zAp_84tT8xCyWIiqotOG0_4PQgtsJ0ZxrSDe8lmH4m51gR_L92uK7x3cjKUjetZf4NkLHkqR2mwUZk5cMgnxvWtFANmDVfYr5q51uZjkEtPn9Hq-20T3vbKk-A" alt="BTC" />
              </div>
              <div className="asset-info">
                <div className="name">Bitcoin</div>
                <div className="ticker">BTC / $68,421.10</div>
              </div>
            </div>
            <div className="col-balance">1.4285</div>
            <div className="col-value">$97,749.54</div>
            <div className="col-change">
              <div className="change-badge positive">+2.45%</div>
            </div>
          </div>

          <div className="asset-row">
            <div className="col-asset">
              <div className="asset-icon">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBH1dkv2O57w9jnSpIEZOJ0aqQM9RThoJkKqmkdEkJDthS5eW2sCiCenDEiB9emu0xmTyK4N4PudsKycecXluzF4eDzQAw6e9aKibNkggAgB0C7BtZeyFWS0DMUmz8tmiXUPlZSVVcAeADVfd2ogs1wTGu1dojpC6wTxGVgQ_7Qvh4CHhAGiNJtUoJGu9iBTNAeIEfGPiY0467JmU1My96g9Qd7TXQ4pQFcUM52xyy76ado0UY28uCMkgJSokvjGTf1iuO0OhCW7Fw" alt="ETH" />
              </div>
              <div className="asset-info">
                <div className="name">Ethereum</div>
                <div className="ticker">ETH / $3,842.20</div>
              </div>
            </div>
            <div className="col-balance">8.5000</div>
            <div className="col-value">$32,658.70</div>
            <div className="col-change">
              <div className="change-badge negative">-0.82%</div>
            </div>
          </div>

          <div className="asset-row">
            <div className="col-asset">
              <div className="asset-icon">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDfei97DqgcrjfSPZSKydItsRpeq5qT9sp63Cjvd_tuA1aewi1jrnNSx_2oLoeClmdRceKdBppcgaW-rmomKqS2T9kitsWtsVEf4JQOGOGYVmrjq8I2lET8gLcfvHjdDxSDb-N-hqS5JvUUCWjY0yEyzix2PG_0SJB9IdmRhSj3FWzmo630zdDePdcNN3xBs49l7NYDB0TZfkEURU0xuDeZXfdds2f6mFd_F_wAJu3o-HyRfNrFC2b91mxhuv3NqEpsATJAZRGKpc" alt="SOL" />
              </div>
              <div className="asset-info">
                <div className="name">Solana</div>
                <div className="ticker">SOL / $164.55</div>
              </div>
            </div>
            <div className="col-balance">42.1200</div>
            <div className="col-value">$6,930.84</div>
            <div className="col-change">
              <div className="change-badge positive">+12.10%</div>
            </div>
          </div>

          <div className="asset-row">
            <div className="col-asset">
              <div className="asset-icon">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3NLOTolHeOkZQ-thvtSwkSGYol2ShP91qHc0o7_n_LdesMdZ2qwN3xVjOO5Y3HsZvANs64wKr6-h0NjfEmw60sOnPyq8g1bS8wDq5qcngeiB2fXgz3RkFYwk5z0Ngnq0tXCTVZ2BmPL1zuvOhr37Nv64mQtv2uOIKnx0hlrMi6d-hsqiULN8YXNwMug56VycLYFkYlRwX-KpUpuiWZcMuGrEPvwjnImFex-PF7KOysrOQD971JPhaJdXLXkWTmcucG0S9Kpx-s-U" alt="USDC" />
              </div>
              <div className="asset-info">
                <div className="name">USD Coin</div>
                <div className="ticker">USDC / $1.00</div>
              </div>
            </div>
            <div className="col-balance">5,501.34</div>
            <div className="col-value">$5,501.34</div>
            <div className="col-change">
              <div className="change-badge neutral">0.00%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Distribution */}
      <section className="portfolio-network">
        <div className="network-allocation">
          <h4>Network Allocation</h4>
          <div className="allocation-content">
            <div className="chart-ring">
              <svg viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#cdbdff" strokeDasharray="65, 100" strokeWidth="4"></path>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#bdf4ff" strokeDasharray="25, 100" strokeDashoffset="-65" strokeWidth="4"></path>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ffb1c1" strokeDasharray="10, 100" strokeDashoffset="-90" strokeWidth="4"></path>
              </svg>
              <div className="chart-center">
                <span className="label">Mainnet</span>
                <span className="value">65%</span>
              </div>
            </div>
            <div className="allocation-legend">
              <div className="legend-item">
                <div className="info">
                  <div className="dot eth"></div>
                  <span>Ethereum Mainnet</span>
                </div>
                <span className="amount">$92,846.27</span>
              </div>
              <div className="legend-item">
                <div className="info">
                  <div className="dot sol"></div>
                  <span>Solana Ecosystem</span>
                </div>
                <span className="amount">$35,710.10</span>
              </div>
              <div className="legend-item">
                <div className="info">
                  <div className="dot arb"></div>
                  <span>Arbitrum One</span>
                </div>
                <span className="amount">$14,284.05</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="portfolio-health">
          <div>
            <div className="health-header">
              <span className="material-symbols-outlined">auto_awesome</span>
              <h4>Portfolio Health</h4>
              <p>Your sovereign assets are diversified across 3 networks with a focus on high-liquidity tokens.</p>
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
