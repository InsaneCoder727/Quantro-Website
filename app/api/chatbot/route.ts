import { NextRequest, NextResponse } from 'next/server'

const COINGECKO_API = 'https://api.coingecko.com/api/v3'

// Clean, simple AI response system that actually works
async function generateAIResponse(message: string, conversationHistory: Array<{ role: string; content: string }> = []): Promise<string> {
  const lowerMessage = message.toLowerCase().trim()
  const words = lowerMessage.split(/\s+/)
  
  // Simple helper - only check current message, not conversation history
  const has = (keywords: string[]): boolean => {
    return keywords.some(k => lowerMessage.includes(k))
  }
  
  // Check if it's a question
  const isQuestion = lowerMessage.includes('?') || 
                     lowerMessage.startsWith('what') || 
                     lowerMessage.startsWith('how') || 
                     lowerMessage.startsWith('why') || 
                     lowerMessage.startsWith('when') ||
                     lowerMessage.startsWith('where') ||
                     lowerMessage.startsWith('who')
  
  // Extract coin symbol from message
  const extractCoinSymbol = (): string | null => {
    const coinPatterns: Array<{ pattern: RegExp; id: string }> = [
      { pattern: /\b(bitcoin|btc)\b/i, id: 'bitcoin' },
      { pattern: /\b(ethereum|eth)\b/i, id: 'ethereum' },
      { pattern: /\b(binance|bnb)\b/i, id: 'binancecoin' },
      { pattern: /\b(solana|sol)\b/i, id: 'solana' },
      { pattern: /\b(cardano|ada)\b/i, id: 'cardano' },
      { pattern: /\b(polygon|matic)\b/i, id: 'matic-network' },
      { pattern: /\b(avalanche|avax)\b/i, id: 'avalanche-2' },
      { pattern: /\b(chainlink|link)\b/i, id: 'chainlink' },
      { pattern: /\b(polkadot|dot)\b/i, id: 'polkadot' },
      { pattern: /\b(litecoin|ltc)\b/i, id: 'litecoin' },
      { pattern: /\b(dogecoin|doge)\b/i, id: 'dogecoin' },
      { pattern: /\b(shiba|shib)\b/i, id: 'shiba-inu' },
      { pattern: /\b(uniswap|uni)\b/i, id: 'uniswap' },
      { pattern: /\b(ripple|xrp)\b/i, id: 'ripple' },
    ]
    
    for (const coin of coinPatterns) {
      if (coin.pattern.test(message)) {
        return coin.id
      }
    }
    return null
  }

  // Fetch coin data
  const fetchCoinData = async (coinId: string) => {
    try {
      const response = await fetch(`${COINGECKO_API}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`, {
        cache: 'no-store',
      })
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('Error fetching coin data:', error)
    }
    return null
  }

  // ===== PRIORITY 1: Coin Price Queries =====
  const coinSymbol = extractCoinSymbol()
  if (coinSymbol && (has(['price', 'cost', 'worth', 'value', 'current', 'now', 'today']) || isQuestion)) {
    const coinData = await fetchCoinData(coinSymbol)
    if (coinData) {
      const price = coinData.market_data?.current_price?.usd || 0
      const change24h = coinData.market_data?.price_change_percentage_24h || 0
      const marketCap = coinData.market_data?.market_cap?.usd || 0
      const volume = coinData.market_data?.total_volume?.usd || 0
      const rank = coinData.market_cap_rank || 'N/A'
      
      return `**${coinData.name} (${coinData.symbol.toUpperCase()})** - Real-time Data:

💰 **Current Price**: $${price.toLocaleString(undefined, { maximumFractionDigits: 6 })}
📊 **24h Change**: ${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}% ${change24h >= 0 ? '📈' : '📉'}
🏆 **Market Cap Rank**: #${rank}
💵 **Market Cap**: $${(marketCap / 1e9).toFixed(2)}B
📈 **24h Volume**: $${(volume / 1e6).toFixed(1)}M

${change24h > 5 ? '• Strong bullish momentum' : change24h < -5 ? '• Bearish pressure' : '• Relatively stable price action'}

Check the Charts tab for detailed technical analysis.`
    }
  }

  // ===== PRIORITY 2: Specific Topics =====
  
  // Pump & Dump Detection
  if (has(['pump', 'dump', 'manipulation', 'scam', 'scheme'])) {
    return `**Pump & Dump Detection** helps identify suspicious market activity:

**How It Works:**
• **Volume Spikes**: Detects unusual trading volume (150%+ alerts, 500%+ critical)
• **Price Surges**: Identifies rapid price increases (25%+ moderate, 50%+ high, 100%+ critical)
• **Market Cap Changes**: Monitors sudden fluctuations (25%+ suspicious)
• **Volume-to-Market-Cap Ratio**: Calculates abnormal ratios (0.3+ concerning, 0.5+ critical)
• **Small Cap Detection**: Enhanced monitoring for coins < $50M (more susceptible)

**Risk Scoring:**
- 🔴 Critical (70-100): Very high manipulation probability - avoid
- 🟠 High (50-69): Significant risk - research thoroughly
- 🟡 Medium (20-49): Moderate risk - exercise caution
- 🟢 Low (<20): Normal market activity

**Important:** System flags coins with risk scores ≥ 15 (small caps) or ≥ 20 (larger caps). Always combine with your own research - no tool is 100% accurate.

Check the "Pump & Dump" tab to see current alerts with detailed breakdowns.`
  }

  // Sentiment / Fear & Greed
  if (has(['sentiment', 'fear', 'greed', 'emotion', 'mood'])) {
    return `The **Fear & Greed Index** measures market sentiment from 0-100:

**Scale:**
• **0-24 (Extreme Fear)**: Market panic, potential oversold - contrarians might see buying opportunities
• **25-49 (Fear)**: Negative sentiment, caution advised
• **50 (Neutral)**: Balanced market sentiment
• **51-74 (Greed)**: Optimistic market, prices may be elevated
• **75-100 (Extreme Greed)**: Market euphoria, potential overbought - consider taking profits

**Trading Strategy:**
This is a contrarian indicator:
- When everyone is **greedy** → Market may be overvalued → Be cautious
- When everyone is **fearful** → Market may be oversold → Potential buying opportunity

However, extreme fear or greed can persist for extended periods. Always combine with technical analysis and never invest based on sentiment alone.

Visit the "Sentiment Analysis" tab to see the current index with interactive gauge visualization.`
  }

  // Charts / Technical Analysis
  if (has(['chart', 'graph', 'technical', 'indicator', 'sma', 'ema', 'bollinger'])) {
    return `The **Charts** feature provides interactive price history with technical indicators:

**Available Timeframes:** 24h, 7d, 30d, 90d, 1y

**Technical Indicators:**
1. **SMA 20**: Simple Moving Average - average price over 20 periods (smooths volatility)
2. **EMA 12**: Exponential Moving Average - gives more weight to recent prices (more responsive)
3. **Bollinger Bands**: Upper/Middle/Lower bands showing volatility (middle = SMA 20)

**How to Use:**
- Price above SMA = uptrend, below = downtrend
- EMA provides faster signals for trend changes
- Price touching upper Bollinger Band = overbought, lower = oversold

**Trading Tips:**
- Combine multiple indicators for confirmation
- Use longer timeframes (daily/weekly) for major trends
- Volume is crucial - high volume confirms trends
- No indicator is perfect - always use stop-losses

Toggle these indicators on/off in the Charts tab to customize your analysis.`
  }

  // Portfolio
  if (has(['portfolio', 'holding', 'investment', 'asset', 'balance'])) {
    return `The **Portfolio** feature tracks your cryptocurrency investments:

**Adding Holdings:**
1. Click "Add Holding"
2. Select the cryptocurrency
3. Enter amount and buy price
4. Save - automatically tracked!

**Features:**
• Real-time valuation vs cost basis
• Profit/Loss tracking with visual indicators
• Performance charts and analytics
• Asset allocation visualization (pie chart)
• Export data as CSV for tax purposes

**Best Practices:**
- Regularly update holdings for accurate performance tracking
- Use allocation view to ensure diversification
- Export data quarterly for tax reporting
- Review top gainers/losers to identify what's working

Access the Portfolio tab to manage your investments.`
  }

  // Price Alerts
  if (has(['alert', 'notification', 'reminder'])) {
    return `**Price Alerts** notify you when cryptocurrencies reach specific levels:

**How to Set Up:**
1. Go to "Price Alerts" tab
2. Click "Create Alert"
3. Select coin and alert type:
   - Price reaches above a value
   - Price reaches below a value
   - 24h change % exceeds threshold
4. Enter target price/percentage
5. Save - alert is now active

**Pro Tips:**
- Set multiple alerts for different price points (support/resistance levels)
- Use percentage-based alerts for volatile coins
- Check "Active Alerts" to manage notifications
- Alerts trigger automatically when conditions are met

Never miss important market movements, even when you're away!`
  }

  // Heatmap
  if (has(['heatmap', 'visual', 'grid', 'color'])) {
    return `The **Market Heatmap** is a visual tool showing cryptocurrency performance:

**How to Read:**
• 🟢 **Green**: Positive 24h performance (darker = bigger gains)
• 🔴 **Red**: Negative 24h performance (darker = bigger losses)
• **Intensity**: Color saturation indicates magnitude of price change
• **Grid Layout**: Easy comparison across multiple coins

**Use Cases:**
- Quickly identify which sectors are performing well
- Spot market-wide trends (bullish vs bearish)
- Find coins with extreme price movements
- Compare relative performance across the market

Hover over any coin in the heatmap to see detailed information including price, market cap, and volume.`
  }

  // Bitcoin
  if (has(['bitcoin', 'btc']) && !has(['price', 'cost', 'worth', 'value'])) {
    const btcData = await fetchCoinData('bitcoin')
    if (btcData) {
      const price = btcData.market_data?.current_price?.usd || 0
      const change24h = btcData.market_data?.price_change_percentage_24h || 0
      
      return `**Bitcoin (BTC)** - The Digital Gold

💰 **Current Price**: $${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
📊 **24h Change**: ${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%

**Key Characteristics:**
• First cryptocurrency created in 2009
• Limited supply: Maximum 21 million coins (scarcity)
• Store of value: Digital alternative to gold
• Decentralized: No central authority controls it
• Market leader: Largest market cap, highest liquidity

**Why Bitcoin Matters:**
- Often influences the entire crypto market (when BTC moves, alts usually follow)
- Most recognized and accepted cryptocurrency
- Considered the "safest" crypto investment (relative term - still volatile)
- Institutional adoption increasing

Bitcoin is the benchmark for crypto markets. Many investors use BTC as a portfolio foundation before adding riskier altcoins.`
    }
    return `Bitcoin (BTC) is the first and largest cryptocurrency, often called "digital gold". It has a limited supply of 21 million coins and is considered a store of value. Bitcoin often influences the broader crypto market and is seen as the safest crypto investment (though still very volatile).`
  }

  // Ethereum
  if (has(['ethereum', 'eth']) && !has(['price', 'cost', 'worth', 'value'])) {
    const ethData = await fetchCoinData('ethereum')
    if (ethData) {
      const price = ethData.market_data?.current_price?.usd || 0
      const change24h = ethData.market_data?.price_change_percentage_24h || 0
      
      return `**Ethereum (ETH)** - The Programmable Blockchain

💰 **Current Price**: $${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
📊 **24h Change**: ${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%

**Key Features:**
• Smart Contracts: Self-executing code on blockchain
• dApps Platform: Supports decentralized applications
• DeFi Hub: Powers most decentralized finance protocols
• NFT Origin: Where most non-fungible tokens are created
• Proof of Stake: Energy-efficient consensus (after The Merge)

**Why Ethereum Matters:**
- More than currency - it's infrastructure for Web3
- Largest ecosystem of developers and projects
- Most DeFi protocols built on Ethereum
- Often moves independently from Bitcoin (diversification)

Unlike Bitcoin, Ethereum is programmable - developers build applications on it. This makes ETH more than currency - it's infrastructure for Web3.`
    }
    return `Ethereum (ETH) is the second-largest cryptocurrency and a decentralized computing platform. It supports smart contracts, dApps, DeFi, and NFTs. Unlike Bitcoin, Ethereum is programmable - developers build applications on it, making it infrastructure for Web3.`
  }

  // Trading / Buy / Sell
  if (has(['trade', 'buy', 'sell', 'when', 'timing', 'entry', 'exit'])) {
    return `**Trading Strategies & Timing:**

While I can't give specific trading advice, here are general principles:

**Entry Strategies:**
• **Dollar-Cost Averaging (DCA)**: Invest fixed amounts regularly (reduces timing risk)
• **Technical Entry Points**: Buy at support levels, enter on breakouts above resistance
• **Sentiment-Based**: Extreme Fear (0-24) = potential buying opportunity, Extreme Greed (75-100) = consider taking profits

**Exit Strategies:**
• **Take Profit Levels**: Set predetermined targets (e.g., +20%, +50%)
• **Stop-Loss Orders**: Always use stop-losses (e.g., -10% from entry)
• **Technical Exits**: Sell at resistance levels, exit on breakdowns below support

**Risk Management:**
- Never invest more than you can afford to lose
- Use Quantro's tools: Charts for technical analysis, Sentiment Analysis for market mood, Pump & Dump detection to avoid scams
- Develop a strategy and stick to it
- Never trade emotionally

Remember: Time in the market often beats timing the market. Focus on strategy over perfect timing.`
  }

  // Risk / Safe / Dangerous
  if (has(['risk', 'safe', 'dangerous', 'volatile', 'volatility'])) {
    return `**Cryptocurrency Risks:**

**Main Risks:**
• **High Volatility**: Prices can swing 10%+ in hours
• **Market Manipulation**: Pump & dump schemes are common
• **Regulatory Uncertainty**: Government regulations can impact prices
• **Technology Risks**: Hacks, bugs, or network issues
• **Liquidity Risk**: Some coins have low trading volume

**Risk Management:**
• Use Quantro's Pump & Dump detection to identify scams
• Diversify across multiple cryptocurrencies
• Only invest what you can afford to lose
• Use stop-loss orders to limit downside
• Stay informed via news and sentiment analysis

**Volatility Levels:**
- **Low (<5% daily)**: Stablecoins, large caps (BTC, ETH)
- **Medium (5-15% daily)**: Mid-cap coins
- **High (15-30% daily)**: Small caps, new projects
- **Extreme (30%+ daily)**: Micro caps, meme coins, manipulation

Always remember: Cryptocurrencies are highly speculative. Past performance doesn't guarantee future results.`
  }

  // Help / What Can You Do
  if (has(['help', 'what can', 'capabilities', 'assist'])) {
    return `I'm your **Quantro AI Assistant**! I can help with:

**Platform Features:**
• Explain any dashboard feature in detail
• Guide you through setting up alerts, portfolios, watchlists
• Help interpret charts and technical indicators
• Explain risk scores and market analysis tools

**Market Knowledge:**
• Cryptocurrency basics and concepts (Bitcoin, Ethereum, DeFi, NFTs)
• Trading strategies and best practices
• Market analysis and sentiment interpretation
• Risk management principles

**Ask me:**
- "What's the price of Bitcoin?" (I'll fetch real-time data!)
- "How does pump & dump detection work?"
- "Explain the Fear & Greed Index"
- "How do I set price alerts?"
- "What are the risks of cryptocurrency?"

I provide educational information only. Always do your own research before making investment decisions.`
  }

  // Greetings
  if (has(['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'sup'])) {
    return `Hello! 👋 I'm the **Quantro AI Assistant** - your intelligent crypto trading companion!

I'm here to help you:
• **Navigate Quantro**: Explain any feature, tool, or dashboard element
• **Understand Markets**: Cryptocurrency concepts, trends, and analysis
• **Trading Guidance**: Strategies, risk management, and best practices
• **Real-time Data**: Current prices, market trends, and performance metrics

**Try asking:**
- "What's the price of Bitcoin?" (I'll fetch real-time data!)
- "How does pump & dump detection work?"
- "Explain the Fear & Greed Index"
- "What are the risks of crypto?"

Ask me anything about crypto or the Quantro platform!`
  }

  // Default response - only if nothing else matches
  if (isQuestion) {
    return `I understand you're asking: "${message}"

I can help with:
• **Real-Time Prices**: Ask "What's the price of [coin]?"
• **Platform Features**: "How does [feature] work?"
• **Trading Strategies**: "When should I buy/sell?"
• **Market Analysis**: "Explain [concept]"
• **Risk Assessment**: "What are the risks?"

Be more specific and I'll provide a detailed answer! For example:
- "What's the price of Bitcoin?"
- "How does pump & dump detection work?"
- "Explain the Fear & Greed Index"`
  }
  
  return `I'm here to help! I can answer questions about:
• Cryptocurrency prices and market data
• Quantro platform features (Charts, Portfolio, Alerts, etc.)
• Trading strategies and risk management
• Market analysis and sentiment
• Bitcoin, Ethereum, and other cryptocurrencies

Try asking: "What's the price of Bitcoin?" or "How does pump & dump detection work?"`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversationHistory = [] } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Validate conversation history (not used for matching, but kept for future use)
    const validHistory = Array.isArray(conversationHistory) 
      ? conversationHistory.filter(msg => 
          msg && 
          typeof msg === 'object' && 
          (msg.role === 'user' || msg.role === 'assistant') &&
          typeof msg.content === 'string'
        ).slice(-10)
      : []

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 700))

    const response = await generateAIResponse(message, validHistory)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
