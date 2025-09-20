'use client';

import { useCallback, useEffect, useState } from 'react';
import { Address, formatUnits } from 'viem';
import { useWallet } from '@/providers/WalletProvider';
import { erc20Abi } from '@/lib/contracts/erc20';
import { convertVaultToAssets } from '@/lib/contracts/iporVault';

export interface BalanceData {
  tokenBalance: string;
  vaultBalance: string;
  tokenBalanceFormatted: number;
  vaultBalanceFormatted: number; // This will now be the underlying token amount (converted from vault shares)
  loading: boolean;
  error: string | null;
}

export function useBalances(tokenAddress: string, vaultAddress: string, tokenDecimals: number) {
  const { publicClient, account, isConnected } = useWallet();
  const [balances, setBalances] = useState<BalanceData>({
    tokenBalance: '0',
    vaultBalance: '0',
    tokenBalanceFormatted: 0,
    vaultBalanceFormatted: 0,
    loading: false,
    error: null,
  });

  const fetchBalances = useCallback(async () => {
    if (!publicClient || !account?.address || !isConnected) {
      setBalances(prev => ({
        ...prev,
        tokenBalance: '0',
        vaultBalance: '0',
        tokenBalanceFormatted: 0,
        vaultBalanceFormatted: 0,
        loading: false,
        error: null,
      }));
      return;
    }

    try {
      setBalances(prev => ({ ...prev, loading: true, error: null }));

      const [tokenBalance, vaultSharesBalance] = await Promise.all([
        // Get token balance
        publicClient.readContract({
          address: tokenAddress as Address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [account.address],
        }) as Promise<bigint>,
        // Get vault shares balance
        publicClient.readContract({
          address: vaultAddress as Address,
          abi: erc20Abi, // Vault tokens are ERC20-like
          functionName: 'balanceOf',
          args: [account.address],
        }) as Promise<bigint>,
      ]);

      // Convert vault shares to underlying token amount
      const underlyingTokenAmount =
        vaultSharesBalance > BigInt(0)
          ? await convertVaultToAssets(publicClient, vaultAddress, vaultSharesBalance)
          : BigInt(0);

      const tokenBalanceFormatted = parseFloat(formatUnits(tokenBalance, tokenDecimals));
      const vaultBalanceFormatted = parseFloat(formatUnits(underlyingTokenAmount, tokenDecimals)); // Use tokenDecimals for underlying amount

      setBalances({
        tokenBalance: tokenBalance.toString(),
        vaultBalance: vaultSharesBalance.toString(), // Keep original vault shares for reference
        tokenBalanceFormatted,
        vaultBalanceFormatted,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching balances:', error);
      setBalances(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch balances',
      }));
    }
  }, [publicClient, account?.address, isConnected, tokenAddress, vaultAddress, tokenDecimals]);

  // Fetch balances on mount and when dependencies change
  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return {
    ...balances,
    refetch: fetchBalances,
  };
}
