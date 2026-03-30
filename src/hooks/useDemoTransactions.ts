import { useState, useCallback, useEffect } from 'react';
import type { Transaction } from '../data/mockData';
import { TRANSACTIONS } from '../data/mockData';

const STORAGE_KEY = 'demo-transactions';

function loadTransactions(): Transaction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
    const newTx: Transaction = { ...tx, id: 'tx-' + Date.now() };
    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  }, []);

  const clearTransactions = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setTransactions(TRANSACTIONS);
  }, []);

  return { transactions, addTransaction, clearTransactions };
}
