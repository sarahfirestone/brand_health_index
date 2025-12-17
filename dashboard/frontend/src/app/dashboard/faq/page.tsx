'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  {
    category: 'Brand Health Index (BHI)',
    question: 'What is the Brand Health Index (BHI)?',
    answer: 'The Brand Health Index is a comprehensive weekly metric that measures TD Bank\'s brand perception and reputation. It combines data from four key sources: sentiment analysis from social media (Twitter/Reddit), stock market engagement data, awareness from Google search trends, and advocacy sentiment from news headlines. The BHI provides a holistic view of how the brand is perceived in the market.'
  },
  {
    category: 'Brand Health Index (BHI)',
    question: 'How is the BHI calculated?',
    answer: 'The BHI uses the formula: BHI = Sentiment + Engagement + Advocacy + Awareness. Each of the 4 components is weighted equally (25% each) in the base score. The score is updated weekly, with data aggregated from the previous 7 days of activity across all data sources.'
  },
  {
    category: 'Metrics',
    question: 'What does the Sentiment/Perceptions score measure?',
    answer: 'The Sentiment (or Perceptions) score analyzes how people view TD Bank based on social media conversations. It examines tweets and posts from Twitter and Reddit, calculating the percentage of positive, neutral, and negative mentions. A higher score indicates more positive brand perception in social media discussions.'
  },
  {
    category: 'Metrics',
    question: 'What does the Engagement score measure?',
    answer: 'The Engagement score reflects market activity and investor interest in TD Bank based on stock market data from Yahoo Finance. It measures trading volume, price movements, and other market indicators that indicate how engaged investors and the market are with the bank\'s stock.'
  },
  {
    category: 'Metrics',
    question: 'What does the Awareness score measure?',
    answer: 'The Awareness score measures how often people search for TD Bank relative to the overall search volume and compared to major competitors (Chase, Capital One, Bank of America, Citibank). Data comes from Google Trends and helps indicate brand visibility and customer interest in searching for TD Bank.'
  },
  {
    category: 'Metrics',
    question: 'What does the Advocacy score measure?',
    answer: 'The Advocacy score tracks how TD Bank is portrayed in news headlines and media coverage. It analyzes sentiment in news articles, press releases, and media mentions. A higher advocacy score indicates more positive news coverage and media sentiment around the bank.'
  },
  {
    category: 'Score Types',
    question: 'What is the difference between Base Score and Regional Score?',
    answer: 'The Base Score uses standard awareness data from Google Trends. The Regional Score adjusts the awareness component by comparing TD Bank\'s search popularity against regional competitor banks in addition to national competitors. This provides a more nuanced view of regional market positioning.'
  },
  {
    category: 'Score Types',
    question: 'What is the Volume Score?',
    answer: 'The Volume Score is similar to the Base Score, but it includes social media volume in the sentiment/perception calculation. Instead of just analyzing sentiment polarity, it also accounts for the number of tweets and posts about TD Bank. This captures both how people feel and how much they\'re talking about the brand.'
  },
  {
    category: 'Score Types',
    question: 'What is the Volume + Regional Score?',
    answer: 'The Volume + Regional Score combines both adjustments: it uses regional awareness comparisons AND includes social media volume in the sentiment calculation. This provides the most comprehensive view that accounts for both geographic positioning and conversation volume.'
  },
  {
    category: 'Data & Updates',
    question: 'When is the BHI updated?',
    answer: 'The Brand Health Index is updated weekly. You can select different weeks using the "Week of" dropdown at the top of the dashboard. The most recent data represents the previous 7 days of aggregated information from all data sources.'
  },
  {
    category: 'Data & Updates',
    question: 'Where does the data come from?',
    answer: 'The BHI dashboard pulls data from multiple authoritative sources: Twitter/X and Reddit for sentiment analysis, Yahoo Finance for stock engagement metrics, Google Trends for awareness data, and major news outlets for advocacy/press sentiment. All data is aggregated on a weekly basis.'
  },
  {
    category: 'Data & Updates',
    question: 'What geographic regions are covered?',
    answer: 'The awareness metrics track search volume across all US states. The Regional Analysis page provides a detailed state-by-state breakdown of how TD Bank awareness compares to competitors in each state. Regional scores are calculated based on the top regional competitor banks.'
  },
  {
    category: 'Interpretation',
    question: 'What is a good BHI score?',
    answer: 'BHI scores range from 0 to 400 (sum of 4 metrics, each 0-100). Generally, higher scores indicate stronger brand health. Track the trend over time rather than focusing on absolute numbers—consistent week-over-week improvements are more meaningful than any single score. Compare your scores against previous weeks to identify positive or negative trends.'
  },
  {
    category: 'Interpretation',
    question: 'What does the week-over-week change badge mean?',
    answer: 'The badge next to the Overall Score shows how much the BHI changed from the previous week. A positive number (green) indicates the brand health improved, while a negative number (red) indicates it declined. This helps quickly identify whether trends are moving in a positive or negative direction.'
  },
  {
    category: 'Interpretation',
    question: 'What is Net Promoter Score (NPS)?',
    answer: 'In this context, the Net Promoter Score shown in the Advocacy section measures customer willingness to recommend TD Bank based on positive news mentions and sentiment in headlines. It\'s calculated from news media coverage and indicates how favorably the bank is being portrayed in the press.'
  },
  {
    category: 'Analysis Tools',
    question: 'How do I use the Brand Assistant?',
    answer: 'Click the assistant button (bot icon) in the bottom right corner to ask questions about your metrics. You can ask about why scores changed, how to interpret specific metrics, regional performance, competitor comparisons, and more. The assistant helps you understand the "why" behind the numbers.'
  },
  {
    category: 'Analysis Tools',
    question: 'What are Quick Insights?',
    answer: 'Quick Insights are pre-built questions that trigger the Brand Assistant with specific analyses. Click "Why did scores increase?", "Compare to competitors", or "Regional breakdown" to get immediate insights into those specific areas. These are shortcuts to common questions.'
  },
  {
    category: 'Regional Analysis',
    question: 'How do I use the Regional Performance page?',
    answer: 'The Regional Performance page shows state-by-state awareness metrics. Use the date range selector to compare different time periods. The page displays which states have the highest TD Bank awareness, how TD Bank compares to competitors in each state, and state-level trends.'
  },
  {
    category: 'Sentiment & Perceptions',
    question: 'How is social media sentiment analyzed?',
    answer: 'Social media sentiment is analyzed by examining tweets and Reddit posts mentioning TD Bank. Each mention is classified as positive, neutral, or negative based on the language and context. The sentiment score represents the overall balance of positive mentions versus negative ones.'
  },
  {
    category: 'Troubleshooting',
    question: 'Why might a score be 0 or very low?',
    answer: 'A score of 0 or very low could indicate limited data for that week (e.g., very few mentions on social media, minimal stock trading activity), a significant negative event that impacted sentiment, or genuine low interest/engagement. Check the other metrics to understand which component is driving the low overall score.'
  }
];

