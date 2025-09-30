'use client';
import {
  TrendingUp,
  BarChart3,
  Wallet,
  History,
  Info,
  CircleQuestionMark,
  PieChart,
  LucideProps,
} from 'lucide-react';
import {
  useState,
  useEffect,
  useContext,
  ForwardRefExoticComponent,
  RefAttributes,
  useCallback,
} from 'react';
import { GlobalContext } from '@/providers/GlobalDataProvider';
import { ProjectData, UserStats } from '@/types/globalAppTypes';
import { TooltipProvider } from '../UI/Tooltip';
import TermsModal from '../UI/TermsModal';
import Details from './Details';
import Overview from './Overview';
import Earnings from './Earnings';
import HistoryTab from './History';
import Deposit from './Deposit';
import Benchmark from './Benchmark';
import Faq from './Faq';
import Image from 'next/image';
import { useVaultMetrics } from '@/providers/VaultMetricsProvider';
import Allocations from './Allocations';
import NavigationTabs from './NavigationTabs';
import { getChainNameFromId } from '@/helpers/utils';
import { ApyBadgeWithPoints } from '../UI/Badges';
import ImageWithOverlay from '../UI/ImageWithOverlay';

export type Tab =
  | 'overview'
  | 'deposit'
  | 'earnings'
  | 'benchmark'
  | 'details'
  | 'history'
  | 'allocations'
  | 'faq'
  | undefined;

export type TabConfig = {
  key: string;
  label: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
};
// Tab navigation configuration with icons
const tabConfig: TabConfig[] = [
  { key: 'overview', label: 'Overview', icon: BarChart3 },
  { key: 'deposit', label: 'Deposit', icon: Wallet },
  { key: 'earnings', label: 'Earnings', icon: TrendingUp },
  { key: 'history', label: 'History', icon: History },
  // { key: 'benchmark', label: 'Benchmark', icon: Trophy },
  { key: 'allocations', label: 'Allocations', icon: PieChart },
  { key: 'details', label: 'Details', icon: Info },
  { key: 'faq', label: 'FAQ', icon: CircleQuestionMark },
];

interface DashboardProps {
  currentProjectData: ProjectData;
}

