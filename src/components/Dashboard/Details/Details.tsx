import { ProjectData } from "@/types/globalAppTypes";
import { Cpu, Settings, DollarSign, TrendingUp, Activity, BarChart2, Timer, ExternalLink } from "lucide-react";
import { formatBalance, getExplorerLink } from "@/helpers/utils";
import { useWallet } from "@/providers/WalletProvider";

  const detailsStats = [
    {
        label: "7d APY",
        valueKey: "apy7d" as keyof ProjectData,
        unit: "%"
    },
    {
        label: "30d APY",
        valueKey: "apy30d" as keyof ProjectData,
        unit: "%"
    },
    {
        label: "TVL",
        valueKey: "tvl" as keyof ProjectData,
        unit: ""
    },
  ];

export default function Details({currentProjectData} : {
    currentProjectData: ProjectData,
}){
    const { chainId } = useWallet();
  

    return(
        <div className="space-y-8">
            <div className="grid grid-cols-3 gap-3 md:gap-6">
            {detailsStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg md:rounded-xl border border-gray-100 p-3 md:p-6 relative">
                <div className="flex items-start justify-between mb-2 md:mb-3">
                    <p className="text-xs md:text-sm font-medium text-gray-600 leading-tight">{stat.label}</p>
                    {stat.unit !== '' && stat.unit !== '%' && (
                    <img src={currentProjectData.assetIcon} alt={stat.unit} className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
                    )}
                </div>
                <div className="flex items-baseline space-x-1 md:space-x-2">
                    <span className="text-lg md:text-2xl font-bold leading-none break-all text-gray-900">
                        {(currentProjectData[stat.valueKey] ?? "—").toString()}
                    </span>
                    <span className="text-xs md:text-sm text-gray-500 flex-shrink-0">{stat.unit}</span>
                </div>
                </div>
            ))}
            </div>

            {/* Automated Algorithm Active */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Cpu className="w-5 h-5 text-green-600" />
                </div>
                <div>
                <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Automated Algorithm</h3>
                    <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">
                    Active
                    </span>
                </div>
                <p className="text-sm text-gray-600">Advanced rebalancing algorithm monitors yield opportunities across {currentProjectData.name.toLowerCase()} vaults and automatically adjusts allocations to maximize returns.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Rebalancing Triggers */}
                <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Rebalancing Triggers</span>
                </h4>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">Gas cost optimization</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">Interest rate movements</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Activity className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">Vault liquidity changes</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <BarChart2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">Market impact analysis</span>
                    </div>
                </div>
                </div>

                {/* Update Frequency */}
                <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center space-x-2">
                    <Timer className="w-4 h-4" />
                    <span>Update Frequency</span>
                </h4>
                <div className="space-y-4">
                    <div>
                    <div className="text-sm text-gray-600 mb-1">Monitoring</div>
                    <div className="text-sm font-medium text-gray-900">Every {currentProjectData.frequency}</div>
                    </div>
                    <div>
                    <div className="text-sm text-gray-600 mb-1">Rebalancing</div>
                    <div className="text-sm font-medium text-gray-900">Multiple times/hour when competitive rates shift</div>
                    </div>
                    <div>
                    <div className="text-sm text-gray-600 mb-1">Last check</div>
                    <div className="text-sm font-medium text-green-600">{currentProjectData.latestUpdate} ago</div>
                    </div>
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
                    <span className="text-sm font-medium text-gray-900">{currentProjectData.operatingSince}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Starting SharePrice</span>
                    <span className="text-sm font-medium text-gray-900">{formatBalance(currentProjectData.initialSharePrice, currentProjectData.asset, currentProjectData.showDecimals)}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Latest SharePrice</span>
                    <span className="text-sm font-medium text-gray-900">{formatBalance(currentProjectData.latestSharePrice, currentProjectData.asset, currentProjectData.showDecimals)}</span>
                    </div>
                    <div>
                    <div className="text-sm text-gray-600 mb-1">Autopilot {currentProjectData.asset} Vault Address</div>
                    <a 
                        href={`${getExplorerLink(chainId || 8453)}/address/${currentProjectData.vaultAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 p-2 rounded transition-colors flex items-center justify-between group"
                    >
                        <span>{currentProjectData.vaultAddress}</span>
                        <ExternalLink className="w-3 h-3 text-gray-900 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
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
                        {currentProjectData.apy7d} %
                    </span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-sm text-gray-600">30d Average</span>
                    <span className="text-sm font-medium text-gray-900">
                        {currentProjectData.apy30d} %
                    </span>
                    </div>
                </div>
                </div>
            </div>

            {/* Yield Sources - Full Width List */}
            <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Yield Sources</h4>
                <div className="space-y-2">
                {(() => {                   
                    return currentProjectData.benchmarkData.filter(vault => !vault.isAutopilot && vault.name !== "Not invested").map(vault => (
                    <div key={vault.name} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-700">{vault.name}</div>
                      </div>
                      <div className="ml-3 flex-shrink-0 flex items-center space-x-2">
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                          {vault.apy} %
                      </span>
                      <a 
                          href={`${getExplorerLink(chainId || 8453)}/address/${vault.hVaultAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-50 px-2 py-1 rounded border transition-colors flex items-center space-x-1 group"
                      >
                          <span>{vault.hVaultAddress}</span>
                          <ExternalLink className="w-3 h-3 text-gray-900 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </a>
                      </div>
                    </div>
                    ));
                })()}
                </div>
            </div>
            </div>
        </div>
    )
}
