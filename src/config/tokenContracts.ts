// Known ERC-20 token contracts and metadata used for on-chain balance lookups.
// Only a small, safe set of well-known mainnet contracts are included to avoid
// requiring API keys. Add or adjust addresses as needed per target chain.

export interface TokenContractInfo {
    symbol: string;
    address: `0x${string}`;
    decimals: number;
    id?: string; // optional internal id matching TOKENS
}

export const TOKEN_CONTRACTS: Record<string, TokenContractInfo> = {
    USDC: {
        symbol: 'USDC',
        // USDC (Mainnet)
        address: '0xA0b86991c6218b36c1d19D4a2e9EB0cE3606eB48',
        decimals: 6,
        id: 'usdc',
    },
    LINK: {
        symbol: 'LINK',
        // Chainlink (Mainnet)
        address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
        decimals: 18,
        id: 'chainlink',
    },
    ARB: {
        symbol: 'ARB',
        // Arbitrum token (Mainnet)
        address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
        decimals: 18,
        id: 'arbitrum',
    },
};

export const ERC20_ABI: readonly unknown[] = [
    {
        constant: true,
        inputs: [{ name: 'owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        type: 'function',
    },
];
