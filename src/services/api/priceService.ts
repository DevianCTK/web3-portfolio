const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

// Map internal coin IDs to CoinGecko IDs
const COINGECKO_IDS: Record<string, string> = {
  bitcoin: 'bitcoin',
  ethereum: 'ethereum',
  solana: 'solana',
  arbitrum: 'arbitrum',
  chainlink: 'chainlink',
  // polygon removed from demo mapping
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
  last_updated?: string | null;
}

export type PriceMap = Record<string, LivePrice>;

export async function fetchLivePrices(): Promise<PriceMap> {
  // Use the /coins/markets endpoint for richer per-coin data including last_updated
  const ids = Object.values(COINGECKO_IDS).join(',');
  const url = COINGECKO_BASE + '/coins/markets?vs_currency=usd&ids=' + ids + '&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h';
  const response = await fetch(url);
  if (!response.ok) throw new Error('Price fetch failed: ' + response.status);

  type Market = {
    id: string;
    current_price: number;
    price_change_percentage_24h?: number | null;
    market_cap?: number | null;
    last_updated?: string | null;
  };

  const raw = (await response.json()) as Market[];

  // raw is an array of market objects keyed by gecko id; map back to our internal ids
  const result: PriceMap = {};
  for (const market of raw) {
    // find internal id for this gecko id
    const entry = Object.entries(COINGECKO_IDS).find(([, gecko]) => gecko === market.id);
    if (!entry) continue;
    const internalId = entry[0];
    result[internalId] = {
      usd: market.current_price,
      usd_24h_change: market.price_change_percentage_24h ?? null,
      usd_market_cap: market.market_cap ?? 0,
      last_updated: market.last_updated ?? null,
    };
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
