# Brand Health Index

## Project abstract 
Traditional approaches to measuring brand equity rely on costly, infrequent surveys that provide limited visibility into real-time shifts in public sentiment. This project constructs a Brand Health Index (BHI) for TD Bank using publicly available data sources, including social media, consumer complaints, search trends, news coverage, and financial indicators. Guided by Aaker’s brand equity framework, all features were organized into four pillars: Awareness & Consideration, Perception & Trust, Engagement, and Advocacy. Sentiment analysis was conducted using transformer-based models fine-tuned for social media and news text. An automated pipeline on Google Cloud Platform collects and processes data on a weekly basis to generate standardized index scores (0–100). The resulting BHI closely aligned with TD Bank’s internal survey-based index, demonstrating the validity and cost-efficiency of this method. A Next.js dashboard enables real-time monitoring, and the system’s modular architecture supports scalable integration of additional data sources for comprehensive brand assessment.

## Project workflow
We used Google Cloud Platform (GCP) to collect some of the data (Twitter, Reddit, Complaints data) and ran the code in BigQuery however it could be run in any platform compatiable to Python Notebooks with some adjustments in how to read in and save the data.<br/>
All data starts on September 28th (the 1st day of the project) and the end date is the current date.<br/>
### Data retrieval 
There is a README explaining the data retreival steps (Twitter, Reddit, Complaints data) using GCP in the ```data_retrieval_folder```. <br/>
You can follow the folders that say ```"..._fetcher"``` to get the code that fetches the data for each source.<br/>
The engagment bucket uses stock data from the 'yfinance' package in Python and only the dates you select need to be adjusted. The awareness bucket is pulled directly from Google Trends and explained in the documentation as well. Please note that the complaints data can also be pulled using this link for the "TD BANK US HOLDING COMPANY", and selecting the start dates from September 28th to the present date: https://www.consumerfinance.gov/data-research/consumer-complaints/search/?company=TD%20BANK%20US%20HOLDING%20COMPANY&date_received_max=2025-12-08&date_received_min=2025-09-28&page=1&searchField=all&searchText=TD%20BANK%20US%20HOLDING%20COMPANY&size=25&sort=created_date_desc&tab=List<br/>
### Calulating Scores Code
Documentation and code to caculate the scores is in the ```calculating score``` folder.<br/>
Below is more information on the buckets, the data for each, and how its calculated. 
#### What were the 4 buckets of the brand health index, and why were these 4 picked?
Prior research on brand equity, notably Aaker’s (1996) framework, identifies four core dimensions: **1)** brand loyalty, **2)** perceived quality, **3)** associations, and **4)** awareness. This framework provides the conceptual foundation most commonly used to assess brand strength. However previously, its applications rely primarily on qualitative or survey-based data. While this survey data can be extremely useful, as it can get answers to targeted questions that make it much easier to calculate something like loyalty, acquiring this data can be extremely expensive. So we reconstructed these four buckets using social media data, Google Trends data, stock market data, and news articles, and recreated these 4 buckets:
1. **Awareness & Consideration:**
How often people are searching for this particular brand compared to competitors. This bucket is normally taken from surveys, but this brand index uses public data such as looking at search metrics through Google Trends.<br/>
- We looked at the relative popularity score of searching for TD Bank on Google vs the other 4 top banks: 
  - Chase Bank, Bank of America, Citibank, and CapitalOne Bank
- We also compared TD Bank’s score with four other regional banks: 
  - PNC Bank, Citizens Bank, U.S. Bancorp, and Truist
- <ins>How to interpret:</ins>
  - Ex: TD Bank has a score of 39 on a specific day and another bank (the one with the highest score on that day) has a score of 98. The score 39 is relative to 98, meaning it is at 38% of the highest rated bank (with a score of 98) on that specific day. 
2. **Perceptions, Trust, Meets the Needs:**
How the world views the company. We can measure this by looking at the sentiment of social media and looking at the volume of weekly complaints. The data sources are Twitter, Reddit, and the Consumer Financial Protection Bureau (CFPB) for the complaint data.
3. **Engagement:**
Look financially at how the engagement in the business changes weekly using stock data from the “yfinance” package from Python.
4. **Advocacy:** Look at how often and positively the brand is being portrayed in the news. Google news titles that included TD Bank were used as data for this bucket.

#### </ins>How were the Bucket Scores Calculated?</ins>
1. **Awareness & Consideration:** For each set of banks, divide TD Bank’s daily score by the other 4 banks' daily average. Then take an average of those values to get 1 score for the whole month, and repeat this process for the top bank data as well as the regional data to get two separate scores. To combine these scores we did an average of both of them.<br/>
2. **Perceptions, Trust, Meets the Needs**:  Performed sentiment analysis using a pre-trained open-source model named Cardiff NLP RoBERTa, which is a fine-tuned version of RoBERTa, specifically optimized for sentiment analysis and emotion detection on social media data, especially twitter. Using that to label the post as positive, negative, or neutral, we then took the number of positive posts that week divided by the total number of posts to get the score for this bucket.<br/> 
However, we also wanted to account for the weekly volume of tweets as a metric. For this option we took the calculated sentiment for each post and then found the weekly average to get a value between -1 and 1. To factor in volume, we took the number of posts divided by the 95th percentile of posts. Finally, to get the final advocacy score, we calculated 50*(1 + the average * the minimum of either 1 or that value)..
3. **Engagement**: Took each week’s Friday closing costs throughout the month and divided that number by the volume.<br/>
4. **Advocacy:** First, we took the sentiment for each article title using the model, Jean-Baptiste/roberta-large-financial-news-sentiment-en, which specializes in financial news article headlines. We then found the weekly average to get a value between -1 and 1. To factor in volume, we took the number of articles divided by the 95th percentile of articles. Finally, to get the final advocacy score, we did 50*(1 + the average * the minimum of either 1 or that value). 

#### How was the total weekly score calculated?
To create the weekly brand index score, each score is multiplied by a weight and then each product is summed together. Currently the weight is 0.25, however, in the future someone can adjust this value depending on the volume of data for each bucket or the importance. 

### Dash Board 
The documentation and code to create the dashboard is in the ```dashboard``` folder.<br/>
The link for the dashbaord is https://brand-health-frontend-deploy.vercel.app/ 
