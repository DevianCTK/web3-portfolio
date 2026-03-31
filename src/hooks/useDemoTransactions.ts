import { useState, useCallback, useEffect } from 'react';
import dayjs from 'dayjs';
import type { Transaction } from '../data/mockData';
import { TRANSACTIONS } from '../data/mockData';

const STORAGE_KEY = 'demo-transactions';

function loadTransactions(): Transaction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // If existing transactions contain old demo data (pre-2026), reset to canonical seed
        const hasOld = parsed.some((tx: Transaction) => {
          const maybe = dayjs(tx.date);
          const year = maybe.isValid() ? maybe.year() : (tx.date.includes('202') ? parseInt(tx.date.slice(-4)) : 0);
          return year < 2026;
        });
        if (!hasOld) return parsed;
      }
    }
  } catch { /* ignore corrupt data */ }
  // Seed with static mock on first load
  localStorage.setItem(STORAGE_KEY, JSON.stringify(TRANSACTIONS));
  return TRANSACTIONS;
}

export function useDemoTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions);

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = { ...tx, id: 'tx-' + dayjs().valueOf() };
    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  }, []);

  const clearTransactions = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setTransactions(TRANSACTIONS);
  }, []);

  return { transactions, addTransaction, clearTransactions };
}
