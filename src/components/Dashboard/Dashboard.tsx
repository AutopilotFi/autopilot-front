"use client"
import { TrendingUp, Clock, Zap, ChevronLeft, BarChart3, Wallet, Plus, Minus, ExternalLink, Trophy, History, Coins, Info, Activity, DollarSign, Timer, Circle, Download, Shield, CheckCircle2, AlertTriangle, Menu, Cpu, Settings, Layers, BarChart2, Globe, UserCheck, TrendingDownIcon, X, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { AutopilotProduct, UserState } from "../../app/page";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../UI/Tooltip";
import { autopilotData } from "@/consts/autopilotData";
import getStatsForUserState from "@/helpers/getStatsForUserState";
import { TimeFrame } from "@/types/globalAppTypes";

interface DashboardProps {
  initialTab?: string;
  selectedAutopilot: AutopilotProduct;
  onAutopilotChange: (autopilot: AutopilotProduct) => void;
  userState?: UserState;
  onUserStateChange?: (state: UserState) => void;
}

export default function Dashboard({
  initialTab = 'overview',
  selectedAutopilot,
  onAutopilotChange,
  userState = 'active',
  onUserStateChange
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'earnings' | 'benchmark' | 'details' | 'history'>('overview');
  const [depositMode, setDepositMode] = useState<'enter' | 'exit'>('enter');
  const [depositAmount, setDepositAmount] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [earningsCurrentPage, setEarningsCurrentPage] = useState(1);
  const [showUpdateFrequency, setShowUpdateFrequency] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeframe, setTimeframe] = useState<TimeFrame>('all');
  const [insuranceEnabled, setInsuranceEnabled] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const itemsPerPage = 10;
  const periods: TimeFrame[] = ["1m", "7d", "all"];

  const isNewUser = userState === 'new';
  const isOldUser = userState === 'old';

  useEffect(() => {
    setDepositAmount('');
  }, [selectedAutopilot]);

  // Set the initial tab properly
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab as typeof activeTab);
    }
  }, [initialTab]);

  // Ensure activeTab is properly initialized to 'overview' immediately
  useEffect(() => {
    if (!activeTab) {
      setActiveTab('overview');
    }
  }, [activeTab]);


  const getDataKey = () => `${selectedAutopilot.protocol}-${selectedAutopilot.asset}`;
  const currentData = autopilotData[getDataKey() as keyof typeof autopilotData];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stats = getStatsForUserState(currentData, userState, selectedAutopilot);

  const earningsStats = isNewUser ? [
    {
      label: "Total Earnings",
      value: "—",
      unit: currentData.asset,
      tooltip: "Your total accumulated earnings will be displayed here"
    },
    {
      label: "30D Earnings",
      value: "—",
      unit: currentData.asset,
      tooltip: "Earnings from the last 30 days"
    },
    {
      label: "24H Earnings",
      value: "—",
      unit: currentData.asset,
      tooltip: "Earnings from the last 24 hours"
    },
    {
      label: "Update Frequency",
      value: "~28",
      unit: "min"
    },
  ] : isOldUser ? [
    {
      label: "Total Earnings",
      value: currentData.currentEarnings.toLocaleString('en-US', {
        minimumFractionDigits: currentData.asset === 'USDC' ? 0 : 4,
        maximumFractionDigits: currentData.asset === 'USDC' ? 0 : 4
      }),
      unit: currentData.asset
    },
    {
      label: "30D Earnings",
      value: "0.00",
      unit: currentData.asset
    },
    {
      label: "24H Earnings",
      value: "0.00",
      unit: currentData.asset
    },
    {
      label: "Update Frequency",
      value: "~28",
      unit: "min"
    },
  ] : [
    {
      label: "Total Earnings",
      value: currentData.currentEarnings.toLocaleString('en-US', {
        minimumFractionDigits: currentData.asset === 'USDC' ? 0 : 4,
        maximumFractionDigits: currentData.asset === 'USDC' ? 0 : 4
      }),
      unit: currentData.asset
    },
    {
      label: "30D Earnings",
      value: selectedAutopilot.protocol === 'morpho'
        ? (selectedAutopilot.asset === 'USDC' ? "1,235" : selectedAutopilot.asset === 'ETH' ? "0.45" : "0.028")
        : (selectedAutopilot.asset === 'USDC' ? "1,089" : selectedAutopilot.asset === 'ETH' ? "0.38" : "0.022"),
      unit: currentData.asset
    },
    {
      label: "24H Earnings",
      value: selectedAutopilot.protocol === 'morpho'
        ? (selectedAutopilot.asset === 'USDC' ? "45" : selectedAutopilot.asset === 'ETH' ? "0.015" : "0.0009")
        : (selectedAutopilot.asset === 'USDC' ? "38" : selectedAutopilot.asset === 'ETH' ? "0.012" : "0.0007"),
      unit: currentData.asset
    },
    {
      label: "Update Frequency",
      value: "~28",
      unit: "min"
    },
  ];

  const historyStats = isNewUser ? [
    {
      label: "Total Deposits",
      value: "—",
      unit: currentData.asset,
      tooltip: "Total amount you've deposited"
    },
    {
      label: "Total Withdrawals",
      value: "—",
      unit: currentData.asset,
      tooltip: "Total amount you've withdrawn"
    },
    {
      label: "Total Earnings",
      value: "—",
      unit: currentData.asset,
      tooltip: "All-time earnings from the Autopilot"
    },
    {
      label: "Total Actions",
      value: "—",
      unit: "",
      tooltip: "Number of deposits, withdrawals, and other transactions"
    },
  ] : isOldUser ? [
    {
      label: "Total Deposits",
      value: selectedAutopilot.protocol === 'morpho'
        ? (selectedAutopilot.asset === 'USDC' ? "195,000" : selectedAutopilot.asset === 'ETH' ? "82.5" : "3.1")
        : (selectedAutopilot.asset === 'USDC' ? "175,000" : selectedAutopilot.asset === 'ETH' ? "74.2" : "2.8"),
      unit: currentData.asset
    },
    {
      label: "Total Withdrawals",
      value: selectedAutopilot.protocol === 'morpho'
        ? (selectedAutopilot.asset === 'USDC' ? "195,000" : selectedAutopilot.asset === 'ETH' ? "82.5" : "3.1")
        : (selectedAutopilot.asset === 'USDC' ? "175,000" : selectedAutopilot.asset === 'ETH' ? "74.2" : "2.8"),
      unit: currentData.asset
    },
    {
      label: "Total Earnings",
      value: currentData.currentEarnings.toLocaleString('en-US', {
        minimumFractionDigits: currentData.asset === 'USDC' ? 0 : 4,
        maximumFractionDigits: currentData.asset === 'USDC' ? 0 : 4
      }),
      unit: currentData.asset
    },
    {
      label: "Total Actions",
      value: selectedAutopilot.protocol === 'morpho' ? "47" : "52",
      unit: ""
    },
  ] : [
    {
      label: "Total Deposits",
      value: selectedAutopilot.protocol === 'morpho'
        ? (selectedAutopilot.asset === 'USDC' ? "195,000" : selectedAutopilot.asset === 'ETH' ? "82.5" : "3.1")
        : (selectedAutopilot.asset === 'USDC' ? "175,000" : selectedAutopilot.asset === 'ETH' ? "74.2" : "2.8"),
      unit: currentData.asset
    },
    {
      label: "Total Withdrawals",
      value: selectedAutopilot.protocol === 'morpho'
        ? (selectedAutopilot.asset === 'USDC' ? "2,500" : selectedAutopilot.asset === 'ETH' ? "1.2" : "0.08")
        : (selectedAutopilot.asset === 'USDC' ? "3,200" : selectedAutopilot.asset === 'ETH' ? "1.8" : "0.12"),
      unit: currentData.asset
    },
    {
      label: "Total Earnings",
      value: currentData.currentEarnings.toLocaleString('en-US', {
        minimumFractionDigits: currentData.asset === 'USDC' ? 0 : 4,
        maximumFractionDigits: currentData.asset === 'USDC' ? 0 : 4
      }),
      unit: currentData.asset
    },
    {
      label: "Total Actions",
      value: selectedAutopilot.protocol === 'morpho' ? "47" : "52",
      unit: ""
    },
  ];

  const detailsStats = [
    {
      label: "7d APY",
      value: selectedAutopilot.protocol === 'morpho'
        ? (selectedAutopilot.asset === 'USDC' ? "8.75" : selectedAutopilot.asset === 'ETH' ? "4.38" : "2.19")
        : (selectedAutopilot.asset === 'USDC' ? "7.35" : selectedAutopilot.asset === 'ETH' ? "3.73" : "1.86"),
      unit: "%"
    },
    {
      label: "30d APY",
      value: selectedAutopilot.protocol === 'morpho'
        ? (selectedAutopilot.asset === 'USDC' ? "8.42" : selectedAutopilot.asset === 'ETH' ? "4.21" : "2.10")
        : (selectedAutopilot.asset === 'USDC' ? "7.12" : selectedAutopilot.asset === 'ETH' ? "3.56" : "1.78"),
      unit: "%"
    },
    {
      label: "TVL",
      value: "$10.8M",
      unit: ""
    },
  ];

  // Navigation handlers
  const handleNavigateToDeposit = () => {
    setActiveTab('deposit');
  };

  const handleOpenBenchmark = () => {
    setActiveTab('benchmark');
  };

  // Tab navigation configuration with icons
  const tabConfig = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'deposit', label: 'Deposit', icon: Wallet },
    { key: 'earnings', label: 'Earnings', icon: TrendingUp },
    { key: 'benchmark', label: 'Benchmark', icon: Trophy },
    { key: 'details', label: 'Details', icon: Info },
    { key: 'history', label: 'History', icon: History }
  ];

  // Standardized stats grid component
  const StatsGrid = ({ statsData }: { statsData: typeof stats }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
      {statsData.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg md:rounded-xl border border-gray-100 p-3 md:p-6 relative">
          <div className="flex items-start justify-between mb-2 md:mb-3">
            <p className="text-xs md:text-sm font-medium text-gray-600 leading-tight">{stat.label}</p>
            {stat.hasTooltip ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3 md:w-4 h-3 md:h-4 text-gray-400 cursor-help flex-shrink-0" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">{stat.tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            ) : (stat.tooltip && isNewUser) ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3 md:w-4 h-3 md:h-4 text-[#9159FF] cursor-help flex-shrink-0" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">{stat.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ) : stat.unit !== 'min' ? (
              <img src={currentData.assetIcon} alt={stat.unit} className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
            ) : null}
          </div>
          <div className="flex items-baseline space-x-1 md:space-x-2">
            <span className={`text-lg md:text-2xl font-bold leading-none break-all ${
              isNewUser && stat.value === '—' ? 'text-gray-400' : 'text-gray-900'
            }`}>{stat.value}</span>
            <span className="text-xs md:text-sm text-gray-500 flex-shrink-0">{stat.unit}</span>
          </div>
          {stat.latestUpdate && (
            <div className="absolute bottom-1 md:bottom-2 right-3 md:right-6">
              <span className={`text-xs ${isNewUser ? 'text-[#9159FF]' : 'text-gray-400'}`}>{stat.latestUpdate}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // Standardized button component for new user CTAs
  const StandardCTAButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
    >
      <Wallet className="w-4 h-4 mr-2" />
      {children}
    </button>
  );

  // Terms of Use Modal Component
  const TermsModal = () => {
    if (!showTermsModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Acknowledge terms</h2>
            <button
              onClick={() => setShowTermsModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Terms Content */}
          <div className="space-y-6">
            <p className="text-gray-700 text-sm leading-relaxed">
              By accessing or using Autopilot's products and services, I agree to the{" "}
              <span className="text-green-600 underline cursor-pointer hover:text-green-700">Terms of Service</span>
              {", "}
              <span className="text-green-600 underline cursor-pointer hover:text-green-700">Privacy Policy</span>
              {", and "}
              <span className="text-green-600 underline cursor-pointer hover:text-green-700">Risk Disclosures</span>
              {". I further acknowledge and warrant:"}
            </p>

            {/* Terms List */}
            <div className="space-y-4">
              {/* Restricted Jurisdiction */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-700 text-sm">
                  I am not a resident of, located in, or incorporated in any Restricted Jurisdiction. I will not access this site or use our products or services while in any restricted locations, nor use a VPN to mask my location.
                </p>
              </div>

              {/* Jurisdiction Permission */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-700 text-sm">
                  I am permitted to access this platform and use Autopilot services under the laws of my jurisdiction.
                </p>
              </div>

              {/* Sanctioned Person */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-700 text-sm">
                  I am not a Sanctioned Person (as defined in the Terms of Service) nor acting on behalf of one.
                </p>
              </div>

              {/* Experimental Nature */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-700 text-sm">
                  The Platform, Protocols, and related services are experimental and may result in complete loss of funds. Autopilot and its affiliates do not custody or control user assets or transactions; all operations are performed by the underlying protocols.
                </p>
              </div>

              {/* DeFi Risks */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingDownIcon className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-700 text-sm">
                  I understand the risks of decentralized finance and engaging with blockchain and web3 services, including but not limited to technical, operational, market, liquidity, and regulatory risks.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-8">
            <button
              onClick={() => setShowTermsModal(false)}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Reject
            </button>
            <button
              onClick={() => {
                setShowTermsModal(false);
                // Here you would normally handle terms acceptance
                if (onUserStateChange) {
                  onUserStateChange('active');
                }
              }}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar
          selectedAutopilot={selectedAutopilot}
          onAutopilotChange={onAutopilotChange}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userState={userState}
          onUserStateChange={onUserStateChange}
          currentView="dashboard"
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {isMobile && (
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Menu className="w-5 h-5" />
                    </button>
                  )}

                  <button
                    // onClick={onNavigateHome}
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center space-x-3">
                    <img src={currentData.assetIcon} alt={currentData.asset} className="w-8 h-8" />
                    <div>
                      <h1 className="font-semibold text-gray-900">{currentData.asset} Autopilot</h1>
                      <div className="flex items-center space-x-2">
                        <img src={currentData.icon} alt={currentData.name} className="w-4 h-4" />
                        <span className="text-sm text-gray-500">{currentData.name}</span>

                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-md">
                    <Circle className="w-2 h-2 fill-green-600 text-green-600 animate-gentle-blink" />
                    <span className="text-sm font-semibold text-green-600">
                      {(currentData.currentAPY * 100).toFixed(2)}% APY
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Navigation Tabs */}
          <div className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabConfig.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.key;

                  return (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setActiveTab(tab.key as typeof activeTab);
                      }}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center space-x-2 ${
                        isActive
                          ? 'border-[#9159FF] text-[#9159FF]'
                          : 'border-transparent text-gray-500 hover:text-[#9159FF] hover:border-[#c4b5fd]'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content with Boxed Layout */}
          <main className="flex-1 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Stats Grid */}
                  <StatsGrid statsData={stats} />

                  {/* Main Content Grid */}
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Earnings Chart */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
                      {/* Header Section */}
                      <div className="p-6 pb-4">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-semibold text-gray-900">Earnings</h3>
                          <div className="flex items-center space-x-1">
                            {periods.map(period => (
                              <button
                                key={period}
                                onClick={() => setTimeframe(period)}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                  timeframe === period
                                    ? 'bg-[#9159FF] text-white'
                                    : 'text-[#9159FF] hover:text-[#7c3aed] hover:bg-purple-50'
                                }`}
                              >
                                {period}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {isNewUser ? (
                        <div className="p-6">
                          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-blue-200">
                            <div className="text-center">
                              <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                              <h4 className="text-lg font-semibold text-gray-900 mb-2">Your Earnings Chart</h4>
                              <p className="text-sm text-gray-600 mb-4 max-w-xs">
                                Track your yield performance over time. Your earnings history will appear here once you start using the Autopilot.
                              </p>
                              <StandardCTAButton onClick={handleNavigateToDeposit}>
                                Start Earning
                              </StandardCTAButton>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>


                          {/* Chart Section */}
                          <div className="px-6 pb-6">
                            <div className="h-72 bg-gradient-to-br from-purple-50 to-white rounded-lg relative overflow-hidden">
                              {/* Blur overlay for chart area */}
                              <div className="absolute inset-0 backdrop-blur-[2px] bg-white/20 rounded-lg"></div>

                              {/* Chart Visualization Label */}
                              <div className="absolute inset-0 flex items-center justify-center z-10">
                                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200 shadow-sm">
                                  <span className="text-sm font-medium text-gray-600">Chart Visualization</span>
                                </div>
                              </div>

                              <svg className="w-full h-full opacity-60" viewBox="0 0 400 200" preserveAspectRatio="none">
                                <defs>
                                  <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#9159FF" stopOpacity="0.3" />
                                    <stop offset="50%" stopColor="#9159FF" stopOpacity="0.15" />
                                    <stop offset="100%" stopColor="#9159FF" stopOpacity="0.05" />
                                  </linearGradient>
                                  <linearGradient id="purpleStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#9159FF" stopOpacity="0.6" />
                                    <stop offset="50%" stopColor="#9159FF" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#9159FF" stopOpacity="1" />
                                  </linearGradient>
                                </defs>

                                {/* Chart area fill */}
                                <path
                                  d="M 0 180 L 50 160 L 100 150 L 150 130 L 200 120 L 250 100 L 300 85 L 350 70 L 400 50 L 400 200 L 0 200 Z"
                                  fill="url(#purpleGradient)"
                                />

                                {/* Chart line */}
                                <path
                                  d="M 0 180 L 50 160 L 100 150 L 150 130 L 200 120 L 250 100 L 300 85 L 350 70 L 400 50"
                                  stroke="url(#purpleStroke)"
                                  strokeWidth="3"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />

                                {/* Data points */}
                                {[
                                  { x: 0, y: 180 },
                                  { x: 50, y: 160 },
                                  { x: 100, y: 150 },
                                  { x: 150, y: 130 },
                                  { x: 200, y: 120 },
                                  { x: 250, y: 100 },
                                  { x: 300, y: 85 },
                                  { x: 350, y: 70 },
                                  { x: 400, y: 50 }
                                ].map((point, index) => (
                                  <circle
                                    key={index}
                                    cx={point.x}
                                    cy={point.y}
                                    r="3"
                                    fill="#9159FF"
                                    opacity="0.8"
                                  />
                                ))}
                              </svg>

                              {/* Subtle grid lines */}
                              <div className="absolute inset-0 opacity-10">
                                <div className="grid grid-cols-8 grid-rows-4 h-full w-full">
                                  {Array.from({ length: 32 }).map((_, i) => (
                                    <div key={i} className="border border-gray-300"></div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Latest Earnings */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Latest Earnings</h3>
                        {!isNewUser && (
                          <button
                            // onClick={handleViewAllEarnings}
                            className="text-xs bg-[#9159FF] text-white px-3 py-1.5 rounded-md hover:bg-[#7c3aed] transition-colors"
                          >
                            View All
                          </button>
                        )}
                      </div>

                      {isNewUser ? (
                        <div className="space-y-4">
                          <div className="text-center py-8">
                            <Coins className="w-10 h-10 text-[#9159FF] mx-auto mb-3" />
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Your Latest Earnings</h4>
                            <p className="text-xs text-gray-600 mb-4">
                              Your earnings will be reflected here. Supply funds to get started with the {currentData.asset} Autopilot.
                            </p>
                            <StandardCTAButton onClick={handleNavigateToDeposit}>
                              Start Earning
                            </StandardCTAButton>
                          </div>
                        </div>
                      ) : isOldUser ? (
                        <div className="space-y-4">
                          <div className="text-center py-8">
                            <Clock className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                            <h4 className="text-sm font-medium text-gray-900 mb-2">No Recent Earnings</h4>
                            <p className="text-xs text-gray-600 mb-4">
                              No active deposits generating earnings. Your last earnings were from previous deposits.
                            </p>
                            <StandardCTAButton onClick={handleNavigateToDeposit}>
                              Start Earning
                            </StandardCTAButton>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {currentData.recentEarnings.map((earning, index) => (
                            <div key={index} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-purple-50 hover:border hover:border-purple-200 transition-colors cursor-pointer">
                              <div className="flex items-center space-x-3">
                                <img src={currentData.assetIcon} alt={currentData.asset} className="w-5 h-5" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    +{earning.amount.toLocaleString('en-US', {
                                      minimumFractionDigits: currentData.asset === 'USDC' ? 2 : 6,
                                      maximumFractionDigits: currentData.asset === 'USDC' ? 2 : 6
                                    })} {currentData.asset}
                                  </div>
                                  <div className="text-xs text-gray-500">Yield earned</div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">{earning.time}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Current Allocation Table - Always show for both user states */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Current Allocation</h3>
                      <p className="text-sm text-gray-600">Live distribution across yield sources</p>
                    </div>

                    {/* Optimization Status */}
                    <div className={`${isOldUser ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'} border rounded-xl p-4 mb-6`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${isOldUser ? 'bg-gray-100' : 'bg-green-100'} rounded-lg flex items-center justify-center`}>
                            <Zap className={`w-4 h-4 ${isOldUser ? 'text-gray-600' : 'text-green-600'}`} />
                          </div>
                          <div>
                            <h4 className={`text-sm font-semibold ${isOldUser ? 'text-gray-900' : 'text-green-900'}`}>
                              {isOldUser ? 'No Active Positions' : 'Optimization Active'}
                            </h4>
                            <p className={`text-xs ${isOldUser ? 'text-gray-700' : 'text-green-700'}`}>
                              {isOldUser ? 'All funds have been withdrawn' : 'Automatically rebalancing for maximum yield'}
                            </p>
                          </div>
                        </div>
                        <div className={`${isOldUser ? 'bg-white text-gray-700 border-gray-200/50' : 'bg-white text-green-700 border-green-200/50'} px-3 py-1 rounded-lg text-xs font-medium border`}>
                          {isOldUser ? 'Inactive' : 'Last rebalance: 2h'}
                        </div>
                      </div>
                    </div>

                    {/* Allocation table for all users */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Yield Source</th>
                            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">7d APY</th>
                            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
                            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Allocation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isOldUser ? (
                            <tr>
                              <td colSpan={4} className="py-12 text-center">
                                <div className="text-center">
                                  <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Active Allocations</h4>
                                  <p className="text-sm text-gray-600 mb-4">
                                    You have withdrawn all funds. Your historical allocation data is preserved in the details section.
                                  </p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            currentData.allocations.map((allocation, index) => (
                              <tr key={index} className="border-b border-gray-50 hover:bg-purple-50 transition-colors">
                                <td className="py-4 px-4">
                                  <div className="flex items-center space-x-3">
                                    <img src={currentData.assetIcon} alt={currentData.asset} className="w-6 h-6 rounded-full" />
                                    <span className="text-sm font-medium text-gray-900">{allocation.name}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <div className="text-sm font-medium text-gray-900">{allocation.apy.toFixed(2)}%</div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <div className="text-sm font-medium text-gray-900">
                                    {allocation.amount.toLocaleString('en-US', {
                                      maximumFractionDigits: currentData.asset === 'USDC' ? 0 : 4
                                    })} {currentData.asset}
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <div className="text-sm font-medium text-gray-900">{allocation.allocation.toFixed(1)}%</div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Earnings tab - only new users get empty state */}
              {activeTab === 'earnings' && (
                <div className="space-y-8">
                  <StatsGrid statsData={earningsStats} />
                  {isNewUser ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <History className="w-8 h-8 text-green-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Your Earnings History</h4>
                        <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                          All your earnings transactions will be tracked here. Start by making your first deposit to begin earning yield with the {currentData.asset} Autopilot.
                        </p>
                        <StandardCTAButton onClick={handleNavigateToDeposit}>
                          Start Earning
                        </StandardCTAButton>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Earnings History</h3>
                        <button className="text-sm bg-[#9159FF] text-white px-3 py-1.5 rounded-lg hover:bg-[#7c3aed] transition-colors flex items-center space-x-2">
                          <Download className="w-4 h-4" />
                          <span>Export</span>
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Asset</th>
                              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Action</th>
                              <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
                              <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">USD Value</th>
                              <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              const generateEarningsData = (baseAmount: number, variance: number, decimals: number) => {
                                return [
                                  { date: "2025-06-16T09:18:00", amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)) },
                                  { date: "2025-06-16T06:30:00", amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)) },
                                  { date: "2025-06-15T22:40:00", amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)) },
                                  { date: "2025-06-15T18:15:00", amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)) },
                                  { date: "2025-06-15T14:33:00", amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)) },
                                  { date: "2025-06-15T10:20:00", amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)) },
                                  { date: "2025-06-15T06:10:00", amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)) },
                                  { date: "2025-06-14T23:45:00", amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)) },
                                  { date: "2025-06-14T19:30:00", amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)) },
                                  { date: "2025-06-14T15:22:00", amount: parseFloat((baseAmount + Math.random() * variance).toFixed(decimals)) },
                                ];
                              };

                              const getEarningsParams = () => {
                                if (currentData.asset === 'USDC') return { base: 15, variance: 10, decimals: 2 };
                                if (currentData.asset === 'ETH') return { base: 0.003, variance: 0.002, decimals: 6 };
                                return { base: 0.0001, variance: 0.00005, decimals: 8 }; // cbBTC
                              };

                              const earningsParams = getEarningsParams();
                              const allEarnings = generateEarningsData(earningsParams.base, earningsParams.variance, earningsParams.decimals);

                              return allEarnings.slice(0, 10).map((earning, index) => {
                                const date = new Date(earning.date);
                                const formatDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                const formatTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

                                return (
                                  <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4">
                                      <div className="flex items-center space-x-3">
                                        <img src={currentData.assetIcon} alt={currentData.asset} className="w-6 h-6 rounded-full" />
                                        <span className="text-sm font-medium text-gray-900">{currentData.asset}</span>
                                      </div>
                                    </td>
                                    <td className="py-4 px-4">
                                      <div className="relative group">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-[#9159FF] bg-purple-50 border border-purple-200 cursor-help">
                                          <RotateCcw className="w-3 h-3 mr-1.5" />
                                          Autocompounded
                                        </span>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-0 pointer-events-none whitespace-nowrap z-10 max-w-xs">
                                          <div className="text-center">
                                            The earnings have been automatically<br />
                                            turned into more balance of your position,<br />
                                            increasing the strength of your earnings going forward
                                          </div>
                                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                      <div className="text-sm font-medium text-green-600">
                                        +{earning.amount.toFixed(currentData.asset === 'USDC' ? 2 : 6)} {currentData.asset}
                                      </div>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                      <div className="text-sm font-medium text-gray-900">
                                        ${(earning.amount * (currentData.asset === 'USDC' ? 1 : currentData.asset === 'ETH' ? 4000 : 100000)).toFixed(2)}
                                      </div>
                                    </td>
                                    <td className="py-4 px-4">
                                      <div className="text-sm text-gray-500">{formatDate} {formatTime}</div>
                                    </td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-500">
                          Showing 1 to 10 of 50 entries
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                            Previous
                          </button>
                          <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* History tab - only new users get empty state */}
              {activeTab === 'history' && (
                <div className="space-y-8">
                  <StatsGrid statsData={historyStats} />
                  {isNewUser ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <div className="text-center py-16">
                        <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Transaction History</h4>
                        <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                          All your deposits, withdrawals, and other transactions will be tracked here once you start using the Autopilot.
                        </p>
                        <StandardCTAButton onClick={handleNavigateToDeposit}>
                          Start Earning
                        </StandardCTAButton>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
                        <button className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                          <Download className="w-4 h-4" />
                          <span>Export</span>
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Type</th>
                              <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
                              <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                              <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              const generateTransactionHistory = () => {
                                if (selectedAutopilot.asset === 'USDC') {
                                  return selectedAutopilot.protocol === 'morpho' ? [
                                    { date: "2025-06-15T14:30:00", type: "Deposit", amount: 5000.00, txHash: "0x1a2b3c4d5e6f7890", status: "Completed" },
                                    { date: "2025-06-10T09:15:00", type: "Deposit", amount: 15000.00, txHash: "0x2b3c4d5e6f789012", status: "Completed" },
                                    { date: "2025-06-05T16:45:00", type: "Withdrawal", amount: 2500.00, txHash: "0x3c4d5e6f78901234", status: "Completed" },
                                    { date: "2025-05-28T11:20:00", type: "Deposit", amount: 25000.00, txHash: "0x4d5e6f7890123456", status: "Completed" },
                                    { date: "2025-05-22T13:55:00", type: "Deposit", amount: 50000.00, txHash: "0x5e6f789012345678", status: "Completed" },
                                    { date: "2025-05-15T08:30:00", type: "Deposit", amount: 100000.00, txHash: "0x6f78901234567890", status: "Completed" },
                                  ] : [
                                    { date: "2025-06-14T16:20:00", type: "Deposit", amount: 8000.00, txHash: "0xe1f2a3b4c5d67890", status: "Completed" },
                                    { date: "2025-06-08T11:30:00", type: "Deposit", amount: 12000.00, txHash: "0xf2a3b4c5d6789012", status: "Completed" },
                                    { date: "2025-06-03T14:15:00", type: "Withdrawal", amount: 3200.00, txHash: "0xa3b4c5d678901234", status: "Completed" },
                                    { date: "2025-05-25T09:45:00", type: "Deposit", amount: 22000.00, txHash: "0xb4c5d67890123456", status: "Completed" },
                                    { date: "2025-05-18T15:10:00", type: "Deposit", amount: 35000.00, txHash: "0xc5d678901234567e", status: "Completed" },
                                    { date: "2025-05-10T12:30:00", type: "Deposit", amount: 95000.00, txHash: "0xd67890123456789f", status: "Completed" },
                                  ];
                                } else if (selectedAutopilot.asset === 'ETH') {
                                  return selectedAutopilot.protocol === 'morpho' ? [
                                    { date: "2025-06-15T14:30:00", type: "Deposit", amount: 2.5, txHash: "0x1a2b3c4d5e6f7890", status: "Completed" },
                                    { date: "2025-06-10T09:15:00", type: "Deposit", amount: 8.75, txHash: "0x2b3c4d5e6f789012", status: "Completed" },
                                    { date: "2025-06-05T16:45:00", type: "Withdrawal", amount: 1.2, txHash: "0x3c4d5e6f78901234", status: "Completed" },
                                    { date: "2025-05-28T11:20:00", type: "Deposit", amount: 15.5, txHash: "0x4d5e6f7890123456", status: "Completed" },
                                    { date: "2025-05-22T13:55:00", type: "Deposit", amount: 25.8, txHash: "0x5e6f789012345678", status: "Completed" },
                                    { date: "2025-05-15T08:30:00", type: "Deposit", amount: 35.2, txHash: "0x6f78901234567890", status: "Completed" },
                                  ] : [
                                    { date: "2025-06-14T16:20:00", type: "Deposit", amount: 3.2, txHash: "0xe1f2a3b4c5d67890", status: "Completed" },
                                    { date: "2025-06-08T11:30:00", type: "Deposit", amount: 6.8, txHash: "0xf2a3b4c5d6789012", status: "Completed" },
                                    { date: "2025-06-03T14:15:00", type: "Withdrawal", amount: 1.8, txHash: "0xa3b4c5d678901234", status: "Completed" },
                                    { date: "2025-05-25T09:45:00", type: "Deposit", amount: 12.4, txHash: "0xb4c5d67890123456", status: "Completed" },
                                    { date: "2025-05-18T15:10:00", type: "Deposit", amount: 18.9, txHash: "0xc5d678901234567e", status: "Completed" },
                                    { date: "2025-05-10T12:30:00", type: "Deposit", amount: 32.1, txHash: "0xd67890123456789f", status: "Completed" },
                                  ];
                                } else { // cbBTC
                                  return selectedAutopilot.protocol === 'morpho' ? [
                                    { date: "2025-06-15T14:30:00", type: "Deposit", amount: 0.15, txHash: "0x1a2b3c4d5e6f7890", status: "Completed" },
                                    { date: "2025-06-10T09:15:00", type: "Deposit", amount: 0.65, txHash: "0x2b3c4d5e6f789012", status: "Completed" },
                                    { date: "2025-06-05T16:45:00", type: "Withdrawal", amount: 0.08, txHash: "0x3c4d5e6f78901234", status: "Completed" },
                                    { date: "2025-05-28T11:20:00", type: "Deposit", amount: 1.2, txHash: "0x4d5e6f7890123456", status: "Completed" },
                                    { date: "2025-05-22T13:55:00", type: "Deposit", amount: 0.95, txHash: "0x5e6f789012345678", status: "Completed" },
                                    { date: "2025-05-15T08:30:00", type: "Deposit", amount: 1.8, txHash: "0x6f78901234567890", status: "Completed" },
                                  ] : [
                                    { date: "2025-06-14T16:20:00", type: "Deposit", amount: 0.22, txHash: "0xe1f2a3b4c5d67890", status: "Completed" },
                                    { date: "2025-06-08T11:30:00", type: "Deposit", amount: 0.48, txHash: "0xf2a3b4c5d6789012", status: "Completed" },
                                    { date: "2025-06-03T14:15:00", type: "Withdrawal", amount: 0.12, txHash: "0xa3b4c5d678901234", status: "Completed" },
                                    { date: "2025-05-25T09:45:00", type: "Deposit", amount: 0.85, txHash: "0xb4c5d67890123456", status: "Completed" },
                                    { date: "2025-05-18T15:10:00", type: "Deposit", amount: 1.1, txHash: "0xc5d678901234567e", status: "Completed" },
                                    { date: "2025-05-10T12:30:00", type: "Deposit", amount: 1.6, txHash: "0xd67890123456789f", status: "Completed" },
                                  ];
                                }
                              };

                              const depositWithdrawalHistory = generateTransactionHistory();

                              return depositWithdrawalHistory.map((transaction, index) => {
                                const date = new Date(transaction.date);
                                const formatDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                const formatTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

                                return (
                                  <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4">
                                      <div className="text-sm font-medium text-gray-900">{transaction.type}</div>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                      <div className="text-sm font-medium text-gray-900">
                                        {transaction.type === 'Withdrawal' ? '-' : '+'}
                                        {transaction.amount.toLocaleString('en-US', {
                                          minimumFractionDigits: currentData.asset === 'USDC' ? 2 : 6,
                                          maximumFractionDigits: currentData.asset === 'USDC' ? 2 : 6
                                        })} {currentData.asset}
                                      </div>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                      <div className="text-sm font-medium text-gray-900">{transaction.status}</div>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                      <div className="text-sm text-gray-500">{formatDate} {formatTime}</div>
                                    </td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-500">
                          Showing 1 to 6 of 6 entries
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                            Previous
                          </button>
                          <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Details tab - always show regular content */}
              {activeTab === 'details' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-3 gap-3 md:gap-6">
                    {detailsStats.map((stat, index) => (
                      <div key={index} className="bg-white rounded-lg md:rounded-xl border border-gray-100 p-3 md:p-6 relative">
                        <div className="flex items-start justify-between mb-2 md:mb-3">
                          <p className="text-xs md:text-sm font-medium text-gray-600 leading-tight">{stat.label}</p>
                          {stat.unit !== '' && stat.unit !== '%' && (
                            <img src={currentData.assetIcon} alt={stat.unit} className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-baseline space-x-1 md:space-x-2">
                          <span className="text-lg md:text-2xl font-bold leading-none break-all text-gray-900">{stat.value}</span>
                          <span className="text-xs md:text-sm text-gray-500 flex-shrink-0">{stat.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Automated Algorithm Active */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <Cpu className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">Automated Algorithm</h3>
                          <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">
                            Active
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Advanced rebalancing algorithm monitors yield opportunities across {currentData.name.toLowerCase()} vaults and automatically adjusts allocations to maximize returns.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Rebalancing Triggers */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>Rebalancing Triggers</span>
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-700">Gas cost optimization</span>
                          </div>
                          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-700">Interest rate movements</span>
                          </div>
                          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                            <Activity className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-700">Vault liquidity changes</span>
                          </div>
                          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                            <BarChart2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-700">Market impact analysis</span>
                          </div>
                        </div>
                      </div>

                      {/* Update Frequency */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center space-x-2">
                          <Timer className="w-4 h-4" />
                          <span>Update Frequency</span>
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Monitoring</div>
                            <div className="text-sm font-medium text-gray-900">Every 15 minutes</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Rebalancing</div>
                            <div className="text-sm font-medium text-gray-900">Multiple times/hour when competitive rates shift</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Last check</div>
                            <div className="text-sm font-medium text-green-600">12 minutes ago</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technical Information */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Technical Information</h3>

                    {/* General and Performance Info - Top Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      {/* General */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">General</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Operating since</span>
                            <span className="text-sm font-medium text-gray-900">March 2024</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Starting SharePrice</span>
                            <span className="text-sm font-medium text-gray-900">1.0000 {currentData.asset}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Latest SharePrice</span>
                            <span className="text-sm font-medium text-gray-900">1.10013 {currentData.asset}</span>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Autopilot {currentData.asset} Vault Address</div>
                            <div className="text-xs font-mono text-gray-900 bg-gray-100 p-2 rounded">
                              0xAUTO1a2b...9i0j
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Performance History */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Performance History</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">7d Average</span>
                            <span className="text-sm font-medium text-gray-900">
                              {selectedAutopilot.protocol === 'morpho'
                                ? (selectedAutopilot.asset === 'USDC' ? "8.75" : selectedAutopilot.asset === 'ETH' ? "4.38" : "2.19")
                                : (selectedAutopilot.asset === 'USDC' ? "7.35" : selectedAutopilot.asset === 'ETH' ? "3.73" : "1.86")}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">30d Average</span>
                            <span className="text-sm font-medium text-gray-900">
                              {selectedAutopilot.protocol === 'morpho'
                                ? (selectedAutopilot.asset === 'USDC' ? "8.42" : selectedAutopilot.asset === 'ETH' ? "4.21" : "2.10")
                                : (selectedAutopilot.asset === 'USDC' ? "7.12" : selectedAutopilot.asset === 'ETH' ? "3.56" : "1.78")}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Yield Sources - Full Width List */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Yield Sources</h4>
                      <div className="space-y-2">
                        {(() => {
                          // Generate comprehensive vault list from benchmark data
                          const generateAllVaults = () => {
                            if (selectedAutopilot.protocol === 'morpho') {
                              if (selectedAutopilot.asset === 'USDC') {
                                return [
                                  { name: "Extrafi XLend USDC Vault (Gauntlet)", address: "0x0001...0000", apy: "8.50%" },
                                  { name: "Ionic Ecosystem", address: "0x0002...0007", apy: "8.50%" },
                                  { name: "Moonwell Flagship", address: "0x0003...000e", apy: "7.94%" },
                                  { name: "Seamless", address: "0x0004...0005", apy: "7.88%" },
                                  { name: "Steakhouse", address: "0x0005...000c", apy: "7.24%" },
                                  { name: "Gauntlet Prime", address: "0x0006...0003", apy: "7.19%" },
                                  { name: "Clearstar OpenEden", address: "0x0007...000a", apy: "7.43%" },
                                  { name: "Gauntlet Core", address: "0x0008...0001", apy: "6.95%" },
                                  { name: "Smokehouse", address: "0x0009...0008", apy: "7.82%" },
                                  { name: "Spark", address: "0x000a...000f", apy: "5.67%" },
                                  { name: "Apostro Resolv", address: "0x000b...0006", apy: "7.76%" },
                                  { name: "Re7 Labs", address: "0x000c...000d", apy: "4.78%" },

                                  { name: "Universal USDC (Re7 Labs)", address: "0x000e...000f", apy: "3.55%" },
                                  { name: "Pyth USDC (Re7 Labs)", address: "0x000f...0010", apy: "4.93%" },
                                ];
                              } else if (selectedAutopilot.asset === 'ETH') {
                                return [
                                  { name: "Extrafi XLend ETH Vault (Gauntlet)", address: "0x0001...0000", apy: "4.25%" },
                                  { name: "Ionic Ecosystem ETH", address: "0x0002...0007", apy: "4.25%" },
                                  { name: "Moonwell Flagship ETH", address: "0x0003...000e", apy: "3.97%" },
                                  { name: "Seamless ETH", address: "0x0004...0005", apy: "3.94%" },
                                  { name: "Steakhouse ETH", address: "0x0005...000c", apy: "3.62%" },
                                  { name: "Gauntlet Prime ETH", address: "0x0006...0003", apy: "3.60%" },
                                  { name: "Clearstar OpenEden ETH", address: "0x0007...000a", apy: "3.72%" },
                                  { name: "Gauntlet Core ETH", address: "0x0008...0001", apy: "3.48%" },
                                  { name: "Smokehouse ETH", address: "0x0009...0008", apy: "3.91%" },
                                  { name: "Spark ETH", address: "0x000a...000f", apy: "2.84%" },
                                  { name: "Apostro Resolv ETH", address: "0x000b...0006", apy: "3.88%" },
                                  { name: "Re7 Labs ETH", address: "0x000c...000d", apy: "2.39%" },

                                  { name: "Universal ETH (Re7 Labs)", address: "0x000e...000f", apy: "1.78%" },
                                  { name: "Pyth ETH (Re7 Labs)", address: "0x000f...0010", apy: "2.47%" },
                                ];
                              } else { // cbBTC
                                return [
                                  { name: "Extrafi XLend cbBTC Vault (Gauntlet)", address: "0x0001...0000", apy: "2.13%" },
                                  { name: "Ionic Ecosystem cbBTC", address: "0x0002...0007", apy: "2.13%" },
                                  { name: "Moonwell Flagship cbBTC", address: "0x0003...000e", apy: "1.99%" },
                                  { name: "Seamless cbBTC", address: "0x0004...0005", apy: "1.97%" },
                                  { name: "Steakhouse cbBTC", address: "0x0005...000c", apy: "1.81%" },
                                  { name: "Gauntlet Prime cbBTC", address: "0x0006...0003", apy: "1.80%" },
                                  { name: "Clearstar OpenEden cbBTC", address: "0x0007...000a", apy: "1.86%" },
                                  { name: "Gauntlet Core cbBTC", address: "0x0008...0001", apy: "1.74%" },
                                  { name: "Smokehouse cbBTC", address: "0x0009...0008", apy: "1.96%" },
                                  { name: "Spark cbBTC", address: "0x000a...000f", apy: "1.42%" },
                                  { name: "Apostro Resolv cbBTC", address: "0x000b...0006", apy: "1.94%" },
                                  { name: "Re7 Labs cbBTC", address: "0x000c...000d", apy: "1.20%" },

                                  { name: "Universal cbBTC (Re7 Labs)", address: "0x000e...000f", apy: "0.89%" },
                                  { name: "Pyth cbBTC (Re7 Labs)", address: "0x000f...0010", apy: "1.23%" },
                                ];
                              }
                            } else { // euler
                              if (selectedAutopilot.asset === 'USDC') {
                                return [
                                  { name: "Euler Core USDC", address: "0x0001...0000", apy: "7.25%" },
                                  { name: "Euler Prime USDC", address: "0x0002...0007", apy: "6.98%" },
                                  { name: "Euler Max USDC", address: "0x0003...000e", apy: "6.45%" },
                                  { name: "Euler Base USDC", address: "0x0004...0005", apy: "6.12%" },
                                  { name: "Euler Safe USDC", address: "0x0005...000c", apy: "5.89%" },
                                  { name: "Euler Growth USDC", address: "0x0006...0003", apy: "6.67%" },
                                  { name: "Euler Stable USDC", address: "0x0007...000a", apy: "5.34%" },
                                  { name: "Euler Reserve USDC", address: "0x0008...0001", apy: "4.98%" },
                                  { name: "Euler Balance USDC", address: "0x0009...0008", apy: "5.76%" },
                                  { name: "Euler Conservative USDC", address: "0x000a...000f", apy: "4.23%" },
                                  { name: "Euler Basic USDC", address: "0x000b...0006", apy: "5.45%" },
                                ];
                              } else if (selectedAutopilot.asset === 'ETH') {
                                return [
                                  { name: "Euler Core ETH", address: "0x0001...0000", apy: "3.63%" },
                                  { name: "Euler Prime ETH", address: "0x0002...0007", apy: "3.49%" },
                                  { name: "Euler Max ETH", address: "0x0003...000e", apy: "3.23%" },
                                  { name: "Euler Base ETH", address: "0x0004...0005", apy: "3.06%" },
                                  { name: "Euler Safe ETH", address: "0x0005...000c", apy: "2.95%" },
                                  { name: "Euler Growth ETH", address: "0x0006...0003", apy: "3.34%" },
                                  { name: "Euler Stable ETH", address: "0x0007...000a", apy: "2.67%" },
                                  { name: "Euler Reserve ETH", address: "0x0008...0001", apy: "2.49%" },
                                  { name: "Euler Balance ETH", address: "0x0009...0008", apy: "2.88%" },
                                  { name: "Euler Conservative ETH", address: "0x000a...000f", apy: "2.12%" },
                                  { name: "Euler Basic ETH", address: "0x000b...0006", apy: "2.73%" },
                                ];
                              } else { // cbBTC
                                return [
                                  { name: "Euler Core cbBTC", address: "0x0001...0000", apy: "1.81%" },
                                  { name: "Euler Prime cbBTC", address: "0x0002...0007", apy: "1.75%" },
                                  { name: "Euler Max cbBTC", address: "0x0003...000e", apy: "1.61%" },
                                  { name: "Euler Base cbBTC", address: "0x0004...0005", apy: "1.53%" },
                                  { name: "Euler Safe cbBTC", address: "0x0005...000c", apy: "1.47%" },
                                  { name: "Euler Growth cbBTC", address: "0x0006...0003", apy: "1.67%" },
                                  { name: "Euler Stable cbBTC", address: "0x0007...000a", apy: "1.34%" },
                                  { name: "Euler Reserve cbBTC", address: "0x0008...0001", apy: "1.25%" },
                                  { name: "Euler Balance cbBTC", address: "0x0009...0008", apy: "1.44%" },
                                  { name: "Euler Conservative cbBTC", address: "0x000a...000f", apy: "1.06%" },
                                  { name: "Euler Basic cbBTC", address: "0x000b...0006", apy: "1.36%" },
                                ];
                              }
                            }
                          };

                          const allVaults = generateAllVaults();

                          return allVaults.map((vault, index) => (
                            <div key={vault.name} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-700">{vault.name}</div>
                              </div>
                              <div className="ml-3 flex-shrink-0 flex items-center space-x-2">
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                                  {vault.apy}
                                </span>
                                <span className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded border">
                                  {vault.address}
                                </span>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Deposit tab - always show regular content */}
              {activeTab === 'deposit' && (
                <div className="space-y-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Deposit Interface */}
                    <div className="w-full lg:w-[60%] bg-white rounded-xl p-6 border border-gray-100">
                      {/* Full Width Enter/Exit Toggle */}
                      <div className="relative bg-gray-100 rounded-2xl p-1 flex mb-6">
                        <div
                          className={`absolute top-1 h-[calc(100%-8px)] bg-white rounded-xl transition-all duration-300 ease-in-out ${
                            depositMode === 'enter' ? 'left-1 w-[calc(50%-4px)]' : 'left-[calc(50%+2px)] w-[calc(50%-4px)]'
                          }`}
                        ></div>

                        <button
                          onClick={() => setDepositMode('enter')}
                          className={`relative z-10 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 flex-1 ${
                            depositMode === 'enter'
                              ? 'text-green-600'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <Plus className={`w-4 h-4 transition-all duration-300 ${
                            depositMode === 'enter' ? 'scale-110' : 'scale-100'
                          }`} />
                          <span>Enter</span>
                        </button>

                        <button
                          onClick={() => setDepositMode('exit')}
                          className={`relative z-10 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 flex-1 ${
                            depositMode === 'exit'
                              ? 'text-green-600'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                          disabled={isNewUser}
                        >
                          <Minus className={`w-4 h-4 transition-all duration-300 ${
                            depositMode === 'exit' ? 'scale-110' : 'scale-100'
                          }`} />
                          <span>Exit</span>
                        </button>
                      </div>

                      {isNewUser && depositMode === 'exit' && (
                        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Info className="w-5 h-5 text-[#9159FF] flex-shrink-0" />
                            <div>
                              <h4 className="text-sm font-medium text-purple-900">No Balance to Withdraw</h4>
                              <p className="text-sm text-purple-700">You need to deposit {currentData.asset} first before you can withdraw.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Available Balance Section with Integrated Top-up */}
                      <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-1">
                              {depositMode === 'enter' ? 'Available in Wallet' : `${currentData.asset} in ${currentData.name} Autopilot`}
                            </p>
                            <div className="flex items-center space-x-2">
                              <img src={currentData.assetIcon} alt={currentData.asset} className="w-6 h-6" />
                              <span className="text-xl font-semibold text-gray-900">
                                {depositMode === 'enter'
                                  ? currentData.walletBalance.toLocaleString('en-US', {
                                      minimumFractionDigits: currentData.asset === 'USDC' ? 2 : 6,
                                      maximumFractionDigits: currentData.asset === 'USDC' ? 2 : 6
                                    })
                                  : isNewUser
                                  ? '0.00'
                                  : currentData.autopilotBalance.toLocaleString('en-US', {
                                      minimumFractionDigits: currentData.asset === 'USDC' ? 2 : 6,
                                      maximumFractionDigits: currentData.asset === 'USDC' ? 2 : 6
                                    })
                                } {currentData.asset}
                              </span>
                            </div>
                          </div>

                          {depositMode === 'enter' && (
                            <button
                              onClick={() => console.log('Top-up clicked')}
                              className="bg-[#9159FF] hover:bg-[#7c3aed] text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Top-up</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Amount Input */}
                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount to {depositMode === 'enter' ? 'Deposit' : 'Withdraw'}
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={depositAmount}
                              onChange={(e) => setDepositAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                              placeholder="0.00"
                              className="w-full p-4 pr-20 border border-gray-200 rounded-lg text-xl font-medium focus:ring-1 focus:ring-purple-300 focus:border-purple-400 transition-colors"
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                              <img src={currentData.assetIcon} alt={currentData.asset} className="w-5 h-5" />
                              <span className="text-sm font-medium text-gray-500">{currentData.asset}</span>
                            </div>
                          </div>
                        </div>

                        {/* Percentage Buttons */}
                        <div className="grid grid-cols-4 gap-3">
                          {[25, 50, 75, 100].map((percentage) => (
                            <button
                              key={percentage}
                              onClick={() => {
                                const balance = depositMode === 'enter' ? currentData.walletBalance : (isNewUser ? 0 : currentData.autopilotBalance);
                                const amount = (balance * percentage / 100).toFixed(currentData.asset === 'USDC' ? 2 : 6);
                                setDepositAmount(amount);
                              }}
                              className="py-2.5 px-3 bg-gray-100 hover:bg-purple-100 hover:text-purple-700 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                            >
                              {percentage}%
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Deposit Insurance - Added above supply button for Enter mode */}
                      {depositMode === 'enter' && (
                        <div className="mb-6 p-4 border border-purple-200 rounded-lg bg-purple-50">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              <Shield className="w-5 h-5 text-purple-600" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h3 className="text-sm font-medium text-gray-900">30-Day Deposit Protection</h3>
                                  <p className="text-xs text-gray-600 mt-1">
                                    Optional coverage for your deposit against smart contract risks
                                  </p>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">Powered by</span>
                                  <div className="flex items-center justify-center bg-blue-500/10 border border-blue-300/20 rounded-md px-3 py-1.5 h-8">
                                    <img src="/projects/openCover.png" alt="OpenCover" className="h-4 w-auto" />
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={insuranceEnabled}
                                      onChange={(e) => setInsuranceEnabled(e.target.checked)}
                                      className="w-4 h-4 text-purple-600 bg-white border-2 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 checked:bg-purple-600 checked:border-purple-600 transition-all"
                                    />
                                    <span className="text-sm text-gray-700">Enable protection</span>
                                  </label>

                                  <div className="group relative">
                                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                                    <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-1 text-xs text-white bg-gray-900 rounded-md shadow-lg -translate-x-1/2 left-1/2">
                                      Covers up to 100% of your deposit against smart contract vulnerabilities and protocol risks for 30 days.
                                    </div>
                                  </div>
                                </div>

                                {depositAmount && parseFloat(depositAmount) > 0 && (
                                  <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900">
                                      {(parseFloat(depositAmount) * 0.0024).toLocaleString('en-US', {
                                        minimumFractionDigits: currentData.asset === 'USDC' ? 2 : 6,
                                        maximumFractionDigits: currentData.asset === 'USDC' ? 2 : 6
                                      })} {currentData.asset}
                                    </div>
                                    <div className="text-xs text-gray-500">Coverage cost (0.24%)</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Supply Button with Dynamic Text */}
                      <button
                        onClick={() => {
                          if (isNewUser && depositMode === 'enter') {
                            setShowTermsModal(true);
                            return;
                          }
                          if (!depositAmount) return;
                          console.log(`${depositMode === 'enter' ? 'Depositing' : 'Withdrawing'} ${depositAmount} ${currentData.asset}`);
                          setDepositAmount('');
                          setInsuranceEnabled(false);
                        }}
                        disabled={isNewUser && depositMode === 'exit'}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-4 rounded-lg transition-colors text-lg"
                      >
                        {(() => {
                          if (isNewUser && depositMode === 'enter') {
                            return 'Accept Terms of Use';
                          }

                          const amount = parseFloat(depositAmount);
                          const hasAmount = amount > 0;

                          if (depositMode === 'enter') {
                            if (insuranceEnabled && hasAmount) {
                              return `Supply ${amount.toLocaleString('en-US', {
                                minimumFractionDigits: currentData.asset === 'USDC' ? 2 : 4,
                                maximumFractionDigits: currentData.asset === 'USDC' ? 2 : 4
                              })} ${currentData.asset} & Pay Insurance`;
                            } else if (hasAmount) {
                              return `Supply ${amount.toLocaleString('en-US', {
                                minimumFractionDigits: currentData.asset === 'USDC' ? 2 : 4,
                                maximumFractionDigits: currentData.asset === 'USDC' ? 2 : 4
                              })} ${currentData.asset}`;
                            } else {
                              return `Supply ${currentData.asset}`;
                            }
                          } else {
                            if (hasAmount) {
                              return `Withdraw ${amount.toLocaleString('en-US', {
                                minimumFractionDigits: currentData.asset === 'USDC' ? 2 : 4,
                                maximumFractionDigits: currentData.asset === 'USDC' ? 2 : 4
                              })} ${currentData.asset}`;
                            } else {
                              return `Withdraw ${currentData.asset}`;
                            }
                          }
                        })()}
                      </button>
                    </div>

                    {/* Right: Transaction Preview + Info Cards */}
                    <div className="w-full lg:w-[40%] space-y-6">
                      {/* Transaction Preview */}
                      <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Preview</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              {depositMode === 'enter' ? 'Deposit Amount' : 'Withdrawal Amount'}
                            </span>
                            <span className="font-medium">{depositAmount || '0.00'} {currentData.asset}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Current APY</span>
                            <span className="font-medium text-green-600">{(currentData.currentAPY * 100).toFixed(2)}%</span>
                          </div>
                          {depositMode === 'enter' && insuranceEnabled && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Insurance Cost</span>
                              <span className="font-medium text-purple-600">
                                {(parseFloat(depositAmount || '0') * 0.0024).toLocaleString('en-US', {
                                  minimumFractionDigits: currentData.asset === 'USDC' ? 2 : 6,
                                  maximumFractionDigits: currentData.asset === 'USDC' ? 2 : 6
                                })} {currentData.asset}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              {depositMode === 'enter' ? 'Entry Fee' : 'Exit Fee'}
                            </span>
                            <span className="font-medium">$0.00</span>
                          </div>

                          {depositMode === 'enter' ? (
                            <div className="border-t border-gray-100 pt-3 space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Est. Yearly Earnings</span>
                                <span className="font-medium text-green-600 tabular-nums">
                                  +{(parseFloat(depositAmount || '0') * currentData.currentAPY).toLocaleString('en-US', {
                                    minimumFractionDigits: currentData.asset === 'USDC' ? 2 : 6,
                                    maximumFractionDigits: currentData.asset === 'USDC' ? 2 : 6
                                  })} {currentData.asset}
                                </span>
                              </div>

                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center space-x-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-700">Yearly Advantage</span>
                                  </div>
                                  <span className="font-semibold text-green-600 tabular-nums">
                                    {parseFloat(depositAmount || '0') > 0 ? (
                                      `+${(parseFloat(depositAmount || '0') * (currentData.currentAPY - currentData.secondBestAPY)).toLocaleString('en-US', {
                                        minimumFractionDigits: currentData.asset === 'USDC' ? 2 : 6,
                                        maximumFractionDigits: currentData.asset === 'USDC' ? 2 : 6
                                      })} ${currentData.asset}`
                                    ) : (
                                      <span className="text-sm font-medium text-green-700">Enter amount to see benefit</span>
                                    )}
                                  </span>
                                </div>
                                <p className="text-xs text-green-600">vs. Best {currentData.name} Vault{insuranceEnabled ? ' (after insurance cost)' : ''}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="border-t border-gray-100 pt-3 space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Remaining Balance</span>
                                <span className="font-medium text-gray-900 tabular-nums">
                                  {Math.max(0, (isNewUser ? 0 : currentData.autopilotBalance) - parseFloat(depositAmount || '0')).toLocaleString('en-US', {
                                    minimumFractionDigits: currentData.asset === 'USDC' ? 2 : 6,
                                    maximumFractionDigits: currentData.asset === 'USDC' ? 2 : 6
                                  })} {currentData.asset}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Forfeited Yearly Earnings</span>
                                <span className="font-medium text-amber-600 tabular-nums">
                                  -{(parseFloat(depositAmount || '0') * currentData.currentAPY).toLocaleString('en-US', {
                                    minimumFractionDigits: currentData.asset === 'USDC' ? 2 : 6,
                                    maximumFractionDigits: currentData.asset === 'USDC' ? 2 : 6
                                  })} {currentData.asset}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {depositMode === 'enter' && (
                          <div className="mt-4 pt-3">
                            <p className="text-xs text-gray-500">
                              *Based on 30-day <button
                                onClick={handleOpenBenchmark}
                                className="text-xs text-purple-600 hover:text-purple-700 underline decoration-dotted underline-offset-2 transition-colors"
                              >
                                Benchmark
                              </button> APY data
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Info Cards */}
                      <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                          <div className="flex items-start space-x-3">
                            <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-green-900 mb-1">Audited &amp; Secure</h4>
                              <p className="text-sm text-green-700">
                                Smart contracts have been audited by leading security firms
                              </p>
                            </div>
                          </div>
                        </div>

                        {depositMode === 'enter' && (
                          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                            <div className="flex items-start space-x-3">
                              <ExternalLink className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-semibold mb-1 text-purple-900">Exit Anytime</h4>
                                <p className="text-sm text-purple-700">
                                  Withdraw your funds at any time with no lock-up periods
                                </p>
                              </div>
                            </div>
                          </div>
                        )}


                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Benchmark tab - always show regular content */}
              {activeTab === 'benchmark' && (
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Performance Comparison</h3>
                      <p className="text-sm text-gray-600">Autopilot vs. standalone Morpho vaults</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(() => {
                      const generateBenchmarkData = () => {
                        if (selectedAutopilot.protocol === 'morpho') {
                          if (selectedAutopilot.asset === 'USDC') {
                            return [
                              { name: "Autopilot", description: "Smart Yield Router", apy: 8.75, isAutopilot: true },
                              { name: "Extrafi XLend USDC Vault (Gauntlet)", description: "Morpho Vault", apy: 8.50, isAutopilot: false },
                              { name: "Ionic Ecosystem", description: "Morpho Vault", apy: 8.50, isAutopilot: false },
                              { name: "Moonwell Flagship", description: "Morpho Vault", apy: 7.94, isAutopilot: false },
                              { name: "Seamless", description: "Morpho Vault", apy: 7.88, isAutopilot: false },
                              { name: "Smokehouse", description: "Morpho Vault", apy: 7.82, isAutopilot: false },
                              { name: "Apostro Resolv", description: "Morpho Vault", apy: 7.76, isAutopilot: false },
                              { name: "Clearstar OpenEden", description: "Morpho Vault", apy: 7.43, isAutopilot: false },
                              { name: "Steakhouse", description: "Morpho Vault", apy: 7.24, isAutopilot: false },
                              { name: "Gauntlet Prime", description: "Morpho Vault", apy: 7.19, isAutopilot: false },
                              { name: "Gauntlet Core", description: "Morpho Vault", apy: 6.95, isAutopilot: false },
                              { name: "Spark", description: "Morpho Vault", apy: 5.67, isAutopilot: false },
                              { name: "Pyth USDC (Re7 Labs)", description: "Morpho Vault", apy: 4.93, isAutopilot: false },
                              { name: "Re7 Labs", description: "Morpho Vault", apy: 4.78, isAutopilot: false },
                              { name: "Universal USDC (Re7 Labs)", description: "Morpho Vault", apy: 3.55, isAutopilot: false },
                            ];
                          } else if (selectedAutopilot.asset === 'ETH') {
                            return [
                              { name: "Autopilot", description: "Smart Yield Router", apy: 4.38, isAutopilot: true },
                              { name: "Extrafi XLend ETH Vault (Gauntlet)", description: "Morpho Vault", apy: 4.25, isAutopilot: false },
                              { name: "Ionic Ecosystem ETH", description: "Morpho Vault", apy: 4.25, isAutopilot: false },
                              { name: "Moonwell Flagship ETH", description: "Morpho Vault", apy: 3.97, isAutopilot: false },
                              { name: "Seamless ETH", description: "Morpho Vault", apy: 3.94, isAutopilot: false },
                              { name: "Smokehouse ETH", description: "Morpho Vault", apy: 3.91, isAutopilot: false },
                              { name: "Apostro Resolv ETH", description: "Morpho Vault", apy: 3.88, isAutopilot: false },
                              { name: "Clearstar OpenEden ETH", description: "Morpho Vault", apy: 3.72, isAutopilot: false },
                              { name: "Steakhouse ETH", description: "Morpho Vault", apy: 3.62, isAutopilot: false },
                              { name: "Gauntlet Prime ETH", description: "Morpho Vault", apy: 3.60, isAutopilot: false },
                              { name: "Gauntlet Core ETH", description: "Morpho Vault", apy: 3.48, isAutopilot: false },
                              { name: "Spark ETH", description: "Morpho Vault", apy: 2.84, isAutopilot: false },
                              { name: "Pyth ETH (Re7 Labs)", description: "Morpho Vault", apy: 2.47, isAutopilot: false },
                              { name: "Re7 Labs ETH", description: "Morpho Vault", apy: 2.39, isAutopilot: false },
                              { name: "Universal ETH (Re7 Labs)", description: "Morpho Vault", apy: 1.78, isAutopilot: false },
                            ];
                          } else { // cbBTC
                            return [
                              { name: "Autopilot", description: "Smart Yield Router", apy: 2.19, isAutopilot: true },
                              { name: "Extrafi XLend cbBTC Vault (Gauntlet)", description: "Morpho Vault", apy: 2.13, isAutopilot: false },
                              { name: "Ionic Ecosystem cbBTC", description: "Morpho Vault", apy: 2.13, isAutopilot: false },
                              { name: "Moonwell Flagship cbBTC", description: "Morpho Vault", apy: 1.99, isAutopilot: false },
                              { name: "Seamless cbBTC", description: "Morpho Vault", apy: 1.97, isAutopilot: false },
                              { name: "Smokehouse cbBTC", description: "Morpho Vault", apy: 1.96, isAutopilot: false },
                              { name: "Apostro Resolv cbBTC", description: "Morpho Vault", apy: 1.94, isAutopilot: false },
                              { name: "Clearstar OpenEden cbBTC", description: "Morpho Vault", apy: 1.86, isAutopilot: false },
                              { name: "Steakhouse cbBTC", description: "Morpho Vault", apy: 1.81, isAutopilot: false },
                              { name: "Gauntlet Prime cbBTC", description: "Morpho Vault", apy: 1.80, isAutopilot: false },
                              { name: "Gauntlet Core cbBTC", description: "Morpho Vault", apy: 1.74, isAutopilot: false },
                              { name: "Spark cbBTC", description: "Morpho Vault", apy: 1.42, isAutopilot: false },
                              { name: "Pyth cbBTC (Re7 Labs)", description: "Morpho Vault", apy: 1.23, isAutopilot: false },
                              { name: "Re7 Labs cbBTC", description: "Morpho Vault", apy: 1.20, isAutopilot: false },
                              { name: "Universal cbBTC (Re7 Labs)", description: "Morpho Vault", apy: 0.89, isAutopilot: false },
                            ];
                          }
                        } else { // euler
                          if (selectedAutopilot.asset === 'USDC') {
                            return [
                              { name: "Autopilot", description: "Smart Yield Router", apy: 7.35, isAutopilot: true },
                              { name: "Euler Core USDC", description: "Euler Vault", apy: 7.25, isAutopilot: false },
                              { name: "Euler Prime USDC", description: "Euler Vault", apy: 6.98, isAutopilot: false },
                              { name: "Euler Growth USDC", description: "Euler Vault", apy: 6.67, isAutopilot: false },
                              { name: "Euler Max USDC", description: "Euler Vault", apy: 6.45, isAutopilot: false },
                              { name: "Euler Base USDC", description: "Euler Vault", apy: 6.12, isAutopilot: false },
                              { name: "Euler Safe USDC", description: "Euler Vault", apy: 5.89, isAutopilot: false },
                              { name: "Euler Balance USDC", description: "Euler Vault", apy: 5.76, isAutopilot: false },
                              { name: "Euler Basic USDC", description: "Euler Vault", apy: 5.45, isAutopilot: false },
                              { name: "Euler Stable USDC", description: "Euler Vault", apy: 5.34, isAutopilot: false },
                              { name: "Euler Reserve USDC", description: "Euler Vault", apy: 4.98, isAutopilot: false },
                              { name: "Euler Conservative USDC", description: "Euler Vault", apy: 4.23, isAutopilot: false },
                            ];
                          } else if (selectedAutopilot.asset === 'ETH') {
                            return [
                              { name: "Autopilot", description: "Smart Yield Router", apy: 3.73, isAutopilot: true },
                              { name: "Euler Core ETH", description: "Euler Vault", apy: 3.63, isAutopilot: false },
                              { name: "Euler Prime ETH", description: "Euler Vault", apy: 3.49, isAutopilot: false },
                              { name: "Euler Growth ETH", description: "Euler Vault", apy: 3.34, isAutopilot: false },
                              { name: "Euler Max ETH", description: "Euler Vault", apy: 3.23, isAutopilot: false },
                              { name: "Euler Base ETH", description: "Euler Vault", apy: 3.06, isAutopilot: false },
                              { name: "Euler Safe ETH", description: "Euler Vault", apy: 2.95, isAutopilot: false },
                              { name: "Euler Balance ETH", description: "Euler Vault", apy: 2.88, isAutopilot: false },
                              { name: "Euler Basic ETH", description: "Euler Vault", apy: 2.73, isAutopilot: false },
                              { name: "Euler Stable ETH", description: "Euler Vault", apy: 2.67, isAutopilot: false },
                              { name: "Euler Reserve ETH", description: "Euler Vault", apy: 2.49, isAutopilot: false },
                              { name: "Euler Conservative ETH", description: "Euler Vault", apy: 2.12, isAutopilot: false },
                            ];
                          } else { // cbBTC
                            return [
                              { name: "Autopilot", description: "Smart Yield Router", apy: 1.86, isAutopilot: true },
                              { name: "Euler Core cbBTC", description: "Euler Vault", apy: 1.81, isAutopilot: false },
                              { name: "Euler Prime cbBTC", description: "Euler Vault", apy: 1.75, isAutopilot: false },
                              { name: "Euler Growth cbBTC", description: "Euler Vault", apy: 1.67, isAutopilot: false },
                              { name: "Euler Max cbBTC", description: "Euler Vault", apy: 1.61, isAutopilot: false },
                              { name: "Euler Base cbBTC", description: "Euler Vault", apy: 1.53, isAutopilot: false },
                              { name: "Euler Safe cbBTC", description: "Euler Vault", apy: 1.47, isAutopilot: false },
                              { name: "Euler Balance cbBTC", description: "Euler Vault", apy: 1.44, isAutopilot: false },
                              { name: "Euler Basic cbBTC", description: "Euler Vault", apy: 1.36, isAutopilot: false },
                              { name: "Euler Stable cbBTC", description: "Euler Vault", apy: 1.34, isAutopilot: false },
                              { name: "Euler Reserve cbBTC", description: "Euler Vault", apy: 1.25, isAutopilot: false },
                              { name: "Euler Conservative cbBTC", description: "Euler Vault", apy: 1.06, isAutopilot: false },
                            ];
                          }
                        }
                      };

                      const benchmarkData = generateBenchmarkData();

                      return benchmarkData.map((item, index) => (
                        <div key={item.name} className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                          item.isAutopilot
                            ? 'bg-green-50 border-green-200 hover:bg-green-100'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                item.isAutopilot
                                  ? 'bg-green-600'
                                  : 'bg-gray-100 border border-gray-200'
                              }`}>
                                <span className={`text-sm font-bold ${
                                  item.isAutopilot ? 'text-white' : 'text-gray-600'
                                }`}>
                                  {index + 1}
                                </span>
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h4 className={`font-semibold ${item.isAutopilot ? 'text-green-900' : 'text-gray-900'}`}>
                                    {item.name}
                                  </h4>
                                  {item.isAutopilot && (
                                    <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                      AUTO
                                    </span>
                                  )}
                                </div>
                                <p className={`text-sm ${item.isAutopilot ? 'text-green-700' : 'text-gray-600'}`}>
                                  {item.description}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-bold ${item.isAutopilot ? 'text-green-600' : 'text-gray-900'}`}>
                                {item.apy.toFixed(2)}%
                              </div>
                              <div className="text-xs text-gray-500">30d APY</div>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Terms Modal */}
        <TermsModal />
      </div>
    </TooltipProvider>
  );
}