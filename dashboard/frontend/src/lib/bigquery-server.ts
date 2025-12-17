// Server-side BigQuery integration
// This file should only be imported in API routes (server-side code)

import { BigQuery } from '@google-cloud/bigquery';

// Initialize BigQuery client for server-side use
export function createBigQueryClient() {
  const config: any = {
    projectId: process.env.GOOGLE_CLOUD_PROJECT || 'trendle-469110',
  };

  // Check for JSON credentials (for Vercel/production)
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    try {
      const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
      config.credentials = credentials;
      console.log('Using JSON credentials for BigQuery authentication');
    } catch (error) {
      console.error('Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:', error);
    }
  } 
  // Check for file path credentials (for local development)
  else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    config.keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    console.log('Using keyFilename for BigQuery authentication');
  } else {
    console.log('No BigQuery credentials found, using default authentication');
  }

  return new BigQuery(config);
}

// Server-side query functions
export async function queryComplaintClusters() {
  const bigquery = createBigQueryClient();
  
  const query = `
    SELECT 
      cluster_name,
      cluster_description,
      cluster_priority,
      COUNT(*) as total_complaints,
      COUNT(DISTINCT complaint_date) as days_active,
      AVG(CASE WHEN severity_level = 'high' THEN 1.0 WHEN severity_level = 'medium' THEN 0.5 ELSE 0.0 END) as avg_severity_score,
      COUNT(CASE WHEN source_type = 'reddit' THEN 1 END) as reddit_complaints,
      COUNT(CASE WHEN source_type = 'cfpb' THEN 1 END) as cfpb_complaints,
      MIN(complaint_date) as first_complaint,
      MAX(complaint_date) as last_complaint
    FROM \`trendle-469110.brand_health_dev.mart_complaint_clusters\`
    GROUP BY cluster_name, cluster_description, cluster_priority
    ORDER BY cluster_priority, total_complaints DESC
  `;

  const [rows] = await bigquery.query(query);
  return rows;
}

export async function queryDailyTrends(dateRange?: { start: string; end: string }) {
  const bigquery = createBigQueryClient();
  
  let whereClause = '';
  if (dateRange) {
    whereClause = `WHERE complaint_date BETWEEN '${dateRange.start}' AND '${dateRange.end}'`;
  } else {
    whereClause = 'WHERE complaint_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)';
  }
  
  const query = `
    SELECT 
      complaint_date,
      cluster_name,
      cluster_description,
      COUNT(*) as daily_complaint_count,
      AVG(CASE WHEN severity_level = 'high' THEN 1.0 WHEN severity_level = 'medium' THEN 0.5 ELSE 0.0 END) as avg_severity_score,
      COUNT(CASE WHEN source_type = 'reddit' THEN 1 END) as reddit_count,
      COUNT(CASE WHEN source_type = 'cfpb' THEN 1 END) as cfpb_count,
      ARRAY_AGG(
        STRUCT(
          complaint_id,
          source_type,
          SUBSTR(complaint_text, 1, 150) as complaint_preview,
          severity_level
        ) 
        ORDER BY 
          CASE WHEN severity_level = 'high' THEN 1 WHEN severity_level = 'medium' THEN 2 ELSE 3 END,
          LENGTH(complaint_text) DESC
        LIMIT 3
      ) as sample_complaints
    FROM \`trendle-469110.brand_health_dev.mart_complaint_clusters\`
    ${whereClause}
    GROUP BY complaint_date, cluster_name, cluster_description
    ORDER BY complaint_date DESC, daily_complaint_count DESC
  `;

  const [rows] = await bigquery.query(query);
  return rows;
}

export async function queryComplaintDetails(
  clusterId?: string, 
  dateRange?: { start: string; end: string },
  pagination?: { page: number; pageSize: number }
) {
  const bigquery = createBigQueryClient();
  
  let whereClause = 'WHERE 1=1';
  if (clusterId) {
    whereClause += ` AND cluster_name = '${clusterId}'`;
  }
  if (dateRange) {
    whereClause += ` AND complaint_date BETWEEN '${dateRange.start}' AND '${dateRange.end}'`;
  }
  
  // Pagination parameters
  const pageSize = pagination?.pageSize || 50;
  const offset = pagination ? (pagination.page - 1) * pageSize : 0;
  
  const query = `
    SELECT 
      complaint_id,
      source_type,
      brand_id,
      complaint_text,
      complaint_date,
      cluster_name,
      severity_level,
      source_detail
    FROM \`trendle-469110.brand_health_dev.mart_complaint_clusters\`
    ${whereClause}
    ORDER BY complaint_date DESC, 
             CASE WHEN severity_level = 'high' THEN 1 WHEN severity_level = 'medium' THEN 2 ELSE 3 END
    LIMIT ${pageSize}
    OFFSET ${offset}
  `;

  const [rows] = await bigquery.query(query);
  return rows;
}

export async function queryComplaintCount(clusterId?: string, dateRange?: { start: string; end: string }) {
  const bigquery = createBigQueryClient();
  
  let whereClause = 'WHERE 1=1';
  if (clusterId) {
    whereClause += ` AND cluster_name = '${clusterId}'`;
  }
  if (dateRange) {
    whereClause += ` AND complaint_date BETWEEN '${dateRange.start}' AND '${dateRange.end}'`;
  }
  
  const query = `
    SELECT COUNT(*) as total_count
    FROM \`trendle-469110.brand_health_dev.mart_complaint_clusters\`
    ${whereClause}
  `;

  const [rows] = await bigquery.query(query);
  return rows[0]?.total_count || 0;
}

export async function queryRedditData(pagination?: { page: number; pageSize: number }) {
  const bigquery = createBigQueryClient();
  
  // Pagination parameters
  const pageSize = pagination?.pageSize || 50;
  const offset = pagination ? (pagination.page - 1) * pageSize : 0;
  
  const query = `
    SELECT 
      event_id,
      brand_id,
      source,
      text,
      ts_event,
      language,
      geo_country,
      author,
      subreddit,
      reddit_type,
      reddit_id,
      score,
      created_at
    FROM \`trendle-469110.brand_health_data.reddit_data\`
    ORDER BY ts_event DESC
    LIMIT ${pageSize}
    OFFSET ${offset}
  `;

  const [rows] = await bigquery.query(query);
  return rows;
}

export async function queryRedditCount() {
  const bigquery = createBigQueryClient();
  
  const query = `
    SELECT COUNT(*) as total_count
    FROM \`trendle-469110.brand_health_data.reddit_data\`
  `;

  const [rows] = await bigquery.query(query);
  return rows[0]?.total_count || 0;
}

// Environment variables needed:
// GOOGLE_CLOUD_PROJECT=trendle-469110
// GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
