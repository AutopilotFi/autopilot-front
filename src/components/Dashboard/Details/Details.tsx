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
import { formatBalance, getExplorerLink } from '@/helpers/utils';
import { generateDetailsGridStructure } from '@/components/StatsGrid/gridStructure';
import StatsGrid from '@/components/StatsGrid';

export default function Details({
  currentProjectData,
  isOldUser,
  isMobile,
}: {
  currentProjectData: ProjectData;
  isNewUser: boolean;
  isOldUser: boolean;
  isMobile?: boolean;
}) {
  const [enrichedProjectData, setEnrichedProjectData] = useState<ProjectData>(currentProjectData);
  const allocations = currentProjectData.benchmarkData.filter(
    allocation => !allocation.isAutopilot && Number(allocation.allocation) > 1e-8
  );

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
      />

      {/* Automated Algorithm Active */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        {/* Header Section */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Cpu className="w-6 h-6 text-[#9159FF]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">Automated Algorithm</h3>
              <span className="bg-[#9159FF] text-white px-3 py-1 rounded-full text-xs font-medium">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Automated rebalancing algorithm monitors yield opportunities across connected{' '}
              {enrichedProjectData.name.toLowerCase()} vaults and automatically adjusts allocations
              to maximize yield potential.
            </p>
          </div>
        </div>

        {/* Rebalancing Triggers Section */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wide flex items-center space-x-2">
            <Settings className="w-4 h-4 text-[#9159FF]" />
            <span>Rebalancing Triggers</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
              <DollarSign className="w-5 h-5 text-[#9159FF]" />
              <span className="text-sm font-medium text-purple-900">Prevailing network fees</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
              <TrendingUp className="w-5 h-5 text-[#9159FF]" />
              <span className="text-sm font-medium text-purple-900">Interest rate movements</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
              <Activity className="w-5 h-5 text-[#9159FF]" />
              <span className="text-sm font-medium text-purple-900">Vault liquidity changes</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
              <BarChart2 className="w-5 h-5 text-[#9159FF]" />
              <span className="text-sm font-medium text-purple-900">Market impact analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Information */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Technical Information</h3>

        {/* General and Performance Info - Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* General */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              General
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Operating since</span>
                <span className="text-sm font-medium text-gray-900">
                  {enrichedProjectData.operatingSince}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Starting SharePrice</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatBalance(
                    enrichedProjectData.initialSharePrice,
                    enrichedProjectData.asset,
                    enrichedProjectData.showDecimals
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Latest SharePrice</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatBalance(
                    enrichedProjectData.latestSharePrice,
                    enrichedProjectData.asset,
                    // enrichedProjectData.showDecimals
                    5
                  )}
                </span>
              </div>
              {/* <div className="flex justify-between">
                <span className="text-sm text-gray-600">Latest SharePrice Update</span>
                <span className="text-sm font-medium text-gray-900">
                  {enrichedProjectData.latestUpdate} ago
                </span>
              </div> */}
            </div>
          </div>

          {/* Performance History */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Performance History
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">30d Average</span>
                <span className="text-sm font-medium text-gray-900">
                  {enrichedProjectData.apy30d}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">90d Average</span>
                <span className="text-sm font-medium text-gray-900">
                  {/* {enrichedProjectData.quateryApy}% */}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
            Autopilot Vault
          </h4>
          <div className="space-y-3">
            {/* Mobile-optimized contract section */}
            <div className="p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-100">
              {/* Mobile: Stack vertically, Desktop: Horizontal layout */}
              <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                  <div className="w-8 h-8 bg-[#9159FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">V</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900">Main Vault Contract</div>
                    <div className="text-xs font-mono text-gray-600 break-all md:break-normal">
                      {enrichedProjectData.vaultAddress.slice(0, 5)}...
                      {enrichedProjectData.vaultAddress.slice(-5)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
                  <button className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-gray-600 hover:text-[#9159FF] transition-colors bg-white rounded border border-gray-200 flex-shrink-0">
                    <ExternalLink className="w-3 h-3" />
                    <span className="hidden sm:inline">DeBank</span>
                    <span className="sm:hidden">View</span>
                  </button>
                  <a
                    className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-gray-600 hover:text-[#9159FF] transition-colors bg-white rounded border border-gray-200 flex-shrink-0"
                    href={`${getExplorerLink(currentProjectData.chainId || 8453)}/address/${enrichedProjectData.vaultAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span className="hidden sm:inline">Etherscan</span>
                    <span className="sm:hidden">View</span>
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
        allocations={allocations}
        isOldUser={isOldUser}
        isMobile={isMobile}
      />

      {/* Yield Sources - Full Width List */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
            Yield Sources
          </h4>
          <div className="space-y-2">
            {enrichedProjectData.benchmarkData
              .filter(vault => !vault.isAutopilot && vault.name !== 'Not invested')
              .map(vault => (
                <div
                  key={vault.name}
                  className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800">{vault.name}</div>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <a
                      href={`${getExplorerLink(currentProjectData.chainId || 8453)}/address/${vault.hVaultAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-50 px-2 py-1 rounded border transition-colors flex items-center space-x-1 group"
                    >
                      <span>
                        {vault.hVaultAddress.slice(0, 6)}...{vault.hVaultAddress.slice(-4)}
                      </span>
                      <ExternalLink className="w-3 h-3 text-gray-900 opacity-50 group-hover:opacity-100 transition-opacity" />
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
