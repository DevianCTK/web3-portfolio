export const checkMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && !!(window as any).ethereum;
};

export const MOCK_WALLET = {
  address: '0x1234567890abcdef1234567890abcdef1234abcd',
  balance: '12.45 ETH',
};
