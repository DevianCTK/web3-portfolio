// ── Centralized Mock Data Store ──
// Single source of truth for all mock data across the app.

export interface Token {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  isPositive: boolean;
  mcap: string;
  icon: string;
  balance: number;
  rank?: string;
  type?: string;
}

export interface Transaction {
  id: string;
  date: string;
  time: string;
  action: 'receive' | 'send' | 'swap';
  asset: string;
  assetSub?: string; // e.g. "BNB → USDC"
  amount: string;
  amountSign: '+' | '-' | '';
  fiat: string;
  status: 'completed' | 'pending' | 'failed';
  icon: string; // material icon name
  iconColor: string; // CSS class for icon bg
}

export interface CoinStats {
  marketCap: string;
  volume: string;
  supply: string;
  ath: string;
  atl: string;
}

export interface CoinDetail {
  name: string;
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
  mcap: string;
  rank: string;
  type: string;
  icon: string;
  balance: string;
  balanceFiat: string;
  description: string;
  stats: CoinStats;
}

// ─────────────────── TOKENS ───────────────────

export const TOKENS: Record<string, Token> = {
  ethereum: {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2482.15,
    change: 4.21,
    isPositive: true,
    mcap: '$298.4B',
    balance: 12.45,
    rank: '#2',
    type: 'ERC-20',
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpyoja6cLvIu2ftlThaeoTDoLjAP9ASGeNjS2eZkfxR6ax-E-2M9vHqwo6i0hrFPsced1LeX2KcQewnhBKOodHRQqlEGMZ3B7-_285vNNHzrHdr3741HyNoskfRSTBHnTcQHcr9K0t7A0bow__npFFIzeNEo2ncY1mjGUEuXMHMX5k2iI1Sp90RR0LjofNDe-QDEmCfYhVYkulHFV7GwKBSox14aaiVXS7PuxTpWIHf8mpIXQp8axp9FlkdUwHIRI0A3fepXcYoro',
  },
  solana: {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    price: 164.55,
    change: 1.45,
    isPositive: false,
    mcap: '$45.2B',
    balance: 42.12,
    rank: '#5',
    type: 'SOL',
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDd5FHfA4Y8dSf-wF9752-3aKWgd9EHPFLDUFj738qe92gLaUq88grVuyb_y9JqQJhSeiuOdxraLEHlLTYsB5R7i9yZBzs8znG811-0grnilv4Y3hvmlb80kDlRzY6jlWxt7JoT70Obw5AzI7u8kFlphYH9-7DU18hIqwdMSNrKjAUwqyzOgA_BWUhfs9PzfBdwK0lDpKKRHM5nNM5OKZix2rQPmcE2x9sJnQDrZO-Jki7O5ibPraLIJmthPs3j7c1tlG_rUFoDrpc',
  },
  arbitrum: {
    id: 'arbitrum',
    symbol: 'ARB',
    name: 'Arbitrum',
    price: 1.88,
    change: 12.8,
    isPositive: true,
    mcap: '$2.4B',
    balance: 500.0,
    rank: '#42',
    type: 'L2',
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSe587TFd77-Y6YccfqtQKEc3VLOv99vjxymaybPZfPUZUfZdpBir8Sj2IDOboAXczYG2JdUM9YQ7tdKr4YJj2g0IqqFKpQ-OSByj9YltruSlZYCRcrFsndaET0v1ME_rm4gxUWCeMhnpiKpfAALpvAm5AHKzYg-PoapRexuh2gwd5bMAm4EYjfECZ3DL7AJdqotZKe0Z44EEBC6hs7j0hK-5rvdyWwaLvk4WhZ-eMiZFy5fzEGaylZBH0_3xvOacdumby35p7fc4',
  },
  chainlink: {
    id: 'chainlink',
    symbol: 'LINK',
    name: 'Chainlink',
    price: 18.42,
    change: 0.92,
    isPositive: false,
    mcap: '$10.8B',
    balance: 25.0,
    rank: '#14',
    type: 'ERC-20',
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK5bEEPqpyUpKdk2yUHBEQBelWXwSzAevKPxoOnNMNiPJv3ZOkFERrIwXuAWuqJ7c81CRshRTxdHDRGB4iyEDjIT2LH3YfSg98tRrfeIutIl-6FR4uc9CaL10lAYVM0ta5SPD37kBINhdDmSa4y3aoNnwlSRt3rrVdhcAXc--i9Qy6HNtXP8Io9R_iix898SvK94oa2uea9TXSb8vw6-IcQPVzYSn7Al8D6ZlTMeiAgUD0oPXcmkI2_zG4b_8c7kTvQ6wYaaYXTIo',
  },
  polygon: {
    id: 'polygon',
    symbol: 'MATIC',
    name: 'Polygon',
    price: 0.812,
    change: 3.14,
    isPositive: true,
    mcap: '$7.9B',
    balance: 1200.0,
    rank: '#18',
    type: 'MATIC',
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdSj2BsXYVZgNWP2BdAjdJwQxTzGk1B3XTju-izVFfXJu0Hfw2HvnZYt2k_Wx6qNADoyidX6iVBIorjofFxncRMJu-U0iECFqsMSI7-OlGFxtIusu9DHlzZutiV8iKsBx7CYijXB_IOdaQvmJN4c3D9yDzflvZ3j1aV4rEB6vx1Ph1NqwWcNPy2Z2fJSidwANEC5iUr7ebJa6mldWxOiKJAS3CEX6nlaM_ClaIhnslF27DGZH8OGGThCP6yfUPQHrMzgdYOG6uWIk',
  },
};

