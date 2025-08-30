'use clinet';

import { ArrowDown, ArrowUp, Download, History } from 'lucide-react';
import { AutopilotProduct, ProjectData, UserStats } from '@/types/globalAppTypes';
import StatsGrid from '@/components/StatsGrid';
import { generateUserHistoryStatsGridStructure } from '@/components/StatsGrid/gridStructure';
import StandardCTAButton from '@/components/UI/StandardCTAButton';

export default function HistoryTab({
  currentProjectData,
  userStatsData,
  isNewUser,
  handleNavigateToDeposit,
  isMobile,
}: {
  currentProjectData: ProjectData;
  userStatsData: UserStats;
  isNewUser: boolean;
  handleNavigateToDeposit: () => void;
  selectedAutopilot: AutopilotProduct;
  dataKey: keyof UserStats;
  isMobile?: boolean;
}) {
  return (
    <div className="space-y-8">
      <StatsGrid
        gridStructure={generateUserHistoryStatsGridStructure(currentProjectData)}
        userStatsData={userStatsData}
        currentProjectData={currentProjectData}
        isNewUser={isNewUser}
      />
      {isNewUser ? (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="text-center py-16">
            <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Transaction History</h4>
            <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
              All your deposits, withdrawals, and other transactions will be tracked here once you
              start using the Autopilot.
            </p>
            <StandardCTAButton onClick={handleNavigateToDeposit}>Start Earning</StandardCTAButton>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              Transaction History
            </h3>
            <button className="text-sm bg-[#9159FF] text-white px-3 py-1.5 rounded-lg hover:bg-[#7c3aed] transition-colors flex items-center space-x-2 flex-shrink-0">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>

          {/* Mobile card layout */}
          {isMobile && (
            <div className="md:hidden space-y-3">
              {(() => {
                const depositWithdrawalHistory = userStatsData?.transactions || [];
                return depositWithdrawalHistory.map((transaction, index) => {
                  const date = new Date(transaction.date);
                  const formatDate = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                  const formatTime = date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  });
                  const truncatedHash = `${transaction.txHash.slice(0, 6)}...${transaction.txHash.slice(-4)}`;

                  return (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-purple-50 transition-colors"
                    >
                      {/* Header with type and amount */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              transaction.type === 'Deposit'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {transaction.type === 'Deposit' ? (
                              <ArrowDown className="w-4 h-4" />
                            ) : (
                              <ArrowUp className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.type}
                            </div>
                            <div className="text-xs text-gray-500">{transaction.status}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-sm font-medium ${
                              transaction.type === 'Deposit' ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {transaction.type === 'Withdrawal' ? '-' : '+'}
                            {transaction.amount.toLocaleString('en-US', {
                              minimumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                              maximumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                            })}{' '}
                            {currentProjectData.asset}
                          </div>
                        </div>
                      </div>

                      {/* Bottom section with time and tx hash */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Time</div>
                          <div className="text-sm text-gray-700">
                            {formatDate} {formatTime}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">Transaction</div>
                          <div className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-mono">
                            {truncatedHash}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}

          {isMobile === false && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Type
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Time
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Tx ID
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const depositWithdrawalHistory = userStatsData?.transactions || [];

                    return depositWithdrawalHistory.map((transaction, index) => {
                      const date = new Date(transaction.date);
                      const formatDate = date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      });
                      const formatTime = date.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      });
                      const truncatedHash = `${transaction.txHash.slice(0, 6)}...${transaction.txHash.slice(-4)}`;
                      return (
                        <tr
                          key={index}
                          className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.type}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.type === 'Withdrawal' ? '-' : '+'}
                              {transaction.amount.toLocaleString('en-US', {
                                minimumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                                maximumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                              })}{' '}
                              {currentProjectData.asset}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.status}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="text-sm text-gray-500">
                              {formatDate} {formatTime}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-mono">
                              {truncatedHash}
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 md:mt-6 space-y-3 sm:space-y-0">
            <div className="text-sm text-gray-500 text-center sm:text-left">
              Showing 1 to 6 of 6 entries
            </div>
            <div className="flex justify-center sm:justify-end space-x-2">
              <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex-shrink-0">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex-shrink-0">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
