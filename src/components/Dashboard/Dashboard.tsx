"use client"
import { TrendingUp, ChevronLeft, BarChart3, Wallet, Trophy, History, Info, Circle } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../../providers/GlobalDataProvider";
import { ProjectData, UserStats } from "@/types/globalAppTypes";
import { TooltipProvider } from "../UI/Tooltip";
import TermsModal from "../UI/TermsModal";
import Details from "./Details";
import Overview from "./Overview";

import Earnings from "./Earnings";
import HistoryTab from "./History";
import Deposit from "./Deposit";
import Benchamrk from "./Benchmark";

import { useVaultMetrics } from "@/providers/VaultMetricsProvider";
import { formatBalance } from "@/helpers/utils";


type Tab = 'overview' | 'deposit' | 'earnings' | 'benchmark' | 'details' | 'history' | undefined;

// Tab navigation configuration with icons
const tabConfig = [
  { key: 'overview', label: 'Overview', icon: BarChart3 },
  { key: 'deposit', label: 'Deposit', icon: Wallet },
  { key: 'earnings', label: 'Earnings', icon: TrendingUp },
  { key: 'benchmark', label: 'Benchmark', icon: Trophy },
  { key: 'details', label: 'Details', icon: Info },
  { key: 'history', label: 'History', icon: History }
];

interface DashboardProps {
  currentProjectData: ProjectData;
}

