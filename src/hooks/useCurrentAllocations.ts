import { getCurrentAllocations } from '@/helpers/allocationUtils';
import { useIPORVaults } from '@/providers/VaultProvider';
import { useMemo } from 'react';

export default function useCurrentAllocations(vaultAddress: string) {
  const { iporVaultData } = useIPORVaults();

  const currentAllocations = useMemo(() => {
    const currentVault = iporVaultData.find(
      vault => vault.vaultAddress.toLowerCase() === vaultAddress.toLowerCase()
    );

    if (currentVault?.plasmaHistory && currentVault.allocPointData) {
      return getCurrentAllocations(currentVault.plasmaHistory, currentVault.allocPointData);
    }

    return [];
  }, [iporVaultData, vaultAddress]);

  return currentAllocations;
}
