import { BenchmarkData } from '@/types/globalAppTypes';
import { DEFILLAMA_LINK_URL, DEFILLAMA_POOLS_URL } from '@/consts/constants';

interface DefiLlamaPool {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apyBase: number;
  apyReward: number | null;
  apy: number;
  pool: string;
  apyPct30D: number;
  apyMean30d: number;
  poolMeta?: string;
}

interface DefiLlamaLinkResponse {
  [key: string]: string;
}

interface DefiLlamaPoolsResponse {
  status: string;
  data: DefiLlamaPool[];
}

export const fetchDefiLlamaAPY = async (benchmarkData: BenchmarkData[]): Promise<{ [vaultAddress: string]: number }> => {
  if (!benchmarkData.length) return {};
  
  const validBenchmarks = benchmarkData.filter(benchmark => benchmark.hVaultAddress);
  
  if (validBenchmarks.length === 0) {
    return {};
  }
  
  try {
    const linkResponse = await fetch(DEFILLAMA_LINK_URL);
    if (!linkResponse.ok) {
      throw new Error('Failed to fetch DefiLlama links');
    }
    
    const linkData: DefiLlamaLinkResponse = await linkResponse.json();
    const vaultToPoolId: { [vaultAddress: string]: string } = {};
    
    for (const benchmark of validBenchmarks) {
      for (const [poolId, url] of Object.entries(linkData)) {
        const urlLower = url.toLowerCase();
        const vaultAddressLower = benchmark.hVaultAddress.toLowerCase();
        
        if ((urlLower.includes('harvest') && urlLower.includes('finance')) && urlLower.includes(vaultAddressLower)) {
          vaultToPoolId[benchmark.hVaultAddress] = poolId;
          break; 
        }
      }
      vaultToPoolId[benchmark.hVaultAddress] = vaultToPoolId[benchmark.hVaultAddress] || '';
    }
    
    const poolsResponse = await fetch(DEFILLAMA_POOLS_URL);
    if (!poolsResponse.ok) {
      throw new Error('Failed to fetch DefiLlama pools');
    }
    
    const poolsData: DefiLlamaPoolsResponse = await poolsResponse.json();
    
    if (poolsData.status !== 'success' || !poolsData.data) {
      throw new Error('Invalid pools response from DefiLlama');
    }
    
    const apyData: { [vaultAddress: string]: number } = {};
    
    for (const [vaultAddress, poolId] of Object.entries(vaultToPoolId)) {
      if (!poolId) continue;
      
      const pool = poolsData.data.find(p => p.pool === poolId);
      if (pool) {
        let apyValue;
        if (pool.apyMean30d && pool.apyMean30d > 0) {
          apyValue = pool.apyMean30d;
        } else {
          apyValue = pool.apy;
        }
        apyData[vaultAddress] = Number(apyValue.toFixed(2));
      }
    }
    
    return apyData;
  } catch (err) {
    console.error('Error fetching DefiLlama APY data:', err);
    throw err;
  }
};