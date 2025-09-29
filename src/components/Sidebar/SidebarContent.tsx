import Link from 'next/link';
import { ConnectWalletButton } from '../ConnectWalletButton';
import { BarChart3, LucideProps, TrendingUp } from 'lucide-react';
import NavAutopilotLinks from './NavAutopilotLinks';
import { SideBarOptions } from '@/types/globalAppTypes';
import SupportAndSocialLinks from './SupportAndSocialLinks';
import { Dispatch, ForwardRefExoticComponent, RefAttributes, SetStateAction } from 'react';
// import { DarkModeToggle } from './DarkModeToogle';

type NavLink = {
  url: string;
  Icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  title: string;
  subTitle: string;
};

const navLinks: NavLink[] = [
  {
    url: '/',
    Icon: BarChart3,
    title: 'Portfolio',
    subTitle: 'View all positions',
  },
  {
    url: '/earnings',
    Icon: TrendingUp,
    title: 'Earnings',
    subTitle: 'Full History',
  },
];

export default function SidebarContent({
  pathname,
  options,
  isDarkMode,
  // setIsDarkMode,
}: {
  pathname: string;
  options: SideBarOptions;
  isDarkMode?: boolean;
  setIsDarkMode?: Dispatch<SetStateAction<boolean | undefined>>;
}) {
  return (
    <>
      {/* Wallet Connection */}
      <ConnectWalletButton isDarkMode={isDarkMode} />

      {/* Portfolio Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3
            className={`text-sm font-semibold uppercase tracking-wide ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}
          >
            Portfolio
          </h3>
        </div>

        <div className="space-y-2">
          {navLinks.map(({ Icon, subTitle, title, url }) => (
            <Link
              key={title}
              href={url}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 cursor-pointer transform hover:scale-[1.02] ${
                pathname === url
                  ? isDarkMode
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-gray-100 border border-gray-200'
                  : isDarkMode
                    ? 'hover:bg-gray-800'
                    : 'hover:bg-gray-50'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                  pathname === url
                    ? isDarkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-300'
                    : isDarkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-200'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    pathname === url
                      ? isDarkMode
                        ? 'text-gray-300'
                        : 'text-gray-700'
                      : isDarkMode
                        ? 'text-gray-400'
                        : 'text-gray-600'
                  }`}
                />
              </div>
              <div className="flex-1 text-left">
                <div className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {title}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {subTitle}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-1">
        {options.map(({ name, icon, options }) => (
          <NavAutopilotLinks
            key={name}
            options={options}
            name={name}
            icon={icon}
            url={pathname}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
      {/* {isDarkMode !== undefined && setIsDarkMode !== undefined && (
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Dark Mode
          </span>
          <DarkModeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(st => !st)} />
        </div>
      )} */}
      <SupportAndSocialLinks isDarkMode={isDarkMode} />
    </>
  );
}
