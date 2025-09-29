import { formatBalance, getExplorerLink } from '@/helpers/utils';
import { ProjectData, UserTransaction } from '@/types/globalAppTypes';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function MobileHisotry({
  currentTransactions,
  currentProjectData,
  isDarkMode,
}: {
  currentTransactions: UserTransaction[];
  currentProjectData: ProjectData;
  isDarkMode?: boolean;
}) {
  return (
    <div className="md:hidden space-y-3">
      {currentTransactions.map((transaction, index) => {
        const date = new Date(transaction.date);
        const formatDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        const formatTime = date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        const truncatedHash = `${transaction?.txHash?.slice(0, 6)}...${transaction?.txHash?.slice(-4)}`;

        return (
          <div
            key={index}
            className={`rounded-lg p-4 ${
              isDarkMode ? 'bg-muted border border-border' : 'bg-gray-50 border border-gray-100'
            }`}
          >
            {/* Header with type and amount */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isDarkMode
                      ? 'bg-muted-foreground/10 text-muted-foreground'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {transaction.type === 'deposit' ? (
                    <ArrowDown className="w-4 h-4" />
                  ) : (
                    <ArrowUp className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div
                    className={`text-sm font-medium capitalize ${
                      isDarkMode ? 'text-foreground' : 'text-gray-900'
                    }`}
                  >
                    {transaction.type}
                  </div>
                  <div
                    className={`text-xs capitalize ${
                      isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                    }`}
                  >
                    {transaction.status}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-sm font-medium ${
                    isDarkMode ? 'text-foreground' : 'text-gray-900'
                  }`}
                >
                  {transaction.type === 'Withdrawal' ? '-' : '+'}
                  {formatBalance(transaction.amount, currentProjectData.asset)}
                </div>
              </div>
            </div>

            {/* Bottom section with time and tx hash */}
            <div
              className={`flex items-center justify-between pt-3 border-t ${
                isDarkMode ? 'border-border' : 'border-gray-200'
              }`}
            >
              <div>
                <div
                  className={`text-xs mb-1 ${
                    isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                  }`}
                >
                  Time
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-foreground' : 'text-gray-700'}`}>
                  {formatDate} {formatTime}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-xs mb-1 ${
                    isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                  }`}
                >
                  Transaction
                </div>
                <a
                  href={`${getExplorerLink(currentProjectData.chainId || 8453)}/tx/${transaction.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm font-mono ${
                    isDarkMode ? 'text-muted-foreground' : 'text-gray-600'
                  }`}
                >
                  {truncatedHash}
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
