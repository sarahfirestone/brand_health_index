"""
CFPB Consumer Complaints Data Fetcher
Fetches consumer complaint data from CFPB's Socrata API
"""

import os
import json
import logging
import time
import csv
import io
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import requests

# Conditional import for GCS (only needed when use_storage=True)
try:
    from google.cloud import storage
    GCS_AVAILABLE = True
except ImportError:
    GCS_AVAILABLE = False
    storage = None

try:
    import functions_framework
except ImportError:
    # functions_framework not available in local testing
    functions_framework = None

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
PROJECT_ID = os.environ.get('PROJECT_ID')
BUCKET_NAME = os.environ.get('GCS_BUCKET', 'brand-health-raw-data')

# CFPB API configuration
CFPB_API_BASE = "https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/"

# Financial institutions mapping (company names as they appear in CFPB data) 
# Only TD Bank is configured for this pipeline
FINANCIAL_COMPANIES = {
    'td': [
        'TD BANK US HOLDING COMPANY',
        'TD BANK, N.A.',
        'TD BANK USA, NATIONAL ASSOCIATION'
    ]
}

class CFPBFetcher:
    def __init__(self, use_storage=True):
        self.use_storage = use_storage
        if use_storage and GCS_AVAILABLE:
            try:
                self.storage_client = storage.Client()
            except Exception as e:
                logger.warning(f"Could not initialize GCS client: {e}. Using local mode.")
                self.storage_client = None
                self.use_storage = False
        else:
            self.storage_client = None
        self.session = requests.Session()
        # Set proper headers for CFPB API
        self.session.headers.update({
            'User-Agent': 'Brand-Health-Index-Pipeline/1.0 (Consumer Complaint Analysis)',
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate'
        })
    
    def fetch_complaints(self, brand_id: str, company_names: List[str], 
                        date_received_min: str = None, date_received_max: str = None,
                        limit: int = 100, fetch_all: bool = False) -> List[Dict[str, Any]]:
        """Fetch complaints for specific companies from CFPB API
        
        Args:
            brand_id: Brand identifier
            company_names: List of company names to search for
            date_received_min: Minimum date (YYYY-MM-DD) - start of date range
            date_received_max: Maximum date (YYYY-MM-DD) - end of date range (inclusive)
            limit: Max results per request (API limit is 100 for JSON)
            fetch_all: If True, fetches all available data (handles pagination)
        """
        
        all_complaints = []
        
        for company_name in company_names:
            try:
                # Rate limiting to avoid overwhelming CFPB API
                time.sleep(1.0)  # 1 second delay between requests
                
                # Build query parameters - CFPB API uses date_received_min/max, not date_received_gte
                params = {
                    'company': company_name,
                    'size': min(limit, 100),  # API JSON max is 100
                    'sort': 'created_date_desc',  # Valid sort value
                    'no_aggs': 'true',  # Faster if we don't need aggregations
                    'format': 'json'  # Explicit format - REQUIRED
                }
                
                # Add date filters if provided
                if date_received_min:
                    params['date_received_min'] = date_received_min
                if date_received_max:
                    params['date_received_max'] = date_received_max
                
                logger.info(f"Fetching complaints for {company_name} from {params.get('date_received_min')} to {params.get('date_received_max')}")
                
                # Make the API request
                response = self.session.get(CFPB_API_BASE, params=params, timeout=30)
                response.raise_for_status()
                
                # Parse JSON response with error handling
                try:
                    data = response.json()
                except Exception as e:
                    logger.error(f"Non-JSON response for {company_name}: {response.text[:300]}")
                    continue
                
                # GUARD: ensure response is a dict (not a list or other structure)
                if not isinstance(data, dict):
                    logger.error(f"Unexpected JSON type ({type(data).__name__}) for {company_name}: {str(data)[:200]}")
                    continue
                
                # Extract hits with validation
                hits = data.get('hits', {}).get('hits', [])
                if not isinstance(hits, list):
                    logger.error(f"Unexpected 'hits' shape for {company_name}: {str(data)[:200]}")
                    continue
                
                total_hits = (data.get('hits', {}).get('total', {}) or {}).get('value', 0)
                
                if not hits:
                    logger.info(f"No complaints found for {company_name}")
                    continue
                
                # Process complaints from this page
                for hit in hits:
                    # Extract _source from hit (API wraps data in _source)
                    src = hit.get('_source') or {}
                    if not src:
                        # If no _source, try using hit directly (fallback)
                        src = hit if isinstance(hit, dict) else {}
                    
                    complaint = self._process_complaint(src, brand_id)
                    if complaint:
                        all_complaints.append(complaint)
                
                logger.info(f"Fetched {len(hits)} complaints for {company_name} (total available reported: {total_hits})")
                
                # NOTE: Proper deep pagination requires `search_after` using _meta.break_points.
                # If you need >100 per company, implement that here.
                if fetch_all and total_hits > len(hits):
                    logger.warning(f"More results exist ({total_hits} total, {len(hits)} fetched); implement search_after pagination if needed.")
                
            except requests.exceptions.RequestException as e:
                logger.error(f"Error fetching complaints for {company_name}: {e}")
                continue
            except Exception as e:
                logger.error(f"Unexpected error processing {company_name}: {e}")
                continue
        
        # Remove duplicates based on complaint_id
        unique_complaints = {}
        for complaint in all_complaints:
            complaint_id = complaint['complaint_id']
            if complaint_id not in unique_complaints:
                unique_complaints[complaint_id] = complaint
        
        final_complaints = list(unique_complaints.values())
        logger.info(f"Total unique complaints for brand {brand_id}: {len(final_complaints)}")
        
        return final_complaints
    
    def _process_complaint(self, complaint_data: Dict[str, Any], brand_id: str) -> Optional[Dict[str, Any]]:
        """Process CFPB complaint into standardized format - uses API field names"""
        try:
            # Map CFPB API fields to our schema (API uses different field names than CSV)
            processed = {
                'brand_id': brand_id,
                'complaint_id': complaint_data.get('complaint_id'),
                'ts_event': self._parse_date(complaint_data.get('date_received')),
                'product': complaint_data.get('product'),
                'sub_product': complaint_data.get('sub_product'),
                'issue': complaint_data.get('issue'),
                'sub_issue': complaint_data.get('sub_issue'),
                'consumer_complaint_narrative': complaint_data.get('complaint_what_happened'),  # API field name
                'company_response_to_consumer': complaint_data.get('company_response'),  # API field name
                'timely_response': self._parse_boolean(complaint_data.get('timely')),  # API field name
                'consumer_disputed': self._parse_boolean(complaint_data.get('consumer_disputed')),
                'submitted_via': complaint_data.get('submitted_via'),
                'date_sent_to_company': self._parse_date(complaint_data.get('date_sent_to_company')),
                'company_public_response': complaint_data.get('company_public_response'),
                'tags': complaint_data.get('tags'),
                'state': complaint_data.get('state'),
                'zip_code': complaint_data.get('zip_code'),
                'geo_country': 'US',  # CFPB is US-only
                'collected_at': datetime.utcnow().isoformat()
            }
            
            # Calculate severity score based on available indicators
            processed['severity_score'] = self._calculate_severity_score(complaint_data)
            
            return processed
            
        except Exception as e:
            logger.error(f"Error processing complaint {complaint_data.get('complaint_id', 'unknown')}: {e}")
            return None
    
    def _parse_date(self, date_string: Optional[str]) -> Optional[str]:
        """Parse date string to ISO format - handles multiple formats"""
        if not date_string:
            return None
        try:
            # Try MM/DD/YY format (from CSV)
            if '/' in date_string:
                parts = date_string.split('/')
                if len(parts) == 3:
                    month, day, year = parts
                    # Handle 2-digit year
                    if len(year) == 2:
                        year = '20' + year if int(year) < 50 else '19' + year
                    dt = datetime(int(year), int(month), int(day))
                    return dt.isoformat()
            
            # Try YYYY-MM-DD format (from API)
            dt = datetime.strptime(date_string, '%Y-%m-%d')
            return dt.isoformat()
        except:
            return date_string  # Return as-is if parsing fails
    
    def _parse_boolean(self, value: Optional[str]) -> Optional[bool]:
        """Parse string boolean values"""
        if not value:
            return None
        value_str = str(value).strip().lower()
        if value_str in ['none', 'n/a', '']:
            return None
        return value_str in ['yes', 'true', '1']
    
    def _clean_value(self, value: Optional[str]) -> Optional[str]:
        """Clean string values - handle None, N/A, etc."""
        if not value:
            return None
        value = str(value).strip()
        if value.lower() in ['none', 'n/a', '']:
            return None
        return value
    
    def _calculate_severity_score(self, complaint_data: Dict[str, Any]) -> float:
        """Calculate a severity score (0-1) based on complaint characteristics - uses API field names"""
        score = 0.0
        
        # Base score for having a complaint
        score += 0.3
        
        # Higher severity for certain products
        high_severity_products = ['mortgage', 'debt collection', 'credit reporting']
        product = str(complaint_data.get('product', '')).lower()
        if any(hsp in product for hsp in high_severity_products):
            score += 0.2
        
        # Consumer disputed adds severity
        if str(complaint_data.get('consumer_disputed', '')).lower() == 'yes':
            score += 0.2
        
        # Untimely response adds severity (API uses 'timely' field)
        if str(complaint_data.get('timely', '')).lower() != 'yes':
            score += 0.1
        
        # Has narrative (consumer took time to write) adds severity
        # API uses 'complaint_what_happened' or 'has_narrative' boolean
        if complaint_data.get('has_narrative') or complaint_data.get('complaint_what_happened'):
            score += 0.1
        
        # Public response suggests more serious complaint
        if complaint_data.get('company_public_response'):
            score += 0.1
        
        return min(score, 1.0)  # Cap at 1.0
    
    def save_to_gcs(self, complaints: List[Dict[str, Any]], brand_id: str, date_str: str):
        """Save complaints to GCS or local file in NDJSON format"""
        if not complaints:
            logger.info(f"No complaints to save for brand {brand_id}")
            return
        
        # Convert to newline-delimited JSON
        ndjson_content = '\n'.join([json.dumps(complaint) for complaint in complaints])
        
        if self.storage_client:
            # Save to GCS
            bucket = self.storage_client.bucket(BUCKET_NAME)
            blob_path = f"raw/cfpb/date={date_str}/{brand_id}.ndjson"
            blob = bucket.blob(blob_path)
            blob.upload_from_string(ndjson_content, content_type='application/x-ndjson')
            logger.info(f"Saved {len(complaints)} complaints to gs://{BUCKET_NAME}/{blob_path}")
        else:
            # Save locally
            LOCAL_SAVE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'cfpb_data')
            local_rel_path = os.path.join('raw', 'cfpb', f'date={date_str}', f'{brand_id}.ndjson')
            local_abs_path = os.path.join(LOCAL_SAVE_DIR, local_rel_path)
            
            os.makedirs(os.path.dirname(local_abs_path), exist_ok=True)
            with open(local_abs_path, 'w', encoding='utf-8') as f:
                f.write(ndjson_content)
            logger.info(f"Saved {len(complaints)} complaints to {local_abs_path}")
    
    def process_csv_file(self, csv_content: str, brand_id: str) -> List[Dict[str, Any]]:
        """Process CSV content and convert to standardized complaint format
        
        Args:
            csv_content: CSV file content as string
            brand_id: Brand identifier
            
        Returns:
            List of processed complaints
        """
        complaints = []
        errors = []
        
        try:
            # Read CSV from string
            csv_file = io.StringIO(csv_content)
            reader = csv.DictReader(csv_file)
            
            if not reader.fieldnames:
                logger.error("CSV file has no headers")
                return []
            
            logger.info(f"Processing CSV with {len(reader.fieldnames)} columns")
            
            for row_num, row in enumerate(reader, start=2):  # Start at 2 (header is row 1)
                try:
                    # Map CSV columns to our schema
                    complaint = {
                        'brand_id': brand_id,
                        'complaint_id': self._clean_value(row.get('Complaint ID')),
                        'ts_event': self._parse_date(row.get('Date received')),
                        'product': self._clean_value(row.get('Product')),
                        'sub_product': self._clean_value(row.get('Sub-product')),
                        'issue': self._clean_value(row.get('Issue')),
                        'sub_issue': self._clean_value(row.get('Sub-issue')),
                        'consumer_complaint_narrative': self._clean_value(row.get('Consumer complaint narrative')),
                        'company_response_to_consumer': self._clean_value(row.get('Company response to consumer')),
                        'timely_response': self._parse_boolean(row.get('Timely response?')),
                        'consumer_disputed': self._parse_boolean(row.get('Consumer disputed?')),
                        'submitted_via': self._clean_value(row.get('Submitted via')),
                        'date_sent_to_company': self._parse_date(row.get('Date sent to company')),
                        'company_public_response': self._clean_value(row.get('Company public response')),
                        'tags': self._clean_value(row.get('Tags')),
                        'state': self._clean_value(row.get('State')),
                        'zip_code': self._clean_value(row.get('ZIP code')),
                        'geo_country': 'US',  # CFPB is US-only
                        'collected_at': datetime.utcnow().isoformat()
                    }
                    
                    # Calculate severity score (use raw row data for calculation)
                    complaint['severity_score'] = self._calculate_severity_score_from_csv(row)
                    
                    # Validate required fields
                    if not complaint['complaint_id']:
                        errors.append(f"Row {row_num}: Missing complaint_id")
                        continue
                    
                    complaints.append(complaint)
                    
                    if row_num % 100 == 0:
                        logger.info(f"Processed {row_num} rows...")
                
                except Exception as e:
                    errors.append(f"Row {row_num}: {str(e)}")
                    logger.warning(f"Error processing row {row_num}: {e}")
                    continue
            
            logger.info(f"Processed {len(complaints)} complaints from CSV")
            if errors:
                logger.warning(f"Encountered {len(errors)} errors during CSV processing")
            
            return complaints
            
        except Exception as e:
            logger.error(f"Error processing CSV: {e}")
            import traceback
            traceback.print_exc()
            return []
    
    def _calculate_severity_score_from_csv(self, row: Dict[str, Any]) -> float:
        """Calculate severity score from CSV row data"""
        score = 0.0
        
        # Base score for having a complaint
        score += 0.3
        
        # Higher severity for certain products
        high_severity_products = ['mortgage', 'debt collection', 'credit reporting']
        product = str(row.get('Product', '')).lower()
        if any(hsp in product for hsp in high_severity_products):
            score += 0.2
        
        # Consumer disputed adds severity
        disputed = str(row.get('Consumer disputed?', '')).lower()
        if disputed == 'yes':
            score += 0.2
        
        # Untimely response adds severity
        timely = str(row.get('Timely response?', '')).lower()
        if timely != 'yes':
            score += 0.1
        
        # Has narrative adds severity
        narrative = str(row.get('Consumer complaint narrative', ''))
        if narrative and narrative.lower() not in ['none', 'n/a', '']:
            score += 0.1
        
        # Public response suggests more serious complaint
        public_response = str(row.get('Company public response', ''))
        if public_response and public_response.lower() not in ['none', 'n/a', '']:
            score += 0.1
        
        return min(score, 1.0)  # Cap at 1.0
    
    def process_csv_from_gcs(self, gcs_path: str, brand_id: str) -> List[Dict[str, Any]]:
        """Download CSV from GCS and process it
        
        Args:
            gcs_path: GCS path to CSV file (e.g., 'raw/cfpb/input/file.csv')
            brand_id: Brand identifier
            
        Returns:
            List of processed complaints
        """
        if not self.storage_client:
            logger.error("Storage client not initialized - cannot read from GCS")
            return []
        
        try:
            bucket = self.storage_client.bucket(BUCKET_NAME)
            blob = bucket.blob(gcs_path)
            
            if not blob.exists():
                logger.error(f"CSV file not found in GCS: gs://{BUCKET_NAME}/{gcs_path}")
                return []
            
            logger.info(f"Downloading CSV from gs://{BUCKET_NAME}/{gcs_path}")
            csv_content = blob.download_as_text(encoding='utf-8')
            
            return self.process_csv_file(csv_content, brand_id)
            
        except Exception as e:
            logger.error(f"Error downloading/processing CSV from GCS: {e}")
            import traceback
            traceback.print_exc()
            return []

