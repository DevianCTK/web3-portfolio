import { create } from 'zustand';

export type AppMode = 'disconnected' | 'demo' | 'wallet';

interface WalletState {
  address: string | null;
  balance: string | null;
  isConnecting: boolean;
  isConnectModalOpen: boolean;
  mode: AppMode;
  setAddress: (address: string | null) => void;
  setBalance: (balance: string | null) => void;
  setConnecting: (isConnecting: boolean) => void;
  setConnectModalOpen: (isOpen: boolean) => void;
  setMode: (mode: AppMode) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  balance: null,
  isConnecting: false,
  isConnectModalOpen: false,
  mode: 'disconnected',
  setAddress: (address) => set({ address }),
  setBalance: (balance) => set({ balance }),
  setConnecting: (isConnecting) => set({ isConnecting }),
  setConnectModalOpen: (isOpen) => set({ isConnectModalOpen: isOpen }),
  setMode: (mode) => set({ mode }),
  disconnect: () => set({ address: null, balance: null, mode: 'disconnected' }),
}));
