// Data loading utilities for CSV files

export interface ScoreData {
  date: string;
  awareness: number;
  regional_awareness: number;
  sentiment: number;
  volume_sentiment: number;
  engagement: number;
  advocacy: number;
  weekly_score: number;
  weekly_score_regional: number;
  weekly_score_volume: number;
  weekly_score_volume_regional: number;
}

export interface SentimentData {
  ts_event: string;
  total_tweets: number;
  positive_tweets: number;
  neutral_tweets: number;
  negative_tweets: number;
  sentiment_score: number;
  day_time: string;
  date: string;
  score: number;
}

// Import complaints data and interface from separate file (generated from CSV)
export { complaintData } from './complaints-data';
export type { ComplaintData } from './complaints-data';

// Import awareness data (Google Trends)
import {
  regionalBanksDailyData as regionalBanksDailyDataImport,
  top5BanksDailyData as top5BanksDailyDataImport,
  regionalBanksRegionalData,
  top5BanksRegionalData,
  getLatestRegionalBanksAwareness,
  getLatestTop5BanksAwareness,
  getTopTDStates,
  getTDCompetitiveStates
} from './awareness-data';

export type { DailyAwarenessData, RegionalAwarenessData } from './awareness-data';

// Re-export awareness data
export {
  regionalBanksRegionalData,
  top5BanksRegionalData,
  getLatestRegionalBanksAwareness,
  getLatestTop5BanksAwareness,
  getTopTDStates,
  getTDCompetitiveStates
};

export const regionalBanksDailyData = regionalBanksDailyDataImport;
export const top5BanksDailyData = top5BanksDailyDataImport;

// Import complaints weekly data
import {
  weeklyComplaintsData as weeklyComplaintsDataImport,
  getLatestComplaintCount,
  getComplaintTrend,
  getAverageComplaintCount,
  getComplaintVolumeScore
} from './complaints-weekly-data';

export type { WeeklyComplaint } from './complaints-weekly-data';

// Re-export complaints data
export {
  getLatestComplaintCount,
  getComplaintTrend,
  getAverageComplaintCount,
  getComplaintVolumeScore
};

export const weeklyComplaintsData = weeklyComplaintsDataImport;

export interface RegionalData {
  date?: string;
  state?: string;
  td_bank: number;
  chase_bank: number;
  capital_one_bank: number;
  bank_of_america: number;
  citibank: number;
  other_average: number;
  state_average: number;
}

