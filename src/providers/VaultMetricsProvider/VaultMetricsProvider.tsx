'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useWallet } from '@/providers/WalletProvider';
import { GlobalContext } from '@/providers/GlobalDataProvider';
import { getHarvestMetrics } from '@/hooks/useHarvestMetrics';
import { Metrics } from '@/hooks/useHarvestMetrics';

interface VaultMetrics {
  [vaultAddress: string]: {
    metrics: Metrics;
    lastUpdated: number;
    error?: string;
  };
}

interface VaultMetricsContextType {
  vaultMetrics: VaultMetrics;
  isLoading: boolean;
  error: string | null;
  refreshMetrics: () => Promise<void>;
  getMetricsForVault: (vaultAddress: string) => Metrics | null;
}

const VaultMetricsContext = createContext<VaultMetricsContextType | undefined>(undefined);

export const useVaultMetrics = () => {
  const context = useContext(VaultMetricsContext);
  if (context === undefined) {
    throw new Error('useVaultMetrics must be used within a VaultMetricsProvider');
  }
  return context;
};

interface VaultMetricsProviderProps {
  children: ReactNode;
}

export const VaultMetricsProvider: React.FC<VaultMetricsProviderProps> = ({ children }) => {
  const [vaultMetrics, setVaultMetrics] = useState<VaultMetrics>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { account, isConnected } = useWallet();
  const globalData = useContext(GlobalContext);
  const availableAutopilots = globalData?.availableAutopilots || [];

  const fetchAllVaultMetrics = async () => {
    if (availableAutopilots.length === 0) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const newVaultMetrics: VaultMetrics = {};

      // Fetch metrics for each available autopilot
      for (const autopilot of availableAutopilots) {
        try {
          const vaultData = autopilot.vault;

          if (!vaultData?.vaultAddress) {
            continue;
          }

          // Get metrics for this vault
          const result = await getHarvestMetrics(
            vaultData.vaultAddress as `0x${string}`,
            Number(vaultData.chain) as 1 | 137 | 324 | 8453 | 42161,
            account?.address ?? '0x0000000000000000000000000000000000000000',
            vaultData.decimals || '6',
            vaultData.vaultDecimals || '18'
          );

          newVaultMetrics[vaultData.vaultAddress] = {
            metrics: result,
            lastUpdated: Date.now(),
          };
        } catch (vaultError) {
          console.error(
            `Error fetching metrics for ${autopilot.protocol}-${autopilot.asset}:`,
            vaultError
          );

          // Store error state for this vault
          newVaultMetrics[autopilot.vault.vaultAddress] = {
            metrics: {} as Metrics,
            lastUpdated: Date.now(),
            error: `Failed to fetch metrics: ${vaultError instanceof Error ? vaultError.message : 'Unknown error'}`,
          };
        }
      }

      setVaultMetrics(newVaultMetrics);
    } catch (err) {
      console.error('Error fetching vault metrics:', err);
      setError('Failed to fetch vault metrics');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMetrics = async () => {
    await fetchAllVaultMetrics();
  };

  const getMetricsForVault = (vaultAddress: string): Metrics | null => {
    const vaultData = vaultMetrics[vaultAddress];
    if (!vaultData || vaultData.error) {
      return null;
    }
    return vaultData.metrics;
  };

  // Fetch metrics when wallet connects or autopilots change
  useEffect(() => {
    fetchAllVaultMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.address, availableAutopilots, isConnected]);

  // Auto-refresh metrics every 5 minutes
  useEffect(() => {
    if (!account?.address || availableAutopilots.length === 0) {
      return;
    }

    const interval = setInterval(
      () => {
        fetchAllVaultMetrics();
      },
      5 * 60 * 1000
    ); // 5 minutes

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.address, availableAutopilots]);

  const value: VaultMetricsContextType = {
    vaultMetrics,
    isLoading,
    error,
    refreshMetrics,
    getMetricsForVault,
  };

  return <VaultMetricsContext.Provider value={value}>{children}</VaultMetricsContext.Provider>;
};
