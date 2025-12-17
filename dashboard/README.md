# TD Bank Brand Health Dashboard

A comprehensive brand health analytics dashboard for tracking TD Bank's perception across social media, news, and customer feedback.

## 📁 Structure

```
dashboard/
├── data/                    # CSV data files for brand health metrics
│   ├── csv_dec_08_2025/     # December 2025 data batch
│   ├── csv_nov_15_2025/     # November 2025 data batch
│   └── google_trends_updated/  # Google Trends geo data
└── frontend/                # Next.js dashboard application
    ├── src/
    │   ├── app/             # Next.js app router pages
    │   ├── components/      # React components
    │   └── lib/             # Data loaders and utilities
    └── public/              # Static assets
```

## 🚀 Dashboard Features

### Main Dashboard Pages

| Page | Description |
|------|-------------|
| **Overview** (`/dashboard`) | Executive summary with key metrics, sentiment trends, and brand health scores |
| **Awareness** (`/dashboard/awareness`) | Google Trends data, regional search interest, and brand visibility metrics |
| **Engagement** (`/dashboard/engagement`) | Social media engagement metrics and interaction analysis |
| **Advocacy** (`/dashboard/advocacy`) | News coverage, media sentiment, and advocacy tracking |
| **Complaints** (`/dashboard/complaints`) | CFPB complaint analysis, trends, and categorization |
| **Tweets** (`/dashboard/tweets`) | Twitter/X sentiment analysis and trending topics |
| **FAQ** (`/dashboard/faq`) | Frequently asked questions about the dashboard |

### Key Metrics Tracked

- **Brand Health Index (BHI)** - Composite score from multiple data sources
- **Sentiment Analysis** - Positive/Negative/Neutral sentiment breakdown
- **Regional Performance** - State/province-level brand perception
- **Competitor Comparison** - TD Bank vs Top 5 banks and regional banks

## 📊 Data Sources

| Source | Description | Update Frequency |
|--------|-------------|------------------|
| Google Trends | Search interest by region | Weekly |
| CFPB | Consumer complaint data | Weekly |
| News/Media | Advocacy and news coverage | Daily |
| Social Media | Twitter, Reddit mentions | Real-time |

## 🛠️ Frontend Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Data**: BigQuery + CSV fallback

## 🔧 Local Development

```bash
cd dashboard/frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 🌐 Deployment

The frontend is deployed on Vercel:
- **Production**: https://brand-health-frontend-deploy.vercel.app

### Environment Variables

Required for BigQuery integration:
```
GOOGLE_CLOUD_PROJECT=your-project-id
BIGQUERY_DATASET=brand_health_dev
GOOGLE_APPLICATION_CREDENTIALS_JSON=<base64-encoded-service-account>
```

## 📈 Data Files

### December 2025 Batch (`csv_dec_08_2025/`)
- `Sep 28 to Dec 07.csv` - Brand health scores
- `complaints-2025-12-08_12_02.csv` - CFPB complaints
- `weekly_complaints_Sep 28_Dec 7.csv` - Weekly complaint trends
- `advocacy_Sep 28_Nov 30 (1).csv` - News and advocacy data
- `Top 5 banks overall.csv` - Competitor comparison
- `Regional banks overall.csv` - Regional bank comparison

### November 2025 Batch (`csv_nov_15_2025/`)
- `10-12 to 10-25 scores.csv` - Brand health scores
- `sentiment_totals.csv` - Sentiment aggregates
- `trends_geoMap*.csv` - Google Trends geo data

## 🔗 Related Components

- **Reddit Fetcher** (`../reddit-fetcher/`) - Reddit data collection
- **Data Retrieval** (`../data_retrieval/`) - Data pipeline scripts
- **Score Calculation** (`../calculate_scores/`) - BHI calculation logic
