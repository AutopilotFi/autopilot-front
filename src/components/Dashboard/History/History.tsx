"use client"

import { Download, History, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { ProjectData, UserStats } from "@/types/globalAppTypes";
import StatsGrid from "@/components/StatsGrid";
import { generateUserHistoryStatsGridStructure } from "@/components/StatsGrid/gridStructure";
import StandardCTAButton from "@/components/UI/StandardCTAButton";
import { useState } from "react";
import { useWallet } from "@/providers/WalletProvider";
import { getExplorerLink } from "@/helpers/utils";

export default function HistoryTab({currentProjectData, userStatsData, isNewUser, handleNavigateToDeposit } : {
    currentProjectData: ProjectData,
    userStatsData: UserStats,
    isNewUser: boolean,
    handleNavigateToDeposit: () => void,
}){
    const { chainId } = useWallet();
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 10;
    
    const totalTransactions = userStatsData?.transactions?.length || 0;
    const totalPages = Math.ceil(totalTransactions / transactionsPerPage);
    const startIndex = (currentPage - 1) * transactionsPerPage;
    const endIndex = startIndex + transactionsPerPage;
    const currentTransactions = userStatsData?.transactions?.slice(startIndex, endIndex) || [];
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    const handleExportCSV = () => {
        if (!userStatsData?.transactions || userStatsData.transactions.length === 0) {
            return;
        }
        
        // CSV headers
        const headers = ['Asset', 'Type', 'Amount', 'Status', 'Date', 'Time'];
        const csvRows = [headers];
        
        // Add data rows
        userStatsData.transactions.forEach((transaction) => {
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
                formatTime
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
    
    return(
        <div className="space-y-8">
            <StatsGrid gridStructure={generateUserHistoryStatsGridStructure(currentProjectData)} userStatsData={userStatsData} currentProjectData={currentProjectData} isNewUser={isNewUser}/>
            {isNewUser ? (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="text-center py-16">
                <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Transaction History</h4>
                <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                    All your deposits, withdrawals, and other transactions will be tracked here once you start using the Autopilot.
                </p>
                <StandardCTAButton onClick={handleNavigateToDeposit}>
                    Start Earning
                </StandardCTAButton>
                </div>
            </div>
            ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
                <button 
                    onClick={handleExportCSV}
                    disabled={!userStatsData?.transactions || userStatsData.transactions.length === 0}
                    className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                </button>
                </div>

                <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Type</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Time</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">TX</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentTransactions.length > 0 ? (
                        currentTransactions.map((transaction, index) => {
                        const date = new Date(transaction.date);
                        const formatDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        const formatTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

                        return (
                            <tr key={startIndex + index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4">
                                <div className="text-sm font-medium text-gray-900">
                                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                                <div className="text-sm font-medium text-gray-900">
                                {transaction.type === 'withdrawal' ? '-' : '+'}
                                {transaction.amount.toLocaleString('en-US', {
                                    minimumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6,
                                    maximumFractionDigits: currentProjectData.asset === 'USDC' ? 2 : 6
                                })} {currentProjectData.asset}
                                </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                                <div className="text-sm font-medium text-gray-900">{transaction.status}</div>
                            </td>
                            <td className="py-4 px-4 text-right">
                                <div className="text-sm text-gray-500">{formatDate} {formatTime}</div>
                            </td>
                            <td className="py-4 px-4 text-right">
                                {transaction.txHash ? (
                                    <a 
                                        href={`${getExplorerLink(chainId || 8453)}/tx/${transaction.txHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-1 text-xs font-mono text-gray-500 hover:text-gray-800 hover:underline transition-colors group"
                                    >
                                        <span className="truncate max-w-[80px]">{transaction.txHash.slice(0, 6)}...{transaction.txHash.slice(-4)}</span>
                                        <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                ) : (
                                    <span className="text-xs text-gray-400">—</span>
                                )}
                            </td>
                            </tr>
                        );
                        })
                    ) : (
                        <tr>
                            <td colSpan={5} className="py-12 text-center">
                                <div className="text-center">
                                    <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Transaction History</h4>
                                    <p className="text-sm text-gray-600 mb-4">
                                        No transactions have been recorded yet. Start earning by making your first deposit.
                                    </p>
                                    <StandardCTAButton onClick={handleNavigateToDeposit}>
                                        Start Earning
                                    </StandardCTAButton>
                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                    Showing {totalTransactions > 0 ? `${startIndex + 1} to ${Math.min(endIndex, totalTransactions)}` : '0'} of {totalTransactions} entries
                </div>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center space-x-1"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                    </button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Show first page, last page, current page, and pages around current page
                            if (
                                page === 1 || 
                                page === totalPages || 
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 rounded-lg text-sm border transition-colors ${
                                            page === currentPage
                                                ? 'bg-green-600 text-white border-green-600'
                                                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            } else if (
                                page === currentPage - 2 || 
                                page === currentPage + 2
                            ) {
                                return <span key={page} className="px-1 text-gray-400">...</span>;
                            }
                            return null;
                        })}
                    </div>
                    
                    <button 
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center space-x-1"
                    >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                </div>
            </div>
            )}
        </div>
    )
}