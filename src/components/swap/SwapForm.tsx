import React from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ArrowDownUp, Settings, ChevronDown } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';

export function SwapForm() {
  const { isConnected, connect } = useWallet();
  const [amountIn, setAmountIn] = React.useState('');
  const [amountOut, setAmountOut] = React.useState('');

  const handleSwap = () => {
    console.log('Swap initiated', { amountIn, amountOut });
  };

  const handleAmountInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAmountIn(val);
    // Mock quote calculation logic
    if (val && !isNaN(Number(val))) {
      setAmountOut((Number(val) * 1850.50).toFixed(2));
    } else {
      setAmountOut('');
    }
  };

  return (
    <Card className="p-1 max-w-md mx-auto">
      <div className="p-4 flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">Swap</h3>
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 bg-gray-50 rounded-xl mb-1 border border-gray-100 focus-within:border-indigo-300 focus-within:ring-1 focus-within:ring-indigo-300 transition mx-2">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">You pay</span>
          <span className="text-sm text-gray-500">Balance: 1.45 ETH</span>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="0.0"
            className="w-full bg-transparent text-3xl font-medium outline-none text-gray-900 placeholder-gray-300"
            value={amountIn}
            onChange={handleAmountInChange}
          />
          <button className="flex items-center gap-1 bg-white border border-gray-200 shadow-sm px-3 py-1.5 rounded-full font-semibold hover:bg-gray-50 transition min-w-max">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-1">
              <span className="text-[10px] text-blue-600">E</span>
            </div>
            ETH
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="relative h-2 flex justify-center items-center my-1 z-10 w-full mx-2 border-box">
        <button className="absolute bg-white border border-gray-100 p-2 rounded-xl shadow-sm hover:bg-gray-50 transition text-gray-500 hover:text-indigo-600 disabled:opacity-50">
          <ArrowDownUp className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 bg-gray-50 rounded-xl mt-1 mb-4 border border-gray-100 focus-within:border-indigo-300 focus-within:ring-1 focus-within:ring-indigo-300 transition mx-2">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">You receive</span>
          <span className="text-sm text-gray-500">Balance: 0.0 USDC</span>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="0.0"
            className="w-full bg-transparent text-3xl font-medium outline-none text-gray-900 placeholder-gray-300"
            value={amountOut}
            readOnly
          />
          <button className="flex items-center gap-1 bg-indigo-600 text-white border border-transparent shadow-sm px-3 py-1.5 rounded-full font-semibold hover:bg-indigo-700 transition min-w-max">
            <div className="w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-1">
              <span className="text-[10px] text-white">$</span>
            </div>
            USDC
            <ChevronDown className="w-4 h-4 text-white opacity-80" />
          </button>
        </div>
      </div>

      <div className="px-2 pb-2">
      {!isConnected ? (
        <Button size="lg" fullWidth onClick={connect} className="py-4 text-lg">
          Connect Wallet
        </Button>
      ) : (
        <Button 
          size="lg" 
          fullWidth 
          onClick={handleSwap} 
          disabled={!amountIn || Number(amountIn) <= 0}
          className="py-4 text-lg"
        >
          {amountIn ? 'Swap' : 'Enter an amount'}
        </Button>
      )}
      </div>
    </Card>
  );
}
