"use clinet"

import { Download, History } from "lucide-react";
import { AutopilotProduct, ProjectData, UserStats } from "@/types/globalAppTypes";
import StatsGrid from "@/components/StatsGrid";
import { generateUserHistoryStatsGridStructure } from "@/components/StatsGrid/gridStructure";
import StandardCTAButton from "@/components/UI/StandardCTAButton";

export default function HistoryTab({currentProjectData, userStatsData, isNewUser, handleNavigateToDeposit, selectedAutopilot, dataKey} : {
    currentProjectData: ProjectData,
    userStatsData: UserStats,
    isNewUser: boolean,
    handleNavigateToDeposit: () => void,
    selectedAutopilot: AutopilotProduct,
    dataKey: keyof UserStats
}){
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
                <button className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
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
                    </tr>
                    </thead>
                    <tbody>
                    {(() => {
                        const depositWithdrawalHistory = userStatsData?.transactions || [];

                        return depositWithdrawalHistory.map((transaction, index) => {
                        const date = new Date(transaction.date);
                        const formatDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        const formatTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                        const truncatedHash = `${transaction.txHash.slice(0, 6)}...${transaction.txHash.slice(-4)}`;
                        return (
                            <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-4">
                                    <div className="text-sm font-medium text-gray-900">{transaction.type}</div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <div className="text-sm font-medium text-gray-900">
                                    {transaction.type === 'Withdrawal' ? '-' : '+'}
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

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                    Showing 1 to 6 of 6 entries
                </div>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                    Previous
                    </button>
                    <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                    Next
                    </button>
                </div>
                </div>
            </div>
            )}
        </div>
    )
}