// Convenience arrays
export const TOKEN_LIST = Object.values(TOKENS);

// Swap pair shortcuts
export const SWAP_TOKENS = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    price: TOKENS.ethereum.price,
    balance: TOKENS.ethereum.balance,
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdUoHGeG2HAho_kJujKJxcac-WaOyB6MICdgoECPefp0GMSlVJQheMYNAiYKJxX0H83ztsOL-qq8htXU4yAPXmuv9SIHhEWd70eE60i57-ndc-YZ-Zs43WlV2MaFx1ua2GJtBWbAIalq1RtlxJtGAyC_jmtm4r-SQghN0Txj_fMegjPmVgYiAuwAezEOfBOu_Cv2QjmxPccTW4AqpJOsOMHKzCs9KBeuDg0vzz07Igm_aqY7hE28RoWspE_G1DDOZkccaMqN4sd8k',
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    price: 1.0,
    balance: 5501.34,
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqbU2JDSCb1ddKRPLJl3ZFS5SGeI9u6u5IURc8FWHs_dD_QaGvuNoQjF92nhndy7bjc3ts7e_eOkosVpjdOTDRyEoYLonvXMhYv5jnMc1LGKi9b-1WisXnGYQcXtpi0xLPQK5BKmvYru4eDMycBKNWOr2gmYNKnB1wYptUMZCgMLo65WZZjANB_xMg15D6hG7rTO_OPxB2_LKNdJhccrVOKMB7-g5-G0tfcFB8KW5K3TdFikeTWxr3J38UKz8YWetQf4mq_-I0B7U',
  },
};

// ─────────────────── PORTFOLIO ───────────────────

