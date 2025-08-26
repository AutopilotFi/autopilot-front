import { Download, RotateCcw, History, ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectData, UserStats } from "@/types/globalAppTypes";
import StatsGrid from "@/components/StatsGrid";
import { generateUserEarningStatsGridStructure } from "@/components/StatsGrid/gridStructure";
import StandardCTAButton from "@/components/UI/StandardCTAButton";
import { formatBalance } from "@/helpers/utils";
import { useState } from "react";

export default function Earnings({currentProjectData, isNewUser, userStatsData, handleNavigateToDeposit}: {
    currentProjectData: ProjectData,
    isNewUser:boolean,
    userStatsData: UserStats,
    handleNavigateToDeposit: () => void
}){
    const [currentPage, setCurrentPage] = useState(1);
    const earningsPerPage = 10;
    
    const totalEarnings = currentProjectData.recentEarnings.length;
    const totalPages = Math.ceil(totalEarnings / earningsPerPage);
    const startIndex = (currentPage - 1) * earningsPerPage;
    const endIndex = startIndex + earningsPerPage;
    const currentEarnings = currentProjectData.recentEarnings.slice(startIndex, endIndex);
    
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
        if (currentProjectData.recentEarnings.length === 0) {
            return;
        }
        
        // Create CSV content
        const headers = ['Asset', 'Action', 'Amount', 'USD Value', 'Date', 'Time'];
        const csvRows = [headers];
        
        currentProjectData.recentEarnings.forEach((earning) => {
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
                formatTime
            ];
            csvRows.push(row);
        });
        
        // Convert to CSV string
        const csvContent = csvRows.map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${currentProjectData.asset}_earnings_history_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    
    return(
        <div className="space-y-8">
            <StatsGrid gridStructure={generateUserEarningStatsGridStructure(currentProjectData)} userStatsData={userStatsData} currentProjectData={currentProjectData} isNewUser={isNewUser}/>
            {isNewUser ? (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Your Earnings History</h4>
                <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                    All your earnings transactions will be tracked here. Start by making your first deposit to begin earning yield with the {currentProjectData.asset} Autopilot.
                </p>
                <StandardCTAButton onClick={handleNavigateToDeposit}>
                    Start Earning
                </StandardCTAButton>
                </div>
            </div>
            ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Earnings History</h3>
                <button 
                    onClick={handleExportCSV}
                    disabled={currentProjectData.recentEarnings.length === 0}
                    className="text-sm bg-[#9159FF] text-white px-3 py-1.5 rounded-lg hover:bg-[#7c3aed] transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                </button>
                </div>

                <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Asset</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Action</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">USD Value</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentEarnings.length > 0 ? (
                        currentEarnings.map((earning, index) => {
                            const date = new Date(Number(earning.time) * 1000); // Convert Unix timestamp to Date
                            const formatDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            const formatTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

                            return (
                                <tr key={startIndex + index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-4">
                                    <div className="flex items-center space-x-3">
                                    <img src={currentProjectData.assetIcon} alt={currentProjectData.asset} className="w-6 h-6 rounded-full" />
                                    <span className="text-sm font-medium text-gray-900">{currentProjectData.asset}</span>
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
                                        The earnings have been automatically<br />
                                        turned into more balance of your position,<br />
                                        increasing the strength of your earnings going forward
                                        </div>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <div className="text-sm font-medium text-green-600">
                                        {formatBalance(earning.amount, currentProjectData.asset, currentProjectData.showDecimals)}
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatBalance(earning.amountUsd, 'USD', 2)}
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <div className="text-sm text-gray-500">{formatDate} {formatTime}</div>
                                </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={5} className="py-12 text-center">
                                <div className="text-center">
                                    <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Earnings History</h4>
                                    <p className="text-sm text-gray-600 mb-4">
                                        No earnings have been recorded yet. Start earning by making your first deposit.
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
                    Showing {totalEarnings > 0 ? `${startIndex + 1} to ${Math.min(endIndex, totalEarnings)}` : '0'} of {totalEarnings} entries
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
                                                ? 'bg-[#9159FF] text-white border-[#9159FF]'
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