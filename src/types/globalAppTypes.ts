export type ProjectData = {
        name: string,
        asset: string,
        icon: string,
        assetIcon: string,
        currentAPY: number,
        secondBestAPY: number,
        currentEarnings: number,
        autopilotBalance: number,
        walletBalance: number,
        monthlyForecast: number,
        allocations: { name: string, apy: number, amount: number, allocation: number }[],
        recentEarnings: { time: string, amount: number, type: string }[]
}

export type ProjectsData = {
    [key: string]: ProjectData
}

export type UserStats = {
    label: string,
    value: string,
    unit: string,
    tooltip?: string,
    hasTooltip?: boolean,
    tooltipText?: string,
    latestUpdate?: string
}

export type TimeFrame = "7d" | "1m" | "all";