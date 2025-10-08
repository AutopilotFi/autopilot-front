import { RefreshCw } from 'lucide-react';
import { RebalanceData } from './Allocations';
import clsx from 'clsx';

const formatTimeAgo = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 0) {
    return 'Just now';
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return 'Just now';
  } else if (minutes < 60) {
    return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
  } else if (hours < 24) {
    return `${hours} hr${hours !== 1 ? 's' : ''} ago`;
  } else if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else if (days < 30) {
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  } else if (days < 365) {
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  } else {
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
};

export default function Rebalance({
  rebalance,
  noBorder,
  firstRebalance,
  currentProjectDataName,
  isDarkMode,
}: {
  rebalance: RebalanceData;
  noBorder?: boolean;
  firstRebalance?: boolean;
  currentProjectDataName?: string;
  isDarkMode?: boolean;
}) {
  return (
    <>
      {
        <div
          className={clsx(
            !noBorder && 'border',
            'rounded-lg p-4 transition-colors duration-200',
            isDarkMode ? 'border-border bg-muted' : 'border-gray-200 hover:bg-gray-50'
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              {firstRebalance ? (
                <div className="flex items-center mb-3">
                  <div className="flex items-center bg-gradient-to-r from-green-50 to-purple-50 border border-green-200 rounded-full px-3 py-1.5 space-x-2 shadow-sm">
                    {/* Live Status Dot with Animation */}
                    <div className="relative flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"></div>
                    </div>

                    {/* Main Status Text */}
                    <span className="flex text-sm font-medium text-gray-700">
                      Live allocation{' '}
                      <span className="hidden md:block">
                        to the best {currentProjectDataName} yield sources
                      </span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg border border-purple-200 flex items-center space-x-2">
                  <RefreshCw className="w-3 h-3" />
                  <span className="text-xs font-medium">Rebalance #{rebalance.id}</span>
                </div>
              )}
            </div>
            <div
              className={`text-xs font-medium ${isDarkMode ? 'text-foreground' : 'text-gray-500'}`}
            >
              {formatTimeAgo(rebalance.timestamp)}
            </div>
          </div>

          {/* Allocation Bar */}
          <div className="space-y-3">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="h-full flex">
                {rebalance.allocations.map((allocation, allocIndex) => (
                  <div
                    key={allocIndex}
                    className="h-full"
                    style={{
                      width: `${allocation.percentage}%`,
                      backgroundColor: allocation.color,
                    }}
                    title={allocation.name}
                  ></div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {rebalance.allocations.map((allocation, allocIndex) => (
                <div key={allocIndex} className="flex items-center space-x-2">
                  <div
                    className="w-2 h-2 rounded flex-shrink-0"
                    style={{ backgroundColor: allocation.color }}
                  ></div>
                  <div className="min-w-0">
                    <div
                      className={`font-medium  truncate ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}
                    >
                      {allocation.name}
                    </div>
                    <div className={`${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}>
                      {allocation.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    </>
  );
}
