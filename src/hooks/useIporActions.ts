"use client";

import { useCallback } from "react";
import { Address, parseUnits } from "viem";
import { useWallet } from "@/providers/WalletProvider";
import { iporVaultAbi } from "@/lib/contracts/iporVault";
import { erc20Abi } from "@/lib/contracts/erc20";

type Hash = `0x${string}`;

export function useIporActions() {
  const { walletClient, publicClient, account } = useWallet();

  const ensureClients = useCallback(() => {
    if (!walletClient || !publicClient || !account?.address) {
      throw new Error("Connect your wallet first.");
    }
  }, [walletClient, publicClient, account?.address]);

  const approveIfNeeded = useCallback(async (token: Address, owner: Address, spender: Address, amount: bigint) => {
    if (!publicClient || !walletClient) throw new Error("Wallet not ready");
    const allowance = await publicClient.readContract({
      address: token,
      abi: erc20Abi,
      functionName: "allowance",
      args: [owner, spender],
    }) as bigint;
    if (allowance >= amount) return null;

    const hash = await walletClient.writeContract({
      address: token,
      abi: erc20Abi,
      functionName: "approve",
      args: [spender, amount],
      account: owner,
      chain: null,
    });
    // wait for confirmation
    await publicClient.waitForTransactionReceipt({ hash });
    return hash as Hash;
  }, [publicClient, walletClient]);

  const deposit = useCallback(async (vault: Address, underlying: Address, amount: string, decimals: number) => {
    ensureClients();
    const owner = account!.address as Address;
    const assets = parseUnits(amount, decimals);

    // 1) approve underlying to vault
    await approveIfNeeded(underlying, owner, vault, assets);

    // 2) deposit
    const tx = await walletClient!.writeContract({
      address: vault,
      abi: iporVaultAbi,
      functionName: "deposit",
      args: [assets, owner],
      account: owner,
      chain: null,
    });
    const receipt = await publicClient!.waitForTransactionReceipt({ hash: tx });
    return { hash: tx as Hash, receipt };
  }, [account, approveIfNeeded, publicClient, walletClient, ensureClients]);

  const withdraw = useCallback(async (vault: Address, shares: string, vaultDecimals: number) => {
    ensureClients();
    const owner = account!.address as Address;
    const _shares = parseUnits(shares, vaultDecimals);

    const tx = await walletClient!.writeContract({
      address: vault,
      abi: iporVaultAbi,
      functionName: "redeem",
      args: [_shares, owner, owner],
      account: owner,
      chain: null,
    });
    const receipt = await publicClient!.waitForTransactionReceipt({ hash: tx });
    return { hash: tx as Hash, receipt };
  }, [account, publicClient, walletClient, ensureClients]);

  return { deposit, withdraw };
}
