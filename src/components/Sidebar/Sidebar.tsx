"use client"
import { TrendingUp, ChevronDown, BarChart3, Circle, X, Eye, User, UserCheck, Users } from "lucide-react";
import { useState } from "react";
import { AutopilotProduct, AutopilotProtocol, AutopilotAsset, UserState } from "../../app/page"
import { AutopilotIcon } from "./AutopilotIcon";

interface SidebarProps {
  selectedAutopilot: AutopilotProduct;
  onAutopilotChange: (autopilot: AutopilotProduct) => void;
  isOpen?: boolean;
  onClose?: () => void;
  userState?: UserState;
  onUserStateChange?: (state: UserState) => void;
  currentView?: string; // Add current view prop to track active state
}

export default function Sidebar({
  selectedAutopilot,
  onAutopilotChange,
  isOpen = true,
  onClose,
  userState = 'active',
  onUserStateChange,
  currentView = 'dashboard'
}: SidebarProps) {
  const [morphoExpanded, setMorphoExpanded] = useState(true);
  const [eulerExpanded, setEulerExpanded] = useState(true);
  const [viewAsDropdownOpen, setViewAsDropdownOpen] = useState(false);

  // Updated APY rates based on new benchmark data where Autopilot exceeds standalone vaults
  const morphoOptions = [
    { asset: 'USDC' as const, apy: 8.75, icon: "/coins/usdc.png" }, // Morpho USDC Autopilot APY
    { asset: 'ETH' as const, apy: 4.38, icon: "/coins/eth.png" },   // Morpho ETH Autopilot APY
    { asset: 'cbBTC' as const, apy: 2.19, icon: "/coins/cbBTC.png" }, // Morpho cbBTC Autopilot APY
  ];

  const eulerOptions = [
    { asset: 'USDC' as const, apy: 7.35, icon: "/coins/usdc.png" }, // Euler USDC Autopilot APY
    { asset: 'ETH' as const, apy: 3.73, icon: "/coins/eth.png" },   // Euler ETH Autopilot APY
    { asset: 'cbBTC' as const, apy: 1.86, icon: "/coins/cbBTC.png" }, // Euler cbBTC Autopilot APY
  ];

  const handleAutopilotChange = (autopilot: AutopilotProduct) => {
    onAutopilotChange(autopilot);
    // Close mobile sidebar when selection is made
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };

  const handlePortfolioClick = (view?: string) => {
    // Close mobile sidebar when portfolio is clicked
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };

  const getUserStateIcon = (state: UserState) => {
    switch (state) {
      case 'new': return User;
      case 'active': return UserCheck;
      case 'old': return Users;
      default: return UserCheck;
    }
  };

  const getUserStateLabel = (state: UserState) => {
    switch (state) {
      case 'new': return 'New User';
      case 'active': return 'Active User';
      case 'old': return 'Old User';
      default: return 'Active User';
    }
  };

  const getUserStateDescription = (state: UserState) => {
    switch (state) {
      case 'new': return 'First-time user experience';
      case 'active': return 'Standard user experience';
      case 'old': return 'Long-term user view';
      default: return 'Standard user experience';
    }
  };

  // User State Dropdown Component
  const UserStateDropdown = () => {
    const CurrentStateIcon = getUserStateIcon(userState);

    return (
      <div className="relative">
        <button
          onClick={() => setViewAsDropdownOpen(!viewAsDropdownOpen)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Eye className="w-4 h-4 text-gray-600" />
            <div className="text-left">
              <div className="text-sm font-medium text-gray-700">View as</div>
              <div className="flex items-center space-x-2">
                <CurrentStateIcon className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-500">{getUserStateLabel(userState)}</span>
              </div>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${viewAsDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {viewAsDropdownOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {(['new', 'active', 'old'] as const).map((state) => {
              const IconComponent = getUserStateIcon(state);
              const isSelected = userState === state;
              const isDisabled = state === 'old';

              return (
                <button
                  key={state}
                  onClick={() => {
                    if (!isDisabled && onUserStateChange) {
                      onUserStateChange(state);
                      setViewAsDropdownOpen(false);
                    }
                  }}
                  disabled={isDisabled}
                  className={`w-full flex items-center space-x-3 p-3 text-left transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    isSelected
                      ? 'bg-blue-50 text-blue-900'
                      : isDisabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <IconComponent className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{getUserStateLabel(state)}</div>
                    <div className="text-xs opacity-75">{getUserStateDescription(state)}</div>
                  </div>
                  {isDisabled && (
                    <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded">
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Mobile sidebar
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose} />
        )}

        {/* Mobile Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Mobile Header with Close Button */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <button
                // onClick={onNavigateHome}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <AutopilotIcon className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Autopilot</h1>
                  <p className="text-sm text-gray-600">Smart yield optimization</p>
                </div>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Navigation Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-6">

                {/* Portfolio Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Portfolio</h3>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handlePortfolioClick()}
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors cursor-pointer shadow-lg hover:shadow-xl ${
                        currentView === 'portfolio'
                          ? 'bg-[#9159FF] text-white hover:bg-[#7c3aed]'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        currentView === 'portfolio'
                          ? 'bg-[#8b5cf6]'
                          : 'bg-white border border-gray-200'
                      }`}>
                        <BarChart3 className={`w-4 h-4 ${
                          currentView === 'portfolio' ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">Positions</div>
                        <div className={`text-xs ${
                          currentView === 'portfolio' ? 'text-purple-100' : 'text-gray-500'
                        }`}>View all holdings</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handlePortfolioClick('earnings')}
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors cursor-pointer shadow-lg hover:shadow-xl ${
                        currentView === 'earnings'
                          ? 'bg-[#9159FF] text-white hover:bg-[#7c3aed]'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        currentView === 'earnings'
                          ? 'bg-[#8b5cf6]'
                          : 'bg-white border border-gray-200'
                      }`}>
                        <TrendingUp className={`w-4 h-4 ${
                          currentView === 'earnings' ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">Earnings</div>
                        <div className={`text-xs ${
                          currentView === 'earnings' ? 'text-purple-100' : 'text-gray-500'
                        }`}>Full History</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Morpho Autopilot Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <img src={"/projects/morpho.png"} alt="Morpho" className="w-4 h-4" />
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Morpho Autopilot</h3>
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
                      {morphoOptions.map((option) => (
                        <button
                          key={option.asset}
                          onClick={() => handleAutopilotChange({ protocol: 'morpho', asset: option.asset })}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                            selectedAutopilot.protocol === 'morpho' && selectedAutopilot.asset === option.asset && currentView === 'dashboard'
                              ? 'bg-purple-50 border border-purple-200'
                              : 'hover:bg-purple-50/50'
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
                </div>

                {/* Euler Autopilot Section */}
                <div>
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
                      {eulerOptions.map((option) => (
                        <button
                          key={option.asset}
                          onClick={() => handleAutopilotChange({ protocol: 'euler', asset: option.asset })}
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
                </div>
              </div>
            </div>

            {/* Footer with User State Dropdown */}
            <div className="p-4 border-t border-gray-100">
              <UserStateDropdown />
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
        <button
        //   onClick={onNavigateHome}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <img src={"/logo.png"} alt="Autopilot" className="h-10 w-auto" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">

          {/* Portfolio Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Portfolio</h3>
            </div>

            <div className="space-y-2">
              <button
                // onClick={() => onNavigateToPortfolio && onNavigateToPortfolio()}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 cursor-pointer transform hover:scale-[1.02] ${
                  currentView === 'portfolio'
                    ? 'border-2 border-[#9159FF]/20 bg-[#9159FF]/5 hover:bg-[#9159FF]/10 hover:border-[#9159FF]/30'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  currentView === 'portfolio'
                    ? 'bg-white border border-[#9159FF]/20'
                    : 'bg-white border border-gray-200'
                }`}>
                  <BarChart3 className={`w-4 h-4 ${
                    currentView === 'portfolio' ? 'text-[#9159FF]' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">Positions</div>
                  <div className="text-xs text-gray-500">View all holdings</div>
                </div>
              </button>

              <button
                // onClick={() => onNavigateToPortfolio && onNavigateToPortfolio('earnings')}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 cursor-pointer transform hover:scale-[1.02] ${
                  currentView === 'earnings'
                    ? 'border-2 border-[#9159FF]/20 bg-[#9159FF]/5 hover:bg-[#9159FF]/10 hover:border-[#9159FF]/30'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  currentView === 'earnings'
                    ? 'bg-white border border-[#9159FF]/20'
                    : 'bg-white border border-gray-200'
                }`}>
                  <TrendingUp className={`w-4 h-4 ${
                    currentView === 'earnings' ? 'text-[#9159FF]' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">Earnings</div>
                  <div className="text-xs text-gray-500">Full History</div>
                </div>
              </button>
            </div>
          </div>

          {/* Morpho Autopilot Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <img src={"/projects/morpho.png"} alt="Morpho" className="w-4 h-4" />
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Morpho Autopilots</h3>
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
                {morphoOptions.map((option) => (
                  <button
                    key={option.asset}
                    onClick={() => onAutopilotChange({ protocol: 'morpho', asset: option.asset })}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                      selectedAutopilot.protocol === 'morpho' && selectedAutopilot.asset === option.asset && currentView === 'dashboard'
                        ? 'bg-purple-50 border border-purple-200'
                        : 'hover:bg-purple-50/50'
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
          </div>

          {/* Euler Autopilot Section */}
          <div className="hidden">
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
          </div>
        </div>
      </div>

      {/* Footer with User State Dropdown */}
      <div className="p-6 border-t border-gray-100">
        <UserStateDropdown />
      </div>
    </div>
  );
}