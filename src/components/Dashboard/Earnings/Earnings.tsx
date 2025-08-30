import { Download, RotateCcw, History } from 'lucide-react';
import { ProjectData, UserStats } from '@/types/globalAppTypes';
import StatsGrid from '@/components/StatsGrid';
import { generateUserEarningStatsGridStructure } from '@/components/StatsGrid/gridStructure';
import StandardCTAButton from '@/components/UI/StandardCTAButton';
import Image from 'next/image';

const generateEarningsData = (baseAmount: number, variance: number, decimals: number) => {
  return [
    {
      date: '2025-06-16T09:18:00',
      amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)),
    },
    {
      date: '2025-06-16T06:30:00',
      amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)),
    },
    {
      date: '2025-06-15T22:40:00',
      amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)),
    },
    {
      date: '2025-06-15T18:15:00',
      amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)),
    },
    {
      date: '2025-06-15T14:33:00',
      amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)),
    },
    {
      date: '2025-06-15T10:20:00',
      amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)),
    },
    {
      date: '2025-06-15T06:10:00',
      amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)),
    },
    {
      date: '2025-06-14T23:45:00',
      amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)),
    },
    {
      date: '2025-06-14T19:30:00',
      amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)),
    },
    {
      date: '2025-06-14T15:22:00',
      amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)),
    },
  ];
};

export default function Earnings({
  currentProjectData,
  isNewUser,
  userStatsData,
  handleNavigateToDeposit,
  isMobile,
}: {
  currentProjectData: ProjectData;
  isNewUser: boolean;
  userStatsData: UserStats;
  handleNavigateToDeposit: () => void;
  isMobile?: boolean;
}) {
  const getEarningsParams = () => {
    if (currentProjectData.asset === 'USDC') return { base: 15, variance: 10, decimals: 2 };
    if (currentProjectData.asset === 'ETH') return { base: 0.003, variance: 0.002, decimals: 6 };
    return { base: 0.0001, variance: 0.00005, decimals: 8 }; // cbBTC
  };

  const earningsParams = getEarningsParams();
  const allEarnings = generateEarningsData(
    earningsParams.base,
    earningsParams.variance,
    earningsParams.decimals
  );

  return (
    <div className="space-y-8">
      <StatsGrid
        gridStructure={generateUserEarningStatsGridStructure(currentProjectData)}
        userStatsData={userStatsData}
        currentProjectData={currentProjectData}
        isNewUser={isNewUser}
      />
      {isNewUser ? (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <History className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Your Earnings History</h4>
            <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
              All your earnings transactions will be tracked here. Start by making your first
              deposit to begin earning yield with the {currentProjectData.asset} Autopilot.
            </p>
            <StandardCTAButton onClick={handleNavigateToDeposit}>Start Earning</StandardCTAButton>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Earnings History</h3>
            <button className="text-sm bg-[#9159FF] text-white px-3 py-1.5 rounded-lg hover:bg-[#7c3aed] transition-colors flex items-center space-x-2 flex-shrink-0">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
          {isMobile === false && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Asset
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Action
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      USD Value
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allEarnings.slice(0, 10).map((earning, index) => {
                    const date = new Date(earning.date);
                    const formatDate = date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                    const formatTime = date.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    });

                    return (
                      <tr
                        key={index}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
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
                            <span className="text-sm font-medium text-gray-900">
                              {currentProjectData.asset}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="relative group">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-[#9159FF] bg-purple-50 border border-purple-200 cursor-help">
                              <RotateCcw className="w-3 h-3 mr-1.5" />
                              Autocompounded
                            </span>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-0 pointer-events-none whitespace-nowrap z-10 max-w-xs">
                              <div className="text-center">
                                The earnings have been automatically
                                <br />
                                turned into more balance of your position,
                                <br />
                                increasing the strength of your earnings going forward
                              </div>
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-sm font-medium text-green-600">
                            +{earning.amount.toFixed(currentProjectData.asset === 'USDC' ? 2 : 6)}{' '}
                            {currentProjectData.asset}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-sm font-medium text-gray-900">
                            $
                            {(
                              earning.amount *
                              (currentProjectData.asset === 'USDC'
                                ? 1
                                : currentProjectData.asset === 'ETH'
                                  ? 4000
                                  : 100000)
                            ).toFixed(2)}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-sm text-gray-500">
                            {formatDate} {formatTime}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {isMobile === true && (
            <div className="space-y-3">
              {allEarnings.slice(0, 10).map((earning, index) => {
                const date = new Date(earning.date);
                const formatDate = date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
                const formatTime = date.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                });
                return (
                  <div
                    key={index}
                    className="bg-[rgba(253,255,255,1)] rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Header with asset and action */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Image
                          width={21}
                          height={21}
                          src={currentProjectData.assetIcon}
                          alt={currentProjectData.asset}
                          className="w-6 h-6 rounded-full flex-shrink-0"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {currentProjectData.asset}
                        </span>
                      </div>
                      <div className="relative group">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-[#9159FF] bg-purple-50 border border-purple-200 cursor-help">
                          <RotateCcw className="w-3 h-3 mr-1.5" />
                          Autocompounded
                        </span>
                        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-0 pointer-events-none whitespace-nowrap z-10 max-w-xs">
                          <div className="text-center">
                            The earnings have been automatically
                            <br />
                            turned into more balance of your position,
                            <br />
                            increasing the strength of your earnings going forward
                          </div>
                          <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom section with amounts and time */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Amount</div>
                        <div className="text-sm font-medium text-green-600">
                          +{earning.amount.toFixed(currentProjectData.asset === 'USDC' ? 2 : 6)}{' '}
                          {currentProjectData.asset}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">USD Value</div>
                        <div className="text-sm font-medium text-gray-900">
                          $
                          {(
                            earning.amount *
                            (currentProjectData.asset === 'USDC'
                              ? 1
                              : currentProjectData.asset === 'ETH'
                                ? 4000
                                : 100000)
                          ).toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Time</div>
                        <div className="text-sm text-gray-500">
                          {formatDate} {formatTime}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {/* Pagination */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="text-sm text-gray-500 mb-4">Showing 1 to 10 of 50 earnings events</div>

            <div className="flex items-center justify-center space-x-2 overflow-x-auto">
              <button
                disabled={true}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                Previous
              </button>

              <div className="flex items-center space-x-1 overflow-x-auto">
                <button className="px-3 py-2 rounded-lg text-sm transition-colors flex-shrink-0 bg-[#9159FF] text-white">
                  1
                </button>
                <button className="px-3 py-2 rounded-lg text-sm transition-colors flex-shrink-0 border border-gray-200 hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-2 rounded-lg text-sm transition-colors flex-shrink-0 border border-gray-200 hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-2 rounded-lg text-sm transition-colors flex-shrink-0 border border-gray-200 hover:bg-gray-50">
                  4
                </button>
                <button className="px-3 py-2 rounded-lg text-sm transition-colors flex-shrink-0 border border-gray-200 hover:bg-gray-50">
                  5
                </button>
              </div>

              <button
                disabled={false}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
