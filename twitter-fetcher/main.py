"""
Twitter/X API v2 Data Fetcher
Fetches tweets mentioning financial brands and writes to GCS for Fivetran ingestion
"""

import os
import json
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import requests
from google.cloud import storage
from google.cloud import secretmanager
import functions_framework

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
PROJECT_ID = os.environ.get('PROJECT_ID')
BUCKET_NAME = os.environ.get('GCS_BUCKET', 'brand-health-raw-data-469110')
SECRET_NAMES = [
    'twitter-bearer-token-1',
    'twitter-bearer-token-2', 
    'twitter-bearer-token-3',
    'twitter-bearer-token-4',
    'twitter-bearer-token-5',
    'twitter-bearer-token-6',
    'twitter-bearer-token-7',
    'twitter-bearer-token-8'
]

# TD Bank search terms only
TD_BANK_TERMS = [
    'TD Bank', 
    '@TDBank_US', 
    '@TDBank', 
    'Toronto-Dominion',
    'TD Ameritrade',
    'TD Securities',
    'TD Wealth',
    'TD Insurance',
    'TD Direct Investing',
    'TDBank',
    'Toronto Dominion',
    'TD EasyWeb',
    'TD Mobile App',
    'TD Bank US',
    'TD Credit Card',
    'TD Mortgage'
]

