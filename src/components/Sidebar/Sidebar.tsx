"use client"
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { TrendingUp, ChevronDown, BarChart3, Circle, X, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { AutopilotIcon } from "./AutopilotIcon";
import { useContext } from "react";
import { GlobalContext } from "@/providers/GlobalDataProvider";
import { ConnectWalletButton } from "../ConnectWalletButton/ConnectWalletButton";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [morphoExpanded, setMorphoExpanded] = useState(true);
  const [eulerExpanded, setEulerExpanded] = useState(true);
  const [url, setUrl] = useState<string>();
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { availableAutopilots } = useContext(GlobalContext);
  const morphoOptions = availableAutopilots.filter(option => option.protocol === "morpho");
  const eulerOptions = availableAutopilots.filter(option => option.protocol === "euler");

  const closeSidebar = () => {
    setIsOpen(false);
  }

  const openSidebar = () => {
    setIsOpen(true);
  }

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

  // Mobile sidebar
  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen ?
          <div className="fixed inset-0 bg-black opacity-50 z-40 md:hidden" onClick={closeSidebar} />
          :
          <button
            onClick={openSidebar}
            className="fixed top-[24.5px] left-[21px] z-[10000] rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        }

        {/* Mobile Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Mobile Header with Close Button */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <AutopilotIcon className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Autopilot</h1>
                  <p className="text-sm text-gray-600">Smart yield optimization</p>
                </div>
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

                {/* Portfolio Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Portfolio</h3>
                  </div>

                  <div className="space-y-2">
                    <Link
                      href="/"
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors cursor-pointer shadow-lg hover:shadow-xl ${
                        pathname === '/'
                          ? 'bg-[#9159FF] text-white hover:bg-[#7c3aed]'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        pathname === '/'
                          ? 'bg-[#8b5cf6]'
                          : 'bg-white border border-gray-200'
                      }`}>
                        <BarChart3 className={`w-4 h-4 ${
                          pathname === '/' ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">Positions</div>
                        <div className={`text-xs ${
                          pathname === '/' ? 'text-purple-100' : 'text-gray-500'
                        }`}>View all holdings</div>
                      </div>
                    </Link>

                    <Link
                      href="/earnings"
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors cursor-pointer shadow-lg hover:shadow-xl ${
                        pathname === '/earnings'
                          ? 'bg-[#9159FF] text-white hover:bg-[#7c3aed]'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        pathname === '/earnings'
                          ? 'bg-[#8b5cf6]'
                          : 'bg-white border border-gray-200'
                      }`}>
                        <TrendingUp className={`w-4 h-4 ${
                          pathname === '/earnings' ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">Earnings</div>
                        <div className={`text-xs ${
                          pathname === '/earnings' ? 'text-purple-100' : 'text-gray-500'
                        }`}>Full History</div>
                      </div>
                    </Link>
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
                      {morphoOptions.map((option) => {
                        const route = `/base/morpho/${option.asset}`;
                        return(
                          <Link
                            href={route}
                            key={option.asset}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                              url === route
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
                          </Link>
                        )
                      })}
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
                </div>
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
        <Link
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <img src={"/logo.png"} alt="Autopilot" className="h-10 w-auto" />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <ConnectWalletButton/>

          {/* Portfolio Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Portfolio</h3>
            </div>

            <div className="space-y-2">
              <Link
                href={"/"}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors transition-transform duration-200 cursor-pointer transform hover:scale-[1.02] ${
                  url === '/'
                    ? 'border-2 border-[#9159FF]/20 bg-[#9159FF]/5 hover:bg-[#9159FF]/10 hover:border-[#9159FF]/30'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  url === '/'
                    ? 'bg-white border border-[#9159FF]/20'
                    : 'bg-white border border-gray-200'
                }`}>
                  <BarChart3 className={`w-4 h-4 ${
                    url === '/' ? 'text-[#9159FF]' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">Positions</div>
                  <div className="text-xs text-gray-500">View all holdings</div>
                </div>
              </Link>

              <Link
                href="/earnings"
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors transition-transform duration-200 cursor-pointer transform hover:scale-[1.02] ${
                  url === '/earnings'
                    ? 'border-2 border-[#9159FF]/20 bg-[#9159FF]/5 hover:bg-[#9159FF]/10 hover:border-[#9159FF]/30'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  url === '/earnings'
                    ? 'bg-white border border-[#9159FF]/20'
                    : 'bg-white border border-gray-200'
                }`}>
                  <TrendingUp className={`w-4 h-4 ${
                    url === '/earnings' ? 'text-[#9159FF]' : 'text-gray-600'
                  }`} />
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
                {morphoOptions.map((option) => {
                  const route = `/base/morpho/${option.asset}`
                  return(
                    <Link
                      href={route}
                      key={option.asset}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                        url === route
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
                        <span className="text-xs text-green-600 font-medium">{option.apy.toFixed(2)}%</span>
                      </div>
                    </Link>
                  )
                })}
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
                        <span className="text-xs text-green-600 font-medium">{option.apy.toFixed(2)}%</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}