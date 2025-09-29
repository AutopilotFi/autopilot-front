import { formatBalance, formatFrequency, formatTimeAgo } from '@/helpers/utils';
import { Earnings } from '@/types/globalAppTypes';
import Image from 'next/image';
import { ActionBadge } from '@/components/UI/Badges';
import ImageWithOverlay from '@/components/UI/ImageWithOverlay';
import { getProtocolIcon, getAssetIcon } from '@/helpers/getIcons';

export default function MobileEarnings({
  earnings,
  isDarkMode,
  showFullDate,
  showMinutesInDate,
  showNetwork,
  showProtocol,
  hideProtocolIcon,
  borderBottom,
}: {
  earnings: Earnings;
  isDarkMode?: boolean;
  showFullDate?: boolean;
  showMinutesInDate?: boolean;
  showNetwork?: boolean;
  showProtocol?: boolean;
  hideProtocolIcon?: boolean;
  borderBottom?: boolean;
}) {
  return (
    <div className="md:hidden">
      {earnings
        .filter(earning => earning.protocol !== 'euler')
        .map((earning, index) => {
          const date = new Date(Number(earning.time) * 1000); // Convert Unix timestamp to Date
          const formatDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          const formatTime = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });
          return (
            <div
              key={index}
              className={`py-3 transition-colors ${
                isDarkMode ? 'hover:bg-purple-900/20' : 'hover:bg-purple-50'
              } ${borderBottom && 'border-b border-gray-100'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-3">
                  <ImageWithOverlay
                    hideOverlay={hideProtocolIcon}
                    mainImg={{
                      size: 17.5,
                      src: getAssetIcon(earning.asset),
                      alt: earning.asset,
                    }}
                    overlayImg={{
                      size: 7,
                      src: getProtocolIcon(earning.protocol),
                      alt: earning.protocol,
                    }}
                  />
                  <div className="flex items-center space-x-2 min-w-0">
                    <span
                      className={`text-sm font-medium ${
                        isDarkMode ? 'text-foreground' : 'text-gray-900'
                      }`}
                    >
                      {earning.asset}
                    </span>
                    {showNetwork ? (
                      <>
                        <span
                          className={`text-sm ${
                            isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                          }`}
                        >
                          •
                        </span>
                        <Image
                          width={10.5}
                          height={10.5}
                          src={`/chains/${earning.chainName.toLocaleLowerCase()}.png`}
                          alt="Base Network"
                          className="w-3 h-3 flex-shrink-0"
                        />
                        <span
                          className={`text-sm ${
                            isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                          }`}
                        >
                          {earning.chainName}
                        </span>
                      </>
                    ) : showProtocol ? (
                      <>
                        <span
                          className={`text-sm ${
                            isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                          }`}
                        >
                          •
                        </span>
                        <span
                          className={`text-sm capitalize ${
                            isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                          }`}
                        >
                          {earning.protocol}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600">
                    {formatBalance(earning.amount, earning.asset)}
                  </div>
                  <div
                    className={`text-xs ${isDarkMode ? 'text-muted-foreground' : 'text-gray-500'}`}
                  >
                    {formatBalance(earning.value, 'USD', 2)}
                  </div>
                </div>
              </div>

              {/* Secondary info row */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <ActionBadge />
                </div>
                <div
                  className={`cursor-help ${
                    isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                  }`}
                  title={`${earning.time} ago`}
                >
                  {showFullDate ? (
                    <>
                      {formatDate} {formatTime}
                    </>
                  ) : showMinutesInDate ? (
                    formatFrequency(Date.now() / 1000 - Number(earning.time))
                  ) : (
                    formatTimeAgo(earning.time)
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
