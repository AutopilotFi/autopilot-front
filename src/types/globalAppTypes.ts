export type AutopilotProtocol = 'morpho' | 'euler';
export type AutopilotAsset = 'USDC' | 'ETH' | 'cbBTC';
export type UserState = 'new' | 'active' | 'old';

export interface AutopilotProduct {
  protocol: AutopilotProtocol;
  asset: AutopilotAsset;
}

export type User = {
    status: UserState
}

export type GlobalData = {
    user: User,
    availableAutopilots: SideBarOption[]
}

export type SideBarOption = {
    asset: AutopilotAsset,
    protocol: AutopilotProtocol,
    apy: number,
    icon: string,
    enabled?: boolean
}

export type PortfolioData = {
    protocol: AutopilotProtocol,
    asset: AutopilotAsset,
    balance: number,
    usdValue: number,
    earnings: number,
    earningsUsd: number,
    apy: number,
    status: string
}[]

export type LatestEarningData = {
    asset: AutopilotAsset,
    protocol: AutopilotProtocol,
    amount: number,
    value: number,
    time: string,
    icon: string
}[]

export type EarningTransaction = {
  id: string;
  asset: AutopilotAsset;
  protocol: 'morpho' | 'euler';
  amount: number;
  usdValue: number;
  timestamp: Date;
  type: 'interest' | 'compound' | 'reward';
  txHash: string;
  blockNumber: number;
}

export type AllUserStats = {
    [userStatus: string]: {
        [project: string]: UserStats
    }
}

export type ProjectData = {
        name: string,
        asset: string,
        icon: string,
        assetIcon: string,
        currentAPY: number,
        secondBestAPY: number,
        currentEarnings: number,
        autopilotBalance: number,
        walletBalance: number,
        monthlyForecast: number,
        weeklyApy: number,
        monthlyApy: number,
        tvl: string,
        allocations: { name: string, apy: number, amount: number, allocation: number }[],
        recentEarnings: { time: string, amount: number, type: string }[],
        benchmarkData: BenchmarkData[],
        yieldSources: {
            name: string,
            address: string
        }[]
}

export type BenchmarkData = {
    name: string,
    description: string,
    apy: number,
    isAutopilot?: boolean
}

export type ProjectsData = {
    [key: string]: ProjectData
}

export type UserGeneralStats = {
    totalBalance: string,
    totalEarnings: string,
    monthlyForecast: string,
    updateFrequency: string,
}
export type UserEarningStats = {
    monthlyEarnings: string,
    dailyEarnings: string
}

export type HistoryStats = {
    totalDeposits: string,
    totalWithdrawals: string,
    totalActions: string,
    transactions: {
        date: string,
        type: string,
        amount: number,
        txHash: string,
        status: string
    }[]
}

export type UserStats = {
    totalBalance: string,
    totalEarnings: string,
    monthlyForecast: string,
    updateFrequency: string,
    monthlyEarnings: string,
    dailyEarnings: string,
    totalDeposits: string,
    totalWithdrawals: string,
    totalActions: string,
    transactions: {
        date: string,
        type: string,
        amount: number,
        txHash: string,
        status: string
    }[]
}

export type UserStatsGrid = {
    label: string,
    unit: string,
    valueKey: keyof UserStats
    tooltip?: string,
    hasTooltip?: boolean,
    tooltipText?: string,
    latestUpdate?: string
}

export type TimeFrame = "7d" | "1m" | "all";