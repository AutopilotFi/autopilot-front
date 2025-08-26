"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ProjectData } from '@/types/globalAppTypes';
import { formatBalance } from '@/helpers/utils';

interface EarningsChartProps {
  currentProjectData: ProjectData;
  timeframe: '1m' | '7d' | 'all';
  onTimeframeChange: (timeframe: '1m' | '7d' | 'all') => void;
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

export default function EarningsChart({ currentProjectData, timeframe, onTimeframeChange }: EarningsChartProps) {
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [hoveredData, setHoveredData] = useState<ChartDataPoint | null>(null);

  const chartData = useMemo(() => {
    if (!currentProjectData.recentEarnings || currentProjectData.recentEarnings.length === 0) {
      return [];
    }

    const now = Date.now();
    
    const allSortedEarnings = [...currentProjectData.recentEarnings].sort((a, b) => parseInt(a.time) - parseInt(b.time));
    
    let totalCumulativeAmount = 0;
    let totalCumulativeUsd = 0;
    const allDataPoints = allSortedEarnings.map((earning) => {
      totalCumulativeAmount += earning.amount;
      totalCumulativeUsd += earning.amountUsd;
      return {
        timestamp: parseInt(earning.time) * 1000,
        value: totalCumulativeAmount,
        valueUsd: totalCumulativeUsd,
        amount: earning.amount,
        amountUsd: earning.amountUsd
      };
    });

    let startTime: number;
    let filteredDataPoints = allDataPoints;
    
    if (timeframe === 'all') {
      startTime = allDataPoints.length > 0 ? allDataPoints[0].timestamp : now;
      filteredDataPoints = allDataPoints;
    } else {
      const timeframeDays = timeframe === '1m' ? 30 : 7;
      const cutoffTime = now - (timeframeDays * 24 * 60 * 60 * 1000);
      startTime = cutoffTime;
      
      filteredDataPoints = allDataPoints.filter(point => point.timestamp >= cutoffTime);
    }

    if (filteredDataPoints.length === 0 && timeframe !== 'all') {
      filteredDataPoints = allDataPoints;
    }

    let baselineValue = 0;
    if (timeframe !== 'all') {
      for (let i = allDataPoints.length - 1; i >= 0; i--) {
        if (allDataPoints[i].timestamp <= startTime) {
          baselineValue = allDataPoints[i].value;
          break;
        }
      }
    }

    const endTime = now;
    const numberOfPoints = timeframe === '7d' ? 8 : timeframe === '1m' ? 15 : 20;
    const timeStep = (endTime - startTime) / (numberOfPoints - 1);

    const linearData: ChartDataPoint[] = [];
    
    for (let i = 0; i < numberOfPoints; i++) {
      const currentTime = startTime + (i * timeStep);
      const dateObj = new Date(currentTime);
      
      let interpolatedValue = baselineValue;
      let interpolatedUsdValue = 0;
      
      for (let j = allDataPoints.length - 1; j >= 0; j--) {
        if (allDataPoints[j].timestamp <= currentTime) {
          interpolatedValue = allDataPoints[j].value;
          interpolatedUsdValue = allDataPoints[j].valueUsd;
          break;
        }
      }
      
      linearData.push({
        date: `${dateObj.getMonth() + 1}/${dateObj.getDate()}`,
        value: interpolatedValue,
        valueUsd: interpolatedUsdValue,
        timestamp: currentTime,
        amount: 0,
        amountUsd: 0,
        formattedDate: dateObj.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: currentTime < now - (365 * 24 * 60 * 60 * 1000) ? 'numeric' : undefined 
        })
      });
    }

    return linearData;
  }, [currentProjectData.recentEarnings, timeframe]);

  useEffect(() => {
    if (chartData.length > 0) {
      const latestData = chartData[chartData.length - 1];
      setCurrentValue(latestData.value);
      setCurrentDate(latestData.formattedDate);
    }
  }, [chartData]);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartDataPoint }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      setHoveredData(data);
    } else {
      setHoveredData(null);
    }
    return null;
  };

  useEffect(() => {
    if (hoveredData) {
      setCurrentValue(hoveredData.value);
      setCurrentDate(hoveredData.formattedDate);
    } else if (chartData.length > 0) {
      const latestData = chartData[chartData.length - 1];
      setCurrentValue(latestData.value);
      setCurrentDate(latestData.formattedDate);
    }
  }, [hoveredData, chartData]);

  const CustomXAxisTick = ({ x, y, payload }: { x: number; y: number; payload: { value: string } }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#9ca3af"
          fontSize="12"
          fontWeight="400"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  if (chartData.length === 0) {
    return (
      <div className="h-72 bg-white rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">No Earnings Data</div>
          <p className="text-gray-400 text-sm">Start earning to see your chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white">
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-semibold text-gray-900 mb-2">
              Earnings
            </div>
            <div className="text-2xl font-bold text-green-500">
              {formatBalance(currentValue, currentProjectData.asset, currentProjectData.showDecimals)}
            </div>
            {currentDate && (
              <div className="text-sm text-gray-500 mt-1">
                {currentDate}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {(['7d', '1m', 'all'] as const).map(period => (
              <button
                key={period}
                onClick={() => onTimeframeChange(period)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeframe === period
                  ? 'bg-[#9159FF] text-white'
                  : 'text-[#9159FF] hover:text-[#7c3aed] hover:bg-purple-50'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6" style={{ height: '240px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 10,
            }}
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
              minTickGap={40}
            />
            
            <YAxis hide />
            
            <Tooltip 
              content={CustomTooltip}
              cursor={{
                stroke: '#10b981',
                strokeWidth: 1,
                strokeDasharray: '5,5'
              }}
            />
            
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorGreen)"
              dot={false}
              activeDot={{
                r: 4,
                fill: '#10b981',
                stroke: '#ffffff',
                strokeWidth: 2
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
