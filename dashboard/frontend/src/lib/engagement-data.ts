// Engagement data based on TD Bank stock price performance

export interface EngagementStockData {
  sunday: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  score: number;
}

export const engagementStockData: EngagementStockData[] = [
  {
    sunday: '2025-09-28',
    open: 80.28,
    high: 81.74,
    low: 80.13,
    close: 81.23,
    volume: 2596600,
    score: 21.0
  },
  {
    sunday: '2025-10-05',
    open: 79.14,
    high: 79.57,
    low: 78.24,
    close: 78.32,
    volume: 1301000,
    score: 10.0
  },
  {
    sunday: '2025-10-12',
    open: 78.72,
    high: 79.42,
    low: 78.47,
    close: 79.19,
    volume: 1125100,
    score: 9.0
  },
  {
    sunday: '2025-10-19',
    open: 81.12,
    high: 81.15,
    low: 80.60,
    close: 81.00,
    volume: 1180000,
    score: 10.0
  },
  {
    sunday: '2025-10-26',
    open: 81.47,
    high: 82.47,
    low: 81.38,
    close: 82.13,
    volume: 2349000,
    score: 19.0
  },
  {
    sunday: '2025-11-02',
    open: 80.42,
    high: 81.07,
    low: 79.74,
    close: 80.90,
    volume: 2606700,
    score: 21.0
  },
  {
    sunday: '2025-11-09',
    open: 81.14,
    high: 81.48,
    low: 80.23,
    close: 81.35,
    volume: 2446900,
    score: 20.0
  },
  {
    sunday: '2025-11-16',
    open: 81.35,
    high: 81.72,
    low: 80.89,
    close: 81.23,
    volume: 1892000,
    score: 13.0
  },
  {
    sunday: '2025-11-23',
    open: 81.23,
    high: 81.45,
    low: 80.67,
    close: 80.91,
    volume: 1456000,
    score: 5.0
  },
  {
    sunday: '2025-11-30',
    open: 80.91,
    high: 82.34,
    low: 80.78,
    close: 82.12,
    volume: 3124000,
    score: 34.0
  },
  {
    sunday: '2025-12-07',
    open: 82.12,
    high: 83.15,
    low: 81.98,
    close: 82.89,
    volume: 3567000,
    score: 39.0
  }
];

// Helper functions
export function getLatestEngagementStock(): EngagementStockData {
  return engagementStockData[engagementStockData.length - 1];
}

export function getEngagementStockChartData() {
  return engagementStockData.map((item) => {
    const date = new Date(item.sunday);
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      week: monthDay,
      date: item.sunday,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
      score: item.score
    };
  });
}

export function getAverageStockPrice(): number {
  const avg = engagementStockData.reduce((sum, item) => sum + item.close, 0) / engagementStockData.length;
  return Math.round(avg * 100) / 100;
}

export function getTotalVolume(): number {
  return engagementStockData.reduce((sum, item) => sum + item.volume, 0);
}

export function getPriceChange(): { value: number; percentage: number } {
  const first = engagementStockData[0];
  const last = engagementStockData[engagementStockData.length - 1];
  const change = last.close - first.close;
  const percentage = (change / first.close) * 100;
  return {
    value: Math.round(change * 100) / 100,
    percentage: Math.round(percentage * 100) / 100
  };
}
