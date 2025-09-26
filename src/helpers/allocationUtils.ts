import { MarketBalance, VaultHistoryData } from "@/types/globalAppTypes";
import { generateColor } from "./utils";

export interface AllocationData {
  name: string;
  percentage: number;
  amount: number;
  color: string;
  protocol: string;
  marketId: string;
  apy: number;
}

const convertHVaultIdToName = (hVaultId: string): string => {
  if (hVaultId === 'Not invested') return 'Not invested';
  
  const parts = hVaultId.split('_');
  
  if (parts.length >= 3) {
    const protocol = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    const strategy = parts[1];
    const asset = parts[2];
    
    if (protocol === 'Morpho') {
      return `Morpho ${strategy} ${asset}`;
    } else if (protocol === 'Euler') {
      return `Euler ${strategy} ${asset}`;
    } else if (protocol === 'Extrafi') {
      return `Extrafi ${strategy} ${asset}`;
    } else if (protocol === 'Moonwell') {
      return `Moonwell ${strategy} ${asset}`;
    } else if (protocol === 'Fortyacres') {
      return `Forty Acres ${strategy} ${asset}`;
    } else if (protocol === 'Fluid') {
      return `Fluid ${strategy} ${asset}`;
    } else if (protocol === 'Aave') {
      return `Aave ${strategy} ${asset}`;
    } else {
      return `${protocol} ${strategy} ${asset}`;
    }
  } else if (parts.length === 2) {
    const protocol = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    const asset = parts[1];
    return `${protocol} ${asset}`;
  }
  
  return hVaultId.charAt(0).toUpperCase() + hVaultId.slice(1);
};

// Function to get vault name and APY from marketId using allocPointData
const getVaultDataFromMarketId = (
  marketId: string, 
  allocPointData: { hVaultAddress?: string; hVaultId: string; apy?: string }[]
): { name: string; apy: number } => {
  const allocPoint = allocPointData?.find(ap => 
    ap.hVaultAddress?.toLowerCase() === marketId.toLowerCase()
  );
  if (allocPoint) {
    return {
      name: convertHVaultIdToName(allocPoint.hVaultId),
      apy: parseFloat(allocPoint.apy || '0')
    };
  }
  return {
    name: `Vault ${marketId.slice(0, 6)}...`,
    apy: 0
  };
};


// Main function to get current allocations from marketBalances
export const getCurrentAllocations = (
  plasmaHistory: VaultHistoryData[],
  allocPointData: { hVaultAddress?: string; hVaultId: string; apy?: string }[]
): AllocationData[] => {
  if (!plasmaHistory || plasmaHistory.length === 0 || !allocPointData) {
    return [];
  }

  // Get the latest (most recent) history entry
  const latestHistory = plasmaHistory
    .filter(history => history.marketBalances && history.marketBalances.length > 0)
    .sort((a, b) => new Date(b.blockTimestamp).getTime() - new Date(a.blockTimestamp).getTime())[0];

  if (!latestHistory) {
    return [];
  }

  const totalBalance = parseFloat(latestHistory.totalBalance) || 0;
  
  if (totalBalance <= 0) {
    return [];
  }

  // Filter out ERC20 tokens - only show actual vault protocols
  const vaultBalances = latestHistory.marketBalances.filter((marketBalance: MarketBalance) => 
    marketBalance.protocol.toLowerCase() !== 'erc20'
  );

  const allocations = vaultBalances
    .map((marketBalance: MarketBalance) => {
      const balance = parseFloat(marketBalance.balance) || 0;
      const percentage = (balance / totalBalance) * 100;
      const vaultData = getVaultDataFromMarketId(marketBalance.marketId, allocPointData);
      
      return {
        name: vaultData.name,
        percentage: Math.round(percentage * 100) / 100,
        amount: balance,
        color: generateColor({}, vaultData.name),
        protocol: marketBalance.protocol,
        marketId: marketBalance.marketId,
        apy: vaultData.apy
      };
    })
    .filter(allocation => allocation.percentage > 0.01) // Only show allocations > 0.01%
    .sort((a, b) => b.percentage - a.percentage);

  return allocations;
};