class TwitterFetcher:
    def __init__(self):
        # Lazy loading - don't initialize heavy resources during startup
        self.bearer_token = None
        self.base_url = "https://api.twitter.com/2"
        self.headers = None
        self.storage_client = None
        
    def _get_rotated_secret(self) -> str:
        """Retrieve Twitter bearer tokens sequentially to distribute load"""
        if self.bearer_token is None:
            # Get the next token in sequence
            key_index = self._get_next_token_index()
            selected_secret = SECRET_NAMES[key_index]
            
            logger.info(f"🔄 Using Twitter API key: {selected_secret} (key {key_index + 1}/{len(SECRET_NAMES)})")
            
            client = secretmanager.SecretManagerServiceClient()
            name = f"projects/{PROJECT_ID}/secrets/{selected_secret}/versions/latest"
            response = client.access_secret_version(request={"name": name})
            self.bearer_token = response.payload.data.decode("UTF-8")
        
        return self.bearer_token
    
    def _get_next_token_index(self) -> int:
        """Get the next token index in sequence, cycling through all tokens"""
        try:
            # Try to read the last used index from GCS
            bucket = self._get_storage_client().bucket(BUCKET_NAME)
            blob = bucket.blob("twitter_token_counter.txt")
            
            if blob.exists():
                # Read the last used index
                last_index = int(blob.download_as_text().strip())
                next_index = (last_index + 1) % len(SECRET_NAMES)
            else:
                # First time, start with token 0
                next_index = 0
            
            # Save the new index for next time
            blob.upload_from_string(str(next_index))
            
            return next_index
            
        except Exception as e:
            logger.warning(f"Could not read token counter, using random: {e}")
            import random
            return random.randint(0, len(SECRET_NAMES) - 1)
    
    def _get_headers(self):
        """Get headers with lazy-loaded token"""
        if self.headers is None:
            token = self._get_rotated_secret()
            self.headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        return self.headers
    
    def _get_storage_client(self):
        """Get storage client with lazy loading"""
        if self.storage_client is None:
            self.storage_client = storage.Client()
        return self.storage_client
    
    def _build_query(self, brand_terms: List[str]) -> str:
        """Build Twitter search query for brand mentions"""
        # Combine brand terms with OR, exclude retweets
        terms = ' OR '.join([f'"{term}"' for term in brand_terms])
        return f"({terms}) -is:retweet lang:en"
    
    def test_api_connection(self) -> bool:
        """Test basic API connection"""
        logger.info("🔍 Testing Twitter API connection...")
        
        try:
            # Test with a simple user lookup
            url = f"{self.base_url}/users/by/username/twitter"
            response = requests.get(url, headers=self._get_headers())
            
            if response.status_code == 200:
                logger.info("✅ Twitter API connection successful!")
                return True
            else:
                logger.error(f"❌ API connection failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"❌ API connection error: {e}")
            return False
    
    def fetch_tweets_batch(self, since_date: str, max_results: int = 100, next_token: str = None) -> tuple:
        """Fetch a single batch of tweets for TD Bank"""
        
        query = self._build_query(TD_BANK_TERMS)
        
        params = {
            'query': query,
            'max_results': min(max_results, 100),  # API limit
            'start_time': since_date,
            'tweet.fields': 'id,text,author_id,created_at,lang,public_metrics,possibly_sensitive,geo',
            'user.fields': 'id,username,location,verified',
            'expansions': 'author_id,geo.place_id'
        }
        
        if next_token:
            params['next_token'] = next_token
        
        url = f"{self.base_url}/tweets/search/recent"
        
        try:
            response = requests.get(url, headers=self._get_headers(), params=params)
            response.raise_for_status()
            
            data = response.json()
            tweets = []
            
            if 'data' in data:
                users = {u['id']: u for u in data.get('includes', {}).get('users', [])}
                places = {p['id']: p for p in data.get('includes', {}).get('places', [])}
                
                for tweet in data['data']:
                    # Enrich with user and place data
                    user = users.get(tweet['author_id'], {})
                    place = places.get(tweet.get('geo', {}).get('place_id'), {})
                    
                    processed_tweet = {
                        'brand_id': 'td',
                        'tweet_id': tweet['id'],
                        'ts_event': tweet['created_at'],
                        'author_id': tweet['author_id'],
                        'author_username': user.get('username'),
                        'author_verified': user.get('verified', False),
                        'author_location': user.get('location'),
                        'text': tweet['text'],
                        'lang': tweet.get('lang', 'en'),
                        'like_count': tweet['public_metrics']['like_count'],
                        'reply_count': tweet['public_metrics']['reply_count'],
                        'retweet_count': tweet['public_metrics']['retweet_count'],
                        'quote_count': tweet['public_metrics']['quote_count'],
                        'possibly_sensitive': tweet.get('possibly_sensitive', False),
                        'geo_country': place.get('country'),
                        'geo_place_id': tweet.get('geo', {}).get('place_id'),
                        'collected_at': datetime.utcnow().isoformat()
                    }
                    tweets.append(processed_tweet)
            
            # Get next token for pagination
            next_token = data.get('meta', {}).get('next_token')
            
            return tweets, next_token
            
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ Error fetching TD Bank tweets: {e}")
            return [], None

    def fetch_tweets(self, since_date: str, max_results: int = 100) -> List[Dict[str, Any]]:
        """Fetch tweets for TD Bank with pagination to get maximum data"""
        
        logger.info(f"🔍 Fetching TD Bank tweets (max {max_results}): {self._build_query(TD_BANK_TERMS)}")
        
        all_tweets = []
        next_token = None
        batch_count = 0
        max_batches = 10  # Limit to prevent excessive API calls
        
        while len(all_tweets) < max_results and batch_count < max_batches:
            batch_count += 1
            logger.info(f"📦 Fetching batch {batch_count}...")
            
            tweets, next_token = self.fetch_tweets_batch(since_date, 100, next_token)
            
            if not tweets:
                logger.info("No more tweets found")
                break
                
            all_tweets.extend(tweets)
            logger.info(f"   ✅ Got {len(tweets)} tweets (total: {len(all_tweets)})")
            
            if not next_token:
                logger.info("No more pages available")
                break
        
        # Limit to requested amount
        if len(all_tweets) > max_results:
            all_tweets = all_tweets[:max_results]
        
        logger.info(f"✅ Fetched {len(all_tweets)} TD Bank tweets total")
        return all_tweets
    
    def save_to_gcs(self, tweets: List[Dict[str, Any]], date_str: str):
        """Save tweets to GCS in NDJSON format for Fivetran"""
        if not tweets:
            logger.info("No TD Bank tweets to save")
            return
            
        bucket = self._get_storage_client().bucket(BUCKET_NAME)
        
        # Create path: raw/twitter/date=YYYY-MM-DD/td.ndjson
        blob_path = f"raw/twitter/date={date_str}/td.ndjson"
        blob = bucket.blob(blob_path)
        
        # Convert to newline-delimited JSON
        ndjson_content = '\n'.join([json.dumps(tweet) for tweet in tweets])
        
        blob.upload_from_string(ndjson_content, content_type='application/x-ndjson')
        logger.info(f"Saved {len(tweets)} TD Bank tweets to gs://{BUCKET_NAME}/{blob_path}")

@functions_framework.http
def fetch_twitter_data(request):
    """Cloud Function entry point"""
    # Handle health checks
    if request.method == 'GET':
        return {'status': 'healthy', 'service': 'twitter-fetcher'}, 200
    
    try:
        logger.info("🚀 Starting Twitter Data Fetching Cloud Function")
        logger.info("=" * 50)
        
        # Parse request parameters
        request_json = request.get_json(silent=True) or {}
        
        # Default to today's data
        target_date = request_json.get('date')
        if not target_date:
            today = datetime.utcnow()
            target_date = today.strftime('%Y-%m-%d')
        
        # Calculate since_time for API (ISO format)
        date_obj = datetime.strptime(target_date, '%Y-%m-%d')
        since_time = date_obj.isoformat() + 'Z'
        
        logger.info(f"📅 Fetching data for date: {target_date}")
        logger.info(f"🎯 Processing TD Bank only")
        
        fetcher = TwitterFetcher()
        
        # Test API connection first
        if not fetcher.test_api_connection():
            logger.error("❌ API connection failed. Please check your bearer token.")
            return {'status': 'error', 'message': 'API connection failed'}, 500
        
        # Initialize results tracking
        results = {
            'test_date': datetime.utcnow().isoformat(),
            'target_date': target_date,
            'total_tweets': 0,
            'status': 'pending'
        }
        
        # Fetch data for TD Bank
        try:
            logger.info(f"\n🏦 Processing TD Bank...")
            tweets = fetcher.fetch_tweets(since_time, max_results=100)
            
            if tweets:
                fetcher.save_to_gcs(tweets, target_date)
                total_tweets = len(tweets)
                results['total_tweets'] = total_tweets
                results['status'] = 'success'
                
                logger.info(f"   ✅ TD Bank: {total_tweets} tweets saved to GCS")
            else:
                results['status'] = 'no_data'
                logger.info(f"   ⚠️ TD Bank: No tweets found")
                
        except Exception as e:
            logger.error(f"   ❌ TD Bank: Error - {e}")
            results['status'] = 'error'
            results['error'] = str(e)
        
        # Log final results
        logger.info("\n" + "=" * 50)
        logger.info("📊 TD Bank Twitter Data Fetching Results:")
        logger.info(f"   📅 Date: {target_date}")
        logger.info(f"   📝 Total tweets: {results['total_tweets']}")
        logger.info(f"   📁 Data saved to: gs://{BUCKET_NAME}/raw/twitter/date={target_date}/td.ndjson")
        
        return results, 200
        
    except Exception as e:
        logger.error(f"❌ Error in fetch_twitter_data: {e}")
        return {'status': 'error', 'message': str(e)}, 500

if __name__ == '__main__':
    # For local testing
    from flask import Flask, request
    app = Flask(__name__)
    app.route('/', methods=['POST'])(fetch_twitter_data)
    app.run(debug=True, port=8080)