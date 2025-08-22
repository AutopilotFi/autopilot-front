import EarningsPage from "@/components/EarningsPage";
import { EarningTransaction } from "@/types/globalAppTypes";

const getEarningsData = () => {
    // Generate comprehensive dummy earnings data across all positions
    const transactions: EarningTransaction[] = [];

    // Portfolio positions data (matching the Portfolio component)
    const portfolioPositions = [
      { asset: 'USDC' as const, protocol: 'morpho' as const, balance: 460000.00, apy: 9.03 },
      { asset: 'ETH' as const, protocol: 'morpho' as const, balance: 77.5, apy: 2.11 },
      { asset: 'cbBTC' as const, protocol: 'morpho' as const, balance: 0.40, apy: 4.27 }
    ];

    const types: ('interest' | 'compound' | 'reward')[] = ['interest', 'compound', 'reward'];

    // Generate 150 transactions for comprehensive demo
    for (let i = 0; i < 150; i++) {
      // Weight asset selection based on portfolio balance (larger positions = more transactions)
      const rand = Math.random();
      let selectedPosition;
      if (rand < 0.6) { // 60% USDC (largest position)
        selectedPosition = portfolioPositions[0];
      } else if (rand < 0.9) { // 30% ETH (medium position)
        selectedPosition = portfolioPositions[1];
      } else { // 10% cbBTC (smallest position)
        selectedPosition = portfolioPositions[2];
      }

      const type = types[Math.floor(Math.random() * types.length)];

      // Generate realistic amounts based on asset and position size
      let amount: number;
      let usdValue: number;

      if (selectedPosition.asset === 'USDC') {
        // Daily yield calculation: (balance * apy) / 365
        const dailyYield = (selectedPosition.balance * selectedPosition.apy / 100) / 365;
        // Vary earnings between 50%-150% of daily yield
        amount = dailyYield * (0.5 + Math.random() * 1.0);
        usdValue = amount;
      } else if (selectedPosition.asset === 'ETH') {
        const dailyYield = (selectedPosition.balance * selectedPosition.apy / 100) / 365;
        amount = dailyYield * (0.5 + Math.random() * 1.0);
        usdValue = amount * 4000; // ~$4000 per ETH
      } else { // cbBTC
        const dailyYield = (selectedPosition.balance * selectedPosition.apy / 100) / 365;
        amount = dailyYield * (0.5 + Math.random() * 1.0);
        usdValue = amount * 100000; // ~$100k per BTC
      }

      // Generate timestamp (last 60 days for more history)
      const daysAgo = Math.floor(Math.random() * 60);
      const hoursAgo = Math.floor(Math.random() * 24);
      const minutesAgo = Math.floor(Math.random() * 60);
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - daysAgo);
      timestamp.setHours(timestamp.getHours() - hoursAgo);
      timestamp.setMinutes(timestamp.getMinutes() - minutesAgo);

      transactions.push({
        id: `txn_${i.toString().padStart(3, '0')}`,
        asset: selectedPosition.asset,
        protocol: selectedPosition.protocol,
        amount,
        usdValue,
        timestamp,
        type,
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        blockNumber: 19000000 + Math.floor(Math.random() * 100000)
      });
    }

    // Add some recent high-value transactions for better demo
    const recentTransactions = [
      {
        id: 'txn_recent_001',
        asset: 'USDC' as const,
        protocol: 'morpho' as const,
        amount: 125.50,
        usdValue: 125.50,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        type: 'compound' as const,
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        blockNumber: 19050000
      },
      {
        id: 'txn_recent_002',
        asset: 'ETH' as const,
        protocol: 'morpho' as const,
        amount: 0.045,
        usdValue: 180.00,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        type: 'interest' as const,
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        blockNumber: 19049800
      },
      {
        id: 'txn_recent_003',
        asset: 'cbBTC' as const,
        protocol: 'morpho' as const,
        amount: 0.0012,
        usdValue: 120.00,
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        type: 'reward' as const,
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        blockNumber: 19049500
      }
    ];

    transactions.push(...recentTransactions);

    return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export default function Home() {
  const earningsData = getEarningsData();
  return (
    <EarningsPage
      earningsData={earningsData}
    />
  );
}
