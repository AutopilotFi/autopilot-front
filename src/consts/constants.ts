import { AutopilotAsset } from '@/types/globalAppTypes';

export const HARVEST_VAULT_API_URL =
  `${process.env.NEXT_PUBLIC_HARVEST_API}/vaults?key=${process.env.NEXT_PUBLIC_HARVEST_API_KEY}` ||
  '';
export const IPOR_API_URL = 'https://api.ipor.io';

export const MAINNET_URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`;
export const MATIC_URL = `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`;
export const BASE_URL = `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`;
export const ARBITRUM_URL = `https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`;
export const ZKSYNC_URL = `https://zksync-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`;

export const GRAPH_URLS = {
  1: process.env.NEXT_PUBLIC_GRAPH_URL_MAINNET || 'https://monkfish-app-mhcjl.ondigitalocean.app/1',
  137:
    process.env.NEXT_PUBLIC_GRAPH_URL_POLYGON ||
    'https://monkfish-app-mhcjl.ondigitalocean.app/137',
  324:
    process.env.NEXT_PUBLIC_GRAPH_URL_ZKSYNC || 'https://monkfish-app-mhcjl.ondigitalocean.app/324',
  8453:
    process.env.NEXT_PUBLIC_GRAPH_URL_BASE || 'https://monkfish-app-mhcjl.ondigitalocean.app/8453',
  42161:
    process.env.NEXT_PUBLIC_GRAPH_URL_ARBITRUM ||
    'https://monkfish-app-mhcjl.ondigitalocean.app/42161',
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

export const ETHERSCAN_URL = 'https://etherscan.io';
export const MATICSCAN_URL = 'https://polygonscan.com';
export const BASESCAN_URL = 'https://basescan.org';
export const ARBISCAN_URL = 'https://arbiscan.io';
export const ZKSYNCSCAN_URL = 'https://explorer.zksync.io/';

export const DEFILLAMA_POOLS_URL = 'https://yields.llama.fi/pools';

export const morphoVaultMap = {
  morpho_COE_USDC: '0x1D3b1Cd0a0f242d598834b3F2d126dC6bd774657',
  morpho_SHP_USDC: '0xBEEFE94c8aD530842bfE7d8B397938fFc1cb83b2',
  morphoSPK_USDC: '0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A',
  morphoGC_USDC: '0xc0c5689e6f4D256E861F65465b691aeEcC0dEb12',
  morpho_CHY_USDC: '0xE74c499fA461AF1844fCa84204490877787cED56',
  morpho_SHHY_USDC: '0xBEEFA7B88064FeEF0cEe02AAeBBd95D30df3878F',
  morphoMW_USDC: '0xc1256Ae5FF1cf2719D4937adb3bbCCab2E00A2Ca',
  morphoRE7_USDC: '0x12AFDeFb2237a5963e7BAb3e2D46ad0eee70406e',
  morphoSE_USDC: '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738',
  morpho_SmH_USDC: '0xBeeFa74640a5f7c28966cbA82466EED5609444E0',
  morpho_AR_USDC: '0xcdDCDd18A16ED441F6CB10c3909e5e7ec2B9e8f3',
  morphoSH_USDC: '0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183',
  morpho_EF_USDC: '0x23479229e52Ab6aaD312D0B03DF9F33B46753B5e',
  morpho_YOG_USDC: '0xef417a2512C5a41f69AE4e021648b69a7CdE5D03',
  morpho_UN_USDC: '0xB7890CEE6CF4792cdCC13489D36D9d42726ab863',
  morpho_GF_USDC: '0x236919F11ff9eA9550A4287696C2FC9e18E6e890',
  morphoGP_USDC: '0xeE8F4eC5672F09119b96Ab6fB59C27E1b7e44b61',
};

export const morphoTempDisabled: AutopilotAsset[] = ['WETH', 'cbBTC', 'ETH'];
