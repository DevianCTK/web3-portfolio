import { useAccount, useConnect, useDisconnect, useBalance as useWagmiBalance } from 'wagmi';
import { injected } from 'wagmi/connectors';
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
    isDemoMode,
    setAddress,
    setBalance,
    setConnecting,
    setDemoMode,
    disconnect: storeDisconnect,
  } = useWalletStore();

  const { data: balanceData } = useWagmiBalance({
    address: wagmiAddress,
  });

  useEffect(() => {
    if (!isDemoMode) {
      setAddress(wagmiAddress || null);
      if (balanceData) {
        setBalance(`${balanceData.formatted.substring(0, 6)} ${balanceData.symbol}`);
      } else {
        setBalance(null);
      }
      setConnecting(isWagmiConnecting);
    }
  }, [wagmiAddress, isWagmiConnecting, balanceData, isDemoMode, setAddress, setBalance, setConnecting]);

  const handleConnectReal = () => {
    if (checkMetaMaskInstalled()) {
      connect({ connector: injected() });
    }
  };

  const handleConnectDemo = () => {
    setDemoMode(true);
    setAddress(MOCK_WALLET.address);
    setBalance(MOCK_WALLET.balance);
    setConnecting(false);
  };

  const handleDisconnect = () => {
    if (!isDemoMode) {
      wagmiDisconnect();
    }
    storeDisconnect();
  };

  const isConnected = isWagmiConnected || isDemoMode;
  const hasMetaMask = checkMetaMaskInstalled();

  return {
    address,
    balance,
    isConnected,
    isConnecting,
    isDemoMode,
    hasMetaMask,
    connectReal: handleConnectReal,
    connectDemo: handleConnectDemo,
    disconnect: handleDisconnect,
  };
}
