import { NextResponse } from 'next/server';
import { queryRedditData, queryRedditCount } from '@/lib/bigquery-server';

// Mock data for Reddit events
const mockRedditData = [
  {
    event_id: 'reddit_t1_mock001',
    brand_id: 'td_bank',
    source: 'reddit',
    text: 'Has anyone had issues with TD Bank mobile app lately? It keeps crashing when I try to check my balance.',
    ts_event: '2025-10-20T18:30:00Z',
    language: 'en',
    geo_country: 'CA',
    author: 'user123',
    subreddit: 'PersonalFinanceCanada',
    reddit_type: 'comment',
    reddit_id: 'mock001',
    score: 5,
    created_at: '2025-10-28T10:00:00Z'
  },
  {
    event_id: 'reddit_t3_mock002',
    brand_id: 'td_bank',
    source: 'reddit',
    text: 'TD Bank charged me an unexpected fee. Anyone know how to dispute this? Their customer service line has been busy all day.',
    ts_event: '2025-10-20T15:45:00Z',
    language: 'en',
    geo_country: 'CA',
    author: 'bankuser456',
    subreddit: 'PersonalFinanceCanada',
    reddit_type: 'post',
    reddit_id: 'mock002',
    score: 12,
    created_at: '2025-10-28T09:30:00Z'
  },
  {
    event_id: 'reddit_t1_mock003',
    brand_id: 'td_bank',
    source: 'reddit',
    text: 'Just opened a TD savings account. The interest rate is decent but the online interface could be better.',
    ts_event: '2025-10-19T20:15:00Z',
    language: 'en',
    geo_country: 'CA',
    author: 'newcustomer789',
    subreddit: 'CanadianInvestor',
    reddit_type: 'comment',
    reddit_id: 'mock003',
    score: 8,
    created_at: '2025-10-28T09:00:00Z'
  },
  {
    event_id: 'reddit_t3_mock004',
    brand_id: 'td_bank',
    source: 'reddit',
    text: 'PSA: TD Bank will be doing maintenance this weekend. Plan accordingly if you need to access your accounts.',
    ts_event: '2025-10-19T14:20:00Z',
    language: 'en',
    geo_country: 'CA',
    author: 'helpfuluser',
    subreddit: 'PersonalFinanceCanada',
    reddit_type: 'post',
    reddit_id: 'mock004',
    score: 25,
    created_at: '2025-10-28T08:30:00Z'
  },
  {
    event_id: 'reddit_t1_mock005',
    brand_id: 'td_bank',
    source: 'reddit',
    text: 'TD credit card rewards program is pretty good. Been using it for 2 years now and happy with the cashback.',
    ts_event: '2025-10-18T16:45:00Z',
    language: 'en',
    geo_country: 'CA',
    author: 'rewardsuser',
    subreddit: 'CanadianInvestor',
    reddit_type: 'comment',
    reddit_id: 'mock005',
    score: 15,
    created_at: '2025-10-28T08:00:00Z'
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');

    // Try to fetch real BigQuery data first
    try {
      console.log('Attempting to fetch real BigQuery Reddit data...');
      
      // Get both the Reddit data and total count
      const [redditData, totalCount] = await Promise.all([
        queryRedditData({ page, pageSize }),
        queryRedditCount()
      ]);
      
      console.log(`Successfully fetched ${redditData.length} Reddit records from BigQuery (page ${page})`);
      
      // Return paginated response
      return NextResponse.json({
        data: redditData,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
          hasNextPage: page < Math.ceil(totalCount / pageSize),
          hasPreviousPage: page > 1
        }
      });
    } catch (bigqueryError) {
      console.warn('BigQuery Reddit fetch failed, falling back to mock data:', bigqueryError);
      
      // Fallback to mock data if BigQuery fails
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = mockRedditData.slice(startIndex, endIndex);
      
      return NextResponse.json({
        data: paginatedData,
        pagination: {
          page,
          pageSize,
          totalCount: mockRedditData.length,
          totalPages: Math.ceil(mockRedditData.length / pageSize),
          hasNextPage: page < Math.ceil(mockRedditData.length / pageSize),
          hasPreviousPage: page > 1
        }
      });
    }
  } catch (error) {
    console.error('Error fetching Reddit data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Reddit data' },
      { status: 500 }
    );
  }
}
