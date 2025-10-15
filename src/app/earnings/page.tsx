'use client';

import { useEffect, useState, useContext } from 'react';
import { useWallet } from '@/providers/WalletProvider';
import { GlobalContext } from '@/providers/GlobalDataProvider';
import { useVaultMetrics } from '@/providers/VaultMetricsProvider';
import { Earnings } from '@/types/globalAppTypes';
import EarningsPage from '@/components/EarningsPage';
import { getChainNameFromId } from '@/helpers/utils';

export default function Home() {
  const [earningsData, setEarningsData] = useState<Earnings>([]);
  const [userTotalBalance, setUserTotalBalance] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { account } = useWallet();
  const globalData = useContext(GlobalContext);
  const { vaultMetrics, isLoading: metricsLoading } = useVaultMetrics();

  useEffect(() => {
    const availableAutopilots = globalData?.availableAutopilots || [];

    if (Object.keys(vaultMetrics).length === 0 || metricsLoading) {
      return;
    }

    try {
      setError(null);

      const allEarnings: Earnings = [];
      let totalUserBalance = 0;

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

          const totalVaultUserBalance = result.metrics.totalBalance;
          totalUserBalance += totalVaultUserBalance;
          // Transform earnings data to match Earnings type
          const vaultEarnings: Earnings = result.metrics.earningsSeries.map(
            (earning: { timestamp: number; amount: number; amountUsd?: number }) => ({
              asset: autopilot.asset,
              protocol: autopilot.protocol,
              amount: earning.amount,
              value: earning.amountUsd || 0,
              time: earning.timestamp,
              type: 'compound' as const, // Harvest earnings are typically compound
              chainName: getChainNameFromId(Number(vaultData.chain)),
            })
          );

          allEarnings.push(...vaultEarnings);
        } catch (vaultError) {
          console.error(
            `Error processing earnings for ${autopilot.protocol}-${autopilot.asset}:`,
            vaultError
          );
          // Continue with other vaults even if one fails
        }
      }

      // Sort all earnings by timestamp (newest first)
      const sortedEarnings = allEarnings.sort((a, b) => b.time - a.time);

      setUserTotalBalance(totalUserBalance);
      setEarningsData(sortedEarnings);
    } catch (err) {
      console.error('Error processing earnings:', err);
      setError('Failed to process earnings data');
    }
  }, [globalData?.availableAutopilots, vaultMetrics, metricsLoading]);

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

  return (
    <>
      <EarningsPage
        earningsData={earningsData}
        isLoading={metricsLoading}
        userTotalBalance={userTotalBalance}
        account={account}
      />
    </>
  );
}
