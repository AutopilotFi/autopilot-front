"use client";

import React, { useState } from "react";
import { TrendingUp, Coins, Clock, Zap, Layers } from "lucide-react";
import { useRouter } from "next/navigation";

import { ProjectData, UserStats, TimeFrame } from "@/types/globalAppTypes";
import StatsGrid from "@/components/StatsGrid";
import { generateUserStatsGridStructure } from "@/components/StatsGrid/gridStructure";
import StandardCTAButton from "@/components/UI/StandardCTAButton";
import { formatFrequency, formatBalance } from "@/helpers/utils";
import EarningsChart from "./EarningsChart";

export default function Overview({
  currentProjectData,
  userStatsData,
  isNewUser,
  isOldUser,
  handleNavigateToDeposit,
}: {
  currentProjectData: ProjectData;
  userStatsData: UserStats;
  isNewUser: boolean;
  isOldUser: boolean;
  handleNavigateToDeposit: () => void;
}) {
  const router = useRouter();

  // Parent now owns timeframe + the displayed "current" values from the chart
  const [timeframe, setTimeframe] = useState<TimeFrame>("all");
  const [curDate, setCurDate] = useState<string>("");
  const [curContent, setCurContent] = useState<string>("");

  const handleViewAllEarnings = () => {
    router.push("/earnings");
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <StatsGrid
        gridStructure={generateUserStatsGridStructure(currentProjectData)}
        userStatsData={userStatsData}
        currentProjectData={currentProjectData}
        isNewUser={isNewUser}
      />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Earnings Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
          {isNewUser ? (
            <div className="p-6">
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-blue-200">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Your Earnings Chart
                  </h4>
                  <p className="text-sm text-gray-600 mb-4 max-w-xs">
                    Track your yield performance over time. Your earnings history
                    will appear here once you start using the Autopilot.
                  </p>
                  <StandardCTAButton onClick={handleNavigateToDeposit}>
                    Start Earning
                  </StandardCTAButton>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Header (moved from EarningsChart; now driven by parent state) */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-semibold text-gray-900 mb-2">
                      Earnings
                    </div>
                    <div className="text-2xl font-bold text-green-500">
                      {curContent || ""}
                    </div>
                    {curDate && (
                      <div className="text-sm text-gray-500 mt-1">{curDate}</div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    {(["7d", "1m", "all"] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => setTimeframe(period)}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          timeframe === period
                            ? "bg-[#9159FF] text-white"
                            : "text-[#9159FF] hover:text-[#7c3aed] hover:bg-purple-50"
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart only — pushes hover/initial value & date up via setters */}
              <EarningsChart
                currentProjectData={currentProjectData}
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
                setCurDate={setCurDate}
                setCurContent={setCurContent}
              />
            </>
          )}
        </div>

        {/* Latest Earnings */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Latest Earnings</h3>
            {!isNewUser && (
              <button
                onClick={handleViewAllEarnings}
                className="text-xs bg-[#9159FF] text-white px-3 py-1.5 rounded-md hover:bg-[#7c3aed] transition-colors"
              >
                View All
              </button>
            )}
          </div>

          {isNewUser ? (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Coins className="w-10 h-10 text-[#9159FF] mx-auto mb-3" />
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Your Latest Earnings
                </h4>
                <p className="text-xs text-gray-600 mb-4">
                  Your earnings will be reflected here. Supply funds to get
                  started with the {currentProjectData.asset} Autopilot.
                </p>
                <StandardCTAButton onClick={handleNavigateToDeposit}>
                  Start Earning
                </StandardCTAButton>
              </div>
            </div>
          ) : isOldUser ? (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Clock className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  No Recent Earnings
                </h4>
                <p className="text-xs text-gray-600 mb-4">
                  No active deposits generating earnings. Your last earnings were
                  from previous deposits.
                </p>
                <StandardCTAButton onClick={handleNavigateToDeposit}>
                  Start Earning
                </StandardCTAButton>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {currentProjectData.recentEarnings.slice(0, 5).map((earning, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-purple-50 hover:border hover:border-purple-200 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={currentProjectData.assetIcon}
                      alt={currentProjectData.asset}
                      className="w-5 h-5"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatBalance(
                          earning.amount,
                          currentProjectData.asset,
                          currentProjectData.showDecimals
                        )}
                      </div>
                      <div className="text-xs text-gray-500">Yield earned</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFrequency(Date.now() / 1000 - Number(earning.time))} ago
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Current Allocation Table - Always show for both user states */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Current Allocation
          </h3>
          <p className="text-sm text-gray-600">Live distribution across yield sources</p>
        </div>

        {/* Optimization Status */}
        <div
          className={`${
            isOldUser ? "bg-gray-50 border-gray-200" : "bg-green-50 border-green-200"
          } border rounded-xl p-4 mb-6`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 ${
                  isOldUser ? "bg-gray-100" : "bg-green-100"
                } rounded-lg flex items-center justify-center`}
              >
                <Zap className={`w-4 h-4 ${isOldUser ? "text-gray-600" : "text-green-600"}`} />
              </div>
              <div>
                <h4
                  className={`text-sm font-semibold ${
                    isOldUser ? "text-gray-900" : "text-green-900"
                  }`}
                >
                  {isOldUser ? "No Active Positions" : "Optimization Active"}
                </h4>
                <p
                  className={`text-xs ${
                    isOldUser ? "text-gray-700" : "text-green-700"
                  }`}
                >
                  {isOldUser
                    ? "All funds have been withdrawn"
                    : "Automatically rebalancing for maximum yield"}
                </p>
              </div>
            </div>
            <div
              className={`${
                isOldUser
                  ? "bg-white text-gray-700 border-gray-200/50"
                  : "bg-white text-green-700 border-green-200/50"
              } px-3 py-1 rounded-lg text-xs font-medium border`}
            >
              {isOldUser ? "Inactive" : "Last rebalance: 2h"}
            </div>
          </div>
        </div>

        {/* Allocation table for all users */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Yield Source
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  7d APY
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Amount
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Allocation
                </th>
              </tr>
            </thead>
            <tbody>
              {isOldUser ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="text-center">
                      <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        No Active Allocations
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        You have withdrawn all funds. Your historical allocation
                        data is preserved in the details section.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentProjectData.benchmarkData
                  .filter(
                    (allocation) =>
                      !allocation.isAutopilot && Number(allocation.allocation) > 1e-8
                  )
                  .map((allocation, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-50 hover:bg-purple-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={currentProjectData.assetIcon}
                            alt={currentProjectData.asset}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {allocation.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {allocation.apy.toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatBalance(
                            allocation.amount ?? 0,
                            currentProjectData.asset,
                            currentProjectData.showDecimals
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {(allocation.allocation ?? 0) < 0.01
                            ? "<0.01"
                            : (allocation.allocation ?? 0).toFixed(2)}
                          %
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
