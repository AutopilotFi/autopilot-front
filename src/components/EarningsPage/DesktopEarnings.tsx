import { formatBalance, formatFrequency, formatTimeAgo } from '@/helpers/utils';
import Image from 'next/image';
import { Earnings } from '@/types/globalAppTypes';
import { ActionBadge } from '../UI/Badges';
import ImageWithOverlay from '../UI/ImageWithOverlay';
import { getAssetIcon, getProtocolIcon } from '@/helpers/getIcons';

export default function DesktopEarnings({
  earnings,
  isDarkMode,
  showFullDate,
  showMinutesInDate,
  hideAction,
  hideProtocol,
  hideNetwork,
  hideAutopilot,
}: {
  earnings: Earnings;
  isDarkMode?: boolean;
  showFullDate?: boolean;
  showMinutesInDate?: boolean;
  hideAction?: boolean;
  hideProtocol?: boolean;
  hideNetwork?: boolean;
  hideAutopilot?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className={`border-b ${isDarkMode ? 'border-border' : 'border-gray-100'}`}>
            <th
              className={`text-left py-3 px-4 text-xs font-medium uppercase tracking-wide min-w-[200px] ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
              }`}
            >
              {!hideAutopilot ? 'Autopilot Product' : 'Asset'}
            </th>
            {!hideAction && (
              <th
                className={`text-left py-3 px-4 text-xs font-medium uppercase tracking-wide min-w-[120px] ${
                  isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                }`}
              >
                Action
              </th>
            )}

            <th
              className={`text-right py-3 px-4 text-xs font-medium uppercase tracking-wide min-w-[120px] ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
              }`}
            >
              Earned Amount
            </th>
            <th
              className={`text-right py-3 px-4 text-xs font-medium uppercase tracking-wide min-w-[100px] ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
              }`}
            >
              USD Value
            </th>
            <th
              className={`text-right py-3 px-4 text-xs font-medium uppercase tracking-wide min-w-[80px] ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
              }`}
            >
              Time
            </th>
          </tr>
        </thead>
        <tbody>
          {earnings.map((earning, i) => {
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
              <tr
                key={`${earning.protocol}-${earning.asset}-${earning.time}-${i}`}
                className={`border-b transition-colors ${
                  isDarkMode
                    ? 'border-border hover:bg-purple-900/20'
                    : 'border-gray-50 hover:bg-purple-50'
                }`}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <ImageWithOverlay
                      hideOverlay={hideProtocol}
                      mainImg={{
                        size: 21,
                        src: getAssetIcon(earning.asset),
                        alt: earning.asset,
                      }}
                      overlayImg={{
                        size: 8.75,
                        src: getProtocolIcon(earning.protocol),
                        alt: earning.protocol,
                      }}
                    />
                    <div className="min-w-0">
                      <span
                        className={`text-sm font-medium truncate block ${
                          isDarkMode ? 'text-foreground' : 'text-gray-900'
                        }`}
                      >
                        {earning.asset} {!hideAutopilot && 'Autopilot'}
                      </span>
                      {!hideNetwork && (
                        <div className="flex items-center space-x-2">
                          <Image
                            width={10.5}
                            height={10.5}
                            src={`/chains/${earning.chainName.toLocaleLowerCase()}.png`}
                            alt="Base Network"
                            className="w-3 h-3 flex-shrink-0"
                          />
                          <span
                            className={`text-xs ${
                              isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                            }`}
                          >
                            {earning.chainName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                {!hideAction && (
                  <td className="py-4 px-4 overflow-visible">
                    <ActionBadge />
                  </td>
                )}
                <td className="py-4 px-4 text-right">
                  <div className="text-sm font-medium text-green-600 truncate">
                    {formatBalance(earning.amount, earning.asset)}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div
                    className={`text-sm font-medium truncate ${
                      isDarkMode ? 'text-foreground' : 'text-gray-900'
                    }`}
                  >
                    {formatBalance(earning.value, 'USD')}
                  </div>
                </td>
                <td className="text-right py-4 px-4">
                  <div
                    className={`text-sm cursor-help ${
                      isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                    }`}
                    title={
                      showFullDate
                        ? `${formatTimeAgo(earning.time)} ago`
                        : `${formatDate} ${formatTime}`
                    }
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
