import Link from 'next/link';
import { ConnectWalletButton } from '../ConnectWalletButton';
import { BarChart3, TrendingUp } from 'lucide-react';
import NavAutopilotLinks from './NavAutopilotLinks';
import { SideBarOption } from '@/types/globalAppTypes';
import SupportAndSocialLinks from './SupportAndSocialLinks';

export default function SidebarContent({
  pathname,
  morphoOptions,
  eulerOptions,
}: {
  pathname: string;
  morphoOptions: SideBarOption[];
  eulerOptions: SideBarOption[];
}) {
  return (
    <>
      {/* Wallet Connection */}
      <ConnectWalletButton />

      {/* Portfolio Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Portfolio</h3>
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
              <div className="font-medium text-gray-900">Portfolio</div>
              <div className="text-xs text-gray-500">View all positions</div>
            </div>
          </Link>

          <Link
            href="/earnings"
            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 cursor-pointer transform hover:scale-[1.02] ${
              pathname === '/earnings' ? 'bg-gray-100 border border-gray-200' : 'hover:bg-gray-50'
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

      <div className="flex-1">
        {/* Morpho Autopilot Section */}
        <NavAutopilotLinks options={morphoOptions} protocol={'Morpho'} url={pathname} />

        {/* Euler Autopilot Section */}
        {eulerOptions.length > 0 && (
          <NavAutopilotLinks options={eulerOptions} protocol={'Euler'} url={pathname} />
        )}
      </div>

      <SupportAndSocialLinks />
    </>
  );
}
