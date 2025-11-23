'use client'

import { useState } from 'react'
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

  const { data: coins = [] } = useSWR('top-coins', fetchTopCoins)
  const { data: priceHistory = [] } = useSWR(
    selectedCoin ? `${selectedCoin}-${timeframe}` : null,
    () => fetchCoinHistory(selectedCoin, parseInt(timeframe))
  )

  const chartData = priceHistory.map(([timestamp, price]: [number, number]) => ({
    date: new Date(timestamp).toLocaleDateString(),
    price: price,
  }))

  const selectedCoinData = coins.find((c: Coin) => c.id === selectedCoin)

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
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {coins.slice(0, 20).map((coin: Coin) => (
                <option key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol.toUpperCase()})
                </option>
              ))}
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

