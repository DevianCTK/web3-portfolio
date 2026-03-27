import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Markets.scss';

const INITIAL_TOKENS = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    ticker: 'ETH',
    price: '$2,482.15',
    change: '4.21%',
    isPositive: true,
    mcap: '$298.4B',
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpyoja6cLvIu2ftlThaeoTDoLjAP9ASGeNjS2eZkfxR6ax-E-2M9vHqwo6i0hrFPsced1LeX2KcQewnhBKOodHRQqlEGMZ3B7-_285vNNHzrHdr3741HyNoskfRSTBHnTcQHcr9K0t7A0bow__npFFIzeNEo2ncY1mjGUEuXMHMX5k2iI1Sp90RR0LjofNDe-QDEmCfYhVYkulHFV7GwKBSox14aaiVXS7PuxTpWIHf8mpIXQp8axp9FlkdUwHIRI0A3fepXcYoro'
  },
  {
    id: 'solana',
    name: 'Solana',
    ticker: 'SOL',
    price: '$104.92',
    change: '1.45%',
    isPositive: false,
    mcap: '$45.2B',
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDd5FHfA4Y8dSf-wF9752-3aKWgd9EHPFLDUFj738qe92gLaUq88grVuyb_y9JqQJhSeiuOdxraLEHlLTYsB5R7i9yZBzs8znG811-0grnilv4Y3hvmlb80kDlRzY6jlWxt7JoT70Obw5AzI7u8kFlphYH9-7DU18hIqwdMSNrKjAUwqyzOgA_BWUhfs9PzfBdwK0lDpKKRHM5nNM5OKZix2rQPmcE2x9sJnQDrZO-Jki7O5ibPraLIJmthPs3j7c1tlG_rUFoDrpc'
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    ticker: 'ARB',
    price: '$1.88',
    change: '12.8%',
    isPositive: true,
    mcap: '$2.4B',
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSe587TFd77-Y6YccfqtQKEc3VLOv99vjxymaybPZfPUZUfZdpBir8Sj2IDOboAXczYG2JdUM9YQ7tdKr4YJj2g0IqqFKpQ-OSByj9YltruSlZYCRcrFsndaET0v1ME_rm4gxUWCeMhnpiKpfAALpvAm5AHKzYg-PoapRexuh2gwd5bMAm4EYjfECZ3DL7AJdqotZKe0Z44EEBC6hs7j0hK-5rvdyWwaLvk4WhZ-eMiZFy5fzEGaylZBH0_3xvOacdumby35p7fc4'
  },
  {
    id: 'chainlink',
    name: 'Chainlink',
    ticker: 'LINK',
    price: '$18.42',
    change: '0.92%',
    isPositive: false,
    mcap: '$10.8B',
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK5bEEPqpyUpKdk2yUHBEQBelWXwSzAevKPxoOnNMNiPJv3ZOkFERrIwXuAWuqJ7c81CRshRTxdHDRGB4iyEDjIT2LH3YfSg98tRrfeIutIl-6FR4uc9CaL10lAYVM0ta5SPD37kBINhdDmSa4y3aoNnwlSRt3rrVdhcAXc--i9Qy6HNtXP8Io9R_iix898SvK94oa2uea9TXSb8vw6-IcQPVzYSn7Al8D6ZlTMeiAgUD0oPXcmkI2_zG4b_8c7kTvQ6wYaaYXTIo'
  },
  {
    id: 'polygon',
    name: 'Polygon',
    ticker: 'MATIC',
    price: '$0.812',
    change: '3.14%',
    isPositive: true,
    mcap: '$7.9B',
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdSj2BsXYVZgNWP2BdAjdJwQxTzGk1B3XTju-izVFfXJu0Hfw2HvnZYt2k_Wx6qNADoyidX6iVBIorjofFxncRMJu-U0iECFqsMSI7-OlGFxtIusu9DHlzZutiV8iKsBx7CYijXB_IOdaQvmJN4c3D9yDzflvZ3j1aV4rEB6vx1Ph1NqwWcNPy2Z2fJSidwANEC5iUr7ebJa6mldWxOiKJAS3CEX6nlaM_ClaIhnslF27DGZH8OGGThCP6yfUPQHrMzgdYOG6uWIk'
  }
];

export default function Markets() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleCoinClick = (coinId: string) => {
    navigate(`/markets/${coinId}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredTokens = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return INITIAL_TOKENS;
    return INITIAL_TOKENS.filter(token => 
      token.name.toLowerCase().includes(query) ||
      token.ticker.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <main className="markets-page">
      {/* Header Section */}
      <header className="markets-header">
        <div className="title-area">
          <h1 className="title">Markets</h1>
          <p className="subtitle">Real-time performance of top decentralized assets and liquidity pools.</p>
        </div>
        
        {/* Search Bar Component */}
        <div className="search-container">
          <span className="material-symbols-outlined search-icon">search</span>
          <input 
            type="text" 
            placeholder="Search tokens or pairs..." 
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </header>

      {/* Markets Bento Grid / Table Header */}
      <div className="grid-header">
        <div className="col-asset">Asset</div>
        <div className="col-price">Price</div>
        <div className="col-change">24h Change</div>
        <div className="col-mcap">Market Cap</div>
        <div className="col-action">Action</div>
      </div>

      {/* Token List (Asset Rows) */}
      <div className="token-list">
        {filteredTokens.length > 0 ? (
          filteredTokens.map(token => (
            <div className="token-row" key={token.id} onClick={() => handleCoinClick(token.id)}>
              <div className="col-asset">
                <div className="icon-wrapper">
                  <img src={token.icon} alt={token.name} />
                </div>
                <div className="flex-col">
                  <span className="name">{token.name}</span>
                  <span className="ticker">{token.ticker}</span>
                </div>
              </div>
              <div className="col-price">{token.price}</div>
              <div className={`col-change ${token.isPositive ? 'positive' : 'negative'}`}>
                <span className="material-symbols-outlined">
                  {token.isPositive ? 'arrow_upward' : 'arrow_downward'}
                </span>
                {token.change}
              </div>
              <div className="col-mcap">{token.mcap}</div>
              <div className="col-action">
                <button 
                  className="btn-trade" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    navigate(`/trade/${token.id}`); 
                  }}
                >
                  Trade
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 opacity-50">
            No tokens found matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Featured Market Widgets */}
      <div className="widgets-section">
        {/* Small Market Cap Gem */}
        <div className="widget-small">
          <div className="widget-header">
            <span className="label">Trending Gem</span>
            <span className="growth">+24.5%</span>
          </div>
          <div className="gem-info">
            <div className="icon-box">
              <span className="material-symbols-outlined">rocket_launch</span>
            </div>
            <div>
              <h4 className="name">Lumina Flux</h4>
              <p className="ticker">LUM-V2</p>
            </div>
          </div>
          <div className="divider"></div>
          <div className="stats">
            <div className="stat-row">
              <span className="label">Vol (24h)</span>
              <span className="value">$1.2M</span>
            </div>
            <div className="stat-row">
              <span className="label">MCap</span>
              <span className="value">$18.5M</span>
            </div>
          </div>
          <button className="btn-explore" onClick={() => navigate('/markets/lum-v2')}>Explore Asset</button>
        </div>
      </div>
    </main>
  );
}
