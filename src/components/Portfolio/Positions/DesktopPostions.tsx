import { PortfolioData } from '@/types/globalAppTypes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../UI/Tooltip';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { vaultsData } from '@/consts/autopilotData';
import Image from 'next/image';

export default function DesktopPositions({
  sortedPortfolioData,
  getAssetIcon,
  getProtocolIcon,
}: {
  sortedPortfolioData: PortfolioData;
  getAssetIcon: (key: string) => string;
  getProtocolIcon: (key: string) => string;
}) {
  const router = useRouter();
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Autopilot
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Protocol
            </th>
            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Balance
            </th>
            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
              USD Value
            </th>
            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
              All-Time Earnings
            </th>
            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Best Allocation
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedPortfolioData.map((position, index) => {
            return (
              <tr
                key={index}
                className={`border-b border-gray-50 hover:bg-purple-50 transition-colors ${
                  position.asset === 'USDC' ? 'cursor-pointer' : 'cursor-default'
                }`}
                onClick={
                  position.asset === 'USDC'
                    ? () => router.push(`/base/${position.protocol}/${position.asset}`)
                    : undefined
                }
              >
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      width={21}
                      height={21}
                      src={getAssetIcon(position.asset)}
                      alt={position.asset}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-900">{position.asset}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Image
                      width={14}
                      height={14}
                      src={getProtocolIcon(position.protocol)}
                      alt={position.protocol}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-600 capitalize">{position.protocol}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {position.asset === 'USDC'
                      ? position.balance.toLocaleString('en-US', {
                          maximumFractionDigits: 0,
                        })
                      : position.balance.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{' '}
                    {position.asset}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="text-sm font-medium text-gray-900">
                    ${position.usdValue.toLocaleString()}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="text-sm font-medium text-green-600">
                    {position.asset === 'USDC'
                      ? position.earnings.toLocaleString('en-US', {
                          maximumFractionDigits: 0,
                        })
                      : position.earnings.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6,
                        })}{' '}
                    {position.asset}
                  </div>
                  <div className="text-xs text-gray-500">
                    ${position.earningsUsd.toLocaleString()}
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="inline-flex items-center space-x-1 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-xs font-medium text-green-700 cursor-help hover:bg-green-100 transition-colors select-none touch-manipulation"
                          onClick={e => e.stopPropagation()}
                          onTouchStart={e => e.stopPropagation()}
                        >
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="border-b border-dotted border-green-600 select-none">
                            Active
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="left"
                        className="max-w-sm bg-gray-900 border-gray-700 text-white z-50"
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="text-sm font-medium text-white pr-3">
                              This position is now optimized across the most efficient Morpho yield
                              sources
                            </div>
                            <div className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                          </div>
                          <div className="space-y-2 mb-3">
                            {vaultsData[`${position.protocol}-${position.asset}`].allocations.map(
                              (vault, vIndex) => (
                                <div
                                  key={vIndex}
                                  className="flex justify-between items-center text-sm"
                                >
                                  <span className="text-gray-300 mr-4">{vault.name}</span>
                                  <span className="text-white font-medium">
                                    {vault.allocation}%
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                          <div className="text-xs text-gray-400 font-normal border-t border-gray-700 pt-2">
                            <div>Displaying current yield sources and allocation weights</div>
                            <div className="mt-1">Last rebalance: 33m ago</div>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
