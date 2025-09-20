import StandardCTAButton from '@/components/UI/StandardCTAButton';
import { History } from 'lucide-react';

export default function EmptyEarnings({ handleAction }: { handleAction?: () => void }) {
  return (
    <div className="text-center py-10">
      <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h4 className="text-lg font-semibold text-gray-900 mb-2">No Earnings History</h4>
      <p className="text-sm text-gray-600 mb-4">
        No earnings have been recorded yet. Start earning by making your first deposit.
      </p>
      {handleAction && <StandardCTAButton onClick={handleAction}>Start Earning</StandardCTAButton>}
    </div>
  );
}