// Parse CSV data from the actual files (Sep 28 to Dec 07) - Updated Dec 8, 2025
export const scoreData: ScoreData[] = [
  {
    date: '2025-09-28',
    awareness: 20.56694093952876,
    regional_awareness: 86.31468094952115,
    sentiment: 34.69387755102041,
    volume_sentiment: 54.607046070460704,
    engagement: 21.0,
    advocacy: 50.76923076923077,
    weekly_score: 31.757512314944982,
    weekly_score_regional: 39.97597981619403,
    weekly_score_volume: 36.73580444480506,
    weekly_score_volume_regional: 44.95427194605411
  },
  {
    date: '2025-10-05',
    awareness: 20.101510421325425,
    regional_awareness: 85.95492979416709,
    sentiment: 14.285714285714285,
    volume_sentiment: 54.33604336043361,
    engagement: 10.0,
    advocacy: 50.76923076923077,
    weekly_score: 23.78911386906762,
    weekly_score_regional: 32.020791290672825,
    weekly_score_volume: 33.80169613774745,
    weekly_score_volume_regional: 42.033373559352654
  },
  {
    date: '2025-10-12',
    awareness: 20.140423098513082,
    regional_awareness: 86.34365776203545,
    sentiment: 17.82178217821782,
    volume_sentiment: 58.91089108910891,
    engagement: 9.0,
    advocacy: 51.53846153846153,
    weekly_score: 24.625166703798108,
    weekly_score_regional: 32.900571036738405,
    weekly_score_volume: 34.89744393152088,
    weekly_score_volume_regional: 43.17284826446117
  },
  {
    date: '2025-10-19',
    awareness: 20.268015751936975,
    regional_awareness: 86.48802562888102,
    sentiment: 10.778443113772456,
    volume_sentiment: 54.87804878048781,
    engagement: 10.0,
    advocacy: 51.53846153846153,
    weekly_score: 23.14623010104274,
    weekly_score_regional: 31.423731335660747,
    weekly_score_volume: 34.17113151772158,
    weekly_score_volume_regional: 42.448632752339584
  },
  {
    date: '2025-10-26',
    awareness: 20.59134236189643,
    regional_awareness: 87.8860890958234,
    sentiment: 23.48993288590604,
    volume_sentiment: 59.48509485094851,
    engagement: 19.0,
    advocacy: 51.53846153846153,
    weekly_score: 28.654934196566003,
    weekly_score_regional: 37.06677753830687,
    weekly_score_volume: 37.65372468782662,
    weekly_score_volume_regional: 46.06556802956749
  },
  {
    date: '2025-11-02',
    awareness: 20.40335023830128,
    regional_awareness: 87.36812145291829,
    sentiment: 24.390243902439025,
    volume_sentiment: 55.420054200542005,
    engagement: 21.0,
    advocacy: 49.23076923076923,
    weekly_score: 28.756090842877384,
    weekly_score_regional: 37.12668724470451,
    weekly_score_volume: 36.51354341740313,
    weekly_score_volume_regional: 44.884139819230256
  },
  {
    date: '2025-11-09',
    awareness: 20.591634257757157,
    regional_awareness: 87.21633656779676,
    sentiment: 12.977099236641221,
    volume_sentiment: 54.607046070460704,
    engagement: 20.0,
    advocacy: 47.692307692307686,
    weekly_score: 25.31526029667652,
    weekly_score_regional: 33.64334808543147,
    weekly_score_volume: 35.72274700513139,
    weekly_score_volume_regional: 44.05083479388634
  },
  {
    date: '2025-11-16',
    awareness: 20.532383875495825,
    regional_awareness: 88.62220007694623,
    sentiment: 8.571428571428571,
    volume_sentiment: 51.6260162601626,
    engagement: 13.0,
    advocacy: 46.15384615384615,
    weekly_score: 22.064414650192635,
    weekly_score_regional: 30.575641675373937,
    weekly_score_volume: 32.82806157237614,
    weekly_score_volume_regional: 41.33928859755745
  },
  {
    date: '2025-11-23',
    awareness: 20.01424379030838,
    regional_awareness: 89.57594352327898,
    sentiment: 10.714285714285714,
    volume_sentiment: 51.6260162601626,
    engagement: 5.0,
    advocacy: 46.15384615384615,
    weekly_score: 20.470593914610063,
    weekly_score_regional: 29.165806381231388,
    weekly_score_volume: 30.698526551079286,
    weekly_score_volume_regional: 39.39373901770061
  },
  {
    date: '2025-11-30',
    awareness: 19.93349983141358,
    regional_awareness: 91.2714343682537,
    sentiment: 23.809523809523807,
    volume_sentiment: 52.710027100271006,
    engagement: 34.0,
    advocacy: 64.4927536231884,
    weekly_score: 35.55894431603145,
    weekly_score_regional: 44.476186133136466,
    weekly_score_volume: 42.78407013871824,
    weekly_score_volume_regional: 51.70131195582326
  },
  {
    date: '2025-12-07',
    awareness: 19.752419152275888,
    regional_awareness: 91.90601008682323,
    sentiment: 11.538461538461538,
    volume_sentiment: 50.81300813008131,
    engagement: 39.0,
    advocacy: 66.92307692307693,
    weekly_score: 34.30348940345359,
    weekly_score_regional: 43.32268827027201,
    weekly_score_volume: 44.12212605135853,
    weekly_score_volume_regional: 53.14132491817695
  }
];

