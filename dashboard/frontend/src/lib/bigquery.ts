// Client-side data fetching functions
// BigQuery integration is handled via API routes to avoid browser compatibility issues

export interface ComplaintCluster {
  cluster_name: string;
  cluster_description: string;
  cluster_priority: number;
  total_complaints: number;
  days_active: number;
  avg_severity_score: number;
  reddit_complaints: number;
  cfpb_complaints: number;
  first_complaint: string;
  last_complaint: string;
}

export interface DailyTrend {
  complaint_date: string;
  cluster_name: string;
  cluster_description: string;
  daily_complaint_count: number;
  avg_severity_score: number;
  reddit_count: number;
  cfpb_count: number;
  sample_complaints: Array<{
    complaint_id: string;
    source_type: string;
    complaint_preview: string;
    severity_level: string;
  }>;
}

export interface ComplaintDetail {
  complaint_id: string;
  source_type: string;
  brand_id: string;
  complaint_text: string;
  complaint_date: string;
  cluster_name: string;
  severity_level: string;
  source_detail: string;
}

// Mock data for development - replace with actual BigQuery calls in production
export const mockClusterData: ComplaintCluster[] = [
  {
    cluster_name: 'account_issues',
    cluster_description: 'General account management and access problems',
    cluster_priority: 2,
    total_complaints: 547,
    days_active: 13,
    avg_severity_score: 0.45,
    reddit_complaints: 234,
    cfpb_complaints: 313,
    first_complaint: '2025-09-30',
    last_complaint: '2025-10-12'
  },
  {
    cluster_name: 'fraud_security',
    cluster_description: 'Fraud, unauthorized transactions, and security concerns',
    cluster_priority: 1,
    total_complaints: 189,
    days_active: 11,
    avg_severity_score: 0.78,
    reddit_complaints: 67,
    cfpb_complaints: 122,
    first_complaint: '2025-10-01',
    last_complaint: '2025-10-12'
  },
  {
    cluster_name: 'card_fees',
    cluster_description: 'Credit/debit card fees and charges',
    cluster_priority: 3,
    total_complaints: 156,
    days_active: 12,
    avg_severity_score: 0.52,
    reddit_complaints: 89,
    cfpb_complaints: 67,
    first_complaint: '2025-09-30',
    last_complaint: '2025-10-11'
  },
  {
    cluster_name: 'customer_service',
    cluster_description: 'Poor customer service experiences',
    cluster_priority: 2,
    total_complaints: 134,
    days_active: 10,
    avg_severity_score: 0.41,
    reddit_complaints: 78,
    cfpb_complaints: 56,
    first_complaint: '2025-10-02',
    last_complaint: '2025-10-12'
  },
  {
    cluster_name: 'loan_issues',
    cluster_description: 'Loan processing and management problems',
    cluster_priority: 2,
    total_complaints: 98,
    days_active: 9,
    avg_severity_score: 0.61,
    reddit_complaints: 34,
    cfpb_complaints: 64,
    first_complaint: '2025-10-01',
    last_complaint: '2025-10-10'
  }
];

export const mockDailyTrends: DailyTrend[] = [
  {
    complaint_date: '2025-10-12',
    cluster_name: 'fraud_security',
    cluster_description: 'Fraud, unauthorized transactions, and security concerns',
    daily_complaint_count: 28,
    avg_severity_score: 0.82,
    reddit_count: 12,
    cfpb_count: 16,
    sample_complaints: [
      {
        complaint_id: 'reddit_001',
        source_type: 'reddit',
        complaint_preview: 'Someone used my TD Bank card for unauthorized purchases. Called customer service but they said it would take 10 business days to investigate...',
        severity_level: 'high'
      },
      {
        complaint_id: 'cfpb_001',
        source_type: 'cfpb',
        complaint_preview: 'Fraudulent charges appeared on my account. TD Bank initially denied my dispute claim without proper investigation...',
        severity_level: 'high'
      }
    ]
  },
  {
    complaint_date: '2025-10-12',
    cluster_name: 'account_issues',
    cluster_description: 'General account management and access problems',
    daily_complaint_count: 23,
    avg_severity_score: 0.47,
    reddit_count: 15,
    cfpb_count: 8,
    sample_complaints: [
      {
        complaint_id: 'reddit_002',
        source_type: 'reddit',
        complaint_preview: 'My online banking has been down for 3 days. Cannot access my account or pay bills. This is unacceptable...',
        severity_level: 'medium'
      }
    ]
  },
  {
    complaint_date: '2025-10-11',
    cluster_name: 'card_fees',
    cluster_description: 'Credit/debit card fees and charges',
    daily_complaint_count: 19,
    avg_severity_score: 0.55,
    reddit_count: 11,
    cfpb_count: 8,
    sample_complaints: [
      {
        complaint_id: 'cfpb_002',
        source_type: 'cfpb',
        complaint_preview: 'TD Bank charged me multiple overdraft fees in one day for the same transaction. This seems like predatory behavior...',
        severity_level: 'medium'
      }
    ]
  }
];

// API functions - now using fetch to call our API routes
export async function getComplaintClusters(): Promise<ComplaintCluster[]> {
  try {
    const response = await fetch('/api/clusters');
    if (!response.ok) {
      throw new Error('Failed to fetch cluster data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching clusters:', error);
    // Fallback to mock data if API fails
    return mockClusterData;
  }
}

export async function getDailyTrends(dateRange?: { start: string; end: string }): Promise<DailyTrend[]> {
  try {
    const response = await fetch('/api/trends');
    if (!response.ok) {
      throw new Error('Failed to fetch trends data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching trends:', error);
    // Fallback to mock data if API fails
    return mockDailyTrends;
  }
}

export interface PaginatedComplaintsResponse {
  complaints: ComplaintDetail[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export async function getComplaintDetails(
  cluster?: string, 
  page: number = 1, 
  pageSize: number = 50
): Promise<PaginatedComplaintsResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString()
    });
    
    if (cluster && cluster !== 'all') {
      params.append('cluster', cluster);
    }

    const response = await fetch(`/api/complaints?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch complaints data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching complaint details:', error);
    return {
      complaints: [],
      pagination: {
        page: 1,
        pageSize: 50,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
      }
    };
  }
}
