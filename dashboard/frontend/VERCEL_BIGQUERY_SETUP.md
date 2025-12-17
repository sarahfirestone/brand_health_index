# BigQuery Authentication Setup for Vercel

## Issue
The Reddit page doesn't show real data from BigQuery because Vercel needs service account credentials to access BigQuery.

## ✅ Already Fixed
- Updated `bigquery-server.ts` to accept JSON credentials from environment variable
- Deployed updated code to Vercel

## 🔑 Steps to Add BigQuery Credentials

### Step 1: Create Service Account (if you don't have one)

```bash
# Create service account
gcloud iam service-accounts create vercel-bigquery-reader \
  --display-name="Vercel BigQuery Reader" \
  --project=trendle-469110

# Grant BigQuery permissions
gcloud projects add-iam-policy-binding trendle-469110 \
  --member="serviceAccount:vercel-bigquery-reader@trendle-469110.iam.gserviceaccount.com" \
  --role="roles/bigquery.dataViewer"

gcloud projects add-iam-policy-binding trendle-469110 \
  --member="serviceAccount:vercel-bigquery-reader@trendle-469110.iam.gserviceaccount.com" \
  --role="roles/bigquery.jobUser"
```

### Step 2: Create and Download Service Account Key

```bash
# Create key file
gcloud iam service-accounts keys create ~/vercel-bigquery-key.json \
  --iam-account=vercel-bigquery-reader@trendle-469110.iam.gserviceaccount.com \
  --project=trendle-469110

# Display the key (copy this entire output)
cat ~/vercel-bigquery-key.json
```

### Step 3: Add to Vercel Environment Variables

**Option A: Via Vercel CLI**

```bash
cd frontend

# Add the JSON credentials
cat ~/vercel-bigquery-key.json | vercel env add GOOGLE_APPLICATION_CREDENTIALS_JSON production
```

**Option B: Via Vercel Dashboard**

1. Go to: https://vercel.com/amelia751s-projects/brand-health-frontend-deploy/settings/environment-variables

2. Click "Add New" → "Add Variable"

3. Set:
   - **Name**: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
   - **Value**: Paste the entire contents of `vercel-bigquery-key.json`
   - **Environment**: Production

4. Click "Save"

### Step 4: Redeploy

```bash
cd frontend
vercel --prod
```

## 🔍 Verify It's Working

After redeployment:

1. Visit: https://brand-health-frontend-deploy.vercel.app/dashboard/reddit
2. Check browser console (F12) for any errors
3. You should see real Reddit data from BigQuery instead of mock data

## ❓ Troubleshooting

### Check Vercel Logs

```bash
vercel logs brand-health-frontend-deploy --prod
```

Look for these log messages:
- ✅ `"Using JSON credentials for BigQuery authentication"` - Good!
- ❌ `"No BigQuery credentials found"` - Credentials not set
- ❌ `"Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON"` - Invalid JSON

### Test BigQuery Connection

Check if data exists in BigQuery:

```bash
bq query --use_legacy_sql=false \
"SELECT COUNT(*) as total FROM \`trendle-469110.brand_health_data.reddit_data\`"
```

Expected output: Should show the number of Reddit records (e.g., 500+)

### Common Issues

| Issue | Solution |
|-------|----------|
| "No data found" | Check if `brand_health_data.reddit_data` table has data in BigQuery |
| "Permission denied" | Service account needs `bigquery.dataViewer` and `bigquery.jobUser` roles |
| "Invalid credentials" | Re-check the JSON format in Vercel env var |
| Shows mock data | BigQuery credentials not properly configured |

## 📊 Current Data Sources

Your app loads data from different sources:

1. **Main Dashboard** (`/dashboard`)
   - Uses static data from `data-loader.ts` (hardcoded for demo)
   - To use real data: Would need to fetch from BigQuery API

2. **Reddit Page** (`/dashboard/reddit`)
   - Fetches from BigQuery via `/api/reddit` route
   - Falls back to mock data if BigQuery fails
   - **This is what we're fixing now** ✅

3. **Complaints Page** (`/dashboard/complaints`)
   - Uses static data from `complaints-data.ts`

4. **Regional Page** (`/dashboard/regional`)
   - Uses static data from `regional-data.ts`

## 🎯 Next Steps (Optional)

To load real data in the main dashboard:

1. Create API routes for score and sentiment data
2. Update `dashboard/page.tsx` to fetch from APIs instead of static data
3. Query BigQuery tables with aggregated metrics

---

**Current Status**: Code is deployed and ready. Just need to add the service account JSON credentials to Vercel!

