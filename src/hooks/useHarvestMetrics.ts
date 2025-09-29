'use client';

import type { Address } from 'viem';
import type { ChainId } from '@/lib/subgraph/harvest';
import { fetchIporVaultHistories, fetchIporUserBalanceHistories } from '@/lib/subgraph/ipor';
import { formatFrequency, formatDate, fromWei, formatNumber } from '@/helpers/utils';
type VaultHistoryEntry = {
  timestamp: number;
  sharePrice?: string | number | null;
  priceUnderlying?: string | number | null;
  tvl?: string | number | null;
  apy?: string | number | null;
  value?: string | number | null;
};

type BalanceHistoryEntry = {
  timestamp: number;
  value?: string | number | null;
  priceUnderlying?: string | number | null;
  sharePrice?: string | number | null;
  tvl?: string | number | null;
  apy?: string | number | null;
  tx?: string;
};

type EnrichedDataEntry = VaultHistoryEntry &
  BalanceHistoryEntry & {
    event: string;
    balance: number;
    balanceUsd: number;
    netChange: number;
    netChangeUsd: number;
    value: string | number | null;
    tx?: string;
  };

const calculateApy = (
  vaultHData: VaultHistoryEntry[],
  latestSharePriceValue: number,
  tokenDecimals: number,
  periodDays: number
): string => {
  const cutoffTimestamp = vaultHData[0]?.timestamp - periodDays * 24 * 3600;
  const filteredData = vaultHData.filter(entry => Number(entry.timestamp) >= cutoffTimestamp);

  if (filteredData.length === 0) return '0%';

  const initialSharePrice = Number(
    fromWei(
      filteredData[filteredData.length - 1]?.sharePrice || '1',
      tokenDecimals,
      tokenDecimals,
      false
    )
  );

  return formatNumber(((latestSharePriceValue - initialSharePrice) / (periodDays / 365)) * 100, 2);
};

