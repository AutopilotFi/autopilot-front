"use client"
import { createContext, useEffect, useState } from 'react';
import { UserState, SideBarOption, GlobalData, FullVaultData } from '@/types/globalAppTypes';
import { useIPORVaults } from '../VaultProvider';

const defaultGlobalData: GlobalData = {
    user: {
        status: "new"
    },
    availableAutopilots: []
}

export const GlobalContext = createContext<GlobalData>(defaultGlobalData);

const fetchUserData = async() => {
    const userStaus: UserState = "active";
    return {status: userStaus};
}

// Convert iporVaultData to SideBarOption format with protocol forced to 'morpho'
const convertVaultDataToAutopilots = (vaultData: FullVaultData[]): SideBarOption[] => {
    
    return vaultData.map(vault => {
        const showDecimals = vault.tokenNames[0] === 'USDC' ? 2 : (vault.tokenNames[0] === 'WETH' || vault.tokenNames[0] === 'ETH') ? 6 : vault.tokenNames[0] === 'cbBTC' ? 8 : 2;
        const autopilot = {
            asset: vault.tokenNames[0] as 'USDC' | 'WETH' | 'cbBTC' | 'ETH', // Map vault symbol to asset with proper typing
            showDecimals: showDecimals,
            protocol: 'morpho' as const, // Force protocol to morpho
            apy: parseFloat(vault.estimatedApy) || 0, // Convert estimatedApy to number
            icon: vault.logoUrl[0]?.replace('./', '/') || '', // Convert relative path to absolute path
            vault: vault
        };
        return autopilot;
    });
};

export default function GlobalDataProvider({children}: {
  children: React.ReactNode}){
    const [globalData, setGlobalData] = useState<GlobalData>(defaultGlobalData);
    const { iporVaultData, loading, error } = useIPORVaults();
        
    useEffect(() => {
      const getUserData = async() => {
        if(!loading) {
          const userData = await fetchUserData();
          const convertedAutopilots = convertVaultDataToAutopilots(iporVaultData);
      
          setGlobalData({
              user: userData,
              availableAutopilots: convertedAutopilots, // Use converted data instead of prop
          });
        }
      }
      getUserData();
    }, [iporVaultData, loading]) // Add iporVaultData as dependency
    
    return(
        <GlobalContext.Provider value={globalData}>
            {error ? (
                <div className="p-4 text-red-600">
                    Error loading vault data: {error}
                </div>
            ) : null}
            {children}
        </GlobalContext.Provider>
    )
}
