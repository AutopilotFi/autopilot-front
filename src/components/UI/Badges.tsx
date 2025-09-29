import clsx from 'clsx';
import { ChevronDown, Circle, RotateCcw, TrendingUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './TooltipMobileFriendly';
import { Dispatch, SetStateAction } from 'react';
import { Tab } from '../Dashboard/Dashboard';

export const CommingSoon = ({ fullWidth }: { fullWidth?: boolean }) => (
  <span
    className={clsx(
      'text-xs text-[#9159FF] bg-[#9159FF]/10 px-2 py-1 rounded-full font-medium border border-[#9159FF]/20',
      fullWidth && 'w-full text-center'
    )}
  >
    Coming Soon
  </span>
);

export const ActionBadge = () => {
  return (
    <div className="relative table">
      <button
        type="button"
        className="peer inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-[#9159FF] bg-purple-50 border border-purple-200 cursor-help"
        aria-describedby="autocompounded-tip"
      >
        <RotateCcw className="w-3 h-3 mr-1.5" />
        Autocompounded
      </button>

      <div
        id="autocompounded-tip"
        role="tooltip"
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2
               bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0
               transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 max-w-xs
               peer-hover:opacity-100 peer-focus:opacity-100 peer-active:opacity-100"
      >
        <div className="text-center">
          The earnings have been automatically
          <br />
          turned into more balance of your
          <br />
          position,increasing the strength
          <br />
          of your earnings going forward
        </div>
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0
                    border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"
        />
      </div>
    </div>
  );
};

export const ApyBadge = ({
  apy,
  withBg,
  withyApyMark,
}: {
  apy: string | number;
  withBg?: boolean;
  withyApyMark?: boolean;
}) => (
  <div className="flex items-center space-x-4">
    <div
      className={clsx(
        'flex items-center space-x-2  px-3 py-1.5 rounded-md',
        withBg && 'bg-green-50 border border-green-200'
      )}
    >
      <Circle className="w-2 h-2 fill-green-600 text-green-600 animate-gentle-blink" />
      <span className="text-sm font-semibold text-green-600">
        {apy}% {withyApyMark && 'APY'}
      </span>
    </div>
  </div>
);

export const ApyBadgeWithPoints = ({
  apy,
  points,
  asset,
  setActiveTab,
  isMobile,
}: {
  apy: string | number;
  points: string[];
  asset: string;
  setActiveTab: Dispatch<SetStateAction<Tab>>;
  isMobile?: boolean;
}) => {
  return (
    <TooltipProvider>
      <Tooltip isMobile={isMobile}>
        <TooltipTrigger asChild isMobile={isMobile}>
          <div className="flex flex-col bg-green-50 border border-green-200 px-3 py-2 rounded-md cursor-help hover:bg-green-100 transition-colors group">
            <div className="flex items-center space-x-2">
              <Circle className="w-2 h-2 fill-green-600 text-green-600 animate-gentle-blink" />
              <span className="text-sm font-semibold text-green-600">{apy}% APY</span>
              <ChevronDown className="w-3 h-3 text-green-600 group-hover:text-green-700 transition-colors" />
            </div>
            <div className="text-xs font-medium text-green-700 mt-0.5">+ 3 Points Programs</div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="end"
          className="max-w-sm bg-gray-900 border-gray-700 text-white z-50"
          isMobile={isMobile}
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="text-sm font-medium text-white pr-3">APY Breakdown</div>
              <div className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Native Yield</span>
                <span className="text-white font-medium">{apy}%</span>
              </div>
              <div className="border-t border-gray-700 pt-2 space-y-1">
                {points.map((point, index) => (
                  <div key={`${index}.${point}`} className="flex items-center text-xs">
                    <span className="text-gray-400">{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-xs text-gray-400 font-normal border-t border-gray-700 pt-2">
              <div>
                Points Programs are realized into more {asset} once airdrop proceeds become
                claimable and sufficient liquidity is available on the open market.
              </div>
              <div className="mt-2">
                Points program proceeds are only distributed to Autopilot participants at the time
                of distribution.
              </div>
              <div className="mt-3">
                <span
                  className="text-gray-300 border-b border-dotted border-gray-400 cursor-pointer hover:text-white hover:border-gray-200 transition-colors"
                  onClick={e => {
                    e.stopPropagation();
                    setActiveTab('faq');
                    // Scroll to FAQ questions 8-9 after a brief delay
                    setTimeout(() => {
                      const faqElement = document.getElementById('faq-questions-8-9');
                      if (faqElement) {
                        faqElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }, 100);
                  }}
                >
                  How Points Programs are handled by Autopilot
                </span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
