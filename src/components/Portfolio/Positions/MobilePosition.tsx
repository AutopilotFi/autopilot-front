import { formatBalance } from '@/helpers/utils';
import AllocationBadge from './AllocationBadge';
import Image from 'next/image';
import { CommingSoon } from '@/components/UI/Badges';
import { Portfolio } from '@/types/globalAppTypes';
import useCurrentAllocations from '@/hooks/useCurrentAllocations';
import { morphoTempDisabled } from '@/consts/constants';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MobilePosition({
  position,
  getAssetIcon,
  getProtocolIcon,
  isDarkMode,
}: {
  position: Portfolio;
  getAssetIcon: (key: string) => string;
  getProtocolIcon: (key: string) => string;
  isDarkMode?: boolean;
}) {
  const [mobileTooltipOpen, setMobileTooltipOpen] = useState<boolean>(false);
  const router = useRouter();
  const allocations = useCurrentAllocations(position.vaultAddress);
  const isDisabled = position.protocol === 'morpho' && morphoTempDisabled.includes(position.asset);
  return (
    <div
      className={`border rounded-lg p-3 transition-colors ${
        isDarkMode ? 'bg-card border-border' : 'bg-white border-gray-100'
      }`}
      onClick={
        position.asset === 'USDC'
          ? () => router.push(`/base/${position.protocol}/${position.asset}`)
          : undefined
      }
    >
      {/* Header with Asset, Protocol and Active Badge */}
      <div
        className={`flex items-center justify-between mb-3 pb-3 border-b ${
          isDarkMode ? 'border-border' : 'border-gray-100'
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Image
              width={28}
              height={28}
              src={getAssetIcon(position.asset)}
              alt={position.asset}
              className="w-8 h-8 rounded-full object-cover"
            />
            <Image
              width={10.5}
              height={10.5}
              src={getProtocolIcon(position.protocol)}
              alt={position.protocol}
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full object-cover bg-white border border-gray-200"
            />
          </div>
          <div className="min-w-0">
            <span
              className={`text-sm font-medium ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}
            >
              {position.asset} Autopilot
            </span>
            <div className="flex items-center space-x-2">
              <Image
                width={10.5}
                height={10.5}
                src={`/chains/${position.chainName.toLocaleLowerCase()}.png`}
                alt="Base Network"
                className="w-3 h-3 flex-shrink-0"
              />
              <span className={`text-xs ${isDarkMode ? 'text-muted-foreground' : 'text-gray-500'}`}>
                {position.chainName}
              </span>
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
                    setMobileTooltipOpen(true);
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
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div
            className={`text-xs mb-0.5 ${isDarkMode ? 'text-muted-foreground' : 'text-gray-500'}`}
          >
            Balance
          </div>
          <div
            className={`text-sm font-medium ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}
          >
            {formatBalance(position.balance, position.asset, position.showDecimals)}
          </div>
        </div>
        <div className="text-right">
          <div
            className={`text-xs mb-0.5 ${isDarkMode ? 'text-muted-foreground' : 'text-gray-500'}`}
          >
            Value
          </div>
          <div
            className={`text-sm font-medium ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}
          >
            {formatBalance(position.usdValue, 'USD', 2)}
          </div>
        </div>
        <div className="col-span-2 pt-1">
          <div
            className={`text-xs mb-0.5 ${isDarkMode ? 'text-muted-foreground' : 'text-gray-500'}`}
          >
            All-Time Earnings
          </div>
          <div className="text-sm font-medium text-green-600">
            {formatBalance(position.earnings, position.asset)}
          </div>
          <div className={`text-xs ${isDarkMode ? 'text-muted-foreground' : 'text-gray-500'}`}>
            {formatBalance(position.earningsUsd, 'USD', 2)}
          </div>
        </div>
      </div>
      {mobileTooltipOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 md:hidden p-4"
          onClick={e => {
            e.stopPropagation();
            setMobileTooltipOpen(false);
          }}
        >
          <div
            className="bg-gray-900 rounded-lg shadow-xl max-w-sm w-full border border-gray-700"
            onClick={e => e.stopPropagation()}
          >
            <AllocationBadge
              allocations={allocations}
              setMobileTooltipOpen={setMobileTooltipOpen}
            />
          </div>
        </div>
      )}
    </div>
  );
}
