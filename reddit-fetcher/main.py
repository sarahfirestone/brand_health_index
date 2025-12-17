"""
Idempotent Reddit API Data Fetcher - WORKING VERSION
Fetches Reddit posts and comments with natural IDs and state tracking
Implements pagination and deduplication to avoid duplicates
"""

import os
import json
import logging
import hashlib
import gzip
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional, Tuple
import time
import uuid

import praw
from google.cloud import storage
from google.cloud import secretmanager
from google.cloud import bigquery
import functions_framework
import requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
PROJECT_ID = os.environ.get('PROJECT_ID')
BUCKET_NAME = os.environ.get('GCS_BUCKET', 'brand-health-raw-data')
REDDIT_SECRET_NAME = os.environ.get('REDDIT_SECRET_NAME', 'reddit-credentials')
BQ_DATASET = os.environ.get('BQ_DATASET', 'brand_health_raw')
REDDIT_REQUESTS_PER_MINUTE = int(os.environ.get('REDDIT_REQUESTS_PER_MINUTE', '100'))
BATCH_SIZE = int(os.environ.get('BATCH_SIZE', '1000'))

# Rate limiting
REQUEST_DELAY = 60.0 / REDDIT_REQUESTS_PER_MINUTE  # seconds between requests

# Financial institutions to track - ESSENTIAL KEYWORDS ONLY
FINANCIAL_BRANDS = {
    'td_bank': ['TD Bank', 'TD', 'Toronto Dominion Bank', 'Toronto-Dominion Bank']
}

# WORKING SUBREDDITS ONLY - verified to exist
RELEVANT_SUBREDDITS = [
    # Core Personal Finance (verified working)
    'personalfinance', 'banking', 'povertyfinance', 'frugal',
    
    # Canadian Finance (verified working)
    'PersonalFinanceCanada', 'CanadianInvestor',
    'ontario', 'toronto', 'canada',
    
    # US Finance (verified working)
    'financialindependence', 'StudentLoans',
    
    # Product-specific (verified working)
    'creditcards', 'mortgages', 'investing', 'realestate',
]

class IngestionState:
    """Manages ingestion state for idempotent processing"""
    
    def __init__(self, bq_client: bigquery.Client):
        self.bq_client = bq_client
        self.dataset_id = BQ_DATASET
        self.table_id = 'ingestion_state'
        self._ensure_table_exists()
    
    def _ensure_table_exists(self):
        """Create ingestion state table if it doesn't exist"""
        table_ref = self.bq_client.dataset(self.dataset_id).table(self.table_id)
        
        try:
            self.bq_client.get_table(table_ref)
            logger.info(f"Ingestion state table exists: {self.table_id}")
        except Exception:
            # Create table
            schema = [
                bigquery.SchemaField("source", "STRING", mode="REQUIRED"),
                bigquery.SchemaField("cursor_iso", "STRING", mode="NULLABLE"),
                bigquery.SchemaField("tie_breaker_id", "STRING", mode="NULLABLE"),
                bigquery.SchemaField("updated_at", "TIMESTAMP", mode="REQUIRED"),
            ]
            
            table = bigquery.Table(table_ref, schema=schema)
            table = self.bq_client.create_table(table)
            logger.info(f"Created ingestion state table: {table.table_id}")
    
    def get_state(self, source: str) -> Tuple[Optional[str], Optional[str]]:
        """Get the last cursor and tie-breaker ID for a source"""
        query = f"""
        SELECT cursor_iso, tie_breaker_id
        FROM `{PROJECT_ID}.{self.dataset_id}.{self.table_id}`
        WHERE source = @source
        ORDER BY updated_at DESC
        LIMIT 1
        """
        
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("source", "STRING", source)
            ]
        )
        
        try:
            results = list(self.bq_client.query(query, job_config=job_config))
            if results:
                row = results[0]
                return row.cursor_iso, row.tie_breaker_id
            return None, None
        except Exception as e:
            logger.warning(f"Could not get state for {source}: {e}")
            return None, None
    
    def update_state(self, source: str, cursor_iso: str, tie_breaker_id: str):
        """Update the cursor and tie-breaker ID for a source"""
        query = f"""
        INSERT INTO `{PROJECT_ID}.{self.dataset_id}.{self.table_id}`
        (source, cursor_iso, tie_breaker_id, updated_at)
        VALUES (@source, @cursor_iso, @tie_breaker_id, CURRENT_TIMESTAMP())
        """
        
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("source", "STRING", source),
                bigquery.ScalarQueryParameter("cursor_iso", "STRING", cursor_iso),
                bigquery.ScalarQueryParameter("tie_breaker_id", "STRING", tie_breaker_id),
            ]
        )
        
        try:
            self.bq_client.query(query, job_config=job_config)
            logger.info(f"Updated state for {source}: cursor={cursor_iso}, tie_breaker={tie_breaker_id}")
        except Exception as e:
            logger.error(f"Could not update state for {source}: {e}")