export default function Dashboard({
  currentProjectData
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>();
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [enrichedProjectData, setEnrichedProjectData] = useState<ProjectData>(currentProjectData);
  const [enrichedUserStats, setEnrichedUserStats] = useState<UserStats>({
    totalBalance: "—",
    totalEarnings: "—",
    monthlyForecast: "—",
    updateFrequency: "—",
    monthlyEarnings: "—",
    dailyEarnings: "—",
    totalDeposits: "—",
    totalWithdrawals: "—",
    totalActions: "0",
    transactions: [],
  });

  const globalData = useContext(GlobalContext);
  const user = globalData?.user;
  const { getMetricsForVault } = useVaultMetrics();

  const isOldUser = user?.status === 'old';
  const isNewUser = user?.status === "new";

  // Set the initial tab properly
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const isValidHash = (h?: string): h is Tab =>
      ['overview', 'deposit', 'earnings', 'benchmark', 'details', 'history'].includes(h || "");
    if(isValidHash(hash))
      setActiveTab(hash);
    else setActiveTab("overview");

  }, []);

  // Load metrics and enrich project data
  useEffect(() => {
    if (!currentProjectData.vaultAddress) {
      return;
    }

    const loadMetrics = () => {
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
          recentEarnings: result.earningsSeries.map(e => ({ time: e.timestamp.toString(), amount: e.amount, amountUsd: e.amountUsd })),
        });

          // Calculate 24h and 30D earnings from earningsSeries
         const now = Math.floor(Date.now() / 1000);
         const oneDayAgo = now - (24 * 60 * 60);
         const thirtyDaysAgo = now - (30 * 24 * 60 * 60);
         
         const earnings24h = result.earningsSeries
           .filter(earning => earning.timestamp >= oneDayAgo)
           .reduce((sum, earning) => sum + earning.amount, 0);
         
         const earnings30d = result.earningsSeries
           .filter(earning => earning.timestamp >= thirtyDaysAgo)
           .reduce((sum, earning) => sum + earning.amount, 0);
         
         // Update enriched user stats data
         setEnrichedUserStats({
           totalBalance: result.totalBalance.toString(),
           totalEarnings: result.totalEarnings.toString(),
           monthlyForecast: result.monthlyForecast.toString(),
           updateFrequency: result.frequency,
           monthlyEarnings: earnings30d.toString(),
           dailyEarnings: earnings24h.toString(),
           totalDeposits: result.deposits.length ? result.deposits.reduce((a,b)=>a+b.amount,0).toString() : "—",
           totalWithdrawals: result.withdrawals.length ? result.withdrawals.reduce((a,b)=>a+b.amount,0).toString() : "—",
           totalActions: String(result.deposits.length + result.withdrawals.length + result.earningsSeries.length),
          transactions: [
            ...result.deposits.map(deposit => ({
              date: new Date(deposit.timestamp * 1000).toISOString(),
              type: 'deposit',
              amount: deposit.amount,
              status: 'confirmed',
              timestamp: deposit.timestamp // Keep original timestamp for sorting
            })),
            ...result.withdrawals.map(withdrawal => ({
              date: new Date(withdrawal.timestamp * 1000).toISOString(),
              type: 'withdrawal',
              amount: withdrawal.amount,
              status: 'confirmed',
              timestamp: withdrawal.timestamp // Keep original timestamp for sorting
            }))
          ].sort((a, b) => b.timestamp - a.timestamp), // Sort by timestamp, newest first
        });
      } catch (error) {
        console.error('Error loading metrics:', error);
      }
    };

    loadMetrics();
  }, [currentProjectData.vaultAddress, getMetricsForVault]);

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 pl-10 md:pl-0">
                  <button
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center space-x-3">
                    <img src={currentProjectData.assetIcon} alt={currentProjectData.asset} className="w-8 h-8" />
                    <div>
                      <h1 className="font-semibold text-gray-900">{currentProjectData.asset} Autopilot</h1>
                      <div className="flex items-center space-x-2">
                        <img src={currentProjectData.icon} alt={currentProjectData.name} className="w-4 h-4" />
                        <span className="text-sm text-gray-500">{currentProjectData.name}</span>

                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-md">
                    <Circle className="w-2 h-2 fill-green-600 text-green-600 animate-gentle-blink" />
                    <span className="text-sm font-semibold text-green-600">
                      {(currentProjectData.currentAPY * 100).toFixed(2)}% APY
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Navigation Tabs */}
          <div className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabConfig.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.key;

                  return (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setActiveTab(tab.key as typeof activeTab);
                      }}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center space-x-2 ${
                        isActive
                          ? 'border-[#9159FF] text-[#9159FF]'
                          : 'border-transparent text-gray-500 hover:text-[#9159FF] hover:border-[#c4b5fd]'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content with Boxed Layout */}
          <main className="flex-1 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {activeTab === 'overview' && (
                <Overview
                  currentProjectData={enrichedProjectData}
                  userStatsData={enrichedUserStats}
                  isNewUser={isNewUser}
                  isOldUser={isOldUser}
                  handleNavigateToDeposit={handleNavigateToDeposit}
                />
              )}

              {/* Earnings tab - only new users get empty state */}
              {activeTab === 'earnings' && (
                <Earnings
                  currentProjectData={enrichedProjectData}
                  handleNavigateToDeposit={handleNavigateToDeposit}
                  isNewUser={isNewUser}
                  userStatsData={enrichedUserStats}
                />
              )}

              {/* History tab - only new users get empty state */}
              {activeTab === 'history' && (
                <HistoryTab
                  currentProjectData={enrichedProjectData}
                  handleNavigateToDeposit={handleNavigateToDeposit}
                  isNewUser={isNewUser}
                  userStatsData={enrichedUserStats}
                />
              )}

              {/* Details tab - always show regular content */}
              {activeTab === 'details' && (
                <Details currentProjectData={enrichedProjectData} />
              )}

              {/* Deposit tab - always show regular content */}
              {activeTab === 'deposit' && (
                <Deposit
                  isNewUser={isNewUser}
                  currentProjectData={enrichedProjectData}
                  setShowTermsModal={setShowTermsModal}
                  handleOpenBenchmark={handleOpenBenchmark}
                />
              )}

              {/* Benchmark tab - always show regular content */}
              {activeTab === 'benchmark' && (
                <Benchamrk
                  benchmarkData={enrichedProjectData?.benchmarkData || []}
                />
              )}
            </div>
          </main>
        </div>

        {/* Terms Modal */}
        {showTermsModal && <TermsModal setShowTermsModal={setShowTermsModal}/>}
    </TooltipProvider>
  );
}