'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  TrendingUp,
  Users,
  Heart,
  MapPin,
  ArrowRight,
  Bot,
  ThumbsUp,
  BarChart3,
  Globe,
  X,
  Send,
  Info
} from 'lucide-react';
import { AreaChart, Area, LineChart, Line, Bar, ComposedChart, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar } from 'recharts';
import {
  getSentimentPercentages,
  getWeeklyChartData,
  scoreData,
  sentimentData as sentimentDataFromLoader
} from '@/lib/data-loader';
import { regionalDataSets } from '@/lib/regional-data';

// Load real data from CSV files
const weeklyBrandData = getWeeklyChartData();
const sentimentPercentages = getSentimentPercentages();

// Create engagement chart data from score data (3 weeks)
const engagementData = scoreData.map((item) => {
  const date = new Date(item.date);
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return {
    week: monthDay,
    value: Math.round(item.engagement),
    date: item.date
  };
});

// Create chart data for sentiment and advocacy
const sentimentChartData = scoreData.map((item) => {
  const date = new Date(item.date);
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return {
    week: monthDay,
    value: Math.round(item.sentiment),
    date: item.date
  };
});

const advocacyChartData = scoreData.map((item) => {
  const date = new Date(item.date);
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return {
    week: monthDay,
    value: Math.round(item.advocacy),
    date: item.date
  };
});

const awarenessChartData = scoreData.map((item) => {
  const date = new Date(item.date);
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return {
    week: monthDay,
    value: Math.round(item.awareness),
    date: item.date
  };
});

// Multi-metric comparison data
const multiMetricData = scoreData.map((item) => {
  const date = new Date(item.date);
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return {
    week: monthDay,
    Engagement: Math.round(item.engagement),
    Sentiment: Math.round(item.sentiment),
    Awareness: Math.round(item.awareness),
    Advocacy: Math.round(item.advocacy)
  };
});

// Weighted scores comparison data
const weightedScoresData = scoreData.map((item) => {
  const date = new Date(item.date);
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return {
    week: monthDay,
    'Base Score': Math.round(item.weekly_score),
    'Regional': Math.round(item.weekly_score_regional),
    'Volume': Math.round(item.weekly_score_volume)
  };
});

// Radar chart data for latest metrics - 4 main buckets
const latestScoreForRadar = scoreData[scoreData.length - 1];
const radarData = [
  { metric: 'Engagement', value: Math.round(latestScoreForRadar.engagement), fullMark: 100 },
  { metric: 'Sentiment', value: Math.round(latestScoreForRadar.sentiment), fullMark: 100 },
  { metric: 'Awareness', value: Math.round(latestScoreForRadar.awareness), fullMark: 100 },
  { metric: 'Advocacy', value: Math.round(latestScoreForRadar.advocacy), fullMark: 100 }
];


// Map score dates to regional dataset keys
const dateToRegionalKey: Record<string, string> = {
  '2025-09-28': 'aug31_sep28',
  '2025-10-05': 'sep7_oct5',
  '2025-10-12': 'sep14_oct12',
  '2025-10-19': 'sep21_oct19',
  '2025-10-26': 'sep28_oct26',
  '2025-11-02': 'oct5_nov2',
  '2025-11-09': 'oct12_nov9',
};

// Score type options for the dropdown
const scoreTypeOptions = [
  { value: 'weekly_score', label: 'Base Score' },
  { value: 'weekly_score_regional', label: 'Regional Score' },
  { value: 'weekly_score_volume', label: 'Volume Score' },
  { value: 'weekly_score_volume_regional', label: 'Volume + Regional Score' }
];