def fetch_cfpb_data(request):
    """Cloud Function entry point - supports API fetch, CSV processing, and backfill modes"""
    if functions_framework:
        # Decorate with functions_framework if available
        return _fetch_cfpb_data_impl(request)
    else:
        return _fetch_cfpb_data_impl(request)


def _fetch_cfpb_data_impl(request):
    """Implementation of fetch_cfpb_data"""
    try:
        # Parse request parameters - handle both HTTP and Pub/Sub triggers
        request_json = request.get_json(silent=True) or {}
        
        # Handle Pub/Sub message format
        if 'message' in request_json:
            import base64
            message_data = request_json['message'].get('data', '')
            if message_data:
                try:
                    decoded_data = base64.b64decode(message_data).decode('utf-8')
                    request_json = json.loads(decoded_data)
                    logger.info(f"Decoded Pub/Sub message: {request_json}")
                except Exception as e:
                    logger.warning(f"Failed to decode Pub/Sub message: {e}")
                    request_json = {}
        
        # Check for CSV processing mode
        csv_mode = request_json.get('mode') == 'csv' or request_json.get('process_csv')
        if csv_mode:
            return _handle_csv_processing(request, request_json)
        
        # Check for backfill mode
        start_date = request_json.get('start_date')
        end_date = request_json.get('end_date')
        
        if start_date and end_date:
            # Backfill mode: fetch data for date range
            return _handle_backfill(start_date, end_date)
        
        # Weekly mode: fetch last 7 days (or since last week if date specified)
        mode = request_json.get('mode', 'weekly')  # 'weekly' or 'daily'
        
        # Default to today for weekly, yesterday for daily
        if mode == 'weekly':
            target_date = request_json.get('date')
            if not target_date:
                # Default to today for weekly runs
                target_date = datetime.utcnow().strftime('%Y-%m-%d')
        else:
            # Daily mode (backward compatibility)
            target_date = request_json.get('date')
            if not target_date:
                yesterday = datetime.utcnow() - timedelta(days=1)
                target_date = yesterday.strftime('%Y-%m-%d')
        
        # Calculate date range: last 7 days (6 days back + today = 7 days total)
        # API uses date_received_min (inclusive start) and date_received_max (inclusive end)
        target_dt = datetime.strptime(target_date, '%Y-%m-%d')
        date_received_min = (target_dt - timedelta(days=6)).strftime('%Y-%m-%d')  # 6 days back
        date_received_max = target_date  # Inclusive upper bound
        
        fetcher = CFPBFetcher()
        
        # Fetch data for each brand
        total_complaints = 0
        for brand_id, company_names in FINANCIAL_COMPANIES.items():
            complaints = fetcher.fetch_complaints(
                brand_id=brand_id, 
                company_names=company_names, 
                date_received_min=date_received_min,
                date_received_max=date_received_max,
                fetch_all=False
            )
            fetcher.save_to_gcs(complaints, brand_id, target_date)
            total_complaints += len(complaints)
        
        return {
            'status': 'success',
            'mode': mode,
            'date': target_date,
            'date_received_min': date_received_min,
            'date_received_max': date_received_max,
            'total_complaints': total_complaints,
            'brands_processed': len(FINANCIAL_COMPANIES)
        }, 200
        
    except Exception as e:
        logger.error(f"Error in fetch_cfpb_data: {e}")
        return {'status': 'error', 'message': str(e)}, 500


