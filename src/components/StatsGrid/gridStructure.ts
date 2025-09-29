import { ProjectData, UserStats, UserStatsGrid } from '@/types/globalAppTypes';
import { formatBalance } from '@/helpers/utils';

export const generateOverviewGridStructure = (
  currentProjectData: ProjectData,
  userStats: UserStats
): UserStatsGrid[] => [
  {
    label: 'Total Balance',
    value: formatBalance(Number(userStats.totalBalance), currentProjectData.asset, undefined, true),
    asset: currentProjectData.asset,
  },
  {
    label: 'Total Earnings',
    value: formatBalance(
      Number(userStats.totalEarnings),
      currentProjectData.asset,
      undefined,
      true
    ),
    asset: currentProjectData?.asset,
  },
  {
    label: 'Monthly Forecast',
    value: formatBalance(
      Number(userStats.monthlyForecast),
      currentProjectData.asset,
      undefined,
      true
    ),
    asset: currentProjectData?.asset,
  },
  {
    label: 'Update Frequency',
    value: `${userStats.updateFrequency !== '—' ? '~' : ''}${userStats.updateFrequency}`,
    tooltipText:
      'This is an approximation based on historical data, when the Autopilot will harvest the earned yield and distribute it to your account.',
  },
];

export const generateEarningsGridStructure = (
  currentProjectData: ProjectData,
  userStats: UserStats
): UserStatsGrid[] => [
  {
    label: 'Total Earnings',
    value: formatBalance(
      Number(userStats.totalEarnings),
      currentProjectData.asset,
      undefined,
      true
    ),
    asset: currentProjectData.asset,
  },
  {
    label: '30D Earnings',
    value: formatBalance(
      Number(userStats.monthlyEarnings),
      currentProjectData.asset,
      undefined,
      true
    ),
    asset: currentProjectData.asset,
  },
  {
    label: '24H Earnings',
    value: formatBalance(
      Number(userStats.dailyEarnings),
      currentProjectData.asset,
      undefined,
      true
    ),
    asset: currentProjectData.asset,
  },
  {
    label: 'Update Frequency',
    value: `${userStats.updateFrequency !== '—' ? '~' : ''}${userStats.updateFrequency}`,
    tooltipText:
      'This is an approximation based on historical data, when the Autopilot will harvest the earned yield and distribute it to your account.',
  },
];

export const generateHistoryGridStructure = (
  currentProjectData: ProjectData,
  userStats: UserStats
): UserStatsGrid[] => [
  {
    label: 'Total Deposits',
    value: formatBalance(
      Number(userStats.totalDeposits),
      currentProjectData.asset,
      undefined,
      true
    ),
    asset: currentProjectData.asset,
  },
  {
    label: 'Total Withdrawals',
    value: formatBalance(
      Number(userStats.totalWithdrawals),
      currentProjectData.asset,
      undefined,
      true
    ),
    asset: currentProjectData.asset,
  },
  {
    label: 'Total Actions',
    value: userStats?.transactions?.length.toString(),
  },
];

export const generateDetailsGridStructure = (enrichedProjectData: ProjectData): UserStatsGrid[] => [
  {
    label: '7d APY',
    value: enrichedProjectData.apy7d.toString(),
    asset: '%',
    hideAsseticon: true,
  },
  {
    label: '30d APY',
    value: enrichedProjectData.apy30d.toString(),
    asset: '%',
    hideAsseticon: true,
  },
  {
    label: 'TVL',
    value: enrichedProjectData.tvl,
  },
];

export const generatePortfolioGridStructure = (
  totalValue: number,
  totalEarnings: number,
  annualEarningsFromAPY: number
): UserStatsGrid[] => [
  {
    label: 'Total Portfolio Value',
    value: formatBalance(totalValue, 'USD', 2, true),
    asset: 'USD',
    hideAsseticon: true,
  },
  {
    label: 'All-Time Earnings',
    value: formatBalance(totalEarnings, 'USD', 2, true),
    asset: 'USD',
    hideAsseticon: true,
  },
  {
    label: 'Est. Annual Earnings',
    value: formatBalance(Math.round(annualEarningsFromAPY), 'USD', 2, true),
    asset: 'USD',
    hideAsseticon: true,
  },
];
