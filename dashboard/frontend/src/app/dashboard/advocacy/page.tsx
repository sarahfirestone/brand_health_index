'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Rss, TrendingUp, TrendingDown, Minus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadialBarChart, RadialBar, AreaChart, Area, Treemap, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { advocacyData, advocacyStats } from '@/lib/advocacy-data';

export default function AdvocacyPage() {
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Filter data
  const filteredData = useMemo(() => {
    if (selectedSentiment === 'all') return advocacyData;
    return advocacyData.filter(item => item.sentiment_label === selectedSentiment);
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

  // Pie chart data
  const pieData = [
    { name: 'Positive', value: advocacyStats.positive, color: '#3C8825' },
    { name: 'Neutral', value: advocacyStats.neutral, color: '#C9A66B' },
    { name: 'Negative', value: advocacyStats.negative, color: '#B85C4F' },
  ];

  // Bar chart data for probability distribution
  const probDistribution = useMemo(() => {
    const ranges = [
      { range: '0-20%', pos: 0, neu: 0, neg: 0 },
      { range: '20-40%', pos: 0, neu: 0, neg: 0 },
      { range: '40-60%', pos: 0, neu: 0, neg: 0 },
      { range: '60-80%', pos: 0, neu: 0, neg: 0 },
      { range: '80-100%', pos: 0, neu: 0, neg: 0 },
    ];

    filteredData.forEach(item => {
      // Classify by dominant probability
      const maxProb = Math.max(item.prob_pos, item.prob_neu, item.prob_neg);
      let rangeIndex = Math.min(Math.floor(maxProb * 5), 4);

      if (item.sentiment_label === 'positive') ranges[rangeIndex].pos++;
      else if (item.sentiment_label === 'neutral') ranges[rangeIndex].neu++;
      else ranges[rangeIndex].neg++;
    });

    return ranges;
  }, [filteredData]);

  // Radial bar data for gauge chart
  const radialData = [
    { name: 'Sentiment', value: Math.round(((advocacyStats.positive - advocacyStats.negative) / advocacyStats.total) * 100 + 50), fill: '#3C8825' }
  ];

  // Radar chart data
  const radarData = [
    { subject: 'Positive', A: advocacyStats.positive, fullMark: advocacyStats.total },
    { subject: 'Neutral', A: advocacyStats.neutral, fullMark: advocacyStats.total },
    { subject: 'Negative', A: advocacyStats.negative, fullMark: advocacyStats.total },
  ];

  // Treemap data
  const treemapData = [
    {
      name: 'Sentiment',
      children: [
        { name: 'Positive', size: advocacyStats.positive, color: '#3C8825' },
        { name: 'Neutral', size: advocacyStats.neutral, color: '#C9A66B' },
        { name: 'Negative', size: advocacyStats.negative, color: '#B85C4F' },
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

  const formatProbability = (prob: number) => {
    return (prob * 100).toFixed(1) + '%';
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Advocacy News Analysis</h1>
        <p className="text-gray-600 mt-2">
          Sentiment analysis of advocacy-related news articles
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Total Articles</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-[#6B8E7F] flex items-center justify-center">
                <Rss className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#6B8E7F]">{advocacyStats.total}</div>
            <p className="text-sm text-gray-600 mt-1">Analyzed articles</p>
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
            <div className="text-3xl font-bold text-[#3C8825]">{advocacyStats.positive}</div>
            <p className="text-sm text-gray-600 mt-1">
              {Math.round((advocacyStats.positive / advocacyStats.total) * 100)}% of total
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
            <div className="text-3xl font-bold text-[#C9A66B]">{advocacyStats.neutral}</div>
            <p className="text-sm text-gray-600 mt-1">
              {Math.round((advocacyStats.neutral / advocacyStats.total) * 100)}% of total
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
            <div className="text-3xl font-bold text-[#B85C4F]">{advocacyStats.negative}</div>
            <p className="text-sm text-gray-600 mt-1">
              {Math.round((advocacyStats.negative / advocacyStats.total) * 100)}% of total
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

        {/* Bar Chart */}
        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <CardTitle className="text-xl text-[#222222]">Confidence Distribution</CardTitle>
            <p className="text-sm text-gray-600">Articles grouped by max probability score</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={probDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" stroke="#9ca3af" />
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
                <Bar dataKey="pos" name="Positive" fill="#3C8825" />
                <Bar dataKey="neu" name="Neutral" fill="#C9A66B" />
                <Bar dataKey="neg" name="Negative" fill="#B85C4F" />
              </BarChart>
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
                    <SelectItem value="all">All Sentiments ({advocacyStats.total})</SelectItem>
                    <SelectItem value="positive">Positive ({advocacyStats.positive})</SelectItem>
                    <SelectItem value="neutral">Neutral ({advocacyStats.neutral})</SelectItem>
                    <SelectItem value="negative">Negative ({advocacyStats.negative})</SelectItem>
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

      {/* Data Table */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <CardTitle className="text-2xl text-[#222222]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Rss className="h-5 w-5" />
                <span>Sentiment Analysis Results</span>
              </div>
              <div className="text-sm font-normal text-gray-500">
                {filteredData.length} articles
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredData.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Rss className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No articles found for this filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-mono text-xs">ID</TableHead>
                    <TableHead className="font-mono text-xs">Sentiment</TableHead>
                    <TableHead className="font-mono text-xs">Score</TableHead>
                    <TableHead className="font-mono text-xs">Prob Negative</TableHead>
                    <TableHead className="font-mono text-xs">Prob Neutral</TableHead>
                    <TableHead className="font-mono text-xs">Prob Positive</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono text-xs">{item.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getSentimentColor(item.sentiment_label)} text-xs`}>
                          <span className="mr-1">{getSentimentIcon(item.sentiment_label)}</span>
                          {item.sentiment_label}
                        </Badge>
                      </TableCell>
                      <TableCell className={`font-mono text-xs ${
                        item.sentiment_numeric === 1 ? 'text-[#3C8825]' :
                        item.sentiment_numeric === -1 ? 'text-[#B85C4F]' : 'text-gray-600'
                      }`}>
                        {item.sentiment_numeric}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-[#B85C4F]">
                        {formatProbability(item.prob_neg)}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-[#C9A66B]">
                        {formatProbability(item.prob_neu)}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-[#3C8825]">
                        {formatProbability(item.prob_pos)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredData.length > 0 && totalPages > 1 && (
            <div className="mt-6 pt-6 border-t border-[#D4C4B0]">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 pb-6">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of{' '}
                  {filteredData.length} articles
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
