import { Dispatch, SetStateAction } from 'react';

export type AutopilotProtocol = 'morpho' | 'euler';
export type AutopilotAsset = 'USDC' | 'WETH' | 'cbBTC' | 'ETH';
export type UserState = 'new' | 'active' | 'old';

export type VaultHistoryEntry = {
  timestamp: number;
  sharePrice?: string | number | null;
  tvl?: string | number | null;
  apy?: string | number | null;
  value?: string | number | null;
};

export type ProjectKey = `${AutopilotProtocol}-${AutopilotAsset}`;

export interface AutopilotProduct {
  protocol: AutopilotProtocol;
  asset: AutopilotAsset;
}

export type User = {
  status: UserState;
};

export type GlobalData = {
  user: User;
  availableAutopilots: SideBarOption[];
  isMobile?: boolean;
  isDarkMode?: boolean;
  setIsDarkMode?: Dispatch<SetStateAction<boolean | undefined>>;
};

export type SideBarOptions = {
  name: string;
  icon: string;
  options: SideBarOption[];
}[];

export type SideBarOption = {
  asset: AutopilotAsset;
  protocol: AutopilotProtocol;
  apy: number;
  icon: string;
  showDecimals: number;
  vault: FullVaultData;
};

export type Portfolio = {
  protocol: AutopilotProtocol;
  asset: AutopilotAsset;
  showDecimals: number;
  balance: number;
  usdValue: number;
  earnings: number;
  earningsUsd: number;
  apy: number;
  secondBestAPY: number;
  status: string;
  chainName: string;
  vaultAddress: string;
};

export type PortfolioData = Portfolio[];

export type Earnings = {
  asset: AutopilotAsset;
  protocol: AutopilotProtocol;
  amount: number;
  value: number;
  time: number;
  chainName: string;
  type?: 'interest' | 'compound' | 'reward';
  txHash?: string;
  blockNumber?: number;
}[];

export type AllUserStats = {
  [userStatus: string]: {
    [project: string]: UserStats;
  };
};

export type ProjectData = {
  name: string;
  protocol: AutopilotProtocol;
  asset: AutopilotAsset;
  showDecimals: number;
  icon: string;
  assetIcon: string;
  currentAPY: number;
  secondBestAPY: number;
  currentEarnings: number;
  autopilotBalance: number;
  walletBalance: number;
  monthlyForecast: number;
  tvl: string;
  totalBalance: string;
  tokenAddress: string;
  vaultAddress: string;
  tokenDecimals: string;
  vaultDecimals: string;
  chainId: number;
  apy7d: number;
  apy30d: number;
  initialSharePrice: number;
  latestSharePrice: number;
  frequency: string;
  latestUpdate: string;
  operatingSince: string;
  allocations?: { name: string; apy: number; amount: number; allocation: number }[];
  recentEarnings: Earnings;
  benchmarkData: BenchmarkData[];
  uniqueVaultHData: VaultHistoryEntry[];
};

export type BenchmarkData = {
  name: string;
  description: string;
  apy: number;
  apy30dMean?: number;
  amount?: number;
  allocation?: number;
  isAutopilot?: boolean;
  hVaultAddress: string;
  mVaultAddress?: string;
};

export type VaultOnlyData = {
  name: string;
  asset: string;
  icon: string;
  assetIcon: string;
  currentAPY: number;
  apy7d: number;
  apy30d: number;
  initialSharePrice: number;
  latestSharePrice: number;
  secondBestAPY: number;
  tvl: string;
  totalBalance: string;
  tokenAddress: string;
  vaultAddress: string;
  tokenDecimals: string;
  vaultDecimals: string;
  showDecimals: number;
  benchmarkData: BenchmarkData[];
  plasmaHistory?: VaultHistoryData[];
};

export type UserRelatedData = {
  name: string;
  asset: string;
  currentEarnings: number;
  autopilotBalance: number;
  walletBalance: number;
  monthlyForecast: number;
  recentEarnings: { time: string; amount: number; amountUsd: number }[];
};

export type ProjectsData = {
  [key: string]: ProjectData;
};

export type UserGeneralStats = {
  totalBalance: string;
  totalEarnings: string;
  monthlyForecast: string;
  updateFrequency: string;
};
export type UserEarningStats = {
  monthlyEarnings: string;
  dailyEarnings: string;
};

export type HistoryStats = {
  totalDeposits: string;
  totalWithdrawals: string;
  totalActions: string;
  transactions: {
    date: string;
    type: string;
    amount: number;
    txHash?: string;
    status: string;
  }[];
};

export type UserTransaction = {
  date: string;
  type: string;
  amount: number;
  txHash?: string;
  status: string;
};

export type UserStats = {
  totalBalance: string;
  totalEarnings: string;
  monthlyForecast: string;
  updateFrequency: string;
  monthlyEarnings: string;
  dailyEarnings: string;
  totalDeposits: string;
  totalWithdrawals: string;
  totalActions: string;
  transactions: UserTransaction[];
};

export type UserStatsGrid = {
  label: string;
  value: string;
  asset?: string;
  tooltipText?: string;
  hideAsseticon?: boolean;
};

export type TimeFrame = '7d' | '1m' | 'all';

export interface VaultData {
  chain: string;
  id: string;
  isIPORVault: boolean;
  apyIconUrls: string[];
  apyTokenSymbols: string[];
  logoUrl: string[];
  tokenNames: string[];
  platform: string[];
  tags: string[];
  tokenAddress: string;
  decimals: string;
  vaultAddress: string;
  vaultDecimals: string;
  pricePerFullShare: string;
  estimatedApy: string;
  estimatedApyBreakdown: number[];
  usdPrice: string;
  totalSupply: string;
  totalValueLocked: string;
  vaultSymbol: string;
  allocPointData?: {
    hVaultId: string;
    allocPoint: string;
    apy: string;
    hVaultAddress: string;
  }[];
  inactive: boolean;
}

export interface NetworkVaults {
  [vaultName: string]: VaultData;
}

export interface VaultApiResponse {
  updatedAt: {
    apiData: string;
    lastUpdated: string;
  };
  eth: NetworkVaults;
  matic: NetworkVaults;
  arbitrum: NetworkVaults;
  base: NetworkVaults;
  zksync: NetworkVaults;
}

export interface VaultHistoryData {
  blockNumber: number;
  blockTimestamp: string;
  totalBalance: string;
  tvl: string;
  marketBalances: MarketBalance[];
  dexPositionBalances: DexPositionBalance[];
  apr: string;
  apy: string;
  apr1d: string | null;
  rewardsApr: string;
  rewardsApy: string;
  assetsToSharesRatio: string;
}

export interface MarketBalance {
  protocol: string | null;
  marketId: string | null;
  balanceType: string;
  balance: string;
  balanceUsd: string;
}

export interface DexPositionBalance {
  [key: string]: string | number | null;
}

export interface FullVaultData extends VaultData {
  plasmaHistory?: VaultHistoryData[] | [];
}

export interface VaultContextData {
  baseVaultData: Array<FullVaultData>;
  iporVaultData: Array<FullVaultData>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export type Allocations = {
  [x: string]: BenchmarkData[] | undefined;
};

// Ethereum window object type declaration
declare global {
  // Minimal typing for the injected provider
  interface Window {
    ethereum?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}
