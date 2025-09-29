import { formatBalance, getExplorerLink } from '@/helpers/utils';
import { UserTransaction, ProjectData } from '@/types/globalAppTypes';

export default function DesktopHistory({
  currentTransactions,
  currentProjectData,
  isDarkMode,
}: {
  currentTransactions: UserTransaction[];
  currentProjectData: ProjectData;
  isDarkMode?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className={`border-b ${isDarkMode ? 'border-border' : 'border-gray-100'}`}>
            <th
              className={`text-left py-3 px-4 text-xs font-medium uppercase tracking-wide ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
              }`}
            >
              Type
            </th>
            <th
              className={`text-right py-3 px-4 text-xs font-medium uppercase tracking-wide ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
              }`}
            >
              Amount
            </th>
            <th
              className={`text-right py-3 px-4 text-xs font-medium uppercase tracking-wide ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
              }`}
            >
              Status
            </th>
            <th
              className={`text-right py-3 px-4 text-xs font-medium uppercase tracking-wide ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
              }`}
            >
              Time
            </th>
            <th
              className={`text-right py-3 px-4 text-xs font-medium uppercase tracking-wide ${
                isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
              }`}
            >
              Tx ID
            </th>
          </tr>
        </thead>
        <tbody>
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
              <tr
                key={index}
                className={`border-b transition-colors ${
                  isDarkMode
                    ? 'border-border hover:bg-purple-900/20'
                    : 'border-gray-50 hover:bg-gray-50'
                }`}
              >
                <td className="py-4 px-4">
                  <div
                    className={`text-sm font-medium capitalize ${
                      isDarkMode ? 'text-foreground' : 'text-gray-900'
                    }`}
                  >
                    {transaction.type}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div
                    className={`text-sm font-medium ${
                      isDarkMode ? 'text-foreground' : 'text-gray-900'
                    }`}
                  >
                    {transaction.type === 'Withdrawal' ? '-' : '+'}
                    {formatBalance(transaction.amount, currentProjectData.asset)}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div
                    className={`text-sm font-medium capitalize ${
                      isDarkMode ? 'text-foreground' : 'text-gray-900'
                    }`}
                  >
                    {transaction.status}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div
                    className={`text-sm ${isDarkMode ? 'text-muted-foreground' : 'text-gray-500'}`}
                  >
                    {formatDate} {formatTime}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <a
                    href={`${getExplorerLink(currentProjectData.chainId || 8453)}/tx/${transaction.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-mono"
                  >
                    {truncatedHash}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
