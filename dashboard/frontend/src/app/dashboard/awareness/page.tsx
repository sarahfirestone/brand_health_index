'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, TrendingUp, Rss } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, LineChart, Line, ComposedChart
} from 'recharts';
import { regionalDataSets } from '@/lib/regional-data';
import { regionalBanksDailyData, top5BanksDailyData } from '@/lib/data-loader';

export default function RegionalPage() {
  const [selectedRange, setSelectedRange] = useState('nov9_dec7');

  const currentDataset = regionalDataSets[selectedRange];
  const currentData = currentDataset.data;
  const topStates = currentData.slice(0, 10);

  // Calculate averages
  const avgTD = Math.round(currentData.reduce((sum, s) => sum + s.td, 0) / currentData.length);
  const avgCompetitors = Math.round(
    currentData.reduce((sum, s) => sum + s.chase + s.capitalOne + s.bofa + s.citi, 0) / currentData.length / 4
  );

  // Check if daily data is available for selected range
  const hasDailyData = selectedRange === 'nov9_dec7';

  // Get last 7 days of daily data if available
  const regionalBanksLast7Days = hasDailyData ? regionalBanksDailyData.slice(-7).map(item => {
    const date = new Date(item.date);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      'TD Bank': item.td_bank,
      'PNC': item.pnc,
      'Citizens': item.citizens,
      'U.S. Bancorp': item.us_bancorp,
      'Truist': item.truist
    };
  }) : [];

  const top5BanksLast7Days = hasDailyData ? top5BanksDailyData.slice(-7).map(item => {
    const date = new Date(item.date);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      'TD Bank': item.td_bank,
      'Chase': item.chase_bank,
      'Capital One': item.capital_one,
      'Citibank': item.citibank,
      'Bank of America': item.bank_of_america
    };
  }) : [];

  // Radar chart data for top 5 states
  const radarData = topStates.slice(0, 5).map(state => ({
    state: state.state,
    TD: state.td,
    Chase: state.chase,
    CapitalOne: state.capitalOne,
    BofA: state.bofa,
    Citi: state.citi,
  }));

  // TD Bank only data for focused view
  const tdOnlyData = topStates.map(state => ({
    state: state.state,
    td: state.td,
    avg: state.stateAvg,
  }));

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Regional Performance</h1>
          <p className="text-gray-600 mt-2">
            State-by-state analysis of TD Bank awareness vs competitors
          </p>
        </div>
        <Select value={selectedRange} onValueChange={setSelectedRange}>
          <SelectTrigger className="w-64 border-[#D4C4B0]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(regionalDataSets).map(([key, dataset]) => (
              <SelectItem key={key} value={key}>
                {dataset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">TD Bank Average</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-[#3C8825] flex items-center justify-center">
                <Rss className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#3C8825]">{avgTD}%</div>
            <p className="text-sm text-gray-600 mt-1">Across all states</p>
          </CardContent>
        </Card>

        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Top State</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-[#6B8E7F] flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#6B8E7F]">{topStates[0].state}</div>
            <p className="text-sm text-gray-600 mt-1">{topStates[0].td}% awareness</p>
          </CardContent>
        </Card>

        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Competitor Avg</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-[#C9A66B] flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#C9A66B]">{avgCompetitors}%</div>
            <p className="text-sm text-gray-600 mt-1">Other banks average</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Trends - Only show for Nov 9 - Dec 7 range */}
      {hasDailyData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Regional Banks Daily Trends */}
          <Card className="border border-[#D4C4B0]">
            <CardHeader>
              <CardTitle className="text-xl text-[#222222]">Regional Banks Awareness</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Last 7 days (Google Trends)</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={regionalBanksLast7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="TD Bank" stroke="#3C8825" strokeWidth={2} />
                  <Line type="monotone" dataKey="PNC" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="Citizens" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="U.S. Bancorp" stroke="#ffc658" strokeWidth={2} />
                  <Line type="monotone" dataKey="Truist" stroke="#ff7c7c" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-5 gap-2">
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600">TD Bank</div>
                  <div className="text-lg font-bold text-[#3C8825]">{regionalBanksDailyData[regionalBanksDailyData.length - 1].td_bank}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600">PNC</div>
                  <div className="text-lg font-bold text-[#8884d8]">{regionalBanksDailyData[regionalBanksDailyData.length - 1].pnc}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600">Citizens</div>
                  <div className="text-lg font-bold text-[#82ca9d]">{regionalBanksDailyData[regionalBanksDailyData.length - 1].citizens}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600">U.S. Bank</div>
                  <div className="text-lg font-bold text-[#ffc658]">{regionalBanksDailyData[regionalBanksDailyData.length - 1].us_bancorp}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600">Truist</div>
                  <div className="text-lg font-bold text-[#ff7c7c]">{regionalBanksDailyData[regionalBanksDailyData.length - 1].truist}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top 5 Banks Daily Trends */}
          <Card className="border border-[#D4C4B0]">
            <CardHeader>
              <CardTitle className="text-xl text-[#222222]">Top 5 Banks Awareness</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Last 7 days (Google Trends)</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={top5BanksLast7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="TD Bank" stroke="#3C8825" strokeWidth={2} />
                  <Line type="monotone" dataKey="Chase" stroke="#1e40af" strokeWidth={2} />
                  <Line type="monotone" dataKey="Capital One" stroke="#dc2626" strokeWidth={2} />
                  <Line type="monotone" dataKey="Citibank" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="Bank of America" stroke="#7c3aed" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-5 gap-2">
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600">TD Bank</div>
                  <div className="text-lg font-bold text-[#3C8825]">{top5BanksDailyData[top5BanksDailyData.length - 1].td_bank}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600">Chase</div>
                  <div className="text-lg font-bold text-[#1e40af]">{top5BanksDailyData[top5BanksDailyData.length - 1].chase_bank}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600">Capital One</div>
                  <div className="text-lg font-bold text-[#dc2626]">{top5BanksDailyData[top5BanksDailyData.length - 1].capital_one}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600">Citibank</div>
                  <div className="text-lg font-bold text-[#f59e0b]">{top5BanksDailyData[top5BanksDailyData.length - 1].citibank}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600">BofA</div>
                  <div className="text-lg font-bold text-[#7c3aed]">{top5BanksDailyData[top5BanksDailyData.length - 1].bank_of_america}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top 10 States Chart */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <CardTitle className="text-2xl text-[#222222]">Top 10 States by TD Bank Awareness</CardTitle>
          <p className="text-sm text-gray-600 mt-1">Comparison with major competitors</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={topStates}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="state" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" label={{ value: 'Awareness %', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="td" name="TD Bank" fill="#3C8825" />
              <Bar dataKey="chase" name="Chase" fill="#6B8E7F" />
              <Bar dataKey="capitalOne" name="Capital One" fill="#C9A66B" />
              <Bar dataKey="bofa" name="Bank of America" fill="#B85C4F" />
              <Bar dataKey="citi" name="Citibank" fill="#8B7355" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Supplementary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stacked Bar Chart */}
        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <CardTitle className="text-xl text-[#222222]">Total Awareness by Bank</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Stacked view of all banks</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={topStates}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="state" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="td" name="TD Bank" stackId="a" fill="#3C8825" />
                <Bar dataKey="chase" name="Chase" stackId="a" fill="#6B8E7F" />
                <Bar dataKey="capitalOne" name="Capital One" stackId="a" fill="#C9A66B" />
                <Bar dataKey="bofa" name="Bank of America" stackId="a" fill="#B85C4F" />
                <Bar dataKey="citi" name="Citibank" stackId="a" fill="#8B7355" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* TD Bank Focus - Area Chart */}
        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <CardTitle className="text-xl text-[#222222]">TD Bank vs State Average</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Performance comparison</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={tdOnlyData}>
                <defs>
                  <linearGradient id="tdGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3C8825" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3C8825" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="avgGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A66B" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#C9A66B" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="state" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="td" name="TD Bank" stroke="#3C8825" fill="url(#tdGradient)" />
                <Area type="monotone" dataKey="avg" name="State Avg" stroke="#C9A66B" fill="url(#avgGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* State Details Table */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <CardTitle className="text-2xl text-[#222222]">State-by-State Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D4C4B0]">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">State</th>
                  <th className="text-right py-3 px-4 font-semibold text-[#3C8825]">TD Bank</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">Chase</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">Capital One</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">BofA</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">Citibank</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">State Avg</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((state, index) => (
                  <tr
                    key={`${selectedRange}-${state.state}`}
                    className={`border-b border-[#D4C4B0]/50 ${
                      index % 2 === 0 ? 'bg-[#F5F3EE]/30' : 'bg-white'
                    }`}
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">{state.state}</td>
                    <td className="text-right py-3 px-4 font-bold text-[#3C8825]">{state.td}%</td>
                    <td className="text-right py-3 px-4 text-gray-600">{state.chase}%</td>
                    <td className="text-right py-3 px-4 text-gray-600">{state.capitalOne}%</td>
                    <td className="text-right py-3 px-4 text-gray-600">{state.bofa}%</td>
                    <td className="text-right py-3 px-4 text-gray-600">{state.citi}%</td>
                    <td className="text-right py-3 px-4 text-gray-700">{state.stateAvg.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
