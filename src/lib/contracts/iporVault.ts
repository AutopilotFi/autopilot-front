export const iporVaultAbi = [
  // ERC4626-like
  { "type": "function", "name": "asset", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address" }] },
  { "type": "function", "name": "decimals", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "uint8" }] },
  { "type": "function", "name": "totalAssets", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "uint256" }] },
  { "type": "function", "name": "totalSupply", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "uint256" }] },
  { "type": "function", "name": "convertToAssets", "stateMutability": "view", "inputs": [{ "name": "shares", "type": "uint256" }], "outputs": [{ "name": "", "type": "uint256" }] },
  { "type": "function", "name": "convertToShares", "stateMutability": "view", "inputs": [{ "name": "assets", "type": "uint256" }], "outputs": [{ "name": "", "type": "uint256" }] },
  { "type": "function", "name": "deposit", "stateMutability": "nonpayable", "inputs": [{ "name": "assets", "type": "uint256" }, { "name": "receiver", "type": "address" }], "outputs": [{ "name": "", "type": "uint256" }] },
  { "type": "function", "name": "redeem", "stateMutability": "nonpayable", "inputs": [{ "name": "shares", "type": "uint256" }, { "name": "receiver", "type": "address" }, { "name": "owner", "type": "address" }], "outputs": [{ "name": "", "type": "uint256" }] }
] as const;

// Helper functions for vault conversions
export async function convertVaultToAssets(
  publicClient: any,// eslint-disable-line @typescript-eslint/no-explicit-any
  vaultAddress: string,
  shares: bigint
): Promise<bigint> {
  return await publicClient.readContract({
    address: vaultAddress as any,// eslint-disable-line @typescript-eslint/no-explicit-any
    abi: iporVaultAbi,
    functionName: "convertToAssets",
    args: [shares],
  });
}

export async function convertAssetsToVault(
  publicClient: any,// eslint-disable-line @typescript-eslint/no-explicit-any
  vaultAddress: string,
  assets: bigint
): Promise<bigint> {
  return await publicClient.readContract({
    address: vaultAddress as any,// eslint-disable-line @typescript-eslint/no-explicit-any
    abi: iporVaultAbi,
    functionName: "convertToShares",
    args: [assets],
  });
}