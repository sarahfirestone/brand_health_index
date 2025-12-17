# How to run the code to calcuate the scores
## 1. Awareness Bucket:
The awareness Bucket is calculated using the Google Trends data. There are two datasets collected from Google Trends: one comparing TD bank to the other top banks (Chase Bank, Bank of America, Citibank and Capital One), and another comparing TD bank to the Northeast regional banks (PNC bank, Citizens bank, U.S. Bancorp and Truist)\
*If you want to change these 4 banks you will need to change that in the Google Trends Data collection step above

<ins> How to upload a new file:</ins> \
Go to the folder in Big Query that has the data and click on the 3 dots -> create table. Then you can upload the file from your computer (the Google Trends you collected above) or can connect from gcp. 
** Make sure you click the ```auto detect schema``` box otherwise you will get an error 

<ins >How to name the file… </ins>
- If you have a previous dataset of all the past awareness scores, name the file in the format
  - ```awareness_top_{start date}_{end date}.csv```
  - ```awareness_top_Oct 26 Nov2.csv```
- If file is a new top banks then name the file like this example
  - ```trends_data_{end date}_{start date}.csv```
  - ```trends_data_Nov 2_Oct 26.csv```
- If file is new regional banks then name the file like this example
  - ```trends_regional_data_{end date}_{start date}.csv```
  - ```trends_regional_data_Nov 2_Oct 26```
- If file is a new top banks **per state** then name the file like this example
  - ```state_trends_data_{end date}_{start date}```
  - ```state_trends_data_Nov 2_Oct 26```
- If file is a new regional banks **per state **then name the file like this example
  - ```state_regional_trends_data_{end date}_{start date}```
  - ```state_regional_trends_data_Nov 2_Oct 26```

### First do the process for the top banks:
**IF** you have a previous dataset of all the past awareness scores, upload it first using the upload instructions above and name the file in the format ```awareness_top_{start date}_{end date}.csv```. Then using the instructions in the notebook, read in that past awareness file, just remember to update the file name. 

*If you don’t have a previous dataset, skip this step and move down to the next step).
The next text box in the script (a few lines down) explains how to read in a new Google Trends awareness file, you will do this step regardless if you did the step above\
	You need to add the new google trends file by reading the upload instructions above and format the name as```trends_data_start month_day_end month_day.csv``` such as```trends_data_Nov 2_Oct 26.csv```. In the code update the file name of the top bank Google Trends file you want to read and run the following lines of code. You can then add multiple new Google Trends files by rerunning those lines for each file. Once all the files are uploaded and each contents is added to the necessary lists, you can run the line that makes the lists into a dataset\
Then save the awareness scores dataset as a csv, using this name:```awareness_top_{start date}_{end date}.csv```. This has the start date of each week and the awareness score associated with each. /
*this will be used as your new data that you read in the first step of the awareness section (where you upload the past awareness scores), and will be used in the dashboard.

### Follow the exact same instructions for the regional banks:
Underneath the code for the Google Trends top banks section, there will be almost identical code for the regional banks section. Make sure to change the names of the files to match the file names you have.
Once you finish running those lines of code, you will save that new cleaned dataset using this name:```awareness_regional_{start date}_{end date}.csv```. This has the start date of each week and the awareness score associated with each.

### Google Trends data per state (top and regional):
You should have collected the Google Trends data for the top banks per state and then another dataset for the regional banks per state. Input the Google Trends top bank data per state first (it should be one file with the dates you want), and then run the code. 
You will save that new cleaned dataset using this name: ```state_trends_data_{start date}_{end date}.csv```. *You need to change the file name manually to the updated dates. 
You will repeat this process for the regional bank data in using the almost identical following code, and save the new dataset using ```state_trends_regional_data_{start date}_{end date}.csv```

You will then use both of these datasets on the dashboard for the awareness section of the home page and in the awareness tab on the navigation bar.

## 2. Perceptions Bucket:
<ins>Finding sentiment for twitter and reddit data:</ins><br/>
Read in the Twitter and Reddit data you have, it should be up to date from the automatic API calls from Google Cloud<br/>

Clean the data to remove posts with Canada related words as we are focusing on the US in this project. 
<ins>Removed:</ins>
- Canada
- Canadian
- Québec
- Ontario

