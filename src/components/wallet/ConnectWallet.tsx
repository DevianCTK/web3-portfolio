import React from 'react';
import { useWallet } from '../../hooks/useWallet';
import { Button } from '../ui/Button';
import { Wallet as WalletIcon } from 'lucide-react';

export function ConnectWallet() {
  const { isConnected, connect, isConnecting } = useWallet();

  if (isConnected) return null;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 max-w-md mx-auto mt-12">
      <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
        <WalletIcon className="w-8 h-8 text-indigo-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Wallet</h2>
      <p className="text-gray-500 text-center mb-8">
        Connect your EVM wallet to view your portfolio and swap tokens instantly.
      </p>
      
      <Button 
        size="lg" 
        fullWidth 
        onClick={connect} 
        disabled={isConnecting}
        className="gap-2"
      >
        <WalletIcon className="w-5 h-5" />
        {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
      </Button>
    </div>
  );
}
