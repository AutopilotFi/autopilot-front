import { GRAPH_URLS } from "@/consts/constants";
import { executeGraphCall } from "./client";

export type ChainId = 1 | 137 | 324 | 8453 | 42161;

export type PlasmaBalanceHistory = {
  timestamp: number;              // unix seconds
  sharePrice?: string;            // 1e(vaultDecimals)
  priceUnderlying?: string;       // 1e(tokenDecimals)
  blockNumber?: number;
  tx?: string;
};

export type PlasmaUserBalanceHistory = {
  timestamp: number;
  action?: string;                // 'deposit' | 'withdraw' | 'harvest' | ...
  amount?: string;                // assets amount 1e(tokenDecimals)
  shares?: string;                // shares amount 1e(vaultDecimals)
  tx?: string;
  // Flexible fields for unknown shapes:
  assets?: string;
  sharesDelta?: string;
  amountUsd?: string;
};

export type VaultPublish = { id: string; timestamp: number };

/** Lowercase helper */
const lc = (s: string) => s?.toLowerCase?.() ?? s;

/** Fetch vault-level history (priceUnderlying, sharePrice over time) for an IPOR Plasma vault */
export async function fetchIporVaultHistories(
  chainId: ChainId,
  vaultAddress: string,
): Promise<PlasmaBalanceHistory[]> {
  const url = GRAPH_URLS[chainId as keyof typeof GRAPH_URLS] as string;
  const query = `
    query getVaultHistories($vault: String!, $finishTime: BigInt!) {
      plasmaVaultHistories(
        first: 1000,
        where: { 
          plasmaVault: $vault,
          timestamp_lt: $finishTime
        },
        orderBy: timestamp,
        orderDirection: desc
      ) {
        timestamp, sharePrice, priceUnderlying, tvl, apy
      }
    }`;

  type Resp = { plasmaVaultHistories: Array<{ timestamp: string | number; sharePrice?: string; priceUnderlying?: string; tvl?: string | number; apy?: string | number; }> };
  
  let vaultHistoryData: Array<{ timestamp: number; sharePrice?: string; priceUnderlying?: string; tvl?: string | number; apy?: string | number }> = [];
  const finishTime = Math.ceil(new Date().getTime() / 1000);

  // Initial fetch
  const data = await executeGraphCall<Resp>(url, query, { vault: lc(vaultAddress), finishTime });
  vaultHistoryData = (data.plasmaVaultHistories || []).map(h => ({
    timestamp: typeof h.timestamp === "string" ? parseInt(h.timestamp, 10) : (h.timestamp || 0),
    sharePrice: h.sharePrice,
    priceUnderlying: h.priceUnderlying,
    tvl: h.tvl,
    apy: h.apy,
  }));

  // Fetch additional pages if we got exactly 1000 records
  while (vaultHistoryData.length % 1000 === 0 && vaultHistoryData.length > 0) {
    const lastTimestamp = vaultHistoryData[vaultHistoryData.length - 1].timestamp;
    const additionalData = await executeGraphCall<Resp>(url, query, { vault: lc(vaultAddress), finishTime: lastTimestamp });
    const additionalRecords = (additionalData?.plasmaVaultHistories || []).map(h => ({
      timestamp: typeof h.timestamp === "string" ? parseInt(h.timestamp, 10) : (h.timestamp || 0),
      sharePrice: h.sharePrice,
      priceUnderlying: h.priceUnderlying,
      tvl: h.tvl,
      apy: h.apy,
    }));
    vaultHistoryData = vaultHistoryData.concat(additionalRecords);
    
    if (additionalRecords.length < 1000) {
      break;
    }
  }

  return vaultHistoryData;
}

