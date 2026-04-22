import { useWalletStore } from '../store/useWalletStore';
import { TOKENS } from '../data/mockData';
import { useDemoBalances } from './useDemoBalances';
import type { Transaction } from '../data/mockData';
import type { AppMode } from '../store/useWalletStore';
import { usePrices } from './usePrices';
import { useDemoTransactions } from './useDemoTransactions';
import { formatUsd } from '../services/api/priceService';

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
  icon?: string;
}

export interface NetworkItem {
  label: string;
  amount: string;
  dotClass: string;
  percent: number;
  id?: string;
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
  const tokenBalances = useWalletStore((s) => s.tokenBalances);
  const { data: prices, isLoading: isLoadingPrices } = usePrices();
  const { transactions: demoTransactions } = useDemoTransactions();
  const { balances } = useDemoBalances();

  const ethPrice = prices?.ethereum?.usd ?? FALLBACK_ETH_PRICE;

  if (mode === 'demo') {
    // Build portfolio from demo balances so swaps persist into assets

    // map symbol -> internal id (e.g., ETH -> ethereum)
    const symbolToId: Record<string, string> = {};
    for (const [id, t] of Object.entries(TOKENS)) {
      symbolToId[t.symbol] = id;
    }

    const demoAssets: PortfolioAsset[] = Object.values(balances).map((b) => {
      const symbol = b.symbol;
      const internalId = symbolToId[symbol];
      const livePrice = internalId ? prices?.[internalId]?.usd : undefined;
      const liveChange = internalId ? prices?.[internalId]?.usd_24h_change : null;
      const balanceNum = Number(b.balance || 0);
      const priceForCalc = livePrice ?? b.price ?? 0;
      const value = priceForCalc ? balanceNum * priceForCalc : 0;

      return {
        id: symbol.toLowerCase(),
        name: b.name,
        ticker: symbol,
        priceLabel: livePrice ? formatUsd(livePrice) : formatUsd(b.price),
        balance: balanceNum.toFixed(6),
        value: formatUsd(value),
        change: liveChange != null ? (liveChange >= 0 ? '+' : '') + liveChange.toFixed(2) + '%' : '--',
        isPositive: liveChange != null ? liveChange >= 0 : true,
        icon: b.icon,
      };
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
      return { label: a.name, percent: pct + '%', dotClass: dotMap[a.id] || 'other', icon: a.icon };
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
      networkAllocation: (() => {
        const byValue = [...demoAssets].map(a => ({
          label: a.name,
          valueNum: parseFloat(a.value.replace(/[$,]/g, '')) || 0,
          amount: a.value,
          id: a.id,
        })).sort((x, y) => y.valueNum - x.valueNum);

        const top = byValue.slice(0, 2);
        const otherValue = demoTotalUsd - top.reduce((s, t) => s + t.valueNum, 0);

        const dotMap: Record<string, string> = { bitcoin: 'eth', ethereum: 'sol', solana: 'defi', usdc: 'stable' };

        const items = top.map((t) => ({
          id: t.id,
          label: t.label,
          amount: t.amount,
          dotClass: dotMap[t.id] || 'other',
          percent: demoTotalUsd > 0 ? Math.round((t.valueNum / demoTotalUsd) * 100) : 0,
        }));

        if (otherValue > 0) {
          items.push({ id: 'other', label: 'Other', amount: formatUsd(otherValue), dotClass: 'arb', percent: Math.max(0, 100 - items.reduce((s, it) => s + it.percent, 0)) });
        }

        return items;
      })(),
      isLoadingPrices,
    };
  }

  if (mode === 'wallet') {
    // For wallet mode, include the connected ETH balance plus ERC-20 token balances
    const parsedEth = parseFloat(balance || '0');

    // Build assets list starting with ETH
    const assets: PortfolioAsset[] = [];

    if (parsedEth > 0) {
      const ethChange = prices?.ethereum?.usd_24h_change;
      assets.push({
        id: 'eth',
        name: 'Ethereum',
        ticker: 'ETH',
        priceLabel: formatUsd(ethPrice),
        balance: parsedEth.toFixed(6),
        value: formatUsd(parsedEth * ethPrice),
        change: ethChange != null ? (ethChange >= 0 ? '+' : '') + ethChange.toFixed(2) + '%' : '--',
        isPositive: ethChange != null ? ethChange >= 0 : true,
        icon: TOKENS.ethereum.icon,
      });
    }

    // Add any ERC-20 token balances we have in store
    if (tokenBalances && Object.keys(tokenBalances).length > 0) {
      for (const [sym, rawBal] of Object.entries(tokenBalances)) {
        const balNum = parseFloat(rawBal || '0');
        if (isNaN(balNum) || balNum <= 0) continue;

        // Map symbol -> internal token id in TOKENS where possible
        const tokenMeta = Object.values(TOKENS).find((t) => t.symbol === sym || t.id === sym.toLowerCase());
        const internalId = tokenMeta ? tokenMeta.id : sym.toLowerCase();
        const livePrice = prices?.[internalId]?.usd;

        const valueNum = (livePrice ?? tokenMeta?.price ?? 0) * balNum;

        assets.push({
          id: internalId,
          name: tokenMeta?.name ?? sym,
          ticker: sym,
          priceLabel: livePrice ? formatUsd(livePrice) : formatUsd(tokenMeta?.price),
          balance: balNum.toString(),
          value: formatUsd(valueNum),
          change: livePrice != null && prices?.[internalId]?.usd_24h_change != null ? (prices![internalId]!.usd_24h_change! >= 0 ? '+' : '') + prices![internalId]!.usd_24h_change!.toFixed(2) + '%' : '--',
          isPositive: prices?.[internalId]?.usd_24h_change != null ? prices![internalId]!.usd_24h_change! >= 0 : true,
          icon: tokenMeta?.icon ?? '',
        });
      }
    }

    const totalUsd = assets.reduce((s, a) => s + parseFloat(a.value.replace(/[$,]/g, '')) || 0, 0);
    const totalChange = (() => {
      // weighted average change where available
      let w = 0;
      let sum = 0;
      for (const a of assets) {
        const ch = parseFloat(a.change.replace(/[+%]/g, ''));
        const val = parseFloat(a.value.replace(/[$,]/g, '')) || 0;
        if (!isNaN(ch) && val > 0) {
          sum += ch * val;
          w += val;
        }
      }
      const avg = w > 0 ? sum / w : 0;
      return (avg >= 0 ? '+' : '') + avg.toFixed(2) + '%';
    })();

    return {
      mode,
      balanceUsd: formatUsd(totalUsd),
      totalChange,
      totalChangePositive: totalChange.startsWith('+'),
      portfolioAssets: assets,
      transactions: [],
      overviewTransactions: [],
      assetAllocation: assets.map((a) => ({ label: a.name, percent: '0%', dotClass: 'other', icon: a.icon })),
      networkAllocation: assets.length > 0 ? [{ label: 'Ethereum Mainnet', amount: formatUsd(totalUsd), dotClass: 'eth', percent: 100 }] : [],
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
