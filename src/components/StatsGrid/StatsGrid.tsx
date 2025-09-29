import { UserStatsGrid } from '@/types/globalAppTypes';
import { Tooltip, TooltipTrigger, TooltipContent } from '../UI/TooltipMobileFriendly';
import { Info } from 'lucide-react';
import clsx from 'clsx';
import Image from 'next/image';

export default function StatsGrid({
  gridStructure,
  desktopColumns,
  isMobile,
}: {
  gridStructure: UserStatsGrid[];
  desktopColumns?: number;
  isMobile?: boolean;
}) {
  const gridContainerCalsses = clsx(
    desktopColumns ? `md:grid-cols-${desktopColumns}` : 'md:grid-cols-4',
    'grid max-md:grid-cols-2 gap-3 md:gap-6'
  );
  return (
    <div className={gridContainerCalsses}>
      {gridStructure.map((stat, index) => {
        const spanFirstRowOnMobile = desktopColumns === 3 && index === 0 && 'max-md:col-span-2';
        return (
          <div
            key={index}
            className={clsx(
              'bg-white rounded-lg md:rounded-xl border border-gray-100 p-3 md:p-6 relative',
              spanFirstRowOnMobile
            )}
          >
            <div className="flex items-start justify-between mb-2 md:mb-3">
              <p className="text-xs md:text-sm font-medium text-gray-600 leading-tight">
                {stat.label}
              </p>
              {stat.tooltipText ? (
                <Tooltip isMobile={isMobile}>
                  <TooltipTrigger asChild isMobile={isMobile}>
                    <Info className="w-3 md:w-4 h-3 md:h-4 text-gray-400 cursor-help flex-shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent
                    isMobile={isMobile}
                    side={isMobile ? 'bottom' : 'top'}
                    sideOffset={isMobile ? 8 : 4}
                    align="center"
                  >
                    <p className="max-w-xs text-xs">{stat.tooltipText}</p>
                  </TooltipContent>
                </Tooltip>
              ) : stat.asset && !stat.hideAsseticon ? (
                <Image
                  width={10}
                  height={10}
                  src={`/coins/${stat.asset.toLocaleLowerCase()}.svg`}
                  alt={stat.asset}
                  className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0"
                />
              ) : null}
            </div>
            <div className="flex items-baseline space-x-1 md:space-x-2">
              <span
                className={`text-lg md:text-2xl font-bold leading-none break-all text-gray-900}`}
              >
                {stat.value}
              </span>
              <span className="text-xs md:text-sm text-gray-500 flex-shrink-0">{stat.asset}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
