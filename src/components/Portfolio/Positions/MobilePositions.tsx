import { PortfolioData } from '@/types/globalAppTypes';
import MobilePosition from './MobilePosition';
import { getAssetIcon, getProtocolIcon } from '@/helpers/getIcons';

export default function MobilePositions({
  sortedPortfolioData,
  isDarkMode,
}: {
  sortedPortfolioData: PortfolioData;
  isDarkMode?: boolean;
}) {
  return (
    <>
      <div className="space-y-2">
        {sortedPortfolioData.map((position, index) => {
          return (
            <MobilePosition
              key={index}
              position={position}
              getAssetIcon={getAssetIcon}
              getProtocolIcon={getProtocolIcon}
              isDarkMode={isDarkMode}
            />
          );
        })}
      </div>
    </>
  );
}
