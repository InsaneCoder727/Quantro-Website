'use client'

import { useEffect, useMemo } from 'react'
import useSWR from 'swr'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { Brain, TrendingUp, TrendingDown, AlertCircle, Meh, BarChart3, DollarSign, Globe } from 'lucide-react'

interface FearGreedData {
  value: number
  valueClassification: string
  timestamp: number
  historical?: Array<{ value: number; timestamp: number }>
  average?: number
  trend?: 'increasing' | 'decreasing'
  change?: number
}

interface MarketData {
  bitcoinDominance: number
  totalMarketCap: number
  bitcoinMarketCap: number
  marketCapChange24h: number
  activeCryptocurrencies: number
}

const fetchFearGreedIndex = async (): Promise<FearGreedData> => {
  const response = await fetch('/api/fear-greed', { cache: 'no-store' })
  if (!response.ok) {
    throw new Error('Failed to fetch Fear & Greed Index')
  }
  return response.json()
}

const fetchMarketData = async (): Promise<MarketData> => {
  const response = await fetch('/api/sentiment', { cache: 'no-store' })
  if (!response.ok) {
    return {
      bitcoinDominance: 0,
      totalMarketCap: 0,
      bitcoinMarketCap: 0,
      marketCapChange24h: 0,
      activeCryptocurrencies: 0,
    }
  }
  return response.json()
}

