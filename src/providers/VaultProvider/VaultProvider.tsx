"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { VaultApiResponse, VaultContextData, VaultHistoryData, VaultData, FullVaultData } from '@/types/globalAppTypes';
import { HARVEST_VAULT_API_URL, IPOR_API_URL } from '@/consts/constants';

const defaultVaultData: VaultContextData = {
  baseVaultData: [],
  iporVaultData: [],
  loading: true,
  error: null,
  refetch: async () => {},
};

export const VaultContext = createContext<VaultContextData>(defaultVaultData);

async function fetchVaults(): Promise<{ base: FullVaultData[]; ipor: FullVaultData[] }> {
  const harvestRes = HARVEST_VAULT_API_URL ? await fetch(HARVEST_VAULT_API_URL).then(res => res.json()).then(data => ({ data })) : { data: null };

  let baseVaultData: FullVaultData[] = [];
  let iporVaultData: FullVaultData[] = [];

  const hv: VaultApiResponse | null = harvestRes.data;
  
  if (hv) {
    // Flatten chain sections into array
    const flatten = (net?: unknown) => {
      if (!net) return [];
      const arr = Object.values(net || {}) as unknown[];
      return arr.flatMap(section => (section as { vaults?: unknown[] })?.vaults || section) as VaultData[];
    };
    const allVaults = [
      // ...flatten(hv.eth),
      // ...flatten(hv.matic),
      // ...flatten(hv.arbitrum),
      ...flatten(hv.base),
      // ...flatten(hv.zksync),
    ].filter(Boolean);

    const withHistory = allVaults.map((v) => ({ ...v, plasmaHistory: null } as FullVaultData));
    // Split: only IPOR vaults in iporVaultData, everything else in baseVaultData
    iporVaultData = withHistory.filter(v => v.isIPORVault === true && !v.inactive);
    baseVaultData = withHistory;

    // Populate hVaultAddress in allocPointData by matching hVaultId with base vaults
    iporVaultData.forEach(iporVault => {
      if (iporVault.allocPointData) {
        iporVault.allocPointData.forEach(allocPoint => {
          const baseVault = allVaults.find(v => v.id === allocPoint.hVaultId);
          if (baseVault) {
            allocPoint.hVaultAddress = baseVault.vaultAddress;
          }
        });
      }
    });
  }

  return { base: baseVaultData, ipor: iporVaultData };
}

export default function VaultProvider({ children }: { children: ReactNode }) {
  const [baseVaultData, setBaseVaultData] = useState<FullVaultData[]>([]);
  const [iporVaultData, setIporVaultData] = useState<FullVaultData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const { base, ipor } = await fetchVaults();

      // Enrich IPOR vaults with plasma histories from IPOR API
      const enriched = await Promise.all(
        ipor.map(async (v) => {
          const chainId: number = Number(v.chain)

          let plasmaHistory: VaultHistoryData[] | null = null;
          try {
            const iporApiUrl = `${IPOR_API_URL}/fusion/vaults-history/${chainId}/${v.vaultAddress.toLowerCase()}`;
            
            const response = await fetch(iporApiUrl);
            const data = await response.json();
            
            if (data.history && Array.isArray(data.history)) {
              // Convert IPOR API format to VaultHistoryData format
              plasmaHistory = data.history.map((h: { blockNumber?: number; blockTimestamp: string; assetsToSharesRatio?: string; tvl: string; totalBalance: string; apy: string; apr: string; marketBalances: unknown[] }) => ({
                blockNumber: h.blockNumber ?? 0,
                blockTimestamp: h.blockTimestamp,
                sharePrice: h.assetsToSharesRatio ?? '1',
                tvl: h.tvl,
                totalBalance: h.totalBalance,
                apy: h.apy,
                apr: h.apr,
                marketBalances: h.marketBalances,
                txHash: undefined,
              })) as VaultHistoryData[];
              
            }
          } catch (e) {
            console.warn('Failed to fetch IPOR history for vault:', v.vaultAddress, e);
            // ignore per-vault failures, keep others
          }
          return { ...v, plasmaHistory: plasmaHistory && Array.isArray(plasmaHistory) && plasmaHistory.length > 0 ? plasmaHistory[plasmaHistory.length - 1] : null };
        })
      );

      setBaseVaultData(base);
      setIporVaultData(enriched);
    } catch (e: unknown) {
      setError((e as Error)?.message ?? 'Failed to load vault data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const contextValue: VaultContextData = {
    baseVaultData,
    iporVaultData,
    loading,
    error,
    refetch: load,
  };

  return <VaultContext.Provider value={contextValue}>{children}</VaultContext.Provider>;
}

export const useIPORVaults = () => {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error('useVaults must be used within a VaultProvider');
  }
  return context;
};
