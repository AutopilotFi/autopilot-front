'use client';

import { RefreshCw } from 'lucide-react';
import { ProjectData, VaultHistoryData, MarketBalance } from '@/types/globalAppTypes';
import { useState, useMemo, useCallback } from 'react';
import { useIPORVaults } from '@/providers/VaultProvider';
import Pagination from '@/components/UI/Pagination';
import { generateColor } from '@/helpers/utils';
import Rebalance from './Rebalance';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { getCurrentAllocations } from '@/helpers/allocationUtils';

export interface RebalanceData {
  id: number;
  timestamp: number;
  allocations: {
    name: string;
    percentage: number;
    color: string;
  }[];
}

export default function Allocations({
  currentProjectData,
  isNewUser,
  handleNavigateToDeposit,
  isDarkMode,
}: {
  currentProjectData: ProjectData;
  isNewUser: boolean;
  handleNavigateToDeposit: () => void;
  isDarkMode?: boolean;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const rebalancesPerPage = 5;
  const { iporVaultData } = useIPORVaults();

  // Function to get vault name from marketId using allocPointData
  const getVaultNameFromMarketId = useCallback(
    (marketId: string | null, allocPointData: { hVaultAddress?: string; hVaultId: string }[]) => {
      if (!marketId) {
        return 'Unknown Vault';
      }

      const allocPoint = allocPointData?.find(
        ap => ap.hVaultAddress?.toLowerCase() === marketId.toLowerCase()
      );
      if (allocPoint) {
        const hVaultId = allocPoint.hVaultId;
        if (hVaultId === 'Not invested') return 'Not invested';

        const parts = hVaultId.split('_');

        if (parts.length >= 3) {
          const protocol = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
          const strategy = parts[1];
          const asset = parts[2];

          if (protocol === 'Morpho') {
            return `Morpho ${strategy} ${asset}`;
          } else if (protocol === 'Euler') {
            return `Euler ${strategy} ${asset}`;
          } else if (protocol === 'Extrafi') {
            return `Extrafi ${strategy} ${asset}`;
          } else if (protocol === 'Moonwell') {
            return `Moonwell ${strategy} ${asset}`;
          } else if (protocol === 'Fortyacres') {
            return `Forty Acres ${strategy} ${asset}`;
          } else if (protocol === 'Fluid') {
            return `Fluid ${strategy} ${asset}`;
          } else if (protocol === 'Aave') {
            return `Aave ${strategy} ${asset}`;
          } else {
            return `${protocol} ${strategy} ${asset}`;
          }
        } else if (parts.length === 2) {
          const protocol = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
          const asset = parts[1];
          return `${protocol} ${asset}`;
        }

        return hVaultId.charAt(0).toUpperCase() + hVaultId.slice(1);
      }
      return `Vault ${marketId.slice(0, 6)}...`;
    },
    []
  );

  // Function to process plasmaHistory and convert to rebalance format
  const processPlasmaHistoryToRebalances = useCallback(
    (
      plasmaHistory: VaultHistoryData[],
      allocPointData: { hVaultAddress?: string; hVaultId: string }[]
    ): RebalanceData[] => {
      if (!plasmaHistory || plasmaHistory.length === 0) return [];

      return plasmaHistory
        .filter(history => history.marketBalances && history.marketBalances.length > 0)
        .map((history, index) => {
          const totalBalance = parseFloat(history.totalBalance) || 0;

          const allocations = history.marketBalances
            .filter(
              (marketBalance: MarketBalance) => marketBalance.protocol?.toLowerCase() !== 'erc20'
            )
            .map((marketBalance: MarketBalance) => {
              const balance = parseFloat(marketBalance.balance) || 0;
              const percentage = totalBalance > 0 ? (balance / totalBalance) * 100 : 0;
              const vaultName = getVaultNameFromMarketId(marketBalance.marketId, allocPointData);

              return {
                name: vaultName,
                percentage: Math.round(percentage * 100) / 100,
                color: generateColor({}, vaultName),
              };
            })
            .filter(allocation => allocation.percentage > 0)
            .sort((a, b) => b.percentage - a.percentage);

          const timestamp = new Date(history.blockTimestamp).getTime();

          return {
            id: index + 1,
            timestamp: timestamp,
            allocations,
          };
        })
        .filter(rebalance => rebalance.allocations.length > 0)
        .sort((a, b) => b.timestamp - a.timestamp);
    },
    [getVaultNameFromMarketId]
  );

  const realRebalances = useMemo(() => {
    const currentVault = iporVaultData.find(
      vault => vault.vaultAddress.toLowerCase() === currentProjectData.vaultAddress.toLowerCase()
    );

    if (currentVault?.plasmaHistory && currentVault.allocPointData) {
      return processPlasmaHistoryToRebalances(
        currentVault.plasmaHistory,
        currentVault.allocPointData
      );
    }

    return [];
  }, [iporVaultData, currentProjectData.vaultAddress, processPlasmaHistoryToRebalances]);

  const currentAllocations = useMemo(() => {
    const currentVault = iporVaultData.find(
      vault => vault.vaultAddress.toLowerCase() === currentProjectData.vaultAddress.toLowerCase()
    );

    if (currentVault?.plasmaHistory && currentVault.allocPointData) {
      return getCurrentAllocations(currentVault.plasmaHistory, currentVault.allocPointData);
    }

    return [];
  }, [iporVaultData, currentProjectData.vaultAddress]);

  const chartData = useMemo(() => {
    const currentVault = iporVaultData.find(
      vault => vault.vaultAddress.toLowerCase() === currentProjectData.vaultAddress.toLowerCase()
    );

    if (!currentVault?.plasmaHistory || !currentVault.allocPointData) {
      return [];
    }

    return currentVault.plasmaHistory
      .filter(history => history.marketBalances && history.marketBalances.length > 0)
      .map(history => {
        const totalBalance = parseFloat(history.totalBalance) || 0;
        const chartEntry: Record<string, string | number> = {
          date: history.blockTimestamp,
          timestamp: new Date(history.blockTimestamp).getTime(),
        };

        history.marketBalances
          .filter(
            (marketBalance: MarketBalance) => marketBalance.protocol?.toLowerCase() !== 'erc20'
          )
          .forEach((marketBalance: MarketBalance) => {
            const balance = parseFloat(marketBalance.balance) || 0;
            const percentage = totalBalance > 0 ? (balance / totalBalance) * 100 : 0;

            if (percentage > 0.001) {
              const vaultName = getVaultNameFromMarketId(
                marketBalance.marketId,
                currentVault.allocPointData || []
              );
              chartEntry[vaultName] = Math.round(percentage * 100) / 100;
            }
          });

        return chartEntry;
      })
      .filter(entry => Object.keys(entry).length > 2)
      .sort((a, b) => (a.timestamp as number) - (b.timestamp as number));
  }, [iporVaultData, currentProjectData.vaultAddress, getVaultNameFromMarketId]);

  const chartVaultNames = useMemo(() => {
    const vaultNames = new Set<string>();
    chartData.forEach(entry => {
      Object.keys(entry).forEach(key => {
        if (key !== 'date' && key !== 'timestamp') {
          vaultNames.add(key);
        }
      });
    });
    return Array.from(vaultNames);
  }, [chartData]);

  const rebalances = realRebalances.length > 0 ? realRebalances : [];
  const totalRebalances = Math.max(0, rebalances.length - 1);
  const startIndex = (currentPage - 1) * rebalancesPerPage;
  const endIndex = startIndex + rebalancesPerPage;
  const currentRebalances = rebalances.slice(1).slice(startIndex, endIndex);
  const latestAllocation =
    currentAllocations.length > 0
      ? {
          id: 0,
          timestamp: Date.now(),
          allocations: currentAllocations.map(allocation => ({
            name: allocation.name,
            percentage: allocation.percentage,
            color: allocation.color,
          })),
        }
      : null;

  const renderTooltipContent = (props: {
    payload?: Array<{ value: number; dataKey: string; color: string }>;
    label?: string | number;
  }) => {
    const { payload, label } = props;

    if (!payload || payload.length === 0) return null;

    const date = new Date(label as string);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours().toString().padStart(2, '0');
    const mins = date.getMinutes().toString().padStart(2, '0');

    return (
      <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-gray-600">
        <div className="text-sm font-medium mb-2">{`${day}/${month}/${year} ${hour}:${mins}`}</div>
        <div className="space-y-1">
          {payload
            .filter(
              (entry: { value: number; dataKey: string; color: string }) =>
                entry.value !== 0 && entry.value !== null
            )
            .map((entry: { value: number; dataKey: string; color: string }, index: number) => {
              const value = entry.value || 0;
              if (value <= 0) return null;

              return (
                <div key={`item-${index}`} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-gray-300">{entry.dataKey}</span>
                  </div>
                  <span className="font-medium ml-4">{value.toFixed(2)}%</span>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {isNewUser ? (
        <div
          className={`rounded-xl border p-4 md:p-6 ${
            isDarkMode ? 'bg-card border-border' : 'bg-white border-gray-100'
          }`}
        >
          <div className="text-center py-16">
            <RefreshCw className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4
              className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Allocation History
            </h4>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}>
              Track how your funds are allocated across different yield sources and see historical
              rebalancing events.
            </p>
            <button
              onClick={handleNavigateToDeposit}
              className="bg-[#9159FF] text-white px-6 py-3 rounded-lg hover:bg-[#7c3aed] transition-colors font-medium"
            >
              Start Earning
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Latest Allocation */}
          <div
            className={`rounded-xl p-3 md:p-6 ${isDarkMode ? 'bg-card border-border' : 'border border-gray-100'}`}
          >
            <div
              className={`border  rounded-lg ${isDarkMode ? 'border-border' : 'border-green-200 bg-gradient-to-r from-green-50 to-purple-50'}`}
            >
              {latestAllocation && (
                <Rebalance
                  rebalance={latestAllocation}
                  noBorder
                  firstRebalance
                  currentProjectDataName={currentProjectData.name}
                  isDarkMode={isDarkMode}
                />
              )}
            </div>

            <div className="my-6">
              {/* Main Status Text */}
              <span
                className={`text-sm font-medium ${isDarkMode ? 'text-foreground' : ' text-gray-700'}`}
              >
                Allocation History Chart
              </span>
            </div>

            {/* Chart Display */}
            <div
              className={`${isDarkMode ? 'bg-card border-border' : 'bg-white border-green-200 bg-gradient-to-r from-green-50 to-purple-50'}  border  rounded-lg pr-7 md:pr-10 py-6`}
            >
              {chartData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: 0,
                        bottom: 0,
                        left: 0,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="0"
                        strokeLinecap="butt"
                        stroke="rgba(228, 228, 228, 0.2)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        tickFormatter={tick => {
                          const date = new Date(tick);
                          return `${date.getMonth() + 1}/${date.getDate()}`;
                        }}
                        ticks={
                          chartData.length > 0
                            ? chartData
                                .filter((_, index) => index % Math.ceil(chartData.length / 5) === 0)
                                .map(item => item.date)
                            : []
                        }
                      />
                      <YAxis
                        domain={[0, 100]}
                        tickFormatter={tick => `${tick}%`}
                        ticks={[100]}
                        interval={0}
                      />
                      <Tooltip content={renderTooltipContent} />
                      {chartVaultNames.map(vaultName => {
                        const color = generateColor({}, vaultName);
                        return (
                          <Area
                            key={vaultName}
                            type="monotone"
                            dataKey={vaultName}
                            stackId="1"
                            stroke={color}
                            fill={color}
                          />
                        );
                      })}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4
                      className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-lg font-medium mb-2`}
                    >
                      No Allocation Data
                    </h4>
                    <p
                      className={`text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}
                    >
                      Allocation chart will appear here once data is available.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Historical Rebalance History */}
          <div
            id="tableTop"
            className={` rounded-lg border p-6 ${isDarkMode ? 'bg-card border-border' : 'border-gray-100'}`}
          >
            <div className="mb-6">
              <h2
                className={`text-lg font-semibold ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}
              >
                Recent Rebalances
              </h2>
              <p
                className={`text-sm mt-1 ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}
              >
                Historical allocation changes and optimizations
              </p>
            </div>

            <div className="space-y-4">
              {totalRebalances === 0 ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4
                    className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    No Rebalance History
                  </h4>
                  <p
                    className={`text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}
                  >
                    Rebalance history will appear here once the vault starts optimizing allocations.
                  </p>
                </div>
              ) : (
                currentRebalances.map((rebalance, index) => (
                  <Rebalance rebalance={rebalance} key={index} isDarkMode={isDarkMode} />
                ))
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              dataLength={totalRebalances}
              startIndex={startIndex}
              endIndex={endIndex}
              dataPerPage={rebalancesPerPage}
              isDarkMode={isDarkMode}
            />
          </div>
        </>
      )}
    </div>
  );
}
