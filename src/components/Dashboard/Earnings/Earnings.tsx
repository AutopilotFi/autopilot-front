import { Download, RotateCcw, History } from 'lucide-react';
import { ProjectData, UserStats } from '@/types/globalAppTypes';
import StatsGrid from '@/components/StatsGrid';
import { generateEarningsGridStructure } from '@/components/StatsGrid/gridStructure';
import StandardCTAButton from '@/components/UI/StandardCTAButton';
import Image from 'next/image';
import { useState } from 'react';
import { formatBalance } from '@/helpers/utils';
import Pagination from '@/components/UI/Pagination';
import EmptyEarnings from './EmptyEarnings';

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
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 10;
  const startIndex = (currentPage - 1) * dataPerPage;
  const endIndex = startIndex + dataPerPage;
  const currentEarnings = currentProjectData.recentEarnings.slice(startIndex, endIndex);

  const handleExportCSV = () => {
    if (currentProjectData.recentEarnings.length === 0) {
      return;
    }

    // Create CSV content
    const headers = ['Asset', 'Action', 'Amount', 'USD Value', 'Date', 'Time'];
    const csvRows = [headers];

    currentProjectData.recentEarnings.forEach(earning => {
      const date = new Date(Number(earning.time) * 1000);

      // Format date as YYYY-MM-DD for exact format
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formatDate = `${year}-${month}-${day}`;

      // Format time as HH:MM:SS for exact format
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const formatTime = `${hours}:${minutes}:${seconds}`;

      const row = [
        currentProjectData.asset,
        'Autocompounded',
        earning.amount.toString(),
        earning.amountUsd.toString(),
        formatDate,
        formatTime,
      ];
      csvRows.push(row);
    });

    // Convert to CSV string
    const csvContent = csvRows.map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `${currentProjectData.asset}_earnings_history_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <StatsGrid gridStructure={generateEarningsGridStructure(currentProjectData, userStatsData)} />
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
            <button
              className="text-sm bg-[#9159FF] text-white px-3 py-1.5 rounded-lg hover:bg-[#7c3aed] transition-colors flex items-center space-x-2 flex-shrink-0"
              onClick={handleExportCSV}
              disabled={currentProjectData.recentEarnings.length === 0}
            >
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
                  {currentEarnings.length > 0 ? (
                    currentEarnings.map((earning, index) => {
                      const date = new Date(Number(earning.time) * 1000); // Convert Unix timestamp to Date
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
                              {formatBalance(
                                earning.amount,
                                currentProjectData.asset,
                                currentProjectData.showDecimals
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {formatBalance(earning.amountUsd, 'USD', 2)}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="text-sm text-gray-500">
                              {formatDate} {formatTime}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="pt-10 pb-6 text-center">
                        <EmptyEarnings handleAction={handleNavigateToDeposit} />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {isMobile === true && (
            <div className="space-y-3">
              {currentEarnings.length > 0 ? (
                currentEarnings.map((earning, index) => {
                  const date = new Date(Number(earning.time) * 1000); // Convert Unix timestamp to Date
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
                            {formatBalance(
                              earning.amount,
                              currentProjectData.asset,
                              currentProjectData.showDecimals
                            )}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">USD Value</div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatBalance(earning.amountUsd, 'USD', 2)}
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
                })
              ) : (
                <EmptyEarnings handleAction={handleNavigateToDeposit} />
              )}
            </div>
          )}
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            dataLength={currentProjectData.recentEarnings.length}
            startIndex={startIndex}
            endIndex={endIndex}
            dataPerPage={dataPerPage}
          />
        </div>
      )}
    </div>
  );
}