export const PORTFOLIO_ASSETS = [
  {
    id: 'btc',
    name: 'Bitcoin',
    ticker: 'BTC',
    priceLabel: '$68,421.10',
    balance: '1.4285',
    value: '$97,749.54',
    change: '+2.45%',
    isPositive: true,
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCb6S7eJTzRYqtG1tbBOBOdQJm94x3CxsawkQOc1SFZ1v2dEtozvU-6bzpObC9z6sphB3YeL7Ye7kt02WS-zDvNamxXn-DCow13E5LM4MjkUOT_sKhcls7eBp6OzU05Y84h7mGtHXi2Ypbk93Qw6zAp_84tT8xCyWIiqotOG0_4PQgtsJ0ZxrSDe8lmH4m51gR_L92uK7x3cjKUjetZf4NkLHkqR2mwUZk5cMgnxvWtFANmDVfYr5q51uZjkEtPn9Hq-20T3vbKk-A',
  },
  {
    id: 'eth',
    name: 'Ethereum',
    ticker: 'ETH',
    priceLabel: '$3,842.20',
    balance: '8.5000',
    value: '$32,658.70',
    change: '-0.82%',
    isPositive: false,
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH1dkv2O57w9jnSpIEZOJ0aqQM9RThoJkKqmkdEkJDthS5eW2sCiCenDEiB9emu0xmTyK4N4PudsKycecXluzF4eDzQAw6e9aKibNkggAgB0C7BtZeyFWS0DMUmz8tmiXUPlZSVVcAeADVfd2ogs1wTGu1dojpC6wTxGVgQ_7Qvh4CHhAGiNJtUoJGu9iBTNAeIEfGPiY0467JmU1My96g9Qd7TXQ4pQFcUM52xyy76ado0UY28uCMkgJSokvjGTf1iuO0OhCW7Fw',
  },
  {
    id: 'sol',
    name: 'Solana',
    ticker: 'SOL',
    priceLabel: '$164.55',
    balance: '42.1200',
    value: '$6,930.84',
    change: '+12.10%',
    isPositive: true,
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDfei97DqgcrjfSPZSKydItsRpeq5qT9sp63Cjvd_tuA1aewi1jrnNSx_2oLoeClmdRceKdBppcgaW-rmomKqS2T9kitsWtsVEf4JQOGOGYVmrjq8I2lET8gLcfvHjdDxSDb-N-hqS5JvUUCWjY0yEyzix2PG_0SJB9IdmRhSj3FWzmo630zdDePdcNN3xBs49l7NYDB0TZfkEURU0xuDeZXfdds2f6mFd_F_wAJu3o-HyRfNrFC2b91mxhuv3NqEpsATJAZRGKpc',
  },
  {
    id: 'usdc',
    name: 'USD Coin',
    ticker: 'USDC',
    priceLabel: '$1.00',
    balance: '5,501.34',
    value: '$5,501.34',
    change: '0.00%',
    isPositive: true,
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3NLOTolHeOkZQ-thvtSwkSGYol2ShP91qHc0o7_n_LdesMdZ2qwN3xVjOO5Y3HsZvANs64wKr6-h0NjfEmw60sOnPyq8g1bS8wDq5qcngeiB2fXgz3RkFYwk5z0Ngnq0tXCTVZ2BmPL1zuvOhr37Nv64mQtv2uOIKnx0hlrMi6d-hsqiULN8YXNwMug56VycLYFkYlRwX-KpUpuiWZcMuGrEPvwjnImFex-PF7KOysrOQD971JPhaJdXLXkWTmcucG0S9Kpx-s-U',
  },
];

// ─────────────────── TRANSACTIONS ───────────────────

export const TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    date: 'Oct 24, 2023',
    time: '14:22:10 PM',
    action: 'receive',
    asset: 'Ethereum (ETH)',
    amount: '+1.450 ETH',
    amountSign: '+',
    fiat: '≈ $2,642.12',
    status: 'completed',
    icon: 'south_west',
    iconColor: 'eth',
  },
  {
    id: 'tx-2',
    date: 'Oct 23, 2023',
    time: '09:45:02 AM',
    action: 'swap',
    asset: 'BNB → USDC',
    amount: '500.00 USDC',
    amountSign: '',
    fiat: 'Gas: $4.12',
    status: 'pending',
    icon: 'sync_alt',
    iconColor: 'swap',
  },
  {
    id: 'tx-3',
    date: 'Oct 21, 2023',
    time: '22:15:54 PM',
    action: 'send',
    asset: 'Bitcoin (BTC)',
    amount: '-0.042 BTC',
    amountSign: '-',
    fiat: '≈ $1,440.00',
    status: 'failed',
    icon: 'north_east',
    iconColor: 'btc',
  },
  {
    id: 'tx-4',
    date: 'Oct 19, 2023',
    time: '11:04:12 AM',
    action: 'receive',
    asset: 'Arbitrum (ARB)',
    amount: '+2,500 ARB',
    amountSign: '+',
    fiat: '≈ $2,125.00',
    status: 'completed',
    icon: 'south_west',
    iconColor: 'arb',
  },
];

