'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useContext } from 'react';
import { GlobalContext } from '@/providers/GlobalDataProvider';
import SidebarContent from './SidebarContent';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { availableAutopilots, isMobile } = useContext(GlobalContext);
  const morphoOptions = availableAutopilots.filter(option => option.protocol === 'morpho');
  const eulerOptions = availableAutopilots.filter(option => option.protocol === 'euler');

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const openSidebar = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    closeSidebar();
  }, [pathname]);

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
              <div className="px-4 pt-4 space-y-6 flex flex-col h-full">
                <SidebarContent
                  eulerOptions={eulerOptions}
                  morphoOptions={morphoOptions}
                  pathname={pathname}
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
    <div className="hidden md:flex fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-100 flex-col min-h-screen">
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
      <div className="h-full px-6 pt-6 overflow-y-auto">
        <div className="flex flex-col h-full space-y-6">
          <SidebarContent
            eulerOptions={eulerOptions}
            morphoOptions={morphoOptions}
            pathname={pathname}
          />
        </div>
      </div>
    </div>
  );
}
