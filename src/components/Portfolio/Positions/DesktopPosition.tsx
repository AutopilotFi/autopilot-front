import { CommingSoon } from '@/components/UI/Badges';
import { formatBalance } from '@/helpers/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../UI/Tooltip';
import AllocationBadge from './AllocationBadge';
import { Portfolio } from '@/types/globalAppTypes';
import Image from 'next/image';
import useCurrentAllocations from '@/hooks/useCurrentAllocations';
import { morphoTempDisabled } from '@/consts/constants';
import { useRouter } from 'next/navigation';
import ImageWithOverlay from '@/components/UI/ImageWithOverlay';

export default function DesktopPosition({
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
  const router = useRouter();
  const allocations = useCurrentAllocations(position.vaultAddress);
  const isDisabled = position.protocol === 'morpho' && morphoTempDisabled.includes(position.asset);
  return (
    <tr
      className={`border-b transition-colors ${
        position.asset === 'USDC' ? 'cursor-pointer' : 'cursor-default'
      } ${
        isDarkMode ? 'border-border hover:bg-purple-900/20' : 'border-gray-50 hover:bg-purple-50'
      }`}
      onClick={
        position.asset === 'USDC'
          ? () => router.push(`/base/${position.protocol}/${position.asset}`)
          : undefined
      }
    >
      <td className="py-4 px-4">
        <div className="flex items-center space-x-3">
          <ImageWithOverlay
            mainImg={{
              size: 28,
              src: getAssetIcon(position.asset),
              alt: position.asset,
            }}
            overlayImg={{
              size: 10.5,
              src: getProtocolIcon(position.protocol),
              alt: position.protocol,
            }}
          />
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
      </td>
      <td className="py-4 px-4 text-right">
        <div className="text-sm font-medium text-green-600">
          {formatBalance(position.balance, position.asset, position.showDecimals)}
        </div>
        <div className={`text-xs ${isDarkMode ? 'text-muted-foreground' : 'text-gray-500'}`}>
          {formatBalance(position.usdValue, 'USD', 2)}
        </div>
      </td>
      <td className="py-4 px-4 text-right">
        <div className="text-sm font-medium text-green-600">
          {formatBalance(position.earnings, position.asset)}
        </div>
        <div className={`text-xs ${isDarkMode ? 'text-muted-foreground' : 'text-gray-500'}`}>
          {formatBalance(position.earningsUsd, 'USD', 2)}
        </div>
      </td>
      <td className="py-4 px-4 text-center">
        {isDisabled ? (
          <CommingSoon />
        ) : (
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
                onClick={e => e.stopPropagation()}
                onTouchStart={e => e.stopPropagation()}
              >
                <AllocationBadge allocations={allocations} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </td>
    </tr>
  );
}