export default function SentimentAnalysis() {
  const { data: fearGreed, isLoading, error } = useSWR('fear-greed-index', fetchFearGreedIndex, {
    refreshInterval: 60000, // Refresh every minute
    revalidateOnFocus: true,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
  })

  const { data: marketData } = useSWR('market-sentiment', fetchMarketData, {
    refreshInterval: 300000, // Refresh every 5 minutes
  })

  const sentimentData = useMemo(() => {
    if (!fearGreed) return null

    const value = fearGreed.value
    let sentiment: {
      label: string
      color: string
      bgColor: string
      borderColor: string
      icon: typeof Brain
      description: string
    }

    if (value >= 75) {
      sentiment = {
        label: 'Extreme Greed',
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/50',
        icon: TrendingUp,
        description: 'Market shows extreme greed. Consider being cautious as prices may be overvalued.',
      }
    } else if (value >= 55) {
      sentiment = {
        label: 'Greed',
        color: 'text-green-300',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        icon: TrendingUp,
        description: 'Market sentiment is greedy. Prices may continue to rise but be cautious.',
      }
    } else if (value >= 45) {
      sentiment = {
        label: 'Neutral',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/50',
        icon: Meh,
        description: 'Market sentiment is neutral. No clear direction indicated.',
      }
    } else if (value >= 25) {
      sentiment = {
        label: 'Fear',
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/20',
        borderColor: 'border-orange-500/50',
        icon: TrendingDown,
        description: 'Market sentiment shows fear. Opportunities may exist for buying.',
      }
    } else {
      sentiment = {
        label: 'Extreme Fear',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/50',
        icon: AlertCircle,
        description: 'Market shows extreme fear. This may indicate a buying opportunity, but be careful.',
      }
    }

    return {
      value,
      classification: fearGreed.valueClassification,
      timestamp: fearGreed.timestamp,
      historical: fearGreed.historical || [],
      average: fearGreed.average || value,
      trend: fearGreed.trend || 'neutral',
      change: fearGreed.change || 0,
      ...sentiment,
    }
  }, [fearGreed])

  const chartData = useMemo(() => {
    if (!sentimentData?.historical) return []
    
    return sentimentData.historical
      .slice()
      .reverse()
      .slice(0, 30)
      .map((item: any) => ({
        date: new Date(item.timestamp * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: item.value,
        timestamp: item.timestamp,
      }))
  }, [sentimentData])


  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Brain className="text-purple-500" size={32} />
            Sentiment Analysis
          </h1>
          <p className="text-gray-400">Fear & Greed Index</p>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    )
  }

  if (error || !sentimentData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Brain className="text-purple-500" size={32} />
            Sentiment Analysis
          </h1>
          <p className="text-gray-400">Fear & Greed Index</p>
        </div>
        <div className="card text-center py-12 bg-yellow-500/10 border-yellow-500/30">
          <p className="text-yellow-400 mb-4">Unable to load sentiment data</p>
          <p className="text-sm text-gray-400">Please check your connection and try again.</p>
        </div>
      </div>
    )
  }

  const Icon = sentimentData.icon

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          <Brain className="text-purple-500" size={32} />
          Sentiment Analysis
        </h1>
        <p className="text-gray-400">Fear & Greed Index - Market sentiment indicator</p>
      </div>

      {/* Main Gauge Card */}
      <div className={`card ${sentimentData.bgColor} border-2 ${sentimentData.borderColor} animate-scale-in`}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
            <Icon className={sentimentData.color} size={28} />
            {sentimentData.label}
          </h2>
          <p className="text-gray-300 text-sm">{sentimentData.description}</p>
        </div>

        {/* Interactive Gauge Visualization */}
        <div className="relative w-full max-w-2xl mx-auto mb-8">
          <div className="relative h-64 flex items-center justify-center">
            {/* Circular Gauge */}
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 200 200"
            >
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="20"
                fill="none"
              />
              {/* Colored segments */}
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke="#ef4444"
                strokeWidth="20"
                fill="none"
                strokeDasharray={`${(25 / 100) * 502.65} 502.65`}
                strokeDashoffset="0"
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke="#f97316"
                strokeWidth="20"
                fill="none"
                strokeDasharray={`${(20 / 100) * 502.65} 502.65`}
                strokeDashoffset={-(25 / 100) * 502.65}
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke="#eab308"
                strokeWidth="20"
                fill="none"
                strokeDasharray={`${(10 / 100) * 502.65} 502.65`}
                strokeDashoffset={-(45 / 100) * 502.65}
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke="#84cc16"
                strokeWidth="20"
                fill="none"
                strokeDasharray={`${(20 / 100) * 502.65} 502.65`}
                strokeDashoffset={-(55 / 100) * 502.65}
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke="#22c55e"
                strokeWidth="20"
                fill="none"
                strokeDasharray={`${(25 / 100) * 502.65} 502.65`}
                strokeDashoffset={-(75 / 100) * 502.65}
              />
              {/* Active indicator - shows current value */}
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke={sentimentData.value >= 75 ? '#22c55e' : 
                       sentimentData.value >= 55 ? '#84cc16' : 
                       sentimentData.value >= 45 ? '#eab308' : 
                       sentimentData.value >= 25 ? '#f97316' : '#ef4444'}
                strokeWidth="24"
                fill="none"
                strokeDasharray={`${(sentimentData.value / 100) * 502.65} 502.65`}
                strokeDashoffset="0"
                style={{ transition: 'all 0.8s ease' }}
                strokeLinecap="round"
                opacity="0.9"
              />
            </svg>
            
            {/* Value Display in Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className={`text-6xl font-bold ${sentimentData.color} mb-2`}>
                {sentimentData.value}
              </div>
              <div className="text-sm text-gray-400 mb-1">Index Value</div>
              <div className={`text-lg font-semibold ${sentimentData.color}`}>
                {sentimentData.label}
              </div>
            </div>
          </div>
          
          {/* Scale Labels */}
          <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
            <div className="text-left">
              <div className="font-semibold text-red-400">0</div>
              <div>Extreme Fear</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-yellow-400">50</div>
              <div>Neutral</div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-green-400">100</div>
              <div>Extreme Greed</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="card bg-white/5">
            <div className="text-sm text-gray-400 mb-1">Classification</div>
            <div className={`text-xl font-bold ${sentimentData.color}`}>
              {sentimentData.classification}
            </div>
          </div>
          <div className="card bg-white/5">
            <div className="text-sm text-gray-400 mb-1">30-Day Average</div>
            <div className="text-xl font-bold text-gray-300">
              {sentimentData.average}
              {sentimentData.change !== undefined && (
                <span className={`text-sm ml-2 ${sentimentData.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ({sentimentData.change > 0 ? '+' : ''}{sentimentData.change})
                </span>
              )}
            </div>
          </div>
          <div className="card bg-white/5">
            <div className="text-sm text-gray-400 mb-1">Trend</div>
            <div className="text-xl font-bold flex items-center gap-2">
              {sentimentData.trend === 'increasing' ? (
                <>
                  <TrendingUp className="text-green-400" size={20} />
                  <span className="text-green-400">Increasing</span>
                </>
              ) : (
                <>
                  <TrendingDown className="text-red-400" size={20} />
                  <span className="text-red-400">Decreasing</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Chart */}
      {chartData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="text-blue-400" size={20} />
            30-Day Historical Trend
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  domain={[0, 100]}
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Additional Market Metrics */}
      {marketData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-blue-500/10 border-blue-500/30">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="text-blue-400" size={20} />
              <div className="text-sm text-gray-400">Bitcoin Dominance</div>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {marketData.bitcoinDominance.toFixed(2)}%
            </div>
            <div className="text-xs text-gray-400 mt-1">BTC market share</div>
          </div>
          
          <div className="card bg-purple-500/10 border-purple-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="text-purple-400" size={20} />
              <div className="text-sm text-gray-400">Total Market Cap</div>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              ${(marketData.totalMarketCap / 1e12).toFixed(2)}T
            </div>
            <div className={`text-xs mt-1 ${marketData.marketCapChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {marketData.marketCapChange24h >= 0 ? '+' : ''}{marketData.marketCapChange24h.toFixed(2)}% (24h)
            </div>
          </div>
          
          <div className="card bg-green-500/10 border-green-500/30">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="text-green-400" size={20} />
              <div className="text-sm text-gray-400">Active Cryptocurrencies</div>
            </div>
            <div className="text-2xl font-bold text-green-400">
              {marketData.activeCryptocurrencies.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1">Tracked assets</div>
          </div>
        </div>
      )}

      {/* Sentiment Scale Reference */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Fear & Greed Index Scale</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
            <div className="w-20 text-right text-green-400 font-semibold">75-100</div>
            <div className="flex-1">
              <div className="font-medium text-green-400">Extreme Greed</div>
              <div className="text-sm text-gray-400">Market may be overvalued</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-500/5 rounded-lg border border-green-500/20">
            <div className="w-20 text-right text-green-300 font-semibold">55-74</div>
            <div className="flex-1">
              <div className="font-medium text-green-300">Greed</div>
              <div className="text-sm text-gray-400">Bullish sentiment</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
            <div className="w-20 text-right text-yellow-400 font-semibold">45-54</div>
            <div className="flex-1">
              <div className="font-medium text-yellow-400">Neutral</div>
              <div className="text-sm text-gray-400">Balanced market</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
            <div className="w-20 text-right text-orange-400 font-semibold">25-44</div>
            <div className="flex-1">
              <div className="font-medium text-orange-400">Fear</div>
              <div className="text-sm text-gray-400">Bearish sentiment</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
            <div className="w-20 text-right text-red-400 font-semibold">0-24</div>
            <div className="flex-1">
              <div className="font-medium text-red-400">Extreme Fear</div>
              <div className="text-sm text-gray-400">Possible buying opportunity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Information Card */}
      <div className="card bg-blue-500/10 border-blue-500/30">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Brain size={20} />
          About the Fear & Greed Index
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          The Fear & Greed Index is a sentiment indicator that measures market emotions. It ranges from 0 (Extreme Fear) to 100 (Extreme Greed). 
          Extreme fear can indicate that investors are too worried, which may represent a buying opportunity. 
          Extreme greed suggests the market may be overbought. The index is calculated from various sources including volatility, market momentum, 
          social media sentiment, surveys, and Bitcoin dominance.
        </p>
      </div>
    </div>
  )
}

