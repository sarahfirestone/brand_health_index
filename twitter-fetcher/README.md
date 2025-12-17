# Twitter Data Fetcher Cloud Run Service

This Cloud Run service fetches Twitter data for TD Bank and stores it in Google Cloud Storage for Fivetran ingestion.

## Features

- 🏦 Monitors TD Bank with comprehensive search terms
- 📊 Multiple search terms to capture all TD Bank mentions
- 🔄 Token rotation to get around API limits (8 tokens)
- 📁 Stores data in NDJSON format for Fivetran compatibility
- 🔐 Secure credential management with Secret Manager
- 📈 Detailed logging and error handling
- ⏰ Automated execution via Cloud Scheduler (Tuesdays & Thursdays at 12 PM EST)

## Architecture

```
Cloud Scheduler (Tue/Thu 12 PM EST)
    ↓
Cloud Run Service (twitter-fetcher)
    ↓
Twitter API v2 (Recent Tweets)
    ↓
Google Cloud Storage (NDJSON files)
    ↓
Fivetran (Data Pipeline)
```

## Data Structure

Each tweet is stored with the following fields:
- `brand_id`: Brand identifier (td)
- `tweet_id`: Unique Twitter ID
- `ts_event`: Tweet creation timestamp
- `author_id`: Twitter user ID
- `author_username`: Twitter username
- `author_verified`: Verification status
- `author_location`: User location
- `text`: Tweet content
- `lang`: Language code
- `like_count`: Number of likes
- `reply_count`: Number of replies
- `retweet_count`: Number of retweets
- `quote_count`: Number of quote tweets
- `possibly_sensitive`: Sensitive content flag
- `geo_country`: Country from geo data
- `geo_place_id`: Place ID from geo data
- `collected_at`: Data collection timestamp

## Setup Instructions

### 1. Prerequisites

- Google Cloud Project with billing enabled
- Twitter API v2 access with Bearer Token
- gcloud CLI installed and authenticated

### 2. Deploy the Function

```bash
# Set your project ID
export PROJECT_ID="your-project-id"

# Make scripts executable
chmod +x deploy.sh setup_cron.sh

# Deploy the function
./deploy.sh
```

### 3. Set Up Twitter Bearer Tokens

```bash
# Create secrets in Secret Manager (8 tokens for load distribution)
echo "your-twitter-bearer-token-1" | gcloud secrets create twitter-bearer-token-1 --data-file=-
echo "your-twitter-bearer-token-2" | gcloud secrets create twitter-bearer-token-2 --data-file=-
# ... repeat for tokens 3-8
```

### 4. Set Up Cloud Scheduler

```bash
# Create Cloud Scheduler job for Tuesdays and Thursdays at 12 PM EST
gcloud scheduler jobs create http twitter-fetcher-scheduled \
    --location=us-central1 \
    --schedule="0 12 * * 2,4" \
    --time-zone="America/New_York" \
    --uri="https://twitter-fetcher-74813801595.us-central1.run.app/" \
    --http-method=POST \
    --headers="Content-Type=application/json" \
    --message-body='{"date":""}' \
    --max-retry-attempts=3 \
    --max-retry-duration=10m \
    --min-backoff-duration=5s \
    --max-backoff-duration=1h \
    --max-doublings=5 \
    --attempt-deadline=3m
```

## Configuration

### Environment Variables

- `PROJECT_ID`: Google Cloud Project ID
- `GCS_BUCKET`: GCS bucket name (default: brand-health-raw-data)
- `TWITTER_SECRET_NAME`: Secret Manager secret name (default: twitter-bearer-token)

### Brand Search Terms

The service monitors TD Bank with comprehensive search terms:

- **TD Bank (td)**: TD Bank, @TDBank_US, @TDBank, Toronto-Dominion, TD Ameritrade, TD Securities, TD Wealth, TD Insurance, TD Direct Investing, TDBank, Toronto Dominion, TD EasyWeb, TD Mobile App, TD Bank US, TD Credit Card, TD Mortgage

## Data Storage

Data is stored in Google Cloud Storage with the following structure:

```
gs://brand-health-raw-data-469110/
└── raw/
    └── twitter/
        └── date=YYYY-MM-DD/
            └── td.ndjson
```

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if Twitter Bearer Token is correctly stored in Secret Manager
   - Verify the token has the necessary permissions for Twitter API v2

2. **No Data Found**
   - Check if the date parameter is correct
   - Verify search terms are appropriate for the time period
   - Check Twitter API rate limits

3. **Storage Errors**
   - Verify GCS bucket exists and is accessible
   - Check IAM permissions for the Cloud Run service account

4. **Scheduler Not Running**
   - Check if Cloud Scheduler API is enabled
   - Verify the job is created and active
   - Check the Cloud Run service URL is correct
   - Verify schedule is set to `0 12 * * 2,4` (Tuesdays and Thursdays at 12 PM EST)

5. **Retry Failures**
   - Check retry configuration (max 3 attempts with exponential backoff)
   - Review logs for error details
   - Verify attempt deadline is sufficient (3 minutes)

### Debug Mode

To run the function locally for debugging:

```bash
# Install dependencies
pip install -r requirements.txt

# Run locally
python main.py
```

## API Limits

- **Twitter API v2 Base Plan**: 100 tweets per month per account
- **Token Rotation**: 8 bearer tokens stored in Secret Manager, rotated sequentially to get around API limits
- **Total Capacity**: Up to 800 tweets per month across all tokens (100 per token × 8 tokens)
- **Schedule**: Runs twice weekly (Tuesdays & Thursdays) to stay within monthly quotas

## Cost Estimation

- Cloud Run: ~$0.0000004 per 100ms of execution time
- Cloud Storage: ~$0.020 per GB per month
- Cloud Scheduler: $0.10 per job per month
- Secret Manager: $0.06 per secret per month (8 secrets = $0.48/month)

Estimated monthly cost for twice-weekly execution: <$5

## Security

- Twitter Bearer Token stored securely in Secret Manager
- Function runs with minimal required permissions
- No sensitive data logged
- HTTPS-only communication

## Support

For issues or questions:
1. Check the function logs
2. Verify all prerequisites are met
3. Test with a specific date parameter
4. Review Twitter API documentation for rate limits







