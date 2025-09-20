'use client';
import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { Allocations, LatestEarningData, PortfolioData } from '@/types/globalAppTypes';
import { GlobalContext } from '@/providers/GlobalDataProvider';
import DesktopPositions from './Positions/DesktopPostions';
import MobilePositions from './Positions/MobilePositions';
import DesktopLatestEarnings from './LatestEarnings/DesktopLatestEarnings';
import MobileLatestEarnings from './LatestEarnings/MobileLatestEarnings';
// import { useWallet } from '@/providers/WalletProvider';
import { useVaultMetrics } from '@/providers/VaultMetricsProvider';
import { getVaultDataFromAutopilots } from '@/consts/vaultData';
import StatsGrid from '../StatsGrid';
import { generatePortfolioGridStructure } from '../StatsGrid/gridStructure';
import EmptyEarnings from '../Dashboard/Earnings/EmptyEarnings';

export default function Portfolio() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortColumn] = useState<string | null>(null);
  const [sortDirection] = useState<'asc' | 'desc'>('asc');
  const [realPortfolioData, setRealPortfolioData] = useState<PortfolioData>([]);
  const [realLatestEarningsData, setRealLatestEarningsData] = useState<LatestEarningData>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const globalData = useContext(GlobalContext);
  const user = globalData?.user;
  const isMobile = globalData?.isMobile;
  const availableAutopilots = globalData?.availableAutopilots;
  // const { account } = useWallet();
  const { vaultMetrics, isLoading: metricsLoading, error: metricsError } = useVaultMetrics();

  const isNewUser = user.status === 'new';

  const allocations: Allocations = availableAutopilots.reduce(
    (acc, autopilot) => ({
      ...acc,
      [`${autopilot.protocol}-${autopilot.asset}`]: getVaultDataFromAutopilots(
        availableAutopilots,
        autopilot.protocol,
        autopilot.asset
      )?.benchmarkData?.filter(
        allocation =>
          !allocation.isAutopilot &&
          Number(allocation.allocation) > 1e-8 &&
          allocation.name !== 'Not invested'
      ),
    }),
    {}
  );

  // Process portfolio data from VaultMetricsProvider
  useEffect(() => {
    if (
      !availableAutopilots ||
      availableAutopilots.length === 0 ||
      Object.keys(vaultMetrics).length === 0 ||
      metricsLoading
    ) {
      setLoading(true);
      return;
    }

    try {
      setLoading(false);
      setError(null);

      const portfolioData: PortfolioData = [];
      const earningsData: LatestEarningData = [];

      // Process data for each available autopilot using cached metrics
      for (const autopilot of availableAutopilots) {
        try {
          const vaultData = autopilot.vault;

          if (!vaultData?.vaultAddress) {
            continue;
          }

          // Get metrics from VaultMetricsProvider
          const result = vaultMetrics[vaultData.vaultAddress];
          if (!result || result.error) {
            console.warn(`No metrics available for vault: ${vaultData.vaultAddress}`);
            continue;
          }

          // Find the highest APY from allocPointData
          const secondBestAPY =
            autopilot.vault.allocPointData && autopilot.vault.allocPointData.length > 0
              ? Math.max(...autopilot.vault.allocPointData.map(item => Number(item.apy || 0)))
              : 0;

          const usdValue = result.metrics.totalBalance * result.metrics.latestUnderlyingPrice;

          portfolioData.push({
            protocol: autopilot.protocol,
            asset: autopilot.asset,
            showDecimals: autopilot.showDecimals,
            balance: result.metrics.totalBalance,
            usdValue: usdValue,
            earnings: result.metrics.totalEarnings,
            earningsUsd: result.metrics.totalEarnings * result.metrics.latestUnderlyingPrice,
            apy: autopilot.apy,
            secondBestAPY: secondBestAPY,
            status: 'active',
          });

          const latestEarnings = result.metrics.earningsSeries.map(
            (earning: { amount: number; amountUsd?: number; timestamp: number }) => ({
              asset: autopilot.asset,
              protocol: autopilot.protocol,
              amount: earning.amount,
              value: earning.amountUsd || earning.amount * result.metrics.latestUnderlyingPrice,
              time: earning.timestamp,
              icon: autopilot.icon,
            })
          );

          earningsData.push(...latestEarnings);
        } catch (vaultError) {
          console.error(
            `Error processing data for ${autopilot.protocol}-${autopilot.asset}:`,
            vaultError
          );
        }
      }

      const sortedPortfolio = portfolioData.sort((a, b) => b.usdValue - a.usdValue);
      const sortedEarnings = earningsData.sort((a, b) => b.time - a.time).slice(0, 4);

      setRealPortfolioData(sortedPortfolio);
      setRealLatestEarningsData(sortedEarnings);
    } catch (err) {
      console.error('Error processing portfolio data:', err);
      setError('Failed to process portfolio data');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableAutopilots, vaultMetrics]);

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

  const portfolio = isNewUser ? [] : realPortfolioData.length > 0 ? realPortfolioData : [];

  const latestEarnings = isNewUser
    ? []
    : realLatestEarningsData.length > 0
      ? realLatestEarningsData
      : [];

  const getAssetIcon = (asset: string) => {
    switch (asset) {
      case 'USDC':
        return '/coins/usdc.svg';
      case 'WETH':
        return '/coins/eth.svg';
      case 'cbBTC':
        return '/coins/cbBTC.svg';
      default:
        return '/coins/usdc.svg';
    }
  };

  const getProtocolIcon = (protocol: string) => {
    return protocol === 'morpho' ? '/projects/morpho.png' : '/projects/euler.png';
  };

  const totalValue = loading ? 0 : portfolio.reduce((sum, item) => sum + item.usdValue, 0);
  const totalEarnings = loading ? 0 : portfolio.reduce((sum, item) => sum + item.earningsUsd, 0);

  // Calculate annual earnings based on actual Live APYs
  const morphoPositions = portfolio.filter(position => position.protocol === 'morpho');
  const annualEarningsFromAPY = loading
    ? 0
    : morphoPositions.reduce((sum, position) => {
        return sum + position.usdValue * (position.apy / 100);
      }, 0);

  // Show loading state for portfolio stats if still loading
  const showPortfolioStats =
    !loading && !metricsLoading && !error && !metricsError && realPortfolioData.length > 0;

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
                <h1 className="font-semibold text-gray-900">Portfolio</h1>
                <p className="text-sm text-gray-500">View all positions</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <div className="text-red-500 text-lg mb-2">Error</div>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : !loading && (!availableAutopilots || availableAutopilots.length === 0) ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <div className="text-gray-500 text-lg mb-2">No Autopilots Available</div>
              <p className="text-gray-600">
                No autopilots are currently available on this network.
              </p>
            </div>
          ) : (
            // Portfolio view for active users
            <div className="space-y-6">
              {/* Top Stats Row */}

              <StatsGrid
                gridStructure={generatePortfolioGridStructure(
                  totalValue,
                  totalEarnings,
                  annualEarningsFromAPY
                )}
                desktopColumns={3}
              />

              {/* Positions */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">My Positions</h3>
                  {!showPortfolioStats ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-6 text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9159FF] mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading portfolio positions...</p>
                    </div>
                  ) : (
                    <>
                      {/* Desktop Table */}
                      {isMobile === false && (
                        <DesktopPositions
                          allocations={allocations}
                          getAssetIcon={getAssetIcon}
                          getProtocolIcon={getProtocolIcon}
                          sortedPortfolioData={sortedPortfolioData}
                        />
                      )}
                      {/* Mobile Cards */}
                      {isMobile === true && (
                        <MobilePositions
                          allocations={allocations}
                          getAssetIcon={getAssetIcon}
                          getProtocolIcon={getProtocolIcon}
                          sortedPortfolioData={sortedPortfolioData}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Latest Earnings Section */}
              {!showPortfolioStats ? (
                <div className="bg-white rounded-xl border border-gray-100 p-6 text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9159FF] mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading earnings data...</p>
                </div>
              ) : latestEarnings.length > 0 ? (
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
              ) : (
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <EmptyEarnings />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
