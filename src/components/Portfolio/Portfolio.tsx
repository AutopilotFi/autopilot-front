"use client"
import { useState, useEffect, useContext } from 'react';
import { ChevronLeft, TrendingUp, Wallet, BarChart3, ArrowUpRight, Shield, ChevronDown, Check, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LatestEarningData, PortfolioData } from '@/types/globalAppTypes';
import { GlobalContext } from '../GlobalDataProvider';
import Image from 'next/image';


export default function Portfolio({portfolioData, latestEarningsData}: {
    portfolioData: PortfolioData,
    latestEarningsData: LatestEarningData

}) {
    const [selectedPosition, setSelectedPosition] = useState('');
    const [coverageDuration, setCoverageDuration] = useState('60 days');
    const [coverageAmount, setCoverageAmount] = useState(50);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const router = useRouter()
    const globalData = useContext(GlobalContext);
    const user = globalData?.user;
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
      case 'USDC': return "/coins/usdc.png";
      case 'ETH': return "/coins/eth.png";
      case 'cbBTC': return "/coins/cbBTC.png";
      default: return "/coins/usdc.png";
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

  // Sorting function
  // const handleSort = (column: string) => {
  //   if (sortColumn === column) {
  //     setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  //   } else {
  //     setSortColumn(column);
  //     setSortDirection('asc');
  //   }
  // };

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

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

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
        <div className="max-w-7xl mx-auto px-10 sm:px-12 lg:px-14 py-4">
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
                <p className="text-xl font-bold text-gray-900">${totalValue.toLocaleString('en-US', { useGrouping: true })}<span className="text-xs font-normal text-gray-500 ml-1">USD</span></p>
                </div>

                {/* All-Time Earnings */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">All-Time Earnings</h3>
                <p className="text-xl font-bold text-gray-900">${totalEarnings.toLocaleString('en-US', { useGrouping: true })}<span className="text-xs font-normal text-gray-900 ml-1">USD</span></p>
                </div>

                {/* Est. Annual Earnings */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Est. Annual Earnings</h3>
                <p className="text-xl font-bold text-gray-900">${Math.round(annualEarningsFromAPY).toLocaleString('en-US', { useGrouping: true })}<span className="text-xs font-normal text-gray-900 ml-1">USD</span></p>
                </div>
            </div>

            {/* Positions */}
            <div className="space-y-4">
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
                        // Calculate single vault APY (reduced by ~8%)
                        const singleVaultAPY = position.apy * 0.92;

                        return (
                            <tr key={index} className="border-b border-gray-50 hover:bg-purple-50 transition-colors cursor-pointer"
                                onClick={() => router.push(`/base/${position.protocol}/${position.asset}#overview`)}
                            >
                                <td className="py-4 px-4">
                                    <div className="flex items-center space-x-3">
                                    <Image width={21} height={21} src={getAssetIcon(position.asset)} alt={position.asset} className="w-6 h-6 rounded-full" />
                                    <span className="text-sm font-medium text-gray-900">{position.asset}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center space-x-2">
                                    <Image width={14} height={14} src={getProtocolIcon(position.protocol)} alt={position.protocol} className="w-4 h-4" />
                                    <span className="text-sm text-gray-600 capitalize">{position.protocol}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <div className="text-sm font-medium text-gray-900">
                                    {position.asset === 'USDC'
                                        ? position.balance.toLocaleString('en-US', { maximumFractionDigits: 0 })
                                        : position.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
                                        ? position.earnings.toLocaleString('en-US', { maximumFractionDigits: 0 })
                                        : position.earnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })
                                    } {position.asset}
                                    </div>
                                    <div className="text-xs text-gray-500">${position.earningsUsd.toLocaleString()}</div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <div className="text-sm font-medium text-[#9159FF]">{position.apy.toFixed(2)}%</div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <div className="text-sm font-medium text-gray-500">{singleVaultAPY.toFixed(2)}%</div>
                                </td>
                            </tr>
                        );
                        })}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>

            {/* Latest Earnings Section */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-medium text-gray-900">Latest Earnings</h3>
                    <Link
                      href={'earnings'}
                      className="text-xs bg-[#9159FF] text-white px-3 py-1.5 rounded-md hover:bg-[#7c3aed] transition-colors"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Asset</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Protocol</th>
                          <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
                          <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">USD Value</th>
                          <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {latestEarnings.filter(earning => earning.protocol !== 'euler').map((earning, index) => (
                          <tr key={index} className="border-b border-gray-50 hover:bg-purple-50 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <Image width={21} height={21} src={earning.icon} alt={earning.asset} className="w-6 h-6 rounded-full" />
                                <span className="text-sm font-medium text-gray-900">{earning.asset}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <Image width={14} height={14} src={getProtocolIcon(earning.protocol)} alt={earning.protocol} className="w-4 h-4" />
                                <span className="text-sm text-gray-600 capitalize">{earning.protocol}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="text-sm font-medium text-green-600">
                                +{earning.asset === 'USDC'
                                  ? earning.amount.toFixed(2)
                                  : earning.asset === 'ETH'
                                  ? earning.amount.toFixed(4)
                                  : earning.amount.toFixed(6)
                                } {earning.asset}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="text-sm font-medium text-gray-900">${earning.value.toFixed(2)}</div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="text-sm text-gray-500">{earning.time}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

            </div>
        )}
        </div>
    </main>
    </div>
  );
}