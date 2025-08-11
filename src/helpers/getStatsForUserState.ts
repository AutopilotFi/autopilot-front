import { AllUserStats, AutopilotProduct} from "@/types/globalAppTypes";
import { vaultsData } from "@/consts/autopilotData";
const availableProjects = ["morpho-USDC", "morpho-ETH", "morpho-cbBTC"]

export function getStatsForUserState(selectedAutopilot: AutopilotProduct): AllUserStats{
  return{
    new: //mock stats for new user
      availableProjects.reduce((acc, project) => ({ //mock stats for all projects
        ...acc,
        [project]: {
          totalBalance: "—",
          totalEarnings: "—",
          monthlyForecast: "—",
          updateFrequency: "~28",
          monthlyEarnings: "—",
          dailyEarnings: "—",
          totalDeposits: "—",
          totalWithdrawals: "—",
          totalActions: "—",
          transactions: [],
        },
      }), {}),

    old: //mock stats for old user
      availableProjects.reduce((acc, project) => ({ //mock stats for all projects
        ...acc,
        [project]: {
          totalBalance: "0.00",
          totalEarnings: vaultsData[project].currentEarnings.toLocaleString('en-US', {
            minimumFractionDigits: vaultsData[project].asset === 'USDC' ? 0 : 4,
            maximumFractionDigits: vaultsData[project].asset === 'USDC' ? 0 : 4,
            useGrouping: true
          }),
          monthlyForecast: "0.00",
          updateFrequency: "~28",
          monthlyEarnings: "0.00",
          dailyEarnings: "0.00",
          totalDeposits:
            selectedAutopilot.protocol === 'morpho'
            ? (selectedAutopilot.asset === 'USDC' ? "195,000" : selectedAutopilot.asset === 'ETH' ? "82.5" : "3.1")
            : (selectedAutopilot.asset === 'USDC' ? "175,000" : selectedAutopilot.asset === 'ETH' ? "74.2" : "2.8"),
          totalWithdrawals:
            selectedAutopilot.protocol === 'morpho'
            ? (selectedAutopilot.asset === 'USDC' ? "195,000" : selectedAutopilot.asset === 'ETH' ? "82.5" : "3.1")
            : (selectedAutopilot.asset === 'USDC' ? "175,000" : selectedAutopilot.asset === 'ETH' ? "74.2" : "2.8"),
          totalActions: selectedAutopilot.protocol === 'morpho' ? "47" : "52",
          transactions: project === "morpho-USDC" ? [
              { date: "2025-06-15T14:30:00", type: "Deposit", amount: 5000.00, txHash: "0x1a2b3c4d5e6f7890", status: "Completed" },
              { date: "2025-06-10T09:15:00", type: "Deposit", amount: 15000.00, txHash: "0x2b3c4d5e6f789012", status: "Completed" },
              { date: "2025-06-05T16:45:00", type: "Withdrawal", amount: 2500.00, txHash: "0x3c4d5e6f78901234", status: "Completed" },
              { date: "2025-05-28T11:20:00", type: "Deposit", amount: 25000.00, txHash: "0x4d5e6f7890123456", status: "Completed" },
              { date: "2025-05-22T13:55:00", type: "Deposit", amount: 50000.00, txHash: "0x5e6f789012345678", status: "Completed" },
              { date: "2025-05-15T08:30:00", type: "Deposit", amount: 100000.00, txHash: "0x6f78901234567890", status: "Completed" },
          ] : project === "morpho-ETH" ? [
              { date: "2025-06-15T14:30:00", type: "Deposit", amount: 2.5, txHash: "0x1a2b3c4d5e6f7890", status: "Completed" },
              { date: "2025-06-10T09:15:00", type: "Deposit", amount: 8.75, txHash: "0x2b3c4d5e6f789012", status: "Completed" },
              { date: "2025-06-05T16:45:00", type: "Withdrawal", amount: 1.2, txHash: "0x3c4d5e6f78901234", status: "Completed" },
              { date: "2025-05-28T11:20:00", type: "Deposit", amount: 15.5, txHash: "0x4d5e6f7890123456", status: "Completed" },
              { date: "2025-05-22T13:55:00", type: "Deposit", amount: 25.8, txHash: "0x5e6f789012345678", status: "Completed" },
              { date: "2025-05-15T08:30:00", type: "Deposit", amount: 35.2, txHash: "0x6f78901234567890", status: "Completed" },
          ] : [
              { date: "2025-06-15T14:30:00", type: "Deposit", amount: 0.15, txHash: "0x1a2b3c4d5e6f7890", status: "Completed" },
              { date: "2025-06-10T09:15:00", type: "Deposit", amount: 0.65, txHash: "0x2b3c4d5e6f789012", status: "Completed" },
              { date: "2025-06-05T16:45:00", type: "Withdrawal", amount: 0.08, txHash: "0x3c4d5e6f78901234", status: "Completed" },
              { date: "2025-05-28T11:20:00", type: "Deposit", amount: 1.2, txHash: "0x4d5e6f7890123456", status: "Completed" },
              { date: "2025-05-22T13:55:00", type: "Deposit", amount: 0.95, txHash: "0x5e6f789012345678", status: "Completed" },
              { date: "2025-05-15T08:30:00", type: "Deposit", amount: 1.8, txHash: "0x6f78901234567890", status: "Completed" },
          ]
        }
      }), {}),

    active: //mock stats for active user
      availableProjects.reduce((acc, project) => ({ //mock stats for all projects
      ...acc,
      [project]: {
          totalBalance: vaultsData[project].autopilotBalance.toLocaleString('en-US', {
          maximumFractionDigits: vaultsData[project].asset === 'USDC' ? 0 : 4,
          useGrouping: true
        }),
          totalEarnings: vaultsData[project].currentEarnings.toLocaleString('en-US', {
          minimumFractionDigits: vaultsData[project].asset === 'USDC' ? 0 : 4,
          maximumFractionDigits: vaultsData[project].asset === 'USDC' ? 0 : 4,
          useGrouping: true
        }),
        monthlyForecast: vaultsData[project].monthlyForecast.toLocaleString('en-US', {
          minimumFractionDigits: vaultsData[project].asset === 'USDC' ? 0 : 4,
          maximumFractionDigits: vaultsData[project].asset === 'USDC' ? 0 : 4,
          useGrouping: true
        }),
        updateFrequency: "~28",
        monthlyEarnings:
          selectedAutopilot.protocol === 'morpho'
          ? (selectedAutopilot.asset === 'USDC' ? "1,235" : selectedAutopilot.asset === 'ETH' ? "0.45" : "0.028")
          : (selectedAutopilot.asset === 'USDC' ? "1,089" : selectedAutopilot.asset === 'ETH' ? "0.38" : "0.022"),
        dailyEarnings:
          selectedAutopilot.protocol === 'morpho'
          ? (selectedAutopilot.asset === 'USDC' ? "45" : selectedAutopilot.asset === 'ETH' ? "0.015" : "0.0009")
          : (selectedAutopilot.asset === 'USDC' ? "38" : selectedAutopilot.asset === 'ETH' ? "0.012" : "0.0007"),
        totalDeposits:
          selectedAutopilot.protocol === 'morpho'
          ? (selectedAutopilot.asset === 'USDC' ? "195,000" : selectedAutopilot.asset === 'ETH' ? "82.5" : "3.1")
          : (selectedAutopilot.asset === 'USDC' ? "175,000" : selectedAutopilot.asset === 'ETH' ? "74.2" : "2.8"),
        totalWithdrawals:
          selectedAutopilot.protocol === 'morpho'
          ? (selectedAutopilot.asset === 'USDC' ? "2,500" : selectedAutopilot.asset === 'ETH' ? "1.2" : "0.08")
          : (selectedAutopilot.asset === 'USDC' ? "3,200" : selectedAutopilot.asset === 'ETH' ? "1.8" : "0.12"),
        totalActions: selectedAutopilot.protocol === 'morpho' ? "47" : "52",
                  transactions: project === "morpho-USDC" ? [
              { date: "2025-06-15T14:30:00", type: "Deposit", amount: 5000.00, txHash: "0x1a2b3c4d5e6f7890", status: "Completed" },
              { date: "2025-06-10T09:15:00", type: "Deposit", amount: 15000.00, txHash: "0x2b3c4d5e6f789012", status: "Completed" },
              { date: "2025-06-05T16:45:00", type: "Withdrawal", amount: 2500.00, txHash: "0x3c4d5e6f78901234", status: "Completed" },
              { date: "2025-05-28T11:20:00", type: "Deposit", amount: 25000.00, txHash: "0x4d5e6f7890123456", status: "Completed" },
              { date: "2025-05-22T13:55:00", type: "Deposit", amount: 50000.00, txHash: "0x5e6f789012345678", status: "Completed" },
              { date: "2025-05-15T08:30:00", type: "Deposit", amount: 100000.00, txHash: "0x6f78901234567890", status: "Completed" },
          ] : project === "morpho-ETH" ? [
              { date: "2025-06-15T14:30:00", type: "Deposit", amount: 2.5, txHash: "0x1a2b3c4d5e6f7890", status: "Completed" },
              { date: "2025-06-10T09:15:00", type: "Deposit", amount: 8.75, txHash: "0x2b3c4d5e6f789012", status: "Completed" },
              { date: "2025-06-05T16:45:00", type: "Withdrawal", amount: 1.2, txHash: "0x3c4d5e6f78901234", status: "Completed" },
              { date: "2025-05-28T11:20:00", type: "Deposit", amount: 15.5, txHash: "0x4d5e6f7890123456", status: "Completed" },
              { date: "2025-05-22T13:55:00", type: "Deposit", amount: 25.8, txHash: "0x5e6f789012345678", status: "Completed" },
              { date: "2025-05-15T08:30:00", type: "Deposit", amount: 35.2, txHash: "0x6f78901234567890", status: "Completed" },
          ] : [
              { date: "2025-06-15T14:30:00", type: "Deposit", amount: 0.15, txHash: "0x1a2b3c4d5e6f7890", status: "Completed" },
              { date: "2025-06-10T09:15:00", type: "Deposit", amount: 0.65, txHash: "0x2b3c4d5e6f789012", status: "Completed" },
              { date: "2025-06-05T16:45:00", type: "Withdrawal", amount: 0.08, txHash: "0x3c4d5e6f78901234", status: "Completed" },
              { date: "2025-05-28T11:20:00", type: "Deposit", amount: 1.2, txHash: "0x4d5e6f7890123456", status: "Completed" },
              { date: "2025-05-22T13:55:00", type: "Deposit", amount: 0.95, txHash: "0x5e6f789012345678", status: "Completed" },
              { date: "2025-05-15T08:30:00", type: "Deposit", amount: 1.8, txHash: "0x6f78901234567890", status: "Completed" },
          ]
      },
    }), {})
}}