import { VaultOnlyData, SideBarOption } from "@/types/globalAppTypes";
import { formatCurrency } from "@/helpers/utils";
import { morphoVaultMap } from "@/consts/constants";

// Helper function to convert hVaultId to readable name
const convertHVaultIdToName = (hVaultId: string): string => {
  // Handle special cases first
  if (hVaultId === 'Not invested') return 'Not invested';
  
  // Split by underscore and format
  const parts = hVaultId.split('_');
  
  if (parts.length >= 3) {
    // Format: morpho_YOG_USDC -> Morpho YOG USDC
    const protocol = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    const strategy = parts[1];
    const asset = parts[2];
    
    // Handle special protocol names
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
    // Format: fluid_USDC -> Fluid USDC
    const protocol = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    const asset = parts[1];
    return `${protocol} ${asset}`;
  }
  
  // Fallback: just capitalize first letter
  return hVaultId.charAt(0).toUpperCase() + hVaultId.slice(1);
};

// Function to get vault data from availableAutopilots (Harvest API data)
export const getVaultDataFromAutopilots = (
  availableAutopilots: SideBarOption[], 
  protocol: string, 
  asset: string
): VaultOnlyData | null => {
  // Find the matching autopilot
  const autopilot = availableAutopilots.find(
    ap => ap.protocol === protocol && ap.asset === asset
  );

  if (!autopilot) return null;

  

  const tvl = parseFloat(autopilot.vault.totalValueLocked) || 0;

  const totalBalance = parseFloat(autopilot.vault.plasmaHistory?.[autopilot.vault.plasmaHistory.length - 1]?.totalBalance || '0') || 0;

  // Process allocPointData to create allocations and benchmarkData
  const allocations = (autopilot.vault.allocPointData || [])
    .map(item => {
      const allocPoint = parseFloat(item.allocPoint);
      const amount = (totalBalance * allocPoint) / 100; // amount = tvl * allocPoint / 100
      
      return {
        name: convertHVaultIdToName(item.hVaultId),
        apy: parseFloat(item.apy),
        amount: amount,
        allocation: allocPoint,
        hVaultAddress: item.hVaultAddress ?? null,
        mVaultAddress: morphoVaultMap[item.hVaultId as keyof typeof morphoVaultMap] ?? null
      };
    })
    .sort((a, b) => b.allocation - a.allocation); // Sort by allocation descending

  

  // Create benchmarkData from allocations
  const benchmarkData = [
    { 
      name: "Autopilot", 
      description: "Smart Yield Router", 
      apy: autopilot.apy, 
      isAutopilot: true,
      allocation: 100,
      hVaultAddress: autopilot.vault.vaultAddress
    },
    // Add individual vaults as benchmarks
    ...allocations.map(allocation => ({
      ...allocation,
      allocation: allocation.allocation,
      isAutopilot: false,
      description: `${protocol.charAt(0).toUpperCase() + protocol.slice(1)} Vault`,
    }))
  ];

  

  // Create vault data from Harvest API data
  const vaultData: VaultOnlyData = {
    name: protocol === 'morpho' ? 'Morpho' : protocol.charAt(0).toUpperCase() + protocol.slice(1), // Force Morpho name
    asset: asset,
    icon: protocol === 'morpho' ? '/projects/morpho.png' : `/projects/${protocol}.png`, // Force Morpho icon
    assetIcon: autopilot.vault.logoUrl[0]?.replace('./', '/') || '',
    currentAPY: Number(autopilot.apy) / 100, // Convert percentage to decimal
    apy7d: 0,
    apy30d: 0,
    initialSharePrice: 1,
    latestSharePrice: 1,
    secondBestAPY: Number(autopilot.apy) / 100 - 0.005, // Approximate second best
    tvl: formatCurrency(tvl), // Format TVL as currency (e.g., "$3.67M")
    totalBalance: autopilot.vault.plasmaHistory?.[autopilot.vault.plasmaHistory.length - 1]?.totalBalance || '0',
    tokenAddress: autopilot.vault.tokenAddress,
    vaultAddress: autopilot.vault.vaultAddress,
    tokenDecimals: autopilot.vault.decimals,
    vaultDecimals: autopilot.vault.vaultDecimals,
    showDecimals: autopilot.showDecimals,
    benchmarkData: benchmarkData
  };
  
  return vaultData;
};

