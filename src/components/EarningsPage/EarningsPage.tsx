'use client';
import { useState, useContext } from 'react';
import { RotateCcw } from 'lucide-react';
import { EarningTransaction } from '@/types/globalAppTypes';
import { GlobalContext } from '@/providers/GlobalDataProvider';
import Image from 'next/image';
import { formatBalance, formatFrequency } from '@/helpers/utils';
import Pagination from '../UI/Pagination';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import EmptyEarnings from '../Dashboard/Earnings/EmptyEarnings';

export default function EarningsPage({
  earningsData,
  isLoading,
}: {
  earningsData: EarningTransaction[];
  isLoading: boolean;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy] = useState<'timestamp' | 'amount' | 'usdValue'>('timestamp');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');
  const globalData = useContext(GlobalContext);
  const user = globalData?.user;
  const isMobile = globalData?.isMobile;
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
        aValue = a.timestamp.getTime();
        bValue = b.timestamp.getTime();
        break;
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'usdValue':
        aValue = a.usdValue;
        bValue = b.usdValue;
        break;
    }

    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Paginate results
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

  const getAssetIcon = (asset: string): string => {
    switch (asset) {
      case 'USDC':
        return '/coins/usdc.svg';
      case 'ETH':
        return '/coins/eth.svg';
      case 'cbBTC':
        return '/coins/cbBTC.svg';
      default:
        return '/coins/usdc.svg';
    }
  };

  const getProtocolIcon = (protocol: string) => {
    return protocol === 'morpho' ? '/projects/morpho.png' : '/projects/euler.png';
  };

  const formatFullTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  const getActionBadge = () => {
    return (
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
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-10 sm:px-12 lg:px-14 py-4 ml-7 md:ml-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="font-semibold text-gray-900">Earnings</h1>
                <p className="text-sm text-gray-500">
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

      <main className="flex-1">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-15">
          <div className="space-y-6">
            {/* Earnings Table */}
            <div
              className={clsx('bg-white rounded-xl border border-gray-100 p-6 overflow-x-hidden')}
            >
              {/* Desktop Earnings Table */}
              {isMobile === false && (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide min-w-[200px]">
                          Autopilot Product
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide min-w-[120px]">
                          Action
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide min-w-[120px]">
                          Earned Amount
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide min-w-[100px]">
                          USD Value
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide min-w-[80px]">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {earningsData.length > 0 ? (
                        paginatedTransactions.map(transaction => (
                          <tr
                            key={transaction.id}
                            className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <Image
                                  width={21}
                                  height={21}
                                  src={getAssetIcon(transaction.asset)}
                                  alt={transaction.asset}
                                  className="w-6 h-6 rounded-full flex-shrink-0"
                                />
                                <div className="min-w-0">
                                  <span className="text-sm font-medium text-gray-900 truncate block">
                                    {transaction.asset} Autopilot
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <Image
                                      width={10.5}
                                      height={10.5}
                                      src={getProtocolIcon(transaction.protocol)}
                                      alt={transaction.protocol}
                                      className="w-3 h-3 flex-shrink-0"
                                    />
                                    <span className="text-xs text-gray-500">Morpho</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">{getActionBadge()}</td>
                            <td className="py-4 px-4 text-right">
                              <div className="text-sm font-medium text-green-600 truncate">
                                {formatBalance(
                                  transaction.amount,
                                  transaction.asset,
                                  transaction.showDecimals
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {formatBalance(transaction.usdValue, 'USD', 2)}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div
                                className="text-sm text-gray-500 cursor-help"
                                title={formatFullTimestamp(transaction.timestamp)}
                              >
                                {formatFrequency(
                                  Date.now() / 1000 - Number(transaction.timestamp) / 1000
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5}>
                            {isLoading ? (
                              <div className="bg-white rounded-xl border border-gray-100 p-6 text-center py-22">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9159FF] mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading earnings data...</p>
                              </div>
                            ) : (
                              <EmptyEarnings
                                handleAction={() => router.push(`/base/morpho/USDC#deposit`)}
                              />
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Mobile Earnings Cards */}
              {isMobile === true && (
                <div className="space-y-4">
                  {earningsData.length > 0 ? (
                    paginatedTransactions.map(transaction => (
                      <div
                        key={transaction.id}
                        className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        {/* Header with Product and Action */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <Image
                              width={21}
                              height={21}
                              src={getAssetIcon(transaction.asset)}
                              alt={transaction.asset}
                              className="w-6 h-6 rounded-full flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="text-sm font-medium text-gray-900 truncate block">
                                {transaction.asset} Autopilot
                              </span>
                              <div className="flex items-center space-x-2">
                                <Image
                                  width={10.5}
                                  height={10.5}
                                  src={getProtocolIcon(transaction.protocol)}
                                  alt={transaction.protocol}
                                  className="w-3 h-3 flex-shrink-0"
                                />
                                <span className="text-xs text-gray-500">Morpho</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-4">{getActionBadge()}</div>
                        </div>

                        {/* Amounts and Time */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Earned Amount
                            </span>
                            <div className="text-sm font-medium text-green-600 truncate">
                              {formatBalance(
                                transaction.amount,
                                transaction.asset,
                                transaction.showDecimals
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              USD Value
                            </span>
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {formatBalance(transaction.usdValue, 'USD', 2)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Time
                            </span>
                            <div
                              className="text-sm text-gray-500 cursor-help"
                              title={formatFullTimestamp(transaction.timestamp)}
                            >
                              {formatFrequency(
                                Date.now() / 1000 - Number(transaction.timestamp) / 1000
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : isLoading ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-6 text-center py-25">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9159FF] mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading earnings data...</p>
                    </div>
                  ) : (
                    <EmptyEarnings handleAction={() => router.push(`/base/morpho/USDC#deposit`)} />
                  )}
                </div>
              )}

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                dataLength={allTransactions?.length}
                startIndex={startIndex}
                endIndex={endIndex}
                dataPerPage={itemsPerPage}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
