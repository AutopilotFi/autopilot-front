'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useContext } from 'react';
import { GlobalContext } from '@/providers/GlobalDataProvider';
import SidebarContent from './SidebarContent';
import { SideBarOptions } from '@/types/globalAppTypes';
import clsx from 'clsx';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { availableAutopilots, isMobile, isDarkMode, setIsDarkMode } = useContext(GlobalContext);
  // const morphoOptions = availableAutopilots.filter(option => option.protocol === 'morpho');
  // const eulerOptions = availableAutopilots.filter(option => option.protocol === 'euler');
  const baseOptions = availableAutopilots.filter(option => option.vault.chain === '8453');
  const sidebarOptions: SideBarOptions = [
    {
      name: 'BASE AUTOPILOTS',
      icon: '/chains/base.png',
      options:
        baseOptions.length > 0
          ? [
              ...baseOptions,
              {
                ...baseOptions[0],
                asset: 'ETH',
                icon: '/icons/eth.svg',
              },
              {
                ...baseOptions[0],
                asset: 'cbBTC',
                icon: '/icons/cbbtc.svg',
              },
            ]
          : [],
    },
  ];

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const openSidebar = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    closeSidebar();
  }, [pathname]);

  useEffect(() => {
    if (isMobile) {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, isMobile]);

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
            className="fixed top-[29.8px] left-[21px] z-[10000] rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out md:hidden border-r ${
            isDarkMode ? 'border-gray-700' : 'bg-white border-gray-100'
          } ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={isDarkMode ? { backgroundColor: '#1f2937' } : {}}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Header with Close Button */}
            <div
              className={`p-4 border-b flex items-center justify-between ${
                isDarkMode ? 'border-gray-700' : 'border-gray-100'
              }`}
            >
              <Link
                href="/"
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <Image
                  width={136}
                  height={35}
                  src={isDarkMode ? '/logo-white.png' : '/logo.png'}
                  alt="Autopilot"
                  className="h-10 w-auto"
                />
              </Link>
              <button
                onClick={closeSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>

            {/* Navigation Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 pt-4 space-y-6 flex flex-col h-full">
                <SidebarContent
                  options={sidebarOptions}
                  pathname={pathname}
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
                  isMobile={isMobile}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div
      className={clsx(
        'hidden md:flex fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-100 flex-col min-h-screen',
        isDarkMode ? "border-gray-700'" : 'bg-white border-gray-100'
      )}
      style={isDarkMode ? { backgroundColor: '#1f2937' } : {}}
    >
      {/* Header */}
      <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <Link href={'/'} className="flex items-center hover:opacity-80 transition-opacity">
          <Image
            width={136}
            height={35}
            src={isDarkMode ? '/logo-white.png' : '/logo.png'}
            alt="Autopilot"
            className="h-10 w-auto"
          />
        </Link>
      </div>

      {/* Navigation */}
      <div className="h-full px-6 pt-6 overflow-y-auto">
        <div className="flex flex-col h-full space-y-6">
          <SidebarContent
            options={sidebarOptions}
            pathname={pathname}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  );
}
