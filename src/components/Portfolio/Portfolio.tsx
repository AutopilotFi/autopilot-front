"use client"
import { useState, useEffect, useContext } from 'react';
import { ChevronLeft, TrendingUp, Wallet, BarChart3, ArrowUpRight, Shield, ChevronDown, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LatestEarningData, PortfolioData } from '@/types/globalAppTypes';
import { GlobalContext } from '../../providers/GlobalDataProvider';
import { useWallet } from '@/providers/WalletProvider';
import { useVaultMetrics } from '@/providers/VaultMetricsProvider';
import { formatBalance } from "@/helpers/utils";



export default function Portfolio() {
    const [selectedPosition, setSelectedPosition] = useState('');
    const [coverageDuration, setCoverageDuration] = useState('60 days');
    const [coverageAmount, setCoverageAmount] = useState(50);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [realPortfolioData, setRealPortfolioData] = useState<PortfolioData>([]);
    const [realLatestEarningsData, setRealLatestEarningsData] = useState<LatestEarningData>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const router = useRouter()
    const globalData = useContext(GlobalContext);
    const user = globalData?.user;
    const availableAutopilots = globalData?.availableAutopilots;
    const { account } = useWallet();
    const { vaultMetrics, isLoading: metricsLoading, error: metricsError } = useVaultMetrics();
 
    const isNewUser = user.status === 'new';

  // Process portfolio data from VaultMetricsProvider
  useEffect(() => {
    if (!availableAutopilots || availableAutopilots.length === 0 || Object.keys(vaultMetrics).length === 0 || metricsLoading) {
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
          const secondBestAPY = autopilot.vault.allocPointData && autopilot.vault.allocPointData.length > 0
            ? Math.max(...autopilot.vault.allocPointData.map(item => Number(item.apy || 0)))
            : 0;

          const usdValue = result.metrics.totalBalance * result.metrics.latestUnderlyingPrice;
          
          portfolioData.push({
            protocol: autopilot.protocol,
            asset: autopilot.asset,
            balance: result.metrics.totalBalance,
            usdValue: usdValue,
            earnings: result.metrics.totalEarnings,
            earningsUsd: result.metrics.totalEarnings * result.metrics.latestUnderlyingPrice,
            apy: autopilot.apy,
            secondBestAPY: secondBestAPY,
            status: 'active'
          });

          const latestEarnings = result.metrics.earningsSeries
            .map((earning: { amount: number; amountUsd?: number; timestamp: number }) => ({
              asset: autopilot.asset,
              protocol: autopilot.protocol,
              amount: earning.amount,
              value: earning.amountUsd || (earning.amount * result.metrics.latestUnderlyingPrice),
              time: earning.timestamp,
              icon: autopilot.icon
            }));

          earningsData.push(...latestEarnings);
        } catch (vaultError) {
          console.error(`Error processing data for ${autopilot.protocol}-${autopilot.asset}:`, vaultError);
        }
      }

      const sortedPortfolio = portfolioData.sort((a, b) => b.usdValue - a.usdValue);
      const sortedEarnings = earningsData
        .sort((a, b) => b.time - a.time)
        .slice(0, 4);

      setRealPortfolioData(sortedPortfolio);
      setRealLatestEarningsData(sortedEarnings);
    } catch (err) {
      console.error('Error processing portfolio data:', err);
      setError('Failed to process portfolio data');
    }
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

  const portfolio = isNewUser ? [] : (realPortfolioData.length > 0 ? realPortfolioData : []);

  const latestEarnings = isNewUser ? [] : (realLatestEarningsData.length > 0 ? realLatestEarningsData : []);

  const formatTimeAgo = (timestamp: number): string => {
    const now = Math.floor(Date.now() / 1000);
    const diffSeconds = now - timestamp;
    
    if (diffSeconds < 60) return `${diffSeconds}s`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h`;
    if (diffSeconds < 2592000) return `${Math.floor(diffSeconds / 86400)}d`;
    return `${Math.floor(diffSeconds / 2592000)}mo`;
  };

  const getAssetIcon = (asset: string) => {
    switch (asset) {
      case 'USDC': return "/icons/usdc.svg";
      case 'WETH': return "/icons/eth.svg";
      case 'cbBTC': return "/icons/cbbtc.svg";
      default: return "/icons/usdc.svg";
    }
  };

  const getProtocolIcon = (protocol: string) => {
    return protocol === 'morpho' ? "/projects/morpho.png" : "/projects/euler.png";
  };

  const totalValue = portfolio.reduce((sum, item) => sum + item.usdValue, 0);
  const totalEarnings = portfolio.reduce((sum, item) => sum + item.earningsUsd, 0);

  // Calculate annual earnings based on actual Live APYs
  const morphoPositions = portfolio.filter(position => position.protocol === 'morpho');
  const annualEarningsFromAPY = morphoPositions.reduce((sum, position) => {
    return sum + (position.usdValue * (position.apy / 100));
  }, 0);

     // Show loading state for portfolio stats if still loading
   const showPortfolioStats = !loading && !metricsLoading && !error && !metricsError && realPortfolioData.length > 0;

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

  // Calculate coverage details
  const getSelectedPositionData = () => {
    if (!selectedPosition) return null;
    return portfolio.find(p => `${p.protocol}-${p.asset}` === selectedPosition);
  };

  const calculateCoverageDetails = () => {
    const position = getSelectedPositionData();
    if (!position) return null;

    const positionValue = position.usdValue;
    const coverageAmountValue = (positionValue * coverageAmount) / 100;
    const durationDays = parseInt(coverageDuration.split(' ')[0]);

    // Estimate APY based on asset type (simplified calculation)
    const estimatedAPY = position.asset === 'USDC' ? 0.05 :
                        position.asset === 'ETH' ? 0.04 : 0.045;

    const estimatedYield = (positionValue * estimatedAPY * durationDays) / 365;

    // Insurance cost calculation - 0.20% per month as requested
    const monthlyRate = 0.002; // 0.20% per month
    const durationMonths = durationDays / 30;
    const totalCost = coverageAmountValue * monthlyRate * durationMonths;

    const estimatedYieldWithCoverage = estimatedYield - totalCost;
    const costPercentage = (totalCost / coverageAmountValue) * 100;

    return {
      positionValue,
      coverageAmountValue,
      durationDays,
      estimatedYield,
      estimatedYieldWithCoverage,
      totalCost,
      costPercentage
    };
  };

  const coverageDetails = calculateCoverageDetails();

  return (
    <div className="flex-1 flex flex-col min-w-0">
    {/* Header */}
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href='/'
                className="text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>

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
        {!account?.address ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <div className="text-gray-500 text-lg mb-2">Wallet Not Connected</div>
            <p className="text-gray-600">Please connect your wallet to view your portfolio.</p>
          </div>
        ) : loading ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9159FF] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading portfolio data...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <div className="text-red-500 text-lg mb-2">Error</div>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : !availableAutopilots || availableAutopilots.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <div className="text-gray-500 text-lg mb-2">No Autopilots Available</div>
            <p className="text-gray-600">No autopilots are currently available on this network.</p>
          </div>
        ) : isNewUser ? (
            <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border border-blue-200 p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Autopilot</h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Start building your DeFi portfolio with automated yield optimization. Choose an Autopilot strategy and begin earning optimized returns across multiple protocols.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/80 rounded-lg p-6 border">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Auto-Optimization</h3>
                    <p className="text-sm text-gray-600">Automatically rebalance across top-yielding vaults</p>
                </div>

                <div className="bg-white/80 rounded-lg p-6 border">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Real-time Analytics</h3>
                    <p className="text-sm text-gray-600">Track performance and earnings in real-time</p>
                </div>

                <div className="bg-white/80 rounded-lg p-6 border">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Secure Platform</h3>
                    <p className="text-sm text-gray-600">Audited smart contracts and insurance options</p>
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
                    onClick={() => router.push(`/base/${autopilot.protocol}/${autopilot.asset}#deposit`)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left group"
                    >
                    <div className="flex items-center space-x-3 mb-3">
                        <img src={getAssetIcon(autopilot.asset)} alt={autopilot.asset} className="w-8 h-8" />
                        <img src={getProtocolIcon(autopilot.protocol)} alt={autopilot.protocol} className="w-6 h-6" />
                        <div className="flex-1">
                        <div className="font-medium text-gray-900">{autopilot.asset} Autopilot</div>
                        <div className="text-sm text-gray-500 capitalize">{autopilot.protocol}</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-green-600">{autopilot.apy.toFixed(2)}% APY</span>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Portfolio Value */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Total Portfolio Value</h3>
                <p className="text-xl font-bold text-gray-900">
                  {showPortfolioStats ? `${totalValue.toLocaleString('en-US', { useGrouping: true })}` : '—'}
                  <span className="text-xs font-normal text-gray-500 ml-1">USD</span>
                </p>
                </div>

                {/* All-Time Earnings */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">All-Time Earnings</h3>
                <p className="text-xl font-bold text-gray-900">
                  {showPortfolioStats ? `$${formatBalance(totalEarnings, 'USD', 2)}` : '—'}
                </p>
                </div>

                {/* Est. Annual Earnings */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Est. Annual Earnings</h3>
                <p className="text-xl font-bold text-gray-900">
                  {showPortfolioStats ? `$${formatBalance(Math.round(annualEarningsFromAPY), 'USD', 2)}` : '—'}
                </p>
                </div>
            </div>

            {/* Positions */}
            <div className="space-y-4">
                {!showPortfolioStats ? (
                  <div className="bg-white rounded-xl border border-gray-100 p-6 text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9159FF] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading portfolio positions...</p>
                  </div>
                ) : (
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Autopilot</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Protocol</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Balance</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">USD Value</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">All-Time Earnings</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Autopilot 7d APY</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Best Morpho 7d APY</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPortfolioData.map((position, index) => {

                        return (
                            <tr key={index} className="border-b border-gray-50 hover:bg-purple-50 transition-colors cursor-pointer"
                                onClick={() => router.push(`/base/${position.protocol}/${position.asset}#overview`)}
                            >
                                <td className="py-4 px-4">
                                    <div className="flex items-center space-x-3">
                                    <img src={getAssetIcon(position.asset)} alt={position.asset} className="w-6 h-6 rounded-full" />
                                    <span className="text-sm font-medium text-gray-900">{position.asset}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center space-x-2">
                                    <img src={getProtocolIcon(position.protocol)} alt={position.protocol} className="w-4 h-4" />
                                    <span className="text-sm text-gray-600 capitalize">{position.protocol}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <div className="text-sm font-medium text-gray-900">
                                    {position.asset === 'USDC'
                                        ? position.balance.toLocaleString('en-US', { maximumFractionDigits: 2 })
                                        : position.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })
                                    } {position.asset}
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <div className="text-sm font-medium text-gray-900">
                                    ${position.usdValue.toLocaleString()}
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <div className="text-sm font-medium text-green-600">
                                    {position.asset === 'USDC'
                                        ? position.earnings.toLocaleString('en-US', { maximumFractionDigits: 2 })
                                        : position.earnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })
                                    } {position.asset}
                                    </div>
                                    <div className="text-xs text-gray-500">${formatBalance(position.earningsUsd, 'USD', 2)}</div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <div className="text-sm font-medium text-[#9159FF]">{position.apy.toFixed(2)}%</div>
                                </td>
                                                                 <td className="py-4 px-4 text-right">
                                     <div className="text-sm font-medium text-gray-500">{position.secondBestAPY.toFixed(2)}%</div>
                                 </td>
                            </tr>
                        );
                        })}
                    </tbody>
                    </table>
                </div>
                </div>
                )}
            </div>

            {/* Latest Earnings Section */}
            {!showPortfolioStats ? (
              <div className="bg-white rounded-xl border border-gray-100 p-6 text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9159FF] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading earnings data...</p>
              </div>
            ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-gray-900">Latest Earnings</h3>
                <Link
                    href="/earnings"
                    className="text-xs bg-[#9159FF] text-white px-3 py-1.5 rounded-md hover:bg-[#7c3aed] transition-colors"
                >
                    View All
                </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {latestEarnings.filter(earning => earning.protocol !== 'euler').map((earning, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-purple-50 hover:border-purple-200 border border-transparent transition-all">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                        <img src={earning.icon} alt={earning.asset} className="w-6 h-6 rounded-full" />
                        <img src={getProtocolIcon(earning.protocol)} alt={earning.protocol} className="w-3 h-3 absolute -bottom-0.5 -right-0.5 bg-white rounded-full border border-gray-200" />
                        </div>
                        <div>
                        <div className="text-sm font-medium text-green-600">
                            {formatBalance(earning.amount, earning.asset)}  
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">${formatBalance(earning.value, '', 2)}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{formatTimeAgo(earning.time)}</div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            )}

            {/* Purchase Insurance Coverage - Full Width */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-start space-x-3 mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Purchase Insurance Coverage</h3>
                    <p className="text-sm text-gray-600">Add extra insurance layer that protects you from any bugs, issues or exploits at the Morpho and Euler protocol level.</p>
                </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Side - Controls */}
                <div className="space-y-6">
                    {/* Select Position */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Position</label>
                    <div className="relative">
                        <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full p-3 border border-gray-200 rounded-lg text-left bg-white hover:border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        >
                        {selectedPosition ? (
                            <div className="flex items-center space-x-3 pr-8">
                            {(() => {
                                const position = portfolio.find(p => `${p.protocol}-${p.asset}` === selectedPosition);
                                return position ? (
                                <>
                                    <img src={getAssetIcon(position.asset)} alt={position.asset} className="w-8 h-8 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900">
                                        {position.asset} Autopilot
                                    </div>
                                    <div className="text-sm text-gray-500 capitalize">
                                        {position.protocol} • ${position.usdValue.toLocaleString()}
                                    </div>
                                    </div>
                                </>
                                ) : null;
                            })()}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <Shield className="w-4 h-4 text-gray-400" />
                            </div>
                            <span className="text-gray-500">Choose a position to insure</span>
                            </div>
                        )}
                        <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto">
                            {portfolio.map((position, index) => {
                            const positionKey = `${position.protocol}-${position.asset}`;
                            const isSelected = selectedPosition === positionKey;

                            return (
                                <button
                                key={index}
                                onClick={() => {
                                    setSelectedPosition(positionKey);
                                    setIsDropdownOpen(false);
                                }}
                                className={`w-full p-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                                    isSelected ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                                }`}
                                >
                                <img src={getAssetIcon(position.asset)} alt={position.asset} className="w-8 h-8 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900">
                                    {position.asset} Autopilot
                                    </div>
                                    <div className="text-sm text-gray-500 capitalize">
                                    {position.protocol} • ${position.usdValue.toLocaleString()}
                                    </div>
                                </div>
                                {isSelected && (
                                    <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                )}
                                </button>
                            );
                            })}
                        </div>
                        )}
                    </div>
                    </div>

                    {/* Coverage Duration */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Coverage Duration</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['30 days', '60 days', '90 days'].map((duration) => (
                        <button
                            key={duration}
                            onClick={() => setCoverageDuration(duration)}
                            className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                            coverageDuration === duration
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {duration}
                        </button>
                        ))}
                    </div>
                    </div>

                    {/* Coverage Amount Slider */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Coverage Amount ({coverageAmount}% of position)
                    </label>
                    <div className="px-3">
                        <input
                        type="range"
                        min="10"
                        max="100"
                        step="10"
                        value={coverageAmount}
                        onChange={(e) => setCoverageAmount(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                            background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${((coverageAmount - 10) / (100 - 10)) * 100}%, #E5E7EB ${((coverageAmount - 10) / (100 - 10)) * 100}%, #E5E7EB 100%)`
                        }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>10%</span>
                        <span>50%</span>
                        <span>100%</span>
                        </div>
                        <style jsx>{`
                        .slider::-webkit-slider-thumb {
                            appearance: none;
                            width: 20px;
                            height: 20px;
                            border-radius: 50%;
                            background: #8B5CF6;
                            cursor: pointer;
                            border: 2px solid white;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        }
                        .slider::-moz-range-thumb {
                            width: 20px;
                            height: 20px;
                            border-radius: 50%;
                            background: #8B5CF6;
                            cursor: pointer;
                            border: 2px solid white;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        }
                        `}</style>
                    </div>
                    </div>

                    {/* Purchase Button - Full Width Under Slider */}
                    <div className="pt-2">
                    <button
                        disabled={!selectedPosition}
                        className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                        selectedPosition
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <Shield className="w-4 h-4" />
                        <span>
                        {selectedPosition ? (
                            <>
                            Purchase Coverage
                            {coverageDetails && (
                                <span className="ml-1">
                                (${coverageDetails.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                                </span>
                            )}
                            </>
                        ) : (
                            'Select Position to Purchase Coverage'
                        )}
                        </span>
                    </button>
                    </div>
                </div>

                {/* Right Side - Coverage Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-4">Coverage Summary</h4>

                    {coverageDetails ? (
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Position Value</span>
                        <span className="text-sm font-semibold text-purple-900">${coverageDetails.positionValue.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Coverage Amount</span>
                        <span className="text-sm font-semibold text-purple-900">${coverageDetails.coverageAmountValue.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Coverage Duration</span>
                        <span className="text-sm font-semibold text-purple-900">{coverageDuration}</span>
                        </div>

                        <div className="border-t border-gray-200 pt-3 mt-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-700">Est. Yield (No Coverage)</span>
                            <span className="text-sm font-semibold text-green-600">${coverageDetails.estimatedYield.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Est. Yield (With Coverage)</span>
                            <span className="text-sm font-semibold text-green-600">${coverageDetails.estimatedYieldWithCoverage.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">Total Cost</span>
                            <span className="font-bold text-purple-900">${coverageDetails.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {coverageDetails.costPercentage.toFixed(2)}% of coverage amount
                        </p>
                        </div>
                    </div>
                    ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Shield className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-sm text-gray-500">
                        Select a position to see cost calculation
                        </p>
                    </div>
                    )}

                    {/* Disclaimer moved here */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Insurance coverage is provided independently of Autopilot services and operates under separate terms and conditions. Smart contract insurance services are underwritten by licensed insurance partners.
                    </p>
                    </div>
                </div>
                </div>

                {/* Legal Information */}
                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-xs text-gray-500">Powered by</span>
                    <img src="/projects/openCover.png" alt="OpenCover" className="h-4" />
                    <span className="text-xs text-gray-500">Third-Party Insurance Service</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                    © 2021-2024 OpenCover Protocol Ltd. • US Entity: 2251 Market St, San Francisco, CA 94114, USA • UK Entity: 71-75 Shelton Street, London, WC2H 9JQ, UK
                </p>
                </div>
            </div>
            </div>
        )}
        </div>
    </main>
    </div>
  );
}