/** Fetch user-level activity for a given IPOR Plasma vault */
export async function fetchIporUserBalanceHistories(
  chainId: ChainId,
  vaultAddress: string,
  account: string
): Promise<PlasmaUserBalanceHistory[]> {
  const url = GRAPH_URLS[chainId as keyof typeof GRAPH_URLS] as string;
  const query = `
    query getUserBalanceHistories($vault: String!, $account: String!, $finishTime: BigInt!) {
      plasmaUserBalanceHistories(
        first: 1000,
        where: { plasmaVault: $vault, userAddress: $account, timestamp_lt: $finishTime },
        orderBy: timestamp,
        orderDirection: desc
      ) {
        value, timestamp, plasmaVault{id}
      }
    }`;

  type Resp = { plasmaUserBalanceHistories: Array<{ timestamp: string | number; value: string; plasmaVault: { id: string } }> };
  
  let userHistoryData: Array<{ timestamp: number; value: string; plasmaVault: { id: string } }> = [];
  const finishTime = Math.ceil(new Date().getTime() / 1000);

  // Initial fetch
  const data = await executeGraphCall<Resp>(url, query, { vault: lc(vaultAddress), account: lc(account), finishTime });
  userHistoryData = (data.plasmaUserBalanceHistories || []).map((r) => ({
    timestamp: typeof r.timestamp === "string" ? parseInt(r.timestamp, 10) : (r.timestamp || 0),
    value: r.value,
    plasmaVault: r.plasmaVault,
  }));

  // Fetch additional pages if we got exactly 1000 records
  while (userHistoryData.length % 1000 === 0 && userHistoryData.length > 0) {
    const lastTimestamp = userHistoryData[userHistoryData.length - 1].timestamp;
    const additionalData = await executeGraphCall<Resp>(url, query, { vault: lc(vaultAddress), account: lc(account), finishTime: lastTimestamp });
    const additionalRecords = (additionalData?.plasmaUserBalanceHistories || []).map((r) => ({
      timestamp: typeof r.timestamp === "string" ? parseInt(r.timestamp, 10) : (r.timestamp || 0),
      value: r.value,
      plasmaVault: r.plasmaVault,
    }));
    userHistoryData = userHistoryData.concat(additionalRecords);
    
    if (additionalRecords.length < 1000) {
      break;
    }
  }

  return userHistoryData;
}

/** Try to fetch publish date for a vault, falling back to earliest history timestamp */
export async function fetchVaultPublishDate(
  chainId: ChainId,
  vaultAddress: string
): Promise<number | null> {
  const url = GRAPH_URLS[chainId as keyof typeof GRAPH_URLS] as string;
  const query = `
    query getVault($id: ID!) {
      vault(id: $id) { id timestamp }
    }`;

  type Resp = { vault?: { id: string; timestamp: string | number } | null };
  try {
    const data = await executeGraphCall<Resp>(url, query, { id: lc(vaultAddress) });
    const ts = data?.vault?.timestamp;
    if (typeof ts === "string") return parseInt(ts, 10);
    if (typeof ts === "number") return ts;
  } catch {
    // fallthrough
  }

  // Fallback: earliest plasmaBalanceHistories
  try {
    const hist = await fetchIporVaultHistories(chainId, vaultAddress);
    if (!hist.length) return null;
    const minTs = hist.reduce((min, h) => Math.min(min, h.timestamp || Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER);
    return Number.isFinite(minTs) ? minTs : null;
  } catch {
    return null;
  }
}

/** Aggregate totals from user balance history in a schema-agnostic way. */
export function aggregateUserTotals(
  records: PlasmaUserBalanceHistory[]
): {
  totalDeposits: bigint;
  totalWithdrawals: bigint;
  totalEarnings: bigint;
  totalActions: number;
  earningsSeries: Array<{ timestamp: number; amount: bigint }>;
} {
  let deposits = BigInt(0);
  let withdrawals = BigInt(0);
  let earnings = BigInt(0);
  const series: Array<{ timestamp: number; amount: bigint }> = [];

  const inferType = (r: PlasmaUserBalanceHistory): "deposit" | "withdraw" | "earn" | "unknown" => {
    const a = (r.action || "").toLowerCase();
    if (a.includes("deposit") || a.includes("mint")) return "deposit";
    if (a.includes("withdraw") || a.includes("redeem") || a.includes("burn")) return "withdraw";
    if (a.includes("earn") || a.includes("harvest") || a.includes("reward") || a.includes("yield")) return "earn";
    // Heuristic: assets positive without action => deposit, negative => withdraw
    if (r.amount && r.amount.startsWith("-")) return "withdraw";
    if (r.amount && !r.amount.startsWith("-")) return "deposit";
    return "unknown";
  };

  for (const r of records) {
    const amtStr = r.amount ?? r.assets ?? "0";
    let amt: bigint;
    try { amt = BigInt(amtStr); } catch { amt = BigInt(0); }
    const kind = inferType(r);

    if (kind === "deposit") deposits += (amt < BigInt(0) ? -amt : amt);
    else if (kind === "withdraw") withdrawals += (amt < BigInt(0) ? -amt : amt);
    else if (kind === "earn") {
      earnings += (amt < BigInt(0) ? -amt : amt);
      series.push({ timestamp: r.timestamp, amount: (amt < BigInt(0) ? -amt : amt) });
    }
  }

  return {
    totalDeposits: deposits,
    totalWithdrawals: withdrawals,
    totalEarnings: earnings,
    totalActions: records.length,
    earningsSeries: series.sort((a, b) => a.timestamp - b.timestamp),
  };
}

