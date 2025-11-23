'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { SlidersHorizontal, TrendingUp, TrendingDown } from 'lucide-react'
import { fetchTopCoins, fetchCoinHistory, Coin } from '@/lib/api'

// Type definition for price history entry
type PriceHistoryEntry = [timestamp: number, price: number]

// Type guard to ensure the entry has exactly two numbers
const isValidPriceHistoryEntry = (entry: unknown): entry is PriceHistoryEntry => {
  return (
    Array.isArray(entry) &&
    entry.length === 2 &&
    typeof entry[0] === 'number' &&
    typeof entry[1] === 'number' &&
    !isNaN(entry[0]) &&
    !isNaN(entry[1])
  )
}

export default function PriceChart() {
  const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin')
  const [timeframe, setTimeframe] = useState<string>('7')
  const [showIndicators, setShowIndicators] = useState(false)
  const [indicators, setIndicators] = useState<{
    sma: boolean
    ema: boolean
    bollinger: boolean
  }>({
    sma: false,
    ema: false,
    bollinger: false,
  })

  const { data: coins = [], isLoading: coinsLoading, error: coinsError } = useSWR('top-coins-30', () => fetchTopCoins(30), {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  })
  const { data: priceHistory = [], isLoading: historyLoading } = useSWR(
    selectedCoin ? `${selectedCoin}-${timeframe}` : null,
    () => fetchCoinHistory(selectedCoin, parseInt(timeframe))
  )

  // Set default coin when coins load
  useEffect(() => {
    if (coins.length > 0 && (!selectedCoin || !coins.find((c: Coin) => c.id === selectedCoin))) {
      setSelectedCoin(coins[0].id)
    }
  }, [coins, selectedCoin])

  // Calculate technical indicators
  const calculateSMA = (data: number[], period: number): number[] => {
    if (data.length < period) return []
    const sma: number[] = []
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        sma.push(NaN)
      } else {
        const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
        sma.push(sum / period)
      }
    }
    return sma
  }

  const calculateEMA = (data: number[], period: number): number[] => {
    if (data.length === 0) return []
    const ema: number[] = []
    const multiplier = 2 / (period + 1)
    // Start with SMA for first value
    const initialSMA = data.slice(0, Math.min(period, data.length)).reduce((a, b) => a + b, 0) / Math.min(period, data.length)
    
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        ema.push(initialSMA)
      } else {
        ema.push((data[i] - ema[i - 1]) * multiplier + ema[i - 1])
      }
    }
    return ema
  }

  const calculateBollingerBands = (data: number[], period: number, stdDev: number = 2) => {
    if (data.length < period) return { upper: [], middle: [], lower: [] }
    const sma = calculateSMA(data, period)
    const upper: number[] = []
    const lower: number[] = []

    for (let i = 0; i < data.length; i++) {
      if (i < period - 1 || isNaN(sma[i])) {
        upper.push(NaN)
        lower.push(NaN)
      } else {
        const slice = data.slice(i - period + 1, i + 1)
        const mean = sma[i]
        const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period
        const std = Math.sqrt(variance)
        upper.push(mean + stdDev * std)
        lower.push(mean - stdDev * std)
      }
    }

    return { upper, middle: sma, lower }
  }

  // Type-safe mapping with validation and defaults
  const baseChartData = priceHistory
    .filter(isValidPriceHistoryEntry)
    .map((entry: PriceHistoryEntry) => {
      const [timestamp, price] = entry
      return {
        date: new Date(timestamp).toLocaleDateString(),
        price: price,
        timestamp: timestamp,
      }
    })

  // Extract prices for calculations
  const prices = baseChartData.map((d) => d.price)
  
  // Calculate indicators only if enabled and we have enough data
  const sma20 = indicators.sma && prices.length >= 20 ? calculateSMA(prices, 20) : []
  const ema12 = indicators.ema && prices.length >= 12 ? calculateEMA(prices, 12) : []
  const bb = indicators.bollinger && prices.length >= 20 ? calculateBollingerBands(prices, 20, 2) : null

  // Combine chart data with indicators
  const chartData = baseChartData.map((d, idx) => {
    const result: any = {
      date: d.date,
      price: d.price,
      timestamp: d.timestamp,
    }
    
    if (indicators.sma && sma20.length > idx && !isNaN(sma20[idx])) {
      result.sma20 = sma20[idx]
    }
    if (indicators.ema && ema12.length > idx && !isNaN(ema12[idx])) {
      result.ema12 = ema12[idx]
    }
    if (indicators.bollinger && bb) {
      if (bb.upper.length > idx && !isNaN(bb.upper[idx])) result.bbUpper = bb.upper[idx]
      if (bb.middle.length > idx && !isNaN(bb.middle[idx])) result.bbMiddle = bb.middle[idx]
      if (bb.lower.length > idx && !isNaN(bb.lower[idx])) result.bbLower = bb.lower[idx]
    }
    
    return result
  })

  const selectedCoinData = coins.find((c: Coin) => c.id === selectedCoin)

  if (coinsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Price Charts</h1>
          <p className="text-gray-400">Interactive price history visualization</p>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (coinsError || coins.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Price Charts</h1>
          <p className="text-gray-400">Interactive price history visualization</p>
        </div>
        <div className="card text-center py-12">
          <p className="text-gray-400 mb-2">
            {coinsError ? 'Unable to load coins' : 'No coins available'}
          </p>
          {coinsError && (
            <p className="text-sm text-gray-500">Please refresh the page to try again.</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Price Charts</h1>
        <p className="text-gray-400">Interactive price history</p>
      </div>

      {/* Coin Selector */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Coin
            </label>
            <select
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value)}
              disabled={coinsLoading || coins.length === 0}
              className="w-full px-4 py-2 bg-black/80 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed [&>option]:bg-black [&>option]:text-white"
              style={{ colorScheme: 'dark' }}
            >
              {coinsLoading ? (
                <option className="bg-black text-white">Loading coins...</option>
              ) : coins.length === 0 ? (
                <option className="bg-black text-white">No coins available</option>
              ) : (
                coins.slice(0, 50).map((coin: Coin) => (
                  <option key={coin.id} value={coin.id} className="bg-black text-white">
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Timeframe
              </label>
              <div className="flex gap-2">
                {[
                  { label: '24h', value: '1' },
                  { label: '7d', value: '7' },
                  { label: '30d', value: '30' },
                  { label: '90d', value: '90' },
                  { label: '1y', value: '365' },
                ].map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => setTimeframe(tf.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      timeframe === tf.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Technical Indicators
              </label>
              <button
                onClick={() => setShowIndicators(!showIndicators)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  showIndicators || Object.values(indicators).some(Boolean)
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <SlidersHorizontal size={20} />
                Indicators
              </button>
            </div>
          </div>
        </div>

        {selectedCoinData && (
          <div className="mb-6 p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={selectedCoinData.image}
                alt={selectedCoinData.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="text-xl font-bold">{selectedCoinData.name}</h3>
                <p className="text-gray-400 uppercase">{selectedCoinData.symbol}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-400">Current Price</div>
                <div className="text-xl font-bold">
                  ${selectedCoinData.current_price?.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">24h Change</div>
                <div
                  className={`text-xl font-bold ${
                    (selectedCoinData.price_change_percentage_24h || 0) >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {selectedCoinData.price_change_percentage_24h?.toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Market Cap</div>
                <div className="text-xl font-bold">
                  ${(selectedCoinData.market_cap / 1e9).toFixed(2)}B
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Technical Indicators Panel */}
        {showIndicators && (
          <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <SlidersHorizontal size={20} />
              Technical Indicators
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={indicators.sma}
                  onChange={(e) => setIndicators({ ...indicators, sma: e.target.checked })}
                  className="w-5 h-5 rounded bg-white/10 border-white/20 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-semibold">SMA 20</div>
                  <div className="text-xs text-gray-400">Simple Moving Average (20 periods)</div>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={indicators.ema}
                  onChange={(e) => setIndicators({ ...indicators, ema: e.target.checked })}
                  className="w-5 h-5 rounded bg-white/10 border-white/20 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-semibold">EMA 12</div>
                  <div className="text-xs text-gray-400">Exponential Moving Average (12 periods)</div>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={indicators.bollinger}
                  onChange={(e) => setIndicators({ ...indicators, bollinger: e.target.checked })}
                  className="w-5 h-5 rounded bg-white/10 border-white/20 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-semibold">Bollinger Bands</div>
                  <div className="text-xs text-gray-400">Upper, Middle, Lower Bands (20, 2)</div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="h-96">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                {/* Bollinger Bands */}
                {indicators.bollinger && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="bbUpper"
                      stroke="#F59E0B"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      dot={false}
                      name="BB Upper"
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="bbMiddle"
                      stroke="#F59E0B"
                      strokeWidth={1}
                      dot={false}
                      name="BB Middle (SMA)"
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="bbLower"
                      stroke="#F59E0B"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      dot={false}
                      name="BB Lower"
                      connectNulls
                    />
                  </>
                )}
                {/* Price Line */}
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                  name="Price (USD)"
                />
                {/* SMA */}
                {indicators.sma && (
                  <Line
                    type="monotone"
                    dataKey="sma20"
                    stroke="#10B981"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    dot={false}
                    name="SMA 20"
                    connectNulls
                  />
                )}
                {/* EMA */}
                {indicators.ema && (
                  <Line
                    type="monotone"
                    dataKey="ema12"
                    stroke="#8B5CF6"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    dot={false}
                    name="EMA 12"
                    connectNulls
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              {historyLoading ? 'Loading chart data...' : 'No chart data available for this coin/timeframe.'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