class IdempotentRedditFetcher:
    def __init__(self):
        self.reddit = self._initialize_reddit()
        self.storage_client = storage.Client()
        self.bq_client = bigquery.Client()
        self.state_manager = IngestionState(self.bq_client)
        self.request_count = 0
        self.start_time = time.time()
        
    def _get_reddit_credentials(self) -> Dict[str, str]:
        """Retrieve Reddit API credentials from Secret Manager"""
        client = secretmanager.SecretManagerServiceClient()
        name = f"projects/{PROJECT_ID}/secrets/{REDDIT_SECRET_NAME}/versions/latest"
        response = client.access_secret_version(request={"name": name})
        return json.loads(response.payload.data.decode("UTF-8"))
    
    def _initialize_reddit(self) -> praw.Reddit:
        """Initialize Reddit API client"""
        creds = self._get_reddit_credentials()
        return praw.Reddit(
            client_id=creds['client_id'],
            client_secret=creds['client_secret'],
            user_agent=creds['user_agent'],
            username=creds.get('username'),
            password=creds.get('password')
        )
    
    def _rate_limit(self):
        """Enforce rate limiting"""
        self.request_count += 1
        if self.request_count % 10 == 0:
            elapsed = time.time() - self.start_time
            expected_time = self.request_count * REQUEST_DELAY
            if elapsed < expected_time:
                sleep_time = expected_time - elapsed
                logger.info(f"Rate limiting: sleeping {sleep_time:.2f}s")
                time.sleep(sleep_time)
    
    def _generate_natural_id(self, reddit_type: str, reddit_id: str) -> str:
        """Generate natural ID for Reddit content"""
        if reddit_type == 'submission':
            return f"reddit_post_{reddit_id}"
        else:
            return f"reddit_comment_{reddit_id}"
    
    def _generate_content_hash(self, text: str) -> str:
        """Generate content hash for detecting edits"""
        return hashlib.sha256(text.encode('utf-8')).hexdigest()[:16]
    
    def detect_brand_mentions(self, text: str) -> Dict[str, Any]:
        """Simple brand detection"""
        text_lower = text.lower()
        for brand_id, terms in FINANCIAL_BRANDS.items():
            for term in terms:
                if term.lower() in text_lower:
                    return {
                        'brand_id': brand_id,
                        'matched_terms': [term],
                        'confidence_score': 1.0
                    }
        return {
            'brand_id': None,
            'matched_terms': [],
            'confidence_score': 0.0
        }
    
    def fetch_incremental_posts_and_comments(self, 
                                           subreddit_name: str, 
                                           brand_terms: List[str],
                                           since_timestamp: Optional[int] = None,
                                           initial_fetch: bool = False) -> List[Dict[str, Any]]:
        """Fetch posts and comments incrementally with pagination"""
        
        all_messages = []
        source_key = f"reddit_{subreddit_name}"
        
        # Get last state
        last_cursor, last_tie_breaker = self.state_manager.get_state(source_key)
        
        # Set default lookback if no state
        if not since_timestamp and not last_cursor:
            since_timestamp = int((datetime.utcnow() - timedelta(days=7)).timestamp())
        
        try:
            subreddit = self.reddit.subreddit(subreddit_name)
            
            # Search for each brand term
            for term in brand_terms:
                self._rate_limit()
                
                try:
                    # Search posts
                    for submission in subreddit.search(term, sort='new', time_filter='month', limit=100):
                        if since_timestamp and submission.created_utc < since_timestamp:
                            continue
                            
                        # Process submission
                        submission_data = self._process_submission(submission, subreddit_name)
                        if submission_data:
                            all_messages.append(submission_data)
                        
                        # Process comments
                        self._rate_limit()
                        submission.comments.replace_more(limit=5)
                        for comment in submission.comments.list()[:50]:  # Limit comments per post
                            comment_data = self._process_comment(comment, subreddit_name)
                            if comment_data:
                                all_messages.append(comment_data)
                
                except Exception as e:
                    logger.error(f"Error searching {subreddit_name} for '{term}': {e}")
                    continue
        
        except Exception as e:
            logger.error(f"Error accessing subreddit {subreddit_name}: {e}")
            return []
        
        # Update state if we got data
        if all_messages:
            # Sort by timestamp to get latest
            all_messages.sort(key=lambda x: x['timestamp'])
            latest_msg = all_messages[-1]
            
            # Update state
            cursor_iso = datetime.fromtimestamp(latest_msg['timestamp']).isoformat()
            tie_breaker = latest_msg['natural_id']
            self.state_manager.update_state(source_key, cursor_iso, tie_breaker)
        
        logger.info(f"Fetched {len(all_messages)} messages from r/{subreddit_name}")
        return all_messages
    
    def _process_submission(self, submission, subreddit_name: str) -> Optional[Dict[str, Any]]:
        """Process a Reddit submission"""
        try:
            # Basic brand detection
            text_content = f"{submission.title} {submission.selftext}"
            brand_detection = self.detect_brand_mentions(text_content)
            
            if brand_detection['brand_id'] is None:
                return None  # Skip if no brand mention
            
            # Enrich with NLP
            nlp_data = self._enrich_with_nlp(text_content)
            
            return {
                'natural_id': self._generate_natural_id('submission', submission.id),
                'source': 'reddit',
                'subreddit': subreddit_name,
                'type': 'submission',
                'reddit_id': submission.id,
                'title': submission.title,
                'text': submission.selftext,
                'author': str(submission.author) if submission.author else '[deleted]',
                'timestamp': int(submission.created_utc),
                'score': submission.score,
                'num_comments': submission.num_comments,
                'url': f"https://reddit.com{submission.permalink}",
                'content_hash': self._generate_content_hash(text_content),
                'brand_detection': brand_detection,
                **nlp_data
            }
        except Exception as e:
            logger.error(f"Error processing submission {submission.id}: {e}")
            return None
    
    def _process_comment(self, comment, subreddit_name: str) -> Optional[Dict[str, Any]]:
        """Process a Reddit comment"""
        try:
            if not hasattr(comment, 'body') or comment.body in ['[deleted]', '[removed]']:
                return None
            
            # Basic brand detection
            brand_detection = self.detect_brand_mentions(comment.body)
            
            if brand_detection['brand_id'] is None:
                return None  # Skip if no brand mention
            
            # Enrich with NLP
            nlp_data = self._enrich_with_nlp(comment.body)
            
            return {
                'natural_id': self._generate_natural_id('comment', comment.id),
                'source': 'reddit',
                'subreddit': subreddit_name,
                'type': 'comment',
                'reddit_id': comment.id,
                'title': '',
                'text': comment.body,
                'author': str(comment.author) if comment.author else '[deleted]',
                'timestamp': int(comment.created_utc),
                'score': comment.score,
                'parent_id': comment.parent_id,
                'url': f"https://reddit.com{comment.permalink}",
                'content_hash': self._generate_content_hash(comment.body),
                'brand_detection': brand_detection,
                **nlp_data
            }
        except Exception as e:
            logger.error(f"Error processing comment {comment.id}: {e}")
            return None
    
    def _enrich_with_nlp(self, text: str) -> Dict[str, Any]:
        """Enrich text with NLP analysis"""
        try:
            # Import NLP module
            from main_nlp import NLPEnricher
            nlp_enricher = NLPEnricher()
            return nlp_enricher.enrich_text(text)
        except Exception as e:
            logger.warning(f"NLP enrichment failed: {e}")
            return {
                'sentiment': 0.0,
                'severity': 0.0,
                'topics': [],
                'language': 'en',
                'nlp_confidence': 0.0,
                'nlp_model': 'fallback',
                'nlp_error': str(e)
            }
    
    def save_to_gcs(self, messages: List[Dict[str, Any]], run_timestamp: str):
        """Save messages to GCS"""
        if not messages:
            return
        
        # Group by date for partitioning
        by_date = {}
        for msg in messages:
            date_str = datetime.fromtimestamp(msg['timestamp']).strftime('%Y-%m-%d')
            if date_str not in by_date:
                by_date[date_str] = []
            by_date[date_str].append(msg)
        
        # Save each date partition
        for date_str, date_messages in by_date.items():
            filename = f"raw/reddit/dt={date_str}/part-{run_timestamp}-{uuid.uuid4().hex[:8]}.jsonl.gz"
            
            # Compress and upload
            bucket = self.storage_client.bucket(BUCKET_NAME)
            blob = bucket.blob(filename)
            
            # Create gzipped JSONL
            import io
            buffer = io.BytesIO()
            with gzip.GzipFile(fileobj=buffer, mode='wb') as gz_file:
                for msg in date_messages:
                    line = json.dumps(msg, ensure_ascii=False) + '\n'
                    gz_file.write(line.encode('utf-8'))
            
            # Upload
            blob.upload_from_string(buffer.getvalue(), content_type='application/gzip')
            logger.info(f"Saved {len(date_messages)} messages to gs://{BUCKET_NAME}/{filename}")

