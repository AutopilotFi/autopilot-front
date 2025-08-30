import { AutopilotAsset, AutopilotProtocol } from '@/types/globalAppTypes';

export const isValidProtocol = (p: string): p is AutopilotProtocol =>
  ['morpho', 'euler'].includes(p);
export const isValidAsset = (a: string): a is AutopilotAsset =>
  ['USDC', 'ETH', 'cbBTC'].includes(a);