export default function DashboardPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(scoreData.length - 1); // Default to latest week
  const [selectedScoreType, setSelectedScoreType] = useState<string>('weekly_score');

  // Generate dynamic chart data based on selected score type
  const dynamicWeeklyBrandData = scoreData.map((item) => {
    const date = new Date(item.date);
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      week: monthDay,
      score: Math.round(item[selectedScoreType as keyof typeof item] as number),
      date: item.date,
      fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  });

  // Get data for the selected week
  const selectedScore = scoreData[selectedWeekIndex];

  // Find matching sentiment data by date
  const selectedSentiment = sentimentDataFromLoader.find(s => s.date === selectedScore.date) || sentimentDataFromLoader[sentimentDataFromLoader.length - 1];

  const overallScore = Math.round(selectedScore[selectedScoreType as keyof typeof selectedScore] as number);

  // Calculate week change dynamically based on selected week
  const previousScore = selectedWeekIndex > 0 ? scoreData[selectedWeekIndex - 1] : null;
  const weekChange = previousScore
    ? Math.round(selectedScore[selectedScoreType as keyof typeof selectedScore] as number - (previousScore[selectedScoreType as keyof typeof previousScore] as number))
    : 0;

  const engagementScore = Math.round(selectedScore.engagement);
  const sentimentScore = Math.round(selectedSentiment.score);
  const awarenessScore = Math.round(selectedScore.awareness);
  const advocacyScore = Math.round(selectedScore.advocacy);
  const regionalAwareness = Math.round(selectedScore.regional_awareness);
  const volumeSentiment = Math.round(selectedScore.volume_sentiment);
  const regionalScore = Math.round(selectedScore.weekly_score_regional);
  const volumeScore = Math.round(selectedScore.weekly_score_volume);

  // Get regional data for selected week - top 5 states by TD Bank awareness
  const regionalKey = dateToRegionalKey[selectedScore.date] || 'oct12_nov9';
  const regionalDataForWeek = regionalDataSets[regionalKey]?.data || [];
  const topStatesForWeek = regionalDataForWeek
    .slice(0, 5)
    .map(state => ({
      state: state.state.length > 2
        ? state.state.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
        : state.state,
      fullName: state.state,
      value: state.td
    }));

  // Calculate sentiment percentages for selected week
  const selectedSentimentPercentages = {
    positive: Math.round((selectedSentiment.positive_tweets / selectedSentiment.total_tweets) * 100),
    neutral: Math.round((selectedSentiment.neutral_tweets / selectedSentiment.total_tweets) * 100),
    negative: Math.round((selectedSentiment.negative_tweets / selectedSentiment.total_tweets) * 100)
  };

  // Dynamic sentiment data based on selected week
  const dynamicSentimentData = [
    { label: 'Positive', value: selectedSentimentPercentages.positive, color: 'bg-[#6B8E7F]' },
    { label: 'Neutral', value: selectedSentimentPercentages.neutral, color: 'bg-[#C9A66B]' },
    { label: 'Negative', value: selectedSentimentPercentages.negative, color: 'bg-[#B85C4F]' },
  ];

  // Handler for chart click to select a week
  const handleChartClick = (data: { activePayload?: Array<{ payload: { date: string } }> }) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const clickedDate = data.activePayload[0].payload.date;
      const index = scoreData.findIndex(item => item.date === clickedDate);
      if (index !== -1) {
        setSelectedWeekIndex(index);
      }
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: inputValue }]);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I can help you analyze your brand metrics. This is a demo response. In production, this would connect to an AI service.'
      }]);
    }, 1000);

    setInputValue('');
  };

  const handleQuickInsight = (question: string) => {
    setChatOpen(true);
    setChatMinimized(false);
    setMessages([
      { role: 'user', content: question },
      {
        role: 'assistant',
        content: question.includes('increase')
          ? 'The brand score increased by 6 points due to positive sentiment around your recent customer service improvements. Social media mentions rose by 24% with predominantly positive feedback.'
          : question.includes('competitor')
          ? 'Compared to competitors, TD Bank leads in customer satisfaction scores. Your Net Promoter Score is 15 points higher than the industry average.'
          : 'Your regional awareness is particularly strong at 87%, indicating excellent market penetration in key geographic areas.'
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-white p-6 relative">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Image
              src="/Toronto-Dominion_Bank_logo.svg.png"
              alt="TD Bank"
              width={180}
              height={60}
              className="h-16 w-auto"
              priority
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-bold text-[#222222]">Brand Performance</h1>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                      <Info className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <div className="text-xs space-y-1">
                      <p className="font-semibold">TD Brand Health Index (BHI)</p>
                      <p>A weekly metric measuring brand perception and reputation using:</p>
                      <ul className="list-disc list-inside space-y-0.5 mt-1">
                        <li><strong>Sentiment:</strong> Social media data (Twitter/Reddit)</li>
                        <li><strong>Engagement:</strong> Stock market activity</li>
                        <li><strong>Awareness:</strong> Google search trends</li>
                        <li><strong>Advocacy:</strong> News headlines sentiment</li>
                      </ul>
                      <p className="mt-2 font-semibold">Formula: BHI = Sentiment + Engagement + Advocacy + Awareness</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                value={selectedWeekIndex.toString()}
                onValueChange={(value) => setSelectedWeekIndex(parseInt(value))}
              >
                <SelectTrigger className="w-48 mt-1 border-[#D4C4B0] text-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {scoreData.map((item, index) => {
                    const date = new Date(item.date);
                    const formattedDate = date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                    return (
                      <SelectItem key={item.date} value={index.toString()}>
                        Week of {formattedDate}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="border border-[#D4C4B0] bg-white w-56">
            <CardContent className="pt-3 pb-3 text-center flex flex-col items-center">
              <div className="text-xs font-medium text-gray-600 mb-1">Overall Score</div>
              <div className="text-4xl font-bold text-[#3C8825]">
                {overallScore}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Week of {new Date(selectedScore.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              {previousScore ? (
                <Badge variant="outline" className={`mt-1.5 text-xs inline-flex items-center ${weekChange >= 0 ? 'border-[#3C8825] text-[#3C8825]' : 'border-[#B85C4F] text-[#B85C4F]'}`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {weekChange >= 0 ? '+' : ''}{weekChange} from last week
                </Badge>
              ) : (
                <Badge variant="outline" className="mt-1.5 border-gray-400 text-gray-500 text-xs inline-flex items-center">
                  First week
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">

            {/* Weekly Brand Index */}
            <Card className="border border-[#D4C4B0]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-2xl text-[#222222]">Weekly Brand Index</CardTitle>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                            <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="text-xs">
                            Time series tracking the overall brand health index score across weeks. Select different score types to compare calculation methods.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Performance over the last 7 weeks</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                          <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        <div className="text-xs space-y-1">
                          <p><strong>Base Score:</strong> Equal weight to all 4 metrics (Sentiment, Engagement, Awareness, Advocacy)</p>
                          <p><strong>Regional Score:</strong> Adjusts awareness to compare TD Bank vs. regional competitors</p>
                          <p><strong>Volume Score:</strong> Includes social media volume in perception calculation</p>
                          <p><strong>Volume + Regional:</strong> Combines regional and volume adjustments</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                    <Select value={selectedScoreType} onValueChange={setSelectedScoreType}>
                      <SelectTrigger className="w-52 border-[#D4C4B0]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {scoreTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={dynamicWeeklyBrandData}
                    onClick={handleChartClick}
                  >
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5DBB46" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#5DBB46" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#5DBB46"
                      strokeWidth={3}
                      fill="url(#colorScore)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Multi-Metric Comparison */}
            <Card className="border border-[#D4C4B0]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-2xl text-[#222222]">Brand Metrics Comparison</CardTitle>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                            <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="text-xs">
                            Compares all 4 key metrics side-by-side with equal weight (25% each). Shows how each component contributes to overall brand health.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Track all key metrics together</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={multiMetricData}
                    onClick={handleChartClick}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="Engagement" stroke="#C9A66B" strokeWidth={2} />
                    <Line type="monotone" dataKey="Sentiment" stroke="#B85C4F" strokeWidth={2} />
                    <Line type="monotone" dataKey="Awareness" stroke="#6B8E7F" strokeWidth={2} />
                    <Line type="monotone" dataKey="Advocacy" stroke="#8B7355" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weighted Scores Comparison - Split into two charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Composed Chart */}
              <Card className="border border-[#D4C4B0]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl text-[#222222]">Weighted Score Trends</CardTitle>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                              <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            <p className="text-xs">
                              Compares 3 different scoring methodologies to show how regional and volume adjustments impact the final brand health index.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Compare weighting strategies</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={weightedScoresData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="week" stroke="#9ca3af" />
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
                      <Bar dataKey="Base Score" fill="#3C8825" />
                      <Line type="monotone" dataKey="Regional" stroke="#6B8E7F" strokeWidth={2} />
                      <Line type="monotone" dataKey="Volume" stroke="#C9A66B" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Radar Chart */}
              <Card className="border border-[#D4C4B0]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl text-[#222222]">Metrics Overview</CardTitle>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                              <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="max-w-xs">
                            <p className="text-xs">
                              Radar chart snapshot of the current week's performance across all 4 metrics. Shows relative strength of each component.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Current performance snapshot</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                      <PolarGrid stroke="#D4C4B0" />
                      <PolarAngleAxis dataKey="metric" stroke="#9ca3af" tick={{ fontSize: 11, fill: '#6b7280' }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#9ca3af" tickCount={6} />
                      <Radar name="Score" dataKey="value" stroke="#3C8825" strokeWidth={2} fill="#3C8825" fillOpacity={0.25} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border border-[#D4C4B0]">
              <CardHeader>
                <CardTitle className="text-xl text-[#222222]">Quick Insights</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => handleQuickInsight('Why did scores increase?')}
                  className="text-left px-4 py-3 rounded-md bg-[#3C8825]/10 hover:bg-[#3C8825]/20 transition-all text-sm border border-[#3C8825]/30 text-gray-700"
                >
                  Why did scores increase?
                </button>
                <button
                  onClick={() => handleQuickInsight('Compare to competitors')}
                  className="text-left px-4 py-3 rounded-md bg-[#3C8825]/10 hover:bg-[#3C8825]/20 transition-all text-sm border border-[#3C8825]/30 text-gray-700"
                >
                  Compare to competitors
                </button>
                <button
                  onClick={() => handleQuickInsight('Regional breakdown')}
                  className="text-left px-4 py-3 rounded-md bg-[#3C8825]/10 hover:bg-[#3C8825]/20 transition-all text-sm border border-[#3C8825]/30 text-gray-700"
                >
                  Regional breakdown
                </button>
                <Link href="/dashboard/faq" className="col-span-1 md:col-span-3">
                  <Button variant="outline" className="w-full border-[#D4C4B0] text-gray-700 hover:bg-gray-50">
                    <Globe className="h-4 w-4 mr-2" />
                    View FAQ & Help
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">

            {/* Engagement */}
            <Card className="border border-[#D4C4B0]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-[#C9A66B] flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <CardTitle className="text-[#222222]">Engagement</CardTitle>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="p-0.5">
                              <Info className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            <p className="text-xs">
                              Looks financially at how engagement in TD Bank changes weekly using stock data from Yahoo Finance. Measures investor interest and market activity.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Week of {new Date(selectedScore.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-[#C9A66B]">{engagementScore}%</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={engagementData}>
                    <defs>
                      <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9A66B" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#C9A66B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="week" hide />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      labelFormatter={(label) => label}
                      formatter={(value: number) => [value, 'Engagement']}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#C9A66B"
                      strokeWidth={2}
                      fill="url(#engagementGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sentiment / Perceptions */}
            <Card className="border border-[#D4C4B0]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-[#B85C4F] flex items-center justify-center">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <CardTitle className="text-[#222222]">Perceptions</CardTitle>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="p-0.5">
                              <Info className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            <p className="text-xs">
                              How the world views TD Bank by analyzing sentiment from Twitter and Reddit data. Tracks positive, neutral, and negative mentions.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Week of {new Date(selectedScore.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-[#B85C4F]">{sentimentScore}%</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={sentimentChartData}>
                    <defs>
                      <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#B85C4F" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#B85C4F" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="week" hide />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      labelFormatter={(label) => label}
                      formatter={(value: number) => [value, 'Sentiment']}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#B85C4F"
                      strokeWidth={2}
                      fill="url(#sentimentGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {dynamicSentimentData.map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">{item.label}</span>
                        <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} transition-all duration-300`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/tweets">
                  <Button variant="ghost" className="w-full mt-4 text-[#B85C4F] hover:text-[#9A4A3F] hover:bg-[#B85C4F]/10">
                    Explore Sentiment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Awareness */}
            <Card className="border border-[#D4C4B0]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-[#6B8E7F] flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <CardTitle className="text-[#222222]">Awareness</CardTitle>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="p-0.5">
                              <Info className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            <p className="text-xs">
                              How often people are searching for TD Bank compared to top competitors using data from Google Trends. Below is a breakdown of the top states searching for TD Bank this week.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Week of {new Date(selectedScore.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-[#6B8E7F]">{awarenessScore}%</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={awarenessChartData}>
                    <defs>
                      <linearGradient id="awarenessGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6B8E7F" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6B8E7F" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="week" hide />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      labelFormatter={(label) => label}
                      formatter={(value: number) => [`${value}%`, 'Awareness']}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#6B8E7F"
                      strokeWidth={2}
                      fill="url(#awarenessGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {topStatesForWeek.map((item) => (
                    <div key={item.state} className="flex items-center justify-between" title={item.fullName}>
                      <span className="text-sm font-medium text-gray-600 w-8">{item.state}</span>
                      <div className="flex-1 mx-3">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#6B8E7F] transition-all duration-500"
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-bold w-12 text-right text-gray-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/awareness">
                  <Button variant="ghost" className="w-full mt-4 text-[#6B8E7F] hover:text-[#577265] hover:bg-[#6B8E7F]/10">
                    Compare Competitors
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Advocacy */}
            <Card className="border border-[#D4C4B0]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-[#8B7355] flex items-center justify-center">
                      <ThumbsUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <CardTitle className="text-[#222222]">Advocacy</CardTitle>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="p-0.5">
                              <Info className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="max-w-xs">
                            <p className="text-xs">
                              Look at how often and positively TD Bank is being portrayed in the news. Measures sentiment in news headlines and media coverage.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Week of {new Date(selectedScore.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-[#8B7355]">{advocacyScore}%</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={advocacyChartData}>
                    <defs>
                      <linearGradient id="advocacyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B7355" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#8B7355" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="week" hide />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      labelFormatter={(label) => label}
                      formatter={(value: number) => [`${value}%`, 'Advocacy']}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8B7355"
                      strokeWidth={2}
                      fill="url(#advocacyGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">Net Promoter Score</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="p-0.5">
                            <Info className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <p className="text-xs">
                            Measures customer willingness to recommend TD Bank based on positive news mentions and sentiment in headlines.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="font-semibold text-gray-900">{advocacyScore}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#8B7355] transition-all duration-500"
                      style={{ width: `${advocacyScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    Based on news headlines & sentiment
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Chat Widget - Fixed bottom right */}
      {chatOpen && !chatMinimized && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-[#D4C4B0] flex flex-col z-50">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#D4C4B0] bg-[#3C8825] rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
                <Bot className="h-5 w-5 text-[#3C8825]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Brand Assistant</h3>
                <p className="text-xs text-white/80">Ask about your metrics</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setChatMinimized(true)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                onClick={() => setChatOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F5F3EE]/30">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Bot className="h-12 w-12 mx-auto mb-3 text-[#3C8825]" />
                  <p className="text-sm">Ask me anything about your metrics</p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
                      message.role === 'user'
                        ? 'bg-[#8B7355] text-white'
                        : 'bg-white text-gray-800 border border-[#D4C4B0]'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-[#D4C4B0] bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 border border-[#D4C4B0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#3C8825] bg-white"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-[#3C8825] text-white hover:bg-[#2D6619] px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Widget - Minimized */}
      {chatOpen && chatMinimized && (
        <button
          onClick={() => setChatMinimized(false)}
          className="fixed bottom-6 right-6 h-14 px-5 bg-[#3C8825] text-white rounded-full shadow-2xl flex items-center gap-3 hover:bg-[#2D6619] transition-colors z-50"
        >
          <Bot className="h-6 w-6" />
          <span className="font-medium">Assistant</span>
          {messages.length > 0 && (
            <span className="bg-white text-[#3C8825] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {messages.length}
            </span>
          )}
        </button>
      )}

      {/* Chat Widget - Closed (Floating Button) */}
      {!chatOpen && (
        <button
          onClick={() => {
            setChatOpen(true);
            setChatMinimized(false);
          }}
          className="fixed bottom-6 right-6 h-14 w-14 bg-[#3C8825] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#2D6619] transition-all hover:scale-110 z-50"
        >
          <Bot className="h-7 w-7" />
        </button>
      )}
    </div>
  );
}
