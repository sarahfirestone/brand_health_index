'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity } from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  ZAxis,
  RadialBarChart,
  RadialBar
} from 'recharts';
import {
  engagementStockData,
  getEngagementStockChartData,
  getAverageStockPrice,
  getTotalVolume,
  getPriceChange,
  getLatestEngagementStock
} from '@/lib/engagement-data';

export default function EngagementPage() {
  const chartData = getEngagementStockChartData();
  const avgPrice = getAverageStockPrice();
  const totalVolume = getTotalVolume();
  const priceChange = getPriceChange();
  const latest = getLatestEngagementStock();

  // Format volume for display
  const formatVolume = (vol: number) => {
    if (vol >= 1000000) {
      return `${(vol / 1000000).toFixed(1)}M`;
    }
    return `${(vol / 1000).toFixed(0)}K`;
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stock Engagement</h1>
        <p className="text-gray-600 mt-2">
          TD Bank stock performance analysis (Sept 28 - Nov 9, 2025)
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Latest Close</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-[#3C8825] flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#3C8825]">${latest.close.toFixed(2)}</div>
            <p className="text-sm text-gray-600 mt-1">Week of Nov 9</p>
          </CardContent>
        </Card>

        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Price Change</CardTitle>
              <div className={`h-10 w-10 rounded-lg ${priceChange.value >= 0 ? 'bg-[#6B8E7F]' : 'bg-[#B85C4F]'} flex items-center justify-center`}>
                {priceChange.value >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-white" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-white" />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${priceChange.value >= 0 ? 'text-[#6B8E7F]' : 'text-[#B85C4F]'}`}>
              {priceChange.value >= 0 ? '+' : ''}{priceChange.percentage}%
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {priceChange.value >= 0 ? '+' : ''}${priceChange.value} from start
            </p>
          </CardContent>
        </Card>

        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Avg Price</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-[#C9A66B] flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#C9A66B]">${avgPrice}</div>
            <p className="text-sm text-gray-600 mt-1">7-week average</p>
          </CardContent>
        </Card>

        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Total Volume</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-[#8B7355] flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#8B7355]">{formatVolume(totalVolume)}</div>
            <p className="text-sm text-gray-600 mt-1">Shares traded</p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Price Chart */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <CardTitle className="text-2xl text-[#222222]">Stock Price Trend</CardTitle>
          <p className="text-sm text-gray-600 mt-1">Weekly open, high, low, close prices</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
              />
              <Legend />
              <Line type="monotone" dataKey="high" name="High" stroke="#3C8825" strokeWidth={2} dot={{ fill: '#3C8825' }} />
              <Line type="monotone" dataKey="close" name="Close" stroke="#6B8E7F" strokeWidth={2} dot={{ fill: '#6B8E7F' }} />
              <Line type="monotone" dataKey="open" name="Open" stroke="#C9A66B" strokeWidth={2} dot={{ fill: '#C9A66B' }} />
              <Line type="monotone" dataKey="low" name="Low" stroke="#B85C4F" strokeWidth={2} dot={{ fill: '#B85C4F' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Volume and Score Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Volume Chart - Composed with Score */}
        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <CardTitle className="text-xl text-[#222222]">Trading Volume</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Weekly trading activity with engagement score</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" stroke="#9ca3af" />
                <YAxis yAxisId="left" stroke="#9ca3af" tickFormatter={(value) => formatVolume(value)} />
                <YAxis yAxisId="right" orientation="right" stroke="#6B8E7F" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="volume" name="Volume" fill="#3C8825" />
                <Line yAxisId="right" type="monotone" dataKey="score" name="Score" stroke="#6B8E7F" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Score Chart - Stacked Area */}
        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <CardTitle className="text-xl text-[#222222]">Engagement Score</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Weekly engagement metric</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="scoreHighGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3C8825" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#3C8825" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="scoreCloseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6B8E7F" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#6B8E7F" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                />
                <Legend />
                <Area type="monotone" dataKey="high" name="High" stroke="#3C8825" fill="url(#scoreHighGradient)" />
                <Area type="monotone" dataKey="close" name="Close" stroke="#6B8E7F" fill="url(#scoreCloseGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Details Table */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <CardTitle className="text-2xl text-[#222222]">Weekly Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D4C4B0]">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Week</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">Open</th>
                  <th className="text-right py-3 px-4 font-semibold text-[#3C8825]">High</th>
                  <th className="text-right py-3 px-4 font-semibold text-[#B85C4F]">Low</th>
                  <th className="text-right py-3 px-4 font-semibold text-[#6B8E7F]">Close</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">Volume</th>
                  <th className="text-right py-3 px-4 font-semibold text-[#C9A66B]">Score</th>
                </tr>
              </thead>
              <tbody>
                {engagementStockData.map((item, index) => {
                  const date = new Date(item.sunday);
                  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  return (
                    <tr
                      key={item.sunday}
                      className={`border-b border-[#D4C4B0]/50 ${
                        index % 2 === 0 ? 'bg-[#F5F3EE]/30' : 'bg-white'
                      }`}
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">{formattedDate}</td>
                      <td className="text-right py-3 px-4 text-gray-600">${item.open.toFixed(2)}</td>
                      <td className="text-right py-3 px-4 text-[#3C8825]">${item.high.toFixed(2)}</td>
                      <td className="text-right py-3 px-4 text-[#B85C4F]">${item.low.toFixed(2)}</td>
                      <td className="text-right py-3 px-4 font-bold text-[#6B8E7F]">${item.close.toFixed(2)}</td>
                      <td className="text-right py-3 px-4 text-gray-600">{formatVolume(item.volume)}</td>
                      <td className="text-right py-3 px-4 font-bold text-[#C9A66B]">{item.score}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
