import { ProjectData, UserStats, UserStatsGrid } from '@/types/globalAppTypes';
import { Tooltip, TooltipTrigger, TooltipContent } from '../UI/Tooltip';
import { Info } from 'lucide-react';
import Image from 'next/image';

export default function StatsGrid({
  gridStructure,
  userStatsData,
  isNewUser,
  currentProjectData,
}: {
  gridStructure: UserStatsGrid[];
  userStatsData: UserStats;
  isNewUser: boolean;
  currentProjectData: ProjectData;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
      {gridStructure.map((stat, index) => {
        const userValue = userStatsData?.[stat.valueKey].toString();
        return (
          <div
            key={index}
            className="bg-white rounded-lg md:rounded-xl border border-gray-100 p-3 md:p-6 relative"
          >
            <div className="flex items-start justify-between mb-2 md:mb-3">
              <p className="text-xs md:text-sm font-medium text-gray-600 leading-tight">
                {stat.label}
              </p>
              {stat.hasTooltip ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 md:w-4 h-3 md:h-4 text-gray-400 cursor-help flex-shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">{stat.tooltipText}</p>
                  </TooltipContent>
                </Tooltip>
              ) : stat.tooltip && isNewUser ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 md:w-4 h-3 md:h-4 text-[#9159FF] cursor-help flex-shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">{stat.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ) : stat.unit !== 'min' ? (
                <Image
                  width={10}
                  height={10}
                  src={currentProjectData.assetIcon}
                  alt={stat.unit}
                  className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0"
                />
              ) : null}
            </div>
            <div className="flex items-baseline space-x-1 md:space-x-2">
              <span
                className={`text-lg md:text-2xl font-bold leading-none break-all ${
                  isNewUser && userValue === '—' ? 'text-gray-400' : 'text-gray-900'
                }`}
              >
                {userValue}
              </span>
              <span className="text-xs md:text-sm text-gray-500 flex-shrink-0">{stat.unit}</span>
            </div>
            {stat.latestUpdate && (
              <div className="absolute bottom-1 md:bottom-2 right-3 md:right-6">
                <span className={`text-xs ${isNewUser ? 'text-[#9159FF]' : 'text-gray-400'}`}>
                  {stat.latestUpdate}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
