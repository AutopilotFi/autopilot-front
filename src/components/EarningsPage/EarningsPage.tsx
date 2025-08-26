"use client"
import { useState, useContext, useEffect } from 'react';
import { ChevronLeft, TrendingUp, ArrowUpRight, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { EarningTransaction } from '@/types/globalAppTypes';
import { GlobalContext } from '../../providers/GlobalDataProvider';
import { formatBalance, formatFrequency } from '@/helpers/utils';

export default function EarningsPage({earningsData} : {
  earningsData: EarningTransaction[]
}) {
  const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<'timestamp' | 'amount' | 'usdValue'>('timestamp');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const globalData = useContext(GlobalContext);
    const user = globalData?.user;

    const itemsPerPage = 25;
    const isNewUser = user.status === 'new';
    
    // Set loading state when earningsData changes
    useEffect(() => {
      if (earningsData.length === 0) {
        setIsLoading(true);
      } else {
        setIsLoading(false);
      }
    }, [earningsData]);


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
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + itemsPerPage);

  const getAssetIcon = (asset: string): string => {
    switch (asset) {
      case 'USDC': return "/icons/usdc.svg";
      case 'ETH': return "/icons/eth.svg";
      case 'cbBTC': return "/icons/cbbtc.svg";
      default: return "/icons/usdc.svg";
    }
  };

  const getProtocolIcon = (protocol: string) => {
    return protocol === 'morpho' ? "/projects/morpho.png" : "/projects/euler.png";
  };

  const formatAmount = (amount: number, asset: string) => {
    if (asset === 'USDC') {
      return amount.toFixed(2);
    } else if (asset === 'ETH') {
      return amount.toFixed(6);
    } else {
      return amount.toFixed(8);
    }
  };

  const formatFullTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
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
            The earnings have been automatically<br />
            turned into more balance of your position,<br />
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>

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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {isLoading ? (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9159FF] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading earnings data...</p>
              </div>
            ) : isNewUser ? (
              <div className="bg-gradient-to-br from-purple-50 to-green-50 rounded-xl border border-purple-200 p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#9159FF] to-green-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Earning Today</h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Your earnings history will appear here once you start using Autopilot. Choose a strategy and begin earning optimized returns across multiple protocols.
                </p>

                <Link
                  href={`/base/morpho/USDC`}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#9159FF] to-green-600 hover:from-[#7c3aed] hover:to-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Get Started
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Earnings Table */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">

                  {/* Earnings Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Autopilot</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Protocol</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Action</th>
                          <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
                          <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">USD Value</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedTransactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b border-gray-50 hover:bg-purple-50 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <img src={getAssetIcon(transaction.asset)} alt={transaction.asset} className="w-6 h-6 rounded-full" />
                                <span className="text-sm font-medium text-gray-900">{transaction.asset}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <img src={getProtocolIcon(transaction.protocol)} alt={transaction.protocol} className="w-4 h-4" />
                                <span className="text-sm text-gray-600 capitalize">{transaction.protocol}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {getActionBadge()}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="text-sm font-medium text-green-600">
                                {formatBalance(transaction.amount, transaction.asset, transaction.showDecimals)}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="text-sm font-medium text-gray-900">
                                {formatBalance(transaction.usdValue, 'USD', 2)}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div
                                className="text-sm text-gray-500 cursor-help"
                                title={formatFullTimestamp(transaction.timestamp)}
                              >
                                {formatFrequency(Date.now() / 1000 - Number(transaction.timestamp) / 1000)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedTransactions.length)} of {sortedTransactions.length} earnings events
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>

                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                  currentPage === pageNum
                                    ? 'bg-[#9159FF] text-white'
                                    : 'border border-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
  );
}