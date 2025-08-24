import { AutopilotProduct, ProjectData } from "@/types/globalAppTypes";
import { Cpu, Settings, DollarSign, TrendingUp, Activity, BarChart2, ExternalLink } from "lucide-react";
import Image from "next/image";

  const detailsStats = [
    {
        label: "7d APY",
        valueKey: "weeklyApy" as keyof ProjectData,
        unit: "%"
    },
    {
        label: "30d APY",
        valueKey: "monthlyApy" as keyof ProjectData,
        unit: "%"
    },
    {
        label: "TVL",
        valueKey: "tvl" as keyof ProjectData,
        unit: ""
    },
  ];

export default function Details({currentProjectData, selectedAutopilot} : {
    currentProjectData: ProjectData,
    selectedAutopilot: AutopilotProduct
}){

    return(
        <div className="space-y-8">
            <div className="grid grid-cols-3 gap-3 md:gap-6">
            {detailsStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg md:rounded-xl border border-gray-100 p-3 md:p-6 relative">
                    <div className="flex items-start justify-between mb-2 md:mb-3">
                        <p className="text-xs md:text-sm font-medium text-gray-600 leading-tight">{stat.label}</p>
                        {stat.unit !== '' && stat.unit !== '%' && (
                            <Image width={10} height={10} src={currentProjectData.assetIcon} alt={stat.unit} className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
                        )}
                    </div>
                    <div className="flex items-baseline space-x-1 md:space-x-2">
                        <span className="text-lg md:text-2xl font-bold leading-none break-all text-gray-900">
                            {currentProjectData[stat.valueKey].toString()}
                        </span>
                        <span className="text-xs md:text-sm text-gray-500 flex-shrink-0">{stat.unit}</span>
                    </div>
                </div>
            ))}
            </div>

            {/* Automated Algorithm Active */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
                {/* Header Section */}
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-[#9159FF]" />
                    </div>
                    <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">Automated Algorithm</h3>
                        <span className="bg-[#9159FF] text-white px-3 py-1 rounded-full text-xs font-medium">
                        Active
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">
                        Automated rebalancing algorithm monitors yield opportunities across connected {currentProjectData.name.toLowerCase()} vaults and automatically adjusts allocations to maximize yield potential.
                    </p>
                    </div>
                </div>

                {/* Rebalancing Triggers Section */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wide flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-[#9159FF]" />
                    <span>Rebalancing Triggers</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <DollarSign className="w-5 h-5 text-[#9159FF]" />
                        <span className="text-sm font-medium text-purple-900">Prevailing network fees</span>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <TrendingUp className="w-5 h-5 text-[#9159FF]" />
                        <span className="text-sm font-medium text-purple-900">Interest rate movements</span>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <Activity className="w-5 h-5 text-[#9159FF]" />
                        <span className="text-sm font-medium text-purple-900">Vault liquidity changes</span>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <BarChart2 className="w-5 h-5 text-[#9159FF]" />
                        <span className="text-sm font-medium text-purple-900">Market impact analysis</span>
                    </div>
                    </div>
                </div>
            </div>


            {/* Technical Information */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Technical Information</h3>

                {/* General and Performance Info - Top Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* General */}
                    <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">General</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Operating since</span>
                        <span className="text-sm font-medium text-gray-900">March 2024</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Starting SharePrice</span>
                        <span className="text-sm font-medium text-gray-900">1.0000 {currentProjectData.asset}</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Latest SharePrice</span>
                        <span className="text-sm font-medium text-gray-900">1.10013 {currentProjectData.asset}</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Latest SharePrice Update</span>
                        <span className="text-sm font-medium text-gray-900">1h 12min ago</span>
                        </div>

                    </div>
                    </div>

                    {/* Performance History */}
                    <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Performance History</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                        <span className="text-sm text-gray-600">7d Average</span>
                        <span className="text-sm font-medium text-gray-900">
                            {selectedAutopilot.protocol === 'morpho'
                            ? (selectedAutopilot.asset === 'USDC' ? "8.75" : selectedAutopilot.asset === 'ETH' ? "4.38" : "2.19")
                            : (selectedAutopilot.asset === 'USDC' ? "7.35" : selectedAutopilot.asset === 'ETH' ? "3.73" : "1.86")}%
                        </span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-sm text-gray-600">30d Average</span>
                        <span className="text-sm font-medium text-gray-900">
                            {selectedAutopilot.protocol === 'morpho'
                            ? (selectedAutopilot.asset === 'USDC' ? "8.42" : selectedAutopilot.asset === 'ETH' ? "4.21" : "2.10")
                            : (selectedAutopilot.asset === 'USDC' ? "7.12" : selectedAutopilot.asset === 'ETH' ? "3.56" : "1.78")}%
                        </span>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Yield Sources - Full Width List */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Autopilot Vault</h4>
                    <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-[#9159FF] rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">V</span>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-900">Main Vault Contract</div>
                            <div className="text-xs font-mono text-gray-600">0x742d35Cc7418C0a5b7b8d8eF8D7bA2b1C4f5A8D9</div>
                        </div>
                        </div>
                        <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-[#9159FF] transition-colors">
                            <ExternalLink className="w-3 h-3" />
                            <span>DeBank</span>
                        </button>
                        <button className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-[#9159FF] transition-colors">
                            <ExternalLink className="w-3 h-3" />
                            <span>Etherscan</span>
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Yield Sources</h4>
                    <div className="space-y-2">
                    {currentProjectData.yieldSources.map((vault) => (
                        <div key={vault.name} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                            <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-800">{vault.name}</div>
                            </div>
                            <div className="ml-3 flex-shrink-0">
                            <span className="text-xs font-mono text-gray-500 bg-white px-3 py-1.5 rounded border border-gray-200">
                                {vault.address}
                            </span>
                            </div>
                        </div>
                        ))
                    }
                    </div>
                </div>
            </div>
        </div>
    )
}
