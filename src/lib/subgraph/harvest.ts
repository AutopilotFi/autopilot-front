
export type ChainId = 1 | 137 | 324 | 8453 | 42161;

export type VaultHistory = {
  timestamp: number;
  sharePriceDec?: string; // normalized share price if available
  priceUnderlying?: string; // normalized token price if available
  vault?: { id: string };
};

export type UserBalanceHistory = {
  timestamp: number;
  value: string; // normalized underlying balance/value for the user
  vault?: { id: string };
};