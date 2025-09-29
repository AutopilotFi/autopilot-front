import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { ApyBadge, CommingSoon } from '../UI/Badges';
import Image from 'next/image';
import { SideBarOption } from '@/types/globalAppTypes';
import { morphoTempDisabled } from '@/consts/constants';
import { useState } from 'react';

export default function NavAutopilotLinks({
  options,
  url,
  name,
  icon,
  isDarkMode,
}: {
  options: SideBarOption[];
  url?: string;
  name: string;
  icon: string;
  isDarkMode?: boolean;
}) {
  const [linksExpanded, setLinksExpaned] = useState(true);
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Image width={14} height={14} src={icon} alt={name} className="w-4 h-4" />
          <h3
            className={`text-sm font-semibold uppercase tracking-wide ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}
          >
            {name}
          </h3>
        </div>
        <button
          onClick={() => setLinksExpaned(st => !st)}
          className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
        >
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${linksExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {linksExpanded && (
        <div className="space-y-2">
          {options.map(option => {
            const route = `/base/morpho/${option.asset}`;
            const isDisabled =
              option.protocol === 'morpho' && morphoTempDisabled.includes(option.asset);
            return (
              <Link
                href={route}
                onClick={
                  isDisabled
                    ? e => {
                        e.preventDefault();
                      }
                    : undefined
                }
                key={option.asset}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  !isDisabled ? 'cursor-pointer' : 'cursor-not-allowed'
                } ${
                  url === route
                    ? isDarkMode
                      ? 'bg-gray-800 border border-gray-700'
                      : 'bg-gray-100 border border-gray-200'
                    : option.asset === 'USDC'
                      ? isDarkMode
                        ? 'hover:bg-purple-900/30'
                        : 'hover:bg-purple-50/50'
                      : isDarkMode
                        ? 'hover:bg-gray-800/50'
                        : 'hover:bg-gray-50/50'
                }`}
              >
                <div className="relative">
                  <Image
                    width={28}
                    height={28}
                    src={option.icon}
                    alt={option.asset}
                    className={`w-6 h-6 md:w-8 md:h-8 rounded-full object-cover ${isDisabled ? 'opacity-60' : ''}`}
                  />

                  <Image
                    width={10.5}
                    height={10.5}
                    src={`/projects/${option.protocol}.png`}
                    alt="Morpho"
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full object-cover bg-white border border-gray-200 ${isDisabled ? 'opacity-60' : ''}`}
                  />
                </div>
                <div className="flex-1 text-left">
                  <div
                    className={clsx(
                      'font-medium',
                      isDisabled
                        ? isDarkMode
                          ? 'text-gray-500'
                          : 'text-gray-500'
                        : isDarkMode
                          ? 'text-gray-100'
                          : 'text-gray-900'
                    )}
                  >
                    {option.asset}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Autopilot
                  </div>
                </div>
                {isDisabled ? <CommingSoon /> : <ApyBadge apy={option.apy.toFixed(2)} />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
