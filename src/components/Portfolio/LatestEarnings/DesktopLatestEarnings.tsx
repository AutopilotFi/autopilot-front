import { LatestEarningData } from '@/types/globalAppTypes';
import Image from 'next/image';

export default function DesktopLatestEarnings({
  latestEarnings,
  getProtocolIcon,
}: {
  latestEarnings: LatestEarningData;
  getProtocolIcon: (key: string) => string;
}) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Asset
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Protocol
            </th>
            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Amount
            </th>
            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
              USD Value
            </th>
            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Time
            </th>
          </tr>
        </thead>
        <tbody>
          {latestEarnings
            .filter(earning => earning.protocol !== 'euler')
            .map((earning, index) => (
              <tr
                key={index}
                className="border-b border-gray-50 hover:bg-purple-50 transition-colors"
              >
                <td className="py-4 px-4">
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
                </td>
                <td className="py-4 px-4">
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
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="text-sm font-medium text-green-600">
                    +
                    {earning.asset === 'USDC'
                      ? earning.amount.toFixed(2)
                      : earning.asset === 'ETH'
                        ? earning.amount.toFixed(4)
                        : earning.amount.toFixed(6)}{' '}
                    {earning.asset}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="text-sm font-medium text-gray-900">
                    ${earning.value.toFixed(2)}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="text-sm text-gray-500">{earning.time}</div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