### Using RoBERTA model to find the sentiment of the posts: 
For sentiment analysis we are using a pre-trained open-source model named** Cardiff NLP RoBERTa** which is a fine-tuned version of RoBERTa, specifically optimized for sentiment analysis and emotion detection on social media data, especially twitter. It is validated in the section below\
Sentiment analysis labels posts as positive, negative, and neutral and assigns that label by taking the probability of each sentiment category and assigning the one with the highest probability. 
To save this dataset with all the information (date, twitter/reddit text, sentiment label, sentiment probabilities) to use in the sentiment tab, it will be named ```tweet_all_info.csv```.

### Find the number of posts in each sentiment category:
Using that to label the post as positive, negative, or neutral, we then aggregated the number of posts in each sentiment category per week. This dataset was saved in this```sentiment_roberta_totals_{end_date}.csv``` file for the sentiment section of the dashboard home page to show the number of posts in each sentiment category for the week.

### Finding the weekly perception score:
We then combine the number of positive posts for the week divided by the total number of posts to get the weekly sentiment score and that dataset is saved in the file, ```sentiment_{start_date}_{end_date}.csv```. This only includes the date and the weekly perceptions score which will be used to calculate the final weekly brand index at the end. 

### Finding the weekly volume score for perceptions:
To account for the weekly volume of tweets, we took the calculated sentiment for each post and then found the weekly average to get a value between -1 and 1. To factor in volume, we took the number of posts divided by the 95th percentile of posts. Finally, to get the final advocacy score, we calculated ```50*(1 + the average * the minimum of either 1 or that value)```. This is another optional scoring metric we can use for our weekly time series.


### Finally, validated the sentiment model: 
To validate the RoBERTa model, we found a test dataset of tweets about the company ```Apple``` from Kaggle with labeled sentiment. We used this data as it had a similar content and format to our TD Bank twitter data, and had labels to verify the model was accurate. There were a total of 1311 posts where 628 had neutral sentiment, 116 were positive, and 567 were negative. 
https://www.kaggle.com/datasets/seriousran/appletwittersentimenttexts 

First upload a cleaned version of that dataset so it is formatted correctly in big query. You can also use the code yourself in the repository called```clean_test_dataset_perceptions.py```. /
<ins>To upload test dataset in big query:</ins>/
Go to the folder in big query that has the data and click on the 3 dots -> create table. Then you can upload the file from your computer, the cleaned apple dataset. Name that file, ```test_apple.csv```.

** Make sure you click the **```auto detect schema```** box otherwise you will get an error.

<ins>Now go to the code and run.</ins> /
There were **3 models** we used to compare and validate that we were using the best model.
1. finitcautomata/bertweet-base-sentiment-analysis
  - This is the basic BERT model adjusted to output sentiment as positive, negative, and neutral
  - It was the worst at 43% accuracy
2. siebert/sentiment-roberta-large-english
  - This a higher performing model of BERT called RoBERTa
  - It performed slightly higher at 48% accuracy
3. **cardiffinlp/twitter-roberta-base-sentiment-latest**
  - This is a fine tuned RoBERTA model that specializes in tweets
  - This got the highest accuracy at 82%, validating that we chose the right model
  - Generalize it for our similar social media company data

### Complaints data
This is another data source we have for the perceptions bucket, that has its own tab in the dashboard. You have to upload the data from the gcp. Then run the code to clean the data to keep the relevant columns. The volume of weekly complaints is important so we created a way to preserve that information in the final score. We found the weekly average to get a value between -1 and 1. To factor in volume, we took the number of complaints divided by the 95th percentile of complaints. Finally, to get the final advocacy score, we did ```50*(1 + the average * the minimum of either 1 or that value)```\
The dataset includes the weekly start date and complaints score and is saved as```weekly_compalints_{start_date}_{end_date}.csv```. The values also made sense since higher scores if less complaints (since negative sentiment = bad). This data will be used on the complaints tab of the dashboard.

