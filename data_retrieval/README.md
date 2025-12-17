# Data Retrieval Guide

This document explains how data is retrieved from each data source for the Brand Health Index pipeline. This guide covers all automated and manual data collection processes.

## Overview

The Brand Health Index pipeline collects data from multiple sources:
- **Twitter/X**: Automated collection via Cloud Scheduler (Tuesdays & Thursdays at 12 PM EST)
- **Google Trends**: Manual weekly download
- **CFPB Complaints**: Manual download (CSV or API)

---

## 1. Twitter/X Data

### Overview
Twitter data is collected **automatically** via a Cloud Run service that runs on a scheduled basis. The service fetches tweets mentioning TD Bank and stores them in Google Cloud Storage.

### Collection Method
- **Automation**: Fully automated via Google Cloud Scheduler
- **Frequency**: Twice weekly (Tuesdays and Thursdays at 12:00 PM EST)
- **Cron Schedule**: `0 12 * * 2,4` (12:00 PM on Tuesdays and Thursdays)
- **Timezone**: Eastern Standard Time (EST)
- **API**: Twitter API v2 (Recent Search endpoint)
- **Brand**: TD Bank only

### How It Works

1. **Cloud Scheduler** triggers the `twitter-fetcher` Cloud Run service on Tuesdays and Thursdays at 12:00 PM EST
2. **Cloud Run Service** authenticates using Bearer Tokens stored in Secret Manager
3. **Twitter API v2** is queried for tweets matching TD Bank search terms
4. **Data Processing**: Tweets are enriched with user metadata and engagement metrics
5. **Storage**: Processed tweets are saved to GCS in NDJSON format for Fivetran ingestion

### Scheduler Configuration

The Cloud Scheduler job is configured with:
- **Target Type**: HTTP
- **URL**: `https://twitter-fetcher-74813801595.us-central1.run.app/`
- **HTTP Method**: POST
- **Headers**: 
  - `Content-Type: application/json`
  - `User-Agent: Google-Cloud-Scheduler`
- **Body**: `{"date": ""}` (empty date defaults to today)
- **Auth Header**: None (unauthenticated)
- **Retry Configuration**:
  - Max retry attempts: 3
  - Max retry duration: 10 minutes
  - Min backoff duration: 5 seconds
  - Max backoff duration: 1 hour
  - Max doublings: 5
- **Attempt Deadline**: 3 minutes

### Search Terms
The function searches for tweets containing any of these TD Bank-related terms:
- TD Bank
- @TDBank_US
- @TDBank
- Toronto-Dominion
- TD Ameritrade
- TD Securities
- TD Wealth
- TD Insurance
- TD Direct Investing
- TDBank
- Toronto Dominion
- TD EasyWeb
- TD Mobile App
- TD Bank US
- TD Credit Card
- TD Mortgage

### Data Structure
Each tweet includes:
- `brand_id`: "td"
- `tweet_id`: Unique Twitter ID
- `ts_event`: Tweet creation timestamp
- `author_id`: Twitter user ID
- `author_username`: Twitter username
- `author_verified`: Verification status
- `author_location`: User location
- `text`: Tweet content
- `lang`: Language code
- `like_count`, `reply_count`, `retweet_count`, `quote_count`: Engagement metrics
- `possibly_sensitive`: Sensitive content flag
- `geo_country`, `geo_place_id`: Geographic data
- `collected_at`: Data collection timestamp

### Storage Location
```
gs://brand-health-raw-data-469110/raw/twitter/date=YYYY-MM-DD/td.ndjson
```

### API Configuration
- **Bearer Tokens**: Stored in Google Secret Manager (8 tokens for load distribution)
- **Token Rotation**: Tokens are rotated sequentially to get around API limits
- **Rate Limits**: 100 tweets per month per account (Twitter API v2 base plan limit)

### Manual Trigger
To manually trigger a Twitter data fetch:

