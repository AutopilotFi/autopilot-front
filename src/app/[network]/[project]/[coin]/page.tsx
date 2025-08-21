"use client"

import Dashboard from "@/components/Dashboard";
import { isValidProtocol, isValidAsset } from "@/helpers/checkIfValidDashboardParams";
 import { AutopilotProduct, AutopilotProtocol, AutopilotAsset, SideBarOption } from "@/types/globalAppTypes";
import { GlobalContext } from "@/providers/GlobalDataProvider";
import { useContext } from "react";
import { getVaultDataFromAutopilots } from "@/consts/vaultData";

const getDashboardStats = (selectedAutopilot: AutopilotProduct, availableAutopilots: SideBarOption[]) => {
  
  const vaultData = getVaultDataFromAutopilots(availableAutopilots, selectedAutopilot.protocol, selectedAutopilot.asset);

  const userData = {
    name: selectedAutopilot.protocol === 'morpho' ? 'Morpho' : selectedAutopilot.protocol.charAt(0).toUpperCase() + selectedAutopilot.protocol.slice(1), // Force Morpho name
    asset: selectedAutopilot.asset,
    currentEarnings: 0,
    autopilotBalance: 0,
    walletBalance: 0,
    monthlyForecast: 0,
    recentEarnings: []
  };
  
  return { vaultData, userData };
}

export default function DashboardPage({
    params
} : {
    params: {
      network: string,
      project: string,
      coin: string
    }
}) {
  // Type assertion to suppress params warning since we need useContext in Client Component
  const {network, project, coin} = params as { network: string; project: string; coin: string };
  const { availableAutopilots } = useContext(GlobalContext);
  
  const selectedAutopilot: AutopilotProduct | null = isValidProtocol(project) && isValidAsset(coin) ? {protocol: project as AutopilotProtocol, asset: coin as AutopilotAsset} : null;
  if(!selectedAutopilot) throw new Error("Page not found");
  
  const { vaultData, userData} = getDashboardStats(selectedAutopilot, availableAutopilots);
  
  if (!vaultData) {
    return <div>Vault data not found</div>;
  }
  
  return (
    <>
      <Dashboard
          currentProjectData={{
            ...vaultData,
            ...userData,
            frequency: "—",
            latestUpdate: "—",
            operatingSince: "—",
          }}
      />
    </>
  );
}
