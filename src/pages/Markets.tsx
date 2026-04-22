import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TOKEN_LIST } from '../data/mockData';
import { usePrices } from '../hooks/usePrices';
import { formatUsd, formatMarketCap, formatPercent } from '../services/api/priceService';
import './Markets.scss';

export default function Markets() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { data: prices } = usePrices();

  const handleCoinClick = (coinId: string) => {
    navigate(`/markets/${coinId}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const enrichedTokens = useMemo(() => {
    return TOKEN_LIST.map(token => {
      const live = prices?.[token.id];
      if (live) {
        return {
          ...token,
          price: live.usd,
          // keep signed change so we can format with sign later
          change: live.usd_24h_change,
          isPositive: live.usd_24h_change != null ? live.usd_24h_change >= 0 : token.isPositive,
          mcap: formatMarketCap(live.usd_market_cap),
        };
      }
      return token;
    });
  }, [prices]);

  const filteredTokens = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return enrichedTokens;
    return enrichedTokens.filter(token =>
      token.name.toLowerCase().includes(query) ||
      token.symbol.toLowerCase().includes(query)
    );
  }, [searchQuery, enrichedTokens]);

  return (
    <main className="markets-page">
      {/* Header Section */}
      <header className="markets-header">
        <div className="title-area">
          <h1 className="title">{t('markets.title')}</h1>
          <p className="subtitle">{t('markets.subtitle')}</p>
        </div>

        {/* Search Bar Component */}
        <div className="search-container">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder={t('markets.searchPlaceholder')}
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </header>

      {/* Markets Bento Grid / Table Header */}
      <div className="grid-header">
        <div className="col-asset">{t('markets.headers.asset')}</div>
        <div className="col-price">{t('markets.headers.price')}</div>
        <div className="col-change">{t('markets.headers.change24')}</div>
        <div className="col-mcap">{t('markets.headers.mcap')}</div>
        <div className="col-action">{t('markets.headers.action')}</div>
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
              <div className="col-price">{formatUsd(token.price)}</div>
              <div className={`col-change ${token.isPositive ? 'positive' : 'negative'}`}>
                <span className="material-symbols-outlined">
                  {token.isPositive ? 'arrow_upward' : 'arrow_downward'}
                </span>
                {formatPercent(token.change)}
              </div>
              <div className="col-mcap">{token.mcap}</div>
              <div className="col-action">
                <button
                  className="btn-trade"
                  onClick={(e) => {
                    e.stopPropagation();
                    // pass the clicked token symbol to the swap page so it can prefill the receive token
                    navigate('/dashboard/swap', { state: { receive: token.symbol } });
                  }}
                >
                  {t('markets.trade')}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 opacity-50">
            {t('markets.noMatches', { query: searchQuery })}
          </div>
        )}
      </div>
    </main>
  );
}
