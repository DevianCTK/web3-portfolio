import { useAccount, useConnect, useDisconnect, useBalance as useWagmiBalance } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { formatUnits } from 'viem';
import { useWalletStore } from '../store/useWalletStore';
import { useEffect } from 'react';
import { checkMetaMaskInstalled, MOCK_WALLET } from '../services/web3/wallet';
import { SWAP_TOKENS, TRANSACTIONS } from '../data/mockData';

export function useWallet() {
  const { address: wagmiAddress, isConnected: isWagmiConnected, isConnecting: isWagmiConnecting } = useAccount();
  const { connect } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();

  const {
    address,
    balance,
    isConnecting,
    mode,
    setAddress,
    setBalance,
    setConnecting,
    setMode,
  } = useWalletStore();

  const { data: balanceData } = useWagmiBalance({
    address: wagmiAddress,
  });

  // Sync wagmi wallet state to store
  useEffect(() => {
    if (isWagmiConnected && wagmiAddress) {
      setMode('wallet');
      setAddress(wagmiAddress);
      if (balanceData) {
        const formatted = formatUnits(balanceData.value, balanceData.decimals);
        setBalance(parseFloat(formatted).toFixed(4) + ' ' + balanceData.symbol);
      }
    } else if (mode === 'wallet' && !isWagmiConnected) {
      // MetaMask disconnected while in wallet mode — go to disconnected
      setMode('disconnected');
      setAddress(null);
      setBalance(null);
    }
    setConnecting(isWagmiConnecting);
  }, [wagmiAddress, isWagmiConnected, isWagmiConnecting, balanceData, mode, setAddress, setBalance, setConnecting, setMode]);

  const handleConnectReal = () => {
    if (checkMetaMaskInstalled()) {
      connect({ connector: injected() });
    }
  };

  const handleConnectDemo = () => {
    try {
      // Seed demo balances only if missing — persist across logout
      const existing = localStorage.getItem('demo-balances');
      if (!existing) {
        const demoBalances = {
          ETH: { ...SWAP_TOKENS.ETH },
          USDC: { ...SWAP_TOKENS.USDC },
        };
        localStorage.setItem('demo-balances', JSON.stringify(demoBalances));
      }

      // Seed demo transactions only if missing
      if (!localStorage.getItem('demo-transactions')) {
        localStorage.setItem('demo-transactions', JSON.stringify(TRANSACTIONS));
      }

      // Read current demo ETH balance to show in navbar
      const stored = JSON.parse(localStorage.getItem('demo-balances') || '{}');
      const ethBal = stored?.ETH?.balance ?? SWAP_TOKENS.ETH.balance;

      setMode('demo');
      setAddress(MOCK_WALLET.address);
      setBalance(`${Number(ethBal).toFixed(2)} ETH`);
      setConnecting(false);
    } catch {
      setMode('demo');
      setAddress(MOCK_WALLET.address);
      setBalance(MOCK_WALLET.balance);
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    if (mode === 'wallet') {
      wagmiDisconnect();
    }
    setMode('disconnected');
    setAddress(null);
    setBalance(null);
    setConnecting(false);
  };

  const isConnected = mode === 'demo' || mode === 'wallet';
  const isDemoMode = mode === 'demo';
  const hasMetaMask = checkMetaMaskInstalled();

  return {
    address,
    balance,
    isConnected,
    isConnecting,
    isDemoMode,
    mode,
    hasMetaMask,
    connectReal: handleConnectReal,
    connectDemo: handleConnectDemo,
    disconnect: handleDisconnect,
  };
}