def _handle_csv_processing(request, request_json: Dict[str, Any]):
    """Handle CSV processing mode - process CSV and save as NDJSON"""
    try:
        fetcher = CFPBFetcher()
        
        # Get brand_id (default to 'td' if not specified)
        brand_id = request_json.get('brand_id', 'td')
        
        # Get target date for output (default to today)
        target_date = request_json.get('date')
        if not target_date:
            target_date = datetime.utcnow().strftime('%Y-%m-%d')
        
        # Check if CSV is provided in request body or GCS path
        csv_content = None
        gcs_path = request_json.get('gcs_path')
        
        if gcs_path:
            # Process CSV from GCS
            logger.info(f"Processing CSV from GCS: {gcs_path}")
            complaints = fetcher.process_csv_from_gcs(gcs_path, brand_id)
        else:
            # Try to get CSV from request body
            if hasattr(request, 'data') and request.data:
                # Try to decode as text
                try:
                    csv_content = request.data.decode('utf-8')
                except:
                    csv_content = str(request.data)
            elif 'csv_content' in request_json:
                csv_content = request_json['csv_content']
            elif 'csv' in request_json:
                csv_content = request_json['csv']
            
            if not csv_content:
                return {
                    'status': 'error',
                    'message': 'No CSV content provided. Provide either gcs_path, csv_content in body, or CSV file in request body.'
                }, 400
            
            # Process CSV content
            logger.info(f"Processing CSV content ({len(csv_content)} characters)")
            complaints = fetcher.process_csv_file(csv_content, brand_id)
        
        if not complaints:
            return {
                'status': 'error',
                'message': 'No complaints processed from CSV'
            }, 400
        
        # Save processed complaints as NDJSON
        fetcher.save_to_gcs(complaints, brand_id, target_date)
        
        return {
            'status': 'success',
            'mode': 'csv',
            'brand_id': brand_id,
            'date': target_date,
            'total_complaints': len(complaints),
            'source': 'gcs' if gcs_path else 'request_body',
            'gcs_path': gcs_path if gcs_path else None
        }, 200
        
    except Exception as e:
        logger.error(f"Error in CSV processing: {e}")
        import traceback
        traceback.print_exc()
        return {'status': 'error', 'message': str(e)}, 500


