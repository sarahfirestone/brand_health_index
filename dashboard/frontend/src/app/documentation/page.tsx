'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Home,
  Target,
  Calculator,
  CheckCircle2,
  BarChart3,
  MessageSquare,
  TrendingUp,
  Newspaper,
  ThumbsUp,
  ThumbsDown,
  Minus,
} from 'lucide-react';

const sections = [
  { id: 'overview', title: 'Overview', icon: Home },
  { id: 'buckets', title: 'The Four Buckets', icon: Target },
  { id: 'calculation', title: 'Score Calculation', icon: Calculator },
  { id: 'evaluation', title: 'Model Evaluation', icon: CheckCircle2 },
  { id: 'examples', title: 'Sentiment Examples', icon: MessageSquare },
];

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="h-screen flex bg-[#F5F3EE] text-[#222222] overflow-hidden p-6">
      {/* Sidebar Navigation */}
      <aside className="w-64 rounded-lg flex flex-col bg-white border border-[#D4C4B0] flex-shrink-0">
        {/* Logo Section */}
        <div className="px-6 py-6 border-b border-[#D4C4B0]">
          <div className="text-xl font-bold text-[#3C8825]">
            Brand Health Index
          </div>
          <div className="text-sm text-gray-600 mt-1">Documentation</div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <nav className="px-4 py-4 space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-[#3C8825] text-white'
                      : 'text-gray-700 hover:bg-[#3C8825]/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-gray-500'
                  }`} />
                  <span className="truncate text-left">{section.title}</span>
                </button>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto rounded-lg bg-white border border-[#D4C4B0] ml-6">
        <div className="px-8 py-8">
          <div className="space-y-8">
            {activeSection === 'overview' && <OverviewSection />}
            {activeSection === 'buckets' && <BucketsSection />}
            {activeSection === 'calculation' && <CalculationSection />}
            {activeSection === 'evaluation' && <EvaluationSection />}
            {activeSection === 'examples' && <ExamplesSection />}
          </div>
        </div>
      </main>
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4C4B0] pb-6">
        <h1 className="text-3xl font-bold text-[#222222]">Brand Health Index Overview</h1>
        <p className="text-gray-600 mt-2">
          A modern approach to measuring brand equity using real-time data
        </p>
      </div>

      {/* Why New Index */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <CardTitle className="text-xl text-[#3C8825]">Why a New Brand Index?</CardTitle>
          <CardDescription>
            Moving beyond traditional survey-based methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Traditional techniques of calculating brand equity, such as using customer satisfaction surveys,
            often are very expensive and fail to truly capture real-time public sentiment and evolving
            consumer attitudes reflected across digital platforms.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Despite the abundance of social media and online review data, most financial institutions still
            rely on static, lagging indicators of brand performance due to a lack of understanding of how
            to truly utilize and interpret this data.
          </p>
          <div className="bg-[#3C8825]/10 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-[#3C8825] mb-2">Our Solution</h4>
            <p className="text-sm text-gray-700">
              Our project bridges this gap by developing a Brand Health Index (BHI) for TD Bank that
              integrates multiple data streams—social sentiment, complaint data, and financial indicators—into
              a unified, time-sensitive measure of brand equity.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Benefits */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <CardTitle className="text-xl text-[#6B8E7F]">Key Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#3C8825] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Real-Time Monitoring</div>
                <p className="text-sm text-gray-600">Track consumer perception as it evolves over time</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#3C8825] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Cost-Effective</div>
                <p className="text-sm text-gray-600">Utilizes public data instead of expensive surveys</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#3C8825] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Multi-Source Integration</div>
                <p className="text-sm text-gray-600">Combines social media, complaints, and financial data</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#3C8825] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Actionable Insights</div>
                <p className="text-sm text-gray-600">Correlates brand health with financial outcomes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BucketsSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4C4B0] pb-6">
        <h1 className="text-3xl font-bold text-[#222222]">The Four Buckets</h1>
        <p className="text-gray-600 mt-2">
          Based on Aaker's (1996) framework for brand equity assessment
        </p>
      </div>

      {/* Foundation */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <CardTitle className="text-xl text-[#3C8825]">Theoretical Foundation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed mb-4">
            Prior research on brand equity, notably Aaker's (1996) framework, identifies four core dimensions:
            brand loyalty, perceived quality, associations, and awareness. This framework provides the conceptual
            foundation most commonly used to assess brand strength.
          </p>
          <p className="text-gray-700 leading-relaxed">
            While survey data can be extremely useful for answering targeted questions, acquiring this data can
            be extremely expensive. We reconstructed these four buckets using social media data, Google Trends
            data, stock market data, and news articles.
          </p>
        </CardContent>
      </Card>

      {/* Bucket 1: Awareness */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#6B8E7F] flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-[#6B8E7F]">1. Awareness & Consideration</CardTitle>
              <CardDescription>Search popularity relative to competitors</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            How often people are searching for this particular brand compared to competitors. This bucket
            uses public data such as search metrics through Google Trends.
          </p>
          <div className="bg-[#6B8E7F]/10 rounded-lg p-4">
            <h4 className="font-semibold text-[#6B8E7F] mb-2">Data Sources</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#6B8E7F]">•</span>
                <span><strong>Top 5 Banks:</strong> Chase Bank, Bank of America, Citibank, CapitalOne Bank</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6B8E7F]">•</span>
                <span><strong>Regional Banks:</strong> PNC Bank, Citizens Bank, U.S. Bancorp, Truist</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-2">How to Interpret</h4>
            <p className="text-sm text-gray-600">
              Example: TD Bank has a score of 39 on a specific day and another bank (the one with the highest
              score on that day) has a score of 98. The score 39 is relative to 98, meaning it is at 38% of
              the highest rated bank on that specific day.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bucket 2: Sentiment */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#B85C4F] flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-[#B85C4F]">2. Perceptions, Trust, Meets the Needs</CardTitle>
              <CardDescription>Social sentiment and complaint volume</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            How the world views the company. We measure this by analyzing sentiment from social media
            and the volume of weekly complaints.
          </p>
          <div className="bg-[#B85C4F]/10 rounded-lg p-4">
            <h4 className="font-semibold text-[#B85C4F] mb-2">Data Sources</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Twitter/X posts</li>
              <li>• Reddit discussions</li>
              <li>• Consumer Financial Protection Bureau (CFPB) complaints</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Bucket 3: Engagement */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#C9A66B] flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-[#C9A66B]">3. Engagement</CardTitle>
              <CardDescription>Financial engagement metrics</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            Look financially at how the engagement in the business changes weekly using stock data.
          </p>
          <div className="bg-[#C9A66B]/10 rounded-lg p-4">
            <h4 className="font-semibold text-[#C9A66B] mb-2">Data Source</h4>
            <p className="text-sm text-gray-700">
              Stock data from the "yfinance" package from Python
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bucket 4: Advocacy */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#8B7355] flex items-center justify-center">
              <Newspaper className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-[#8B7355]">4. Advocacy</CardTitle>
              <CardDescription>News coverage and brand portrayal</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            Look at how often and positively the brand is being portrayed in the news.
          </p>
          <div className="bg-[#8B7355]/10 rounded-lg p-4">
            <h4 className="font-semibold text-[#8B7355] mb-2">Data Source</h4>
            <p className="text-sm text-gray-700">
              Google News titles that included TD Bank
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CalculationSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4C4B0] pb-6">
        <h1 className="text-3xl font-bold text-[#222222]">Score Calculation</h1>
        <p className="text-gray-600 mt-2">
          How each bucket score and the total weekly score are calculated
        </p>
      </div>

      {/* Awareness Calculation */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <CardTitle className="text-xl text-[#6B8E7F]">Awareness & Consideration</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <Badge className="bg-[#6B8E7F] text-white flex-shrink-0">1</Badge>
              <span>For each set of banks, divide TD Bank's daily score by the other 4 banks' daily average</span>
            </li>
            <li className="flex items-start gap-3">
              <Badge className="bg-[#6B8E7F] text-white flex-shrink-0">2</Badge>
              <span>Take an average of those values to get 1 score for the whole month</span>
            </li>
            <li className="flex items-start gap-3">
              <Badge className="bg-[#6B8E7F] text-white flex-shrink-0">3</Badge>
              <span>Repeat for both top bank data and regional data to get two separate scores</span>
            </li>
            <li className="flex items-start gap-3">
              <Badge className="bg-[#6B8E7F] text-white flex-shrink-0">4</Badge>
              <span>Combine scores by averaging both of them</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Sentiment Calculation */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <CardTitle className="text-xl text-[#B85C4F]">Perceptions, Trust, Meets the Needs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Performed sentiment analysis using a pre-trained open-source model named <strong>Cardiff NLP RoBERTa</strong>,
            which is a fine-tuned version of RoBERTa specifically optimized for sentiment analysis and emotion
            detection on social media data, especially Twitter.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-2">Basic Score</h4>
            <p className="text-sm text-gray-600">
              Number of positive posts that week divided by the total number of posts
            </p>
          </div>
          <div className="bg-[#B85C4F]/10 rounded-lg p-4">
            <h4 className="font-semibold text-[#B85C4F] mb-2">Volume-Adjusted Score</h4>
            <ol className="space-y-2 text-sm text-gray-700">
              <li>1. Calculate sentiment for each post and find weekly average (value between -1 and 1)</li>
              <li>2. Factor in volume: number of posts divided by 95th percentile of posts</li>
              <li>3. Final score: <code className="bg-gray-100 px-1 rounded">50 * (1 + average * min(1, volume_factor))</code></li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Calculation */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <CardTitle className="text-xl text-[#C9A66B]">Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Take each week's Friday closing costs throughout the month and divide that number by the volume.
          </p>
        </CardContent>
      </Card>

      {/* Advocacy Calculation */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <CardTitle className="text-xl text-[#8B7355]">Advocacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Uses the model <strong>Jean-Baptiste/roberta-large-financial-news-sentiment-en</strong>, which
            specializes in financial news article headlines.
          </p>
          <div className="bg-[#8B7355]/10 rounded-lg p-4">
            <h4 className="font-semibold text-[#8B7355] mb-2">Calculation Steps</h4>
            <ol className="space-y-2 text-sm text-gray-700">
              <li>1. Calculate sentiment for each article title</li>
              <li>2. Find weekly average (value between -1 and 1)</li>
              <li>3. Factor in volume: number of articles divided by 95th percentile</li>
              <li>4. Final score: <code className="bg-gray-100 px-1 rounded">50 * (1 + average * min(1, volume_factor))</code></li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Total Score */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <CardTitle className="text-xl text-[#3C8825]">Total Weekly Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            To create the weekly brand index score, each bucket score is multiplied by a weight and then
            each product is summed together.
          </p>
          <div className="bg-[#3C8825]/10 rounded-lg p-4">
            <h4 className="font-semibold text-[#3C8825] mb-2">Current Weighting</h4>
            <p className="text-sm text-gray-700">
              Each bucket has a weight of <strong>0.25</strong> (equal weighting). In the future, these weights
              can be adjusted depending on the volume of data for each bucket or the importance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EvaluationSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4C4B0] pb-6">
        <h1 className="text-3xl font-bold text-[#222222]">Model Evaluation</h1>
        <p className="text-gray-600 mt-2">
          Validation of sentiment analysis models
        </p>
      </div>

      {/* Social Media Sentiment */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <CardTitle className="text-xl text-[#B85C4F]">Social Media Sentiment Model</CardTitle>
          <CardDescription>Cardiff NLP RoBERTa evaluation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Since the final index will be a singular value between 0 and 100, we need to validate the
            sentiment analysis model. We used a test dataset of tweets about "Apple" from Kaggle with labeled sentiment.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-3">Test Dataset</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-600">628</div>
                <div className="text-sm text-gray-500">Neutral</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#3C8825]">116</div>
                <div className="text-sm text-gray-500">Positive</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#B85C4F]">567</div>
                <div className="text-sm text-gray-500">Negative</div>
              </div>
            </div>
            <div className="text-center mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">Total: 1,311 posts</div>
            </div>
          </div>
          <div className="bg-[#3C8825]/10 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-[#3C8825]">82%</div>
            <div className="text-sm text-gray-600">Model Accuracy</div>
          </div>
          <p className="text-sm text-gray-600">
            Source: <a href="https://www.kaggle.com/datasets/seriousran/appletwittersentimenttexts"
            className="text-[#3C8825] hover:underline" target="_blank" rel="noopener noreferrer">
              Kaggle - Apple Twitter Sentiment
            </a>
          </p>
        </CardContent>
      </Card>

      {/* Financial News Sentiment */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <CardTitle className="text-xl text-[#8B7355]">Financial News Sentiment Model</CardTitle>
          <CardDescription>Jean-Baptiste RoBERTa evaluation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            For financial news headline data, we used a model specialized in that type of data and
            validated on a test dataset from HuggingFace.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-3">Test Dataset</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-600">2,146</div>
                <div className="text-sm text-gray-500">Neutral</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#3C8825]">887</div>
                <div className="text-sm text-gray-500">Positive</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#B85C4F]">420</div>
                <div className="text-sm text-gray-500">Negative</div>
              </div>
            </div>
            <div className="text-center mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">Total: 3,453 titles</div>
            </div>
          </div>
          <div className="bg-[#3C8825]/10 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-[#3C8825]">99%</div>
            <div className="text-sm text-gray-600">Model Accuracy</div>
          </div>
          <p className="text-sm text-gray-600">
            Source: <a href="https://huggingface.co/datasets/takala/financial_phrasebank"
            className="text-[#3C8825] hover:underline" target="_blank" rel="noopener noreferrer">
              HuggingFace - Financial Phrasebank
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ExamplesSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D4C4B0] pb-6">
        <h1 className="text-3xl font-bold text-[#222222]">Sentiment Examples</h1>
        <p className="text-gray-600 mt-2">
          Real examples of classified posts and news headlines
        </p>
      </div>

      {/* Social Media Examples */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <CardTitle className="text-xl text-[#B85C4F]">Social Media Sentiment Examples</CardTitle>
          <CardDescription>Perceptions, Trust, Meets the Needs bucket</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Positive */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ThumbsUp className="w-5 h-5 text-[#3C8825]" />
              <h4 className="font-semibold text-[#3C8825]">Positive</h4>
            </div>
            <div className="space-y-3">
              <ExamplePost
                text="Pagaya boosted its revolving credit line to $132M with strong backing from TD Bank and Wells Fargo — fueling the next phase of lending expansion."
                sentiment="positive"
              />
              <ExamplePost
                text="We are thrilled to welcome our newest member, Cathy Frame, representing TD Bank in Wappingers Falls! We look forward to serving alongside you and making a difference together in our community."
                sentiment="positive"
              />
            </div>
          </div>

          {/* Negative */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ThumbsDown className="w-5 h-5 text-[#B85C4F]" />
              <h4 className="font-semibold text-[#B85C4F]">Negative</h4>
            </div>
            <div className="space-y-3">
              <ExamplePost
                text="TD BANK lies about mortgage discharge costs. They provide a low cost then say it 'may change though' which gives them the right to charge 120% more than initially quoted."
                sentiment="negative"
              />
              <ExamplePost
                text="@TDBank_US Americas Most INCONVENIENT Bank! Making it more difficult to deposit cash, why? Why do banks no longer like cash?"
                sentiment="negative"
              />
            </div>
          </div>

          {/* Neutral */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Minus className="w-5 h-5 text-gray-500" />
              <h4 className="font-semibold text-gray-600">Neutral</h4>
            </div>
            <div className="space-y-3">
              <ExamplePost
                text="TD Line of Credit, and TDDI can have bill pay used to transfer in funds. But not savings."
                sentiment="neutral"
              />
              <ExamplePost
                text="TD Securities raises BlackBerry target to $5 from $4 Downgrades to Hold from Buy"
                sentiment="neutral"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Examples */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <CardTitle className="text-xl text-[#8B7355]">News Headline Examples</CardTitle>
          <CardDescription>Advocacy bucket</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Positive */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ThumbsUp className="w-5 h-5 text-[#3C8825]" />
              <h4 className="font-semibold text-[#3C8825]">Positive</h4>
            </div>
            <div className="space-y-2">
              <NewsHeadline text="TD Bank awards $100,000 to MUSC Hollings Cancer Center" />
              <NewsHeadline text="J.D. Power Recognizes TD Bank's U.S. Contact Center for Outstanding Customer Service" />
              <NewsHeadline text="TD Bank Says AI Will Reduce Costs and Enhance Client Services" />
            </div>
          </div>

          {/* Negative */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ThumbsDown className="w-5 h-5 text-[#B85C4F]" />
              <h4 className="font-semibold text-[#B85C4F]">Negative</h4>
            </div>
            <div className="space-y-2">
              <NewsHeadline text="TD Bank class action accuses it of failing to honor overdraft grace policy" />
              <NewsHeadline text="Three Maine TD Bank branches set to close" />
              <NewsHeadline text="2 TD Bank branches in New Hampshire set to close" />
            </div>
          </div>

          {/* Neutral */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Minus className="w-5 h-5 text-gray-500" />
              <h4 className="font-semibold text-gray-600">Neutral</h4>
            </div>
            <div className="space-y-2">
              <NewsHeadline text="TD Bank to add ATMs filled with dog treats at 2 N.J. branches this month" />
              <NewsHeadline text="TD Bank calls staff back to office four days a week starting this fall" />
              <NewsHeadline text="Locations near the Jersey Shore will soon be closed as part of the banks restructuring" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExamplePost({ text, sentiment }: { text: string; sentiment: 'positive' | 'negative' | 'neutral' }) {
  const colors = {
    positive: 'border-l-[#3C8825] bg-[#3C8825]/5',
    negative: 'border-l-[#B85C4F] bg-[#B85C4F]/5',
    neutral: 'border-l-gray-400 bg-gray-50',
  };

  return (
    <div className={`p-3 rounded-r-lg border-l-4 ${colors[sentiment]}`}>
      <p className="text-sm text-gray-700">{text}</p>
    </div>
  );
}

function NewsHeadline({ text }: { text: string }) {
  return (
    <div className="p-2 bg-gray-50 rounded text-sm text-gray-700">
      {text}
    </div>
  );
}
