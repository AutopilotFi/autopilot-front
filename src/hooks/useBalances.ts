"use client";

import { useCallback, useEffect, useState } from "react";
import { Address, formatUnits } from "viem";
import { useWallet } from "@/providers/WalletProvider";
import { erc20Abi } from "@/lib/contracts/erc20";

export interface BalanceData {
  tokenBalance: string;
  vaultBalance: string;
  tokenBalanceFormatted: number;
  vaultBalanceFormatted: number;
  loading: boolean;
  error: string | null;
}

export function useBalances(tokenAddress: string, vaultAddress: string, tokenDecimals: number, vaultDecimals: number) {
  const { publicClient, account, isConnected } = useWallet();
  const [balances, setBalances] = useState<BalanceData>({
    tokenBalance: "0",
    vaultBalance: "0",
    tokenBalanceFormatted: 0,
    vaultBalanceFormatted: 0,
    loading: false,
    error: null,
  });

  const fetchBalances = useCallback(async () => {
    if (!publicClient || !account?.address || !isConnected) {
      setBalances(prev => ({
        ...prev,
        tokenBalance: "0",
        vaultBalance: "0",
        tokenBalanceFormatted: 0,
        vaultBalanceFormatted: 0,
        loading: false,
        error: null,
      }));
      return;
    }

    try {
      setBalances(prev => ({ ...prev, loading: true, error: null }));

      const [tokenBalance, vaultBalance] = await Promise.all([
        // Get token balance
        publicClient.readContract({
          address: tokenAddress as Address,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [account.address],
        }) as Promise<bigint>,
        // Get vault shares balance
        publicClient.readContract({
          address: vaultAddress as Address,
          abi: erc20Abi, // Vault tokens are ERC20-like
          functionName: "balanceOf",
          args: [account.address],
        }) as Promise<bigint>,
      ]);

      const tokenBalanceFormatted = parseFloat(formatUnits(tokenBalance, tokenDecimals));
      const vaultBalanceFormatted = parseFloat(formatUnits(vaultBalance, vaultDecimals));

      setBalances({
        tokenBalance: tokenBalance.toString(),
        vaultBalance: vaultBalance.toString(),
        tokenBalanceFormatted,
        vaultBalanceFormatted,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching balances:", error);
      setBalances(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch balances",
      }));
    }
  }, [publicClient, account?.address, isConnected, tokenAddress, vaultAddress, tokenDecimals, vaultDecimals]);

  // Fetch balances on mount and when dependencies change
  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return {
    ...balances,
    refetch: fetchBalances,
  };
}
