'use client';
import { ProjectData, UserStats, TimeFrame } from '@/types/globalAppTypes';
import { useState } from 'react';
import StatsGrid from '@/components/StatsGrid';
import { generateOverviewGridStructure } from '@/components/StatsGrid/gridStructure';
import Link from 'next/link';
import Image from 'next/image';
import EarningsChart from './EarningsChart';
import { formatBalance, formatFrequency } from '@/helpers/utils';
import { Metrics } from '@/hooks/useHarvestMetrics';
import EmptyStateComponent from '@/components/UI/EmptyStateComponent';

export default function Overview({
  currentProjectData,
  userStatsData,
  metrics,
  setDepositTab,
  isMobile,
  isDarkMode,
}: {
  currentProjectData: ProjectData;
  userStatsData: UserStats;
  metrics: Metrics;
  setDepositTab: () => void;
  isMobile?: boolean;
  isDarkMode?: boolean;
}) {
  const [timeframe, setTimeframe] = useState<TimeFrame>('all');
  const [curDate, setCurDate] = useState<string>('');
  const [curContent, setCurContent] = useState<string>('');

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <StatsGrid
        gridStructure={generateOverviewGridStructure(currentProjectData, userStatsData)}
        desktopColumns={4}
        isMobile={isMobile}
        isDarkMode={isDarkMode}
      />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Earnings Card */}
        <div
          className={`lg:col-span-2 rounded-xl border overflow-hidden ${
            isDarkMode ? 'bg-card border-border' : 'bg-white border-gray-100'
          }`}
        >
          <>
            {/* Header (moved from EarningsChart; now driven by parent state) */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between">
                <div
                  className={`text-lg font-semibold ${
                    isDarkMode ? 'text-foreground' : 'text-gray-900'
                  }`}
                >
                  Earnings
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-500">{curContent || '—'}</div>
                  {curDate && (
                    <div className="text-sm text-gray-500 mt-1 text-right">{curDate}</div>
                  )}
                </div>
                {/* <div className="flex items-center space-x-1">
                    {(['7d', '1m', 'all'] as const).map(period => (
                      <button
                        key={period}
                        onClick={() => setTimeframe(period)}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          timeframe === period
                            ? 'bg-[#9159FF] text-white'
                            : 'text-[#9159FF] hover:text-[#7c3aed] hover:bg-gray-50'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div> */}
              </div>
            </div>

            {/* Chart only — pushes hover/initial value & date up via setters */}
            <EarningsChart
              currentProjectData={currentProjectData}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              setCurDate={setCurDate}
              setCurContent={setCurContent}
              isDarkMode={isDarkMode}
            />
          </>
        </div>

        {/* Latest Earnings */}
        <div
          className={`rounded-xl border p-6 ${
            isDarkMode ? 'bg-card border-border' : 'bg-white border-gray-100'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3
              className={`text-lg font-semibold ${
                isDarkMode ? 'text-foreground' : 'text-gray-900'
              }`}
            >
              Latest Earnings
            </h3>
            {currentProjectData.recentEarnings.length > 5 && (
              <Link
                href={'/earnings'}
                className="text-xs bg-[#9159FF] text-white px-3 py-1.5 rounded-md hover:bg-[#7c3aed] transition-colors"
              >
                View All
              </Link>
            )}
          </div>

          <div className="space-y-3">
            {currentProjectData.recentEarnings.length > 0 ? (
              currentProjectData.recentEarnings.slice(0, 5).map((earning, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors cursor-pointer ${
                    isDarkMode ? 'hover:bg-purple-900/20' : ' hover:bg-gray-50 '
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Image
                      width={17.5}
                      height={17.5}
                      src={currentProjectData.assetIcon}
                      alt={currentProjectData.asset}
                      className="w-5 h-5"
                    />
                    <div>
                      <div
                        className={`text-sm font-medium ${
                          isDarkMode ? 'text-foreground' : 'text-gray-900'
                        }`}
                      >
                        {formatBalance(
                          earning.amount,
                          currentProjectData.asset,
                          currentProjectData.showDecimals
                        )}
                      </div>
                      <div
                        className={`text-xs ${
                          isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                        }`}
                      >
                        {formatBalance(
                          earning.amount * metrics?.latestUnderlyingPrice || 0,
                          'USD',
                          2
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFrequency(Date.now() / 1000 - Number(earning.time))}
                  </div>
                </div>
              ))
            ) : (
              <EmptyStateComponent
                balance={Number(userStatsData.totalBalance)}
                handleAction={setDepositTab}
                isDarkMode={isDarkMode}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
