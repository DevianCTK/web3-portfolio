import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOKEN_LIST } from '../data/mockData';
import './Markets.scss';

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
    if (!query) return TOKEN_LIST;
    return TOKEN_LIST.filter(token =>
      token.name.toLowerCase().includes(query) ||
      token.symbol.toLowerCase().includes(query)
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
                  <span className="ticker">{token.symbol}</span>
                </div>
              </div>
              <div className="col-price">${token.price.toLocaleString()}</div>
              <div className={`col-change ${token.isPositive ? 'positive' : 'negative'}`}>
                <span className="material-symbols-outlined">
                  {token.isPositive ? 'arrow_upward' : 'arrow_downward'}
                </span>
                {token.change}%
              </div>
              <div className="col-mcap">{token.mcap}</div>
              <div className="col-action">
                <button 
                  className="btn-trade" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    navigate('/dashboard/swap'); 
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