export const sentimentData: SentimentData[] = [
  {
    ts_event: '2025-09-28 00:00:00+00:00',
    total_tweets: 49,
    positive_tweets: 17,
    neutral_tweets: 21,
    negative_tweets: 11,
    sentiment_score: 0.34694,
    day_time: '2025-09-28 00:00:00+00:00',
    date: '2025-09-28',
    score: 34.69387755102041
  },
  {
    ts_event: '2025-10-05 00:00:00+00:00',
    total_tweets: 112,
    positive_tweets: 16,
    neutral_tweets: 80,
    negative_tweets: 16,
    sentiment_score: 0.14286,
    day_time: '2025-10-05 00:00:00+00:00',
    date: '2025-10-05',
    score: 14.285714285714285
  },
  {
    ts_event: '2025-10-12 00:00:00+00:00',
    total_tweets: 202,
    positive_tweets: 36,
    neutral_tweets: 115,
    negative_tweets: 51,
    sentiment_score: 0.17821,
    day_time: '2025-10-12 00:00:00+00:00',
    date: '2025-10-12',
    score: 17.82178217821782
  },
  {
    ts_event: '2025-10-19 00:00:00+00:00',
    total_tweets: 167,
    positive_tweets: 18,
    neutral_tweets: 108,
    negative_tweets: 41,
    sentiment_score: 0.10778,
    day_time: '2025-10-19 00:00:00+00:00',
    date: '2025-10-19',
    score: 10.778443113772456
  },
  {
    ts_event: '2025-10-26 00:00:00+00:00',
    total_tweets: 149,
    positive_tweets: 35,
    neutral_tweets: 71,
    negative_tweets: 43,
    sentiment_score: 0.23490,
    day_time: '2025-10-26 00:00:00+00:00',
    date: '2025-10-26',
    score: 23.48993288590604
  },
  {
    ts_event: '2025-11-02 00:00:00+00:00',
    total_tweets: 155,
    positive_tweets: 42,
    neutral_tweets: 78,
    negative_tweets: 35,
    sentiment_score: 0.24390,
    day_time: '2025-11-02 00:00:00+00:00',
    date: '2025-11-02',
    score: 24.390243902439025
  },
  {
    ts_event: '2025-11-09 00:00:00+00:00',
    total_tweets: 131,
    positive_tweets: 17,
    neutral_tweets: 84,
    negative_tweets: 30,
    sentiment_score: 0.12977,
    day_time: '2025-11-09 00:00:00+00:00',
    date: '2025-11-09',
    score: 12.977099236641221
  },
  {
    ts_event: '2025-11-16 00:00:00+00:00',
    total_tweets: 140,
    positive_tweets: 12,
    neutral_tweets: 110,
    negative_tweets: 18,
    sentiment_score: 0.08571,
    day_time: '2025-11-16 00:00:00+00:00',
    date: '2025-11-16',
    score: 8.571428571428571
  },
  {
    ts_event: '2025-11-23 00:00:00+00:00',
    total_tweets: 112,
    positive_tweets: 12,
    neutral_tweets: 88,
    negative_tweets: 12,
    sentiment_score: 0.10714,
    day_time: '2025-11-23 00:00:00+00:00',
    date: '2025-11-23',
    score: 10.714285714285714
  },
  {
    ts_event: '2025-11-30 00:00:00+00:00',
    total_tweets: 168,
    positive_tweets: 40,
    neutral_tweets: 98,
    negative_tweets: 30,
    sentiment_score: 0.23810,
    day_time: '2025-11-30 00:00:00+00:00',
    date: '2025-11-30',
    score: 23.809523809523807
  },
  {
    ts_event: '2025-12-07 00:00:00+00:00',
    total_tweets: 104,
    positive_tweets: 12,
    neutral_tweets: 80,
    negative_tweets: 12,
    sentiment_score: 0.11538,
    day_time: '2025-12-07 00:00:00+00:00',
    date: '2025-12-07',
    score: 11.538461538461538
  }
];

// Helper functions
export function getLatestScore(): ScoreData {
  return scoreData[scoreData.length - 1];
}

export function getPreviousScore(): ScoreData {
  return scoreData[scoreData.length - 2];
}

export function getScoreChange(): number {
  const latest = getLatestScore();
  const previous = getPreviousScore();
  return Math.round(latest.weekly_score - previous.weekly_score);
}

export function getLatestSentiment(): SentimentData {
  return sentimentData[sentimentData.length - 1];
}

export function getSentimentPercentages() {
  const latest = getLatestSentiment();
  const total = latest.total_tweets;

  return {
    positive: Math.round((latest.positive_tweets / total) * 100),
    neutral: Math.round((latest.neutral_tweets / total) * 100),
    negative: Math.round((latest.negative_tweets / total) * 100)
  };
}

// Format weekly data for charts
export function getWeeklyChartData() {
  return scoreData.map((item) => {
    const date = new Date(item.date);
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      week: monthDay,
      score: Math.round(item.weekly_score),
      date: item.date,
      fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  });
}

// Format sentiment chart data
export function getSentimentChartData() {
  return sentimentData.map((item) => {
    const date = new Date(item.date);
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      week: monthDay,
      value: Math.round(item.score),
      date: item.date
    };
  });
}

// Format regional banks chart data (last 7 days)
export function getRegionalBanksChartData() {
  const lastWeek = regionalBanksDailyDataImport.slice(-7);
  return lastWeek.map((item: any) => {
    const date = new Date(item.date);
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      date: monthDay,
      'TD Bank': item.td_bank,
      'PNC': item.pnc,
      'Citizens': item.citizens,
      'U.S. Bancorp': item.us_bancorp,
      'Truist': item.truist
    };
  });
}

// Format top 5 banks chart data (last 7 days)
export function getTop5BanksChartData() {
  const lastWeek = top5BanksDailyDataImport.slice(-7);
  return lastWeek.map((item: any) => {
    const date = new Date(item.date);
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      date: monthDay,
      'TD Bank': item.td_bank,
      'Chase': item.chase_bank,
      'Capital One': item.capital_one,
      'Citibank': item.citibank,
      'Bank of America': item.bank_of_america
    };
  });
}

// Format complaints chart data
export function getComplaintsChartData() {
  return weeklyComplaintsDataImport.map((item: any) => {
    const date = new Date(item.date);
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      week: monthDay,
      count: item.complaint_count,
      score: Math.round(100 - item.weekly_score_0_100),
      date: item.date
    };
  });
}
