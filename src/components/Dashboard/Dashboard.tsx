'use client';
import { TrendingUp, BarChart3, Wallet, Trophy, History, Info, Circle } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../GlobalDataProvider';
import { AllUserStats, AutopilotProduct, ProjectData, UserStats } from '@/types/globalAppTypes';
import { TooltipProvider } from '../UI/Tooltip';
import TermsModal from '../UI/TermsModal';
import Details from './Details';
import Overview from './Overview';
import Earnings from './Earnings';
import HistoryTab from './History';
import Deposit from './Deposit';
import Benchamrk from './Benchmark';
import Image from 'next/image';

type Tab = 'overview' | 'deposit' | 'earnings' | 'benchmark' | 'details' | 'history' | undefined;

// Tab navigation configuration with icons
const tabConfig = [
  { key: 'overview', label: 'Overview', icon: BarChart3 },
  { key: 'deposit', label: 'Deposit', icon: Wallet },
  { key: 'earnings', label: 'Earnings', icon: TrendingUp },
  { key: 'benchmark', label: 'Benchmark', icon: Trophy },
  { key: 'details', label: 'Details', icon: Info },
  { key: 'history', label: 'History', icon: History },
];

interface DashboardProps {
  selectedAutopilot: AutopilotProduct;
  userStats: AllUserStats;
  currentProjectData: ProjectData;
}

export default function Dashboard({
  selectedAutopilot,
  userStats,
  currentProjectData,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>();
  const [showTermsModal, setShowTermsModal] = useState(false);

  const globalData = useContext(GlobalContext);
  const user = globalData?.user;
  const isMobile = globalData?.isMobile;
  const dataKey = `${selectedAutopilot.protocol}-${selectedAutopilot.asset}` as keyof UserStats;
  const userStatsData = userStats?.[user?.status]?.[dataKey];

  const isOldUser = user?.status === 'old';
  const isNewUser = user?.status === 'new' || !userStatsData;

  // Set the initial tab properly
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const isValidHash = (h?: string): h is Tab =>
      ['overview', 'deposit', 'earnings', 'benchmark', 'details', 'history'].includes(h || '');
    if (isValidHash(hash)) setActiveTab(hash);
    else setActiveTab('overview');
  }, []);

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
                  <Image
                    width={28}
                    height={28}
                    src={currentProjectData.assetIcon}
                    alt={currentProjectData.asset}
                    className="w-8 h-8"
                  />
                  <div>
                    <h1 className="font-semibold text-gray-900">
                      {currentProjectData.asset} Autopilot
                    </h1>
                    <div className="flex items-center space-x-2">
                      <Image
                        width={14}
                        height={14}
                        src={currentProjectData.icon}
                        alt={currentProjectData.name}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-500">{currentProjectData.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-md">
                  <Circle className="w-2 h-2 fill-green-600 text-green-600 animate-gentle-blink" />
                  <span className="text-sm font-semibold text-green-600">
                    {currentProjectData.monthlyApy.toFixed(2)}% 30d APY
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
              {tabConfig.map(tab => {
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
                currentProjectData={currentProjectData}
                handleNavigateToDeposit={handleNavigateToDeposit}
                isNewUser={isNewUser}
                isOldUser={isOldUser}
                userStatsData={userStatsData}
              />
            )}

            {/* Earnings tab - only new users get empty state */}
            {activeTab === 'earnings' && (
              <Earnings
                currentProjectData={currentProjectData}
                handleNavigateToDeposit={handleNavigateToDeposit}
                isNewUser={isNewUser}
                userStatsData={userStatsData}
                isMobile={isMobile}
              />
            )}

            {/* History tab - only new users get empty state */}
            {activeTab === 'history' && (
              <HistoryTab
                currentProjectData={currentProjectData}
                handleNavigateToDeposit={handleNavigateToDeposit}
                isNewUser={isNewUser}
                userStatsData={userStatsData}
                selectedAutopilot={selectedAutopilot}
                dataKey={dataKey}
                isMobile={isMobile}
              />
            )}

            {/* Details tab - always show regular content */}
            {activeTab === 'details' && (
              <Details
                currentProjectData={currentProjectData}
                isNewUser={isNewUser}
                isOldUser={isOldUser}
                isMobile={isMobile}
              />
            )}

            {/* Deposit tab - always show regular content */}
            {activeTab === 'deposit' && (
              <Deposit
                isNewUser={isNewUser}
                currentProjectData={currentProjectData}
                setShowTermsModal={setShowTermsModal}
                handleOpenBenchmark={handleOpenBenchmark}
              />
            )}

            {/* Benchmark tab - always show regular content */}
            {activeTab === 'benchmark' && (
              <Benchamrk benchmarkData={currentProjectData?.benchmarkData || []} />
            )}
          </div>
        </main>
      </div>

      {/* Terms Modal */}
      {showTermsModal && <TermsModal setShowTermsModal={setShowTermsModal} />}
    </TooltipProvider>
  );
}
