import { AutopilotProduct, ProjectData, ProjectsData } from "@/types/globalAppTypes";
import { Cpu, Settings, DollarSign, TrendingUp, Activity, BarChart2, Timer } from "lucide-react";

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
                    <img src={currentProjectData.assetIcon} alt={stat.unit} className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
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
                    <div className="text-sm font-medium text-gray-900">Every 15 minutes</div>
                    </div>
                    <div>
                    <div className="text-sm text-gray-600 mb-1">Rebalancing</div>
                    <div className="text-sm font-medium text-gray-900">Multiple times/hour when competitive rates shift</div>
                    </div>
                    <div>
                    <div className="text-sm text-gray-600 mb-1">Last check</div>
                    <div className="text-sm font-medium text-green-600">12 minutes ago</div>
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
                    <div>
                    <div className="text-sm text-gray-600 mb-1">Autopilot {currentProjectData.asset} Vault Address</div>
                    <div className="text-xs font-mono text-gray-900 bg-gray-100 p-2 rounded">
                        0xAUTO1a2b...9i0j
                    </div>
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
                <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Yield Sources</h4>
                <div className="space-y-2">
                {(() => {
                    // Generate comprehensive vault list from benchmark data
                    const generateAllVaults = () => {
                    if (selectedAutopilot.protocol === 'morpho') {
                        if (selectedAutopilot.asset === 'USDC') {
                        return [
                            { name: "Extrafi XLend USDC Vault (Gauntlet)", address: "0x0001...0000", apy: "8.50%" },
                            { name: "Ionic Ecosystem", address: "0x0002...0007", apy: "8.50%" },
                            { name: "Moonwell Flagship", address: "0x0003...000e", apy: "7.94%" },
                            { name: "Seamless", address: "0x0004...0005", apy: "7.88%" },
                            { name: "Steakhouse", address: "0x0005...000c", apy: "7.24%" },
                            { name: "Gauntlet Prime", address: "0x0006...0003", apy: "7.19%" },
                            { name: "Clearstar OpenEden", address: "0x0007...000a", apy: "7.43%" },
                            { name: "Gauntlet Core", address: "0x0008...0001", apy: "6.95%" },
                            { name: "Smokehouse", address: "0x0009...0008", apy: "7.82%" },
                            { name: "Spark", address: "0x000a...000f", apy: "5.67%" },
                            { name: "Apostro Resolv", address: "0x000b...0006", apy: "7.76%" },
                            { name: "Re7 Labs", address: "0x000c...000d", apy: "4.78%" },

                            { name: "Universal USDC (Re7 Labs)", address: "0x000e...000f", apy: "3.55%" },
                            { name: "Pyth USDC (Re7 Labs)", address: "0x000f...0010", apy: "4.93%" },
                        ];
                        } else if (selectedAutopilot.asset === 'ETH') {
                        return [
                            { name: "Extrafi XLend ETH Vault (Gauntlet)", address: "0x0001...0000", apy: "4.25%" },
                            { name: "Ionic Ecosystem ETH", address: "0x0002...0007", apy: "4.25%" },
                            { name: "Moonwell Flagship ETH", address: "0x0003...000e", apy: "3.97%" },
                            { name: "Seamless ETH", address: "0x0004...0005", apy: "3.94%" },
                            { name: "Steakhouse ETH", address: "0x0005...000c", apy: "3.62%" },
                            { name: "Gauntlet Prime ETH", address: "0x0006...0003", apy: "3.60%" },
                            { name: "Clearstar OpenEden ETH", address: "0x0007...000a", apy: "3.72%" },
                            { name: "Gauntlet Core ETH", address: "0x0008...0001", apy: "3.48%" },
                            { name: "Smokehouse ETH", address: "0x0009...0008", apy: "3.91%" },
                            { name: "Spark ETH", address: "0x000a...000f", apy: "2.84%" },
                            { name: "Apostro Resolv ETH", address: "0x000b...0006", apy: "3.88%" },
                            { name: "Re7 Labs ETH", address: "0x000c...000d", apy: "2.39%" },

                            { name: "Universal ETH (Re7 Labs)", address: "0x000e...000f", apy: "1.78%" },
                            { name: "Pyth ETH (Re7 Labs)", address: "0x000f...0010", apy: "2.47%" },
                        ];
                        } else { // cbBTC
                        return [
                            { name: "Extrafi XLend cbBTC Vault (Gauntlet)", address: "0x0001...0000", apy: "2.13%" },
                            { name: "Ionic Ecosystem cbBTC", address: "0x0002...0007", apy: "2.13%" },
                            { name: "Moonwell Flagship cbBTC", address: "0x0003...000e", apy: "1.99%" },
                            { name: "Seamless cbBTC", address: "0x0004...0005", apy: "1.97%" },
                            { name: "Steakhouse cbBTC", address: "0x0005...000c", apy: "1.81%" },
                            { name: "Gauntlet Prime cbBTC", address: "0x0006...0003", apy: "1.80%" },
                            { name: "Clearstar OpenEden cbBTC", address: "0x0007...000a", apy: "1.86%" },
                            { name: "Gauntlet Core cbBTC", address: "0x0008...0001", apy: "1.74%" },
                            { name: "Smokehouse cbBTC", address: "0x0009...0008", apy: "1.96%" },
                            { name: "Spark cbBTC", address: "0x000a...000f", apy: "1.42%" },
                            { name: "Apostro Resolv cbBTC", address: "0x000b...0006", apy: "1.94%" },
                            { name: "Re7 Labs cbBTC", address: "0x000c...000d", apy: "1.20%" },

                            { name: "Universal cbBTC (Re7 Labs)", address: "0x000e...000f", apy: "0.89%" },
                            { name: "Pyth cbBTC (Re7 Labs)", address: "0x000f...0010", apy: "1.23%" },
                        ];
                        }
                    } else { // euler
                        if (selectedAutopilot.asset === 'USDC') {
                        return [
                            { name: "Euler Core USDC", address: "0x0001...0000", apy: "7.25%" },
                            { name: "Euler Prime USDC", address: "0x0002...0007", apy: "6.98%" },
                            { name: "Euler Max USDC", address: "0x0003...000e", apy: "6.45%" },
                            { name: "Euler Base USDC", address: "0x0004...0005", apy: "6.12%" },
                            { name: "Euler Safe USDC", address: "0x0005...000c", apy: "5.89%" },
                            { name: "Euler Growth USDC", address: "0x0006...0003", apy: "6.67%" },
                            { name: "Euler Stable USDC", address: "0x0007...000a", apy: "5.34%" },
                            { name: "Euler Reserve USDC", address: "0x0008...0001", apy: "4.98%" },
                            { name: "Euler Balance USDC", address: "0x0009...0008", apy: "5.76%" },
                            { name: "Euler Conservative USDC", address: "0x000a...000f", apy: "4.23%" },
                            { name: "Euler Basic USDC", address: "0x000b...0006", apy: "5.45%" },
                        ];
                        } else if (selectedAutopilot.asset === 'ETH') {
                        return [
                            { name: "Euler Core ETH", address: "0x0001...0000", apy: "3.63%" },
                            { name: "Euler Prime ETH", address: "0x0002...0007", apy: "3.49%" },
                            { name: "Euler Max ETH", address: "0x0003...000e", apy: "3.23%" },
                            { name: "Euler Base ETH", address: "0x0004...0005", apy: "3.06%" },
                            { name: "Euler Safe ETH", address: "0x0005...000c", apy: "2.95%" },
                            { name: "Euler Growth ETH", address: "0x0006...0003", apy: "3.34%" },
                            { name: "Euler Stable ETH", address: "0x0007...000a", apy: "2.67%" },
                            { name: "Euler Reserve ETH", address: "0x0008...0001", apy: "2.49%" },
                            { name: "Euler Balance ETH", address: "0x0009...0008", apy: "2.88%" },
                            { name: "Euler Conservative ETH", address: "0x000a...000f", apy: "2.12%" },
                            { name: "Euler Basic ETH", address: "0x000b...0006", apy: "2.73%" },
                        ];
                        } else { // cbBTC
                        return [
                            { name: "Euler Core cbBTC", address: "0x0001...0000", apy: "1.81%" },
                            { name: "Euler Prime cbBTC", address: "0x0002...0007", apy: "1.75%" },
                            { name: "Euler Max cbBTC", address: "0x0003...000e", apy: "1.61%" },
                            { name: "Euler Base cbBTC", address: "0x0004...0005", apy: "1.53%" },
                            { name: "Euler Safe cbBTC", address: "0x0005...000c", apy: "1.47%" },
                            { name: "Euler Growth cbBTC", address: "0x0006...0003", apy: "1.67%" },
                            { name: "Euler Stable cbBTC", address: "0x0007...000a", apy: "1.34%" },
                            { name: "Euler Reserve cbBTC", address: "0x0008...0001", apy: "1.25%" },
                            { name: "Euler Balance cbBTC", address: "0x0009...0008", apy: "1.44%" },
                            { name: "Euler Conservative cbBTC", address: "0x000a...000f", apy: "1.06%" },
                            { name: "Euler Basic cbBTC", address: "0x000b...0006", apy: "1.36%" },
                        ];
                        }
                    }
                    };

                    const allVaults = generateAllVaults();

                    return allVaults.map((vault, index) => (
                    <div key={vault.name} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-700">{vault.name}</div>
                        </div>
                        <div className="ml-3 flex-shrink-0 flex items-center space-x-2">
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                            {vault.apy}
                        </span>
                        <span className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded border">
                            {vault.address}
                        </span>
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
