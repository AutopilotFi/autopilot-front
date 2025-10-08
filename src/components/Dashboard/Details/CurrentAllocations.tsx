'use client';
import { AllocationData } from '@/helpers/allocationUtils';
import { formatBalance } from '@/helpers/utils';
import { ProjectData } from '@/types/globalAppTypes';
import { Zap, Layers } from 'lucide-react';
import Image from 'next/image';

export default function CurrentAllocations({
  currentProjectData,
  allocations,
  isOldUser,
  isMobile,
  isDarkMode,
}: {
  currentProjectData: ProjectData;
  allocations: AllocationData[];
  isOldUser: boolean;
  isMobile?: boolean;
  isDarkMode?: boolean;
}) {
  const filteredAllocations = allocations.filter(allocation => allocation.name !== 'Not invested');
  return (
    <div
      className={`rounded-xl border p-4 md:p-6 ${
        isDarkMode ? 'bg-card border-border' : 'bg-white border-gray-100'
      }`}
    >
      <div className="mb-4 md:mb-6">
        <h3
          className={`text-base md:text-lg font-semibold mb-1 ${
            isDarkMode ? 'text-foreground' : 'text-gray-900'
          }`}
        >
          Current Allocation
        </h3>
        <p className={`text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}>
          Live distribution across yield sources
        </p>
      </div>

      {/* Optimization Status */}
      <div
        className={`${isOldUser ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'} border rounded-xl p-3 md:p-4 mb-4 md:mb-6`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div
              className={`w-8 h-8 ${isOldUser ? 'bg-gray-100' : 'bg-green-100'} rounded-lg flex items-center justify-center flex-shrink-0`}
            >
              <Zap className={`w-4 h-4 ${isOldUser ? 'text-gray-600' : 'text-green-600'}`} />
            </div>
            <div className="min-w-0 flex-1">
              <h4
                className={`text-sm font-semibold ${
                  isOldUser ? (isDarkMode ? 'text-foreground' : 'text-gray-900') : 'text-green-900'
                }`}
              >
                {isOldUser ? 'No Active Positions' : 'Optimization Active'}
              </h4>
              <p
                className={`text-xs leading-tight ${
                  isOldUser
                    ? isDarkMode
                      ? 'text-muted-foreground'
                      : 'text-gray-700'
                    : 'text-green-700'
                }`}
              >
                {isOldUser
                  ? 'All funds have been withdrawn'
                  : 'Automatically rebalancing for maximum performance'}
              </p>
            </div>
          </div>
          {/* <div
            className={`${isOldUser ? 'bg-white text-gray-700 border-gray-200/50' : 'bg-white text-green-700 border-green-200/50'} px-2 md:px-3 py-1 rounded-lg text-xs font-medium border flex-shrink-0`}
          >
            <span className="hidden sm:inline">
              {isOldUser ? 'Inactive' : 'Last rebalance: 2h'}
            </span>
            <span className="sm:hidden">{isOldUser ? 'Inactive' : '2h'}</span>
          </div> */}
        </div>
      </div>

      {/* Mobile card layout - No Active Allocations */}
      {isOldUser && isMobile && (
        <div className="py-8 text-center">
          <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4
            className={`text-lg font-semibold mb-2 ${
              isDarkMode ? 'text-foreground' : 'text-gray-900'
            }`}
          >
            No Active Allocations
          </h4>
          <p
            className={`text-sm mb-4 px-4 ${
              isDarkMode ? 'text-muted-foreground' : 'text-gray-600'
            }`}
          >
            You have withdrawn all funds. Your historical allocation data is preserved in the
            details section.
          </p>
        </div>
      )}

      {/* Mobile card layout - Active Allocations */}
      {!isOldUser && isMobile && (
        <div className="space-y-3">
          {filteredAllocations.map(allocation => (
            <div
              key={allocation.marketId}
              className={`rounded-lg p-4 transition-colors ${
                isDarkMode ? 'bg-muted hover:bg-purple-900/20' : 'bg-gray-50 hover:bg-purple-50'
              }`}
            >
              {/* Header with source and APY */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Image
                    width={21}
                    height={21}
                    src={currentProjectData.assetIcon}
                    alt={currentProjectData.asset}
                    className="w-6 h-6 rounded-full flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-sm font-medium leading-tight break-words ${
                        isDarkMode ? 'text-foreground' : 'text-gray-900'
                      }`}
                    >
                      {allocation.name}
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Image
                        width={10.5}
                        height={10.5}
                        src={'/projects/morpho.png'}
                        alt="Morpho"
                        className="w-3 h-3 flex-shrink-0"
                      />
                      <span
                        className={`text-xs ${
                          isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                        }`}
                      >
                        {currentProjectData.name}
                      </span>
                    </div>
                  </div>
                </div>
                {/* <div className={`text-sm font-medium flex-shrink-0 ${
                                isDarkMode ? 'text-foreground' : 'text-gray-900'
                              }`}>
                  {allocation.apy.toFixed(2)}%
                </div> */}
              </div>

              {/* Bottom row with amount and allocation */}
              <div
                className={`flex items-center justify-between pt-3 border-t ${
                  isDarkMode ? 'border-border' : 'border-gray-200'
                }`}
              >
                <div>
                  <div
                    className={`text-xs mb-1 ${
                      isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                    }`}
                  >
                    AUTOPILOT TVL
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      isDarkMode ? 'text-foreground' : 'text-gray-900'
                    }`}
                  >
                    {formatBalance(
                      allocation.amount ?? 0,
                      currentProjectData.asset,
                      currentProjectData.showDecimals
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-xs mb-1 ${
                      isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                    }`}
                  >
                    Allocation
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      isDarkMode ? 'text-foreground' : 'text-gray-900'
                    }`}
                  >
                    {(allocation.percentage ?? 0) < 0.01
                      ? '<0.01'
                      : (allocation.percentage ?? 0).toFixed(2)}
                    %
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop table layout */}
      {isMobile === false && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-border' : 'border-gray-100'}`}>
                <th
                  className={`text-left py-3 px-4 text-xs font-medium uppercase tracking-wide ${
                    isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                  }`}
                >
                  Yield Source
                </th>
                {/* <th className={`text-right py-3 px-4 text-xs font-medium uppercase tracking-wide ${
                              isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                            }`}>
                  7d APY
                </th> */}
                <th
                  className={`text-right py-3 px-4 text-xs font-medium uppercase tracking-wide ${
                    isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                  }`}
                >
                  AUTOPILOT TVL
                </th>
                <th
                  className={`text-right py-3 px-4 text-xs font-medium uppercase tracking-wide ${
                    isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                  }`}
                >
                  Allocation
                </th>
              </tr>
            </thead>
            <tbody>
              {isOldUser ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="text-center">
                      <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4
                        className={`text-lg font-semibold mb-2 ${
                          isDarkMode ? 'text-foreground' : 'text-gray-900'
                        }`}
                      >
                        No Active Allocations
                      </h4>
                      <p
                        className={`text-sm mb-4 ${
                          isDarkMode ? 'text-muted-foreground' : 'text-gray-600'
                        }`}
                      >
                        You have withdrawn all funds. Your historical allocation data is preserved
                        in the details section.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAllocations.map((allocation, index) => (
                  <tr
                    key={index}
                    className={`border-b transition-colors ${
                      isDarkMode
                        ? 'border-border hover:bg-purple-900/20'
                        : 'border-gray-50 hover:bg-purple-50'
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <Image
                          width={21}
                          height={21}
                          src={currentProjectData.assetIcon}
                          alt={currentProjectData.asset}
                          className="w-6 h-6 rounded-full"
                        />
                        <div>
                          <div
                            className={`text-sm font-medium ${
                              isDarkMode ? 'text-foreground' : 'text-gray-900'
                            }`}
                          >
                            {allocation.name}
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <Image
                              width={10.5}
                              height={10.5}
                              src={'/projects/morpho.png'}
                              alt="Morpho"
                              className="w-3 h-3"
                            />
                            <span
                              className={`text-xs ${
                                isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                              }`}
                            >
                              {currentProjectData.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* <td className="py-4 px-4 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {allocation.apy.toFixed(2)}%
                      </div>
                    </td> */}
                    <td className="py-4 px-4 text-right">
                      <div
                        className={`text-sm font-medium ${
                          isDarkMode ? 'text-foreground' : 'text-gray-900'
                        }`}
                      >
                        {formatBalance(
                          allocation.amount ?? 0,
                          currentProjectData.asset,
                          currentProjectData.showDecimals
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div
                        className={`text-sm font-medium ${
                          isDarkMode ? 'text-foreground' : 'text-gray-900'
                        }`}
                      >
                        {(allocation.percentage ?? 0) < 0.01
                          ? '<0.01'
                          : (allocation.percentage ?? 0).toFixed(2)}
                        %
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