export default function Dashboard({ currentProjectData }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>();
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [enrichedProjectData, setEnrichedProjectData] = useState<ProjectData>(currentProjectData);
  const [enrichedUserStats, setEnrichedUserStats] = useState<UserStats>({
    totalBalance: '0',
    totalEarnings: '0',
    monthlyForecast: '0',
    updateFrequency: '—',
    monthlyEarnings: '0',
    dailyEarnings: '0',
    totalDeposits: '0',
    totalWithdrawals: '0',
    totalActions: '0',
    transactions: [],
  });

  const { user, isMobile, isDarkMode } = useContext(GlobalContext);

  const { getMetricsForVault, vaultMetrics, refreshMetrics } = useVaultMetrics();
  const metrics = vaultMetrics?.[currentProjectData?.vaultAddress]?.metrics;

  const isOldUser = user?.status === 'old';
  const isNewUser = user?.status === 'new';
  const chainName = getChainNameFromId(currentProjectData.chainId);

  // Set the initial tab properly
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const isValidHash = (h?: string): h is Tab => tabConfig.map(tab => tab.key).includes(h || '');
    if (isValidHash(hash)) setActiveTab(hash);
    else setActiveTab('overview');
  }, []);

  // Load metrics and enrich project data
  const loadMetrics = useCallback(() => {
    if (!currentProjectData.vaultAddress) {
      return;
    }

    try {
      const result = getMetricsForVault(currentProjectData.vaultAddress);
      if (!result) {
        return;
      }

      // Update enriched project data with APY values
      setEnrichedProjectData({
        ...currentProjectData,
        apy7d: Number(result.apy7d),
        apy30d: Number(result.apy30d),
        initialSharePrice: result.initialSharePrice,
        latestSharePrice: result.latestSharePrice,
        frequency: result.frequency,
        latestUpdate: result.latestUpdate,
        operatingSince: result.operatingSince,
        uniqueVaultHData: result.uniqueVaultHData,
        recentEarnings: result.earningsSeries.map(e => ({
          asset: currentProjectData.asset,
          protocol: currentProjectData.protocol,
          amount: e.amount,
          value: e.amountUsd,
          time: e.timestamp,
          icon: currentProjectData.assetIcon,
          chainName: getChainNameFromId(Number(currentProjectData.chainId)),
        })),
      });

      // Calculate 24h and 30D earnings from earningsSeries
      const now = Math.floor(Date.now() / 1000);
      const oneDayAgo = now - 24 * 60 * 60;
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60;

      const earnings24h = result.earningsSeries
        .filter(earning => earning.timestamp >= oneDayAgo)
        .reduce((sum, earning) => sum + earning.amount, 0);

      const earnings30d = result.earningsSeries
        .filter(earning => earning.timestamp >= thirtyDaysAgo)
        .reduce((sum, earning) => sum + earning.amount, 0);

      const subgraphBalance = result.totalBalance;
      const finalTotalBalance = subgraphBalance;

      // Update enriched user stats data
      setEnrichedUserStats({
        totalBalance: finalTotalBalance.toString(),
        totalEarnings: result.totalEarnings.toString(),
        monthlyForecast: result.monthlyForecast.toString(),
        updateFrequency: result.frequency,
        monthlyEarnings: earnings30d.toString(),
        dailyEarnings: earnings24h.toString(),
        totalDeposits: result.deposits.length
          ? result.deposits.reduce((a, b) => a + b.amount, 0).toString()
          : '0',
        totalWithdrawals: result.withdrawals.length
          ? result.withdrawals.reduce((a, b) => a + b.amount, 0).toString()
          : '0',
        totalActions: String(
          result.deposits.length + result.withdrawals.length + result.earningsSeries.length
        ),
        transactions: [
          ...result.deposits.map(deposit => {
            return {
              date: new Date(deposit.timestamp * 1000).toISOString(),
              type: 'deposit',
              amount: deposit.amount,
              status: 'confirmed',
              timestamp: deposit.timestamp, // Keep original timestamp for sorting
              txHash: deposit.tx || undefined,
            };
          }),
          ...result.withdrawals.map(withdrawal => {
            return {
              date: new Date(withdrawal.timestamp * 1000).toISOString(),
              type: 'withdrawal',
              amount: withdrawal.amount,
              status: 'confirmed',
              timestamp: withdrawal.timestamp, // Keep original timestamp for sorting
              txHash: withdrawal.tx || undefined,
            };
          }),
        ].sort((a, b) => b.timestamp - a.timestamp), // Sort by timestamp, newest first
      });
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  }, [currentProjectData, getMetricsForVault]);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  const refreshAllMetrics = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      await refreshMetrics();
      loadMetrics();
    } catch (error) {
      console.error('Error refreshing metrics:', error);
    }
  };

  // Navigation handlers
  const handleNavigateToDeposit = () => {
    setActiveTab('deposit');
  };

  const handleOpenBenchmark = () => {
    setActiveTab('benchmark');
  };

  return (
    <TooltipProvider>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-7xl ml-5 lg:ml-auto mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 ml-5 md:ml-0">
                <div className="flex items-center space-x-3">
                  <ImageWithOverlay
                    mainImg={{
                      size: 28,
                      src: currentProjectData.assetIcon,
                      alt: currentProjectData.asset,
                    }}
                    overlayImg={{
                      size: 11,
                      src: `/projects/${currentProjectData.protocol}.png`,
                      alt: currentProjectData.protocol,
                    }}
                  />
                  <div>
                    <h1 className="font-semibold text-gray-900">
                      {currentProjectData.asset} Autopilot
                    </h1>
                    <div className="flex items-center space-x-2">
                      <Image
                        width={14}
                        height={14}
                        src={`/chains/${chainName.toLocaleLowerCase()}.png`}
                        alt={chainName}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-500">{chainName}</span>
                    </div>
                  </div>
                </div>
              </div>

              <ApyBadgeWithPoints
                apy={enrichedProjectData.apy7d.toString()}
                points={['x1 Resolv Points', 'x1 Yield.Fi Points', 'x1 OpenEden Points']}
                setActiveTab={setActiveTab}
                asset={currentProjectData.asset}
                isMobile={isMobile}
              />
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} tabConfig={tabConfig} />

        {/* Main Content with Boxed Layout */}
        <main className="flex-1 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'overview' && (
              <Overview
                currentProjectData={enrichedProjectData}
                userStatsData={enrichedUserStats}
                metrics={metrics}
                setDepositTab={() => setActiveTab('deposit')}
                isMobile={isMobile}
              />
            )}

            {/* Earnings tab - only new users get empty state */}
            {activeTab === 'earnings' && (
              <Earnings
                currentProjectData={enrichedProjectData}
                handleNavigateToDeposit={handleNavigateToDeposit}
                isNewUser={isNewUser}
                userStatsData={enrichedUserStats}
                isMobile={isMobile}
                isDarkMode={isDarkMode}
              />
            )}

            {/* History tab - only new users get empty state */}
            {activeTab === 'history' && (
              <HistoryTab
                currentProjectData={enrichedProjectData}
                handleNavigateToDeposit={handleNavigateToDeposit}
                isNewUser={isNewUser}
                userStatsData={enrichedUserStats}
                isMobile={isMobile}
                isDarkMode={isDarkMode}
              />
            )}

            {/* Details tab - always show regular content */}
            {activeTab === 'details' && (
              <Details
                currentProjectData={enrichedProjectData}
                isNewUser={isNewUser}
                isOldUser={isOldUser}
                isMobile={isMobile}
              />
            )}

            {/* Deposit tab - always show regular content */}
            {activeTab === 'deposit' && (
              <Deposit
                isNewUser={isNewUser}
                currentProjectData={enrichedProjectData}
                setShowTermsModal={setShowTermsModal}
                handleOpenBenchmark={handleOpenBenchmark}
                refreshAllMetrics={refreshAllMetrics}
                isMobile={isMobile}
                isDarkMode={isDarkMode}
              />
            )}

            {/* Benchmark tab - always show regular content */}
            {activeTab === 'benchmark' && (
              <Benchmark benchmarkData={enrichedProjectData?.benchmarkData || []} />
            )}

            {/* Faq tab */}
            {activeTab === 'faq' && <Faq setActiveTab={setActiveTab} isDarkMode={isDarkMode} />}

            {activeTab === 'allocations' && (
              <Allocations
                currentProjectData={enrichedProjectData}
                handleNavigateToDeposit={handleNavigateToDeposit}
                isNewUser={isNewUser}
              />
            )}
          </div>
        </main>
      </div>

      {/* Terms Modal */}
      {showTermsModal && <TermsModal setShowTermsModal={setShowTermsModal} />}
    </TooltipProvider>
  );
}
