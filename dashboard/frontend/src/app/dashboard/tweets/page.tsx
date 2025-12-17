'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Twitter, TrendingUp, TrendingDown, Minus, Filter, ChevronLeft, ChevronRight, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadialBarChart, RadialBar, AreaChart, Area, Treemap, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { tweetData, tweetStats } from '@/lib/tweet-data';

export default function TweetsPage() {
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  // Filter data
  const filteredData = useMemo(() => {
    if (selectedSentiment === 'all') return tweetData;
    return tweetData.filter(item => item.sentiment_label === selectedSentiment);
  }, [selectedSentiment]);

  // Reset page when filter changes
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedSentiment]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Toggle expanded state
  const toggleExpanded = (id: number) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Pie chart data
  const pieData = [
    { name: 'Positive', value: tweetStats.positive, color: '#3C8825' },
    { name: 'Neutral', value: tweetStats.neutral, color: '#C9A66B' },
    { name: 'Negative', value: tweetStats.negative, color: '#B85C4F' },
  ];

  // Timeline data - tweets per day
  const timelineData = useMemo(() => {
    const byDate: Record<string, { date: string; positive: number; neutral: number; negative: number }> = {};

    filteredData.forEach(tweet => {
      try {
        const date = tweet.ts_event.split(' ')[0];
        if (!byDate[date]) {
          byDate[date] = { date, positive: 0, neutral: 0, negative: 0 };
        }
        if (tweet.sentiment_label === 'positive') byDate[date].positive++;
        else if (tweet.sentiment_label === 'neutral') byDate[date].neutral++;
        else byDate[date].negative++;
      } catch (e) {
        // Skip invalid dates
      }
    });

    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
  }, [filteredData]);

  // Radial bar data for gauge chart
  const radialData = [
    { name: 'Sentiment', value: Math.round(((tweetStats.positive - tweetStats.negative) / tweetStats.total) * 100 + 50), fill: '#3C8825' }
  ];

  // Radar chart data
  const radarData = [
    { subject: 'Positive', A: tweetStats.positive, fullMark: tweetStats.total },
    { subject: 'Neutral', A: tweetStats.neutral, fullMark: tweetStats.total },
    { subject: 'Negative', A: tweetStats.negative, fullMark: tweetStats.total },
    { subject: 'Engagement', A: Math.round(tweetStats.total * 0.7), fullMark: tweetStats.total },
    { subject: 'Reach', A: Math.round(tweetStats.total * 0.85), fullMark: tweetStats.total },
  ];

  // Treemap data
  const treemapData = [
    {
      name: 'Sentiment',
      children: [
        { name: 'Positive', size: tweetStats.positive, color: '#3C8825' },
        { name: 'Neutral', size: tweetStats.neutral, color: '#C9A66B' },
        { name: 'Negative', size: tweetStats.negative, color: '#B85C4F' },
      ],
    },
  ];

  // Custom treemap content
  const CustomTreemapContent = ({ x, y, width, height, name, color }: any) => {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: color,
            stroke: '#fff',
            strokeWidth: 2,
          }}
        />
        {width > 50 && height > 30 && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fill: '#fff', fontSize: 12, fontWeight: 'bold' }}
          >
            {name}
          </text>
        )}
      </g>
    );
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-[#3C8825]/10 text-[#3C8825] border-[#3C8825]/30';
      case 'neutral': return 'bg-[#C9A66B]/10 text-[#C9A66B] border-[#C9A66B]/30';
      case 'negative': return 'bg-[#B85C4F]/10 text-[#B85C4F] border-[#B85C4F]/30';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-4 w-4" />;
      case 'neutral': return <Minus className="h-4 w-4" />;
      case 'negative': return <TrendingDown className="h-4 w-4" />;
      default: return null;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr.replace(' ', 'T'));
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch {
      return dateStr;
    }
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Twitter/X Analysis</h1>
        <p className="text-gray-600 mt-2">
          Sentiment analysis of tweets mentioning TD Bank
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Total Tweets</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-[#6B8E7F] flex items-center justify-center">
                <Twitter className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#6B8E7F]">{tweetStats.total}</div>
            <p className="text-sm text-gray-600 mt-1">Analyzed tweets</p>
          </CardContent>
        </Card>

        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Positive</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-[#3C8825] flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#3C8825]">{tweetStats.positive}</div>
            <p className="text-sm text-gray-600 mt-1">
              {Math.round((tweetStats.positive / tweetStats.total) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Neutral</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-[#C9A66B] flex items-center justify-center">
                <Minus className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#C9A66B]">{tweetStats.neutral}</div>
            <p className="text-sm text-gray-600 mt-1">
              {Math.round((tweetStats.neutral / tweetStats.total) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Negative</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-[#B85C4F] flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#B85C4F]">{tweetStats.negative}</div>
            <p className="text-sm text-gray-600 mt-1">
              {Math.round((tweetStats.negative / tweetStats.total) * 100)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <CardTitle className="text-xl text-[#222222]">Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Timeline Chart - Stacked Area */}
        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <CardTitle className="text-xl text-[#222222]">Tweet Activity Timeline</CardTitle>
            <p className="text-sm text-gray-600">Last 14 days of activity</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorPositiveMain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3C8825" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3C8825" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorNeutralMain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A66B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#C9A66B" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorNegativeMain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B85C4F" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#B85C4F" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => value.slice(5)}
                />
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
                <Area
                  type="monotone"
                  dataKey="positive"
                  name="Positive"
                  stackId="1"
                  stroke="#3C8825"
                  fill="url(#colorPositiveMain)"
                />
                <Area
                  type="monotone"
                  dataKey="neutral"
                  name="Neutral"
                  stackId="1"
                  stroke="#C9A66B"
                  fill="url(#colorNeutralMain)"
                />
                <Area
                  type="monotone"
                  dataKey="negative"
                  name="Negative"
                  stackId="1"
                  stroke="#B85C4F"
                  fill="url(#colorNegativeMain)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <Card className="border border-[#D4C4B0] py-0">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Sentiment
                </label>
                <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
                  <SelectTrigger className="border-[#D4C4B0]">
                    <SelectValue placeholder="Select sentiment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sentiments ({tweetStats.total})</SelectItem>
                    <SelectItem value="positive">Positive ({tweetStats.positive})</SelectItem>
                    <SelectItem value="neutral">Neutral ({tweetStats.neutral})</SelectItem>
                    <SelectItem value="negative">Negative ({tweetStats.negative})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Per Page
                </label>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                  setItemsPerPage(parseInt(value));
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-24 border-[#D4C4B0]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tweet List */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <CardTitle className="text-2xl text-[#222222]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Twitter className="h-5 w-5" />
                <span>Tweet Details</span>
              </div>
              <div className="text-sm font-normal text-gray-500">
                {filteredData.length} tweets
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredData.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Twitter className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No tweets found for this filter</p>
            </div>
          ) : (
            paginatedData.map((tweet) => {
              const isExpanded = expandedIds.has(tweet.id);

              return (
                <div key={tweet.id} className="border border-[#D4C4B0] rounded-lg overflow-hidden bg-[#F5F3EE]/30">
                  <button
                    onClick={() => toggleExpanded(tweet.id)}
                    className="w-full p-4 text-left hover:bg-[#F5F3EE]/50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <Twitter className="h-5 w-5 text-[#6B8E7F]" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2 gap-4">
                          <Badge variant="outline" className={`${getSentimentColor(tweet.sentiment_label)} text-xs`}>
                            <span className="mr-1">{getSentimentIcon(tweet.sentiment_label)}</span>
                            {tweet.sentiment_label}
                          </Badge>
                          <div className="flex items-center space-x-3 flex-shrink-0">
                            <div className="text-xs text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(tweet.ts_event)}
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-gray-700">
                          {isExpanded ? tweet.text : truncateText(tweet.text)}
                        </p>

                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-[#D4C4B0] grid grid-cols-3 gap-4 text-xs">
                            <div>
                              <span className="font-medium text-gray-700">Prob Negative:</span>
                              <p className="text-[#B85C4F] mt-1">{(tweet.prob_neg * 100).toFixed(1)}%</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Prob Neutral:</span>
                              <p className="text-[#C9A66B] mt-1">{(tweet.prob_neu * 100).toFixed(1)}%</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Prob Positive:</span>
                              <p className="text-[#3C8825] mt-1">{(tweet.prob_pos * 100).toFixed(1)}%</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })
          )}

          {/* Pagination Controls */}
          {filteredData.length > 0 && totalPages > 1 && (
            <div className="mt-6 pt-6 border-t border-[#D4C4B0]">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of{' '}
                  {filteredData.length} tweets
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="border-[#D4C4B0] disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={
                            currentPage === pageNum
                              ? "bg-[#3C8825] hover:bg-[#3C8825]/90 text-white border-[#3C8825]"
                              : "border-[#D4C4B0] hover:bg-[#F5F3EE]"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="border-[#D4C4B0] disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
