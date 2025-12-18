import pandas as pd
from datetime import datetime, timezone
import numpy as np

def read_complaint_csv(file_name):
    complaints = pd.read_csv(file_name)
    complaints.head()
    #complaints['Product'].value_counts().keys()
    complaints = complaints.rename(columns = {'Date received': 'Date', 'Consumer complaint narrative':'text', 'Company': 'bank'})
    complaints.columns = complaints.columns.str.lower()
    complaints["text"] = complaints["text"].replace("\n", "", regex=True).replace("\t", "", regex=True)
    complaints.columns
    complaints_df = complaints[['date', 'text', 'state', 'product', 'sub-product', 'issue', 'sub-issue','bank']]
    return complaints_df


#insert the complaints data file for the dates you want.
#Can get data from GCP or from this website: https://www.consumerfinance.gov/data-research/consumer-complaints/search/?company=TD%20BANK%20US%20HOLDING%20COMPANY&date_received_max=2025-12-08&date_received_min=2025-09-28&page=1&searchField=all&searchText=TD%20BANK%20US%20HOLDING%20COMPANY&size=25&sort=created_date_desc&tab=List
complaints = read_complaint_csv("complaints-2025-12-08_12_02.csv")
complaints
complaints = complaints.rename(columns = {'ts_event': 'Date', 'Consumer complaint narrative':'text', 'Company': 'bank'})
complaints.columns = complaints.columns.str.lower()
#only pick these sub categories for relevance and non-na
complaints_df = complaints[['date', 'state', 'product', 'sub-product', 'issue', 'sub-issue']]
complaints_df['day_time'] = pd.to_datetime(complaints_df['date'])
complaints_df['date']=complaints_df['day_time'].dt.date
complaints_df['time']=complaints_df['day_time'].dt.time
complaint_volume = len(complaints_df)
complaints_df['date_format'] = pd.to_datetime(complaints_df['date'])
#group by week
weekly_complaints = complaints_df.groupby(pd.Grouper(key='date_format', freq='W')).size()
weekly_complaints = weekly_complaints.reset_index()
weekly_complaints = weekly_complaints.rename(columns = {'date_format': 'date', 0: 'complaint_count'})
weekly_complaints
#find the volume of weekly complaints
weekly_complaints
p95 = weekly_complaints["complaint_count"].quantile(0.95)
weekly_complaints["v_conf"] = np.clip(weekly_complaints["complaint_count"] / (p95 if p95 > 0 else 1), 0, 1)

# Confidence-weighted sentiment → 0–100
#s = weekly_complaints["weekly_score_mean"]  # in [-1, 1]
s = -1
weekly_complaints["weekly_score_0_100"] = 50 * (1 + s * weekly_complaints["v_conf"])
weekly_complaints
#makes sense: higher scores if less complaints (since negative sentiment = bad)
sentiment_complaints = weekly_complaints[['date', 'weekly_score_0_100']]
sentiment_complaints = sentiment_complaints.rename(columns = {'weekly_score_0_100': 'sentiment_complaint'})
sentiment_complaints