const processBalanceAndVaultData = (
  balanceData: BalanceHistoryEntry[],
  vaultData: VaultHistoryEntry[],
  tokenDecimals: number,
  vaultDecimals = 8
) => {
  const timestamps: number[] = [];
  const uniqueVaultHData: VaultHistoryEntry[] = [];
  const updatedBalanceData: BalanceHistoryEntry[] = [];
  const mergedData: (VaultHistoryEntry & BalanceHistoryEntry)[] = [];
  let enrichedData: EnrichedDataEntry[] = [];
  let sumNetChange = 0;
  let sumNetChangeUsd = 0;
  let sumLatestNetChange = 0;
  let sumLatestNetChangeUsd = 0;

  if (vaultData && vaultData.length > 0) {
    vaultData.forEach(obj => {
      if (!timestamps.includes(obj.timestamp)) {
        timestamps.push(obj.timestamp);
        const sharePriceDecimals = Number(
          fromWei(obj.sharePrice || '1', tokenDecimals, tokenDecimals)
        );
        const modifiedObj = { ...obj, sharePrice: sharePriceDecimals };
        uniqueVaultHData.push(modifiedObj);
      }
    });
  }

  if (balanceData) {
    balanceData.forEach(obj => {
      timestamps.push(obj.timestamp);
      const valueDecimals = Number(fromWei(obj.value || '0', vaultDecimals, vaultDecimals));
      const modifiedObj = { ...obj, value: valueDecimals };
      updatedBalanceData.push(modifiedObj);
    });
  }

  if (balanceData && uniqueVaultHData.length > 0) {
    let uniqueData: (VaultHistoryEntry & BalanceHistoryEntry)[] = [];
    let uniqueFixedData: (VaultHistoryEntry & BalanceHistoryEntry)[] = [];
    let lastUserEvent = false;
    let lastUserEventUsd = false;
    let lastKnownSharePrice: string | number | null = null;
    let lastKnownPriceUnderlying: string | number | null = null;

    const processedBalanceData = updatedBalanceData;

    processedBalanceData.sort((a, b) => b.timestamp - a.timestamp);
    uniqueVaultHData.sort((a, b) => b.timestamp - a.timestamp);

    const bl = processedBalanceData.length;
    const ul = uniqueVaultHData.length;

    let i = 0,
      z = 0;
    while (i < bl || z < ul) {
      if (
        i < bl &&
        (z >= ul || processedBalanceData[i].timestamp > (uniqueVaultHData[z]?.timestamp || 0))
      ) {
        const balanceEntry = { ...processedBalanceData[i] };
        balanceEntry.priceUnderlying =
          uniqueVaultHData[z]?.priceUnderlying ||
          uniqueVaultHData[z - 1]?.priceUnderlying ||
          lastKnownPriceUnderlying;
        balanceEntry.sharePrice =
          uniqueVaultHData[z]?.sharePrice ||
          uniqueVaultHData[z - 1]?.sharePrice ||
          lastKnownSharePrice;
        balanceEntry.tvl = uniqueVaultHData[z]?.tvl || 0;
        balanceEntry.apy = uniqueVaultHData[z]?.apy || 0;
        mergedData.push(balanceEntry);
        i += 1;
      } else {
        const vaultEntry = { ...uniqueVaultHData[z] };
        vaultEntry.value = processedBalanceData[i]?.value || 0;
        mergedData.push(vaultEntry);
        z += 1;
      }
    }

    const map = new Map();
    mergedData.forEach(item => {
      const key = `${item.value}_${item.sharePrice}_${item.tx}`;
      map.set(key, item);
    });

    uniqueData = Array.from(map.values());
    uniqueData.sort((a, b) => b.timestamp - a.timestamp);

    uniqueFixedData = uniqueData.map(item => {
      if (item.sharePrice === '0' || item.sharePrice === 0) {
        item.sharePrice = lastKnownSharePrice !== null ? lastKnownSharePrice : item.sharePrice;
      } else {
        lastKnownSharePrice = item.sharePrice || null;
      }

      if (item.priceUnderlying === '0' || item.priceUnderlying === 0) {
        item.priceUnderlying =
          lastKnownPriceUnderlying !== null ? lastKnownPriceUnderlying : item.priceUnderlying;
      } else {
        lastKnownPriceUnderlying = item.priceUnderlying || null;
      }

      return item;
    });

    enrichedData = uniqueFixedData
      .map((item, index, array) => {
        const nextItem = array[index + 1];
        let event: string,
          balance: number,
          balanceUsd: number,
          netChange: number,
          netChangeUsd: number;

        if (Number(item.value) === 0) {
          if (nextItem && Number(nextItem.value) === 0) {
            return null;
          }
          balance = 0;
          balanceUsd = 0;
        } else {
          balance = Number(item.value) * Number(item.sharePrice);
          balanceUsd = balance * Number(item.priceUnderlying);
        }

        if (nextItem) {
          if (Number(item.value) === Number(nextItem.value)) {
            event = 'Harvest';
          } else if (Number(item.value) > Number(nextItem.value)) {
            event = 'Convert';
          } else {
            event = 'Revert';
          }

          const nextBalance = Number(nextItem.value) * Number(nextItem.sharePrice);
          netChange = balance - nextBalance;
          netChangeUsd = Number(netChange) * Number(item.priceUnderlying);
        } else {
          event = 'Convert';
          netChange = balance;
          netChangeUsd = netChange * Number(item.priceUnderlying);
        }

        return {
          ...item,
          event,
          balance,
          balanceUsd,
          netChange,
          netChangeUsd,
          value: item.value ?? null,
          tx: item.tx,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    // Calculate sums
    sumNetChange = enrichedData.reduce((sumValue, item) => {
      if (item.event === 'Harvest') {
        return sumValue + item.netChange;
      }
      return sumValue;
    }, 0);

    sumNetChangeUsd = enrichedData.reduce((sumUsdValue, item) => {
      if (item.event === 'Harvest') {
        return sumUsdValue + item.netChangeUsd;
      }
      return sumUsdValue;
    }, 0);

    // Calculate latest net change values
    enrichedData.forEach(item => {
      if (!lastUserEvent) {
        if (item.event === 'Harvest') {
          sumLatestNetChange += item.netChange;
        } else if (item.event === 'Convert' || item.event === 'Revert') {
          lastUserEvent = true;
        }
      }
    });

    enrichedData.forEach(item => {
      if (!lastUserEventUsd) {
        if (item.event === 'Harvest') {
          sumLatestNetChangeUsd += item.netChangeUsd;
        } else if (item.event === 'Convert' || item.event === 'Revert') {
          lastUserEventUsd = true;
        }
      }
    });
  }

  return {
    sumNetChange,
    sumNetChangeUsd,
    sumLatestNetChange,
    sumLatestNetChangeUsd,
    enrichedData,
    uniqueVaultHData,
  };
};

export type Metrics = {
  loading: boolean;
  error: string | null;
  apy7d: string | null;
  apy30d: string | null;
  latestSharePrice: number;
  initialSharePrice: number;
  totalBalance: number;
  totalEarnings: number;
  monthlyForecast: number;
  frequency: string;
  latestUpdate: string;
  operatingSince: string;
  earningsSeries: Array<{ timestamp: number; amount: number; amountUsd: number }>;
  uniqueVaultHData: VaultHistoryEntry[];
  deposits: Array<{ timestamp: number; amount: number; amountUsd: number; tx?: string }>;
  withdrawals: Array<{ timestamp: number; amount: number; amountUsd: number; tx?: string }>;
  latestUnderlyingPrice: number;
};

export async function getHarvestMetrics(
  vaultAddress: Address,
  chainId: ChainId,
  accountAddress: Address,
  tokenDecimals: string,
  vaultDecimals: string
): Promise<Metrics> {
  try {
    const [vh, uh] = await Promise.all([
      fetchIporVaultHistories(chainId, vaultAddress.toLowerCase()),
      fetchIporUserBalanceHistories(
        chainId,
        vaultAddress.toLowerCase(),
        accountAddress.toLowerCase()
      ),
    ]);

    // Process the data using the comprehensive processing function
    const processedData = processBalanceAndVaultData(
      uh,
      vh,
      Number(tokenDecimals),
      Number(vaultDecimals)
    );
    // Calculate APYs using the new method
    const latestSharePrice =
      vh.length > 0
        ? Number(fromWei(Number(vh[0]?.sharePrice), Number(tokenDecimals), Number(tokenDecimals)))
        : 1;
    const initialSharePrice =
      vh.length > 0
        ? Number(
            fromWei(
              vh[vh.length - 1]?.sharePrice || '1',
              Number(tokenDecimals),
              Number(tokenDecimals)
            )
          )
        : 1;
    const apy7d =
      vh.length >= 7 ? calculateApy(vh, latestSharePrice, Number(tokenDecimals), 7) : null;
    const apy30d =
      vh.length >= 30 ? calculateApy(vh, latestSharePrice, Number(tokenDecimals), 30) : null;

    // Calculate earnings data
    const earningsData = processedData.enrichedData.filter(item => item.event === 'Harvest');

    const totalEarnings = processedData.sumNetChange;

    const frequency =
      earningsData.length > 1
        ? formatFrequency(
            (earningsData[0].timestamp - earningsData[earningsData.length - 1].timestamp) /
              (earningsData.length - 1)
          )
        : '—';
    const latestUpdate =
      earningsData.length > 0
        ? formatFrequency(Date.now() / 1000 - earningsData[0].timestamp)
        : '—';

    const operatingSince = vh.length > 0 ? formatDate(vh[vh.length - 1].timestamp) : '—';

    // Calculate deposits and withdrawals
    const deposits = processedData.enrichedData.filter(
      item => item.event === 'Convert' && item.netChange > 0
    );
    const withdrawals = processedData.enrichedData.filter(
      item => item.event === 'Revert' && item.netChange < 0
    );

    // Current balance
    const currentBalance =
      processedData.enrichedData.length > 0 ? processedData.enrichedData[0]?.balance || 0 : 0;

    // Monthly forecast
    const monthlyForecast =
      apy30d != null ? currentBalance * (Math.pow(1 + Number(apy30d) / 100, 30 / 365) - 1) : 0;

    return {
      loading: false,
      error: null,
      apy7d,
      apy30d,
      latestSharePrice,
      initialSharePrice,
      totalBalance: currentBalance,
      totalEarnings,
      monthlyForecast,
      frequency,
      latestUpdate,
      operatingSince,
      earningsSeries: earningsData.map(e => ({
        timestamp: e.timestamp,
        amount: e.netChange,
        amountUsd: e.netChangeUsd,
      })),
      uniqueVaultHData: processedData.uniqueVaultHData,
      deposits: deposits.map(d => ({
        timestamp: d.timestamp,
        amount: d.netChange,
        amountUsd: d.netChangeUsd,
        tx: d.tx,
      })),
      withdrawals: withdrawals.map(w => ({
        timestamp: w.timestamp,
        amount: Math.abs(w.netChange),
        amountUsd: Math.abs(w.netChangeUsd),
        tx: w.tx,
      })),
      latestUnderlyingPrice: Number(vh[0]?.priceUnderlying || 1),
    };
  } catch (e: unknown) {
    console.error('Error in getHarvestMetrics:', e);
    return {
      loading: false,
      error: (e as Error)?.message ?? String(e),
      apy7d: null,
      apy30d: null,
      latestSharePrice: 1,
      initialSharePrice: 1,
      totalBalance: 0,
      totalEarnings: 0,
      monthlyForecast: 0,
      frequency: '—',
      latestUpdate: '—',
      operatingSince: '—',
      earningsSeries: [],
      uniqueVaultHData: [],
      deposits: [],
      withdrawals: [],
      latestUnderlyingPrice: 1,
    };
  }
}