export default function FAQPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(faqItems.map(item => item.category)));

  const filteredItems = selectedCategory
    ? faqItems.filter(item => item.category === selectedCategory)
    : faqItems;

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
        <p className="text-gray-600 mt-2">
          Find answers to common questions about the Brand Health Index and how to interpret your metrics.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => setSelectedCategory(null)}
          variant={selectedCategory === null ? 'default' : 'outline'}
          className={selectedCategory === null ? 'bg-[#3C8825] hover:bg-[#2D6619]' : 'border-[#D4C4B0]'}
        >
          All Categories
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            onClick={() => setSelectedCategory(category)}
            variant={selectedCategory === category ? 'default' : 'outline'}
            className={selectedCategory === category ? 'bg-[#3C8825] hover:bg-[#2D6619]' : 'border-[#D4C4B0]'}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {filteredItems.map((item, index) => (
          <Card key={index} className="border border-[#D4C4B0] hover:border-[#3C8825] transition-colors">
            <button
              onClick={() => toggleExpanded(index)}
              className="w-full text-left p-4 flex items-center justify-between hover:bg-[#F5F3EE]/30 transition-colors"
            >
              <div className="flex-1">
                <p className="text-xs font-medium text-[#3C8825] mb-1">{item.category}</p>
                <h3 className="text-lg font-semibold text-gray-900">{item.question}</h3>
              </div>
              <div className="ml-4 flex-shrink-0">
                {expandedIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-[#3C8825]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </button>

            {expandedIndex === index && (
              <CardContent className="pt-0 pb-4 px-4">
                <div className="border-t border-[#D4C4B0] pt-4 mt-4">
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* No Results Message */}
      {filteredItems.length === 0 && (
        <Card className="border border-[#D4C4B0] bg-[#F5F3EE]/50">
          <CardContent className="pt-6 pb-6 text-center">
            <p className="text-gray-600">No questions found in this category. Try selecting a different category.</p>
          </CardContent>
        </Card>
      )}

      {/* Contact Support */}
      <Card className="border border-[#3C8825] bg-[#3C8825]/5">
        <CardContent className="pt-6 pb-6">
          <h3 className="text-lg font-semibold text-[#222222] mb-2">Still have questions?</h3>
          <p className="text-gray-700 mb-4">
            Use the Brand Assistant (chat button in the bottom right) to ask custom questions about your metrics, or reach out to the analytics team for support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
