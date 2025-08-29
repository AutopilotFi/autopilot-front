import { useEffect, useState } from "react";
import { BenchmarkData } from "@/types/globalAppTypes"
import { fetchDefiLlamaAPY } from "@/hooks/useDefiLlamaAPY";

export default function Benchmark({benchmarkData}: {
    benchmarkData: BenchmarkData[]
}){
    const [syncedBenchmarkData, setSyncedBenchmarkData] = useState<BenchmarkData[]>([]);

    useEffect(() => {
        const validBenchmarks = benchmarkData.filter(benchmark => benchmark.name !== 'Not invested');
        if (validBenchmarks.length === 0) {
            setSyncedBenchmarkData(benchmarkData);
            return;
        }
        
        const syncAPYData = async () => {
            try {
                const apyData = await fetchDefiLlamaAPY(validBenchmarks);
                const result = validBenchmarks.map(item => ({
                    ...item,
                    apy30dMean: apyData[item.hVaultAddress?.toLowerCase()] || item.apy
                }));
                
                const sortedResult = result.sort((a, b) => {
                    if (a.isAutopilot && !b.isAutopilot) return -1;
                    if (!a.isAutopilot && b.isAutopilot) return 1;
                    
                    const aAPY = a.apy30dMean || a.apy;
                    const bAPY = b.apy30dMean || b.apy;
                    return bAPY - aAPY;
                });
                
                setSyncedBenchmarkData(sortedResult);
            } catch (error) {
                console.error('Failed to fetch APY data:', error);
                setSyncedBenchmarkData(validBenchmarks);
            }
        };

        syncAPYData();
    }, [benchmarkData]);

    return(
        <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Performance Comparison</h3>
                <p className="text-sm text-gray-600">Autopilot vs. standalone Morpho vaults</p>
            </div>

            <div className="space-y-3">   
            { syncedBenchmarkData
                    .map((item, index) => (
                <div key={item.name} className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                    item.isAutopilot
                    ? 'bg-green-50 border-green-200 hover:bg-green-100'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}>
                    <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        item.isAutopilot
                            ? 'bg-green-600'
                            : 'bg-gray-100 border border-gray-200'
                        }`}>
                        <span className={`text-sm font-bold ${
                            item.isAutopilot ? 'text-white' : 'text-gray-600'
                        }`}>
                            {index + 1}
                        </span>
                        </div>
                        <div>
                        <div className="flex items-center space-x-2">
                            <h4 className={`font-semibold ${item.isAutopilot ? 'text-green-900' : 'text-gray-900'}`}>
                            {item.name}
                            </h4>
                            {item.isAutopilot && (
                            <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                AUTO
                            </span>
                            )}
                        </div>
                        <p className={`text-sm ${item.isAutopilot ? 'text-green-700' : 'text-gray-600'}`}>
                            {item.description}
                        </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`font-bold ${item.isAutopilot ? 'text-green-600' : 'text-gray-900'}`}>
                        {item.apy30dMean ? item.apy30dMean.toFixed(2) : item.apy.toFixed(2)}%
                        </div>
                        <div className="text-xs text-gray-500">30d APY</div>
                    </div>
                    </div>
                </div>
                ))
            }
            </div>
        </div>
    )
}