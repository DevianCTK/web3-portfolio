import { useState, useCallback, useEffect } from 'react';
import { SWAP_TOKENS } from '../data/mockData';
import { useWalletStore } from '../store/useWalletStore';

export interface DemoTokenBalance {
  symbol: string;
  name: string;
  price: number;
  balance: number;
  icon: string;
}

const STORAGE_KEY = 'demo-balances';

function getDefaults(): Record<string, DemoTokenBalance> {
  return {
    ETH: { ...SWAP_TOKENS.ETH },
    USDC: { ...SWAP_TOKENS.USDC },
  };
}

function load(): Record<string, DemoTokenBalance> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.ETH) return parsed;
    }
  } catch { /* ignore */ }
  const defaults = getDefaults();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  return defaults;
}

export function useDemoBalances() {
  const [balances, setBalances] = useState<Record<string, DemoTokenBalance>>(load);
  const setBalance = useWalletStore((s) => s.setBalance);
  const mode = useWalletStore((s) => s.mode);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(balances));
    // When demo balances change, reflect ETH balance in global wallet store (for navbar)
    if (mode === 'demo' && balances?.ETH) {
      setBalance(`${balances.ETH.balance.toFixed(2)} ETH`);
    }
  }, [balances]);

  // Listen for external changes to demo-balances in localStorage (e.g., when demo profile is initialized)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : null;
          if (parsed && parsed.ETH) {
            setBalances(parsed);
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const updateBalance = useCallback((symbol: string, delta: number) => {
    setBalances((prev) => {
      const token = prev[symbol];
      if (!token) return prev;
      return {
        ...prev,
        [symbol]: { ...token, balance: Math.max(0, token.balance + delta) },
      };
    });
  }, []);

  const resetBalances = useCallback(() => {
    const defaults = getDefaults();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    setBalances(defaults);
  }, []);

  return { balances, updateBalance, resetBalances };
}
