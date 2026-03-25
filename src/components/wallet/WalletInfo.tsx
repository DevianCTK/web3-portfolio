import React from 'react';
import { useWallet } from '../../hooks/useWallet';
import { Card } from '../ui/Card';
import { Wallet as WalletIcon, Copy, ExternalLink, Activity } from 'lucide-react';

export function WalletInfo() {
  const { address, balance } = useWallet();

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  if (!address) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
          <WalletIcon className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Wallet Overview</h3>
          <p className="text-sm text-gray-500">Connected to Ethereum Mainnet</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Balance</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">{balance || '0.00 ETH'}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col justify-between">
          <p className="text-sm text-gray-500 mb-1">Address</p>
          <div className="flex items-center justify-between">
            <span className="font-mono text-gray-900 font-medium truncate mr-2">
              {address.slice(0, 8)}...{address.slice(-6)}
            </span>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-md hover:bg-white border border-transparent hover:border-gray-200 transition">
                <Copy className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-md hover:bg-white border border-transparent hover:border-gray-200 transition">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-green-500" />
            Network Status
          </span>
          <span className="font-medium text-green-600">Operational</span>
        </div>
      </div>
    </Card>
  );
}
