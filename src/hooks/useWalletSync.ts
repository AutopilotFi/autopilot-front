'use client';

import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWallet } from '@/providers/WalletProvider';

export function useWalletSync() {
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();
  const {
    connect: walletProviderConnect,
    disconnect: walletProviderDisconnect,
    isConnected: walletProviderConnected,
  } = useWallet();

  useEffect(() => {
    const syncWalletState = async () => {
      try {
        if (wagmiConnected && wagmiAddress && !walletProviderConnected) {
          await walletProviderConnect();
        } else if (!wagmiConnected && walletProviderConnected) {
          await walletProviderDisconnect();
        }
      } catch (error) {
        console.error('Error syncing wallet state:', error);
      }
    };

    if (wagmiConnected !== walletProviderConnected) {
      syncWalletState();
    }
  }, [
    wagmiConnected,
    wagmiAddress,
    walletProviderConnected,
    walletProviderConnect,
    walletProviderDisconnect,
  ]);

  return {
    wagmiConnected,
    walletProviderConnected,
    isSynced: wagmiConnected === walletProviderConnected,
  };
}
