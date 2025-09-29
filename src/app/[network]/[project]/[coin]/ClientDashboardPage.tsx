'use client';

import Dashboard from '@/components/Dashboard';
import { isValidProtocol, isValidAsset } from '@/helpers/checkIfValidDashboardParams';
import {
  AutopilotProduct,
  AutopilotProtocol,
  AutopilotAsset,
  SideBarOption,
  VaultOnlyData,
} from '@/types/globalAppTypes';
import { GlobalContext } from '@/providers/GlobalDataProvider';
import { useContext } from 'react';
import { getVaultDataFromAutopilots } from '@/consts/vaultData';
import { getChainIdFromNetwork } from '@/helpers/utils';

const generateEmptyVaultData = (params: RouteParams): VaultOnlyData => ({
  name: '',
  asset: params.coin,
  icon: `/projects/${params.project.toLocaleLowerCase()}.png`,
  assetIcon: `/icons/${params.coin.toLocaleLowerCase()}.svg`,
  currentAPY: 0,
  apy7d: 0,
  apy30d: 0,
  initialSharePrice: 0,
  latestSharePrice: 0,
  secondBestAPY: 0,
  tvl: '',
  totalBalance: '',
  tokenAddress: '',
  vaultAddress: '',
  tokenDecimals: '',
  vaultDecimals: '',
  showDecimals: 0,
  benchmarkData: [],
});

type RouteParams = { network: string; project: string; coin: string };

const getDashboardStats = (
  selectedAutopilot: AutopilotProduct,
  availableAutopilots: SideBarOption[]
) => {
  const vaultData = getVaultDataFromAutopilots(
    availableAutopilots,
    selectedAutopilot.protocol,
    selectedAutopilot.asset
  );

  const userData = {
    name:
      selectedAutopilot.protocol === 'morpho'
        ? 'Morpho'
        : selectedAutopilot.protocol.charAt(0).toUpperCase() + selectedAutopilot.protocol.slice(1),
    asset: selectedAutopilot.asset,
    currentEarnings: 0,
    autopilotBalance: 0,
    walletBalance: 0,
    monthlyForecast: 0,
    recentEarnings: [],
    protocol: selectedAutopilot.protocol,
  };

  return { vaultData, userData };
};

export default function ClientDashboardPage({ params }: { params: RouteParams }) {
  const { network, project, coin } = params; // <-- plain object now
  const { availableAutopilots } = useContext(GlobalContext);

  const selectedAutopilot: AutopilotProduct | null =
    isValidProtocol(project) && isValidAsset(coin)
      ? { protocol: project as AutopilotProtocol, asset: coin as AutopilotAsset }
      : null;

  if (!selectedAutopilot) throw new Error('Page not found');

  const { vaultData, userData } = getDashboardStats(selectedAutopilot, availableAutopilots);
  const vaultDataNotNull = vaultData || generateEmptyVaultData(params);

  return (
    <Dashboard
      currentProjectData={{
        ...vaultDataNotNull,
        ...userData,
        frequency: '—',
        latestUpdate: '—',
        operatingSince: '—',
        chainId: getChainIdFromNetwork(network),
        uniqueVaultHData: [],
      }}
    />
  );
}
