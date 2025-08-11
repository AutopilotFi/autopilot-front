import { Download, RotateCcw, History } from "lucide-react";
import { ProjectData, UserStats } from "@/types/globalAppTypes";
import StatsGrid from "@/components/StatsGrid";
import { generateUserEarningStatsGridStructure } from "@/components/StatsGrid/gridStructure";
import StandardCTAButton from "@/components/UI/StandardCTAButton";

export default function Earnings({currentProjectData, isNewUser, userStatsData, handleNavigateToDeposit}: {
    currentProjectData: ProjectData,
    isNewUser:boolean,
    userStatsData: UserStats,
    handleNavigateToDeposit: () => void
}){
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
                <button className="text-sm bg-[#9159FF] text-white px-3 py-1.5 rounded-lg hover:bg-[#7c3aed] transition-colors flex items-center space-x-2">
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
                    {(() => {
                        const generateEarningsData = (baseAmount: number, variance: number, decimals: number) => {
                        return [
                            { date: "2025-06-16T09:18:00", amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)) },
                            { date: "2025-06-16T06:30:00", amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)) },
                            { date: "2025-06-15T22:40:00", amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)) },
                            { date: "2025-06-15T18:15:00", amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)) },
                            { date: "2025-06-15T14:33:00", amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)) },
                            { date: "2025-06-15T10:20:00", amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)) },
                            { date: "2025-06-15T06:10:00", amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)) },
                            { date: "2025-06-14T23:45:00", amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)) },
                            { date: "2025-06-14T19:30:00", amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)) },
                            { date: "2025-06-14T15:22:00", amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)) },
                        ];
                        };

                        const getEarningsParams = () => {
                        if (currentProjectData.asset === 'USDC') return { base: 15, variance: 10, decimals: 2 };
                        if (currentProjectData.asset === 'ETH') return { base: 0.003, variance: 0.002, decimals: 6 };
                        return { base: 0.0001, variance: 0.00005, decimals: 8 }; // cbBTC
                        };

                        const earningsParams = getEarningsParams();
                        const allEarnings = generateEarningsData(earningsParams.base, earningsParams.variance, earningsParams.decimals);

                        return allEarnings.slice(0, 10).map((earning, index) => {
                        const date = new Date(earning.date);
                        const formatDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        const formatTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

                        return (
                            <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
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
                                +{earning.amount.toFixed(currentProjectData.asset === 'USDC' ? 2 : 6)} {currentProjectData.asset}
                                </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                                <div className="text-sm font-medium text-gray-900">
                                ${(earning.amount * (currentProjectData.asset === 'USDC' ? 1 : currentProjectData.asset === 'ETH' ? 4000 : 100000)).toFixed(2)}
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <div className="text-sm text-gray-500">{formatDate} {formatTime}</div>
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
                    Showing 1 to 10 of 50 entries
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