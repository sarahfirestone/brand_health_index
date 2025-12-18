# Brand Health Index

## Project abstract 
Traditional approaches to measuring brand equity rely on costly, infrequent surveys that provide limited visibility into real-time shifts in public sentiment. This project constructs a Brand Health Index (BHI) for TD Bank using publicly available data sources, including social media, consumer complaints, search trends, news coverage, and financial indicators. Guided by Aaker’s brand equity framework, all features were organized into four pillars: Awareness & Consideration, Perception & Trust, Engagement, and Advocacy. Sentiment analysis was conducted using transformer-based models fine-tuned for social media and news text. An automated pipeline on Google Cloud Platform collects and processes data on a weekly basis to generate standardized index scores (0–100). The resulting BHI closely aligned with TD Bank’s internal survey-based index, demonstrating the validity and cost-efficiency of this method. A Next.js dashboard enables real-time monitoring, and the system’s modular architecture supports scalable integration of additional data sources for comprehensive brand assessment.

## Project workflow
We used Google Cloud Platform (GCP) to collect some of the data (Twitter, Reddit, Complaints data) and ran the code in BigQuery however it could be run in any platform compatiable to Python Notebooks with some adjustments in how to read in and save the data.<br/>
All data starts on September 28th (the 1st day of the project) and the end date is the current date.<br/>
### Data Retrevial 
There is a README explaining the data retreival steps (Twitter, Reddit, Complaints data) using GCP in the ```data_retrevial_folder```. <br/>
You can follow the folders that say ```"..._fetcher"``` to get the code that fetches the data for each source.<br/>
The engagment bucket uses stock data from the 'yfinance' package in Python and only the dates you select need to be adjusted. The awareness bucket is pulled directly from Google Trends and explained in the documentation as well. Please note that the complaints data can also be pulled using this link for the "TD BANK US HOLDING COMPANY", and selecting the start dates from September 28th to the present date: https://www.consumerfinance.gov/data-research/consumer-complaints/search/?company=TD%20BANK%20US%20HOLDING%20COMPANY&date_received_max=2025-12-08&date_received_min=2025-09-28&page=1&searchField=all&searchText=TD%20BANK%20US%20HOLDING%20COMPANY&size=25&sort=created_date_desc&tab=List<br/>
### Calulating Scores Code

###Dash Board 