## 3. Engagement Bucket:
For this bucket, you just have to install sentiment ```yfinance``` package in Python and then you can access any companies stock information<br/> 
There is a function to clean the stock date, you just have to insert the start and end dates you want, make sure you update these before you run the code<br/>
To have all the information including open and close price, volume etc, you can save that dataset as ```engagement_info_{start_date}_{end_date}.csv``` to put in the engagement tab<br/>
To calculate the weekly score, we looked at each week’s Friday closing costs throughout the month and multiplied by the quotient of the volume and 10,000,000. This is our engagement score per week. The engagement dataset will show the start date of the week (a Sunday) to match the other buckets, and a score of that week.  
The final dataset of just the weekly start date of Sunday and the score is saved as ```engagment_{start_date}_{end_date}.csv```.

## 4. Advocacy Bucket:
First, read in the Google News Titles related to TD Bank using the package ```feedparser``` in Python<br/> 
Clean the data by running the code to remove posts with Canada related words as we are focusing on the US in this project

<ins>Removed:</ins>
- Canada
- Canadian
- Québec
- Ontario

### Sentiment analysis model
Then find the sentiment for each article title using the model, **Jean-Baptiste/roberta-large-financial-news-sentiment-en**, which specializes in financial news article headlines. We validated this model below. 

### Finding the weekly score
Then find the weekly average to get a value between -1 and 1. To factor in volume, we took the number of articles divided by the 95th percentile of articles. Finally, to get the final advocacy score, we did ```50*(1 + the average * the minimum of either 1 or that value)```. Then save.

*Optional weekly summary of news titles:\
This code creates a summary of the titles each week and says the average sentiment. This model has not been validated by our team. This feature is currently not being used in our dashboard but if you would like to include it then download the dataset (```advoacacy_weekly_summary.csv```) it creates and add it to the dashboard. 

### Finally, validated the sentiment model: 
We want to validate the sentiment model we are using for the advocacy bucket just like we did for the social media data<br/> 
Since the data was financial news headlines, we validated the model on a test dataset from HuggingFace that consists of similar financial news headlines to the ones we collected on Google News. There were a total of 3453 titles where 2146 had neutral titles, 887 were positive, and 420 were negative. https://huggingface.co/datasets/takala/financial_phrasebank<br/>  
<ins>First upload the test dataset in big query.</ins>\ 
To upload test dataset in big query:
Go to the folder in big query that has the data and click on the 3 dots -> create table. Then you can upload the file from your computer, the cleaned apple dataset. Name that file, ```test_news.csv```\
** Make sure you click the **```auto detect schema```** box otherwise you will get an error.

Now go to the code and run. 
There were **3 models** we used to compare and validate that we were using the best model.  
1. cardiffnip/twitter-roberta-base-sentiment-latest.
  - This is a fine tuned RoBERTA model that specializes in tweets that worked the best for the perceptions bucket
  - However we had a different type of data (tweets) which is why it performed well for that bucket, for our financial news headlines data it performed the worst 
  - It was the worst at 75% accuracy
2. ProsusAl/finbert
  - This model specializes in financial news headline data 
  - Better results at 93% accuracy
3. **Jean-Baptiste/roberta-large-financial-news-sentiment-en**
  - This is a mix of a RoBERTA model that specializes in financial news headlines 
  - This got the highest accuracy at 99%, validating that we chose the right model
  - Generalize it for our similar financial news headlines company data

# Combining final scores:
There should be a final dataset for each bucket: **awareness** (also has regional awareness dataset), **perceptions**, **engagement,** and **advocacy**. This code section combines each dataset so they are joined on date and each category is a column. Then for each week we plug in each categories score into the brand index equation we created. 

We have 3 different metric options depending on what information the user wants to incorporate for the metric. For all scores, we are using an equal weight of 0.25 (from 100/4 categories). 
### Base score: Each bucket’s score is multiplied by a weight and then each product is summed together. 
Currently the weight is 0.25, however, in the future someone can adjust this value depending on the volume of data for each bucket or the importance. 
### Regional score:
In addition to the 4 original categories in the base score, the awareness score also compares the relative popularity score of searching for TD Bank on Google vs 4 regional banks. It then takes an average of the top banks and the regional banks weekly score and that is the score used for awareness. The weight is still 0.25. 
### Volume score: 
Same as the 4 original categories, however, the perception component also accounts for the number of tweets (volume) each week, not just the sentiment like the traditional base score. This new value replaces the original perception score in the equation
### Regional + volume score: 
This keeps the same advocacy and engagement scores, however, it uses the awareness score that accounts for regional banks and the perception score that accounts for volume of posts as well.  
