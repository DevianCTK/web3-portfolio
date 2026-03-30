import { useAccount, useConnect, useDisconnect, useBalance as useWagmiBalance } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { formatUnits } from 'viem';
import { useWalletStore } from '../store/useWalletStore';
import { useEffect } from 'react';
import { checkMetaMaskInstalled, MOCK_WALLET } from '../services/web3/wallet';

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
    disconnect: storeDisconnect,
  } = useWalletStore();

  const { data: balanceData } = useWagmiBalance({
    address: wagmiAddress,
  });

  // Sync wagmi wallet state to store (only when not in demo mode)
  useEffect(() => {
    if (mode !== 'demo') {
      if (isWagmiConnected && wagmiAddress) {
        setMode('wallet');
        setAddress(wagmiAddress);
        if (balanceData) {
          const formatted = formatUnits(balanceData.value, balanceData.decimals);
          setBalance(`${formatted.substring(0, 6)} ${balanceData.symbol}`);
        }
      } else if (mode === 'wallet') {
        storeDisconnect();
      }
      setConnecting(isWagmiConnecting);
    }
  }, [wagmiAddress, isWagmiConnected, isWagmiConnecting, balanceData, mode, setAddress, setBalance, setConnecting, setMode, storeDisconnect]);

  const handleConnectReal = () => {
    if (checkMetaMaskInstalled()) {
      connect({ connector: injected() });
    }
  };

  const handleConnectDemo = () => {
    setMode('demo');
    setAddress(MOCK_WALLET.address);
    setBalance(MOCK_WALLET.balance);
    setConnecting(false);
  };

  const handleDisconnect = () => {
    if (mode === 'wallet') {
      wagmiDisconnect();
    }
    storeDisconnect();
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
