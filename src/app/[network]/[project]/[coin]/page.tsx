import Dashboard from "@/components/Dashboard";
import { isValidProtocol, isValidAsset } from "@/helpers/checkIfValidDashboardParams";
import { AutopilotProduct, AutopilotProtocol, AutopilotAsset } from "@/types/globalAppTypes";
import {getStatsForUserState} from "@/helpers/getStatsForUserState";
import { vaultsData } from "@/consts/autopilotData";

//mock fetching stats for user
const getDashboardStats = async(selectedAutopilot: AutopilotProduct) => {
  const userStats = getStatsForUserState(selectedAutopilot);
  const dataKey = `${selectedAutopilot.protocol}-${selectedAutopilot.asset}`;
  const currentProjectData = vaultsData[dataKey as keyof typeof vaultsData];
  return {userStats, currentProjectData};
}

export default async function DashboardPage({
    params
} : {
    params: Promise<{
      network: string,
      project: string,
      coin: string
    }>
}) {
  const {project, coin} = await params;
  const selectedAutopilot: AutopilotProduct | null = isValidProtocol(project ) && isValidAsset(coin) ? {protocol: project as AutopilotProtocol, asset: coin as AutopilotAsset} : null;
  if(!selectedAutopilot) throw new Error("Page not found");
  const {userStats, currentProjectData} = await getDashboardStats(selectedAutopilot);
  return (
    <>
      <Dashboard
          selectedAutopilot={selectedAutopilot}
          userStats={userStats}
          currentProjectData={currentProjectData}
      />
    </>
  );
}
