import { useWalletStore } from '../store/useWalletStore';
import { PORTFOLIO_ASSETS, TOKENS } from '../data/mockData';
import type { Transaction } from '../data/mockData';
import type { AppMode } from '../store/useWalletStore';
import { usePrices } from './usePrices';
import { useDemoTransactions } from './useDemoTransactions';
import { PORTFOLIO_GECKO_MAP, formatUsd } from '../services/api/priceService';

// ── Interfaces ──

export interface PortfolioAsset {
  id: string;
  name: string;
  ticker: string;
  priceLabel: string;
  balance: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

export interface AllocationItem {
  label: string;
  percent: string;
  dotClass: string;
}

export interface NetworkItem {
  label: string;
  amount: string;
  dotClass: string;
  percent: number;
}

export interface OverviewTransaction {
  action: string;
  actionIcon: string;
  actionClass: string;
  asset: string;
  amount: string;
  status: string;
  statusClass: string;
  time: string;
}

export interface AppData {
  mode: AppMode;
  balanceUsd: string;
  totalChange: string;
  totalChangePositive: boolean;
  portfolioAssets: PortfolioAsset[];
  transactions: Transaction[];
  overviewTransactions: OverviewTransaction[];
  assetAllocation: AllocationItem[];
  networkAllocation: NetworkItem[];
  isLoadingPrices: boolean;
}

// ── Constants ──

const FALLBACK_ETH_PRICE = 2450;

const ACTION_MAP: Record<string, { action: string; actionIcon: string; actionClass: string }> = {
  receive: { action: 'Received', actionIcon: 'call_received', actionClass: 'received' },
  send: { action: 'Sent', actionIcon: 'call_made', actionClass: 'sent' },
  swap: { action: 'Swap', actionIcon: 'swap_horiz', actionClass: 'swap' },
};

function txToOverview(tx: Transaction): OverviewTransaction {
  const cfg = ACTION_MAP[tx.action] || ACTION_MAP.receive;
  return {
    ...cfg,
    asset: tx.asset,
    amount: tx.amount,
    status: tx.status.charAt(0).toUpperCase() + tx.status.slice(1),
    statusClass: tx.status,
    time: tx.date,
  };
}

// ── Hook ──

export function useAppData(): AppData {
  const mode = useWalletStore((s) => s.mode);
  const balance = useWalletStore((s) => s.balance);
  const { data: prices, isLoading: isLoadingPrices } = usePrices();
  const { transactions: demoTransactions } = useDemoTransactions();

  const ethPrice = prices?.ethereum?.usd ?? FALLBACK_ETH_PRICE;

  if (mode === 'demo') {
    // Compute live portfolio values using real prices when available
    const demoAssets: PortfolioAsset[] = PORTFOLIO_ASSETS.map((asset) => {
      const geckoId = PORTFOLIO_GECKO_MAP[asset.id];
      const livePrice = geckoId ? prices?.[geckoId]?.usd : null;
      const liveChange = geckoId ? prices?.[geckoId]?.usd_24h_change : null;

      if (livePrice && asset.id !== 'usdc') {
        const balanceNum = parseFloat(asset.balance.replace(/,/g, ''));
        const value = balanceNum * livePrice;
        return {
          ...asset,
          priceLabel: formatUsd(livePrice),
          value: formatUsd(value),
          change: liveChange != null ? (liveChange >= 0 ? '+' : '') + liveChange.toFixed(2) + '%' : asset.change,
          isPositive: liveChange != null ? liveChange >= 0 : asset.isPositive,
        };
      }
      return asset;
    });

    const demoTotalUsd = demoAssets.reduce(
      (sum, a) => sum + parseFloat(a.value.replace(/[$,]/g, '')),
      0,
    );

    // Compute overall 24h change as weighted average
    let weightedChange = 0;
    let totalWeight = 0;
    for (const asset of demoAssets) {
      const val = parseFloat(asset.value.replace(/[$,]/g, ''));
      const ch = parseFloat(asset.change.replace(/[+%]/g, ''));
      if (!isNaN(ch) && val > 0) {
        weightedChange += ch * val;
        totalWeight += val;
      }
    }
    const overallChange = totalWeight > 0 ? weightedChange / totalWeight : 0;

    // Compute allocation percentages from live values
    const demoAllocation: AllocationItem[] = demoAssets.map((a) => {
      const val = parseFloat(a.value.replace(/[$,]/g, ''));
      const pct = demoTotalUsd > 0 ? ((val / demoTotalUsd) * 100).toFixed(1) : '0';
      const dotMap: Record<string, string> = { btc: 'eth', eth: 'stable', sol: 'defi', usdc: 'other' };
      return { label: a.name, percent: pct + '%', dotClass: dotMap[a.id] || 'other' };
    });

    return {
      mode,
      balanceUsd: formatUsd(demoTotalUsd),
      totalChange: (overallChange >= 0 ? '+' : '') + overallChange.toFixed(2) + '%',
      totalChangePositive: overallChange >= 0,
      portfolioAssets: demoAssets,
      transactions: demoTransactions,
      overviewTransactions: demoTransactions.slice(0, 4).map(txToOverview),
      assetAllocation: demoAllocation,
      networkAllocation: [
        { label: 'Bitcoin', amount: demoAssets[0]?.value || '$0', dotClass: 'eth', percent: 65 },
        { label: 'Ethereum', amount: demoAssets[1]?.value || '$0', dotClass: 'sol', percent: 25 },
        { label: 'Other', amount: formatUsd(demoTotalUsd - parseFloat((demoAssets[0]?.value || '0').replace(/[$,]/g, '')) - parseFloat((demoAssets[1]?.value || '0').replace(/[$,]/g, ''))), dotClass: 'arb', percent: 10 },
      ],
      isLoadingPrices,
    };
  }

  if (mode === 'wallet') {
    const parsedBalance = parseFloat(balance || '0');
    const usdValue = parsedBalance * ethPrice;
    const usdFormatted = usdValue > 0 ? formatUsd(usdValue) : '$0.00';

    const ethChange = prices?.ethereum?.usd_24h_change;
    const changeStr = ethChange != null ? (ethChange >= 0 ? '+' : '') + ethChange.toFixed(2) + '%' : '--';

    const assets: PortfolioAsset[] = parsedBalance > 0
      ? [{
        id: 'eth',
        name: 'Ethereum',
        ticker: 'ETH',
        priceLabel: formatUsd(ethPrice),
        balance: parsedBalance.toFixed(4),
        value: usdFormatted,
        change: changeStr,
        isPositive: ethChange != null ? ethChange >= 0 : true,
        icon: TOKENS.ethereum.icon,
      }]
      : [];

    return {
      mode,
      balanceUsd: usdFormatted,
      totalChange: changeStr,
      totalChangePositive: ethChange != null ? ethChange >= 0 : true,
      portfolioAssets: assets,
      transactions: [],
      overviewTransactions: [],
      assetAllocation: parsedBalance > 0
        ? [{ label: 'Ethereum', percent: '100%', dotClass: 'eth' }]
        : [],
      networkAllocation: parsedBalance > 0
        ? [{ label: 'Ethereum Mainnet', amount: usdFormatted, dotClass: 'eth', percent: 100 }]
        : [],
      isLoadingPrices,
    };
  }

  // disconnected
  return {
    mode,
    balanceUsd: '$0.00',
    totalChange: '--',
    totalChangePositive: true,
    portfolioAssets: [],
    transactions: [],
    overviewTransactions: [],
    assetAllocation: [],
    networkAllocation: [],
    isLoadingPrices,
  };
}
