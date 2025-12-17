# Reddit Fetcher

Idempotent Reddit data fetcher for TD Bank brand health monitoring. Collects posts and comments from relevant subreddits with NLP enrichment.

## 🎯 Purpose

Fetches Reddit posts and comments mentioning TD Bank with:
- Idempotent processing (no duplicates)
- State tracking in BigQuery
- Rate limiting (100 requests/minute)
- Sentiment analysis via Vertex AI
- Topic extraction

## 📊 Features

| Feature | Description |
|---------|-------------|
| **Idempotent Ingestion** | Uses state tracking to avoid duplicate data |
| **Brand Detection** | Matches 151 TD Bank keywords with confidence scoring |
| **NLP Enrichment** | Vertex AI Gemini sentiment and topic analysis |
| **Rate Limiting** | Respects Reddit API limits (100 req/min) |
| **Partitioned Storage** | Data organized by date in GCS |

## 🔧 Configuration

### Environment Variables

```bash
PROJECT_ID=your-gcp-project
GCS_BUCKET=brand-health-raw-data
REDDIT_SECRET_NAME=reddit-credentials
BQ_DATASET=brand_health_raw
REDDIT_REQUESTS_PER_MINUTE=100
BATCH_SIZE=1000
```

### Reddit Credentials (Secret Manager)

```json
{
  "client_id": "your-reddit-client-id",
  "client_secret": "your-reddit-client-secret",
  "user_agent": "BrandHealthBot/1.0",
  "username": "optional-username",
  "password": "optional-password"
}
```

## 📁 Monitored Subreddits

**Core Personal Finance:**
- r/personalfinance, r/banking, r/povertyfinance, r/frugal

**Canadian Finance:**
- r/PersonalFinanceCanada, r/CanadianInvestor, r/ontario, r/toronto, r/canada

**US Finance:**
- r/financialindependence, r/StudentLoans

**Product-specific:**
- r/creditcards, r/mortgages, r/investing, r/realestate

## 🚀 Deployment

Deploy as a Google Cloud Function:

```bash
gcloud functions deploy reddit-fetcher \
  --runtime python311 \
  --trigger-http \
  --entry-point fetch_reddit_data_idempotent \
  --set-env-vars PROJECT_ID=your-project
```

## 📤 Output Schema

Data is saved to GCS as gzipped JSONL:

```
gs://brand-health-raw-data/raw/reddit/dt=YYYY-MM-DD/part-*.jsonl.gz
```

### Record Format

```json
{
  "natural_id": "reddit_post_abc123",
  "source": "reddit",
  "subreddit": "PersonalFinanceCanada",
  "type": "submission",
  "title": "TD Bank account question",
  "text": "Has anyone had issues with...",
  "author": "username",
  "timestamp": 1699574400,
  "score": 42,
  "sentiment": 0.2,
  "severity": 0.0,
  "topics": ["customer_service"],
  "nlp_confidence": 0.8,
  "nlp_model": "vertex-ai-gemini-1.5-flash",
  "brand_detection": {
    "brand_id": "td_bank",
    "matched_terms": ["TD Bank", "TD"],
    "confidence_score": 0.89
  }
}
```

## 🔗 Related Components

- **Dashboard** (`../dashboard/`) - Visualization frontend
- **Data Retrieval** (`../data_retrieval/`) - Other data sources
- **Score Calculation** (`../calculate_scores/`) - BHI computation

