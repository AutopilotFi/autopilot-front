'use client';
import { PortfolioData } from '@/types/globalAppTypes';
import DesktopPosition from './DesktopPosition';
import { getAssetIcon, getProtocolIcon } from '@/helpers/getIcons';

export default function DesktopPositions({
  sortedPortfolioData,
  isDarkMode,
}: {
  sortedPortfolioData: PortfolioData;
  isDarkMode?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className={`border-b ${isDarkMode ? 'border-border' : 'border-gray-100'}`}>
            <th
              className={`text-left py-3 px-4 text-xs font-medium uppercase tracking-wide ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
              }`}
            >
              Autopilot
            </th>
            <th
              className={`text-right py-3 px-4 text-xs font-medium uppercase tracking-wide ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
              }`}
            >
              Balance
            </th>
            <th
              className={`text-right py-3 px-4 text-xs font-medium uppercase tracking-wide ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
              }`}
            >
              All-Time Earnings
            </th>
            <th
              className={`text-center py-3 px-4 text-xs font-medium uppercase tracking-wide ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
              }`}
            >
              Best Allocation
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedPortfolioData.map((position, index) => (
            <DesktopPosition
              key={index}
              position={position}
              getAssetIcon={getAssetIcon}
              getProtocolIcon={getProtocolIcon}
              isDarkMode={isDarkMode}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
