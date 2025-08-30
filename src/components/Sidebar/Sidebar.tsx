'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TrendingUp,
  ChevronDown,
  BarChart3,
  Circle,
  X,
  Menu,
  Wallet,
  RefreshCw,
  LogOut,
  LucideUserCircle2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { SideBarOption } from '@/types/globalAppTypes';
import Image from 'next/image';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
}

export default function Sidebar({ sideBarData }: { sideBarData: SideBarOption[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [morphoExpanded, setMorphoExpanded] = useState(true);
  // const [eulerExpanded, setEulerExpanded] = useState(true);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [url, setUrl] = useState<string>();
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const morphoOptions = sideBarData.filter(option => option.protocol === 'morpho');
  // const eulerOptions = sideBarData.filter(option => option.protocol === "euler");
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
  });

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const openSidebar = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    setUrl(pathname);
    closeSidebar();
  }, [pathname]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleWalletConnect = () => {
    // Simulate wallet connection
    const newAddress = '0xf4d2a7b8c3e1f9d6e8a2b4c7d1e9f3a8b2c5d8e1f991';
    setWalletState({
      isConnected: true,
      address: newAddress,
    });
  };

  const handleWalletChange = () => {
    // Simulate wallet change
    const newAddress = '0xa1b2c3d4e5f6789012345678901234567890abcd';
    setWalletState({
      isConnected: true,
      address: newAddress,
    });
  };

  const handleWalletDisconnect = () => {
    setWalletState({
      isConnected: false,
      address: null,
    });
  };

  // Wallet Connection Component
  const WalletConnection = () => {
    // Show Connect button when not connected
    if (!walletState?.isConnected) {
      return (
        <button
          onClick={handleWalletConnect}
          className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-[#9159FF] to-[#8b5cf6] hover:from-[#8b5cf6] hover:to-[#a78bfa] text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-[1.01]"
        >
          <Wallet className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1 min-w-0 text-left">
            <div className="text-sm font-semibold">Connect</div>
            <div className="text-xs opacity-80">Start optimizing yield</div>
          </div>
        </button>
      );
    }

    // Show connected wallet interface when connected
    if (!walletState.address) return null;

    return (
      <div className="relative">
        <button
          onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
          className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 border border-[#9159FF] rounded-lg transition-all duration-200 group"
        >
          {/* Avatar */}
          {/* <img
            src={''}
            alt="Wallet Avatar"
            className="w-8 h-8 rounded-full flex-shrink-0"
          /> */}
          <LucideUserCircle2 />

          {/* Wallet Info */}
          <div className="flex-1 min-w-0 text-left">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {shortenAddress(walletState.address)}
            </div>
            <div className="flex items-center space-x-2">
              <Circle className="w-2 h-2 fill-green-600 text-green-600" />
              <span className="text-xs font-normal text-black">Base Network</span>
            </div>
          </div>

          {/* Chevron */}
          <ChevronDown
            className={`w-4 h-4 text-[#9159FF] transition-transform ${walletDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown */}
        {walletDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <button
              onClick={() => {
                handleWalletChange?.();
                setWalletDropdownOpen(false);
              }}
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-purple-50 transition-colors first:rounded-t-lg group"
            >
              <RefreshCw className="w-4 h-4 text-gray-500" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">Change Wallet</div>
                <div className="text-xs text-gray-500">Connect a different wallet</div>
              </div>
            </button>

            <button
              onClick={() => {
                handleWalletDisconnect?.();
                setWalletDropdownOpen(false);
              }}
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-purple-50 transition-colors last:rounded-b-lg border-t border-gray-100 group"
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
    );
  };

  // Mobile sidebar
  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen ? (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
            onClick={closeSidebar}
          />
        ) : (
          <button
            onClick={openSidebar}
            className="fixed top-[24.5px] left-[21px] z-[10000] rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out md:hidden ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Header with Close Button */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <Image
                  width={136}
                  height={35}
                  src={'/logo.png'}
                  alt="Autopilot"
                  className="h-10 w-auto"
                />
              </Link>
              <button
                onClick={closeSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Navigation Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-6">
                {/* Wallet Connection */}
                <WalletConnection />

                {/* Portfolio Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Portfolio
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Link
                      href="/"
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors cursor-pointer ${
                        pathname === '/'
                          ? 'bg-gray-50 text-gray-800'
                          : 'bg-transparent text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          pathname === '/'
                            ? 'bg-white border border-gray-200'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <BarChart3
                          className={`w-4 h-4 ${
                            pathname === '/' ? 'text-gray-700' : 'text-gray-600'
                          }`}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">Positions</div>
                        <div
                          className={`text-xs ${
                            pathname === '/' ? 'text-gray-600' : 'text-gray-500'
                          }`}
                        >
                          View all holdings
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/earnings"
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors cursor-pointer ${
                        pathname === '/earnings'
                          ? 'bg-gray-50 text-gray-800'
                          : 'bg-transparent text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          pathname === '/earnings'
                            ? 'bg-white border border-gray-200'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <TrendingUp
                          className={`w-4 h-4 ${
                            pathname === '/earnings' ? 'text-gray-700' : 'text-gray-600'
                          }`}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">Earnings</div>
                        <div
                          className={`text-xs ${
                            pathname === '/earnings' ? 'text-gray-600' : 'text-gray-500'
                          }`}
                        >
                          Full History
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Morpho Autopilot Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Image
                        width={14}
                        height={14}
                        src={'/projects/morpho.png'}
                        alt="Morpho"
                        className="w-4 h-4"
                      />
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                        Morpho Autopilot
                      </h3>
                    </div>
                    <button
                      onClick={() => setMorphoExpanded(!morphoExpanded)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform ${morphoExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>

                  {morphoExpanded && (
                    <div className="space-y-2">
                      {morphoOptions.map(option => {
                        const route = `/base/morpho/${option.asset}`;
                        return (
                          <Link
                            href={route}
                            key={option.asset}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                              option.enabled
                                ? 'cursor-pointer'
                                : 'cursor-not-allowed pointer-events-none'
                            } ${
                              url === route
                                ? 'bg-gray-50'
                                : option.asset === 'USDC'
                                  ? 'hover:bg-purple-50/50'
                                  : 'hover:bg-gray-50/50'
                            }`}
                          >
                            <Image
                              width={16}
                              height={16}
                              src={option.icon}
                              alt={option.asset}
                              className={`w-6 h-6 ${!option.enabled ? 'opacity-60' : ''}`}
                            />
                            <div className="flex-1 text-left">
                              <div
                                className={`font-medium ${option.asset !== 'USDC' ? 'text-gray-500' : 'text-gray-900'}`}
                              >
                                {option.asset}
                              </div>
                              <div className="text-sm text-gray-500">Autopilot</div>
                            </div>
                            {!option.enabled ? (
                              <span className="text-xs text-[#9159FF] bg-[#9159FF]/10 px-2 py-1 rounded-full font-medium border border-[#9159FF]/20">
                                Coming Soon
                              </span>
                            ) : (
                              <div className="flex items-center space-x-1">
                                <Circle className="w-2 h-2 fill-green-600 text-green-600" />
                                <span className="text-xs text-green-600 font-medium">
                                  {option.apy}%
                                </span>
                              </div>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Euler Autopilot Section */}
                {/* <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <img src={"/projects/euler.png"} alt="Euler" className="w-4 h-4" />
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Euler Autopilot</h3>
                    </div>
                    <button
                      onClick={() => setEulerExpanded(!eulerExpanded)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform ${eulerExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>

                  {eulerExpanded && (
                    <div className="space-y-2">
                      {eulerOptions.map((option) => {
                        const route = `/base/euler/${option.asset}`;
                        return(
                          <Link
                            href={route}
                            key={option.asset}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                              url === route
                                ? 'bg-green-50 border border-green-200'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <img src={option.icon} alt={option.asset} className="w-6 h-6" />
                            <div className="flex-1 text-left">
                              <div className="font-medium text-gray-900">{option.asset}</div>
                              <div className="text-sm text-gray-500">Autopilot</div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Circle className="w-2 h-2 fill-green-600 text-green-600" />
                              <span className="text-xs text-green-600 font-medium">{option.apy}%</span>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className="hidden md:flex w-80 bg-white border-r border-gray-100 flex-col min-h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <Link href={'/'} className="flex items-center hover:opacity-80 transition-opacity">
          <Image
            width={136}
            height={35}
            src={'/logo.png'}
            alt="Autopilot"
            className="h-10 w-auto"
          />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Wallet Connection */}
          <WalletConnection />

          {/* Portfolio Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Portfolio
              </h3>
            </div>

            <div className="space-y-2">
              <Link
                href="/"
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 cursor-pointer transform hover:scale-[1.02] ${
                  pathname === '/' ? 'bg-gray-100 border border-gray-200' : 'hover:bg-gray-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    pathname === '/'
                      ? 'bg-white border border-gray-300'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <BarChart3
                    className={`w-4 h-4 ${pathname === '/' ? 'text-gray-700' : 'text-gray-600'}`}
                  />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">Positions</div>
                  <div className="text-xs text-gray-500">View all holdings</div>
                </div>
              </Link>

              <Link
                href="/earnings"
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 cursor-pointer transform hover:scale-[1.02] ${
                  pathname === '/earnings'
                    ? 'bg-gray-100 border border-gray-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    pathname === '/earnings'
                      ? 'bg-white border border-gray-300'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <TrendingUp
                    className={`w-4 h-4 ${
                      pathname === '/earnings' ? 'text-gray-700' : 'text-gray-600'
                    }`}
                  />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">Earnings</div>
                  <div className="text-xs text-gray-500">Full History</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Morpho Autopilot Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Image
                  width={14}
                  height={14}
                  src={'/projects/morpho.png'}
                  alt="Morpho"
                  className="w-4 h-4"
                />
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Morpho Autopilots
                </h3>
              </div>
              <button
                onClick={() => setMorphoExpanded(!morphoExpanded)}
                className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
              >
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${morphoExpanded ? 'rotate-180' : ''}`}
                />
              </button>
            </div>

            {morphoExpanded && (
              <div className="space-y-2">
                {morphoOptions.map(option => (
                  <Link
                    key={option.asset}
                    href={`/base/morpho/${option.asset}`}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      option.asset === 'USDC' ? 'cursor-pointer' : 'cursor-not-allowed'
                    } ${
                      pathname === `/base/morpho/${option.asset}`
                        ? 'bg-gray-100 border border-gray-200'
                        : option.asset === 'USDC'
                          ? 'hover:bg-purple-50/50'
                          : 'hover:bg-gray-50/50'
                    }`}
                  >
                    <Image
                      width={21}
                      height={21}
                      src={option.icon}
                      alt={option.asset}
                      className={`w-6 h-6 ${option.asset !== 'USDC' ? 'opacity-60' : ''}`}
                    />
                    <div className="flex-1 text-left">
                      <div
                        className={`font-medium ${option.asset !== 'USDC' ? 'text-gray-500' : 'text-gray-900'}`}
                      >
                        {option.asset}
                      </div>
                      <div className="text-sm text-gray-500">Autopilot</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {option.asset === 'USDC' ? (
                        <>
                          <Circle className="w-2 h-2 fill-green-600 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">{option.apy}%</span>
                        </>
                      ) : (
                        <span className="text-xs text-[#9159FF] bg-[#9159FF]/10 px-2 py-1 rounded-full font-medium border border-[#9159FF]/20">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Euler Autopilot Section */}
          {/* <div className="hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <img src={eulerIcon} alt="Euler" className="w-4 h-4" />
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Euler Autopilot</h3>
              </div>
              <button
                onClick={() => setEulerExpanded(!eulerExpanded)}
                className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
              >
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${eulerExpanded ? 'rotate-180' : ''}`}
                />
              </button>
            </div>

            {eulerExpanded && (
              <div className="space-y-2">
                {eulerOptions.map((option) => (
                  <button
                    key={option.asset}
                    onClick={() => onAutopilotChange({ protocol: 'euler', asset: option.asset })}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                      selectedAutopilot.protocol === 'euler' && selectedAutopilot.asset === option.asset
                        ? 'bg-green-50 border border-green-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <img src={option.icon} alt={option.asset} className="w-6 h-6" />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{option.asset}</div>
                      <div className="text-sm text-gray-500">Autopilot</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Circle className="w-2 h-2 fill-green-600 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">{option.apy}%</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}
