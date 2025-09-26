"use client"

import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectData, VaultHistoryData, MarketBalance } from "@/types/globalAppTypes";
import { useState, useMemo, useCallback } from "react";
import { useIPORVaults } from "@/providers/VaultProvider";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { generateColor } from '@/helpers/utils';
import { getCurrentAllocations } from '@/helpers/allocationUtils';


interface RebalanceData {
  id: number;
  timestamp: number;
  allocations: {
    name: string;
    percentage: number;
    color: string;
  }[];
}

export default function Allocations({ currentProjectData, isNewUser, handleNavigateToDeposit }: {
  currentProjectData: ProjectData,
  isNewUser: boolean,
  handleNavigateToDeposit: () => void,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const rebalancesPerPage = 5;
  const { iporVaultData } = useIPORVaults();

  // Function to get vault name from marketId using allocPointData
  const getVaultNameFromMarketId = useCallback((marketId: string, allocPointData: { hVaultAddress?: string; hVaultId: string }[]) => {
    const allocPoint = allocPointData?.find(ap => ap.hVaultAddress?.toLowerCase() === marketId.toLowerCase());
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
  }, []);

  // Function to process plasmaHistory and convert to rebalance format
  const processPlasmaHistoryToRebalances = useCallback((plasmaHistory: VaultHistoryData[], allocPointData: { hVaultAddress?: string; hVaultId: string }[]): RebalanceData[] => {
    if (!plasmaHistory || plasmaHistory.length === 0) return [];

    return plasmaHistory
      .filter(history => history.marketBalances && history.marketBalances.length > 0)
      .map((history, index) => {
        const totalBalance = parseFloat(history.totalBalance) || 0;
        
        const allocations = history.marketBalances
          .filter((marketBalance: MarketBalance) => 
            marketBalance.protocol.toLowerCase() !== 'erc20'
          )
          .map((marketBalance: MarketBalance) => {
            const balance = parseFloat(marketBalance.balance) || 0;
            const percentage = totalBalance > 0 ? (balance / totalBalance) * 100 : 0;
            const vaultName = getVaultNameFromMarketId(marketBalance.marketId, allocPointData);
            
            return {
              name: vaultName,
              percentage: Math.round(percentage * 100) / 100,
              color: generateColor({}, vaultName)
            };
          })
          .filter(allocation => allocation.percentage > 0)
          .sort((a, b) => b.percentage - a.percentage);

        const timestamp = new Date(history.blockTimestamp).getTime();
        
        return {
          id: index + 1,
          timestamp: timestamp,
          allocations
        };
      })
      .filter(rebalance => rebalance.allocations.length > 0)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [getVaultNameFromMarketId]);

  const realRebalances = useMemo(() => {
    const currentVault = iporVaultData.find(vault => 
      vault.vaultAddress.toLowerCase() === currentProjectData.vaultAddress.toLowerCase()
    );
    
    if (currentVault?.plasmaHistory && currentVault.allocPointData) {
      return processPlasmaHistoryToRebalances(currentVault.plasmaHistory, currentVault.allocPointData);
    }
    
    return [];
  }, [iporVaultData, currentProjectData.vaultAddress, processPlasmaHistoryToRebalances]);

  // Get current allocations using the shared utility function
  const currentAllocations = useMemo(() => {
    const currentVault = iporVaultData.find(vault => 
      vault.vaultAddress.toLowerCase() === currentProjectData.vaultAddress.toLowerCase()
    );
    
    if (currentVault?.plasmaHistory && currentVault.allocPointData) {
      return getCurrentAllocations(currentVault.plasmaHistory, currentVault.allocPointData);
    }
    
    return [];
  }, [iporVaultData, currentProjectData.vaultAddress]);

  const chartData = useMemo(() => {
    const currentVault = iporVaultData.find(vault => 
      vault.vaultAddress.toLowerCase() === currentProjectData.vaultAddress.toLowerCase()
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
          .filter((marketBalance: MarketBalance) => 
            marketBalance.protocol.toLowerCase() !== 'erc20'
          )
          .forEach((marketBalance: MarketBalance) => {
            const balance = parseFloat(marketBalance.balance) || 0;
            const percentage = totalBalance > 0 ? (balance / totalBalance) * 100 : 0;
            
            if (percentage > 0.001) {
              const vaultName = getVaultNameFromMarketId(marketBalance.marketId, currentVault.allocPointData || []);
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
  const totalPages = Math.ceil(totalRebalances / rebalancesPerPage);
  const startIndex = (currentPage - 1) * rebalancesPerPage;
  const endIndex = startIndex + rebalancesPerPage;
  const currentRebalances = rebalances.slice(1).slice(startIndex, endIndex);
  
  const latestAllocation = currentAllocations.length > 0 ? {
    id: 0,
    timestamp: Date.now(),
    allocations: currentAllocations.map(allocation => ({
      name: allocation.name,
      percentage: allocation.percentage,
      color: allocation.color
    }))
  } : null;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 0) {
      return 'Just now';
    }
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hr${hours !== 1 ? 's' : ''} ago`;
    } else if (days < 7) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (days < 30) {
      return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    } else if (days < 365) {
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
  };

  const renderTooltipContent = (props: { payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string | number }) => {
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
            .filter((entry: { value: number; dataKey: string; color: string }) => entry.value !== 0 && entry.value !== null)
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
            })
          }
          </div>
      </div>
    );
  };


  return (
    <div className="space-y-8">
      {isNewUser ? (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="text-center py-16">
            <RefreshCw className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Allocation History</h4>
            <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
              Track how your funds are allocated across different yield sources and see historical rebalancing events.
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
          {/* Allocation Chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            
            {/* Live Allocation Display */}
            {latestAllocation && (
              <>
                {/* Allocation Display */}
                <div className="bg-gradient-to-r from-green-50 to-purple-50 border border-green-200 rounded-lg p-6 mb-6">
                {/* Allocation Bar */}
                <div className="flex items-center bg-gradient-to-r from-green-50 to-purple-50 border border-green-200 rounded-full px-4 py-2 space-x-2 shadow-sm mb-4 w-fit">
                  {/* Live Status Dot with Animation */}
                  <div className="relative flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                  
                  <span className="text-xs font-medium text-gray-700">
                    Live allocation to the best Morpho yield sources
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="h-full flex">
                      {latestAllocation?.allocations.map((allocation, allocIndex) => (
                        <div 
                          key={allocIndex}
                          className="h-full" 
                          style={{ 
                            width: `${allocation.percentage}%`,
                            backgroundColor: allocation.color
                          }} 
                          title={allocation.name}
                        ></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {latestAllocation?.allocations.map((allocation, allocIndex) => (
                      <div key={allocIndex} className="flex items-center space-x-2">
                        <div 
                          className="w-2 h-2 rounded flex-shrink-0"
                          style={{ backgroundColor: allocation.color }}
                        ></div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-800 truncate">{allocation.name}</div>
                          <div className="text-gray-600">{allocation.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              </>
            )}
            <div className="mb-6">
              <div className="flex items-center">
                <div className="flex items-center bg-gradient-to-r from-green-50 to-purple-50 border border-green-200 rounded-full px-3 py-1.5 space-x-2 shadow-sm">
                  {/* Live Status Dot with Animation */}
                  <div className="relative flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                  
                  {/* Main Status Text */}
                  <span className="text-sm font-medium text-gray-700">
                    Allocation Chart
                  </span>
                </div>
              </div>
            </div>
            {/* Chart Display */}
            <div className="bg-gradient-to-r from-green-50 to-purple-50 border border-green-200 rounded-lg pr-10 py-6">
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
                        tickFormatter={(tick) => {
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
                        tickFormatter={(tick) => `${tick}%`}
                        ticks={Array.from({ length: 6 }, (_, index) => index * 20)}
                        interval={0}
                      />
                      <Tooltip content={renderTooltipContent} />
                      {chartVaultNames.map((vaultName) => {
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
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Allocation Data</h4>
                    <p className="text-sm text-gray-600">
                      Allocation chart will appear here once data is available.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Historical Rebalance History */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Rebalances</h2>
              <p className="text-sm text-gray-600 mt-1">Historical allocation changes and optimizations</p>
            </div>
            
            <div className="space-y-4">
              {totalRebalances === 0 ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Rebalance History</h4>
                  <p className="text-sm text-gray-600">
                    Rebalance history will appear here once the vault starts optimizing allocations.
                  </p>
                </div>
              ) : (
                currentRebalances.map((rebalance, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg border border-purple-200 flex items-center space-x-2">
                        <RefreshCw className="w-3 h-3" />
                        <span className="text-xs font-medium">Rebalance #{rebalance.id}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      {formatTimeAgo(rebalance.timestamp)}
                    </div>
                  </div>
                  
                  {/* Allocation Bar */}
                  <div className="space-y-3">
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="h-full flex">
                        {rebalance.allocations.map((allocation, allocIndex) => (
                          <div 
                            key={allocIndex}
                            className="h-full" 
                            style={{ 
                              width: `${allocation.percentage}%`,
                              backgroundColor: allocation.color
                            }} 
                            title={allocation.name}
                          ></div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                      {rebalance.allocations.map((allocation, allocIndex) => (
                        <div key={allocIndex} className="flex items-center space-x-2">
                          <div 
                            className="w-2 h-2 rounded flex-shrink-0"
                            style={{ backgroundColor: allocation.color }}
                          ></div>
                          <div className="min-w-0">
                            <div className="font-medium text-gray-800 truncate">{allocation.name}</div>
                            <div className="text-gray-600">{allocation.percentage}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center space-x-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current page
                      if (
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded-lg text-sm border transition-colors ${
                              page === currentPage
                                ? 'bg-[#9159FF] text-white border-[#9159FF]'
                                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 || 
                        page === currentPage + 2
                      ) {
                        return <span key={page} className="px-1 text-gray-400">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  
                  <button 
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center space-x-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