```bash
# Using the Cloud Run service URL directly
curl -X POST "https://twitter-fetcher-74813801595.us-central1.run.app/" \
  -H "Content-Type: application/json" \
  -d '{"date":""}'

# Fetch specific date
curl -X POST "https://twitter-fetcher-74813801595.us-central1.run.app/" \
  -H "Content-Type: application/json" \
  -d '{"date":"2025-01-15"}'

# Or trigger via Cloud Scheduler manually
gcloud scheduler jobs run twitter-fetcher-scheduled --location=us-central1
```

### Monitoring
View logs:
```bash
# View Cloud Run service logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=twitter-fetcher" --limit=50 --format=json

# View Cloud Scheduler job execution history
gcloud scheduler jobs describe twitter-fetcher-scheduled --location=us-central1
```

---

## 2. Google Trends Data

### Overview
Google Trends data is collected **manually** on a weekly basis. The data tracks search interest for financial brands across the United States.

### Collection Method
- **Automation**: Manual download (Cloud Function available but not scheduled)
- **Frequency**: Weekly (recommended: Sunday evening)
- **API**: PyTrends library (unofficial Google Trends API)
- **Brands**: Multiple banks in two groups

### How It Works

The Trends data collection process involves:

1. **Term Groups**: Data is collected in two groups to ensure comparable relative indices:
   - **Group 1 - Major National Banks**: TD Bank, Chase Bank, Capital One, Wells Fargo, Bank of America
   - **Group 2 - Regional Banks**: TD Bank, PNC Financial Services, Citizens Financial, U.S. Bancorp, Truist

2. **Entity Detection**: The system automatically detects and uses company entity topics (e.g., `/m/0221wv` for Chase Bank) when available, ensuring accurate brand-specific data rather than generic search terms.

3. **Data Types Collected**:
   - **Time Series Data**: Daily search interest over the last month (relative index 0-100)
   - **State-Level Data**: Search interest by US state (aggregated for the timeframe)

4. **Storage**: Data is saved in NDJSON format to GCS for Fivetran ingestion

### Manual Collection Process



#### Time Series Data
```json
{
  "group_id": "group_1_major_banks",
  "keyword": "Chase Bank",
  "entity_keyword": "/m/0221wv",
  "keyword_type": "search_term",
  "geo": "US",
  "ts_event": "2025-10-02T00:00:00",
  "value": 100,
  "is_partial": false,
  "is_entity_topic": true,
  "data_source": "company_entity",
  "collected_at": "2025-11-02T17:17:48.700411"
}
```

#### State-Level Data
```json
{
  "group_id": "group_1_major_banks",
  "keyword": "Chase Bank",
  "entity_keyword": "/m/0221wv",
  "keyword_type": "state_interest",
  "geo": "US",
  "state": "Alabama",
  "value": 26,
  "timeframe": "today 1-m",
  "is_entity_topic": true,
  "data_source": "company_entity",
  "collected_at": "2025-11-02T17:18:10.111026"
}
```

### Storage Location
```
gs://brand-health-raw-data-469110/raw/trends/date=YYYY-MM-DD/
├── group_1_major_banks_timeseries.ndjson
├── group_1_major_banks_states.ndjson
├── group_2_regional_banks_timeseries.ndjson
└── group_2_regional_banks_states.ndjson
```

### Recommended Schedule
- **Frequency**: Weekly
- **Best Time**: Sunday evening (10 PM ET)
- **Reason**: Captures complete previous week (Mon-Sun) data, ready for Monday dashboard updates

---

## 3. CFPB Consumer Complaints Data

### Overview
CFPB (Consumer Financial Protection Bureau) complaint data is collected **manually** via CSV download or API. The data tracks consumer complaints filed against financial institutions.

### Collection Method
- **Automation**: Manual download (Cloud Function available for processing)
- **Frequency**: Weekly or as needed
- **Source**: CFPB Consumer Complaint Database
- **Brand**: TD Bank only (configured for multiple company name variations)

