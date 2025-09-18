"use client";
import React, { useEffect, useMemo, useRef, useCallback } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { ProjectData } from "@/types/globalAppTypes";
import { formatBalance } from "@/helpers/utils";
import { useWallet } from "@/providers/WalletProvider";

interface EarningsChartProps {
  currentProjectData: ProjectData;
  timeframe: "1m" | "7d" | "all";
  onTimeframeChange: (timeframe: "1m" | "7d" | "all") => void;
  setCurDate: (date: string) => void;
  setCurContent: (content: string) => void;
}

interface ChartDataPoint {
  date: string;
  value: number;
  valueUsd: number;
  timestamp: number;
  amount: number;
  amountUsd: number;
  formattedDate: string;
}

// Mock chart data for wallet not connected state
const mockChartData = [
  { x: "1/1", y: 1000 },
  { x: "1/5", y: 1250 },
  { x: "1/10", y: 1600 },
  { x: "1/15", y: 1750 },
  { x: "1/20", y: 2100 },
  { x: "1/25", y: 2250 },
  { x: "1/30", y: 2600 },
];

export default function EarningsChart({
  currentProjectData,
  timeframe,
  onTimeframeChange, // eslint-disable-line @typescript-eslint/no-unused-vars
  setCurDate,
  setCurContent,
}: EarningsChartProps) {
  const { isConnected } = useWallet();
  const chartData = useMemo<ChartDataPoint[]>(() => {
    const recent = currentProjectData.recentEarnings || [];
    if (recent.length === 0) return [];

    const now = Date.now();
    const sorted = [...recent].sort((a, b) => Number(a.time) - Number(b.time));

    let cum = 0;
    let cumUsd = 0;
    const points = sorted.map((e) => {
      cum += e.amount;
      cumUsd += e.amountUsd;
      return {
        timestamp: Number(e.time) * 1000,
        value: cum,
        valueUsd: cumUsd,
        amount: e.amount,
        amountUsd: e.amountUsd,
      };
    });

    let startTime: number;
    let filtered = points;

    if (timeframe === "all") {
      startTime = points.length ? points[0].timestamp : now;
    } else {
      const days = timeframe === "1m" ? 30 : 7;
      const cutoff = now - days * 24 * 60 * 60 * 1000;
      startTime = cutoff;
      filtered = points.filter((p) => p.timestamp >= cutoff);
      if (filtered.length === 0) filtered = points;
    }

    let baseline = 0;
    if (timeframe !== "all") {
      for (let i = points.length - 1; i >= 0; i--) {
        if (points[i].timestamp <= startTime) {
          baseline = points[i].value;
          break;
        }
      }
    }

    const endTime = now;
    const daysInRange =
      timeframe === "7d"
        ? 7
        : timeframe === "1m"
        ? 30
        : Math.max(1, Math.ceil((endTime - startTime) / (24 * 60 * 60 * 1000)));
    const count = Math.max(2, Math.ceil(daysInRange));
    const step = (endTime - startTime) / (count - 1);

    const linear: ChartDataPoint[] = [];
    for (let i = 0; i < count; i++) {
      const t = startTime + i * step;
      const d = new Date(t);

      // latest value <= t
      let v = baseline;
      let vUsd = 0;
      for (let j = points.length - 1; j >= 0; j--) {
        if (points[j].timestamp <= t) {
          v = points[j].value;
          vUsd = points[j].valueUsd;
          break;
        }
      }

      linear.push({
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        value: v,
        valueUsd: vUsd,
        timestamp: t,
        amount: 0,
        amountUsd: 0,
        formattedDate: d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: t < now - 365 * 24 * 60 * 60 * 1000 ? "numeric" : undefined,
        }),
      });
    }
    return linear;
  }, [currentProjectData.recentEarnings, timeframe]);

  // Initialize parent with latest
  const latestRef = useRef<ChartDataPoint | null>(null);
  useEffect(() => {
    if (chartData.length) {
      const latest = chartData[chartData.length - 1];
      latestRef.current = latest;
      setCurContent(
        formatBalance(latest.value, currentProjectData.asset, currentProjectData.showDecimals)
      );
      setCurDate(latest.formattedDate);
    } else {
      latestRef.current = null;
      setCurContent("");
      setCurDate("");
    }
  }, [chartData, currentProjectData.asset, currentProjectData.showDecimals, setCurContent, setCurDate]);

  // Use index-based hover — reliable across Recharts versions
  const lastIdxRef = useRef<number | null>(null);

  const handleMouseMove = useCallback(
    (state: any) => {// eslint-disable-line @typescript-eslint/no-explicit-any
      if (!state?.isTooltipActive) return;
      const idx: number | undefined = state.activeTooltipIndex;
      if (idx == null) return;
      if (idx === lastIdxRef.current) return;

      lastIdxRef.current = idx;
      const p = chartData[idx];
      if (!p) return;

      setCurContent(
        formatBalance(p.value, currentProjectData.asset, currentProjectData.showDecimals)
      );
      setCurDate(p.formattedDate);
    },
    [chartData, currentProjectData.asset, currentProjectData.showDecimals, setCurContent, setCurDate]
  );

  const handleMouseLeave = useCallback(() => {
    lastIdxRef.current = null;
    const latest = latestRef.current;
    if (!latest) return;
    setCurContent(
      formatBalance(latest.value, currentProjectData.asset, currentProjectData.showDecimals)
    );
    setCurDate(latest.formattedDate);
  }, [currentProjectData.asset, currentProjectData.showDecimals, setCurContent, setCurDate]);

  const CustomXAxisTick = ({
    x,
    y,
    payload,
  }: {
    x: number;
    y: number;
    payload: { value: string };
  }) => (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#9ca3af" fontSize="12" fontWeight="400">
        {payload.value}
      </text>
    </g>
  );

  const MockChart = () => (
    <div className="absolute inset-0 blur-sm">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={mockChartData}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorGreenMock" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="x"
            axisLine={false}
            tickLine={false}
            tick={CustomXAxisTick}
            interval="preserveStartEnd"
            minTickGap={60}
          />
          <YAxis 
            hide
            domain={[0, 'dataMax']}
            scale="linear"
          />
          <Area
            type="monotone"
            dataKey="y"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#colorGreenMock)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  // Check if we have enough earnings events to show a meaningful chart
  const earningsEvents = currentProjectData.recentEarnings || [];

  // Handle wallet not connected state
  if (!isConnected) {
    return (
      <div className="h-72 bg-white rounded-lg flex items-center justify-center relative">
        {/* Show mock chart in the background with blur */}
        <MockChart />
        
        {/* Simple text overlay */}
        <div className="relative z-10 text-center mb-20">
          <div className="text-gray-700 text-sm font-medium">
            Connect wallet to see Earnings Chart
          </div>
        </div>
      </div>
    );
  }

  // Handle insufficient earnings events (1-4 events)
  if (earningsEvents.length < 5) {
    return (
      <div className="h-72 bg-white rounded-lg flex items-center justify-center relative">
        {/* Show mock chart in the background with blur */}
        <MockChart />
        
        {/* Simple text overlay */}
        <div className="relative z-10 text-center mb-20">
          <div className="text-gray-700 text-sm font-medium">
            Chart will appear once 5 yield earning events are registered.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6" style={{ height: "240px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={CustomXAxisTick}
            interval="preserveStartEnd"
            minTickGap={60}
          />
          <YAxis 
            hide
            domain={[0, 'dataMax']}
            scale="linear"
          />

          {/* Keep Tooltip mounted so Recharts sets activeTooltipIndex; hide its UI */}
          <Tooltip contentStyle={{ display: "none" }} cursor={{ stroke: "#10b981", strokeWidth: 1, strokeDasharray: "5,5" }} />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#colorGreen)"
            dot={false}
            activeDot={{ r: 4, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
