'use clinet';

import { ArrowDown, ArrowUp, Download, History } from 'lucide-react';
import { ProjectData, UserStats } from '@/types/globalAppTypes';
import StatsGrid from '@/components/StatsGrid';
import { generateHistoryGridStructure } from '@/components/StatsGrid/gridStructure';
import StandardCTAButton from '@/components/UI/StandardCTAButton';
import { useState } from 'react';
import { getExplorerLink } from '@/helpers/utils';
import Pagination from '@/components/UI/Pagination';

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
  isMobile?: boolean;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 10;

  const totalTransactions = userStatsData?.transactions?.length || 0;
  const startIndex = (currentPage - 1) * dataPerPage;
  const endIndex = startIndex + dataPerPage;
  const currentTransactions = userStatsData?.transactions?.slice(startIndex, endIndex) || [];

  const handleExportCSV = () => {
    if (!userStatsData?.transactions || userStatsData.transactions.length === 0) {
      return;
    }

    // CSV headers
    const headers = ['Asset', 'Type', 'Amount', 'Status', 'Date', 'Time'];
    const csvRows = [headers];

    // Add data rows
    userStatsData.transactions.forEach(transaction => {
      const date = new Date(transaction.date);

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
        transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
        transaction.amount.toString(),
        transaction.status,
        formatDate,
        formatTime,
      ];
      csvRows.push(row);
    });

    // Convert to CSV string
    const csvContent = csvRows.map(row => row.join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentProjectData.asset}_transaction_history.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <StatsGrid
        gridStructure={generateHistoryGridStructure(currentProjectData, userStatsData)}
        desktopColumns={3}
      />
      {isNewUser || totalTransactions === 0 ? (
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
            <button
              className="text-sm bg-[#9159FF] text-white px-3 py-1.5 rounded-lg hover:bg-[#7c3aed] transition-colors flex items-center space-x-2 flex-shrink-0"
              onClick={handleExportCSV}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>

          {/* Mobile card layout */}
          {isMobile && (
            <div className="md:hidden space-y-3">
              {currentTransactions.map((transaction, index) => {
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
                const truncatedHash = `${transaction?.txHash?.slice(0, 6)}...${transaction?.txHash?.slice(-4)}`;

                return (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Header with type and amount */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            transaction.type === 'deposit'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {transaction.type === 'deposit' ? (
                            <ArrowUp className="w-4 h-4" />
                          ) : (
                            <ArrowDown className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 capitalize ">
                            {transaction.type}
                          </div>
                          <div className="text-xs text-gray-500">{transaction.status}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-sm font-medium ${
                            transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'withdrawal' ? '-' : '+'}
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
                        <a
                          href={`${getExplorerLink(currentProjectData.chainId || 8453)}/tx/${transaction.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-mono"
                        >
                          {truncatedHash}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                  {currentTransactions.map((transaction, index) => {
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
                    const truncatedHash = `${transaction?.txHash?.slice(0, 6)}...${transaction?.txHash?.slice(-4)}`;
                    return (
                      <tr
                        key={index}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="text-sm font-medium text-gray-900 capitalize ">
                            {transaction.type}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.type === 'deposit' ? '+' : '-'}
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
                          <a
                            href={`${getExplorerLink(currentProjectData.chainId || 8453)}/tx/${transaction.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-mono"
                          >
                            {truncatedHash}
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            dataLength={userStatsData?.transactions?.length}
            startIndex={startIndex}
            endIndex={endIndex}
            dataPerPage={dataPerPage}
          />
        </div>
      )}
    </div>
  );
}
