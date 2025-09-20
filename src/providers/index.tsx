'use client';

import type React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import VaultProvider from './VaultProvider';
import GlobalDataProvider from './GlobalDataProvider';
import { VaultMetricsProvider } from './VaultMetricsProvider';
import { config } from './wagmi';
import { WalletProvider } from './WalletProvider';
import { ToastProvider } from './ToastProvider';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <WalletProvider>
        <VaultProvider>
          <GlobalDataProvider>
            <VaultMetricsProvider>
              <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                  <RainbowKitProvider
                    theme={lightTheme({
                      ...lightTheme.accentColors.purple,
                      accentColorForeground: 'white',
                      borderRadius: 'medium',
                      accentColor: '#7b3fe4',
                    })}
                  >
                    {children}
                  </RainbowKitProvider>
                </QueryClientProvider>
              </WagmiProvider>
            </VaultMetricsProvider>
          </GlobalDataProvider>
        </VaultProvider>
      </WalletProvider>
    </ToastProvider>
  );
}
