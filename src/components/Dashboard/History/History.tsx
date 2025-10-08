'use clinet';
import { Download, History } from 'lucide-react';
import { ProjectData, UserStats } from '@/types/globalAppTypes';
import StatsGrid from '@/components/StatsGrid';
import { generateHistoryGridStructure } from '@/components/StatsGrid/gridStructure';
import StandardCTAButton from '@/components/UI/StandardCTAButton';
import { useState } from 'react';
import Pagination from '@/components/UI/Pagination';
import MobileHistory from './MobileHistory';
import DesktopHistory from './DesktopHistory';
import { formatBalance } from '@/helpers/utils';

export default function HistoryTab({
  currentProjectData,
  userStatsData,
  isNewUser,
  handleNavigateToDeposit,
  isMobile,
  isDarkMode,
}: {
  currentProjectData: ProjectData;
  userStatsData: UserStats;
  isNewUser: boolean;
  handleNavigateToDeposit: () => void;
  isMobile?: boolean;
  isDarkMode?: boolean;
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
        formatBalance(transaction.amount, currentProjectData.asset, undefined, true).replace(
          ',',
          ' '
        ),
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
        isMobile={isMobile}
        isDarkMode={isDarkMode}
      />
      {isNewUser || totalTransactions === 0 ? (
        <div
          className={`rounded-xl border p-6 ${
            isDarkMode ? 'bg-card border-border' : 'bg-white border-gray-100'
          }`}
        >
          <div className="text-center py-16">
            <History
              className={`w-16 h-16 mx-auto mb-4 ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-400'
              }`}
            />
            <h4
              className={`text-lg font-semibold mb-2 ${
                isDarkMode ? 'text-foreground' : 'text-gray-900'
              }`}
            >
              Transaction History
            </h4>
            <p
              className={`text-sm mb-6 max-w-md mx-auto ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-600'
              }`}
            >
              All your deposits, withdrawals, and other transactions will be tracked here once you
              start using the Autopilot.
            </p>
            <StandardCTAButton onClick={handleNavigateToDeposit}>Start Earning</StandardCTAButton>
          </div>
        </div>
      ) : (
        <div
          className={`rounded-xl border p-4 md:p-6 ${
            isDarkMode ? 'bg-card border-border' : 'bg-white border-gray-100'
          }`}
        >
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3
              className={`text-base md:text-lg font-semibold ${
                isDarkMode ? 'text-foreground' : 'text-gray-900'
              }`}
            >
              Transaction History
            </h3>
            {userStatsData?.transactions?.length > 0 && !isMobile && (
              <button
                className="text-sm bg-[#9159FF] text-white px-3 py-1.5 rounded-lg hover:bg-[#7c3aed] transition-colors flex items-center space-x-2 flex-shrink-0"
                onClick={handleExportCSV}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
                <span className="sm:hidden">Export</span>
              </button>
            )}
          </div>

          {/* Mobile card layout */}
          {isMobile && (
            <MobileHistory
              currentProjectData={currentProjectData}
              currentTransactions={currentTransactions}
              isDarkMode={isDarkMode}
            />
          )}

          {isMobile === false && (
            <DesktopHistory
              currentProjectData={currentProjectData}
              currentTransactions={currentTransactions}
              isDarkMode={isDarkMode}
            />
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            dataLength={userStatsData?.transactions?.length}
            startIndex={startIndex}
            endIndex={endIndex}
            dataPerPage={dataPerPage}
            isDarkMode={isDarkMode}
          />
        </div>
      )}
    </div>
  );
}
