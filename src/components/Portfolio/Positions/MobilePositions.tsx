import { formatBalance } from '@/helpers/utils';
import { Allocations, PortfolioData, ProjectKey } from '@/types/globalAppTypes';
import { Check, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CommingSoon } from '@/components/UI/Badges';
import { morphoTempDisabled } from '@/consts/constants';

export default function MobilePositions({
  allocations,
  sortedPortfolioData,
  getAssetIcon,
  getProtocolIcon,
}: {
  allocations: Allocations;
  sortedPortfolioData: PortfolioData;
  getAssetIcon: (key: string) => string;
  getProtocolIcon: (key: string) => string;
}) {
  const [mobileTooltipOpen, setMobileTooltipOpen] = useState<ProjectKey | null>(null);
  const router = useRouter();
  // Close mobile tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (mobileTooltipOpen) {
        setMobileTooltipOpen(null);
      }
    };

    if (mobileTooltipOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [mobileTooltipOpen]);

  return (
    <>
      <div className="space-y-4">
        {sortedPortfolioData.map((position, index) => {
          const isDisabled =
            position.protocol === 'morpho' && morphoTempDisabled.includes(position.asset);
          return (
            <div
              key={index}
              className={`border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors`}
              onClick={
                position.asset === 'USDC'
                  ? () => router.push(`/base/${position.protocol}/${position.asset}`)
                  : undefined
              }
            >
              {/* Header with Asset, Protocol and Active Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Image
                    width={28}
                    height={28}
                    src={getAssetIcon(position.asset)}
                    alt={position.asset}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{position.asset}</div>
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
                  </div>
                </div>
                <div className="relative">
                  {/* Mobile version with larger touch area and modal popup */}
                  {isDisabled ? (
                    <CommingSoon />
                  ) : (
                    <div className="md:hidden">
                      <div className="relative">
                        {/* Larger touch area */}
                        <div
                          className="absolute -inset-6 z-10"
                          onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            const positionId: ProjectKey = `${position.protocol}-${position.asset}`;
                            setMobileTooltipOpen(
                              mobileTooltipOpen === positionId ? null : positionId
                            );
                          }}
                        />
                        {/* Badge */}
                        <div className="inline-flex items-center space-x-1 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-xs font-medium text-green-700 select-none relative z-5">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="border-b border-dotted border-green-600 select-none">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Data Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Balance</div>
                  <div className="text-sm font-medium text-green-600">
                    {formatBalance(position.balance, position.asset, position.showDecimals)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatBalance(position.usdValue, 'USD', 2)}
                  </div>
                </div>
                <div className="justify-self-end">
                  <div className="text-xs text-gray-500 mb-1">All-Time Earnings</div>
                  <div className="text-sm font-medium text-green-600">
                    {formatBalance(position.earnings, position.asset)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatBalance(position.earningsUsd, 'USD', 2)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {mobileTooltipOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 md:hidden p-4"
          onClick={() => setMobileTooltipOpen(null)}
        >
          <div
            className="bg-gray-900 rounded-lg shadow-xl max-w-sm w-full border border-gray-700"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="text-sm font-medium text-white pr-3">
                  This position is now optimized across the most efficient Morpho yield sources
                </div>
                <div className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              {/* Dynamic allocation data based on which tooltip is open */}
              <div className="space-y-2 mb-3">
                {allocations?.[mobileTooltipOpen]?.map((vault, vIndex) => (
                  <div key={vIndex} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300 mr-4">{vault.name}</span>
                    <span className="text-white font-medium">
                      {(vault.allocation ?? 0) < 0.01
                        ? '<0.01'
                        : (vault.allocation ?? 0).toFixed(2)}
                      %
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-xs text-gray-400 font-normal border-t border-gray-700 pt-2 mb-4">
                <div>Displaying current yield sources and allocation weights</div>
                {/* <div className="mt-1">Last rebalance: 33m ago</div> */}
              </div>

              <button
                onClick={() => setMobileTooltipOpen(null)}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
