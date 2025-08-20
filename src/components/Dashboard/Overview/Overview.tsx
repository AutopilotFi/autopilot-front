"use client"
import { TrendingUp, Coins, Clock, Zap, Layers } from "lucide-react";
import { ProjectData, UserStats, TimeFrame } from "@/types/globalAppTypes";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StatsGrid from "@/components/StatsGrid";
import { generateUserStatsGridStructure } from "@/components/StatsGrid/gridStructure";
import StandardCTAButton from "@/components/UI/StandardCTAButton";
import { formatFrequency, formatBalance } from "@/helpers/utils";

export default function Overview({currentProjectData, userStatsData, isNewUser, isOldUser, handleNavigateToDeposit}: {
    currentProjectData: ProjectData,
    userStatsData: UserStats,
    isNewUser: boolean,
    isOldUser: boolean,
    handleNavigateToDeposit: () => void
}){
    const [timeframe, setTimeframe] = useState<TimeFrame>('all');
    const periods: TimeFrame[] = ["1m", "7d", "all"];
    const router = useRouter();

    const handleViewAllEarnings = () => {
        router.push('/earnings');
    };
    return(
        <div className="space-y-8">
            {/* Stats Grid */}
            <StatsGrid gridStructure={generateUserStatsGridStructure(currentProjectData)} userStatsData={userStatsData} currentProjectData={currentProjectData} isNewUser={isNewUser}/>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
            {/* Earnings Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Earnings</h3>
                    <div className="flex items-center space-x-1">
                    {periods.map(period => (
                        <button
                        key={period}
                        onClick={() => setTimeframe(period)}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                            timeframe === period
                            ? 'bg-[#9159FF] text-white'
                            : 'text-[#9159FF] hover:text-[#7c3aed] hover:bg-purple-50'
                        }`}
                        >
                        {period}
                        </button>
                    ))}
                    </div>
                </div>
                </div>

                {isNewUser ? (
                <div className="p-6">
                    <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-blue-200">
                    <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Your Earnings Chart</h4>
                        <p className="text-sm text-gray-600 mb-4 max-w-xs">
                        Track your yield performance over time. Your earnings history will appear here once you start using the Autopilot.
                        </p>
                        <StandardCTAButton onClick={handleNavigateToDeposit}>
                        Start Earning
                        </StandardCTAButton>
                    </div>
                    </div>
                </div>
                ) : (
                <>


                    {/* Chart Section */}
                    <div className="px-6 pb-6">
                    <div className="h-72 bg-gradient-to-br from-purple-50 to-white rounded-lg relative overflow-hidden">
                        {/* Blur overlay for chart area */}
                        <div className="absolute inset-0 backdrop-blur-[2px] bg-white/20 rounded-lg"></div>

                        {/* Chart Visualization Label */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200 shadow-sm">
                            <span className="text-sm font-medium text-gray-600">Chart Visualization</span>
                        </div>
                        </div>

                        <svg className="w-full h-full opacity-60" viewBox="0 0 400 200" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#9159FF" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#9159FF" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#9159FF" stopOpacity="0.05" />
                            </linearGradient>
                            <linearGradient id="purpleStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#9159FF" stopOpacity="0.6" />
                            <stop offset="50%" stopColor="#9159FF" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#9159FF" stopOpacity="1" />
                            </linearGradient>
                        </defs>

                        {/* Chart area fill */}
                        <path
                            d="M 0 180 L 50 160 L 100 150 L 150 130 L 200 120 L 250 100 L 300 85 L 350 70 L 400 50 L 400 200 L 0 200 Z"
                            fill="url(#purpleGradient)"
                        />

                        {/* Chart line */}
                        <path
                            d="M 0 180 L 50 160 L 100 150 L 150 130 L 200 120 L 250 100 L 300 85 L 350 70 L 400 50"
                            stroke="url(#purpleStroke)"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Data points */}
                        {[
                            { x: 0, y: 180 },
                            { x: 50, y: 160 },
                            { x: 100, y: 150 },
                            { x: 150, y: 130 },
                            { x: 200, y: 120 },
                            { x: 250, y: 100 },
                            { x: 300, y: 85 },
                            { x: 350, y: 70 },
                            { x: 400, y: 50 }
                        ].map((point, index) => (
                            <circle
                            key={index}
                            cx={point.x}
                            cy={point.y}
                            r="3"
                            fill="#9159FF"
                            opacity="0.8"
                            />
                        ))}
                        </svg>

                        {/* Subtle grid lines */}
                        <div className="absolute inset-0 opacity-10">
                        <div className="grid grid-cols-8 grid-rows-4 h-full w-full">
                            {Array.from({ length: 32 }).map((_, i) => (
                            <div key={i} className="border border-gray-300"></div>
                            ))}
                        </div>
                        </div>
                    </div>
                    </div>
                </>
                )}
            </div>

            {/* Latest Earnings */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Latest Earnings</h3>
                {!isNewUser && (
                    <button
                    onClick={handleViewAllEarnings}
                    className="text-xs bg-[#9159FF] text-white px-3 py-1.5 rounded-md hover:bg-[#7c3aed] transition-colors"
                    >
                    View All
                    </button>
                )}
                </div>

                {isNewUser ? (
                <div className="space-y-4">
                    <div className="text-center py-8">
                    <Coins className="w-10 h-10 text-[#9159FF] mx-auto mb-3" />
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Your Latest Earnings</h4>
                    <p className="text-xs text-gray-600 mb-4">
                        Your earnings will be reflected here. Supply funds to get started with the {currentProjectData.asset} Autopilot.
                    </p>
                    <StandardCTAButton onClick={handleNavigateToDeposit}>
                        Start Earning
                    </StandardCTAButton>
                    </div>
                </div>
                ) : isOldUser ? (
                <div className="space-y-4">
                    <div className="text-center py-8">
                    <Clock className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <h4 className="text-sm font-medium text-gray-900 mb-2">No Recent Earnings</h4>
                    <p className="text-xs text-gray-600 mb-4">
                        No active deposits generating earnings. Your last earnings were from previous deposits.
                    </p>
                    <StandardCTAButton onClick={handleNavigateToDeposit}>
                        Start Earning
                    </StandardCTAButton>
                    </div>
                </div>
                ) : (
                <div className="space-y-3">
                    {currentProjectData.recentEarnings.slice(0, 5).map((earning, index) => (
                    <div key={index} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-purple-50 hover:border hover:border-purple-200 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3">
                        <img src={currentProjectData.assetIcon} alt={currentProjectData.asset} className="w-5 h-5" />
                        <div>
                            <div className="text-sm font-medium text-gray-900">
                            +{formatBalance(earning.amount, currentProjectData.asset)}
                            </div>
                            <div className="text-xs text-gray-500">Yield earned</div>
                        </div>
                        </div>
                        <div className="text-xs text-gray-500">{formatFrequency(Date.now() / 1000 - Number(earning.time))} ago</div>
                    </div>
                    ))}
                </div>
                )}
            </div>
            </div>

            {/* Current Allocation Table - Always show for both user states */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Current Allocation</h3>
                <p className="text-sm text-gray-600">Live distribution across yield sources</p>
            </div>

            {/* Optimization Status */}
            <div className={`${isOldUser ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'} border rounded-xl p-4 mb-6`}>
                <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${isOldUser ? 'bg-gray-100' : 'bg-green-100'} rounded-lg flex items-center justify-center`}>
                    <Zap className={`w-4 h-4 ${isOldUser ? 'text-gray-600' : 'text-green-600'}`} />
                    </div>
                    <div>
                    <h4 className={`text-sm font-semibold ${isOldUser ? 'text-gray-900' : 'text-green-900'}`}>
                        {isOldUser ? 'No Active Positions' : 'Optimization Active'}
                    </h4>
                    <p className={`text-xs ${isOldUser ? 'text-gray-700' : 'text-green-700'}`}>
                        {isOldUser ? 'All funds have been withdrawn' : 'Automatically rebalancing for maximum yield'}
                    </p>
                    </div>
                </div>
                <div className={`${isOldUser ? 'bg-white text-gray-700 border-gray-200/50' : 'bg-white text-green-700 border-green-200/50'} px-3 py-1 rounded-lg text-xs font-medium border`}>
                    {isOldUser ? 'Inactive' : 'Last rebalance: 2h'}
                </div>
                </div>
            </div>

            {/* Allocation table for all users */}
            <div className="overflow-x-auto">
                <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Yield Source</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">7d APY</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Allocation</th>
                    </tr>
                </thead>
                <tbody>
                    {isOldUser ? (
                    <tr>
                        <td colSpan={4} className="py-12 text-center">
                        <div className="text-center">
                            <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Active Allocations</h4>
                            <p className="text-sm text-gray-600 mb-4">
                            You have withdrawn all funds. Your historical allocation data is preserved in the details section.
                            </p>
                        </div>
                        </td>
                    </tr>
                    ) : (
                    currentProjectData.benchmarkData.filter(allocation => !allocation.isAutopilot).map((allocation, index) => (
                        <tr key={index} className="border-b border-gray-50 hover:bg-purple-50 transition-colors">
                        <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                            <img src={currentProjectData.assetIcon} alt={currentProjectData.asset} className="w-6 h-6 rounded-full" />
                            <span className="text-sm font-medium text-gray-900">{allocation.name}</span>
                            </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                            <div className="text-sm font-medium text-gray-900">{allocation.apy.toFixed(2)}%</div>
                        </td>
                        <td className="py-4 px-4 text-right">
                            <div className="text-sm font-medium text-gray-900">
                            {(allocation.amount ?? 0).toLocaleString('en-US', {
                                maximumFractionDigits: currentProjectData.asset === 'USDC' ? 0 : 4
                            })} {currentProjectData.asset}
                            </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                            <div className="text-sm font-medium text-gray-900">{(allocation.allocation ?? 0).toFixed(1)}%</div>
                        </td>
                        </tr>
                    ))
                    )}
                </tbody>
                </table>
            </div>
            </div>
        </div>
    )
}