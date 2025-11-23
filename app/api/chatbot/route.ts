import { NextRequest, NextResponse } from 'next/server'

// Enhanced AI response system with better pattern matching and context understanding
function generateAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase().trim()
  const words = lowerMessage.split(/\s+/)
  const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'explain', 'tell me', 'describe']
  const isQuestion = questionWords.some(word => lowerMessage.startsWith(word) || lowerMessage.includes('?'))
  
  // Context understanding helpers
  const hasContext = (keywords: string[]) => keywords.some(k => lowerMessage.includes(k))
  const getMainTopic = () => {
    const topics = [
      { keywords: ['pump', 'dump', 'manipulation', 'scam'], name: 'pump_dump' },
      { keywords: ['heatmap', 'visual', 'grid', 'color'], name: 'heatmap' },
      { keywords: ['sentiment', 'fear', 'greed', 'emotion', 'mood'], name: 'sentiment' },
      { keywords: ['alert', 'notification', 'reminder'], name: 'alerts' },
      { keywords: ['portfolio', 'holding', 'investment', 'asset', 'balance'], name: 'portfolio' },
      { keywords: ['chart', 'graph', 'price', 'technical', 'indicator', 'trend'], name: 'charts' },
      { keywords: ['watchlist', 'favorite', 'follow', 'monitor'], name: 'watchlist' },
      { keywords: ['screener', 'filter', 'search', 'find'], name: 'screener' },
      { keywords: ['bitcoin', 'btc'], name: 'bitcoin' },
      { keywords: ['ethereum', 'eth'], name: 'ethereum' },
      { keywords: ['altcoin', 'alt', 'alternative'], name: 'altcoins' },
      { keywords: ['defi', 'decentralized finance'], name: 'defi' },
      { keywords: ['nft', 'non-fungible'], name: 'nft' },
      { keywords: ['market', 'trading', 'trade', 'buy', 'sell'], name: 'trading' },
      { keywords: ['risk', 'safe', 'dangerous', 'volatile'], name: 'risk' },
      { keywords: ['profit', 'gain', 'loss', 'money', 'earn'], name: 'profit' },
      { keywords: ['compare', 'comparison', 'versus', 'vs'], name: 'comparison' },
      { keywords: ['calendar', 'event', 'upcoming', 'schedule'], name: 'calendar' },
      { keywords: ['news', 'update', 'latest', 'recent'], name: 'news' },
      { keywords: ['settings', 'preference', 'configure', 'setup'], name: 'settings' },
    ]
    
    for (const topic of topics) {
      if (hasContext(topic.keywords)) {
        return topic.name
      }
    }
    return null
  }

  const topic = getMainTopic()

  // Pump & Dump Detection
  if (topic === 'pump_dump' || hasContext(['pump', 'dump', 'manipulation'])) {
    if (isQuestion && (hasContext(['work', 'detect', 'find', 'identify']) || lowerMessage.includes('?'))) {
      return `Our Pump & Dump detection system uses advanced algorithms to identify suspicious market patterns in real-time:

**Key Indicators Analyzed:**
• **Volume Spikes**: Detects unusual trading volume increases (often 200%+ in 24h)
• **Price Surges**: Identifies rapid, unnatural price increases (typically 50%+)
• **Market Cap Changes**: Monitors sudden market cap fluctuations
• **Volume-to-Market-Cap Ratio**: Calculates abnormal ratios suggesting manipulation

**Risk Scoring:**
- 🔴 **Critical (80-100)**: Very high manipulation probability
- 🟠 **High (60-79)**: Significant manipulation risk
- 🟡 **Medium (40-59)**: Moderate risk, exercise caution

The system continuously monitors top cryptocurrencies and alerts you to potential pump & dump schemes before you invest. Always combine this with your own research - no tool is 100% accurate.`
    }
    return `Pump & dump detection identifies suspicious market activity patterns by analyzing volume spikes, price surges, and market cap changes. Check the "Pump & Dump" tab in the sidebar to see current alerts and risk scores for various cryptocurrencies.`
  }

  // Market Heatmap
  if (topic === 'heatmap' || hasContext(['heatmap', 'visual representation'])) {
    return `The Market Heatmap is a powerful visual tool that shows cryptocurrency performance at a glance:

**How to Read:**
• 🟢 **Green Colors**: Positive 24h performance (darker = bigger gains)
• 🔴 **Red Colors**: Negative 24h performance (darker = bigger losses)
• **Intensity**: Color saturation indicates the magnitude of price change
• **Grid Layout**: Easy comparison across multiple coins simultaneously

**Use Cases:**
- Quickly identify which sectors are performing well
- Spot market-wide trends (bullish vs bearish)
- Find coins with extreme price movements
- Compare relative performance across the market

Hover over any coin in the heatmap to see detailed information including price, market cap, and volume. This is especially useful for identifying market momentum and spotting opportunities or risks.`
  }

  // Fear & Greed Index / Sentiment
  if (topic === 'sentiment' || hasContext(['fear', 'greed', 'sentiment', 'emotion'])) {
    if (hasContext(['read', 'understand', 'interpret', 'meaning'])) {
      return `The Fear & Greed Index is a contrarian indicator that measures market sentiment:

**Scale Breakdown:**
• **0-24 (Extreme Fear)**: Market panic, potential oversold conditions - contrarians might see buying opportunities
• **25-49 (Fear)**: Negative sentiment, caution advised
• **50 (Neutral)**: Balanced market sentiment
• **51-74 (Greed)**: Optimistic market, prices may be elevated
• **75-100 (Extreme Greed)**: Market euphoria, potential overbought - consider taking profits

**Trading Strategy:**
This is a contrarian indicator, meaning:
- When everyone is **greedy** → Market may be overvalued → Consider being cautious
- When everyone is **fearful** → Market may be oversold → Potential buying opportunity

However, extreme fear or greed can persist for extended periods. Always combine this with technical analysis and never invest based on sentiment alone.`
    }
    return `The Fear & Greed Index measures market sentiment from 0-100. Low values (0-49) indicate fear/oversold conditions, while high values (51-100) indicate greed/overbought conditions. Visit the "Sentiment Analysis" tab to see the current index and interactive gauge visualization.`
  }

  // Price Alerts
  if (topic === 'alerts' || hasContext(['alert', 'notification', 'remind'])) {
    if (hasContext(['set', 'create', 'add', 'make', 'how'])) {
      return `Setting up price alerts is simple:

**Step-by-Step:**
1. Go to the **"Price Alerts"** tab in the sidebar
2. Click **"Create Alert"** button
3. **Select Coin**: Choose from the dropdown
4. **Alert Type**: 
   - Price reaches above a value
   - Price reaches below a value
   - 24h change % exceeds threshold
5. **Set Target**: Enter your target price or percentage
6. **Save**: Your alert is now active

**Pro Tips:**
- Set multiple alerts for different price points (support/resistance levels)
- Use percentage-based alerts for volatile coins
- Check "Active Alerts" to manage existing notifications
- Alerts trigger automatically when conditions are met

Price alerts help you never miss important market movements, even when you're away from your dashboard.`
    }
    return `Price alerts notify you when cryptocurrencies reach specific price levels or percentage changes. Go to the "Price Alerts" tab to create and manage your alerts. You can set alerts for price thresholds or percentage changes over 24 hours.`
  }

  // Portfolio
  if (topic === 'portfolio' || hasContext(['portfolio', 'holding', 'investment'])) {
    if (hasContext(['add', 'track', 'manage', 'how'])) {
      return `The Portfolio feature helps you track all your cryptocurrency investments:

**Adding Holdings:**
1. Click **"Add Holding"** button
2. Select the cryptocurrency
3. Enter the amount you own
4. Enter your buy price (average if multiple purchases)
5. Save - it's automatically tracked!

**Features Available:**
• **Real-time Valuation**: See current value vs your cost basis
• **Profit/Loss Tracking**: Visual indicators for gains and losses
• **Analytics Tab**: Performance charts, top gainers/losers
• **Allocation View**: Pie chart showing asset distribution
• **Export Data**: Download CSV for tax purposes

**Best Practices:**
- Regularly update holdings to track accurate performance
- Use allocation view to ensure diversification
- Export data quarterly for tax reporting
- Review top gainers/losers to identify what's working`

    }
    return `The Portfolio feature tracks your cryptocurrency investments, showing real-time value, profit/loss, and performance analytics. Add holdings with their purchase prices to monitor your investments. Access detailed analytics including charts and asset allocation visualization.`
  }

  // Charts & Technical Analysis
  if (topic === 'charts' || hasContext(['chart', 'graph', 'technical', 'indicator'])) {
    if (hasContext(['indicator', 'sma', 'ema', 'bollinger', 'technical'])) {
      return `Technical indicators help analyze price trends and potential entry/exit points:

**Available Indicators:**

1. **SMA 20 (Simple Moving Average)**
   - Average price over last 20 periods
   - Smooths out price volatility
   - Use: Price above SMA = uptrend, below = downtrend

2. **EMA 12 (Exponential Moving Average)**
   - Gives more weight to recent prices
   - More responsive than SMA
   - Use: Faster signal for trend changes

3. **Bollinger Bands**
   - Upper/Middle/Lower bands showing volatility
   - Middle = SMA 20
   - Use: Price touching upper band = overbought, lower band = oversold

**Trading Tips:**
- Combine multiple indicators for confirmation
- No indicator is perfect - use with other analysis
- Past performance doesn't guarantee future results
- Always use stop-loss orders

Toggle these indicators on/off in the Charts tab to customize your analysis.`
    }
    return `The Charts feature provides interactive price history with multiple timeframes (24h, 7d, 30d, 90d, 1y) and technical indicators (SMA, EMA, Bollinger Bands). Use it to analyze trends, identify support/resistance levels, and make informed trading decisions.`
  }

  // Watchlist
  if (topic === 'watchlist' || hasContext(['watchlist', 'favorite'])) {
    if (hasContext(['group', 'organize', 'categorize'])) {
      return `Watchlist Groups help you organize cryptocurrencies by category:

**Creating Groups:**
1. Click **"New Group"** button
2. Enter a name (e.g., "DeFi", "Layer 1", "Meme Coins")
3. Groups appear in the sidebar

**Managing Coins:**
- Add coins to groups when adding to watchlist
- Move coins between groups using dropdown
- Use "Uncategorized" for coins not in any group
- View "All Coins" to see everything at once

**Organization Ideas:**
- By sector (DeFi, Gaming, NFTs)
- By strategy (Hold, Trade, Research)
- By market cap (Large, Mid, Small)
- By performance (Winners, Losers, Watching)

This organization makes it easier to track different segments of the market and manage your research.`
    }
    return `The Watchlist lets you monitor favorite cryptocurrencies with real-time data. Create groups to organize coins by category (DeFi, Layer 1, etc.) for better management. Each coin shows price, 24h change, market cap, and volume updates.`
  }

  // Coin Screener
  if (topic === 'screener' || hasContext(['screener', 'filter', 'search'])) {
    return `The Coin Screener helps you discover cryptocurrencies matching your criteria:

**Filter Options:**
- **Market Cap**: Filter by size (small, mid, large cap)
- **Volume**: Find high/low liquidity coins
- **Price Change**: Identify gainers or decliners
- **Price Range**: Target specific price points

**Use Cases:**
- Find coins with high 24h volume (potential momentum)
- Discover coins under $1 with growth potential
- Screen for coins with specific market cap ranges
- Identify coins with extreme price movements

**Tips:**
- Combine filters for precise results
- Export filtered lists as CSV
- Sort by any metric to find top performers
- Use for research before investing

The screener searches across 250+ cryptocurrencies, giving you powerful discovery tools beyond just browsing the top coins.`
  }

  // Bitcoin
  if (topic === 'bitcoin' || hasContext(['bitcoin', 'btc'])) {
    return `Bitcoin (BTC) is the first and largest cryptocurrency, often called "digital gold":

**Key Characteristics:**
• **Market Leader**: Largest market cap, highest liquidity
• **Limited Supply**: Maximum 21 million coins (scarcity)
• **Store of Value**: Digital alternative to gold
• **Blockchain**: Decentralized, transparent ledger
• **Proof of Work**: Mining-based consensus mechanism

**Current Data:**
Check the Market Overview or Charts tab to see Bitcoin's current price, 24h change, market dominance, and historical trends. Bitcoin often influences the broader crypto market, making it an important benchmark to watch.

**Investment Perspective:**
Bitcoin is considered the safest crypto investment due to its size and adoption, but it's still highly volatile compared to traditional assets.`
  }

  // Ethereum
  if (topic === 'ethereum' || hasContext(['ethereum', 'eth'])) {
    return `Ethereum (ETH) is the second-largest cryptocurrency and a decentralized computing platform:

**Key Features:**
• **Smart Contracts**: Self-executing code on blockchain
• **dApps**: Supports decentralized applications
• **DeFi**: Powers decentralized finance ecosystem
• **NFTs**: Origin of most non-fungible tokens
• **Proof of Stake**: Energy-efficient consensus (after The Merge)

**Platform Capabilities:**
Unlike Bitcoin, Ethereum is programmable - developers build applications on it. This makes ETH more than currency - it's infrastructure for Web3.

**Current Data:**
View Ethereum's price, trends, and comparison with other coins in the Market Overview or Coin Comparison features. ETH often moves differently from BTC, offering diversification.`
  }

  // Trading Questions
  if (topic === 'trading' || hasContext(['trade', 'buy', 'sell', 'when'])) {
    if (hasContext(['when', 'should', 'time', 'best'])) {
      return `While I can't give specific trading advice, here are general principles:

**Timing Considerations:**
• **Use Technical Analysis**: Check charts for support/resistance levels
• **Watch Sentiment**: Extreme fear can signal opportunities, extreme greed suggests caution
• **Volume Analysis**: High volume confirms trends
• **Market Conditions**: Bull markets favor buying, bear markets favor caution

**Risk Management:**
- Never invest more than you can afford to lose
- Use dollar-cost averaging to reduce timing risk
- Set stop-loss orders to limit downside
- Take profits at predetermined targets

**Tools to Use:**
- Charts for technical analysis
- Fear & Greed Index for sentiment
- Pump & Dump detection to avoid scams
- News feed for market events

Remember: No one can predict the market perfectly. Develop a strategy, stick to it, and never trade emotionally.`
    }
    return `For trading guidance, use Quantro's tools: Charts for technical analysis, Sentiment Analysis for market mood, Pump & Dump detection to avoid scams, and News Feed for market events. Always do your own research and never invest more than you can afford to lose.`
  }

  // Risk Questions
  if (topic === 'risk' || hasContext(['risk', 'safe', 'dangerous', 'volatile'])) {
    return `Cryptocurrency investing carries significant risks:

**Main Risks:**
• **High Volatility**: Prices can swing 10%+ in hours
• **Market Manipulation**: Pump & dump schemes are common
• **Regulatory Uncertainty**: Government regulations can impact prices
• **Technology Risks**: Hacks, bugs, or network issues
• **Liquidity Risk**: Some coins have low trading volume

**Risk Management:**
• Use our Pump & Dump detection to identify scams
• Diversify across multiple cryptocurrencies
• Only invest what you can afford to lose
• Use stop-loss orders to limit downside
• Stay informed via news and sentiment analysis

**Quantro's Protection:**
- Real-time risk scoring
- Market manipulation detection
- Sentiment analysis warnings
- Comprehensive research tools

Always remember: Cryptocurrencies are highly speculative. Past performance doesn't guarantee future results.`
  }

  // Profit/Investment Questions
  if (topic === 'profit' || hasContext(['profit', 'gain', 'earn', 'money', 'make'])) {
    return `While I can't guarantee profits, here are strategies successful traders use:

**Investment Strategies:**
• **Long-term Holding (HODL)**: Buy and hold quality projects
• **Dollar-Cost Averaging**: Invest fixed amounts regularly
• **Technical Trading**: Use charts and indicators for entry/exit
• **Diversification**: Spread investments across multiple coins

**Tools That Help:**
- Portfolio tracker to monitor gains/losses
- Charts to identify trends and patterns
- Screener to find opportunities
- Alerts to catch price movements

**Important Reminders:**
- Most traders lose money - be realistic
- High returns = high risk
- Never invest based on FOMO (fear of missing out)
- Use Quantro's tools to make informed decisions
- Consult with financial advisors for major decisions

Cryptocurrency investing is risky - only invest what you can afford to lose completely.`
  }

  // Comparison Questions
  if (topic === 'comparison' || hasContext(['compare', 'versus', 'vs', 'better'])) {
    return `Use the Coin Comparison feature to analyze cryptocurrencies side-by-side:

**How to Compare:**
1. Go to **"Coin Comparison"** tab
2. Select up to 4 coins from dropdowns
3. View side-by-side metrics:
   - Price and 24h change
   - Market cap and volume
   - Price change percentages
   - Performance summary

**What to Compare:**
- Performance metrics (which gained more?)
- Market cap (which is larger?)
- Volume (which has more liquidity?)
- Price trends (which is trending better?)

**Comparison Use Cases:**
- Compare similar projects (e.g., Layer 1 blockchains)
- Evaluate competitors in a sector
- Choose between investment options
- Analyze portfolio diversification

This helps you make informed decisions by seeing all relevant data in one place.`
  }

  // Calendar Questions
  if (topic === 'calendar' || hasContext(['calendar', 'event', 'upcoming'])) {
    return `The Market Calendar tracks important cryptocurrency events:

**Event Types:**
• **Token Unlocks**: Large amounts of tokens releasing (can impact price)
• **Exchange Listings**: Coins added to major exchanges
• **Delistings**: Coins removed from exchanges
• **Protocol Updates**: Major blockchain upgrades
• **Market Events**: Economic events affecting crypto

**How to Use:**
- Navigate by month to see upcoming events
- Filter by event type or impact level
- Plan trades around major events
- Stay informed about token unlocks (often cause price drops)

**Why It Matters:**
Major events like token unlocks or listings can significantly impact prices. The calendar helps you prepare for these events and make informed trading decisions.

Access the Market Calendar from the sidebar to see what's coming up.`
  }

  // General Help/What Can You Do
  if (hasContext(['help', 'what can', 'capabilities', 'assist']) || isQuestion && !topic) {
    return `I'm your Quantro AI Assistant! I can help with:

**Platform Features:**
• Explain any dashboard feature in detail
• Guide you through setting up alerts, portfolios, watchlists
• Help interpret charts and technical indicators
• Explain risk scores and market analysis tools

**Market Knowledge:**
• Cryptocurrency basics and concepts
• Trading strategies and best practices
• Market analysis and sentiment interpretation
• Risk management principles

**General Questions:**
• Ask about specific coins (Bitcoin, Ethereum, etc.)
• Get help with platform navigation
• Understand market terminology
• Learn about DeFi, NFTs, and crypto trends

**How to Use:**
Just ask me anything! I can answer questions about:
- "How does [feature] work?"
- "What is [cryptocurrency]?"
- "Explain [concept]"
- "How do I [action]?"

Remember: I provide educational information only. Always do your own research before making investment decisions.`
  }

  // Greetings
  if (hasContext(['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon'])) {
    return `Hello! I'm the Quantro AI Assistant. I'm here to help you navigate the platform, understand cryptocurrency markets, and make informed trading decisions.

You can ask me about:
• Any Quantro feature or tool
• Cryptocurrency concepts and terms
• Trading strategies and risk management
• Market analysis and indicators

What would you like to know? Feel free to ask me anything about crypto or the Quantro platform!`
  }

  // Default intelligent response
  return `I understand you're asking about "${message}". 

Let me help you - I specialize in:
• **Quantro Platform**: Explaining features, navigation, and tools
• **Cryptocurrency Markets**: Analysis, trends, and concepts  
• **Trading Guidance**: Strategies, risk management, and best practices
• **Market Data**: Interpreting charts, indicators, and metrics

To give you a better answer, could you:
- Be more specific about what you'd like to know?
- Ask about a particular feature (Pump & Dump, Charts, Portfolio, etc.)?
- Request information about a specific cryptocurrency?
- Ask "How do I..." questions about using Quantro?

For example, try:
- "How does pump & dump detection work?"
- "Explain the Fear & Greed Index"
- "What is Bitcoin?"
- "How do I set price alerts?"

I'm here to help you succeed in the crypto market!`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Simulate AI processing delay for realism
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

    const response = generateAIResponse(message)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
