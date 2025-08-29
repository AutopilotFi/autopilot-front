export const HARVEST_VAULT_API_URL = `${process.env.NEXT_PUBLIC_HARVEST_API}/vaults?key=${process.env.NEXT_PUBLIC_HARVEST_API_KEY}` || '';
export const IPOR_API_URL = 'https://api.ipor.io';

export const MAINNET_URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`;
export const MATIC_URL = `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`;
export const BASE_URL = `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`;
export const ARBITRUM_URL = `https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`;
export const ZKSYNC_URL = `https://zksync-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`;

export const GRAPH_URLS = {
  1: process.env.NEXT_PUBLIC_GRAPH_URL_MAINNET || 'https://monkfish-app-mhcjl.ondigitalocean.app/1',
  137: process.env.NEXT_PUBLIC_GRAPH_URL_POLYGON || 'https://monkfish-app-mhcjl.ondigitalocean.app/137',
  324: process.env.NEXT_PUBLIC_GRAPH_URL_ZKSYNC || 'https://monkfish-app-mhcjl.ondigitalocean.app/324',
  8453: process.env.NEXT_PUBLIC_GRAPH_URL_BASE || 'https://monkfish-app-mhcjl.ondigitalocean.app/8453',
  42161: process.env.NEXT_PUBLIC_GRAPH_URL_ARBITRUM || 'https://monkfish-app-mhcjl.ondigitalocean.app/42161',
} as const;

export const CHAIN_IDS = {
  MAINNET: 1,
  BASE: 8453,
  ARBITRUM: 42161,
  POLYGON: 137,
  ZKSYNC: 324,
} as const;

export const CHAIN_NAMES = {
  1: 'Ethereum',
  8453: 'Base',
  42161: 'Arbitrum',
  137: 'Polygon',
  324: 'zkSync Era',
} as const;

export const ETHERSCAN_URL = 'https://etherscan.io'
export const MATICSCAN_URL = 'https://polygonscan.com'
export const BASESCAN_URL = 'https://basescan.org'
export const ARBISCAN_URL = 'https://arbiscan.io'
export const ZKSYNCSCAN_URL = 'https://explorer.zksync.io/'

export const DEFILLAMA_POOLS_URL = 'https://yields.llama.fi/pools'