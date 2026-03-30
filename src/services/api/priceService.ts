const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

// Map internal coin IDs to CoinGecko IDs
const COINGECKO_IDS: Record<string, string> = {
  bitcoin: 'bitcoin',
  ethereum: 'ethereum',
  solana: 'solana',
  arbitrum: 'arbitrum',
  chainlink: 'chainlink',
  polygon: 'matic-network',
};

// Map portfolio asset IDs to CoinGecko IDs
export const PORTFOLIO_GECKO_MAP: Record<string, string> = {
  btc: 'bitcoin',
  eth: 'ethereum',
  sol: 'solana',
  usdc: '',
};

export interface LivePrice {
  usd: number;
  usd_24h_change: number | null;
  usd_market_cap: number;
}

export type PriceMap = Record<string, LivePrice>;

export async function fetchLivePrices(): Promise<PriceMap> {
  const ids = Object.values(COINGECKO_IDS).join(',');
  const url = COINGECKO_BASE + '/simple/price?ids=' + ids + '&vs_currencies=usd&include_24hr_change=true&include_market_cap=true';
  const response = await fetch(url);
  if (!response.ok) throw new Error('Price fetch failed: ' + response.status);
  const raw: Record<string, LivePrice> = await response.json();

  // Re-map CoinGecko IDs back to internal IDs
  const result: PriceMap = {};
  for (const [internalId, geckoId] of Object.entries(COINGECKO_IDS)) {
    if (raw[geckoId]) {
      result[internalId] = raw[geckoId];
    }
  }
  return result;
}

export function formatUsd(value?: number | null): string {
  if (value == null || !isFinite(Number(value))) return '--';
  const v = Number(value);
  if (v >= 1000) {
    return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (v >= 1) {
    return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

export function formatMarketCap(value?: number | null): string {
  if (value == null || !isFinite(Number(value))) return '--';
  const v = Number(value);
  if (v >= 1e12) return '$' + (v / 1e12).toFixed(1) + 'T';
  if (v >= 1e9) return '$' + (v / 1e9).toFixed(1) + 'B';
  if (v >= 1e6) return '$' + (v / 1e6).toFixed(1) + 'M';
  return '$' + v.toLocaleString('en-US');
}

export function formatPercent(value?: number | null): string {
  if (value == null || !isFinite(Number(value))) return '--';
  const v = Number(value);
  return (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
}