def _handle_backfill(start_date: str, end_date: str):
    """Handle backfill: fetch data week by week from start_date to end_date"""
    try:
        start_dt = datetime.strptime(start_date, '%Y-%m-%d')
        end_dt = datetime.strptime(end_date, '%Y-%m-%d')
        current_dt = start_dt
        
        fetcher = CFPBFetcher()
        total_complaints_all = 0
        weeks_processed = []
        
        logger.info(f"Starting backfill from {start_date} to {end_date}")
        
        # Process week by week
        while current_dt <= end_dt:
            week_end = min(current_dt + timedelta(days=6), end_dt)
            target_date = week_end.strftime('%Y-%m-%d')
            
            # Fetch complaints from the start of the week to catch everything
            # Use date_received_min and date_received_max for the week
            date_received_min = current_dt.strftime('%Y-%m-%d')
            date_received_max = week_end.strftime('%Y-%m-%d')
            
            logger.info(f"Backfilling week ending {target_date} (fetching from {date_received_min} to {date_received_max})")
            
            week_complaints = 0
            for brand_id, company_names in FINANCIAL_COMPANIES.items():
                complaints = fetcher.fetch_complaints(
                    brand_id=brand_id,
                    company_names=company_names,
                    date_received_min=date_received_min,
                    date_received_max=date_received_max,
                    fetch_all=False
                )
                # Save to the week end date (partition by week)
                fetcher.save_to_gcs(complaints, brand_id, target_date)
                week_complaints += len(complaints)
            
            total_complaints_all += week_complaints
            weeks_processed.append({
                'week_end': target_date,
                'complaints': week_complaints
            })
            
            # Move to next week
            current_dt = week_end + timedelta(days=1)
            time.sleep(2)  # Rate limiting between weeks
        
        logger.info(f"Backfill completed: {len(weeks_processed)} weeks processed, {total_complaints_all} total complaints")
        
        return {
            'status': 'success',
            'mode': 'backfill',
            'start_date': start_date,
            'end_date': end_date,
            'total_complaints': total_complaints_all,
            'weeks_processed': len(weeks_processed),
            'details': weeks_processed
        }, 200
        
    except Exception as e:
        logger.error(f"Error in backfill: {e}")
        return {'status': 'error', 'message': str(e)}, 500

if __name__ == '__main__':
    # For Cloud Run deployment
    import os
    from flask import Flask, request
    
    app = Flask(__name__)
    
    @app.route('/', methods=['POST', 'GET'])
    def handle_request():
        return fetch_cfpb_data(request)
    
    @app.route('/health', methods=['GET'])
    def health_check():
        return {'status': 'healthy'}, 200
    
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)