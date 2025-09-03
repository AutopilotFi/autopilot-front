"use client"

import { useEffect, useState, useContext } from "react";
import { useWallet } from "@/providers/WalletProvider";
import { GlobalContext } from "@/providers/GlobalDataProvider";
import { useVaultMetrics } from "@/providers/VaultMetricsProvider";
import { EarningTransaction } from "@/types/globalAppTypes";
import EarningsPage from "@/components/EarningsPage";

export default function Home() {
  const [earningsData, setEarningsData] = useState<EarningTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const { account, chainId } = useWallet();
  const globalData = useContext(GlobalContext);
  const { vaultMetrics, isLoading: metricsLoading } = useVaultMetrics();

  useEffect(() => {
    const availableAutopilots = globalData?.availableAutopilots || [];
    
    if (!account?.address || !chainId || Object.keys(vaultMetrics).length === 0 || metricsLoading) {
      return;
    }

    try {
      setError(null);
      
      const allEarnings: EarningTransaction[] = [];
      
      // Process earnings from all available autopilots using cached metrics
      for (const autopilot of availableAutopilots) {
        try {
          // Use the vault data from the autopilot
          const vaultData = autopilot.vault;
          
          if (!vaultData?.vaultAddress) {
            continue;
          }

          // Get metrics from VaultMetricsProvider
          const result = vaultMetrics[vaultData.vaultAddress];
          if (!result || result.error) {
            console.warn(`No metrics available for vault: ${vaultData.vaultAddress}`);
            continue;
          }

          // Transform earnings data to match EarningTransaction type
          const vaultEarnings = result.metrics.earningsSeries.map((earning: { timestamp: number; amount: number; amountUsd?: number }, index: number) => ({
            id: `${autopilot.protocol}-${autopilot.asset}-${earning.timestamp}-${index}`,
            asset: autopilot.asset,
            showDecimals: autopilot.showDecimals,
            protocol: autopilot.protocol,
            amount: earning.amount,
            usdValue: earning.amountUsd || 0,
            timestamp: new Date(earning.timestamp * 1000),
            type: 'compound' as const // Harvest earnings are typically compound
          }));

          allEarnings.push(...vaultEarnings);
        } catch (vaultError) {
          console.error(`Error processing earnings for ${autopilot.protocol}-${autopilot.asset}:`, vaultError);
          // Continue with other vaults even if one fails
        }
      }

      // Sort all earnings by timestamp (newest first)
      const sortedEarnings = allEarnings.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setEarningsData(sortedEarnings);
    } catch (err) {
      console.error('Error processing earnings:', err);
      setError('Failed to process earnings data');
    }
  }, [account?.address, chainId, globalData?.availableAutopilots, vaultMetrics, metricsLoading]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Error</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!account?.address) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">Wallet Not Connected</div>
          <p className="text-gray-600">Please connect your wallet to view earnings history.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <EarningsPage
        earningsData={earningsData}
      />
    </>
  );
}