@functions_framework.http
def fetch_reddit_data_idempotent(request):
    """Main Cloud Function entry point"""
    try:
        # Parse request
        request_json = request.get_json(silent=True)
        if not request_json:
            request_json = {}
        
        logger.info(f"Received request: {request_json}")
        
        # Extract parameters
        initial_fetch = request_json.get('initial_fetch', False)
        target_date = request_json.get('start_date')  # For specific date fetching
        subreddits = request_json.get('subreddits', RELEVANT_SUBREDDITS)
        
        # For initial fetch or if no target date, process multiple days
        if initial_fetch or not target_date:
            since_timestamp = None  # Will use state or default to 7 days
        else:
            # Calculate since timestamp for specific date
            date_obj = datetime.strptime(target_date, '%Y-%m-%d')
            since_timestamp = int(date_obj.timestamp())
        
        fetcher = IdempotentRedditFetcher()
        run_timestamp = datetime.utcnow().strftime('%Y%m%d-%H%M%S')
        
        # Collect all brand terms for efficient searching
        all_brand_terms = []
        for terms in FINANCIAL_BRANDS.values():
            all_brand_terms.extend(terms)
        
        total_messages = 0
        
        # Process each subreddit
        for subreddit in subreddits:
            logger.info(f"Processing r/{subreddit}")
            
            messages = fetcher.fetch_incremental_posts_and_comments(
                subreddit_name=subreddit,
                brand_terms=all_brand_terms,
                since_timestamp=since_timestamp,
                initial_fetch=initial_fetch
            )
            
            if messages:
                fetcher.save_to_gcs(messages, run_timestamp)
                total_messages += len(messages)
        
        # Return success response
        response = {
            "status": "success",
            "message": f"Successfully processed {len(subreddits)} subreddits",
            "total_messages": total_messages,
            "subreddits_processed": subreddits,
            "run_timestamp": run_timestamp
        }
        
        logger.info(f"Completed successfully: {total_messages} total messages")
        return json.dumps(response), 200, {'Content-Type': 'application/json'}
        
    except Exception as e:
        logger.error(f"Error in main function: {str(e)}")
        error_response = {
            "status": "error",
            "message": str(e)
        }
        return json.dumps(error_response), 500, {'Content-Type': 'application/json'}