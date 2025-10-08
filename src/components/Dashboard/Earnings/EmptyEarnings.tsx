import StandardCTAButton from '@/components/UI/StandardCTAButton';
import { History } from 'lucide-react';

export default function EmptyEarnings({
  handleAction,
  balance = 0,
  isDarkMode,
}: {
  handleAction?: () => void;
  balance?: number;
  isDarkMode?: boolean;
}) {
  return (
    <div className="text-center py-10">
      <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        No Earnings History
      </h4>
      <p className={`text-sm mb-4 ${isDarkMode ? 'text-muted-foreground' : 'text-gray-600'}`}>
        {balance >= 0.01
          ? 'Your deposit is now working for you. Earnings will soon be reflected here'
          : 'No earnings have been recorded yet. Start earning by making your first deposit.'}
      </p>
      {handleAction && balance < 0.01 && (
        <StandardCTAButton onClick={handleAction}>Start Earning</StandardCTAButton>
      )}
    </div>
  );
}
