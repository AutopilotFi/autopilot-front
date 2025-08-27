import { ProjectData, UserStatsGrid } from "@/types/globalAppTypes"

export const generateUserStatsGridStructure = (currentProjectData: ProjectData): UserStatsGrid[] => [
            {
                label: "Total Balance",
                valueKey: "totalBalance",
                unit: currentProjectData?.asset,
                showDecimals: currentProjectData?.showDecimals,
                tooltip: `Your ${currentProjectData?.asset} balance will appear here once you make your first deposit`
            },
            {
                label: "Total Earnings",
                valueKey: "totalEarnings",
                unit: currentProjectData?.asset,
                showDecimals: currentProjectData?.showDecimals,
                tooltip: "Track your accumulated earnings from yield optimization"
            },
            {
                label: "Monthly Forecast",
                valueKey: "monthlyForecast",
                unit: currentProjectData?.asset,
                showDecimals: currentProjectData?.showDecimals,
                tooltip: "Projected monthly earnings based on current APY and your balance"
            },
            {
                label: "Update Frequency",
                valueKey: "updateFrequency",
                unit: "",
                hasTooltip: true,
                tooltipText: "This is an approximation based on historical data, when the Autopilot will harvest the earned yield and distribute it to your account.",
                latestUpdate: "Latest: 2min ago"
            },
]

export const generateUserEarningStatsGridStructure = (currentProjectData: ProjectData): UserStatsGrid[] => [
    {
        label: "Total Earnings",
        valueKey: "totalEarnings",
        unit: currentProjectData.asset,
        showDecimals: currentProjectData?.showDecimals,
        tooltip: "Your total accumulated earnings will be displayed here"
    },
    {
        label: "30D Earnings",
        valueKey: "monthlyEarnings",
        unit: currentProjectData.asset,
        showDecimals: currentProjectData?.showDecimals,
        tooltip: "Earnings from the last 30 days"
    },
    {
        label: "24H Earnings",
        valueKey: "dailyEarnings",
        unit: currentProjectData.asset,
        showDecimals: currentProjectData?.showDecimals,
        tooltip: "Earnings from the last 24 hours"
    },
    {
        label: "Update Frequency",
        valueKey: "updateFrequency",
        unit: ""
    },
]

export const generateUserHistoryStatsGridStructure = (currentProjectData: ProjectData): UserStatsGrid[] => [
    {
      label: "Total Deposits",
      valueKey: "totalDeposits",
      unit: currentProjectData.asset,
      tooltip: "Total amount you've deposited"
    },
    {
      label: "Total Withdrawals",
      valueKey: "totalWithdrawals",
      unit: currentProjectData.asset,
      tooltip: "Total amount you've withdrawn"
    },
    {
      label: "Total Earnings",
      valueKey: "totalEarnings",
      unit: currentProjectData.asset,
      tooltip: "All-time earnings from the Autopilot"
    },
    {
      label: "Total Actions",
      valueKey: "totalActions",
      unit: "",
      tooltip: "Number of deposits, withdrawals, and other transactions"
    },
]