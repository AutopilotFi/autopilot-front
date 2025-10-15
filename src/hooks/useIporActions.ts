'use client';

import { useCallback } from 'react';
import { Address, parseUnits, createWalletClient, custom } from 'viem';
import { useWallet } from '@/providers/WalletProvider';
import { iporVaultAbi } from '@/lib/contracts/iporVault';
import { erc20Abi } from '@/lib/contracts/erc20';
import { walletAddress } from '@/consts/constants';

type Hash = `0x${string}`;

export function useIporActions() {
  const { walletClient, publicClient } = useWallet();

  const ensureClients = useCallback(() => {
    if (!publicClient) {
      throw new Error('Connect your wallet first.');
    }

    if (!walletClient) {
      console.log('walletClient not available, will create on-demand');
    }
  }, [walletClient, publicClient]);

  const getWalletClient = useCallback(() => {
    if (!window?.ethereum) {
      throw new Error('Wallet not available');
    }

    return createWalletClient({
      account: walletAddress,
      transport: custom(window.ethereum),
    });
  }, []);

  const approveIfNeeded = useCallback(
    async (token: Address, owner: Address, spender: Address, amount: bigint) => {
      if (!publicClient) throw new Error('Public client not ready');
      const allowance = (await publicClient.readContract({
        address: token,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [owner, spender],
      })) as bigint;
      if (allowance >= amount) return null;

      const wc = getWalletClient();
      const hash = await wc.writeContract({
        address: token,
        abi: erc20Abi,
        functionName: 'approve',
        args: [spender, amount],
        account: owner,
        chain: null,
      });
      // wait for confirmation
      await publicClient.waitForTransactionReceipt({ hash });
      return hash as Hash;
    },
    [publicClient, getWalletClient]
  );

  const deposit = useCallback(
    async (vault: Address, underlying: Address, amount: string, decimals: number) => {
      ensureClients();
      const owner = walletAddress as Address;
      const assets = parseUnits(amount, decimals);

      // 1) approve underlying to vault
      await approveIfNeeded(underlying, owner, vault, assets);

      // 2) deposit
      const wc = getWalletClient();
      const tx = await wc.writeContract({
        address: vault,
        abi: iporVaultAbi,
        functionName: 'deposit',
        args: [assets, owner],
        account: owner,
        chain: null,
      });
      const receipt = await publicClient!.waitForTransactionReceipt({ hash: tx });
      return { hash: tx as Hash, receipt };
    },
    [approveIfNeeded, publicClient, getWalletClient, ensureClients]
  );

  const withdraw = useCallback(
    async (vault: Address, shares: string) => {
      ensureClients();
      const owner = walletAddress as Address;

      const wc = getWalletClient();
      const tx = await wc.writeContract({
        address: vault,
        abi: iporVaultAbi,
        functionName: 'redeem',
        args: [BigInt(shares), owner, owner],
        account: owner,
        chain: null,
      });
      const receipt = await publicClient!.waitForTransactionReceipt({ hash: tx });
      return { hash: tx as Hash, receipt };
    },
    [publicClient, getWalletClient, ensureClients]
  );

  return { deposit, withdraw };
}
