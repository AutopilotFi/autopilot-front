import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  XAxis,
  YAxis,
  Line,
  Area,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

import { VaultHistoryEntry } from "@/types/globalAppTypes";

interface SharepriceChartProps {
  uniqueVaultHData?: VaultHistoryEntry[];
}

interface ChartDataPoint {
  x: number;
  y: number;
  timestamp: string;
}

const SharepriceChart: React.FC<SharepriceChartProps> = ({
  uniqueVaultHData
}) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uniqueVaultHData || uniqueVaultHData.length === 0) {
      setLoading(false);
      return;
    }

    // Process the data for the chart
    const processedData: ChartDataPoint[] = uniqueVaultHData
      .map((entry) => {
        const timestamp = entry.timestamp * 1000; // Convert to milliseconds
        const sharePrice = parseFloat(String(entry.sharePrice || '1'));
        
        return {
          x: timestamp,
          y: sharePrice,
          timestamp: new Date(timestamp).toISOString()
        };
      })
      .sort((a, b) => a.x - b.x); // Sort by timestamp ascending

    setChartData(processedData);
    setLoading(false);
  }, [uniqueVaultHData]);

  const formatXAxis = (value: number) => {
    const date = new Date(value);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  const formatYAxis = (value: number) => {
    return value.toFixed(5); // Match the precision from the design
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: unknown[] }) => {
    if (active && payload && payload.length) {
      const data = (payload[0] as { payload: ChartDataPoint }).payload;
      const date = new Date(data.x).toLocaleDateString();
      const sharePrice = data.y.toFixed(5);
      
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm text-gray-600">{date}</p>
          <p className="text-sm font-medium text-gray-900">
            {sharePrice}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Share price data not available</p>
      </div>
    );
  }

  // Calculate min and max values for Y-axis with proper spacing
  const yValues = chartData.map(d => d.y);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  
  // Create evenly spaced Y-axis ticks like in the design
  const range = maxY - minY;
  const tickCount = 5;
  const tickStep = range / (tickCount - 1);
  const yAxisTicks = Array.from({ length: tickCount }, (_, i) => {
    const value = minY + (i * tickStep);
    return parseFloat(value.toFixed(5));
  });

  return (
    <div className="w-full h-[28rem] bg-white rounded-lg border border-gray-200 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="sharePriceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="0" 
            stroke="rgba(228, 228, 228, 0.3)" 
            vertical={false}
            horizontal={true}
          />
          <XAxis
            dataKey="x"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            tickFormatter={formatXAxis}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            interval="preserveStartEnd"
            minTickGap={50}
          />
          <YAxis
            dataKey="y"
            domain={[minY, maxY]}
            tickFormatter={formatYAxis}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            ticks={yAxisTicks}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="y"
            stroke="#22C55E"
            strokeWidth={2}
            fill="url(#sharePriceGradient)"
          />
          <Line
            type="monotone"
            dataKey="y"
            stroke="#22C55E"
            strokeWidth={2.5}
            dot={false}
            strokeLinecap="round"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SharepriceChart;