// ─────────────────── COIN DETAIL ───────────────────

export const COIN_DETAILS: Record<string, CoinDetail> = {
  ethereum: {
    name: 'Ethereum',
    symbol: 'ETH',
    price: '$2,451.28',
    change: '4.2%',
    isPositive: true,
    mcap: '$294.5B',
    rank: '#2',
    type: 'ERC-20',
    icon: TOKENS.ethereum.icon,
    balance: '12.45 ETH',
    balanceFiat: '≈ $30,518.43',
    description: 'Ethereum is a decentralized, open-source blockchain with smart contract functionality. Conceived in 2013 by Vitalik Buterin, it went live in 2015 and enables anyone to deploy decentralized applications.',
    stats: {
      marketCap: '$294,510,284,192',
      volume: '$15,204,912,855',
      supply: '120,240,112 ETH',
      ath: '$4,891.70',
      atl: '$0.42',
    },
  },
  solana: {
    name: 'Solana',
    symbol: 'SOL',
    price: '$104.92',
    change: '1.45%',
    isPositive: false,
    mcap: '$45.2B',
    rank: '#5',
    type: 'SOL',
    icon: TOKENS.solana.icon,
    balance: '150.00 SOL',
    balanceFiat: '≈ $15,738.00',
    description: 'Solana is a high-performance blockchain known for its speed and low transaction costs. It uses a unique Proof of History consensus mechanism to process thousands of transactions per second.',
    stats: {
      marketCap: '$45,210,000,000',
      volume: '$2,104,000,000',
      supply: '440,000,000 SOL',
      ath: '$260.06',
      atl: '$0.50',
    },
  },
  arbitrum: {
    name: 'Arbitrum',
    symbol: 'ARB',
    price: '$1.88',
    change: '12.8%',
    isPositive: true,
    mcap: '$2.4B',
    rank: '#42',
    type: 'L2',
    icon: TOKENS.arbitrum.icon,
    balance: '500.00 ARB',
    balanceFiat: '≈ $940.00',
    description: 'Arbitrum is a Layer 2 scaling solution for Ethereum using optimistic rollups to batch transactions off-chain, reducing costs and increasing throughput while inheriting Ethereum\'s security.',
    stats: {
      marketCap: '$2,400,000,000',
      volume: '$450,000,000',
      supply: '1,275,000,000 ARB',
      ath: '$2.40',
      atl: '$0.75',
    },
  },
  chainlink: {
    name: 'Chainlink',
    symbol: 'LINK',
    price: '$18.42',
    change: '0.92%',
    isPositive: false,
    mcap: '$10.8B',
    rank: '#14',
    type: 'ERC-20',
    icon: TOKENS.chainlink.icon,
    balance: '25.00 LINK',
    balanceFiat: '≈ $460.50',
    description: 'Chainlink is a decentralized oracle network that provides real-world data to smart contracts on the blockchain. LINK is the native token used to pay for services within the Chainlink ecosystem.',
    stats: {
      marketCap: '$10,800,000,000',
      volume: '$580,000,000',
      supply: '587,000,000 LINK',
      ath: '$52.88',
      atl: '$0.12',
    },
  },
  polygon: {
    name: 'Polygon',
    symbol: 'MATIC',
    price: '$0.812',
    change: '3.14%',
    isPositive: true,
    mcap: '$7.9B',
    rank: '#18',
    type: 'MATIC',
    icon: TOKENS.polygon.icon,
    balance: '1200.00 MATIC',
    balanceFiat: '≈ $974.40',
    description: 'Polygon is a Layer 2 scaling solution for Ethereum, providing faster and cheaper transactions. It aims to create a multi-chain blockchain ecosystem fully compatible with Ethereum.',
    stats: {
      marketCap: '$7,900,000,000',
      volume: '$320,000,000',
      supply: '9,700,000,000 MATIC',
      ath: '$2.92',
      atl: '$0.003',
    },
  },
};
