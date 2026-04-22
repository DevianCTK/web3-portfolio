import { create } from 'zustand';
import dayjs from 'dayjs';

export type AppMode = 'disconnected' | 'demo' | 'wallet';

interface WalletState {
  address: string | null;
  balance: string | null;
  tokenBalances: Record<string, string>;
  isConnecting: boolean;
  isConnectModalOpen: boolean;
  mode: AppMode;
  setAddress: (address: string | null) => void;
  setBalance: (balance: string | null) => void;
  setConnecting: (isConnecting: boolean) => void;
  setConnectModalOpen: (isOpen: boolean) => void;
  setMode: (mode: AppMode) => void;
  setTokenBalances: (balances: Record<string, string>) => void;
  disconnect: () => void;
}

const STORAGE_KEY = 'wallet-session';

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.expires && dayjs().valueOf() > parsed.expires) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persistSession(obj: { address: string | null; balance: string | null; mode: AppMode }) {
  try {
    const expires = dayjs().valueOf() + 24 * 60 * 60 * 1000; // 1 day
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...obj, expires }));
  } catch {
    // ignore
  }
}

const initial = loadSession();

export const useWalletStore = create<WalletState>((set) => ({
  address: initial?.address ?? null,
  balance: initial?.balance ?? null,
  tokenBalances: {},
  isConnecting: false,
  isConnectModalOpen: false,
  mode: (initial?.mode as AppMode) ?? 'disconnected',
  setAddress: (address) => {
    set((s) => {
      const newState = { ...s, address };
      persistSession({ address, balance: newState.balance, mode: newState.mode });
      return { address };
    });
  },
  setBalance: (balance) => {
    set((s) => {
      const newState = { ...s, balance };
      persistSession({ address: newState.address, balance, mode: newState.mode });
      return { balance };
    });
  },
  setConnecting: (isConnecting) => set({ isConnecting }),
  setConnectModalOpen: (isOpen) => set({ isConnectModalOpen: isOpen }),
  setMode: (mode) => {
    set((s) => {
      const newState = { ...s, mode };
      persistSession({ address: newState.address, balance: newState.balance, mode });
      return { mode };
    });
  },
  setTokenBalances: (balances) => set(() => ({ tokenBalances: balances })),
  disconnect: () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { }
    set({ address: null, balance: null, mode: 'disconnected' });
  },
}));
