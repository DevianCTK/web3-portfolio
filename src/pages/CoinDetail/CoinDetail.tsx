import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CoinDetail.scss';

const COIN_DATA: Record<string, any> = {
  ethereum: {
    name: 'Ethereum',
    symbol: 'ETH',
    price: '$2,451.28',
    change: '4.2%',
    isPositive: true,
    mcap: '$294.5B',
    rank: '#2',
    type: 'ERC-20',
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_LsLf7WLVacGFoMwuM5E_ljG1PfwrC2XUGNLbjyAtBXrrVWRAWi7vgvaDtuC2fxyRMqAdXdtnWM5mYA1wPTDUt6dnU3oK996qBr0VZKH4Mu7jU6bv24xb2GzpownIuHDXaIrJvNI_C7iGxiBNb5M1o4YZMu-yMoUYcRQzXE5zAebIVEdI48bc99GWGHzTBdHwQEpGvyLGpHlnbqVLpT6AczBuID52JZ22odizfq4HhQCm2iWyfA4qDe5nYGV1Cso8tFGsbKupOLQ',
    balance: '12.45 ETH',
    balanceFiat: '≈ $30,518.43',
    stats: {
      marketCap: '$294,510,284,192',
      volume: '$15,204,912,855',
      supply: '120,240,112 ETH',
      ath: '$4,891.70',
      atl: '$0.42'
    }
  },
  solana: {
    name: 'Solana',
    symbol: 'SOL',
    price: '$104.92',
    change: '1.45%',
    isPositive: false,
    mcap: '$45.2B',
    rank: '#5',
    type: 'SOL',
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDd5FHfA4Y8dSf-wF9752-3aKWgd9EHPFLDUFj738qe92gLaUq88grVuyb_y9JqQJhSeiuOdxraLEHlLTYsB5R7i9yZBzs8znG811-0grnilv4Y3hvmlb80kDlRzY6jlWxt7JoT70Obw5AzI7u8kFlphYH9-7DU18hIqwdMSNrKjAUwqyzOgA_BWUhfs9PzfBdwK0lDpKKRHM5nNM5OKZix2rQPmcE2x9sJnQDrZO-Jki7O5ibPraLIJmthPs3j7c1tlG_rUFoDrpc',
    balance: '150.00 SOL',
    balanceFiat: '≈ $15,738.00',
    stats: {
      marketCap: '$45,210,000,000',
      volume: '$2,104,000,000',
      supply: '440,000,000 SOL',
      ath: '$260.06',
      atl: '$0.50'
    }
  },
  arbitrum: {
    name: 'Arbitrum',
    symbol: 'ARB',
    price: '$1.88',
    change: '12.8%',
    isPositive: true,
    mcap: '$2.4B',
    rank: '#42',
    type: 'L2',
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSe587TFd77-Y6YccfqtQKEc3VLOv99vjxymaybPZfPUZUfZdpBir8Sj2IDOboAXczYG2JdUM9YQ7tdKr4YJj2g0IqqFKpQ-OSByj9YltruSlZYCRcrFsndaET0v1ME_rm4gxUWCeMhnpiKpfAALpvAm5AHKzYg-PoapRexuh2gwd5bMAm4EYjfECZ3DL7AJdqotZKe0Z44EEBC6hs7j0hK-5rvdyWwaLvk4WhZ-eMiZFy5fzEGaylZBH0_3xvOacdumby35p7fc4',
    balance: '500.00 ARB',
    balanceFiat: '≈ $940.00',
    stats: {
      marketCap: '$2,400,000,000',
      volume: '$450,000,000',
      supply: '1,275,000,000 ARB',
      ath: '$2.40',
      atl: '$0.75'
    }
  },
  chainlink: {
    name: 'Chainlink',
    symbol: 'LINK',
    price: '$18.42',
    change: '0.92%',
    isPositive: false,
    mcap: '$10.8B',
    rank: '#14',
    type: 'ERC-20',
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK5bEEPqpyUpKdk2yUHBEQBelWXwSzAevKPxoOnNMNiPJv3ZOkFERrIwXuAWuqJ7c81CRshRTxdHDRGB4iyEDjIT2LH3YfSg98tRrfeIutIl-6FR4uc9CaL10lAYVM0ta5SPD37kBINhdDmSa4y3aoNnwlSRt3rrVdhcAXc--i9Qy6HNtXP8Io9R_iix898SvK94oa2uea9TXSb8vw6-IcQPVzYSn7Al8D6ZlTMeiAgUD0oPXcmkI2_zG4b_8c7kTvQ6wYaaYXTIo',
    balance: '25.00 LINK',
    balanceFiat: '≈ $460.50',
    stats: {
      marketCap: '$10,800,000,000',
      volume: '$580,000,000',
      supply: '587,000,000 LINK',
      ath: '$52.88',
      atl: '$0.12'
    }
  },
  polygon: {
    name: 'Polygon',
    symbol: 'MATIC',
    price: '$0.812',
    change: '3.14%',
    isPositive: true,
    mcap: '$7.9B',
    rank: '#18',
    type: 'MATIC',
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdSj2BsXYVZgNWP2BdAjdJwQxTzGk1B3XTju-izVFfXJu0Hfw2HvnZYt2k_Wx6qNADoyidX6iVBIorjofFxncRMJu-U0iECFqsMSI7-OlGFxtIusu9DHlzZutiV8iKsBx7CYijXB_IOdaQvmJN4c3D9yDzflvZ3j1aV4rEB6vx1Ph1NqwWcNPy2Z2fJSidwANEC5iUr7ebJa6mldWxOiKJAS3CEX6nlaM_ClaIhnslF27DGZH8OGGThCP6yfUPQHrMzgdYOG6uWIk',
    balance: '1200.00 MATIC',
    balanceFiat: '≈ $974.40',
    stats: {
      marketCap: '$7,900,000,000',
      volume: '$320,000,000',
      supply: '9,700,000,000 MATIC',
      ath: '$2.92',
      atl: '$0.003'
    }
  }
};

export default function CoinDetail() {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('1D');
  const [payAmount, setPayAmount] = useState('0.5');
  const [receiveAmount, setReceiveAmount] = useState('0.0002');
  const [coin, setCoin] = useState<any>(null);

  useEffect(() => {
    if (coinId && COIN_DATA[coinId]) {
      setCoin(COIN_DATA[coinId]);
    } else {
        // Fallback or redirect if coin not found
        // setCoin(COIN_DATA['ethereum']); 
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
    alert(`Swapping ${payAmount} USDC for ${receiveAmount} ${coin.symbol}`);
  };

  const handleAction = (action: string) => {
    alert(`${action} mechanism triggered for ${coin.name}`);
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
