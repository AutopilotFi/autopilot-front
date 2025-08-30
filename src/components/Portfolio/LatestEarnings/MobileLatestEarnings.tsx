import { LatestEarningData } from '@/types/globalAppTypes';
import Image from 'next/image';

export default function MobileLatestEarnings({
  latestEarnings,
  getProtocolIcon,
}: {
  latestEarnings: LatestEarningData;
  getProtocolIcon: (key: string) => string;
}) {
  return (
    <div className="md:hidden space-y-4">
      {latestEarnings
        .filter(earning => earning.protocol !== 'euler')
        .map((earning, index) => (
          <div
            key={index}
            className="border border-gray-100 rounded-lg p-4 hover:bg-purple-50 transition-colors"
          >
            {/* Header with Asset and Protocol */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Image
                  width={21}
                  height={21}
                  src={earning.icon}
                  alt={earning.asset}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium text-gray-900">{earning.asset}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Image
                  width={14}
                  height={14}
                  src={getProtocolIcon(earning.protocol)}
                  alt={earning.protocol}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-600 capitalize">{earning.protocol}</span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Amount
                </span>
                <div className="text-sm font-medium text-green-600">
                  +
                  {earning.asset === 'USDC'
                    ? earning.amount.toFixed(2)
                    : earning.asset === 'ETH'
                      ? earning.amount.toFixed(4)
                      : earning.amount.toFixed(6)}{' '}
                  {earning.asset}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  USD Value
                </span>
                <div className="text-sm font-medium text-gray-900">${earning.value.toFixed(2)}</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Time
                </span>
                <div className="text-sm text-gray-500">{earning.time}</div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
