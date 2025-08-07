import { ProjectData, UserStats } from "@/types/globalAppTypes";
import { UserState, AutopilotProduct } from "@/app/page";

export default function getStatsForUserState(currentData: ProjectData, userState: UserState, selectedAutopilot: AutopilotProduct): UserStats[]{
    if (userState === "new") {
      return [
        {
          label: "Total Balance",
          value: "—",
          unit: currentData.asset,
          tooltip: `Your ${currentData.asset} balance will appear here once you make your first deposit`
        },
        {
          label: "Total Earnings",
          value: "—",
          unit: currentData.asset,
          tooltip: "Track your accumulated earnings from yield optimization"
        },
        {
          label: "Monthly Forecast",
          value: "—",
          unit: currentData.asset,
          tooltip: "Projected monthly earnings based on current APY and your balance"
        },
        {
          label: "Update Frequency",
          value: "~28",
          unit: "min",
          hasTooltip: true,
          tooltipText: "This is an approximation based on historical data, when the Autopilot will harvest the earned yield and distribute it to your account.",
          latestUpdate: "Ready to start"
        },
      ];
    }

    if (userState == "old") {
      return [
        {
            label: "Total Earnings",
            value: currentData.currentEarnings.toLocaleString('en-US', {
            minimumFractionDigits: currentData.asset === 'USDC' ? 0 : 4,
            maximumFractionDigits: currentData.asset === 'USDC' ? 0 : 4
            }),
            unit: currentData.asset
        },
        {
            label: "30D Earnings",
            value: "0.00",
            unit: currentData.asset
        },
        {
            label: "24H Earnings",
            value: "0.00",
            unit: currentData.asset
        },
        {
            label: "Update Frequency",
            value: "~28",
            unit: "min"
        },
      ];
    }

    return [
    {
      label: "Total Earnings",
      value: currentData.currentEarnings.toLocaleString('en-US', {
        minimumFractionDigits: currentData.asset === 'USDC' ? 0 : 4,
        maximumFractionDigits: currentData.asset === 'USDC' ? 0 : 4
      }),
      unit: currentData.asset
    },
    {
      label: "30D Earnings",
      value: selectedAutopilot.protocol === 'morpho'
        ? (selectedAutopilot.asset === 'USDC' ? "1,235" : selectedAutopilot.asset === 'ETH' ? "0.45" : "0.028")
        : (selectedAutopilot.asset === 'USDC' ? "1,089" : selectedAutopilot.asset === 'ETH' ? "0.38" : "0.022"),
      unit: currentData.asset
    },
    {
      label: "24H Earnings",
      value: selectedAutopilot.protocol === 'morpho'
        ? (selectedAutopilot.asset === 'USDC' ? "45" : selectedAutopilot.asset === 'ETH' ? "0.015" : "0.0009")
        : (selectedAutopilot.asset === 'USDC' ? "38" : selectedAutopilot.asset === 'ETH' ? "0.012" : "0.0007"),
      unit: currentData.asset
    },
    {
      label: "Update Frequency",
      value: "~28",
      unit: "min"
    },
    ];
}