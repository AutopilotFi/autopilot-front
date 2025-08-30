'use client';
import { useState, useEffect, useContext } from 'react';
import { TrendingUp, Wallet, BarChart3, ArrowUpRight, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LatestEarningData, PortfolioData } from '@/types/globalAppTypes';
import { GlobalContext } from '../GlobalDataProvider';
import Image from 'next/image';
import DesktopPositions from './Positions/DesktopPostions';
import MobilePositions from './Positions/MobilePositions';
import DesktopLatestEarnings from './LatestEarnings/DesktopLatestEarnings';
import MobileLatestEarnings from './LatestEarnings/MobileLatestEarnings';

export default function Portfolio({
  portfolioData,
  latestEarningsData,
}: {
  portfolioData: PortfolioData;
  latestEarningsData: LatestEarningData;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortColumn] = useState<string | null>(null);
  const [sortDirection] = useState<'asc' | 'desc'>('asc');
  const router = useRouter();
  const globalData = useContext(GlobalContext);
  const user = globalData?.user;
  const isMobile = globalData?.isMobile;
  const availableAutopilots = globalData?.availableAutopilots;

  const isNewUser = user.status === 'new';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as Element).closest('.relative')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const portfolio = isNewUser ? [] : portfolioData;

  const latestEarnings = isNewUser ? [] : latestEarningsData;

  const getAssetIcon = (asset: string) => {
    switch (asset) {
      case 'USDC':
        return '/coins/usdc.png';
      case 'ETH':
        return '/coins/eth.png';
      case 'cbBTC':
        return '/coins/cbBTC.png';
      default:
        return '/coins/usdc.png';
    }
  };

  const getProtocolIcon = (protocol: string) => {
    return protocol === 'morpho' ? '/projects/morpho.png' : '/projects/euler.png';
  };

  const totalValue = portfolio.reduce((sum, item) => sum + item.usdValue, 0);
  const totalEarnings = portfolio.reduce((sum, item) => sum + item.earningsUsd, 0);

  // Calculate annual earnings based on actual Live APYs
  const morphoPositions = portfolio.filter(position => position.protocol === 'morpho');
  const annualEarningsFromAPY = morphoPositions.reduce((sum, position) => {
    return sum + position.usdValue * (position.apy / 100);
  }, 0);

  // Sort portfolio data
  const sortedPortfolioData = portfolio.sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue: number;
    let bValue: number;

    switch (sortColumn) {
      case 'balance':
        aValue = a.usdValue;
        bValue = b.usdValue;
        break;
      case 'earnings':
        aValue = a.earningsUsd;
        bValue = b.earningsUsd;
        break;
      case 'apy':
        aValue = a.apy;
        bValue = b.apy;
        break;
      default:
        return 0;
    }

    if (sortDirection === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-10 sm:px-12 lg:px-14 py-4 ml-7 md:ml-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="font-semibold text-gray-900">Portfolio Overview</h1>
                <p className="text-sm text-gray-500">
                  {isNewUser ? 'Welcome to Autopilot' : 'Manage your positions'}
                  {isNewUser && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      New User View
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isNewUser ? (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border border-blue-200 p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Autopilot</h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Start building your DeFi portfolio with automated yield optimization. Choose an
                  Autopilot strategy and begin earning optimized returns across multiple protocols.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/80 rounded-lg p-6 border">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Auto-Optimization</h3>
                    <p className="text-sm text-gray-600">
                      Automatically rebalance across top-yielding vaults
                    </p>
                  </div>

                  <div className="bg-white/80 rounded-lg p-6 border">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Real-time Analytics</h3>
                    <p className="text-sm text-gray-600">
                      Track performance and earnings in real-time
                    </p>
                  </div>

                  <div className="bg-white/80 rounded-lg p-6 border">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Secure Platform</h3>
                    <p className="text-sm text-gray-600">
                      Audited smart contracts and insurance options
                    </p>
                  </div>
                </div>

                <Link
                  href="/base/morpho/USDC#deposit"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Get Started
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </Link>
              </div>

              {/* Available Autopilots */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Available Autopilots</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableAutopilots?.map((autopilot, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        router.push(`/base/${autopilot.protocol}/${autopilot.asset}#deposit`)
                      }
                      className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left group"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <Image
                          width={28}
                          height={28}
                          src={getAssetIcon(autopilot.asset)}
                          alt={autopilot.asset}
                          className="w-8 h-8"
                        />
                        <Image
                          width={21}
                          height={21}
                          src={getProtocolIcon(autopilot.protocol)}
                          alt={autopilot.protocol}
                          className="w-6 h-6"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {autopilot.asset} Autopilot
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {autopilot.protocol}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-green-600">
                          {autopilot.apy.toFixed(2)}% APY
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Portfolio view for active users
            <div className="space-y-6">
              {/* Top Stats Row */}
              {/* Desktop Layout - 3 columns */}
              <div className="hidden md:grid grid-cols-3 gap-6">
                {/* Total Portfolio Value */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Total Portfolio Value</h3>
                  <p className="text-xl font-bold text-gray-900">
                    ${totalValue.toLocaleString('en-US', { useGrouping: true })}
                    <span className="text-xs font-normal text-gray-500 ml-1">USD</span>
                  </p>
                </div>

                {/* All-Time Earnings */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">All-Time Earnings</h3>
                  <p className="text-xl font-bold text-gray-900">
                    ${totalEarnings.toLocaleString('en-US', { useGrouping: true })}
                    <span className="text-xs font-normal text-gray-900 ml-1">USD</span>
                  </p>
                </div>

                {/* Est. Annual Earnings */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Est. Annual Earnings</h3>
                  <p className="text-xl font-bold text-gray-900">
                    $
                    {Math.round(annualEarningsFromAPY).toLocaleString('en-US', {
                      useGrouping: true,
                    })}
                    <span className="text-xs font-normal text-gray-900 ml-1">USD</span>
                  </p>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden space-y-4">
                {/* Total Portfolio Value - Full Width */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Total Portfolio Value</h3>
                  <p className="text-xl font-bold text-gray-900">
                    ${totalValue.toLocaleString('en-US', { useGrouping: true })}
                    <span className="text-xs font-normal text-gray-500 ml-1">USD</span>
                  </p>
                </div>

                {/* Earnings Row - 2 columns */}
                <div className="grid grid-cols-2 gap-4">
                  {/* All-Time Earnings */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">All-Time Earnings</h3>
                    <p className="text-xl font-bold text-gray-900">
                      ${totalEarnings.toLocaleString('en-US', { useGrouping: true })}
                      <span className="text-xs font-normal text-gray-900 ml-1">USD</span>
                    </p>
                  </div>

                  {/* Est. Annual Earnings */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Est. Annual Earnings</h3>
                    <p className="text-xl font-bold text-gray-900">
                      $
                      {Math.round(annualEarningsFromAPY).toLocaleString('en-US', {
                        useGrouping: true,
                      })}
                      <span className="text-xs font-normal text-gray-900 ml-1">USD</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Positions */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">My Positions</h3>
                  {/* Desktop Table */}
                  {isMobile === false && (
                    <DesktopPositions
                      getAssetIcon={getAssetIcon}
                      getProtocolIcon={getProtocolIcon}
                      sortedPortfolioData={sortedPortfolioData}
                    />
                  )}
                  {/* Mobile Cards */}
                  {isMobile === true && (
                    <MobilePositions
                      getAssetIcon={getAssetIcon}
                      getProtocolIcon={getProtocolIcon}
                      sortedPortfolioData={sortedPortfolioData}
                    />
                  )}
                </div>
              </div>

              {/* Latest Earnings Section */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Latest Earnings</h3>
                  <Link
                    href="/earnings"
                    className="text-xs bg-[#9159FF] text-white px-3 py-1.5 rounded-md hover:bg-[#7c3aed] transition-colors"
                  >
                    View All
                  </Link>
                </div>

                {/* Desktop Table */}
                {isMobile === false && (
                  <DesktopLatestEarnings
                    getProtocolIcon={getProtocolIcon}
                    latestEarnings={latestEarnings}
                  />
                )}

                {/* Mobile Cards */}
                {isMobile === true && (
                  <MobileLatestEarnings
                    getProtocolIcon={getProtocolIcon}
                    latestEarnings={latestEarnings}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
