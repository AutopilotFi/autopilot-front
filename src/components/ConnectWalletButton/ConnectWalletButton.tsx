'use client';

import * as React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useDisconnect } from 'wagmi';
import { useWallet } from '@/providers/WalletProvider';
import { useWalletSync } from '@/hooks/useWalletSync';
import { Wallet, AlertTriangle, ChevronDown, LogOut } from 'lucide-react';
import Image from 'next/image';

const NETWORK_LABELS: Record<number, string> = {
  1: 'Ethereum',
  42161: 'Arbitrum',
  8453: 'Base Network',
  137: 'Polygon',
  324: 'zkSync',
};

function shortenAddress(addr?: string, chars = 4) {
  if (!addr) return '';
  return `${addr.slice(0, 2 + chars)}…${addr.slice(-chars)}`;
}

export function ConnectWalletButton() {
  const { disconnectAsync } = useDisconnect();
  const { disconnect: walletProviderDisconnect } = useWallet();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  useWalletSync();

  React.useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <ConnectButton.Custom>
      {({ account, chain, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const authenticated = !authenticationStatus || authenticationStatus === 'authenticated';
        const connected = ready && account && chain && authenticated;

        const addr = account?.address;
        const networkLabel = (chain?.id && NETWORK_LABELS[chain.id]) || chain?.name || 'Connected';

        return (
          <div
            ref={rootRef}
            className="relative"
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              } as React.CSSProperties,
            })}
          >
            {/* Not connected */}
            {!connected && (
              <button
                type="button"
                onClick={openConnectModal}
                className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-[#9159FF] to-[#8b5cf6] hover:from-[#8b5cf6] hover:to-[#a78bfa] text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-300 cursor-pointer"
                aria-label="Connect wallet"
              >
                <Wallet className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-sm font-semibold">Connect</div>
                  <div className="text-xs opacity-80">Start optimizing yield</div>
                </div>
              </button>
            )}

            {/* Wrong network */}
            {connected && chain?.unsupported && (
              <button
                type="button"
                onClick={openChainModal}
                className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-500/90 hover:to-orange-500/90 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-rose-300 cursor-pointer"
                aria-label="Switch network"
                title="Wrong network — click to switch"
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-sm font-semibold">Wrong network</div>
                  <div className="text-xs opacity-80">Click to switch</div>
                </div>
              </button>
            )}

            {/* Connected — YOUR requested design */}
            {connected && !chain?.unsupported && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen(v => !v)}
                  className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 border border-[#9159FF] rounded-lg transition-all duration-200 group cursor-pointer"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <Image src="/walletIcon.svg" width={28} height={28} alt="wallet image" />

                  {/* Wallet Info */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {shortenAddress(addr)}
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Green status dot (use <Circle> or a div dot fallback) */}
                      <span className="w-2 h-2 rounded-full bg-green-600 inline-block" />
                      <span className="text-xs font-normal text-black">{networkLabel}</span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <ChevronDown
                    className={`w-4 h-4 text-[#9159FF] transition-transform ${
                      menuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown menu */}
                {menuOpen && (
                  <div
                    role="menu"
                    aria-label="Wallet actions"
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                  >
                    {/* Disconnect */}
                    <button
                      role="menuitem"
                      onClick={async () => {
                        try {
                          await disconnectAsync();
                          await walletProviderDisconnect();
                        } catch (error) {
                          console.error('Error disconnecting wallet:', error);
                        } finally {
                          setMenuOpen(false);
                        }
                      }}
                      className="w-full flex items-center space-x-3 p-3 text-left hover:bg-purple-50 transition-colors last:rounded-b-lg border-t border-gray-100 group focus:outline-none cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-gray-500" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">Disconnect</div>
                        <div className="text-xs text-gray-500">Sign out of wallet</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
