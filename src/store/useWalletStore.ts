import { create } from 'zustand';

interface WalletState {
  address: string | null;
  balance: string | null;
  isConnecting: boolean;
  isConnectModalOpen: boolean;
  isDemoMode: boolean;
  setAddress: (address: string | null) => void;
  setBalance: (balance: string | null) => void;
  setConnecting: (isConnecting: boolean) => void;
  setConnectModalOpen: (isOpen: boolean) => void;
  setDemoMode: (isDemo: boolean) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  balance: null,
  isConnecting: false,
  isConnectModalOpen: false,
  isDemoMode: false,
  setAddress: (address) => set({ address }),
  setBalance: (balance) => set({ balance }),
  setConnecting: (isConnecting) => set({ isConnecting }),
  setConnectModalOpen: (isOpen) => set({ isConnectModalOpen: isOpen }),
  setDemoMode: (isDemoMode) => set({ isDemoMode }),
  disconnect: () => set({ address: null, balance: null, isDemoMode: false }),
}));
