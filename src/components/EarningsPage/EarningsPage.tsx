'use client';
import { useState, useContext } from 'react';
import { Earnings } from '@/types/globalAppTypes';
import { GlobalContext } from '@/providers/GlobalDataProvider';
import Pagination from '../UI/Pagination';
import DesktopEarnings from './DesktopEarnings';
import MobileEarnings from './MobileEarnings';
import { Account } from 'viem';
import EmptyStateComponent from '../UI/EmptyStateComponent';
import { useRouter } from 'next/navigation';

export default function EarningsPage({
  earningsData,
  isLoading,
  userTotalBalance,
  account,
}: {
  earningsData: Earnings;
  isLoading: boolean;
  userTotalBalance: number;
  account: Account | null;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy] = useState<'timestamp' | 'amount' | 'usdValue'>('timestamp');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');
  const { user, isMobile, isDarkMode } = useContext(GlobalContext);
  const router = useRouter();

  const itemsPerPage = 25;
  const isNewUser = user.status === 'new';

  const allTransactions = isNewUser ? [] : earningsData;

  // Apply sorting (no filters for now)
  const sortedTransactions = [...allTransactions].sort((a, b) => {
    let aValue: number;
    let bValue: number;

    switch (sortBy) {
      case 'timestamp':
        aValue = a.time;
        bValue = b.time;
        break;
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'usdValue':
        aValue = a.value;
        bValue = b.value;
        break;
    }

    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Paginate results
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);
  const paginatedEarnings: Earnings = sortedTransactions.slice(startIndex, endIndex);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <header
        className={`pt-[25px] border-b sticky top-0 z-40 ${
          isDarkMode ? 'bg-card border-border' : 'bg-white border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-10 sm:px-12 lg:px-14 py-4 ml-7 md:ml-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 min-h-[49.25px]">
              <div>
                <h1 className={`font-semibold ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}>
                  Earnings
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-gray-500'}`}>
                  {isNewUser ? 'No earnings yet' : 'Full History'}
                  {isNewUser && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      New User View
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className={`flex-1 ${isDarkMode ? 'bg-background' : 'bg-gray-50'}`}>
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-15">
          <div className="space-y-6">
            {/* Earnings Table */}
            <div
              id="tableTop"
              className={`rounded-xl border p-6 overflow-x-hidden ${
                isDarkMode ? 'bg-card border-border' : 'bg-white border-gray-100'
              }`}
            >
              {allTransactions.length > 0 ? (
                <>
                  {/* Desktop Earnings Table */}
                  {isMobile === false && (
                    <DesktopEarnings earnings={paginatedTransactions} isDarkMode={isDarkMode} />
                  )}

                  {/* Mobile Earnings Cards */}
                  {isMobile === true && (
                    <MobileEarnings
                      earnings={paginatedEarnings}
                      isDarkMode={isDarkMode}
                      showNetwork
                      borderBottom
                    />
                  )}
                </>
              ) : isLoading ? (
                <div
                  className={`rounded-xl p-6 text-center py-22 ${
                    isDarkMode ? 'bg-card' : 'bg-white'
                  }`}
                >
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9159FF] mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading earnings data...</p>
                </div>
              ) : (
                <EmptyStateComponent
                  balance={account ? userTotalBalance : 0}
                  handleAction={() => router.push(`/base/morpho/USDC#deposit`)}
                  isDarkMode={isDarkMode}
                />
              )}

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                dataLength={allTransactions?.length}
                startIndex={startIndex}
                endIndex={endIndex}
                dataPerPage={itemsPerPage}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
