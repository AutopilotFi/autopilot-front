import clsx from 'clsx';
import { ChevronDown, Circle } from 'lucide-react';
import Link from 'next/link';
import { CommingSoon } from '../UI/Badges';
import Image from 'next/image';
import { SideBarOption } from '@/types/globalAppTypes';
import { morphoTempDisabled } from '@/consts/constants';
import { useState } from 'react';

export default function NavAutopilotLinks({
  options,
  url,
  protocol,
}: {
  options: SideBarOption[];
  url?: string;
  protocol: string;
}) {
  const [linksExpanded, setLinksExpaned] = useState(true);
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Image
            width={14}
            height={14}
            src={'/projects/morpho.png'}
            alt="Morpho"
            className="w-4 h-4"
          />
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            {protocol} Autopilots
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
                className={clsx(
                  'w-full flex items-center space-x-3 p-3 rounded-lg transition-colors',
                  url === route && 'bg-gray-50',
                  isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-purple-50/50'
                )}
              >
                <Image
                  width={16}
                  height={16}
                  src={option.icon}
                  alt={option.asset}
                  className={clsx('w-6 h-6', isDisabled && 'opacity-60')}
                />
                <div className="flex-1 text-left">
                  <div
                    className={clsx('font-medium', isDisabled ? 'text-gray-500' : 'text-gray-900')}
                  >
                    {option.asset}
                  </div>
                  <div className="text-sm text-gray-500">Autopilot</div>
                </div>
                {isDisabled ? (
                  <CommingSoon />
                ) : (
                  <div className="flex items-center space-x-1">
                    <Circle className="w-2 h-2 fill-green-600 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">
                      {option.apy.toFixed(2)}%
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
