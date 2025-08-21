import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  polygon,
  zkSync,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Autopilot Finance',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
  chains: [
    mainnet,
    base,
    arbitrum,
    zkSync,
    polygon,
  ],
  ssr: true,
});
