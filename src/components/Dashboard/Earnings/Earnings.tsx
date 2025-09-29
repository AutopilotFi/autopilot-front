import { Download, History } from 'lucide-react';
import { Earnings, ProjectData, UserStats } from '@/types/globalAppTypes';
import StatsGrid from '@/components/StatsGrid';
import { generateEarningsGridStructure } from '@/components/StatsGrid/gridStructure';
import StandardCTAButton from '@/components/UI/StandardCTAButton';
import { useState } from 'react';
import { formatBalance } from '@/helpers/utils';
import Pagination from '@/components/UI/Pagination';
import EmptyEarnings from './EmptyEarnings';
import DesktopEarnings from '@/components/EarningsPage/DesktopEarnings';
import MobileEarnings from '@/components/EarningsPage/MobileEarnings';

export default function EarningsTab({
  currentProjectData,
  isNewUser,
  userStatsData,
  handleNavigateToDeposit,
  isMobile,
  isDarkMode,
}: {
  currentProjectData: ProjectData;
  isNewUser: boolean;
  userStatsData: UserStats;
  handleNavigateToDeposit: () => void;
  isMobile?: boolean;
  isDarkMode?: boolean;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 10;
  const startIndex = (currentPage - 1) * dataPerPage;
  const endIndex = startIndex + dataPerPage;
  const currentEarnings: Earnings = currentProjectData.recentEarnings.slice(startIndex, endIndex);

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
        formatBalance(earning.amount, currentProjectData.asset, undefined, true),
        formatBalance(earning.value, currentProjectData.asset, undefined, true),
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
      <StatsGrid
        gridStructure={generateEarningsGridStructure(currentProjectData, userStatsData)}
        isMobile={isMobile}
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
          {currentEarnings.length > 0 ? (
            <>
              {isMobile === false && (
                <DesktopEarnings
                  earnings={currentEarnings}
                  isDarkMode={isDarkMode}
                  showFullDate
                  hideProtocol
                  hideNetwork
                  hideAutopilot
                />
              )}
              {isMobile === true && (
                <div className="space-y-3">
                  <MobileEarnings
                    earnings={currentEarnings}
                    isDarkMode={isDarkMode}
                    showFullDate
                    hideProtocolIcon
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyEarnings
              balance={Number(userStatsData.totalBalance)}
              handleAction={handleNavigateToDeposit}
            />
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