### How It Works

CFPB data can be collected in two ways:

#### Option 1: Manual CSV Download (Recommended)

1. **Download CSV from CFPB Website**:
   - Visit: https://www.consumerfinance.gov/data-research/consumer-complaints/
   - Filter for TD Bank companies:
     - TD BANK US HOLDING COMPANY
     - TD BANK, N.A.
     - TD BANK USA, NATIONAL ASSOCIATION
   - Export as CSV
   - Save to local directory or upload to GCS

2. **Process CSV via Cloud Function**:
   ```bash
   # Upload CSV to GCS first
   gsutil cp td_bank_complaints.csv gs://brand-health-raw-data-469110/raw/cfpb/input/

   # Get function URL
   FUNCTION_URL=$(gcloud functions describe cfpb-fetcher --region=us-central1 --format="value(httpsTrigger.url)")

   # Process CSV from GCS
   curl -X POST "$FUNCTION_URL" \
     -H "Content-Type: application/json" \
     -d '{
       "mode": "csv",
       "gcs_path": "raw/cfpb/input/td_bank_complaints.csv",
       "brand_id": "td",
       "date": "2025-11-02"
     }'
   ```

#### Option 2: API Fetch (Limited)

The CFPB API can be used to fetch recent complaints, but has limitations:
- Maximum 100 results per request
- Pagination requires `search_after` tokens
- Best for weekly incremental updates

```bash
# Get function URL
FUNCTION_URL=$(gcloud functions describe cfpb-fetcher --region=us-central1 --format="value(httpsTrigger.url)")

# Fetch last 7 days of complaints
curl -X POST "$FUNCTION_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "weekly",
    "date": "2025-11-02"
  }'

# Backfill date range
curl -X POST "$FUNCTION_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "start_date": "2025-01-01",
    "end_date": "2025-11-02"
  }'
```

### Company Name Mapping
The system searches for complaints against these TD Bank company name variations:
- TD BANK US HOLDING COMPANY
- TD BANK, N.A.
- TD BANK USA, NATIONAL ASSOCIATION

### Data Structure
Each complaint includes:
- `brand_id`: "td"
- `complaint_id`: Unique complaint identifier
- `ts_event`: Date complaint was received (ISO format)
- `product`: Product category (e.g., "Credit card", "Bank account or service")
- `sub_product`: Sub-product category
- `issue`: Issue category
- `sub_issue`: Sub-issue category
- `consumer_complaint_narrative`: Consumer's description of what happened
- `company_response_to_consumer`: Company's response
- `timely_response`: Whether company responded timely (boolean)
- `consumer_disputed`: Whether consumer disputed the response (boolean)
- `submitted_via`: Submission method (e.g., "Web", "Phone", "Postal mail")
- `date_sent_to_company`: Date complaint was sent to company
- `company_public_response`: Public response from company
- `tags`: Additional tags
- `state`: US state (2-letter code)
- `zip_code`: ZIP code
- `geo_country`: "US" (CFPB is US-only)
- `severity_score`: Calculated severity score (0-1)
- `collected_at`: Data collection timestamp

### Storage Location
```
gs://brand-health-raw-data-469110/raw/cfpb/date=YYYY-MM-DD/td.ndjson
```

### Severity Score Calculation
The severity score (0-1) is calculated based on:
- Base score: 0.3 (for having a complaint)
- High-severity products: +0.2 (mortgage, debt collection, credit reporting)
- Consumer disputed: +0.2
- Untimely response: +0.1
- Has narrative: +0.1
- Public response: +0.1

### Recommended Schedule
- **Frequency**: Weekly
- **Best Time**: Monday morning (after CFPB updates database)
- **Method**: CSV download recommended for complete data

### API Endpoint
- **Base URL**: `https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/`
- **Format**: JSON
- **Rate Limits**: 1 second delay between requests recommended
