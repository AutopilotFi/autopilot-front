import { AllocationData } from '@/helpers/allocationUtils';
import { Check, X } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

export default function AllocationBadge({
  allocations,
  setMobileTooltipOpen,
}: {
  allocations: AllocationData[];
  setMobileTooltipOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  return (
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
        {allocations.map((vault, vIndex) => (
          <div key={vIndex} className="flex justify-between items-center text-sm">
            <span className="text-gray-300 mr-4">{vault.name}</span>
            <span className="text-white font-medium">
              {(vault.percentage ?? 0) < 0.01 ? '<0.01' : (vault.percentage ?? 0).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-400 font-normal border-t border-gray-700 pt-2 mb-4">
        <div>Displaying current yield sources and allocation weights</div>
        {/* <div className="mt-1">Last rebalance: 33m ago</div> */}
      </div>
      {setMobileTooltipOpen && (
        <button
          onClick={() => setMobileTooltipOpen(false)}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Close</span>
        </button>
      )}
    </div>
  );
}
