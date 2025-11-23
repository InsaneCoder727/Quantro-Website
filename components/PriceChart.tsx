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
import { fetchTopCoins, fetchCoinHistory, Coin } from '@/lib/api'

export default function PriceChart() {
  const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin')
  const [timeframe, setTimeframe] = useState<string>('7')

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

  const chartData = priceHistory.map(([timestamp, price]: [number, number]) => ({
    date: new Date(timestamp).toLocaleDateString(),
    price: price,
  }))

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
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                  name="Price (USD)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Loading chart data...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

