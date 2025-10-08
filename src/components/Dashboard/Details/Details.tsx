import { ProjectData } from '@/types/globalAppTypes';
import {
  Cpu,
  Settings,
  DollarSign,
  TrendingUp,
  Activity,
  BarChart2,
  ExternalLink,
} from 'lucide-react';
import CurrentAllocations from './CurrentAllocations';
import { useEffect, useState } from 'react';
import { fetchDefiLlamaAPY } from '@/hooks/useDefiLlamaAPY';
import SharepriceChart from './SharepriceChart';
import { formatBalance, getExplorerLink } from '@/helpers/utils';
import { generateDetailsGridStructure } from '@/components/StatsGrid/gridStructure';
import StatsGrid from '@/components/StatsGrid';
import Image from 'next/image';
import useCurrentAllocations from '@/hooks/useCurrentAllocations';

export default function Details({
  currentProjectData,
  isOldUser,
  isMobile,
  isDarkMode,
}: {
  currentProjectData: ProjectData;
  isNewUser: boolean;
  isOldUser: boolean;
  isMobile?: boolean;
  isDarkMode?: boolean;
}) {
  const currentAllocations = useCurrentAllocations(currentProjectData.vaultAddress);

  const [enrichedProjectData, setEnrichedProjectData] = useState<ProjectData>(currentProjectData);

  useEffect(() => {
    if (!currentProjectData.benchmarkData || currentProjectData.benchmarkData.length === 0) {
      return;
    }

    const validBenchmarks = currentProjectData.benchmarkData.filter(
      benchmark => benchmark.hVaultAddress && benchmark.name !== 'Not invested'
    );

    if (validBenchmarks.length === 0) {
      return;
    }

    const fetchAPYData = async () => {
      try {
        const apyData = await fetchDefiLlamaAPY(validBenchmarks);

        const updatedProjectData = {
          ...currentProjectData,
          apy30d:
            apyData[currentProjectData.vaultAddress?.toLowerCase()] || currentProjectData.apy30d,
        };

        const updatedBenchmarkData = currentProjectData.benchmarkData.map(benchmark => {
          if (!benchmark.hVaultAddress) {
            return benchmark;
          }

          const realTimeAPY = apyData[benchmark.hVaultAddress.toLowerCase()];
          return {
            ...benchmark,
            apy: realTimeAPY !== undefined ? realTimeAPY : benchmark.apy,
          };
        });

        setEnrichedProjectData({
          ...updatedProjectData,
          benchmarkData: updatedBenchmarkData,
        });
      } catch (error) {
        console.error('Failed to fetch DefiLlama APY data:', error);
        setEnrichedProjectData(currentProjectData);
      }
    };

    fetchAPYData();
  }, [currentProjectData]);

  return (
    <div className="space-y-8">
      <StatsGrid
        gridStructure={generateDetailsGridStructure(enrichedProjectData)}
        desktopColumns={3}
        isMobile={isMobile}
        isDarkMode={isDarkMode}
      />

      {/* Automated Algorithm Active */}
      <div
        className={`rounded-xl border p-6 ${
          isDarkMode ? 'bg-card border-border' : 'bg-white border-gray-100'
        }`}
      >
        {/* Header Section */}
        <div className="flex items-center space-x-4 mb-6">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'
            }`}
          >
            <Cpu className="w-6 h-6 text-[#9159FF]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3
                className={`text-xl font-semibold ${
                  isDarkMode ? 'text-foreground' : 'text-gray-900'
                }`}
              >
                Automated Algorithm
              </h3>
              <span className="bg-[#9159FF] text-white px-3 py-1 rounded-full text-xs font-medium">
                Active
              </span>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}>
              Automated rebalancing algorithm monitors yield opportunities across connected{' '}
              {enrichedProjectData.name.toLowerCase()} vaults and automatically adjusts allocations
              to maximize yield potential.
            </p>
          </div>
        </div>

        {/* Rebalancing Triggers Section */}
        <div>
          <h4
            className={`text-sm font-semibold mb-6 uppercase tracking-wide flex items-center space-x-2 ${
              isDarkMode ? 'text-foreground' : 'text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4 text-[#9159FF]" />
            <span>Rebalancing Triggers</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className={`flex items-center space-x-3 p-4 rounded-xl border ${
                isDarkMode
                  ? 'bg-purple-900/30 border-purple-700/50'
                  : 'bg-purple-50 border-purple-100'
              }`}
            >
              <DollarSign className="w-5 h-5 text-[#9159FF]" />
              <span
                className={`text-sm font-medium ${
                  isDarkMode ? 'text-purple-200' : 'text-purple-900'
                }`}
              >
                Prevailing network fees
              </span>
            </div>
            <div
              className={`flex items-center space-x-3 p-4 rounded-xl border ${
                isDarkMode
                  ? 'bg-purple-900/30 border-purple-700/50'
                  : 'bg-purple-50 border-purple-100'
              }`}
            >
              <TrendingUp className="w-5 h-5 text-[#9159FF]" />
              <span
                className={`text-sm font-medium ${
                  isDarkMode ? 'text-purple-200' : 'text-purple-900'
                }`}
              >
                Interest rate movements
              </span>
            </div>
            <div
              className={`flex items-center space-x-3 p-4 rounded-xl border ${
                isDarkMode
                  ? 'bg-purple-900/30 border-purple-700/50'
                  : 'bg-purple-50 border-purple-100'
              }`}
            >
              <Activity className="w-5 h-5 text-[#9159FF]" />
              <span
                className={`text-sm font-medium ${
                  isDarkMode ? 'text-purple-200' : 'text-purple-900'
                }`}
              >
                Vault liquidity changes
              </span>
            </div>
            <div
              className={`flex items-center space-x-3 p-4 rounded-xl border ${
                isDarkMode
                  ? 'bg-purple-900/30 border-purple-700/50'
                  : 'bg-purple-50 border-purple-100'
              }`}
            >
              <BarChart2 className="w-5 h-5 text-[#9159FF]" />
              <span
                className={`text-sm font-medium ${
                  isDarkMode ? 'text-purple-200' : 'text-purple-900'
                }`}
              >
                Market impact analysis
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Information */}
      <div
        className={`rounded-xl border p-6 ${
          isDarkMode ? 'bg-card border-border' : 'bg-white border-gray-100'
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-6 ${
            isDarkMode ? 'text-foreground' : 'text-gray-900'
          }`}
        >
          Technical Information
        </h3>

        {/* General and Performance Info - Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* General */}
          <div>
            <h4
              className={`text-sm font-semibold mb-4 uppercase tracking-wide ${
                isDarkMode ? 'text-foreground' : 'text-gray-900'
              }`}
            >
              General
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span
                  className={`text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}
                >
                  Operating since
                </span>
                <span
                  className={`text-sm font-medium ${
                    isDarkMode ? 'text-foreground' : 'text-gray-900'
                  }`}
                >
                  {enrichedProjectData.operatingSince}
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={`text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}
                >
                  Starting SharePrice
                </span>
                <span
                  className={`text-sm font-medium ${
                    isDarkMode ? 'text-foreground' : 'text-gray-900'
                  }`}
                >
                  {formatBalance(
                    enrichedProjectData.initialSharePrice,
                    enrichedProjectData.asset,
                    enrichedProjectData.showDecimals
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={`text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}
                >
                  Latest SharePrice
                </span>
                <span
                  className={`text-sm font-medium ${
                    isDarkMode ? 'text-foreground' : 'text-gray-900'
                  }`}
                >
                  {formatBalance(
                    enrichedProjectData.latestSharePrice,
                    enrichedProjectData.asset,
                    // enrichedProjectData.showDecimals
                    5
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={`text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}
                >
                  Latest SharePrice Update
                </span>
                <span
                  className={`text-sm font-medium ${
                    isDarkMode ? 'text-foreground' : 'text-gray-900'
                  }`}
                >
                  {enrichedProjectData.latestUpdate} ago
                </span>
              </div>
            </div>
          </div>

          {/* Performance History */}
          <div>
            <h4
              className={`text-sm font-semibold mb-4 uppercase tracking-wide ${
                isDarkMode ? 'text-foreground' : 'text-gray-900'
              }`}
            >
              Performance History
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span
                  className={`text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}
                >
                  30d Average
                </span>
                <span
                  className={`text-sm font-medium ${
                    isDarkMode ? 'text-foreground' : 'text-gray-900'
                  }`}
                >
                  {enrichedProjectData.apy30d}%
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={`text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}
                >
                  90d Average
                </span>
                <span
                  className={`text-sm font-medium ${
                    isDarkMode ? 'text-foreground' : 'text-gray-900'
                  }`}
                >
                  {/* {enrichedProjectData.quateryApy}% */}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Share Price History Chart */}
        <h4
          className={`text-sm font-semibold mb-4 uppercase tracking-wide ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}
        >
          Share Price History
        </h4>
        <SharepriceChart
          uniqueVaultHData={enrichedProjectData.uniqueVaultHData}
          isDarkMode={isDarkMode}
        />

        <div className="mt-8">
          <h4
            className={`text-sm font-semibold mb-4 uppercase tracking-wide ${
              isDarkMode ? 'text-foreground' : 'text-gray-900'
            }`}
          >
            Autopilot Vault
          </h4>
          <div className="space-y-3">
            {/* Mobile-optimized contract section */}
            <div
              className={`p-3 md:p-4 rounded-lg border ${
                isDarkMode ? 'bg-muted border-border' : 'bg-gray-50 border-gray-100'
              }`}
            >
              {/* Mobile: Stack vertically, Desktop: Horizontal layout */}
              <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                  <div className="w-8 h-8 bg-[#9159FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Image width={28} height={28} src={'/icon.svg'} alt="icon" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-sm font-medium ${
                        isDarkMode ? 'text-foreground' : 'text-gray-900'
                      }`}
                    >
                      Autopilot Contract
                    </div>
                    <div
                      className={`md:text-xs text-[9px] font-mono break-all md:break-normal ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}
                    >
                      {enrichedProjectData.vaultAddress}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
                  <a
                    className={`flex items-center space-x-1 px-2 py-1 text-xs font-medium hover:text-[#9159FF] transition-colors rounded border flex-shrink-0 ${
                      isDarkMode
                        ? 'text-muted-foreground bg-card border-border'
                        : 'text-gray-600 bg-white border-gray-200'
                    }`}
                    href={`https://debank.com/profile/${enrichedProjectData.vaultAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>DeBank</span>
                  </a>
                  <a
                    className={`flex items-center space-x-1 px-2 py-1 text-xs font-medium hover:text-[#9159FF] transition-colors rounded border flex-shrink-0 ${
                      isDarkMode
                        ? 'text-muted-foreground bg-card border-border'
                        : 'text-gray-600 bg-white border-gray-200'
                    }`}
                    href={`${getExplorerLink(currentProjectData.chainId || 8453)}/address/${enrichedProjectData.vaultAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>
                      {currentProjectData.chainId === 1
                        ? 'Etherscan'
                        : currentProjectData.chainId === 8453
                          ? 'BaseScan'
                          : 'Block explorer'}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Allocation Table - Always show for both user states */}
      <CurrentAllocations
        currentProjectData={currentProjectData}
        allocations={currentAllocations}
        isOldUser={isOldUser}
        isMobile={isMobile}
        isDarkMode={isDarkMode}
      />

      {/* Yield Sources - Full Width List */}
      <div
        className={`rounded-xl border p-6 ${
          isDarkMode ? 'bg-card border-border' : 'bg-white border-gray-100'
        }`}
      >
        <div className="mb-6">
          <h4
            className={`text-sm font-semibold uppercase tracking-wide mb-4 ${
              isDarkMode ? 'text-foreground' : 'text-gray-900'
            }`}
          >
            Yield Sources
          </h4>
          <div className="space-y-2">
            {enrichedProjectData.benchmarkData
              .filter(vault => !vault.isAutopilot && vault.name !== 'Not invested')
              .map(vault => (
                <div
                  key={vault.name}
                  className={`flex justify-between items-center py-3 px-4 rounded-lg ${
                    isDarkMode ? 'bg-muted' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-medium ${
                        isDarkMode ? 'text-foreground' : 'text-gray-800'
                      }`}
                    >
                      {vault.name}
                    </div>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <a
                      href={`${getExplorerLink(currentProjectData.chainId || 8453)}/address/${vault.mVaultAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs font-mono px-2 py-1 rounded border transition-colors flex items-center space-x-1 group ${
                        isDarkMode
                          ? 'text-muted-foreground bg-card border-border'
                          : 'text-gray-500 bg-white border-gray-200'
                      }`}
                    >
                      <span>
                        {vault?.mVaultAddress?.slice(0, 6)}...{vault?.mVaultAddress?.slice(-4)}
                      </span>
                      <ExternalLink
                        className={`w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                      />
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
