import { BenchmarkData } from '@/types/globalAppTypes';
import { DEFILLAMA_POOLS_URL } from '@/consts/constants';

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
interface DefiLlamaPoolsResponse {
  status: string;
  data: DefiLlamaPool[];
}

const VaultPoolIdMap: { [vaultAddress: string]: string } = {
  "0x0b0193fad49de45f5e2b0a9f5d6bc3bb7d281688": "aa66be71-a18c-457d-a53f-8987031470c6",
  "0x03fef3bac27e23b21886b503edbbe4987e02cda0": "",
  "0x3fdfb0fe59dfba560e2918085ac92da1c25a2e68": "ca0926b6-fe08-4692-a133-98220e3e4cbb",
  "0x05e9bb4f9e71aca4750dd759ba3183f73dbcf59f": "7bdbd063-3340-4a32-ba67-2c3e241243ed",
  "0x14d3f3cf49a4948cf3c8a024430be6a7efbd7d1a": "a23b98d3-1c9d-4458-80ab-e4b200532ca3",
  "0x25f92841689f8477057b48dd75f64db965fce9a7": "7b74accc-614f-4656-ba1b-ad12fec2c12b",
  "0x35c42077652a3d1434926ff3ce0fa3442b6c403a": "71629f38-92c6-40c6-9b0f-98214004eb9b",
  "0x696c4e58c23dc0d5a45a73f6943353b3c32d28e9": "b1850d8f-78f0-41fa-a74f-af8e2d7ad5e2",
  "0x24736f73c5fb1960862295730cfc61517992c2e6": "",
  "0x57080f7fd7e97d1cd6fb6cdb36b6e7e21a827c8e": "44af8df1-6af5-403c-b066-10b94a7fadc2",
  "0xaad34aa93f987b8b032944ad52c9b6e41c4152fe": "17f9640f-6655-45bf-a6ac-3ccb321d65ca",
  "0xac08c14fb444f42a020117b4f9a7837317fb49b2": "e971eb17-8b85-49af-93f1-00f428c5e915",
  "0xc7f9cb0b28d501661eb7660916ec4609c92923b1": "8f7e4c6e-63be-4ebf-bfa1-9709c6a5ab77",
  "0xc14ed8339d3c2a02d860ab4078606a3918c2e294": "d5005e18-ffab-4d37-8676-1bbb20985d01",
  "0xc7548d8d7560f6679e369d0556c44fe1eddea3e9": "0f90f3b5-fa3f-485d-8ff9-3dbb49f84fed",
  "0x0d877dc7c8fa3ad980dfdb18b48ec9f8768359c4": "27de63d4-e52c-414f-a0e9-fbba61216398",
  "0x0f6d1d626fd6284c6c1c1345f30996b89b879689": "62700bdf-ecd0-4b2e-a1bd-f90799aeed27",
  "0x00f281832f74d3eb391c219148ee3b7c8bb46319": "4c3961c5-3f57-46dd-98bb-804ab30e4d57",
  "0x1d247b81f151f8d301798a0caca4185d70c98a03": "e5c99e88-8259-48c1-998b-f990be2d91df",
  "0x5b2102bfd84f0c6803a8b0178e3751d0254aeccb": "a814f348-6f2c-476f-b1d0-833fc6303164",
  "0x06a26034dd4a8d84318e18a2bb9ddc13313d7d04": "",
  "0x9c012e4fe655b90839e1b65a461b72813c9ac2a4": "7e9bf7c2-2ec3-48df-a825-8ab2a9525eab",
  "0x36a4096c6586d25d5b8d7bec750076443b8b3e60": "",
  "0x58f8afd6f6499b02e68cb8964fd1d3da3afb9465": "d37c759c-5334-40c3-86c8-aff024c6be12",
  "0x174f28775913126f649680ed67f5bbd871bec4af": "bf2b0492-5a87-4f34-be18-46660f913131",
  "0x90613e167d42ca420942082157b42af6fc6a8087": "2d78eecd-603a-4b03-845b-4f721c38f039",
  "0x0487694d04b2473b1239cbbcf4dd1b8c14f40e2b": "",
  "0x84478106f22750f2c69bffd632eba22e439b521a": "04f9b0c3-b6d4-4722-9abe-7be4f38bd283",
  "0xa4eab2ba5e7abf2a327fa27ad232e6d1281acbf0": "cc570633-a3d2-4084-839a-91c1eda36a79",
  "0xa0200eeed8d90aa01de741daefab5f86c09d5785": "2f06a0b0-2886-46f3-8a42-9681cd6a4f12",
  "0xbb73b0d23e883a7e1a4c62a1b7554939da4503d2": "538d5a6f-fa87-4941-a690-f9e6e886c54c",
  "0xc3e3da3a751def1620ff9971336cb1b1d93b7a52": "fe8908cd-b3a2-4863-a88a-7860848b3658",
  "0xc569c9e9f1d88d4906c4f95f56b0e4c5960c620b": "2cdeaa33-312d-4475-ae47-e64bdbd1fe5a",
  "0xc777031d50f632083be7080e51e390709062263e": "062ba2ef-c132-4989-8e67-0ea2ebd37888",
  "0xcea7de485cf3b69cf3d5f7dfadf9e1df31303988": "bc1b23f8-4816-4f2e-86ba-0922e1878b33",
  "0xd9e38d724cc5ee983bc0fd0ce35c3eb20417b673": "cc1b1cdb-3433-4031-8935-4e18afcb4c16",
  "0xe5beacb6d013314e3601f45b3ed226ffa5f138e2": "0caf8328-97b1-4b1a-aa02-0d95b9d20e18",
  "0x5a04a1904a0685f331015c647ad2430c05725521": "74793eca-3f75-4d9b-9507-eeb53055ead8",
  "0x6b80cf5e76c7c408eb6797a85f3825786fe83e27": "c2c60b50-5d87-4386-8421-46269da58361",
  "0x31a421271414641cb5063b71594b642d2666db6b": "a930ce56-c688-4a36-ae94-9c75abc8ebea",
  "0x6243a06f4bb242e43eede2dda211444c82a61c8b": "fa022a52-7e59-4b77-92b2-7e8bd10a444a",
  "0x52539e9c0ec50eaeee7d0c518f88c066209090cb": "c0def71f-677c-4b3f-aa1d-776620517329",
  "0x9315691960ce7e5015b3c8c502cb7bc05ad6c142": "e4fbc9b5-773f-4594-a982-07d18dc9e098",
  "0xc5dc397b1db51da30dc9f3ac7084bbba1efbe249": "f7bbbe28-218f-49da-9214-56e4ff48fd99",
  "0xcafb01ab827b6d57ed17fc1db6091e094ef6a1d5": "e3484965-6d58-4c40-9e40-fcfbd019f271",
  "0x7872893e528fe2c0829e405960db5b742112aa97": "b56ecd94-1433-412b-9ebd-c313e5ae78cb",
}

export const fetchDefiLlamaAPY = async (benchmarkData: BenchmarkData[]): Promise<{ [vaultAddress: string]: number }> => {
  if (!benchmarkData.length) return {};
  
  const validBenchmarks = benchmarkData.filter(benchmark => benchmark.hVaultAddress);
  
  if (validBenchmarks.length === 0) {
    return {};
  }
  
  try {
    
    const poolsResponse = await fetch(DEFILLAMA_POOLS_URL);
    if (!poolsResponse.ok) {
      throw new Error('Failed to fetch DefiLlama pools');
    }
    
    const poolsData: DefiLlamaPoolsResponse = await poolsResponse.json();
    
    if (poolsData.status !== 'success' || !poolsData.data) {
      throw new Error('Invalid pools response from DefiLlama');
    }
    
    const apyData: { [vaultAddress: string]: number } = {};
    
    for (const benchmark of validBenchmarks) {
      const vaultAddress = benchmark.hVaultAddress.toLowerCase();
      const poolId = VaultPoolIdMap[vaultAddress];
      
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